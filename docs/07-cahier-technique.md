# Cahier des Charges Technique — Agence Pro

**Version :** 1.0
**Date :** 24 Juillet 2026
**Statut :** Draft pour revue
**Prérequis :** 06-NORMALISATION.md validé
**Synthèse multi-modèles :** Nemotron (architecture) + GLM-5.2 (API/Zod) + North Mini (devops/tests) + JARVIS (design)

> Ce document complète la 06-NORMALISATION.md (source de vérité pour les données).
> Il définit comment le système est construit : architecture, API, composants UI, déploiement, tests.

---

# CAHIER TECHNIQUE — AGENCE PRO
## Section 4 : Architecture Système Détaillée (Version 1.0)

> **Contexte** : SaaS B2B pour agences de voyage. Multi-tenant strict (isolation données par `agencyId`), paiements (Stripe), communications multi-canaux (Email/SMS/WhatsApp), conformité RGPD/PCI-DSS.
> **Stack Core** : Next.js 15.1+ (App Router, RSC, Server Actions), Prisma ORM 5.14+, PostgreSQL 16 (Supabase), Redis (Upstash), Vercel (Edge + Node.js Runtime), Tailwind CSS, TypeScript 5.4+ (strict mode).

---

### 1. Architecture Applicative Complète (Diagramme Composants)

```mermaid
graph TD
    subgraph "Client Layer"
        Browser[Next.js Client Components]
        Mobile[React Native / PWA]
    end

    subgraph "Edge Layer (Vercel Edge Network)"
        EdgeMiddleware[Edge Middleware<br/>auth.ts, ratelimit.ts, i18n.ts]
        EdgeConfig[Edge Config<br/>Feature Flags, Redirects]
    end

    subgraph "Application Layer (Node.js Runtime - Vercel)"
        RSC[React Server Components<br/>Layouts, Pages, Data Fetching]
        ServerActions[Server Actions<br/>Mutations, Forms, Webhooks]
        APIRoutes[API Routes (REST/RPC)<br/>/api/v1/*, Webhooks Stripe/Twilio/Meta]
        AuthLib[Auth Library<br/>NextAuth v5 / Lucia v3 Adapter]
        RBACLib[RBAC Engine<br/>Casbin / Custom Policy Engine]
        PrismaClient[Prisma Client<br/>Connection Pooling (PgBouncer)]
    end

    subgraph "Data Layer (Supabase / Managed PG)"
        PrimaryDB[(PostgreSQL Primary<br/>Prisma Schema)]
        Replicas[(Read Replicas<br/>Analytics/Reporting)]
        PgBouncer[PgBouncer<br/>Transaction Pooling]
        BlobStorage[Supabase Storage<br/>Documents, Contracts, Photos]
    end

    subgraph "Cache & Queue Layer (Upstash)"
        RedisCache[(Upstash Redis<br/>Cache, Sessions, Rate Limit)]
        RedisQueue[(Upstash QStash<br/>Job Queue: Email, SMS, WA, PDF, Sync)]
    end

    subgraph "External Services"
        Stripe[Stripe API<br/>Payments, Billing Portal]
        Twilio[Twilio API<br/>SMS, WhatsApp, Voice]
        Resend[Resend / SendGrid<br/>Transactional Email]
        MetaWA[Meta Cloud API<br/>WhatsApp Business]
        Sentry[Sentry.io<br/>Error Tracking, Performance]
        VercelObs[Vercel Observability<br/>Web Vitals, Logs]
    end

    Browser --> EdgeMiddleware
    Mobile --> EdgeMiddleware
    EdgeMiddleware --> RSC
    EdgeMiddleware --> APIRoutes
    EdgeMiddleware --> ServerActions
    RSC --> PrismaClient
    ServerActions --> PrismaClient
    APIRoutes --> PrismaClient
    APIRoutes --> AuthLib
    APIRoutes --> RBACLib
    ServerActions --> RBACLib
    PrismaClient --> PgBouncer
    PgBouncer --> PrimaryDB
    RSC --> RedisCache
    APIRoutes --> RedisCache
    ServerActions --> RedisQueue
    APIRoutes --> RedisQueue
    RedisQueue --> ServerActions
    ServerActions --> Stripe
    ServerActions --> Twilio
    ServerActions --> Resend
    ServerActions --> MetaWA
    APIRoutes --> Sentry
    RSC --> Sentry
    EdgeMiddleware --> Sentry
```

#### Principes Architecturaux Clés
| Principe | Implémentation |
| :--- | :--- |
| **Multi-tenant Strict** | `agencyId` propagé via `AsyncLocalStorage` (ALS) + Middleware Prisma `$extends` (Row Level Security simulé). Aucune requête sans `agencyId` validé. |
| **Security by Default** | Tous les endpoints (Server Actions, API Routes) passent par `withAuth` + `withPermissions`. Pas de `next-auth` côté client pour les mutations. |
| **Hybrid Rendering** | Marketing/Static: ISR/SSG. Dashboard/App: RSC + Streaming (Suspense). Mutations: Server Actions (Progressive Enhancement). |
| **Observability First** | OpenTelemetry natif (Vercel) + Sentry SDK (Node/Edge/Browser). Traces distribuées via `traceparent` header. |
| **Idempotency** | Clé `Idempotency-Key` obligatoire sur toutes mutations non-GET (Stripe style). Stockée Redis TTL 24h. |

---

### 2. Cycle de Vie d'une Requête HTTP (Middleware → Auth → RBAC → Handler → Response)

#### 2.1. Middleware Chain (Edge Runtime - `middleware.ts`)

```typescript
// middleware.ts (Edge Runtime)
import { createMiddlewareClient } from '@lib/auth/edge-client';
import { rateLimit } from '@lib/rate-limit/edge';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|api/health).*)',
  ],
};

export async function middleware(request: NextRequest) {
  // 1. Rate Limiting Global (Edge) - avant auth pour protéger login/brute force
  const rlResponse = await rateLimit(request, { 
    key: `global:${request.ip}`, 
    limit: 200, 
    window: '1m' 
  });
  if (rlResponse) return rlResponse;

  // 2. Auth Session Validation (JWT verification only, no DB hit)
  const { supabase, response } = createMiddlewareClient(request);
  const { data: { session } } = await supabase.auth.getSession();

  // 3. Tenant Resolution (Subdomain / Header / Session)
  const agencyId = resolveAgencyId(request, session);
  
  // 4. Inject Headers for Downstream (RSC / API / Actions)
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-agency-id', agencyId ?? '');
  requestHeaders.set('x-user-id', session?.user?.id ?? '');
  requestHeaders.set('x-user-role', session?.user?.app_metadata?.role ?? 'guest');
  
  // 5. RBAC Pre-check for known protected prefixes (optional, fast fail)
  if (isProtectedPath(request.nextUrl.pathname)) {
    const hasAccess = await checkEdgePermission(agencyId, session?.user?.id, request.nextUrl.pathname);
    if (!hasAccess) return new NextResponse(null, { status: 403 });
  }

  return NextResponse.next({ request: { headers: requestHeaders } });
}
```

#### 2.2. Server-Side Context Propagation (Node Runtime - `lib/context/async-local-storage.ts`)

```typescript
// lib/context/als.ts
import { AsyncLocalStorage } from 'async_hooks';

export interface RequestContext {
  agencyId: string;
  userId: string;
  role: UserRole;
  permissions: Permission[];
  traceId: string;
  idempotencyKey?: string;
  ip: string;
  userAgent: string;
}

export const als = new AsyncLocalStorage<RequestContext>();

export function getContext(): RequestContext {
  const store = als.getStore();
  if (!store) throw new Error('ALS Context not initialized. Missing withContext wrapper.');
  return store;
}

export function runWithContext<T>(ctx: RequestContext, callback: () => T): T {
  return als.run(ctx, callback);
}
```

#### 2.3. Handler Wrapper Pattern (API Routes & Server Actions)

```typescript
// lib/api/handler.ts
import { getContext } from '@lib/context/als';
import { prisma } from '@lib/db/prisma';
import { ForbiddenError, NotFoundError, ValidationError } from '@lib/errors';
import { auditLog } from '@lib/audit';

type HandlerFn<TInput, TOutput> = (input: TInput, ctx: RequestContext) => Promise<TOutput>;

export function createApiHandler<TInput, TOutput>(
  handler: HandlerFn<TInput, TOutput>,
  options: {
    schema?: ZodSchema<TInput>;
    permissions?: Permission[];
    idempotent?: boolean;
    rateLimit?: { limit: number; window: string };
  } = {}
) {
  return async (request: NextRequest): Promise<NextResponse> => {
    const ctx = getContext(); // Injecté par un wrapper supérieur ou middleware Node
    const start = performance.now();

    try {
      // 1. Idempotency Check
      if (options.idempotent) {
        const key = request.headers.get('Idempotency-Key');
        if (!key) throw new ValidationError('Missing Idempotency-Key header');
        const exists = await redis.set(`idem:${key}`, '1', 'NX', 'EX', 86400);
        if (!exists) return apiResponse({ data: null, meta: { idempotentReplay: true } }, 200);
        ctx.idempotencyKey = key;
      }

      // 2. RBAC Check (Fine-grained)
      if (options.permissions?.length) {
        const hasPerm = await checkPermissions(ctx.userId, ctx.agencyId, options.permissions);
        if (!hasPerm) throw new ForbiddenError('Insufficient permissions');
      }

      // 3. Input Validation
      let input: TInput;
      if (options.schema) {
        const body = await request.json().catch(() => ({}));
        const parsed = options.schema.safeParse(body);
        if (!parsed.success) throw new ValidationError(parsed.error.flatten().fieldErrors);
        input = parsed.data;
      } else {
        input = {} as TInput;
      }

      // 4. Execution (Transaction automatique pour mutations)
      const result = await prisma.$transaction(async (tx) => {
        // Injection TX dans contexte Prisma Extensions
        return handler(input, { ...ctx, tx });
      }, { timeout: 10000, isolationLevel: 'ReadCommitted' });

      // 5. Audit Log (Async, non-blocking)
      auditLog.emit('api_call', { 
        userId: ctx.userId, 
        agencyId: ctx.agencyId, 
        action: request.nextUrl.pathname, 
        status: 'success',
        durationMs: performance.now() - start 
      });

      return apiResponse({ data: result });

    } catch (error) {
      return handleApiError(error, ctx, start);
    }
  };
}
```

#### 2.4. Prisma Extension : Multi-Tenant & RLS Enforcement

```typescript
// lib/db/prisma.ts
import { PrismaClient } from '@prisma/client';
import { getContext } from '@lib/context/als';

export const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
}).$extends({
  name: 'multi-tenant',
  query: {
    $allModels: {
      async $allOperations({ args, query, model }) {
        const ctx = getContext(); // Throw si pas dans ALS
        
        // 1. Injection automatique agencyId sur Create
        if (args.operation === 'create' && model !== 'Agency' && model !== 'User') {
          args.data = { ...args.data, agencyId: ctx.agencyId };
        }

        // 2. Injection automatique agencyId sur Where (Read/Update/Delete)
        // Gère les relations imbriquées (ex: update Client where Bookings...)
        args.where = injectAgencyIdWhere(args.where, ctx.agencyId);

        // 3. Soft Delete Global
        if (args.operation === 'delete' || args.operation === 'deleteMany') {
          args.operation = 'update';
          args.args = { ...args.args, data: { deletedAt: new Date() } };
        }
        if (args.operation === 'findUnique' || args.operation === 'findFirst' || args.operation === 'findMany') {
          args.where = { ...args.where, deletedAt: null };
        }

        return query(args);
      },
    },
  },
  client: {
    // Helpers typesafe
    async findBookingByRef(ref: string) {
      return this.booking.findUnique({ where: { reference: ref } });
    },
  },
});

function injectAgencyIdWhere(where: any, agencyId: string): any {
  if (!where) return { agencyId };
  if (where.OR || where.AND || where.NOT) {
    // Recursion pour clauses complexes
    return Object.fromEntries(
      Object.entries(where).map(([k, v]) => [k, injectAgencyIdWhere(v, agencyId)])
    );
  }
  return { ...where, agencyId };
}
```

---

### 3. Gestion des Erreurs (Error Classes, Format de Réponse API)

#### 3.1. Hiérarchie d'Erreurs (`lib/errors/index.ts`)

```typescript
// lib/errors/index.ts
export class AppError extends Error {
  public readonly code: string;
  public readonly statusCode: number;
  public readonly isOperational: boolean;
  public readonly details?: Record<string, any>;
  public readonly timestamp: Date;
  public readonly requestId: string;

  constructor(message: string, options: { 
    code: string; 
    statusCode: number; 
    details?: Record<string, any>;
    requestId?: string;
  }) {
    super(message);
    this.name = this.constructor.name;
    this.code = options.code;
    this.statusCode = options.statusCode;
    this.isOperational = true; // Erreurs métier attendues
    this.details = options.details;
    this.timestamp = new Date();
    this.requestId = options.requestId ?? crypto.randomUUID();
    Error.captureStackTrace(this, this.constructor);
  }
}

// --- Erreurs Métier (4xx) ---
export class ValidationError extends AppError {
  constructor(message: string, details?: Record<string, any>, requestId?: string) {
    super(message, { code: 'VALIDATION_ERROR', statusCode: 400, details, requestId });
  }
}

export class AuthenticationError extends AppError {
  constructor(message = 'Non authentifié', requestId?: string) {
    super(message, { code: 'UNAUTHENTICATED', statusCode: 401, requestId });
  }
}

export class ForbiddenError extends AppError {
  constructor(message = 'Accès refusé', requestId?: string) {
    super(message, { code: 'FORBIDDEN', statusCode: 403, requestId });
  }
}

export class NotFoundError extends AppError {
  constructor(resource: string, requestId?: string) {
    super(`${resource} non trouvé`, { code: 'NOT_FOUND', statusCode: 404, requestId });
  }
}

export class ConflictError extends AppError {
  constructor(message: string, requestId?: string) {
    super(message, { code: 'CONFLICT', statusCode: 409, requestId });
  }
}

export class IdempotencyError extends AppError {
  constructor(requestId?: string) {
    super('Clé d\'idempotence déjà traitée ou invalide', { code: 'IDEMPOTENCY_CONFLICT', statusCode: 409, requestId });
  }
}

export class RateLimitError extends AppError {
  public readonly retryAfter: number;
  constructor(retryAfter: number, requestId?: string) {
    super('Trop de requêtes', { code: 'RATE_LIMITED', statusCode: 429, requestId });
    this.retryAfter = retryAfter;
  }
}

// --- Erreurs Techniques (5xx) ---
export class InternalError extends AppError {
  constructor(message = 'Erreur interne', cause?: Error, requestId?: string) {
    super(message, { code: 'INTERNAL_ERROR', statusCode: 500, details: { cause: cause?.message }, requestId });
    this.isOperational = false; // Bug inattendu -> Alerte Sentry immédiate
  }
}

export class ExternalServiceError extends AppError {
  constructor(service: string, cause: Error, requestId?: string) {
    super(`Échec service externe: ${service}`, { 
      code: 'EXTERNAL_SERVICE_ERROR', 
      statusCode: 502, 
      details: { service, cause: cause.message },
      requestId 
    });
    this.isOperational = true; // Peut être retry
  }
}

export class DatabaseError extends AppError {
  constructor(cause: Error, requestId?: string) {
    super('Erreur base de données', { 
      code: 'DATABASE_ERROR', 
      statusCode: 500, 
      details: { cause: cause.message },
      requestId 
    });
    this.isOperational = false;
  }
}
```

#### 3.2. Format de Réponse API Unifié (RFC 7807 / Problem Details)

```typescript
// lib/api/response.ts
export interface ApiResponse<T> {
  data: T | null;
  error: ApiErrorResponse | null;
  meta: ResponseMeta;
}

export interface ApiErrorResponse {
  code:

---

# Agence Pro — Cahier Technique · Section « API REST — Routes, Schémas Zod, Réponses »

> Version : 1.0 · Stack : Next.js 15 App Router + Route Handlers · Validation : Zod · Auth : JWT (access 15 min + refresh 7j) · RBAC via middleware Edge

---

## 0. Conventions communes

### 0.1 Enveloppe de réponse standard

Toutes les réponses suivent une enveloppe unique. Pas de variantes par route.

```ts
// types/api.ts
type ApiEnvelope<T> = {
  data: T | null;
  meta: {
    page?: number;
    pageSize?: number;
    total?: number;
    requestId: string;        // UUID v4, tracé en logs
    timestamp: string;       // ISO 8601 UTC
  };
  error: ApiError | null;
};

type ApiError = {
  code: string;              // ex: "VALIDATION_ERROR", "RBAC_FORBIDDEN"
  message: string;           // FR, user-facing
  details?: Record<string, unknown>[];
  hint?: string;
};
```

### 0.2 Codes d'erreur génériques (transverses)

| Code HTTP | `error.code`            | Déclencheur                                         |
|-----------|-------------------------|-----------------------------------------------------|
| 400       | `VALIDATION_ERROR`      | Zod invalide                                        |
| 401       | `UNAUTHENTICATED`       | Pas/mauvais token                                    |
| 401       | `TOKEN_EXPIRED`         | Access expiré (client doit refresh)                |
| 403       | `RBAC_FORBIDDEN`        | Rôle insuffisant                                    |
| 403       | `TENANT_MISMATCH`       | Ressource hors tenant                               |
| 404       | `NOT_FOUND`             | ID absent                                           |
| 409       | `CONFLICT`             | Unicité violée                                      |
| 422       | `BUSINESS_RULE`         | Règle métier (ex: dossier déjà clôturé)             |
| 429       | `RATE_LIMITED`          | Quota dépassé                                       |
| 500       | `INTERNAL_ERROR`        | Bug serveur                                         |

### 0.3 Stratégie de rate limit

Quota par couple `(userId|ip, routePrefix)` via Upstash Redis sliding window.

| Préfixe            | Limite                                  | Burst |
|--------------------|-----------------------------------------|-------|
| `/api/auth/*`      | 10/min (login : 5/min)                  | —     |
| `/api/clients/*`   | 60/min (admin), 30/min (agent)          | 120   |
| `/api/dossiers/*`  | 60/min                                  | 100   |
| `/api/factures/*`  | 30/min                                  | 60    |
| `/api/paiements/*` | 20/min                                  | 30    |
| `/api/documents/*` | 60/min (upload : 10/min)               | 30    |

### 0.4 Rôles RBAC

| Code rôle        | Libellé                 | Périmètre                            |
|------------------|-------------------------|--------------------------------------|
| `super_admin`    | Admin plateforme        | Cross-tenant                         |
| `admin`          | Gérant d'agence         | Son tenant uniquement                |
| `agent`          | Agent de voyage         | Dossiers qui lui sont assignés       |
| `accountant`     | Comptable               | Factures/paiements du tenant         |
| `receptionist`   | Accueil                 | Clients + dossiers (lecture)         |
| `client`         | Client final (optionnel) | Ses propres dossiers                 |

### 0.5 Paramètres de pagination (communs à tous les `GET` listes)

```ts
const paginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(25),
  sort: z.string().regex(/^-?[a-z_]+(,-?[a-z_]+)*$/i).optional(),
  q: z.string().trim().max(100).optional(),
});
```

---

## 1. Auth — 9 routes

| # | Méthode | Path                         | Description                     | RBAC                              | Rate limit    | Erreurs spécifiques                            |
|---|---------|------------------------------|---------------------------------|-----------------------------------|---------------|------------------------------------------------|
| 1 | POST    | `/api/auth/register`         | Inscription 1er admin d'agence  | public                            | 5/min/IP      | `EMAIL_TAKEN`, `INVITE_INVALID`, `DOMAIN_BLOCKED` |
| 2 | POST    | `/api/auth/login`            | Connexion (email + password)    | public                            | 5/min/ident   | `INVALID_CREDENTIALS`, `ACCOUNT_LOCKED`, `EMAIL_NOT_VERIFIED` |
| 3 | POST    | `/api/auth/logout`           | Invalide refresh (whitelist)    | authenticated                     | 10/min        | —                                              |
| 4 | POST    | `/api/auth/refresh`          | Rotation access token           | refresh JWT valide                | 30/min        | `REFRESH_EXPIRED`, `TOKEN_REUSED`              |
| 5 | POST    | `/api/auth/forgot-password`  | Envoi email reset               | public                            | 3/min/email   | `EMAIL_NOT_FOUND` (silencieux en prod)         |
| 6 | POST    | `/api/auth/reset-password`   | Nouveau password via token       | public (token)                    | 5/min         | `RESET_TOKEN_INVALID`, `RESET_TOKEN_EXPIRED`   |
| 7 | POST    | `/api/auth/verify-email`     | Validation email post-inscription | public (token)                  | 10/min        | `VERIFY_TOKEN_INVALID`                        |
| 8 | GET     | `/api/auth/me`               | Profil courant                  | authenticated                     | 60/min        | —                                              |
| 9 | PATCH   | `/api/auth/me`               | MAJ profil courant              | authenticated                     | 30/min        | `EMAIL_TAKEN`, `CURRENT_PASSWORD_REQUIRED`    |

### Réponses JSON (Auth)

```jsonc
// POST /api/auth/login → 200
{
  "data": {
    "user": {
      "id": "usr_01HXXX",
      "email": "marie@agence-voyages.fr",
      "firstName": "Marie",
      "lastName": "Durand",
      "role": "admin",
      "tenantId": "tnt_01HXXX",
      "avatarUrl": null,
      "locale": "fr-FR",
      "emailVerifiedAt": "2025-01-10T09:00:00Z"
    },
    "tokens": {
      "accessToken": "eyJhbGciOi...",
      "refreshToken": "rt_01HXXX...",
      "accessExpiresIn": 900,
      "refreshExpiresIn": 604800
    }
  },
  "meta": { "requestId": "rq_01HXXX", "timestamp": "2025-01-15T14:23:11Z" },
  "error": null
}
```

### Schémas Zod — Auth

```ts
// src/app/api/auth/_schemas.ts
import { z } from 'zod';

const passwordSchema = z
  .string()
  .min(12, 'Mot de passe : 12 caractères minimum')
  .max(128)
  .regex(/[A-Z]/, '1 majuscule requise')
  .regex(/[a-z]/, '1 minuscule requise')
  .regex(/[0-9]/, '1 chiffre requis')
  .regex(/[^A-Za-z0-9]/, '1 caractère spécial requis');

const emailSchema = z.string().trim().toLowerCase().email('Email invalide').max(254);

// 1. Register
export const registerSchema = z.object({
  body: z.object({
    email: emailSchema,
    password: passwordSchema,
    firstName: z.string().trim().min(1).max(80),
    lastName: z.string().trim().min(1).max(80),
    agencyName: z.string().trim().min(2).max(120),
    agencySiret: z.string().regex(/^\d{14}$/).optional(),
    inviteToken: z.string().uuid().optional(),
    locale: z.enum(['fr-FR', 'en-US', 'es-ES']).default('fr-FR'),
    acceptTerms: z.literal(true, { message: 'CGU obligatoires' }),
  }),
});

// 2. Login
export const loginSchema = z.object({
  body: z.object({
    email: emailSchema,
    password: z.string().min(1).max(128),   // pas de complexité ici ( anti-enum )
    rememberMe: z.boolean().default(false),
    deviceId: z.string().max(64).optional(),
  }),
});

// 3. Logout
export const logoutSchema = z.object({
  body: z.object({
    refreshToken: z.string().min(1).max(256),
  }),
});

// 4. Refresh
export const refreshSchema = z.object({
  body: z.object({
    refreshToken: z.string().min(1).max(256),
  }),
});

// 5. Forgot password
export const forgotPasswordSchema = z.object({
  body: z.object({ email: emailSchema }),
});

// 6. Reset password
export const resetPasswordSchema = z.object({
  body: z.object({
    resetToken: z.string().min(1).max(256),
    password: passwordSchema,
  }),
});

// 7. Verify email
export const verifyEmailSchema = z.object({
  body: z.object({ verifyToken: z.string().min(1).max(256) }),
});

// 8. Me (GET) — pas de body
export const getMeSchema = z.object({ query: z.never().optional() });

// 9. Update me
export const updateMeSchema = z.object({
  body: z.object({
    firstName: z.string().trim().min(1).max(80).optional(),
    lastName: z.string().trim().min(1).max(80).optional(),
    email: emailSchema.optional(),
    locale: z.enum(['fr-FR', 'en-US', 'es-ES']).optional(),
    avatarUrl: z.string().url().max(1024).nullable().optional(),
    currentPassword: z.string().min(1).max(128).optional(),
    newPassword: passwordSchema.optional(),
  }).refine(
    (v) => !v.newPassword || !!v.currentPassword,
    { message: 'currentPassword requis pour changer le mot de passe', path: ['currentPassword'] }
  ),
});
```

---

## 2. Clients — 5 routes

| #  | Méthode | Path                   | Description          | RBAC                                         | Rate limit | Erreurs                                |
|----|---------|------------------------|----------------------|-----------------------------------------------|------------|----------------------------------------|
| 10 | GET     | `/api/clients`         | Liste paginée        | admin, agent, accountant, receptionist       | 60/min     | —                                      |
| 11 | POST    | `/api/clients`         | Création             | admin, agent, receptionist                    | 30/min     | `EMAIL_TAKEN`, `PHONE_INVALID`         |
| 12 | GET     | `/api/clients/:id`     | Détail               | admin, agent, accountant, receptionist, client(lecteur propre) | 60/min | `NOT_FOUND`, `TENANT_MISMATCH` |
| 13 | PATCH   | `/api/clients/:id`     | MAJ                  | admin, agent, receptionist                    | 30/min     | `EMAIL_TAKEN`                          |
| 14 | DELETE  | `/api/clients/:id`     | Soft delete          | admin                                         | 10/min     | `CLIENT_HAS_DOSSIERS` (409)            |

### Réponses JSON (Clients)

```jsonc
// GET /api/clients?page=1&pageSize=25&q=du  → 200
{
  "data": [
    {
      "id": "cli_01HXXX",
      "reference": "CLI-2025-0042",
      "type": "individual",          // individual | company
      "civility": "Mme",
      "firstName": "Marie",
      "lastName": "Durand",
      "companyName": null,
      "email": "marie.durand@email.fr",
      "phone": "+33612345678",
      "address": {
        "street": "12 rue Lafayette",
        "city": "Paris",
        "zipCode": "75009",
        "country": "FR"
      },
      "birthDate": "1985-04-12",
      "nationality": "FR",
      "passportNumber": null,
      "tags": ["vip", "frequent"],
      "marketingConsent": true,
      "notes": null,
      "stats": { "dossiersCount": 7, "totalSpentEur": 18450.00, "lastTripAt": "2025-01-02" },
      "createdAt": "2024-09-10T08:11:33Z",
      "updatedAt": "2025-01-12T16:55:01Z"
    }
  ],
  "meta": {
    "page": 1, "pageSize": 25, "total": 142,
    "requestId": "rq_01HXXX", "timestamp": "2025-01-15T14:25:00Z"
  },
  "error": null
}
```

### Schémas Zod — Clients

```ts
// src/app/api/clients/_schemas.ts
const phoneSchema = z.string().regex(/^\+?[1-9]\d{6,14}$/, 'Téléphone E.164 requis');

const addressSchema = z.object({
  street: z.string().trim().min(1).max(200),
  street2: z.string().trim().max(200).optional(),
  city: z.string().trim().min(1).max(100),
  zipCode: z.string().trim().min(1).max(20),
  country: z.string().length(2).regex(/^[A-Z]{2}$/),
});

const isoDate = z.string().regex(/^\d{4}-\d{2}-\d{2}$/);

// 10. List
export const listClientsSchema = z.object({
  query: paginationSchema.extend({
    type: z.enum(['individual', 'company']).optional(),
    tag: z.string().max(40).optional(),
    hasUnpaid: z.coerce.boolean().optional(),
    createdAfter: isoDate.optional(),
    createdBefore: isoDate.optional(),
  }),
});

// 11. Create
export const createClientSchema = z.object({
  body: z.object({
    type: z.enum(['individual', 'company']).default('individual'),
    civility: z.enum(['M.', 'Mme', 'Mx', 'Société']).optional(),
    firstName: z.string().trim().min(1).max(80).optional(),
    lastName: z.string().trim().min(1).max(80).optional(),
    companyName: z.string().trim().min(1).max(200).optional(),
    email: emailSchema.optional(),
    phone: phoneSchema.optional(),
    secondaryPhone: phoneSchema.optional(),
    address: addressSchema.optional(),
    birthDate: isoDate.optional(),
    nationality: z.string().length(2).optional(),
    passportNumber: z.string().trim().max(50).optional(),
    passportExpiry: isoDate.optional(),
    tags: z.array(z.string().trim().max(40)).max(20).default([]),
    marketingConsent: z.boolean().default(false),
    notes: z.string().trim().max(5000).optional(),
    preferredLanguage: z.enum(['fr-FR', 'en-US', 'es-ES']).default('fr-FR'),
  }).refine(
    (v) => v.type === 'company' ? !!v.companyName : (!!v.firstName && !!v.lastName),
    { message: 'Nom/prénom requis pour particulier, raison sociale pour société', path: ['type'] }
  ).refine(
    (v) => !!v.email || !!v.phone,
    { message: 'Email ou téléphone obligatoire', path: ['email'] }
  ),
});

// 12. Get
export const getClientSchema = z.object({
  params: z.object({ id: z.string().regex(/^cli_[0-9A-HJKMNP-TV-Z]{26}$/) }),
});

// 13. Update
export const updateClientSchema = z.object({
  params: z.object({ id: z.string().regex(/^cli_[0-9A-HJKMNP-TV-Z]{26}$/) }),
  body: createClientSchema.shape.body.partial(),
});

// 14. Delete
export const deleteClientSchema = z.object({
  params: z.object({ id: z.string().regex(/^cli_[0-9A-HJKMNP-TV-Z]{26}$/) }),
  query: z.object({
    hard: z.coerce.boolean().default(false),     // admin seulement
    reason: z.string().trim().max(500).optional(),
  }),
});
```

---

## 3. Dossiers — 9 routes

| #  | Méthode | Path                              | Description                | RBAC                              | Rate limit | Erreurs                                   |
|----|---------|-----------------------------------|----------------------------|-----------------------------------|------------|-------------------------------------------|
| 15 | GET     | `/api/dossiers`                   | Liste paginée             | admin, agent, accountant, receptionist | 60/min | —                                         |
| 16 | POST    | `/api/dossiers`                   | Création dossier voyage   | admin, agent                      | 30/min     | `CLIENT_NOT_FOUND`, `TRAVEL_DATE_INVALID` |
| 17 | GET     | `/api/dossiers/:id`                | Détail + prestations       | admin, agent, client(propre), accountant | 60/min | `NOT_FOUND`                          |
| 18 | PATCH   | `/api/dossiers/:id`                | MAJ données générales       | admin, agent(propre)              | 30/min     | `STATUS_LOCKED` (422)                    |
| 19 | DELETE  | `/api/dossiers/:id`               | Soft delete                | admin                             | 10/min     | `STATUS_NOT_DRAFT` (422)                  |
| 20 | POST    | `/api/dossiers/:id/duplicate`     | Clonage (sans paiements)   | admin, agent                      | 10/min     | —                                         |
| 21 | PATCH   | `/api/dossiers/:id/status`        | Transition workflow         | admin, agent                      | 20/min     | `INVALID_TRANSITION` (422)               |
| 22 | POST    | `/api/dossiers/:id/assign`         | Affectation agent          | admin                             | 20/min     | `AGENT_NOT_FOUND`, `AGENT_NO_LICENSE`    |
| 23 | GET     | `/api/dossiers/:id/timeline`       | Journal d'événements        | admin, agent, accountant          | 60/min     | —                                         |

### Workflow des statuts (`DossierStatus`)

`draft → quote_sent → confirmed → in_progress → completed → archived`
Branches annexes : `cancelled`, `on_hold`.

Transitions autorisées : vérifiées côté serveur via matrice (`ALLOWED_TRANSITIONS`).

### Réponses JSON (Dossiers)

```jsonc
// GET /api/dossiers/dos_01HXXX → 200
{
  "data": {
    "id": "dos_01HXXX",
    "reference": "DOS-2025-0042",
    "type": "leisure",                  // leisure | business | group | cruise
    "status": "quote_sent",
    "title": "Séjour Bali — couple",
    "clientId": "cli_01HXXX",
    "clientReference": "CLI-2025-0042",
    "agentId": "usr_01HXXX",
    "agencyId": "tnt_01HXXX",
    "travelDates": {
      "start": "2025-07-12",
      "end": "2025-07-26",
      "flexible": false
    },
    "destinations": [
      { "country": "ID", "city": "Denpasar", "iata": "DPS" }
    ],
    "pax": {
      "adults": 2, "children": 0, "infants": 0, "total": 2
    },
    "budget": { "amount": 4200, "currency": "EUR", "flexible": true },
    "prestations": [
      {
        "id": "prs_01HXXX",
        "kind": "flight",
        "label": "Vol CDG→DPS",
        "supplier": "Air France",
        "supplierRef": "AF-12345",
        "quantity": 2,
        "unitPrice": 980,
        "currency": "EUR",
        "taxRate": 0,
        "total": 1960,
        "status": "quoted",
        "startDate": "2025-07-12",
        "endDate": "2025-07-13"
      }
    ],
    "totals": {
      "subtotalHt": 4200,
      "discount": 0,
      "taxAmount": 0,
      "totalTtc": 4200,
      "paid": 1000,
      "balance": 3200,
      "currency": "EUR"
    },
    "tags": ["honeymoon"],
    "notes": null,
    "assignedAt": "2025-01-14T10:00:00Z",
    "createdAt": "2025-01-10T08:11:33Z",
    "updatedAt": "2025-01-15T11:45:21Z",
    "closedAt": null
  },
  "meta": { "requestId": "rq_01HXXX", "timestamp": "2025-01-15T14:25:00Z" },
  "error": null
}
```

### Schémas Zod — Dossiers

```ts
// src/app/api/dossiers/_schemas.ts
const dossierIdSchema = z.string().regex(/^dos_[0-9A-HJKMNP-TV-Z]{26}$/);
const userIdSchema = z.string().regex(/^usr_[0-9A-HJKMNP-TV-Z]{26}$/);
const clientIdSchema = z.string().regex(/^cli_[0-9A-HJKMNP-TV-Z]{26}$/);

const dossierStatusEnum = z.enum([
  'draft', 'quote_sent', 'confirmed', 'in_progress',
  'completed', 'archived', 'cancelled', 'on_hold',
]);

const prestTypeEnum = z.enum([
  'flight', 'hotel', 'train', 'car', 'cruise',
  'activity', 'transfer', 'insurance', 'visa', 'fees', 'other',
]);

const moneySchema = z.object({
  amount: z.number().min(0).max(10_000_000).multipleOf(0.01),
  currency: z.enum(['EUR', 'USD', 'GBP', 'CHF', 'CAD', 'AUD', 'MAD', 'TND']).default('EUR'),
});

const prestSchema = z.object({
  id: z.string().optional(),
  kind: prestTypeEnum,
  label: z.string().trim().min(1).max(200),
  supplier: z.string().trim().max(120).optional(),
  supplierRef: z.string().trim().max(80).optional(),
  quantity: z.number().int().min(1).max(999).default(1),
  unitPrice: z.number().min(0).max(1_000_000).multipleOf(0.01),
  currency: z.enum(['EUR', 'USD', 'GBP', 'CHF', 'CAD', 'AUD', 'MAD', 'TND']).default('EUR'),
  taxRate: z.number().min(0).max(1).multipleOf(0.01).default(0),
  total: z.number().min(0).optional(),     // recalculé serveur
  status: z.enum(['draft', 'quoted', 'booked', 'confirmed', 'cancelled']).default('draft'),
  startDate: isoDate.optional(),
  endDate: isoDate.optional(),
  metadata: z.record(z.unknown()).optional(),
});

// 15. List
export const listDossiersSchema = z.object({
  query: paginationSchema.extend({
    status: dossierStatusEnum.optional(),
    clientId: clientIdSchema.optional(),
    agentId: userIdSchema.optional(),
    type: z.enum(['leisure', 'business', 'group', 'cruise']).optional(),
    travelAfter: isoDate.optional(),
    travelBefore: isoDate.optional(),
    hasUnpaidBalance: z.coerce.boolean().optional(),
    minTotal: z.coerce.number().min(0).optional(),
    maxTotal: z.coerce.number().min(0).optional(),
  }),
});

// 16. Create
export const createDossierSchema = z.object({
  body: z.object({
    type: z.enum(['leisure', 'business', 'group', 'cruise']).default('leisure'),
    title: z.string().trim().min(1).max(200),
    clientId: clientIdSchema,
    agentId: userIdSchema.optional(),
    travelDates: z.object({
      start: isoDate,
      end: isoDate,
      flexible: z.boolean().default(false),
    }),
    destinations: z.array(z.object({
      country: z.string().length(2).regex(/^[A-Z]{2}$/),
      city: z.string().trim().max(100).optional(),
      iata: z.string().length(3).regex(/^[A-Z]{3}$/).optional(),
    })).min(1).max(20),
    pax: z.object({
      adults: z.number().int().min(1).max(99),
      children: z.number().int().min(0).max(99).default(0),
      infants: z.number().int().min(0).max(20).default(0),
      details: z.array(z.object({
        type: z.enum(['adult', 'child', 'infant']),
        birthDate: isoDate.optional(),
        fullName: z.string().trim().max(120).optional(),
      })).max(200).optional(),
    }),
    budget: moneySchema.extend({ flexible: z.boolean().default(false) }).optional(),
    prestations: z.array(prestSchema).max(200).default([]),
    discount: moneySchema.optional(),
    tags: z.array(z.string().trim().max(40)).max(20).default([]),
    notes: z.string().trim().max(5000).optional(),
  }).refine(
    (v) => v.travelDates.end >= v.travelDates.start,
    { message: 'Date de fin antérieure au début', path: ['travelDates', 'end'] }
  ),
});

// 17. Get
export const getDossierSchema = z.object({
  params: z.object({ id: dossierIdSchema }),
  query: z.object({
    include: z.string().regex(/^(timeline|prestations|documents|paiements)(,(timeline|prestations|documents|paiements))*$/).optional(),
  }),
});

// 18. Update
export const updateDossierSchema = z.object({
  params: z.object({ id: dossierIdSchema }),
  body: createDossierSchema.shape.body.partial().extend({
    prestations: z.array(prestSchema).max(200).optional(),       // remplace toute la liste
  }),
});

// 19. Delete
export const deleteDossierSchema = z.object({
  params: z.object({ id: dossierIdSchema }),
  query: z.object({ hard: z.coerce.boolean().default(false), reason: z.string().trim().max(500).optional() }),
});

// 20. Duplicate
export const duplicateDossierSchema = z.object({
  params: z.object({ id: dossierIdSchema }),
  body: z.object({
    newTitle: z.string().trim().min(1).max(200).optional(),
    copyPrestations: z.boolean().default(true),
    copyDocuments: z.boolean().default(false),
    resetStatusToDraft: z.boolean().default(true),
  }),
});

// 21. Status transition
export const updateDossierStatusSchema = z.object({
  params: z.object({ id: dossierIdSchema }),
  body: z.object({
    status: dossierStatusEnum,
    reason: z.string().trim().max(500).optional(),
    notifyClient: z.boolean().default(false),
  }),
});

// 22. Assign
export const assignDossierSchema = z.object({
  params: z.object({ id: dossierIdSchema }),
  body: z.object({
    agentId: userIdSchema,
    note: z.string().trim().max(500).optional(),
  }),
});

// 23. Timeline
export const getDossierTimelineSchema = z.object({
  params: z.object({ id: dossierIdSchema }),
  query: paginationSchema.extend({
    eventType: z.enum([
      'created', 'updated', 'status_changed', 'assigned', 'note_added',
      'prestation_added', 'prestation_removed', 'document_uploaded',
      'payment_received', 'invoice_issued', 'email_sent'
    ]).optional(),
  }),
});
```

### Matrice des transitions (serveur)

```ts
const ALLOWED_TRANSITIONS: Record<DossierStatus, DossierStatus[]> = {
  draft:       ['quote_sent', 'cancelled'],
  quote_sent:  ['confirmed', 'draft', 'cancelled', 'on_hold'],
  confirmed:   ['in_progress', 'cancelled', 'on_hold'],
  in_progress: ['completed', 'on_hold', 'cancelled'],
  completed:   ['archived'],
  on_hold:     ['draft', 'quote_sent', 'confirmed', 'in_progress', 'cancelled'],
  archived:    [],
  cancelled:   ['draft'],
};
```

---

## 4. Factures — 7 routes

| #  | Méthode | Path                          | Description               | RBAC                       | Rate limit | Erreurs                          |
|----|---------|-------------------------------|---------------------------|-----------------------------|------------|----------------------------------|
| 24 | GET     | `/api/factures`               | Liste paginée             | admin, accountant, agent(lecteur propre) | 30/min | —                          |
| 25 | POST    | `/api/factures`               | Création manuelle         | admin, accountant          | 20/min     | `DOSSIER_NOT_FOUND`, `ALREADY_INVOICED` (409) |
| 26 | GET     | `/api/factures/:id`           | Détail + lignes           | admin, accountant, agent(lecteur), client(propre) | 30/min | `NOT_FOUND` |
| 27 | PATCH   | `/api/factures/:id`           | MAJ (brouillon seulement) | admin, accountant          | 20/min     | `INVOICE_NOT_DRAFT` (422)        |
| 28 | DELETE  | `/api/factures/:id`           | Soft delete               | admin                      | 10/min     | `INVOICE_NOT_DRAFT` (422)        |
| 29 | POST    | `/api/factures/:id/validate`  | Verrouille + numérote     | admin, accountant          | 10/min     | `INVOICE_LOCKED` (409)           |
| 30 | GET     | `/api/factures/:id/pdf`        | Stream PDF (signé)        | admin, accountant, agent, client(propre) | 30/min | `NOT_FOUND`, `PDF_NOT_READY` |

### Réponses JSON (Factures)

```jsonc
// POST /api/factures/fac_01HXXX/validate → 200
{
  "data": {
    "id": "fac_01HXXX",
    "number": "FAC-2025-0042",
    "legalNumber": "FAC-2025-0042",
    "status": "validated",
    "dossierId": "dos_01HXXX",
    "clientId": "cli_01HXXX",
    "issueDate": "2025-01-15",
    "dueDate": "2025-02-14",
    "currency": "EUR",
    "lines": [
      {
        "id": "ln_01HXXX",
        "label": "Vol CDG→DPS x2",
        "prestationId": "prs_01HXXX",
        "quantity": 2,
        "unitPriceHt": 980,
        "taxRate": 0,
        "taxAmount": 0,
        "totalHt": 1960,
        "totalTtc": 1960
      }
    ],
    "totals": { "subtotalHt": 4200, "discountHt": 0, "taxAmount": 0, "totalTtc": 4200, "paid": 0, "balance": 4200 },
    "notes": null,
    "legalMentions": "SIRET 123 456 789 00010 — TVA non applicable, art. 293 B CGI",
    "pdfUrl": "/api/factures/fac_01HXXX/pdf",
    "validatedAt": "2025-01-15T14:25:00Z",
    "createdAt": "2025-01-15T14:20:00Z"
  },
  "meta": { "requestId": "

---

Voici un **cahier technique concis et opérationnel** pour l'Agence Pro.
Chaque section contient des **commands réelles, des fichiers de config et des snippets de script** que vous pouvez copier-coller dans le dépôt.

---

## 1️⃣ PLAN DE DÉPLOIEMENT

### 1.1 Workflow Git (branching)

| Branche | Objectif | Rules de merge |
|---------|----------|----------------|
| `main` | La production **live** (déploiement automatique Vercel) | Richelieu merge only – nécessite revue + title-case PR + toutes les CI OK |
| `develop` | la prochaine version en cours de préparation (preview sur Vercel) | Fusionné depuis les feature-branches uniquement |
| `feature/<ticket-id>-short-desc` | Travail en cours | Fusible dans `develop` après **PR review** + test‑gate ✔ |
| `release/<version>` | Branche de publication (tags de version) | Fusible dans `main` & `develop` (hotfix depuis `main`) |
| `gh-pages` | Le cas échéant (docs, etc.) | – |

#### Commandes de départ

```bash
# 1️⃣ Crée une feature branch
git checkout develop
git checkout -b feature/123-improve-dashboard

# 2️⃣ Valide les changements
git add .
git commit -m "feat: améliorer la carte du tableau de bord"

# 3️⃣ Poussez et créez une PR (GitHub CLI)
git push origin feature/123-improve-dashboard
gh pr create --title "feat: améliorer la carte du tableau de bord" \
             --body "Ticket #123 – UI & API tweaks" \
             --base develop \
             --head feature/123-improve-dashboard
```

#### Fusion et protection de branche (via GitHub UI)

*Activez **branch protection** sur `develop` et `main` (exige un avis de rejet, status checks, PR requise). Ajoutez un **codeowner** file (`CODEOWNERS`) si nécessaire.*

```txt
# .github/CODEOWNERS
*       @your-org/frontend-team
```

---

### 1.2 CI/CD (Vercel)

#### a) Configuration de base (`vercel.json`)

```json
{
  "version": 2,
  "framework": "nextjs",
  "outputDirectory": ".next",
  "builds": [
    { "src": "package.json", "use": "@vercel/next" }
  ],
  "routes": [
    { "src": "/api/(.*)", "dest": "/api/$1" },
    { "src": "/(.*)", "dest": "/.next/serverless/pages/$1" }
  ],
  "env": {
    "POSTGRES_URL": "@agence-pro/production",
    "REDIS_URL": "@agence-pro/production",
    "SENTRY_DSN": "@agence-pro/production",
    "NODE_ENV": "production"
  },
  "hooks": {
    "postBuild": "npx prisma generate"
  }
}
```

*Les variables d'environnement préfixées par `@agence-pro` sont résolues via le **secret management** de Vercel (voir 1.3).*

#### b) Déploiements preview vs staging vs production

| Event | Target | Commentaires |
|-------|--------|----------|
| `push` sur `develop` | **Preview** (URL `https://agence-pro-dev-xxx.vercel.app`) | Le pipeline CI de Vercel déclenche automatiquement un preview deploy. |
| `push` sur `release/<ver>` | **Staging** (`https://agence-pro-staging.vercel.app`) | Passe par une vérification manuelle ; utilise le même `vercel.json` mais un alias distinct. |
| Tag Git **`production`** (ou merge vers `main` + `vercel prod`) | **Production** (`https://agence-pro.vercel.app`) | Vercel est configuré pour « **Deploy on merge** » depuis `main`. |

**Workflow GitHub Actions** – `.github/workflows/vercel-deploy.yml`

```yaml
name: Deploy to Vercel
on:
  push:
    branches:
      - main
      - develop
      - release/**
  workflow_dispatch:
    inputs:
      environment:
        description: 'Environment to deploy'
        required: true
        default: 'preview'

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Use Node.js 20
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'

      - name: Installer les dépendances
        run: npm ci

      - name: Exécuter les tests unitaires et d'intégration (test gate)
        run: npm run test:ci

      - name: Générer les types Prisma
        run: npx prisma generate

      - name: Déployer vers Vercel
        id: vercel
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          github-comment: false
          working-directory: .

      # Optionnel : assoicer le commit Vercel pour l'historique des déploiements
      - name: Associer le déploiement
        uses: bobheadix/vercel-deploy-comment@v1
        with:
          github-token: ${{ secrets.GITHUB_TOKEN }}
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-deployment-url: ${{ steps.vercel.outputs.deployment-url }}
```

*Cet action déclenche un déploiement **preview** pour `develop`, un déploiement **staging** (si manuel) et un déploiement **production** pour `main`.*

---

### 1.3 Gestion des variables d'environnement

*Utilisez les **secrets d'environnement de Vercel** pour garder les identifiants hors du code.*

```bash
# Liste des env (une fois connecté à la console Vercel)
vercel env ls

# Ajoutez des valeurs depuis le shell (CI)
vercel env add POSTGRES_URL production "$POSTGRES_URL"
vercel env add REDIS_URL production "$REDIS_URL"
vercel env add SENTRY_DSN production "$SENTRY_DSN"
```

*Stockez les secrets correspondants dans **GitHub Secrets** (`POSTGRES_URL`, `REDIS_URL`, `SENTRY_DSN`, `VERCEL_TOKEN`, etc.).*

---

### 1.4 Intégration Sentry

```bash
# 1️⃣ Ajoutez le DSN dans Vercel (ou dans l'environnement local)
vercel env add SENTRY_DSN development "{SENTRY_DSN_VALUE}"

# 2️⃣ Dans votre application Next.js (app/router.tsx ou _app.tsx)
import * as Sentry from '@sentry/nextjs';
Sentry.init({
  dsn: process.env.SENTRY_DSN,
  tracesSampleRate: 1.0,   // Ajustez selon votre besoin
  enabled: process.env.NODE_ENV === 'production',
});
```

*Un **hook de build** dans `vercel.json` (voir ci-dessus) exécute `prisma generate` – cela garantit également que l'instrumentations Sentry est incluse dans l'ensemble du code.*

---

## 2️⃣ PLAN DE TESTS

### 2.1 Stratégie et outils

| Niveau de test | Outil | Portée | Commande CI |
|---------------|------|-------|------------|
| **Unitaire** | `Jest` + `ts-jest` | Modules sources individuels (ex: services, utils) | `npm run test` |
| **Intégration** | `Jest Supertest` (ou `playwright` pour API) | Contrôleurs + routes Prisma | `npm run test:int` |
| **E2E** | `Cypress` (v10+) | Flux UI complet (signup, payment, etc.) | `npm run test:e2e` |
| **DB** | `prisma migrate test` + `prisma db seed` | état propre pour chaque pipeline | `npm run db:reset && npm run db:seed` |

*Cible de couverture* : **≥ 80 % de lignes couvertes** (exclure `node_modules`, fichiers `

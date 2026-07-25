# Constitution Projet — Agence Pro

**Version** : 1.0
**Date** : 24 Juillet 2026
**Auteur** : Ilyes — Orchestré via JARVIS [JARVIS]
**Statut** : Active

---

## Table des matières

1. [Vision](#1-vision)
2. [Stack Technique](#2-stack-technique)
3. [Architecture Modulaire — 15 modules](#3-architecture-modulaire--15-modules)
4. [MVP Scope (Phase 1)](#4-mvp-scope-phase-1)
5. [Phases de Développement](#5-phases-de-développement)
6. [Design Direction](#6-design-direction)
7. [Règles de Code](#7-règles-de-code)
8. [Business Model](#8-business-model)
9. [Sécurité & Conformité](#9-sécurité--conformité)
10. [Standards de Qualité](#10-standards-de-qualité)
11. [Livrables Attendus](#11-livrables-attendus)
12. [Décisions Architecturales Clés](#12-décisions-architecturales-clés)

---

## 1. Vision

### 1.1 Positionnement

**Agence Pro** est le **Salesforce des agences de voyages au Maghreb**.

C'est un SaaS Cloud Premium conçu pour digitaliser l'intégralité des opérations des agences de voyages algériennes et maghrébines. Il remplace définitivement Excel, WhatsApp Business, les classeurs papier, et tous les outils fragmentés que les agences utilisent aujourd'hui.

### 1.2 Problème résolu

Les agences de voyages en Algérie font face à :

- **Dossiers papier** : des centaines de fiches clients, passeports photocopiés, justificatifs éparpillés
- **Excel partout** : tableaux de bord impossibles à maintenir, zéro traçabilité, erreurs manuelles
- **WhatsApp comme CRM** : conversations éparpillées, pas de suivi structuré, perte d'informations
- **Pas de visibilité** : le gérant ne sait pas combien il gagne, combien il doit, quel est l'état de chaque dossier
- **Omra/Hajj en mode artisanal** : répartition chambres à la main, groupes gérés dans des cahiers
- **Facturation approximative** : TVA mal calculée, pertes de paiements, pas de reporting comptable fiable

### 1.3 Solution

Un SaaS tout-en-un avec 15+ modules couvrant :

| Domaine | Couverture |
|---------|-----------|
| Dossiers clients | Fiche 360°, documents, historique, OCR passeport |
| Omra & Hajj | Gestion groupes, chambres, répartition automatique |
| Visa | Suivi statuts, documents requis, checklist |
| Vols | Billets, compagnies, itinéraires |
| Hôtels & Transport | Allocation chambres, transfers |
| Comptabilité | Factures, TVA, dépenses, recettes, bénéfices |
| Communication | WhatsApp, Email, SMS, Push |
| IA | Devis auto, résumés, prévisions, OCR |
| Mobile | Self-service client, notifications |

### 1.4 Marché cible

- **Marché primaire** : Agences de voyages en Algérie (~3 000 agences enregistrées)
- **Marché secondaire** : Agences au Maroc, Tunisie, Libye, Mauritanie
- **Marché tertiaire** : Agences de voyage francophones en Afrique de l'Ouest

### 1.5 Métriques de succès (12 mois)

| Métrique | Objectif |
|----------|---------|
| Agences inscrites | 500+ |
| MRR (Monthly Recurring Revenue) | 5M+ DA |
| Churn mensuel | < 5% |
| NPS | > 50 |
| Temps moyen setup | < 30 minutes |

---

## 2. Stack Technique

### 2.1 Architecture globale

```
┌─────────────────────────────────────────────────────────────┐
│                      CLIENTS                                │
│  Browser (Desktop/Mobile)  │  React Native/Expo (Phase 3)  │
└──────────────┬──────────────┴──────────────┬────────────────┘
               │                             │
┌──────────────▼─────────────────────────────▼────────────────┐
│                    EDGE / CDN                                │
│                    Vercel Edge Network                       │
└──────────────┬──────────────────────────────────────────────┘
               │
┌──────────────▼──────────────────────────────────────────────┐
│                    APPLICATION                               │
│  Next.js 15 (App Router)  │  Server Components  │  RSC     │
│  API Routes (Edge Runtime) │  Server Actions     │  ISR     │
│  React 19 + TypeScript    │  Tailwind CSS 4     │  Zod     │
└──────────────┬──────────────┬───────────────┬───────────────┘
               │              │               │
┌──────────────▼───┐ ┌───────▼───────┐ ┌─────▼──────────────┐
│   Prisma ORM     │ │  Upstash      │ │  Vercel AI SDK     │
│   PostgreSQL     │ │  Redis        │ │  OpenAI/Anthropic  │
│   (Supabase)     │ │  (Upstash)    │ │                    │
└──────────────────┘ └───────────────┘ └────────────────────┘
               │
┌──────────────▼──────────────────────────────────────────────┐
│                    SERVICES EXTERNES                         │
│  Stripe │ CIB/Baridimob │ WhatsApp API │ Resend │ Sentry   │
└─────────────────────────────────────────────────────────────┘
```

### 2.2 Stack technique détaillée

| Couche | Technologie | Version | Justification |
|--------|------------|---------|---------------|
| **Framework** | Next.js | 15.x (App Router) | Server Components, Server Actions, Edge Runtime, ISR |
| **UI Library** | React | 19.x | Concurrent features, Server Components natifs |
| **Langage** | TypeScript | 5.x | Type safety, DX, refactoring sûr |
| **CSS** | Tailwind CSS | 4.x | Utility-first, design system, dark mode natif |
| **ORM** | Prisma | 6.x | Type-safe DB access, migrations, Client generé |
| **Database** | PostgreSQL (Supabase) | 16 | Robuste, RLS, real-time, backups auto |
| **Cache** | Redis (Upstash) | - | Rate limiting, sessions, cache requêtes |
| **Auth** | NextAuth v5 | Beta | RBAC 8 rôles, session JWT, OAuth providers |
| **IA** | Vercel AI SDK | 4.x | Streaming, tool calling, multi-provider |
| **Paiements** | Stripe + CIB/Baridimob | - | International + local Algérie |
| **Email** | Resend | - | Transactionnel fiable, templates React |
| **SMS** | Twilio / SMSLocal | - | Notifications SMS Algérie |
| **WhatsApp** | WhatsApp Business API | - | Notifications, chat client |
| **Mobile** | React Native / Expo | 52+ | Phase 3 — self-service client |
| **Deploy** | Vercel | - | Auto-deploy, preview, edge functions |
| **Monitoring** | Sentry | - | Error tracking, performance, APM |
| **Design** | Stripe/Linear/Notion inspired | - | Editorial luxe, premium feel |

### 2.3 Structure du projet

```
agence-pro/
├── src/
│   ├── app/                          # Next.js App Router
│   │   ├── (auth)/                   # Routes auth (login, register)
│   │   │   ├── login/
│   │   │   ├── register/
│   │   │   └── layout.tsx
│   │   ├── (dashboard)/              # Routes dashboard (protégées)
│   │   │   ├── dashboard/
│   │   │   ├── clients/
│   │   │   ├── omra/
│   │   │   ├── hajj/
│   │   │   ├── visa/
│   │   │   ├── vols/
│   │   │   ├── hotels/
│   │   │   ├── facturation/
│   │   │   ├── documents/
│   │   │   ├── notifications/
│   │   │   ├── parametres/
│   │   │   ├── rapports/
│   │   │   └── layout.tsx
│   │   ├── api/                      # API Routes
│   │   │   ├── auth/
│   │   │   ├── clients/
│   │   │   ├── dossiers/
│   │   │   ├── factures/
│   │   │   ├── documents/
│   │   │   ├── notifications/
│   │   │   ├── ia/
│   │   │   ├── webhooks/
│   │   │   └── health/
│   │   ├── portal/                   # Portail Client
│   │   │   ├── [token]/
│   │   │   └── layout.tsx
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/
│   │   ├── ui/                       # Composants UI de base
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Select.tsx
│   │   │   ├── Modal.tsx
│   │   │   ├── Table.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Badge.tsx
│   │   │   ├── Toast.tsx
│   │   │   └── ...
│   │   ├── layout/                   # Layout components
│   │   │   ├── Sidebar.tsx
│   │   │   ├── Topbar.tsx
│   │   │   ├── Breadcrumb.tsx
│   │   │   └── PageHeader.tsx
│   │   ├── clients/                  # Module CRM
│   │   ├── omra/                     # Module Omra/Hajj
│   │   ├── visa/                     # Module Visa
│   │   ├── vols/                     # Module Vols
│   │   ├── hotels/                   # Module Hôtels
│   │   ├── facturation/              # Module Comptabilité
│   │   ├── documents/                # Module Documents
│   │   ├── dashboard/                # Module Dashboard
│   │   ├── ia/                       # Module IA
│   │   ├── notifications/            # Module Notifications
│   │   ├── portail/                  # Portail Client
│   │   └── shared/                   # Composants partagés
│   ├── lib/
│   │   ├── db.ts                     # Prisma client
│   │   ├── redis.ts                  # Upstash Redis
│   │   ├── auth.ts                   # NextAuth config
│   │   ├── ai.ts                     # Vercel AI SDK
│   │   ├── stripe.ts                 # Stripe client
│   │   ├── whatsapp.ts               # WhatsApp API client
│   │   ├── email.ts                  # Resend client
│   │   ├── sms.ts                    # SMS client
│   │   ├── ocr.ts                    # OCR processing
│   │   ├── storage.ts                # Supabase Storage
│   │   ├── validators.ts             # Zod schemas globaux
│   │   ├── rbac.ts                   # RBAC logic
│   │   ├── utils.ts                  # Utilities
│   │   ├── constants.ts              # Constants
│   │   └── errors.ts                 # Error classes
│   ├── hooks/                        # Custom React hooks
│   ├── types/                        # TypeScript types
│   ├── styles/                       # Global styles
│   └── server/                       # Server-side logic
│       ├── actions/                  # Server Actions
│       ├── queries/                  # Database queries
│       └── services/                 # Business logic
├── prisma/
│   ├── schema.prisma
│   ├── seed.ts
│   └── migrations/
├── tests/
│   ├── unit/
│   ├── integration/
│   ├── e2e/
│   └── fixtures/
├── public/
├── scripts/
├── docs/
├── .env.example
├── .env.local
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
├── vitest.config.ts
├── playwright.config.ts
├── docker-compose.yml                # Local dev (PostgreSQL + Redis)
└── package.json
```

### 2.4 Variables d'environnement

```env
# Database
DATABASE_URL=postgresql://...
DIRECT_URL=postgresql://...

# Redis
UPSTASH_REDIS_REST_URL=https://...
UPSTASH_REDIS_REST_TOKEN=...

# Auth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=...

# AI
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-ant-...

# Payments
STRIPE_SECRET_KEY=sk_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_PUBLISHABLE_KEY=pk_...

# WhatsApp
WHATSAPP_API_TOKEN=...
WHATSAPP_PHONE_NUMBER_ID=...

# Email
RESEND_API_KEY=re_...

# SMS
TWILIO_ACCOUNT_SID=...
TWILIO_AUTH_TOKEN=...
TWILIO_PHONE_NUMBER=...

# Sentry
SENTRY_DSN=https://...
NEXT_PUBLIC_SENTRY_DSN=https://...

# Storage
SUPABASE_URL=https://...
SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
```

---

## 3. Architecture Modulaire — 15 modules

### 3.1 Vue d'ensemble

| # | Module | Description | Priorité |
|---|--------|-------------|----------|
| 1 | Auth & RBAC | Authentification + 8 rôles | P0 — MVP |
| 2 | CRM 360° | Fiche client, historique, documents | P0 — MVP |
| 3 | Omra/Hajj | Dossiers, groupes, chambres | P0 — MVP |
| 4 | Visa | Types, statuts, documents requis | P1 |
| 5 | Vols | Billets, compagnies, itinéraires | P1 |
| 6 | Hôtels & Transport | Allocation, transfers | P1 |
| 7 | Comptabilité | Factures, TVA, dépenses, recettes | P0 — MVP |
| 8 | Documents & OCR | Contrats, scans, OCR | P0 — MVP |
| 9 | Assistant IA | Devis, résumés, prévisions | P2 |
| 10 | Notifications | WhatsApp, Email, SMS, Push | P0 — MVP |
| 11 | Dashboard & KPIs | 100+ stats, alertes, rapports | P0 — MVP |
| 12 | Portail Client | Self-service, suivi dossier | P2 |
| 13 | Multi-agences | Isolement, reporting consolidé | P2 |
| 14 | Signature électronique | Signatures légales | P3 |
| 15 | QR Code | Identification, billets | P3 |

### 3.2 Module 1 — Auth & RBAC

**Objectif** : Sécuriser l'accès avec 8 rôles distincts et un contrôle d'accès granulaire.

#### Rôles et permissions

| Rôle | Accès principal | Peut faire | Ne peut pas |
|------|----------------|-----------|-------------|
| **Super Admin** | Tout le SaaS | Tout + config plateforme + multi-agences | — |
| **Admin** | Son agence | Tout dans son agence | Config plateforme |
| **Manager** | Équipe + dossiers | Superviser agents, valider dossiers, rapports | Config agence |
| **Agent** | Ses dossiers | Créer/modifier dossiers clients, visas, vols | Rapports globaux, comptabilité |
| **Comptable** | Finance | Factures, paiements, TVA, rapports financiers | Dossiers clients |
| **Guide** | Groupes assignés | Info groupes, contacts clients assignés | Tout le reste |
| **Commercial** | Prospects | Créer leads, devis, suivi prospects | Dossiers existants |
| **Client** | Son dossier | Portail self-service, documents, paiements | Backend |

#### RBAC Matrix

```
Ressource          │ SuperAdmin │ Admin │ Manager │ Agent │ Comptable │ Guide │ Commercial │ Client
───────────────────┼────────────┼───────┼─────────┼───────┼───────────┼───────┼────────────┼───────
Client (CRUD)      │     ✅     │  ✅   │   ✅    │  R/U  │     ❌     │  ❌   │     C      │  R(s)
Dossier Omra       │     ✅     │  ✅   │   ✅    │  ✅   │     ❌     │  R    │     ❌      │  R(s)
Visa               │     ✅     │  ✅   │   ✅    │  ✅   │     ❌     │  ❌   │     ❌      │  R(s)
Vol                │     ✅     │  ✅   │   ✅    │  ✅   │     ❌     │  R    │     ❌      │  R(s)
Facture            │     ✅     │  ✅   │   R     │  ❌   │    CRUD    │  ❌   │     ❌      │  R(s)
Document           │     ✅     │  ✅   │   ✅    │  ✅   │     R      │  R    │     ❌      │  R(s)
Rapport            │     ✅     │  ✅   │   ✅    │  ❌   │    ✅      │  ❌   │     ❌      │  ❌
Paramètres agence  │     ✅     │  ✅   │   ❌    │  ❌   │     ❌     │  ❌   │     ❌      │  ❌
Multi-agence       │     ✅     │  ❌   │   ❌    │  ❌   │     ❌     │  ❌   │     ❌      │  ❌

R=Read, C=Create, U=Update, D=Delete, R(s)=Read (son propre dossier uniquement)
```

#### Flux d'authentification

```
Utilisateur → Login (email/password)
    → NextAuth v5 credential provider
    → Vérification bcrypt
    → JWT token (session)
    → RBAC middleware (Chacune requête)
    → Data filtered by agence_id + role
```

### 3.3 Module 2 — CRM 360°

**Objectif** : Vue complète de chaque client, de son premier contact jusqu'à ses voyages répétés.

#### Entités

```prisma
model Client {
  id              String          @id @default(cuid())
  agenceId        String
  nom             String
  prenom          String
  telephone       String
  email           String?
  dateNaissance   DateTime?
  nationalite     String          @default("DZ")
  passportNumero  String?
  passportExpiry  DateTime?
  adresse         String?
  ville           String?
 Wilaya           String?
  codePostal      String?
  notes           String?
  tags            String[]
  statut          ClientStatut    @default(ACTIF)
  source          String?         // referral, web, whatsapp, telephone
  assigneA        String?         // agent userId
  createdAt       DateTime        @default(now())
  updatedAt       DateTime        @updatedAt

  // Relations
  agence          Agence          @relation(fields: [agenceId], references: [id])
  documents       Document[]
  dossiers        Dossier[]
  paiements       Paiement[]
  contacts        Contact[]
  historique       HistoriqueAction[]

  @@index([agenceId, nom])
  @@index([agenceId, telephone])
  @@index([agenceId, email])
}
```

#### Fiche client 360°

L'écran fiche client affiche :

1. **En-tête** : Photo, nom complet, téléphone, email, statut, tags
2. **Onglet Dossiers** : Tous les dossiers (Omra, Hajj, Visa, Tourisme)
3. **Onglet Documents** : Passeport, CNI, photos, contrats (avec OCR)
4. **Onglet Paiements** : Historique complet, solde, échéances
5. **Onglet Historique** : Timeline de toutes les actions (appels, emails, modifications)
6. **Onglet Notes** : Notes internes agents, conversations WhatsApp liées
7. **Sidebar** : Stats rapides (nombre voyages, montant total, dernier contact)

### 3.4 Module 3 — Gestion Omra/Hajj

**Objectif** : Gérer le cycle complet d'un dossier Omra/Hajj, du premier contact au retour.

#### Cycle de vie d'un dossier

```
PROSPECT → DEVIS → CONFIRME → EN_COURS → COMPLET → ENVOYE → ENVOYÉ → TERMINÉ
                                                            ↓
                                                    PROBLÈME → RÉSOLU
```

#### Entités principales

```prisma
model Dossier {
  id              String          @id @default(cuid())
  agenceId        String
  clientId        String
  typeDossier     TypeDossier     // OMRA, HAJJ, TOURISME, VISA
  statut          DossierStatut   @default(PROSPECT)
  dateDepart      DateTime
  dateRetour      DateTime?
  groupeId        String?
  hotelId         String?
  chambreId       String?
  volId           String?
  montantTotal    Decimal         @default(0)
  montantPaye     Decimal         @default(0)
  montantRestant  Decimal         @default(0)
  devise          String          @default("DZD")
  notes           String?
  documents       Document[]
  createdAt       DateTime        @default(now())
  updatedAt       DateTime        @updatedAt

  // Relations
  agence          Agence          @relation(fields: [agenceId], references: [id])
  client          Client          @relation(fields: [clientId], references: [id])
  groupe          Groupe?         @relation(fields: [groupeId], references: [id])
  hotel           Hotel?          @relation(fields: [hotelId], references: [id])
  chambre         Chambre?        @relation(fields: [chambreId], references: [id])
  vol             Vol?            @relation(fields: [volId], references: [id])
  paiements       Paiement[]
  documents       Document[]
  historique       HistoriqueAction[]
}
```

#### Gestion des groupes

```prisma
model Groupe {
  id              String          @id @default(cuid())
  agenceId        String
  nom             String          // "Omra Ramadan 2026 - Groupe 3"
  typeDossier     TypeDossier
  dateDepart      DateTime
  dateRetour      DateTime?
  capaciteMax     Int
  guideId         String?
  statut          GroupeStatut     @default(FORMATION)
  notes           String?

  // Relations
  dossiers        Dossier[]
  guide           User?           @relation(fields: [guideId], references: [id])
}
```

#### Répartition automatique des chambres

Algorithme de répartition :

```
1. Trier les dossiers confirmés par groupe
2. Pour chaque groupe :
   a. Calculer le nombre total de voyageurs
   b. Appliquer les règles :
      - Familles ensemble (même chambre)
      - Hommes/Femmes séparés sauf couples
      - Priorité ancienneté client
   c. Assigner les chambres disponibles dans l'hôtel
   d. Générer le tableau de répartition
   e. Notifier les clients concernés
```

### 3.5 Module 4 — Gestion Visa

**Objectif** : Suivre chaque demande de visa de la constitution du dossier au retour du passeport.

#### Types de visas gérés

| Type | Pays courants | Documents requis |
|------|--------------|-----------------|
| Touristique | France, Espagne, Italie, Turquie | Passeport, photo, justificatif hébergement, attestation employeur, relevé bancaire |
| Affaires | Tous | Passeport, photo, lettre d'invité, attestation entreprise |
| Hajj | Arabie Saoudite | Passeport, photo, certificat médical, vaccination |
| Transit | Divers | Passeport, billet de destination finale, visa du pays destination |
| Étudiant | France, Canada, UK | Passeport, photo, attestation inscription, preuve moyens financiers |

#### Statuts de visa

```
DOSSIER_CRÉÉ → DOCUMENTS_EN_COURS → DOSSIER_COMPLET → SOUMIS → EN_COURS_DE_TRAITEMENT
    → APPROUVÉ → PASSEPORT_RÉCUPÉRÉ → TERMINÉ
    → REFUSÉ → RECRÉÉ OU CLÔTURÉ
```

### 3.6 Module 5 — Gestion Vols

**Objectif** : Enregistrer, suivre et gérer les réservations de vols.

```prisma
model Vol {
  id              String          @id @default(cuid())
  agenceId        String
  compagnie       String          // Air Algérie, Turkish, Emirates, etc.
  numeroVol       String          // AH1234
  depart          String          // ALG
  arrivee         String          // JED
  dateDepart      DateTime
  dateArrivee     DateTime
  classe          ClasseVol       // ECONOMY, PREMIUM, BUSINESS
  prix            Decimal
  devise          String          @default("DZD")
  statut          VolStatut       @default(PLANIFIE)
  dossiers        Dossier[]
  createdAt       DateTime        @default(now())
  updatedAt       DateTime        @updatedAt
}
```

### 3.7 Module 6 — Hôtels & Transport

```prisma
model Hotel {
  id              String          @id @default(cuid())
  agenceId        String?
  nom             String
  ville           String
  pays            String
  etoiles         Int?
  adresse         String?
  telephone       String?
  email           String?
  contact         String?
  tarifNuit       Decimal?
  devise          String          @default("USD")
  chambres        Chambre[]
  createdAt       DateTime        @default(now())
  updatedAt       DateTime        @updatedAt
}

model Chambre {
  id              String          @id @default(cuid())
  hotelId         String
  numero          String
  type            TypeChambre     // SIMPLE, DOUBLE, TRIPLE, SUITE
  capacite        Int
  etage           Int?
  tarifNuit       Decimal
  devise          String          @default("USD")
  statut          StatutChambre   // DISPONIBLE, OCCUPEE, MAINTENANCE
  dossiers        Dossier[]
}
```

### 3.8 Module 7 — Comptabilité

**Objectif** : Complète comptabilité de l'agence avec TVA Algérienne, facturation, et reporting financier.

#### Entités

```prisma
model Facture {
  id              String          @id @default(cuid())
  agenceId        String
  clientId        String
  numero          String          @unique // FACT-2026-0001
  type            TypeFacture     // CLIENT, FOURNISSEUR, AVOIR
  statut          StatutFacture   // BROUILLON, EMISE, PAYEE, EN_RETARD, ANNULEE
  sousTotal       Decimal
  tva             Decimal         @default(0)  // 19% TVA Algérie
  tvaTaux         Decimal         @default(19)  // Taux TVA
  total           Decimal
  devise          String          @default("DZD")
  dateEmission    DateTime        @default(now())
  dateEcheance    DateTime
  datePaiement    DateTime?
  lignes          LigneFacture[]
  paiements       Paiement[]
  notes           String?
  createdAt       DateTime        @default(now())
  updatedAt       DateTime        @updatedAt
}

model LigneFacture {
  id              String          @id @default(cuid())
  factureId       String
  description     String
  quantite        Int             @default(1)
  prixUnitaire    Decimal
  montant         Decimal
  tvaApplicable   Boolean         @default(true)
}

model Paiement {
  id              String          @id @default(cuid())
  agenceId        String
  clientId        String
  factureId       String?
  dossierId       String?
  montant         Decimal
  devise          String          @default("DZD")
  methode         MethodePaiement // ESPECES, VIREMENT, CIB, BARIDIMOB, STRIPE, CHEQUE
  reference       String?
  statut          StatutPaiement  // EN_ATTENTE, CONFIRME, ECHOUE, REMBOURSE
  datePaiement    DateTime        @default(now())
  notes           String?
  createdAt       DateTime        @default(now())
}

model Depense {
  id              String          @id @default(cuid())
  agenceId        String
  categorie       CategorieDepense // SALAIRES, LOYER, FOURNITURES, TRANSPORT, MARKETING, AUTRE
  description     String
  montant         Decimal
  devise          String          @default("DZD")
  dateDepense     DateTime        @default(now())
  justificatif    String?         // URL document
  approuvePar     String?
  statut          StatutDepense   // EN_ATTENTE, APPROUVEE, REFUSEE
  createdAt       DateTime        @default(now())
}
```

#### KPIs financiers

- Chiffre d'affaires (J/H/M/A)
- Marge brute par dossier / par type / par agent
- Encaissements vs facturé
- Impayés et aging (30/60/90 jours)
- TVA collectée vs TVA déductible
- Dépenses par catégorie
- Bénéfice net mensuel
- Prévisions (IA)

### 3.9 Module 8 — Documents & OCR

**Objectif** : Centraliser tous les documents avec OCR automatique pour extraction de données.

#### Types de documents

| Catégorie | Types | OCR |
|-----------|-------|-----|
| Identité | Passeport, CNI, Acte naissance | Oui — extraction nom, prénom, n°, date expiry |
| Voyage | Billet avion, réservation hôtel, programme | Oui — extraction dates, noms, numéros |
| Financier | Facture, reçu, relevé bancaire | Oui — extraction montants, dates |
| Administratif | Assurance voyage, certificat médical, vaccination | Non |
| Contractuel | Contrat agence, devis signé | Non |

#### Stockage

```
supabase-storage/
├── {agenceId}/
│   ├── clients/
│   │   └── {clientId}/
│   │       ├── identite/
│   │       │   ├── passeport.pdf
│   │       │   └── cni.jpg
│   │       └── voyage/
│   │           └── {dossierId}/
│   ├── factures/
│   │   └── {factureId}.pdf
│   └── documents/
│       └── {type}/{id}.{ext}
```

### 3.10 Module 9 — Assistant IA

**Objectif** : Intégrer l'IA pour automatiser les tâches répétitives.

#### Fonctionnalités IA

| Fonctionnalité | Description | Modèle |
|---------------|-------------|--------|
| **Devis automatique** | Générer un devis complet à partir de la description | GPT-4o / Claude |
| **Résumé dossier** | Résumé automatique d'un dossier complexe | GPT-4o / Claude |
| **OCR passeport** | Extraction des infos d'un scan de passeport | Vision model |
| **Prévisions revenue** | Prédiction du CA basée sur l'historique | Fine-tuned |
| **Réponses WhatsApp** | Suggestion de réponses aux messages clients | GPT-4o |
| **Relance impayés** | Générer des messages de relance personnalisés | GPT-4o |
| **Détection anomalies** | Alertes sur transactions suspectes | Rules + IA |
| **Traduction FR/AR** | Traduction automatique des documents | GPT-4o |
| **Recherche sémantique** | Trouver des dossiers par description | Embeddings |

#### Interface IA

```typescript
// Exemple : Génération de devis
const devis = await agencePro.ai.genererDevis({
  clientId: "cl_xxx",
  type: "OMRA",
  dateDepart: "2026-03-01",
  dateRetour: "2026-03-15",
  nbPersonnes: 2,
  preferences: {
    classe: "ECONOMY",
    hotelEtoiles: 4,
    chambreType: "DOUBLE"
  }
});

// Retour structuré
{
  devis: {
    ligne1: { desc: "Vol aller-retour ALG→JED", montant: 85000 },
    ligne2: { desc: "Hébergement 14 nuits 4*", montant: 120000 },
    ligne3: { desc: "Transferts aéroport-hôtel", montant: 15000 },
    ligne4: { desc: "Assurance voyage", montant: 5000 },
    total: 225000,
    devise: "DZD",
    validite: 15 // jours
  },
  text: "Voici votre devis pour un voyage Omra de 14 jours..."
}
```

### 3.11 Module 10 — Notifications

**Objectif** : Multi-canal de communication intégré.

| Canal | Usage | Priorité |
|-------|-------|----------|
| **Email (Resend)** | Confirmations, factures, documents | P0 |
| **WhatsApp** | Suivi dossier, relances, communication client | P0 |
| **SMS** | Alertes critiques, rappels | P1 |
| **Push (Mobile)** | Notifications en temps réel | P2 |
| **In-app** | Alertes dashboard, mentions | P0 |

#### Templates de notifications

| Événement | Canal | Template |
|-----------|-------|----------|
| Nouveau dossier | WhatsApp | "Bonjour {prenom}, votre dossier Omra #{ref} a été créé." |
| Paiement reçu | Email + WhatsApp | Confirmation avec reçu PDF |
| Document manquant | WhatsApp | "Merci de nous envoyer : {liste}" |
| Visa approuvé | WhatsApp + SMS | "Votre visa {type} a été approuvé !" |
| Relance impayé | WhatsApp | "Rappel : facture {ref} de {montant} DA en attente." |
| Départ imminent | Email + WhatsApp | Programme complet + checklist |

### 3.12 Module 11 — Dashboard & KPIs

**Objectif** : Vue temps réel de toute l'activité de l'agence.

#### Dashboard par rôle

| Rôle | Dashboard affiche |
|------|------------------|
| **Super Admin** | Vue plateforme : nb agences, MRR, growth, alertes |
| **Admin** | Vue agence complète : CA, dossiers, équipe, comptabilité |
| **Manager** | Vue équipe : performance agents, dossiers en cours, blocages |
| **Agent** | Vue personnelle : mes dossiers, mes clients, mes tâches |
| **Comptable** | Vue finance : factures, impayés, TVA, trésorerie |
| **Guide** | Vue groupe : mes groupes, contacts, programme |
| **Commercial** | Vue pipeline : leads, devis, conversion |
| **Client** | Portail : mon dossier, mes paiements, mes documents |

#### 100+ KPIs

**Financiers (25+)**
- CA du jour / semaine / mois / année
- Panier moyen par client
- Marge brute par type de dossier
- Taux de conversion devis → dossier
- Encaissements du jour
- Impayés total et par ancienneté
- Prévisions IA du mois suivant

**Opérationnels (30+)**
- Nombre de dossiers actifs par statut
- Temps moyen par statut (lead time)
- Taux d'occupation hôtels
- Taux de remplissage groupes
- Documents en attente d'OCR
- Dossiers en retard

**Clients (20+)**
- Nouveaux clients / semaine
- Clients récurrents (%)
- Satisfaction (NPS si collecté)
- Top 10 clients par CA
- Clients inactifs (> 90 jours)

**Équipe (15+)**
- Dossiers traités par agent
- CA généré par agent
- Temps de réponse moyen
- Tâches en retard par agent

**IA (10+)**
- Devis générés par IA
- Temps gagné estimé
- Précision OCR
- Suggestions acceptées / refusées

### 3.13 Module 12 — Portail Client

**Objectif** : Self-service pour les clients avec URL unique sécurisée.

#### Fonctionnalités portail

| Fonctionnalité | Description |
|---------------|-------------|
| **Consultation dossier** | Voir l'avancement de son dossier Omra/Visa |
| **Documents** | Télécharger contrats, factures, billets |
| **Paiements** | Voir les échéances, payer en ligne (CIB/Stripe) |
| **Messages** | Communiquer avec l'agent via chat intégré |
| **Notifications** | Recevoir les updates en temps réel |
| **Profil** | Modifier ses informations personnelles |
| **Historique** | Voir tous ses voyages passés |

#### Sécurité portail

- URL unique par client : `/portal/{token_sécurisé}`
- Token JWT avec expiration (30 jours)
- Aucune donnée d'autres clients visible
- Sessions tracking

### 3.14 Module 13 — Multi-agences

**Objectif** : Permettre à une entreprise de gérer plusieurs agences avec reporting consolidé.

#### Isolation des données

```
Supabase RLS Policies:
  - Chaque agence ne voit QUE ses données
  - Super Admin voit TOUT
  - Reporting consolidé via vues agrégées (Super Admin uniquement)
```

#### Features multi-agences

- Création/suppression d'agences
- Paramètres indépendants (logo, couleurs, contacts)
- Utilisateurs affectés à une ou plusieurs agences
- Reporting consolidé (CA global, dossiers totaux, comparaison)
- Facturation centralisée
- Transfer de dossier entre agences

### 3.15 Module 14 — Signature électronique

**Objectif** : Signer les contrats et documents directement dans l'app.

- Intégration e-signature (DocuSign API ou solution locale)
- Signature sur tablette/écran tactile
- Horodatage et trace d'audit
- PDF signé archivé automatiquement

### 3.16 Module 15 — QR Code

**Objectif** : Identification rapide via QR code.

| QR Code | Contenu | Usage |
|---------|---------|-------|
| Client | ID client chiffré | Check-in rapide, identification |
| Billet | Données vol + dossier | Vérification à l'aéroport |
| Dossier | Référence dossier | Recherche rapide |
| Paiement | Référence paiement | Vérification en caisse |

---

## 4. MVP Scope (Phase 1)

### 4.1 Modules inclus dans le MVP

| Module | Scope MVP | Exclu du MVP |
|--------|-----------|-------------|
| **Auth & RBAC** | 5 rôles : Admin, Manager, Agent, Comptable, Client | Super Admin, Guide, Commercial |
| **CRM 360°** | Fiche client basique, liste, recherche, filtres | Tags avancés, scoring |
| **Omra/Hajj** | Dossiers Omra uniquement, statuts de base | Hajj, groupes, répartition chambres |
| **Visa** | — | Complet phase 2 |
| **Vols** | — | Complet phase 2 |
| **Hôtels & Transport** | — | Complet phase 2 |
| **Comptabilité** | Factures basiques, paiements enregistrés | TVA auto, rapports avancés, dépenses |
| **Documents** | Upload/download documents | OCR, stockage structuré |
| **IA** | — | Complet phase 2 |
| **Notifications** | Email uniquement | WhatsApp, SMS, Push |
| **Dashboard** | 15 KPIs essentiels | 100+ KPIs, alertes, prévisions |
| **Portail Client** | — | Complet phase 2 |
| **Multi-agences** | — | Complet phase 2 |
| **Signature** | — | Complet phase 3 |
| **QR Code** | — | Complet phase 3 |

### 4.2 Fonctionnalités MVP

1. **Inscription / Connexion** email + mot de passe
2. **Dashboard** : CA du jour, dossiers actifs, alerts basiques
3. **Liste clients** : recherche, filtres, création, modification
4. **Fiche client** : onglets dossiers, documents, paiements
5. **Créer un dossier Omra** : formulaire complet avec statuts
6. **Suivi statuts** : changement de statut avec timeline
7. **Upload documents** : PDF, images (5 max par dossier)
8. **Créer une facture** : lignes, total, statut
9. **Enregistrer un paiement** : montant, méthode, référence
10. **Email notifications** : confirmation création dossier, paiement reçu

### 4.3 Métriques MVP

| Métrique | Cible MVP |
|----------|----------|
| Temps de setup agence | < 15 minutes |
| Création dossier | < 3 minutes |
| Création facture | < 2 minutes |
| Temps de réponse API | < 200ms (p95) |
| Lighthouse score | > 90 |
| Test coverage | > 80% |

---

## 5. Phases de Développement

### Phase 1 — MVP (Semaines 1-8)

```
Semaine 1-2 : Setup projet, Auth, RBAC, DB schema
Semaine 3-4 : CRM, Dossiers Omra, Documents
Semaine 5-6 : Comptabilité, Dashboard, Notifications email
Semaine 7-8 : Testing, polish, deploiement staging
```

### Phase 2 — Core (Semaines 9-16)

```
Semaine 9-10 : Visa, Vols, Hôtels modules
Semaine 11-12 : WhatsApp integration, OCR
Semaine 13-14 : IA features, Portail Client
Semaine 15-16 : Multi-agences, Testing, Production
```

### Phase 3 — Premium (Semaines 17-24)

```
Semaine 17-18 : Mobile React Native/Expo
Semaine 19-20 : Signature électronique, QR Code
Semaine 21-22 : IA avancée (prévisions, anomalies)
Semaine 23-24 : White-label, Marketplace
```

### Phase 4 — Scale (Semaines 25+)

```
- Expansion Maroc, Tunisie
- API publique
- Intégrations tierces (compagnies aériennes)
- Offline-first mobile
- Marketplace plugins
```

---

## 6. Design Direction

### 6.1 Direction artistique

**Style** : Editorial / Luxe Médical inspiré

Ce style combine la précision d'un dashboard médical avec le luxe épuré d'une marque premium. L'objectif est de donner aux agences un outil qui fait professionnel, inspirant confiance, et agréable à utiliser quotidiennement.

### 6.2 Palette de couleurs

```css
:root {
  /* Primaire — Deep Teal */
  --color-primary-50: #E8F4F4;
  --color-primary-100: #C5E0E0;
  --color-primary-200: #9FCACA;
  --color-primary-300: #76B0B0;
  --color-primary-400: #4F9696;
  --color-primary-500: #1B4D4D;
  --color-primary-600: #164040;
  --color-primary-700: #103333;
  --color-primary-800: #0B2626;
  --color-primary-900: #061919;

  /* Accent — Warm Gold */
  --color-accent-50: #FBF6E9;
  --color-accent-100: #F4E8C5;
  --color-accent-200: #EDDA9E;
  --color-accent-300: #E5CB76;
  --color-accent-400: #DEBB4E;
  --color-accent-500: #C9A94E;
  --color-accent-600: #A68A3E;
  --color-accent-700: #836C2F;
  --color-accent-800: #604E20;
  --color-accent-900: #3D3011;

  /* Neutre — Cream */
  --color-cream-50: #FDFBF7;
  --color-cream-100: #FAF6EE;
  --color-cream-200: #F5EEE0;
  --color-cream-300: #EDE3CE;
  --color-cream-400: #E0D3B8;
  --color-cream-500: #D4C5A2;
  --color-cream-600: #B8A886;
  --color-cream-700: #9C8C6A;
  --color-cream-800: #80704E;
  --color-cream-900: #645432;

  /* Sémantique */
  --color-success: #22C55E;
  --color-warning: #F59E0B;
  --color-error: #EF4444;
  --color-info: #3B82F6;
}
```

### 6.3 Dark mode

```css
:root[data-theme="dark"] {
  --bg-primary: #0F1419;
  --bg-secondary: #1A2332;
  --bg-tertiary: #243044;
  --bg-card: #1E2A3A;
  --border-primary: #2D3E50;
  --border-secondary: #3A4F66;
  --text-primary: #F0F4F8;
  --text-secondary: #94A3B8;
  --text-muted: #64748B;

  --color-primary: #1B4D4D;
  --color-accent: #C9A94E;
}
```

### 6.4 Typographie

```css
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=DM+Sans:wght@400;500;600;700&display=swap');

:root {
  --font-heading: 'Inter', system-ui, sans-serif;
  --font-body: 'DM Sans', system-ui, sans-serif;
  --font-mono: 'JetBrains Mono', monospace;

  --text-xs: clamp(0.75rem, 0.7rem + 0.25vw, 0.8125rem);
  --text-sm: clamp(0.8125rem, 0.75rem + 0.3vw, 0.875rem);
  --text-base: clamp(0.875rem, 0.8rem + 0.35vw, 1rem);
  --text-lg: clamp(1rem, 0.9rem + 0.5vw, 1.125rem);
  --text-xl: clamp(1.125rem, 1rem + 0.6vw, 1.25rem);
  --text-2xl: clamp(1.25rem, 1.1rem + 0.75vw, 1.5rem);
  --text-3xl: clamp(1.5rem, 1.2rem + 1.5vw, 2rem);
  --text-4xl: clamp(2rem, 1.5rem + 2.5vw, 3rem);
}
```

### 6.5 Bilingue FR/AR avec RTL

```
Support :
- Français (par défaut)
- Arabe (avec RTL automatique)
- Changement de langue en temps réel sans rechargement
- Direction RTL gérée par Tailwind (rtl: prefix)
- Numerals : chiffres occidentaux en FR, chiffres arabes en AR
```

### 6.6 Layout

```
┌──────────────────────────────────────────────────────────────────┐
│  TOPBAR : Logo │ Recherche │ Notifications │ Langue │ Profil    │
├───────────┬──────────────────────────────────────────────────────┤
│           │  BREADCRUMBS                                        │
│  SIDEBAR  │  ─────────────────────────────────────────────────  │
│           │                                                     │
│  Module   │               CONTENT AREA                          │
│  items    │                                                     │
│           │  Tables, Forms, Cards, Charts                        │
│  Stats    │                                                     │
│  Quick    │                                                     │
│  actions  │                                                     │
│           │                                                     │
├───────────┴──────────────────────────────────────────────────────┤
│  FOOTER : Version │ Support │ Status                              │
└──────────────────────────────────────────────────────────────────┘
```

### 6.7 Composants UI prioritaires

| Composant | Description | Priority |
|-----------|-------------|----------|
| Sidebar collapsible | Navigation principale, icons + labels | P0 |
| Data Table | Tri, filtres, pagination, export, bulk actions | P0 |
| Form Builder | Formulaires réutilisables avec validation Zod | P0 |
| Card | Cartes d'info avec statuts, actions rapides | P0 |
| Modal/Dialog | Popins pour confirmations, éditions | P0 |
| Badge/Status | Statuts colorés (dossier, paiement, visa) | P0 |
| Chart (Recharts) | Graphiques KPI (line, bar, pie, area) | P0 |
| Calendar | Planning départ/retour groupes | P1 |
| Kanban Board | Pipeline de dossiers drag-and-drop | P1 |
| Timeline | Historique d'actions client | P1 |
| Command Palette | Recherche globale (Cmd+K) | P1 |
| Toast/Alert | Notifications in-app | P0 |
| Skeleton | Loading states | P0 |
| Empty State | États vides avec illustration | P0 |

### 6.8 Design tokens

```css
:root {
  /* Espacement */
  --space-1: 0.25rem;
  --space-2: 0.5rem;
  --space-3: 0.75rem;
  --space-4: 1rem;
  --space-5: 1.25rem;
  --space-6: 1.5rem;
  --space-8: 2rem;
  --space-10: 2.5rem;
  --space-12: 3rem;
  --space-16: 4rem;

  /* Border radius */
  --radius-sm: 0.375rem;
  --radius-md: 0.5rem;
  --radius-lg: 0.75rem;
  --radius-xl: 1rem;
  --radius-full: 9999px;

  /* Shadows */
  --shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  --shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1);
  --shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1);
  --shadow-xl: 0 20px 25px -5px rgb(0 0 0 / 0.1);

  /* Transitions */
  --transition-fast: 150ms cubic-bezier(0.4, 0, 0.2, 1);
  --transition-normal: 250ms cubic-bezier(0.4, 0, 0.2, 1);
  --transition-slow: 350ms cubic-bezier(0.4, 0, 0.2, 1);
}
```

---

## 7. Règles de Code

### 7.1 Principes fondamentaux

| Principe | Règle | Exemple |
|----------|-------|---------|
| **TDD** | Écrire le test AVANT le code | RED → GREEN → REFACTOR |
| **Immutabilité** | Jamais muter un objet existant | `{ ...obj, key: newValue }` pas `obj.key = v` |
| **Zod** | Validation partout : API, forms, DB | `z.object({ nom: z.string().min(2) })` |
| **Composants** | < 50 lignes, une seule responsabilité | Split en sous-composants |
| **Fichiers** | < 800 lignes max | Extraire dans des modules |
| **Coverage** | 80% minimum | Bloquant avant merge |
| **Sentry** | Sur CHAQUE API route | `withSentry(handler)` |

### 7.2 Patterns obligatoires

#### Validation Zod partout

```typescript
// schemas/client.ts
export const CreateClientSchema = z.object({
  nom: z.string().min(2, "Le nom doit avoir au moins 2 caractères").max(100),
  prenom: z.string().min(2).max(100),
  telephone: z.string().regex(/^\+?213[0-9]{9}$/, "Numéro algérien invalide"),
  email: z.string().email("Email invalide").optional(),
  dateNaissance: z.coerce.date().max(new Date(), "Date future invalide").optional(),
  nationalite: z.string().default("DZ"),
  adresse: z.string().max(500).optional(),
  ville: z.string().max(100).optional(),
  wilaya: z.string().optional(),
  notes: z.string().max(2000).optional(),
});

export type CreateClientInput = z.infer<typeof CreateClientSchema>;
```

#### Server Actions avec validation

```typescript
// app/(dashboard)/clients/actions.ts
"use server"

import { CreateClientSchema } from "@/schemas/client";
import { requireAuth } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function createClient(input: CreateClientInput) {
  // 1. Auth check
  const user = await requireAuth();

  // 2. Validate input
  const validated = CreateClientSchema.parse(input);

  // 3. Create (immutable — return new object)
  const client = await prisma.client.create({
    data: {
      ...validated,
      agenceId: user.agenceId,
      assigneA: user.id,
    },
  });

  // 4. Audit log
  await prisma.historiqueAction.create({
    data: {
      action: "CLIENT_CREATED",
      entityId: client.id,
      entityType: "CLIENT",
      userId: user.id,
      agenceId: user.agenceId,
      details: { nom: client.nom, prenom: client.prenom },
    },
  });

  return client;
}
```

#### API Routes avec Sentry

```typescript
// app/api/clients/route.ts
import { NextRequest, NextResponse } from "next/server";
import { withSentry } from "@sentry/nextjs";
import { requireAuth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { CreateClientSchema } from "@/schemas/client";

export const GET = withSentry(async (request: NextRequest) => {
  const user = await requireAuth();

  const clients = await prisma.client.findMany({
    where: { agenceId: user.agenceId },
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  return NextResponse.json({ data: clients });
});

export const POST = withSentry(async (request: NextRequest) => {
  const user = await requireAuth();
  const body = await request.json();

  const validated = CreateClientSchema.safeParse(body);
  if (!validated.success) {
    return NextResponse.json(
      { error: "Données invalides", details: validated.error.flatten() },
      { status: 400 }
    );
  }

  const client = await prisma.client.create({
    data: { ...validated.data, agenceId: user.agenceId },
  });

  return NextResponse.json({ data: client }, { status: 201 });
});
```

### 7.3 Naming conventions

| Élément | Convention | Exemple |
|---------|-----------|---------|
| Composants React | PascalCase | `ClientCard.tsx`, `DossierTimeline.tsx` |
| Fichiers pages | kebab-case | `page.tsx`, `layout.tsx` |
| Hooks | `use` prefix camelCase | `useClients.ts`, `useDossier.ts` |
| Schemas Zod | PascalCase + Schema | `CreateClientSchema`, `DossierFilterSchema` |
| Server Actions | camelCase | `createClient`, `updateDossierStatut` |
| API Routes | kebab-case | `/api/clients`, `/api/dossiers` |
| Types | PascalCase | `Client`, `Dossier`, `TypeDossier` |
| Enums | PascalCase | `DossierStatut`, `RoleUser` |
| Variables | camelCase | `agenceId`, `montantTotal` |
| Constants | UPPER_SNAKE | `MAX_DOCUMENTS`, `DEFAULT_PAGE_SIZE` |
| CSS vars | kebab-case | `--color-primary`, `--space-4` |

### 7.4 Anti-patterns bannis

```typescript
// JAMAIS :
let clients = [];  // mutation
clients.push(newClient);  // push = mutation

// JAMAIS :
const data = response.json();  // sans await

// JAMAIS :
<div dangerouslySetInnerHTML={{ __html: userContent }} />  // XSS

// JAMAIS :
const query = `SELECT * FROM clients WHERE nom = '${input}'`;  // SQL injection

// JAMAIS :
console.log("debug", sensitiveData);  // leaks

// TOUJOURS :
const clients = [...prevClients, newClient];  // immutable
const data = await response.json();  // await
<div>{sanitize(userContent)}</div>  // sanitized
const result = await prisma.client.findMany({ where: { nom: input } });  // Prisma
logger.info("action", { safeData });  // structured logging
```

### 7.5 Testing

```typescript
// tests/unit/schemas/client.test.ts
import { describe, it, expect } from "vitest";
import { CreateClientSchema } from "@/schemas/client";

describe("CreateClientSchema", () => {
  it("should accept valid client data", () => {
    const result = CreateClientSchema.safeParse({
      nom: "Benali",
      prenom: "Mohamed",
      telephone: "+213555123456",
    });
    expect(result.success).toBe(true);
  });

  it("should reject invalid phone number", () => {
    const result = CreateClientSchema.safeParse({
      nom: "Benali",
      prenom: "Mohamed",
      telephone: "0555123456",
    });
    expect(result.success).toBe(false);
  });

  it("should reject nom with less than 2 characters", () => {
    const result = CreateClientSchema.safeParse({
      nom: "B",
      prenom: "Mohamed",
      telephone: "+213555123456",
    });
    expect(result.success).toBe(false);
  });
});
```

---

## 8. Business Model

### 8.1 Plans tarifaires

#### Starter — 9 900 DA/mois

| Inclus | Limite |
|--------|--------|
| 1 agence | — |
| 3 utilisateurs | — |
| CRM + Dossiers Omra | — |
| Documents (100 Mo stockage) | — |
| Facturation basique | — |
| Dashboard (15 KPIs) | — |
| Email support | — |
| Pas de Visa/Vols/Hotels | — |
| Pas d'IA | — |
| Pas de WhatsApp | — |

#### Pro — 19 900 DA/mois

| Inclus | Limite |
|--------|--------|
| 3 agences | — |
| 10 utilisateurs | — |
| Tous modules sauf Multi-agences | — |
| Documents (1 Go stockage) | — |
| Comptabilité complète (TVA) | — |
| 100+ KPIs + rapports | — |
| WhatsApp intégré | — |
| IA (100 requêtes/mois) | — |
| Support prioritaire | — |
| Portail Client | — |

#### Enterprise — 39 900 DA/mois

| Inclus | Limite |
|--------|--------|
| Agences illimitées | — |
| Utilisateurs illimités | — |
| Tous modules | — |
| Documents (10 Go stockage) | — |
| IA illimitée | — |
| White-label | — |
| Multi-agences complet | — |
| Signature électronique | — |
| QR Code | — |
| API publique | — |
| Support dédié (téléphone) | — |
| SLA 99.9% | — |
| Formation sur site | — |

### 8.2 Essai gratuit

- **Durée** : 14 jours
- **Plan** : Équivalent Pro (tout inclus)
- **Limite** : 50 clients max, 10 dossiers
- **Carte** : Non requise (pas de surprise)
- **Conversion** : Email J-3, J-1 + offres spéciales premiers mois

### 8.3 Réductions

| Réduction | Condition | Montant |
|-----------|-----------|---------|
| Annuel | Paiement 12 mois d'avance | -20% |
| 2 ans | Engagement 24 mois | -30% |
| Early adopter | 100 premières agences | -40% premier an |
| Partenaire | Agences référentes | -15% permanent |
| Hajj/Omra saison | Avril-Mai (avant Hajj) | -10% |

### 8.4 Métriques business

| KPI | Objectif M3 | Objectif M6 | Objectif M12 |
|-----|-------------|-------------|--------------|
| Agences actives | 50 | 200 | 500+ |
| MRR | 500K DA | 2.5M DA | 5M+ DA |
| ARPU (Average Revenue Per User) | 15K DA | 16K DA | 17K DA |
| Churn mensuel | < 8% | < 6% | < 5% |
| LTV (Lifetime Value) | 180K DA | 240K DA | 340K DA |
| CAC (Customer Acquisition Cost) | 25K DA | 20K DA | 15K DA |
| LTV/CAC ratio | > 5x | > 8x | > 10x |

---

## 9. Sécurité & Conformité

### 9.1 Mesures de sécurité

| Domaine | Mesure |
|---------|--------|
| **Auth** | NextAuth v5, JWT secure, 2FA (phase 2) |
| **RBAC** | Middleware + RLS PostgreSQL |
| **Données** | Chiffrement au repos (AES-256), TLS 1.3 en transit |
| **Secrets** | Environment variables, jamais en code |
| **API** | Rate limiting (Upstash Redis), CORS strict |
| **Input** | Zod validation sur chaque endpoint |
| **SQL** | Prisma ORM (parameterized queries) |
| **XSS** | React escaping + sanitize pour user HTML |
| **CSRF** | NextAuth CSRF protection |
| **Files** | Validation type MIME, taille max 10 Mo |
| **Logs** | Sentry error tracking, structured logging |
| **Backup** | Supabase daily backups, point-in-time recovery |
| **Infra** | Vercel edge security, DDoS protection |

### 9.2 Conformité

- **RGPD** : Droit à l'oubli, portabilité, consentement
- **Données algériennes** : Respect des lois sur les données personnelles
- **Financial** : Traçabilité complète des paiements
- **Audit trail** : Chaque action enregistrée avec timestamp + user

### 9.3 RBAC + RLS PostgreSQL

```sql
-- Chaque table a une colonne agenceId
-- RLS Policy : chaque agence ne voit que ses données

CREATE POLICY "agence_isolation" ON clients
  FOR ALL
  USING (agence_id = current_setting('app.current_agence_id')::text);

-- Super Admin bypass
CREATE POLICY "super_admin_full_access" ON clients
  FOR ALL
  USING (current_setting('app.current_role') = 'SUPER_ADMIN');
```

---

## 10. Standards de Qualité

### 10.1 Code Review Checklist

Avant chaque merge :

- [ ] Tests unitaires pour chaque fonction
- [ ] Tests d'intégration pour chaque Server Action / API route
- [ ] Zod validation sur chaque input
- [ ] Sentry instrumenté sur chaque API route
- [ ] RBAC vérifié (le bon rôle a accès ?)
- [ ] Aucune donnée hardcodée (use constants)
- [ ] Pas de mutation (immutabilité)
- [ ] Composants < 50 lignes
- [ ] Fichiers < 800 lignes
- [ ] Pas de console.log
- [ ] Pas de secrets dans le code
- [ ] Loading et error states gérés
- [ ] Empty states définis
- [ ] Mobile responsive
- [ ] FR/AR supporté si applicable

### 10.2 Performance

| Métrique | Cible |
|----------|-------|
| Lighthouse Performance | > 90 |
| LCP | < 2.5s |
| INP | < 200ms |
| CLS | < 0.1 |
| TBT | < 200ms |
| API response time (p95) | < 200ms |
| Bundle size (initial) | < 200 KB gzipped |

### 10.3 Monitoring

| Outil | Usage |
|-------|-------|
| **Sentry** | Error tracking, performance, APM |
| **Vercel Analytics** | Web Vitals, usage |
| **Vercel Speed Insights** | Real user performance data |
| **Supabase Dashboard** | DB metrics, storage, auth |
| **Upstash Dashboard** | Redis metrics, rate limiting |

---

## 11. Livrables Attendus

### 11.1 Liste des 14 livrables

| # | Livrable | Description | Phase |
|---|----------|-------------|-------|
| 1 | **App web SaaS complète** | Interface Next.js 15 responsive, FR/AR, dark/light | 1-3 |
| 2 | **Backend API** | 50+ API routes, Server Actions, RBAC | 1-2 |
| 3 | **Base de données** | Schema Prisma complet, migrations, seed data | 1 |
| 4 | **Auth & RBAC** | 8 rôles, permissions granulaires, audit trail | 1 |
| 5 | **CRM 360°** | Fiche client complète, historique, documents | 1-2 |
| 6 | **Modules Omra/Hajj/Visa/Vols** | Gestion complète des voyages | 1-2 |
| 7 | **Module Comptabilité** | Factures, TVA, paiements, reporting | 1-2 |
| 8 | **Documents & OCR** | Upload, stockage, OCR automatique | 1-2 |
| 9 | **Assistant IA** | Devis, résumés, prévisions, OCR | 2-3 |
| 10 | **Notifications multi-canal** | WhatsApp, Email, SMS, Push | 1-2 |
| 11 | **Dashboard & 100+ KPIs** | Analytics complets, alertes, rapports | 1-2 |
| 12 | **Portail Client** | Self-service, suivi, paiements | 2 |
| 13 | **Multi-agences** | Isolation données, reporting consolidé | 2 |
| 14 | **Mobile App** | React Native/Expo self-service | 3 |

### 11.2 Documentation

| Document | Contenu |
|----------|---------|
| **Architecture Decision Records (ADRs)** | Chaque décision d'architecture documentée |
| **API Documentation** | OpenAPI/Swagger pour chaque endpoint |
| **User Guide** | Guide utilisateur par rôle (PDF + web) |
| **Admin Guide** | Guide setup et configuration |
| **Developer Guide** | Guide contribution, setup local |
| **Deployment Guide** | Guide déploiement production |

---

## 12. Décisions Architecturales Clés

### ADR-001 : Next.js App Router comme framework principal

**Contexte** : Choisir le framework pour l'application SaaS.

**Décision** : Next.js 15 avec App Router.

**Raisons** :
- Server Components pour réduire le client bundle
- Server Actions pour mutations sans API route boilerplate
- ISR pour les pages portail client (performance)
- Edge Runtime pour les API routes (latence)
- Écosystème mature, large communauté
- Déploiement natif sur Vercel

**Conséquences** :
- Pas de SSR pur ( acceptable pour ce use case)
- Dépendance à la plateforme Vercel (mitigé par l'export standalone)

### ADR-002 : PostgreSQL (Supabase) comme base de données

**Décision** : PostgreSQL via Supabase.

**Raisons** :
- Robustesse et fiabilité de PostgreSQL
- RLS (Row Level Security) natif pour l'isolation multi-agences
- Supabase fournit : auth, storage, real-time, backups
- Coût raisonnable pour le marché algérien
- Pas de vendor lock-in (PostgreSQL standard)

### ADR-003 : RLS pour l'isolation multi-agences

**Décision** : Utiliser les policies RLS PostgreSQL pour isoler les données par agence.

**Raisons** :
- Sécurité au niveau DB (pas seulement app)
- Impossible d'accéder aux données d'une autre agence même avec un bug applicatif
- Performance (pas de filtre WHERE sur chaque requête)
- Standard PostgreSQL

### ADR-004 : Zod comme validateur universel

**Décision** : Zod pour toute validation d'entrée.

**Raisons** :
- Type inference TypeScript intégré
- Validation côté client ET serveur avec le même schéma
- Messages d'erreur FR intégrés
- DX excellent

### ADR-005 : Paiement dual Stripe + CIB/Baridimob

**Décision** : Stripe pour international, CIB/Baridimob pour Algérie.

**Raisons** :
- La majorité des clients sont en Algérie (CIB/Baridimob indispensable)
- Stripe pour les prospects internationaux et les expansions futures
- CIB/Baridimob via intégration directe ou passerelle locale

### ADR-006 : Supabase Storage pour les fichiers

**Décision** : Utiliser Supabase Storage plutôt que S3/R2.

**Raisons** :
- Intégré avec le reste de l'infrastructure Supabase
- RLS sur les fichiers
- CDN intégré
- Pas de config supplémentaire

### ADR-007 : IA via Vercel AI SDK

**Décision** : Vercel AI SDK pour l'intégration IA.

**Raisons** :
- Streaming natif
- Multi-provider (OpenAI, Anthropic, etc.)
- Tool calling structuré
- Intégration Next.js parfaite

---

## Annexes

### Annexe A : Glossaire

| Terme | Définition |
|-------|-----------|
| **Omra** | Pèlerinage musulman non obligatoire à La Mecque |
| **Hajj** | Pèlerinage musulman obligatoire à La Mecque |
| **Visa** | Document officiel autorisant l'entrée dans un pays |
| **Dossier** | Ensemble des documents et informations pour un voyage |
| **Groupe** | Ensemble de voyageurs partant ensemble (Omra/Hajj) |
| **Wilaya** | Division administrative algérienne (province) |
| **DA** | Dinar Algérien (devise) |
| **CIB** | Carte Interbancaire (système de paiement algérien) |
| **Baridimob** | Système de paiement mobile algérien |
| **RLS** | Row Level Security (PostgreSQL) |
| **RBAC** | Role-Based Access Control |
| **OCR** | Optical Character Recognition |
| **MRR** | Monthly Recurring Revenue |
| **ARPU** | Average Revenue Per User |
| **LTV** | Lifetime Value |
| **CAC** | Customer Acquisition Cost |

### Annexe B : Contacts et Support

| Canal | Contact |
|-------|---------|
| Email support | support@agencepro.dz |
| WhatsApp Business | +213 XXX XXX XXX |
| Documentation | docs.agencepro.dz |
| Status page | status.agencepro.dz |

---

**Document approuvé par** : Ilyes
**Date d'approbation** : 24 Juillet 2026
**Prochaine révision** : 24 Août 2026

---

*Cette constitution est un document vivant. Elle sera mise à jour à chaque décision architecturale majeure.*

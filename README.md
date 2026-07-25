# Agence Pro

> SaaS de gestion pour agences de voyage au Maghreb

**Stack :** Next.js 15 · React 19 · TypeScript · Tailwind CSS 4 · Prisma 6 · PostgreSQL · Vercel

## Démarrage rapide

```bash
# 1. Installer les dépendances
npm install

# 2. Démarrer la DB locale
docker compose up -d

# 3. Configurer l'environnement
cp .env.example .env.local
# Éditer .env.local avec vos vraies valeurs

# 4. Initialiser la base de données
npx prisma db push
npx prisma db seed

# 5. Lancer le dev server
npm run dev
```

→ Ouvrir http://localhost:3000

## Commandes

| Commande | Description |
|----------|-------------|
| `npm run dev` | Serveur de développement (Turbopack) |
| `npm run build` | Build de production |
| `npm run lint` | Lint ESLint |
| `npm run type-check` | Vérification TypeScript |
| `npm test` | Tests unitaires (Vitest) |
| `npm run db:studio` | Prisma Studio (GUI base de données) |
| `npm run db:migrate` | Créer une migration |
| `npm run db:seed` | Peupler la DB avec des données démo |

## Architecture

Voir les docs dans `docs/` :
- `06-NORMALISATION.md` — Source de vérité (schéma, RBAC, statuts)
- `07-cahier-technique.md` — Architecture, API, DevOps

## Licence

Privé — Agence Pro © 2026

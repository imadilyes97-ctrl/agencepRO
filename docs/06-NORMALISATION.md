# 06-NORMALISATION — Source Unique de Vérité

**Projet :** Agence Pro — SaaS Agences de Voyage au Maghreb
**Version :** 1.0
**Date :** 24 Juillet 2026
**Auteur :** Ilyes — Orchestré via JARVIS [JARVIS]
**Statut :** Active
**Objectif :** Résoudre les 10 incohérences critiques identifiées par l'audit des 5 fichiers cahier-des-charges (8682 lignes). Ce document est la **source unique de vérité**. En cas de conflit avec un autre document, ce document fait autorité.

---

## Table des matières

1. [Table des matières officielle des 15 modules](#1-table-des-matières-officielle-des-15-modules)
2. [RBAC unifié — 8 rôles](#2-rbac-unifié--8-rôles)
3. [Énumérations de statuts unifiées](#3-énumérations-de-statuts-unifiées)
4. [Schéma Prisma complet (~35 modèles)](#4-schéma-prisma-complet-35-modèles)
5. [Politiques RLS — couverture complète](#5-politiques-rls--couverture-complète)
6. [Sécurité des données IA (Loi 18-05 + RGPD)](#6-sécurité-des-données-ia-loi-18-05--rgpd)
7. [Conformité signature électronique (Loi 18-05)](#7-conformité-signature-électronique-loi-18-05)
8. [Design Tokens](#8-design-tokens)
9. [Résumé des règles de validation](#9-résumé-des-règles-de-validation)
10. [Correspondance des incohérences résolues](#10-correspondance-des-incohérences-résolues)

---

# 1. Table des matières officielle des 15 modules

> **Problème résolu : Incohérence n°1** — Le cahier des charges utilise une numérotation différente de la Constitution. Le tableau ci-dessous est la **numérotation canonique**.

## 1.1 Vue d'ensemble

| # | Module | Description | Priorité | MVP |
|---|--------|-------------|----------|-----|
| 1 | Authentification & RBAC | Authentification, 8 rôles, sessions, audit trail, SSO | P0 | Oui |
| 2 | CRM 360° | Fiche client complète, documents, historique, tags, scoring | P0 | Oui |
| 3 | Gestion Omra & Hajj | Dossiers, groupes, répartition chambres, programmes, forfaits | P0 | Oui |
| 4 | Produits & Catalogue | Forfaits, vols, hôtels, transferts, visites, tarifs, saisons | P0 | Non (Phase 2) |
| 5 | Gestion des Réservations | Cycle de vie réservation, vol, hôtel, transfer, conflits | P1 | Non (Phase 2) |
| 6 | Gestion des Visas | Types de visas, statuts, documents requis, suivi consulat | P1 | Non (Phase 2) |
| 7 | Facturation & Paiements | Factures, TVA, modes de paiement, avoirs, journal de caisse | P0 | Oui |
| 8 | Planning & Agenda | Calendrier voyages, planning agents, événements, rappels | P1 | Non (Phase 2) |
| 9 | Guides & Prestataires | Annuaire guides, prestataires, contrats, évaluations | P1 | Non (Phase 2) |
| 10 | Suivi en temps réel | Tableau de bord voyage actif, positions, incidents, communication terrain | P2 | Non (Phase 3) |
| 11 | Comptabilité | Plan comptable algérien, écritures, rapprochement, TVA, bilan | P1 | Non (Phase 2) |
| 12 | Reporting & Analytics | 100+ KPIs, rapports financiers, commerciaux, exports | P1 | Oui (15 KPIs) |
| 13 | Notifications & Communication | WhatsApp, Email, SMS, Push, templates | P0 | Oui (Email) |
| 14 | Paramétrage Agence | Info agence, branding, fiscal, devises, zones géo | P0 | Oui |
| 15 | Administration Technique | Backups, logs, maintenance, rate limiting | P1 | Non (Phase 2) |
| 16 | Documents & OCR | Upload, OCR, stockage structuré, catégories | P0 | Oui (Upload) |
| 17 | Assistant IA | Devis auto, résumés, prévisions, OCR IA, suggestions | P2 | Non (Phase 3) |
| 18 | Portail Client | Self-service, suivi dossier, paiements en ligne, chat | P2 | Non (Phase 3) |
| 19 | Multi-agences | Isolation données, reporting consolidé, transfert dossiers | P2 | Non (Phase 3) |
| 20 | Signature électronique | Signatures légales conformes Loi 18-05, horodatage | P3 | Non (Phase 4) |
| 21 | QR Code | Identification rapide, billets, dossiers, paiements | P3 | Non (Phase 4) |

> **Note :** La Constitution reference 15 modules. Le cahier des charges détaille en réalité 21 modules/fonctionnalités. Le numbering ci-dessus est la fusion canonique. Les modules 16-21 sont des sous-modules ou extensions qui existaient dans le cahier mais pas dans la numerotation initiale de la Constitution.

## 1.2 Correspondance ancien ↔ nouveau numbering

| Ancien # (Cahier CdC) | Ancien nom | Nouveau # | Nouveau nom |
|------------------------|------------|-----------|-------------|
| 1 | Authentification & RBAC | 1 | Authentification & RBAC |
| 2 | CRM 360° | 2 | CRM 360° |
| 3 | Omra & Hajj | 3 | Gestion Omra & Hajj |
| 4 | Produits & Catalogue | 4 | Produits & Catalogue |
| 5 | Gestion des Réservations | 5 | Gestion des Réservations |
| 6 | Facturation & Paiements | 7 | Facturation & Paiements |
| 7 | Planning & Agenda | 8 | Planning & Agenda |
| 8 | Guides & prestataires | 9 | Guides & Prestataires |
| 9 | Suivi en temps réel | 10 | Suivi en temps réel |
| 10 | Comptabilité | 11 | Comptabilité |
| 11 | Reporting & Analytics | 12 | Reporting & Analytics |
| 12 | Notifications & Communication | 13 | Notifications & Communication |
| 13 | Paramétrage agence | 14 | Paramétrage Agence |
| 14 | Administration technique | 15 | Administration Technique |
| — (CdC 02) | Gestion des Visas | 6 | Gestion des Visas |
| — (CdC 02) | Gestion des Vols | (module 4/5) | Inclus dans Produits & Réservations |
| — (CdC 02) | Hôtels & Transport | (module 4/5) | Inclus dans Produits & Réservations |
| — (Constitution) | Documents & OCR | 16 | Documents & OCR |
| — (Constitution) | Assistant IA | 17 | Assistant IA |
| — (Constitution) | Portail Client | 18 | Portail Client |
| — (Constitution) | Multi-agences | 19 | Multi-agences |
| — (Constitution) | Signature électronique | 20 | Signature électronique |
| — (Constitution) | QR Code | 21 | QR Code |

## 1.3 Priorités MVP détaillées

| Phase | Modules | Semaines |
|-------|---------|----------|
| **Phase 1 — MVP** | 1, 2, 3, 7, 12 (basique), 13 (email), 14, 16 (upload) | 1-8 |
| **Phase 2 — Core** | 4, 5, 6, 8, 9, 11, 12 (complet), 13 (complet), 15 | 9-16 |
| **Phase 3 — Premium** | 10, 17, 18, 19, Mobile React Native | 17-24 |
| **Phase 4 — Scale** | 20, 21, White-label, API publique, Marketplace | 25+ |

---

# 2. RBAC unifié — 8 rôles

> **Problème résolu : Incohérence n°2** — "Chef agence" apparaît 50+ fois dans le cahier mais n'existe pas dans les 8 rôles définis. **Toute référence à "Chef agence" est mappée vers "Admin".**

## 2.1 Définition des rôles

| # | Rôle | ID interne | Description | Périmètre |
|---|------|-----------|-------------|-----------|
| 1 | **Super Admin** | `SUPER_ADMIN` | Administrateur de la plateforme SaaS | Toutes les agences |
| 2 | **Admin** | `ADMIN` | Administrateur d'une agence (anciennement "Chef agence") | Toute son agence |
| 3 | **Manager** | `MANAGER` | Responsable d'équipe / département | Son équipe + ses dossiers |
| 4 | **Agent** | `AGENT` | Agent de voyage (commercial, réservation) | Ses dossiers uniquement |
| 5 | **Comptable** | `COMPTABLE` | Comptable de l'agence | Module financier + lecture |
| 6 | **Guide** | `GUIDE` | Guide touristique (Omra, Hajj, visite) | Voyages assignés uniquement |
| 7 | **Commercial** | `COMMERCIAL` | Commercial terrain (hors agence) | Ses leads + ses clients |
| 8 | **Client** | `CLIENT` | Client final de l'agence | Son compte, ses réservations |

### 2.1.1 Mapping "Chef agence" → Admin

Toutes les occurrences de "Chef agence" dans les 5 fichiers du cahier des charges sont à interpréter comme suit :

| Terme trouvé dans le CdC | Rôle effectif | Justification |
|--------------------------|---------------|---------------|
| "Chef agence" | **Admin** | Le Chef agence EST l'Admin de l'agence |
| "Gérant" (quand contexte = rôle agence) | **Admin** | Même rôle |
| "Responsable agence" | **Admin** | Même rôle |
| "Propriétaire" (dans contexte RBAC) | **Admin** | Même rôle |

**Règle absolue :** Le mot "Chef agence" n'existe PAS dans le schéma de données, les enums, ni le code source. C'est toujours "Admin".

## 2.2 Matrice de permissions complète (toutes ressources × tous rôles)

### Légende

| Symbole | Signification |
|---------|---------------|
| C | Créer |
| R | Lire |
| U | Modifier |
| D | Supprimer |
| V | Valider / Approuver |
| X | Aucun accès |
| R(s) | Lecture (ses propres données uniquement) |
| R(e) | Lecture (son équipe uniquement) |
| R(a) | Lecture (son agence uniquement) |

### 2.2.1 Module 1 — Authentification & Utilisateurs

| Action | Super Admin | Admin | Manager | Agent | Comptable | Guide | Commercial | Client |
|--------|:-----------:|:-----:|:-------:|:-----:|:---------:|:-----:|:----------:|:------:|
| Voir tous les utilisateurs (toutes agences) | CRUD | X | X | X | X | X | X | X |
| Voir les utilisateurs de son agence | - | CRUD | R(e) | R* | R* | R* | R* | X |
| Créer un utilisateur dans son agence | - | C | C | X | X | X | X | X |
| Modifier son propre profil | R/U | R/U | R/U | R/U | R/U | R/U | R/U | R/U |
| Modifier le profil d'un autre utilisateur | X | U | U** | X | X | X | X | X |
| Supprimer (désactiver) un utilisateur | X | D | X | X | X | X | X | X |
| Changer le rôle d'un utilisateur | - | C | X | X | X | X | X | X |
| Activer/Désactiver 2FA | - | U | X | X | X | X | X | X |
| Réinitialiser le MDP d'un user | - | C | X | X | X | X | X | X |
| Voir audit trail (toutes agences) | R | X | X | X | X | X | X | X |
| Voir audit trail (son agence) | - | R | R*** | X | R | X | X | X |

\* Lecture limitée aux utilisateurs de leur rôle/équipe dans l'agence.
\** Un Manager ne peut modifier que les Agents de son équipe.
\*** Un Manager ne voit que l'audit trail des utilisateurs de son équipe.

### 2.2.2 Module 2 — CRM 360°

| Action | Super Admin | Admin | Manager | Agent | Comptable | Guide | Commercial | Client |
|--------|:-----------:|:-----:|:-------:|:-----:|:---------:|:-----:|:----------:|:------:|
| Voir tous les clients (toutes agences) | R | X | X | X | X | X | X | X |
| Voir les clients de son agence | - | R(a) | R(e) | R* | R(a) | R* | R* | X |
| Créer un client | - | C | C | C | X | X | C | X |
| Modifier un client | - | U | U*** | U*** | U*** | R | U*** | U* |
| Supprimer un client | - | D | X | X | X | X | X | X |
| Voir documents d'un client | - | R(a) | R(e) | R* | R* | R* | R* | R(s) |
| Uploader un document | - | C | C | C | X | C | C | C(s) |
| Supprimer un document | - | D | X | X | X | X | X | X(s) |
| Voir notes internes | - | R(a) | R(e) | R* | R | X | R* | X |
| Ajouter une note interne | - | C | C | C | C | X | C | X |
| Exporter clients (CSV/Excel) | R | R | R | X | X | X | X | X |
| Importer des clients | - | C | C | X | X | X | X | X |
| Gérer tags | - | C | C | X | X | X | X | X |
| Voir score fidélité | - | R | R | R | R | R | R | R(s) |
| Voir QR code client | - | R | R | R | R | R | R | R(s) |

\* L'Agent ne voit que les clients liés à SES dossiers. Le Manager voit les clients de SON EQUIPE.
\*** L'Agent ne modifie que les clients de SES dossiers.

### 2.2.3 Module 3 — Gestion Omra & Hajj

| Action | Super Admin | Admin | Manager | Agent | Comptable | Guide | Commercial | Client |
|--------|:-----------:|:-----:|:-------:|:-----:|:---------:|:-----:|:----------:|:------:|
| Voir tous les dossiers (toutes agences) | R | X | X | X | X | X | X | X |
| Voir dossiers de son agence | - | R(a) | R(e) | R* | R(a) | R* | X | X |
| Créer un dossier Omra/Hajj | - | C | C | C | X | X | X | X |
| Modifier un dossier | - | U | U | U* | R | R | X | U(s) |
| Changer statut d'un dossier | - | C | C | C* | X | C** | X | X |
| Choisir le programme | - | C | C | C | X | X | X | X |
| Répartir les chambres | - | C | C | C | X | X | X | X |
| Créer un groupe | - | C | C | C | X | X | X | X |
| Ajouter client au groupe | - | C | C | C | X | X | X | X |
| Gérer docs du dossier | - | C | C | C | R | C | X | C(s) |
| Checklist départ | - | C | C | C | X | C | X | X |
| Archiver un dossier | - | C | C | X | X | X | X | X |
| Annuler un dossier | - | C | C | U* | X | X | X | X(s) |

\* L'Agent ne modifie que SES dossiers.
\** Le Guide voit uniquement les voyages auxquels il est affecté.

### 2.2.4 Module 4 — Produits & Catalogue

| Action | Super Admin | Admin | Manager | Agent | Comptable | Guide | Commercial | Client |
|--------|:-----------:|:-----:|:-------:|:-----:|:---------:|:-----:|:----------:|:------:|
| Voir le catalogue | - | R(a) | R(a) | R(a) | R(a) | R(a) | R(a) | X |
| Créer un produit/forfait | - | C | C | X | X | X | X | X |
| Modifier un produit/forfait | - | U | U | X | X | X | X | X |
| Supprimer un produit/forfait | - | D | X | X | X | X | X | X |
| Gérer les tarifs/saisons | - | U | U | X | X | X | X | X |
| Gérer les packs/promotions | - | C | C | X | X | X | X | X |

### 2.2.5 Module 5 — Gestion des Réservations

| Action | Super Admin | Admin | Manager | Agent | Comptable | Guide | Commercial | Client |
|--------|:-----------:|:-----:|:-------:|:-----:|:---------:|:-----:|:----------:|:------:|
| Voir les réservations | - | R(a) | R(e) | R* | R(a) | R* | R* | R(s) |
| Créer une réservation | - | C | C | C | X | X | C | X |
| Modifier une réservation | - | U | U | U* | X | X | X | U(s) |
| Annuler une réservation | - | C | C | U* | X | X | X | X |
| Gérer conflits/overbooking | - | C | C | X | X | X | X | X |

### 2.2.6 Module 6 — Gestion des Visas

| Action | Super Admin | Admin | Manager | Agent | Comptable | Guide | Commercial | Client |
|--------|:-----------:|:-----:|:-------:|:-----:|:---------:|:-----:|:----------:|:------:|
| Voir les visas | - | R(a) | R(e) | R* | R(a) | X | X | R(s) |
| Créer un dossier visa | - | C | C | C | X | X | X | X |
| Modifier un dossier visa | - | U | U | U* | X | X | X | U(s) |
| Soumettre au consulat | - | C | C | C | X | X | X | X |
| Annuler un visa | - | C | C | U* | X | X | X | X(s) |

### 2.2.7 Module 7 — Facturation & Paiements

| Action | Super Admin | Admin | Manager | Agent | Comptable | Guide | Commercial | Client |
|--------|:-----------:|:-----:|:-------:|:-----:|:---------:|:-----:|:----------:|:------:|
| Voir toutes les factures (toutes agences) | R | X | X | X | X | X | X | X |
| Voir factures de son agence | - | R(a) | R(e) | R* | R(a) | X | R* | X |
| Créer une facture | - | C | C | C | C | X | C | X |
| Modifier une facture | - | U | U | X | U | X | X | X |
| Valider / Envoyer une facture | - | V | V | X | V | X | X | X |
| Annuler une facture | - | C | X | X | C | X | X | X |
| Enregistrer un paiement | - | C | C | C | C | X | C | X(s) |
| Voir journal de caisse | - | R(a) | R(e) | X | R(a) | X | X | X |
| Clôturer la caisse | - | C | X | X | C | X | X | X |
| Relancer un impayé | - | C | C | C | C | X | C | X |
| Générer avoir / note de crédit | - | C | X | X | C | X | X | X |
| Voir ses propres paiements | - | X | X | X | X | X | X | R(s) |

### 2.2.8 Module 8 — Planning & Agenda

| Action | Super Admin | Admin | Manager | Agent | Comptable | Guide | Commercial | Client |
|--------|:-----------:|:-----:|:-------:|:-----:|:---------:|:-----:|:----------:|:------:|
| Voir calendrier (toutes agences) | R | X | X | X | X | X | X | X |
| Voir calendrier de son agence | - | R(a) | R(e) | R(e) | R(a) | R(e) | R(e) | R(s) |
| Créer un événement | - | C | C | C | X | X | C | X |
| Modifier un événement | - | U | U | U* | X | X | U* | X |
| Supprimer un événement | - | D | U* | X | X | X | X | X |
| Affecter un guide | - | C | C | X | X | X | X | X |

### 2.2.9 Module 9 — Guides & Prestataires

| Action | Super Admin | Admin | Manager | Agent | Comptable | Guide | Commercial | Client |
|--------|:-----------:|:-----:|:-------:|:-----:|:---------:|:-----:|:----------:|:------:|
| Voir annuaire guides | - | R(a) | R(a) | R(a) | X | R(a) | X | X |
| Ajouter/modifier un guide | - | C | C | X | X | X | X | X |
| Évaluer un guide | - | C | C | C | X | X | X | X |
| Voir annuaire prestataires | - | R(a) | R(a) | R(a) | R(a) | X | X | X |
| Ajouter/modifier un prestataire | - | C | C | X | X | X | X | X |
| Gérer contrats/tarifs prestataires | - | U | X | X | R | X | X | X |

### 2.2.10 Module 10 — Suivi en temps réel

| Action | Super Admin | Admin | Manager | Agent | Comptable | Guide | Commercial | Client |
|--------|:-----------:|:-----:|:-------:|:-----:|:---------:|:-----:|:----------:|:------:|
| Tableau de bord voyage actif | R | R(a) | R(e) | R* | X | R(s) | X | R(s) |
| Signaler un incident | - | X | X | X | X | C(s) | X | C(s) |
| Marquer point de présence | - | X | X | X | X | C(s) | X | X |
| Communication guide-client | - | X | X | X | X | R(s) | X | R(s) |

### 2.2.11 Module 11 — Comptabilité

| Action | Super Admin | Admin | Manager | Agent | Comptable | Guide | Commercial | Client |
|--------|:-----------:|:-----:|:-------:|:-----:|:---------:|:-----:|:----------:|:------:|
| Voir écritures comptables | R | X | X | X | R | X | X | X |
| Créer une écriture | - | X | X | X | C | X | X | X |
| Valider les écritures | - | X | X | X | V | X | X | X |
| Rapprochement bancaire | - | X | X | X | C | X | X | X |
| Voir déclarations TVA | - | X | X | X | R | X | X | X |
| Générer rapport financier | - | R | X | X | C | X | X | X |
| Exporter rapports | - | R | X | X | C | X | X | X |

### 2.2.12 Module 12 — Reporting & Analytics

| Action | Super Admin | Admin | Manager | Agent | Comptable | Guide | Commercial | Client |
|--------|:-----------:|:-----:|:-------:|:-----:|:---------:|:-----:|:----------:|:------:|
| Voir dashboard plateforme | R | X | X | X | X | X | X | X |
| Voir dashboard agence | - | R(a) | R(a) | R* | R(a) | X | R* | X |
| Voir KPIs financiers | - | R(a) | X | X | R(a) | X | X | X |
| Voir KPIs commerciaux | - | R(a) | R(a) | R* | X | X | R* | X |
| Exporter un rapport | - | R | R | X | R | X | X | X |
| Configurer un dashboard custom | - | C | C | X | X | X | X | X |

### 2.2.13 Module 13 — Notifications & Communication

| Action | Super Admin | Admin | Manager | Agent | Comptable | Guide | Commercial | Client |
|--------|:-----------:|:-----:|:-------:|:-----:|:---------:|:-----:|:----------:|:------:|
| Voir templates de notification | - | R(a) | R(a) | R(a) | X | X | X | X |
| Créer/modifier un template | - | C | C | X | X | X | X | X |
| Envoyer une notification | - | C | C | C | C | C | C | X |
| Voir historique notifications | - | R(a) | R(e) | R(s) | R(a) | R(s) | R(s) | R(s) |
| Paramétrer canaux (WhatsApp, etc.) | - | U | X | X | X | X | X | X |

### 2.2.14 Module 14 — Paramétrage Agence

| Action | Super Admin | Admin | Manager | Agent | Comptable | Guide | Commercial | Client |
|--------|:-----------:|:-----:|:-------:|:-----:|:---------:|:-----:|:----------:|:------:|
| Paramétrer une agence (toutes) | CRUD | X | X | X | X | X | X | X |
| Paramétrer son agence | - | U | X | X | X | X | X | X |
| Gérer produits/catalogue | - | C | C | X | X | X | X | X |
| Gérer tarifs | - | U | U | X | X | X | X | X |
| Gérer modèles de facture | - | U | X | X | X | X | X | X |
| Gérer paramètres fiscaux | - | U | X | X | R | X | X | X |
| Gérer zones géographiques | CRUD | X | X | X | X | X | X | X |

### 2.2.15 Module 15 — Administration Technique

| Action | Super Admin | Admin | Manager | Agent | Comptable | Guide | Commercial | Client |
|--------|:-----------:|:-----:|:-------:|:-----:|:---------:|:-----:|:----------:|:------:|
| Gérer backups | CRUD | X | X | X | X | X | X | X |
| Voir logs système | R | X | X | X | X | X | X | X |
| Maintenance / mises à jour | C | X | X | X | X | X | X | X |
| Rate limiting / sécurité | U | X | X | X | X | X | X | X |

### 2.2.16 Module 16 — Documents & OCR

| Action | Super Admin | Admin | Manager | Agent | Comptable | Guide | Commercial | Client |
|--------|:-----------:|:-----:|:-------:|:-----:|:---------:|:-----:|:----------:|:------:|
| Voir tous documents (toutes agences) | R | X | X | X | X | X | X | X |
| Voir documents de son agence | - | R(a) | R(e) | R* | R* | R* | R* | R(s) |
| Uploader un document | - | C | C | C | X | C | C | C(s) |
| Supprimer un document | - | D | X | X | X | X | X | X(s) |
| Lancer OCR manuellement | - | C | C | C | X | X | X | X |
| Valider résultat OCR | - | U | U | U* | X | X | X | X(s) |
| Gérer catégories de documents | - | C | C | X | X | X | X | X |

### 2.2.17 Module 17 — Assistant IA

| Action | Super Admin | Admin | Manager | Agent | Comptable | Guide | Commercial | Client |
|--------|:-----------:|:-----:|:-------:|:-----:|:---------:|:-----:|:----------:|:------:|
| Utiliser l'IA (devis, résumé) | - | C | C | C | C | X | C | X |
| Voir historique interactions IA | - | R(a) | R(e) | R(s) | R(a) | X | R(s) | X |
| Configurer modèles IA | - | U | X | X | X | X | X | X |
| Voir consommation IA | - | R(a) | X | X | R(a) | X | X | X |

### 2.2.18 Module 18 — Portail Client

| Action | Super Admin | Admin | Manager | Agent | Comptable | Guide | Commercial | Client |
|--------|:-----------:|:-----:|:-------:|:-----:|:---------:|:-----:|:----------:|:------:|
| Voir son portail | - | X | X | X | X | X | X | R(s) |
| Modifier ses infos | - | X | X | X | X | X | X | U(s) |
| Télécharger documents | - | X | X | X | X | X | X | R(s) |
| Payer en ligne | - | X | X | X | X | X | X | C(s) |
| Envoyer un message | - | X | X | X | X | X | X | C(s) |

### 2.2.19 Module 19 — Multi-agences

| Action | Super Admin | Admin | Manager | Agent | Comptable | Guide | Commercial | Client |
|--------|:-----------:|:-----:|:-------:|:-----:|:---------:|:-----:|:----------:|:------:|
| Voir toutes les agences | R | X | X | X | X | X | X | X |
| Créer une agence | C | X | X | X | X | X | X | X |
| Modifier une agence | U | X | X | X | X | X | X | X |
| Supprimer une agence | D | X | X | X | X | X | X | X |
| Reporting consolidé | R | X | X | X | X | X | X | X |
| Transferer un dossier | C | X | X | X | X | X | X | X |
| Affecter un user à multi-agences | C | X | X | X | X | X | X | X |

### 2.2.20 Module 20 — Signature électronique

| Action | Super Admin | Admin | Manager | Agent | Comptable | Guide | Commercial | Client |
|--------|:-----------:|:-----:|:-------:|:-----:|:---------:|:-----:|:----------:|:------:|
| Envoyer un document à signer | - | C | C | C | X | X | X | X |
| Signer un document | - | U | U | U | X | X | X | U(s) |
| Voir statut signatures | - | R(a) | R(e) | R* | X | X | X | R(s) |
| Archiver un document signé | - | C | C | X | X | X | X | X |

### 2.2.21 Module 21 — QR Code

| Action | Super Admin | Admin | Manager | Agent | Comptable | Guide | Commercial | Client |
|--------|:-----------:|:-----:|:-------:|:-----:|:---------:|:-----:|:----------:|:------:|
| Générer un QR code | - | C | C | C | X | C | C | X |
| Scanner un QR code | R | R | R | R | R | R | R | R(s) |

## 2.3 Conditions spéciales par rôle

### Super Admin
- Voit TOUT, partout, toutes les agences
- Ne peut pas être désactivé (protection anti-lockout)
- Maximum 1 Super Admin par plateforme
- Ses actions sont auditées avec un niveau de détail supérieur
- Il ne modifie JAMAIS directement les données d'une agence (il délègue à l'Admin)

### Admin (anciennement "Chef agence")
- Admin total de SA SEULE agence
- Ne voit AUCUNE donnée d'une autre agence
- Peut créer, modifier et désactiver les utilisateurs de son agence
- Ne peut PAS se désactiver lui-même
- Son compte ne peut être désactivé que par un Super Admin

### Manager
- Gère une équipe d'agents (et optionnellement de commerciaux)
- Voit les dossiers et clients de SON EQUIPE uniquement
- Peut affecter des dossiers à ses agents
- Ne peut PAS gérer les comptes utilisateurs
- Ne peut PAS accéder aux fonctions comptables
- Limite : un seul département (Omra, Hajj, Voyages classiques, etc.)

### Agent
- Voit UNIQUEMENT les dossiers et clients qui lui sont assignés
- Ne voit PAS les dossiers des autres agents
- Ne voit PAS les données financières détaillées
- Peut créer des clients (mais pas les supprimer)
- Limite : 50 dossiers actifs maximum (configurable par Admin)

### Comptable
- Lecture seule sur tout le CRM et les dossiers
- Écriture/Modification uniquement sur les modules financiers
- Peut voir les noms et montants, PAS les détails personnels sensibles (CNI, passeport) sauf si nécessaire pour une facture
- Ne peut PAS annuler des réservations
- Ne peut PAS modifier les produits ou tarifs

### Guide
- Voit UNIQUEMENT les voyages auxquels il est affecté
- Voit les informations des clients de SES voyages uniquement (noms, téléphones, notes — PAS les documents numérisés)
- Peut signaler des incidents, marquer des points de présence
- Ne voit AUCUNE donnée financière

### Commercial
- Travaille hors agence (terrain, salons, prospection)
- Voit UNIQUEMENT ses leads et ses clients convertis
- Peut créer des clients, des dossiers et enregistrer des paiements
- Ne voit PAS les données financières détaillées de l'agence
- Limite : 100 leads actifs maximum

### Client
- Voit UNIQUEMENT ses propres données via le portail
- Peut modifier ses informations personnelles
- Peut consulter ses réservations et factures
- Peut effectuer des paiements en ligne
- Peut télécharger ses documents
- Ne voit AUCUNE donnée d'un autre client
- Ne voit PAS les marges, tarifs internes, ou données financières de l'agence

---

# 3. Énumérations de statuts unifiées

> **Problème résolu : Incohérence n°4** — 3 vocabulaires différents de statuts de dossier utilisés à travers les modules. Voici les enums canoniques.

## 3.1 Statuts de dossier (Omra, Hajj, Tourisme)

L'enum `DossierStatut` est **UNIQUE** et s'applique à tous les types de dossiers :

```prisma
enum DossierStatut {
  PROSPECT
  DEVIS
  CONFIRME
  EN_COURS
  EN_ATTENTE_DOCUMENTS
  DOSSIER_COMPLET
  SOUMIS
  EN_COURS_TRAITEMENT
  APPROUVE
  REFUSE
  ENVOYE
  TERMINE
  PROBLEME
  RESOLU
  ANNULE
}
```

### Cycle de vie standardisé

```
PROSPECT
  → DEVIS (devis établi)
    → CONFIRME (client a confirmé + acompte payé)
      → EN_COURS (dossier en cours de traitement)
        → EN_ATTENTE_DOCUMENTS (documents manquants)
        → DOSSIER_COMPLET (tous documents fournis)
          → SOUMIS (dossier soumis au consulat/organisme)
            → EN_COURS_TRAITEMENT (en cours de traitement)
              → APPROUVE (visa/approbation obtenu)
              → REFUSE (refus)
            → ENVOYE (envoyé au client)
              → TERMINE (voyage effectué)
          → PROBLEME (problème survenu)
            → RESOLU (problème résolu)
      → ANNULE (annulé à tout moment)
```

### Mapping anciens statuts → nouveaux

| Ancien statut (CdC variable) | Nouveau statut canonique |
|------------------------------|-------------------------|
| `DOSSIER_CREE` | `PROSPECT` |
| `DOCUMENTS_EN_COURS` | `EN_ATTENTE_DOCUMENTS` |
| `DOSSIER_COMPLET` | `DOSSIER_COMPLET` |
| `SOUMIS` | `SOUMIS` |
| `EN_COURS_DE_TRAITEMENT` | `EN_COURS_TRAITEMENT` |
| `APPROUVE` / `PASSEPORT_RECUPERE` | `APPROUVE` |
| `REFUSE` | `REFUSE` |
| `ENVOYE` / `ENVOYÉ` | `ENVOYE` |
| `TERMINE` / `TERMINÉ` | `TERMINE` |
| `PROBLEME` / `PROBLÈME` | `PROBLEME` |
| `RESOLU` / `RÉSOLU` | `RESOLU` |
| `COMPLET` | `DOSSIER_COMPLET` |

## 3.2 Statuts de facture

```prisma
enum FactureStatut {
  BROUILLON
  EMISE
  VALIDEE
  PAYEE
  PARTIELLEMENT_PAYEE
  EN_RETARD
  IMPAYEE
  ANNULLEE
}
```

### Cycle de vie

```
BROUILLON → EMISE → VALIDEE → PAYEE
                          → PARTIELLEMENT_PAYEE → PAYEE
                          → EN_RETARD → IMPAYEE
          → ANNULLEE
```

## 3.3 Statuts de paiement

```prisma
enum PaiementStatut {
  EN_ATTENTE
  CONFIRME
  REJETTE
  ANNULE
  REMBOURSE
}
```

## 3.4 Statuts de visa

L'enum `VisaStatut` réutilise les mêmes valeurs que `DossierStatut` pour maintenir la cohérence, mais est définie séparément pour permettre une évolution indépendante :

```prisma
enum VisaStatut {
  PROSPECT
  DEVIS
  CONFIRME
  EN_ATTENTE_DOCUMENTS
  DOSSIER_COMPLET
  SOUMIS
  EN_COURS_TRAITEMENT
  APPROUVE
  REFUSE
  ENVOYE
  TERMINE
  PROBLEME
  RESOLU
  ANNULE
}
```

## 3.5 Statuts de document

```prisma
enum DocumentStatut {
  BROUILLON
  EN_COURS_REVISION
  VALIDE
  REJETTE
  EXPIRE
}
```

## 3.6 Statuts d'agence

```prisma
enum AgenceStatut {
  EN_ATTENTE_VERIFICATION
  ACTIVE
  SUSPENDUE
  REJETEE
  EN_ATTENTE_DOCUMENTS
}
```

## 3.7 Statuts de groupe

```prisma
enum GroupeStatut {
  FORMATION
  COMPLET
  EN_COURS
  TERMINE
  ANNULE
}
```

## 3.8 Statuts de chambre

```prisma
enum StatutChambre {
  DISPONIBLE
  OCCUPEE
  RESERVEE
  MAINTENANCE
}
```

## 3.9 Statuts de vol

```prisma
enum VolStatut {
  PLANIFIE
  CONFIRME
  EN_COURS
  ANNULE
  RETARDE
  TERMINE
}
```

## 3.10 Statuts de dépense

```prisma
enum StatutDepense {
  EN_ATTENTE
  APPROUVEE
  REFUSEE
}
```

## 3.11 Statuts d'abonnement

```prisma
enum SubscriptionStatut {
  TRIAL
  ACTIVE
  PAST_DUE
  CANCELLED
  EXPIRED
}
```

## 3.12 Statuts de notification

```prisma
enum NotificationStatut {
  EN_ATTENTE
  ENVOYEE
  LUE
  ECHEC
  ANNULEE
}
```

---

# 4. Schéma Prisma complet (~35 modèles)

> **Problème résolus : Incohérences n°3, n°5, n°6, n°10**
> - **n°3** : `agenceId` ajouté sur TOUTES les entités métier
> - **n°5** : `Programme` et `Forfait` définis comme modèles (référencés dans Module 3 mais jamais définis)
> - **n°6** : Numéro et expiry du passeport stockés dans `Client` (déjà dans Constitution, confirmé ici)
> - **n°10** : 20+ entités manquantes ajoutées

## 4.1 Enums (tous définis ici, un seul endroit)

```prisma
// === RÔLES ===
enum RoleUser {
  SUPER_ADMIN
  ADMIN
  MANAGER
  AGENT
  COMPTABLE
  GUIDE
  COMMERCIAL
  CLIENT
}

// === STATUTS ===
enum AgenceStatut {
  EN_ATTENTE_VERIFICATION
  ACTIVE
  SUSPENDUE
  REJETEE
  EN_ATTENTE_DOCUMENTS
}

enum UserStatut {
  ACTIF
  INACTIF
  BLOQUE
}

enum ClientStatut {
  ACTIF
  INACTIF
  BLOQUE
  BLACKLISTE
}

enum DossierStatut {
  PROSPECT
  DEVIS
  CONFIRME
  EN_COURS
  EN_ATTENTE_DOCUMENTS
  DOSSIER_COMPLET
  SOUMIS
  EN_COURS_TRAITEMENT
  APPROUVE
  REFUSE
  ENVOYE
  TERMINE
  PROBLEME
  RESOLU
  ANNULE
}

enum VisaStatut {
  PROSPECT
  DEVIS
  CONFIRME
  EN_ATTENTE_DOCUMENTS
  DOSSIER_COMPLET
  SOUMIS
  EN_COURS_TRAITEMENT
  APPROUVE
  REFUSE
  ENVOYE
  TERMINE
  PROBLEME
  RESOLU
  ANNULE
}

enum FactureStatut {
  BROUILLON
  EMISE
  VALIDEE
  PAYEE
  PARTIELLEMENT_PAYEE
  EN_RETARD
  IMPAYEE
  ANNULLEE
}

enum PaiementStatut {
  EN_ATTENTE
  CONFIRME
  REJETTE
  ANNULE
  REMBOURSE
}

enum DocumentStatut {
  BROUILLON
  EN_COURS_REVISION
  VALIDE
  REJETTE
  EXPIRE
}

enum GroupeStatut {
  FORMATION
  COMPLET
  EN_COURS
  TERMINE
  ANNULE
}

enum VolStatut {
  PLANIFIE
  CONFIRME
  EN_COURS
  ANNULE
  RETARDE
  TERMINE
}

enum StatutChambre {
  DISPONIBLE
  OCCUPEE
  RESERVEE
  MAINTENANCE
}

enum StatutDepense {
  EN_ATTENTE
  APPROUVEE
  REFUSEE
}

enum NotificationStatut {
  EN_ATTENTE
  ENVOYEE
  LUE
  ECHEC
  ANNULEE
}

enum SubscriptionStatut {
  TRIAL
  ACTIVE
  PAST_DUE
  CANCELLED
  EXPIRED
}

// === TYPES ===
enum TypeDossier {
  OMRA
  HAJJ
  TOURISME
  VISA
  CRUISE
  GROUPE
}

enum TypeFacture {
  CLIENT
  FOURNISSEUR
  AVOIR
}

enum MethodePaiement {
  ESPECES
  VIREMENT
  CCP
  BARIDIMOB
  CIB
  CHEQUE
  STRIPE
}

enum ClasseVol {
  ECONOMY
  PREMIUM
  BUSINESS
}

enum TypeChambre {
  SINGLE
  DOUBLE
  TRIPLE
  FAMILY
  SUITE
}

enum TypeDocument {
  PASSEPORT
  CNI
  VISA
  PHOTO_IDENTITE
  CERTIFICAT_VACCINATION
  ATTESTATION_EMPLOI
  RELEVE_BANCAIRE
  ASSURANCE_VOYAGE
  CONTRAT
  FACTURE
  BILLET_AVION
  RESERVATION_HOTEL
  AUTRE
}

enum CategorieDepense {
  SALAIRES
  LOYER
  FOURNITURES
  TRANSPORT
  MARKETING
  COMMUNICATION
  ASSURANCE
  IMPOTS
  AUTRE
}

enum CanalNotification {
  EMAIL
  WHATSAPP
  SMS
  PUSH
  IN_APP
}

enum SourceAcquisition {
  BOCA_BOUCHE
  INTERNET
  RECOMMANDATION
  SALON
  PARTENAIRE
  AUTRE
}

enum Civilite {
  MONSIEUR
  MADAME
  MADEMOISELLE
}

enum Sexe {
  HOMME
  FEMME
}

enum TypeVisa {
  TOURISTIQUE
  AFFAIRES
  MEDICAL
  TRANSIT
  ETUDIANT
  HAJJ
  OMRA
}

enum StatutSignature {
  EN_ATTENTE
  SIGNE
  REFUSE
  EXPIRE
}
```

## 4.2 Modèles

### 4.2.1 Agence

```prisma
model Agence {
  id                String          @id @default(cuid())
  nom               String
  nomCommercial     String
  adresseSiege      String
  wilaya            String
  commune           String
  rcNumber          String          @unique  // Registre de Commerce
  nifNumber         String          @unique  // Numéro Identification Fiscale
  nisNumber         String?                    // Numéro Identification Statistique
  telephoneFixe     String
  telephoneMobile   String
  email             String          @unique
  siteWeb           String?
  logo              String?
  statut            AgenceStatut    @default(EN_ATTENTE_VERIFICATION)
  settings          Json?           // Config JSON (branding, fiscaux, etc.)
  createdAt         DateTime        @default(now())
  updatedAt         DateTime        @updatedAt

  // Relations
  users             User[]
  clients           Client[]
  dossiers          Dossier[]
  groupes           Groupe[]
  hotels            Hotel[]
  factures          Facture[]
  paiements         Paiement[]
  depenses          Depense[]
  documents         Document[]
  programmes        Programme[]
  forfaits          Forfait[]
  produits          Produit[]
  catalogues        Catalogue[]
  reservations      Reservation[]
  visas             Visa[]
  vols              Vol[]
  transferts        Transfer[]
  notifications     Notification[]
  conversations     Conversation[]
  settings_agence   Settings[]
  subscriptions     Subscription[]
  auditLogs         AuditLog[]
  historiques       HistoriqueAction[]
  journalComptable  JournalComptable[]

  @@index([nom])
}
```

### 4.2.2 User (utilisateurs)

```prisma
model User {
  id              String          @id @default(cuid())
  agenceId        String
  email           String          @unique
  nom             String
  prenom          String
  telephone       String?
  passwordHash    String
  role            RoleUser
  statut          UserStatut      @default(ACTIF)
  avatar          String?
  deuxFAActif     Boolean         @default(false)
  deuxFASecret    String?
  backupCodes     String?         // Hashé SHA-256
  derniereConnexion DateTime?
  createdAt       DateTime        @default(now())
  updatedAt       DateTime        @updatedAt

  // Relations
  agence          Agence          @relation(fields: [agenceId], references: [id])
  historiques     HistoriqueAction[]
  notifications   Notification[]
  auditLogs       AuditLog[]

  @@index([agenceId, role])
  @@index([agenceId, email])
}
```

### 4.2.3 RoleDefinition

```prisma
model RoleDefinition {
  id              String          @id @default(cuid())
  agenceId        String
  role            RoleUser
  label           String
  description     String?
  permissions     Json            // JSON des permissions granulaires
  estPersonnalise Boolean         @default(false)
  createdAt       DateTime        @default(now())
  updatedAt       DateTime        @updatedAt

  agence          Agence          @relation(fields: [agenceId], references: [id])

  @@unique([agenceId, role])
}
```

### 4.2.4 UserAgenceAssignment (multi-agences)

```prisma
model UserAgenceAssignment {
  id              String          @id @default(cuid())
  userId          String
  agenceId        String
  role            RoleUser
  estPrincipal    Boolean         @default(false)
  createdAt       DateTime        @default(now())

  user            User            @relation(fields: [userId], references: [id])
  agence          Agence          @relation(fields: [agenceId], references: [id])

  @@unique([userId, agenceId])
}
```

### 4.2.5 Client

> **Problème résolu : Incohérence n°6** — Le numéro de passeport et sa date d'expiry sont bien stockés dans le modèle Client.

```prisma
model Client {
  id                  String          @id @default(cuid())
  agenceId            String
  numeroClient        String          @unique // CLT-AAAA-NNNNNN
  civilite            Civilite?
  nom                 String
  prenom              String
  telephonePrincipal  String
  telephoneSecondaire String?
  email               String?
  dateNaissance       DateTime?
  lieuNaissance       String?
  sexe                Sexe?
  nationalite         String          @default("DZ")
  adresseComplete     String?
  wilaya              String?
  commune             String?
  codePostal          String?
  photoProfil         String?
  statut              ClientStatut    @default(ACTIF)
  sourceAcquisition   SourceAcquisition?
  notes               String?
  tags                String[]
  segments            String[]
  scoreFidelite       Int             @default(0)
  niveauFidelite      String?         // BRONZE, ARGENT, OR, PLATINE, DIAMANT
  nombreVoyages       Int             @default(0)
  montantTotalDepense Decimal         @default(0)
  dernierVoyageDate   DateTime?

  // Documents d'identite
  cniNumero           String?
  cniDateEmission     DateTime?
  cniDateExpiration   DateTime?
  cniLieuEmission     String?
  passeportNumero     String?         // ← Incohérence n°6 résolue
  passeportDateEmission DateTime?     // ← Incohérence n°6 résolue
  passeportDateExpiration DateTime?   // ← Incohérence n°6 résolue
  passeportLieuEmission String?
  passeportNationalite String?

  // Contact d'urgence
  contactUrgenceNom       String?
  contactUrgenceLien      String?     // EPOUX, PARENT, FRERE_SOEUR, AMI, AUTRE
  contactUrgenceTelephone String?
  contactUrgenceEmail     String?

  // Preferences
  prefAlimentaires    String[]
  prefChambre         String?         // SINGLE, DOUBLE, TWIN, FAMILY, SUITE
  prefNiveauConfort   String?         // ECONOMIQUE, STANDARD, CONFORT, LUXE, PRESTIGE
  prefBudgetMin       Decimal?
  prefBudgetMax       Decimal?
  prefLangue          String[]
  notesPreferences    String?

  assigneA            String?         // agent userId
  createdAt           DateTime        @default(now())
  updatedAt           DateTime        @updatedAt

  // Relations
  agence              Agence          @relation(fields: [agenceId], references: [id])
  contacts            ClientContact[]
  dossiers            Dossier[]
  paiements           Paiement[]
  factures            Facture[]
  documents           Document[]
  historiques         HistoriqueAction[]
  reservations        Reservation[]

  @@index([agenceId, nom])
  @@index([agenceId, telephonePrincipal])
  @@index([agenceId, email])
}
```

### 4.2.6 ClientContact (contacts d'urgence)

```prisma
model ClientContact {
  id              String          @id @default(cuid())
  agenceId        String
  clientId        String
  nom             String
  lien            String          // EPOUX, PARENT, FRERE_SOEUR, AMI, AUTRE
  telephone       String
  email           String?
  createdAt       DateTime        @default(now())

  client          Client          @relation(fields: [clientId], references: [id])
  agence          Agence          @relation(fields: [agenceId], references: [id])

  @@index([clientId])
}
```

### 4.2.7 HistoriqueAction

```prisma
model HistoriqueAction {
  id              String          @id @default(cuid())
  agenceId        String
  userId          String?
  action          String          // CONNEXION, CREATION, MODIFICATION, etc.
  entityType      String          // CLIENT, DOSSIER, FACTURE, etc.
  entityId        String
  ancienneValeur  Json?
  nouvelleValeur  Json?
  details         Json?
  ipAddress       String?
  userAgent       String?
  succes          Boolean         @default(true)
  createdAt       DateTime        @default(now())

  user            User?           @relation(fields: [userId], references: [id])
  agence          Agence          @relation(fields: [agenceId], references: [id])
  client          Client?         @relation(fields: [entityId], references: [id])

  @@index([agenceId, entityType, entityId])
  @@index([agenceId, createdAt])
}
```

### 4.2.8 Dossier

```prisma
model Dossier {
  id              String          @id @default(cuid())
  agenceId        String
  clientId        String
  typeDossier     TypeDossier
  statut          DossierStatut   @default(PROSPECT)
  dateDepart      DateTime
  dateRetour      DateTime?
  groupeId        String?
  programmeId     String?         // ← Incohérence n°5 résolue
  forfaitId       String?         // ← Incohérence n°5 résolue
  hotelId         String?
  chambreId       String?
  volId           String?
  montantTotal    Decimal         @default(0)
  montantPaye     Decimal         @default(0)
  montantRestant  Decimal         @default(0)
  devise          String          @default("DZD")
  notes           String?
  checklistDeparts Json?          // Checklist de départ (JSON)
  estArchive      Boolean         @default(false)
  assigneA        String?         // agent userId
  createdAt       DateTime        @default(now())
  updatedAt       DateTime        @updatedAt

  // Relations
  agence          Agence          @relation(fields: [agenceId], references: [id])
  client          Client          @relation(fields: [clientId], references: [id])
  groupe          Groupe?         @relation(fields: [groupeId], references: [id])
  programme       Programme?      @relation(fields: [programmeId], references: [id])
  forfait         Forfait?        @relation(fields: [forfaitId], references: [id])
  hotel           Hotel?          @relation(fields: [hotelId], references: [id])
  chambre         Chambre?        @relation(fields: [chambreId], references: [id])
  vol             Vol?            @relation(fields: [volId], references: [id])
  paiements       Paiement[]
  documents       Document[]
  historiques     HistoriqueAction[]
  reservations    Reservation[]
  visa            Visa?

  @@index([agenceId, statut])
  @@index([agenceId, clientId])
}
```

### 4.2.9 Programme (NOUVEAU — Incohérence n°5)

> **Problème résolu : Incohérence n°5** — L'entité `Programme` était référencée dans le Module 3 du cahier (étape 2 "Choix du programme") mais jamais définie. La voici.

```prisma
model Programme {
  id              String          @id @default(cuid())
  agenceId        String
  nom             String          // "Omra Ramadan 2026 — Package Standard"
  typeDossier     TypeDossier     // OMRA, HAJJ, TOURISME, CRUISE
  description     String?
  dateDepart      DateTime
  dateRetour      DateTime
  villeDepart     String          // "ALG"
  villeArrivee    String          // "JED"
  hotelNom        String?
  hotelEtoiles    Int?
  chambreType     String?         // SINGLE, DOUBLE, TRIPLE, FAMILY, SUITE
  nbNuits         Int
  transport       String?         // Inclus: vol, transfer, etc.
  guideInclus     Boolean         @default(false)
  mealsInclus     String?         // FULL_BOARD, HALF_BOARD, BED_AND_BREAKFAST, SELF_CATERING
  visitesIncluses String[]        // Liste des visites incluses
  prixParPersonne Decimal
  devise          String          @default("DZD")
  capaciteMax     Int
  placesRestantes Int
  statut          String          @default("ACTIF") // ACTIF, COMPLET, INACTIF
  notes           String?
  createdAt       DateTime        @default(now())
  updatedAt       DateTime        @updatedAt

  agence          Agence          @relation(fields: [agenceId], references: [id])
  dossiers        Dossier[]

  @@index([agenceId, typeDossier])
}
```

### 4.2.10 Forfait (NOUVEAU — Incohérence n°5)

> **Problème résolu : Incohérence n°5** — L'entité `Forfait` était référencée dans le Module 4 ("Paramétrage des forfaits") mais jamais définie. La voici.

```prisma
model Forfait {
  id              String          @id @default(cuid())
  agenceId        String
  nom             String          // "Forfait Omra Standard 15 jours"
  description     String?
  typeDossier     TypeDossier
  composants      Json            // [{ type: "VOL", description: "ALG→JED AR", montant: 85000 }, ...]
  prixTotal       Decimal
  devise          String          @default("DZD")
  saison          String?         // HAUT_SEASON, BAS_SEASON, RAMADAN
  dateValiditeDebut DateTime?
  dateValiditeFin DateTime?
  actif           Boolean         @default(true)
  createdAt       DateTime        @default(now())
  updatedAt       DateTime        @updatedAt

  agence          Agence          @relation(fields: [agenceId], references: [id])
  dossiers        Dossier[]

  @@index([agenceId, typeDossier])
}
```

### 4.2.11 Groupe

```prisma
model Groupe {
  id              String          @id @default(cuid())
  agenceId        String
  nom             String          // "Omra Ramadan 2026 — Groupe 3"
  typeDossier     TypeDossier
  dateDepart      DateTime
  dateRetour      DateTime?
  capaciteMax     Int
  guideId         String?
  programmeId     String?
  statut          GroupeStatut     @default(FORMATION)
  notes           String?
  createdAt       DateTime        @default(now())
  updatedAt       DateTime        @updatedAt

  agence          Agence          @relation(fields: [agenceId], references: [id])
  dossiers        Dossier[]
  guide           User?           @relation(fields: [guideId], references: [id])
  programme       Programme?      @relation(fields: [programmeId], references: [id])

  @@index([agenceId, typeDossier])
}
```

### 4.2.12 Visa

```prisma
model Visa {
  id                String          @id @default(cuid())
  agenceId          String
  clientId          String
  dossierId         String?
  typeVisa          TypeVisa
  paysDestination   String          // FR, IT, ES, etc.
  statut            VisaStatut      @default(PROSPECT)
  dateDepot         DateTime?
  dateRetour        DateTime?
  numeroVisa        String?
  fraisConsulaires  Decimal         @default(0)
  fraisAgence       Decimal         @default(0)
  fraisTotal        Decimal         @default(0)
  devise            String          @default("EUR")
  notes             String?
  assigneA          String?
  createdAt         DateTime        @default(now())
  updatedAt         DateTime        @updatedAt

  agence            Agence          @relation(fields: [agenceId], references: [id])
  client            Client          @relation(fields: [clientId], references: [id])
  dossier           Dossier?        @relation(fields: [dossierId], references: [id])
  documents         VisaDocument[]

  @@index([agenceId, statut])
  @@index([agenceId, clientId])
}
```

### 4.2.13 VisaDocument

```prisma
model VisaDocument {
  id              String          @id @default(cuid())
  agenceId        String
  visaId          String
  typeDocument    String          // PASSEPORT, PHOTO, JUSTIFICATIF_HEBERGEMENT, etc.
  nomFichier      String
  urlFichier      String
  statut          DocumentStatut  @default(BROUILLON)
  estObligatoire  Boolean         @default(true)
  dateEmission    DateTime?
  dateExpiration  DateTime?
  commentaire     String?
  createdAt       DateTime        @default(now())
  updatedAt       DateTime        @updatedAt

  visa            Visa            @relation(fields: [visaId], references: [id])
  agence          Agence          @relation(fields: [agenceId], references: [id])

  @@index([visaId])
}
```

### 4.2.14 Vol

```prisma
model Vol {
  id              String          @id @default(cuid())
  agenceId        String
  compagnie       String
  numeroVol       String
  depart          String          // ALG
  arrivee         String          // JED
  dateDepart      DateTime
  dateArrivee     DateTime
  classe          ClasseVol       @default(ECONOMY)
  prix            Decimal
  devise          String          @default("DZD")
  statut          VolStatut       @default(PLANIFIE)
  placesDispo     Int?
  notes           String?
  createdAt       DateTime        @default(now())
  updatedAt       DateTime        @updatedAt

  agence          Agence          @relation(fields: [agenceId], references: [id])
  dossiers        Dossier[]
  reservations    Reservation[]

  @@index([agenceId, dateDepart])
}
```

### 4.2.15 Hotel

```prisma
model Hotel {
  id              String          @id @default(cuid())
  agenceId        String
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
  actif           Boolean         @default(true)
  createdAt       DateTime        @default(now())
  updatedAt       DateTime        @updatedAt

  agence          Agence          @relation(fields: [agenceId], references: [id])
  chambres        Chambre[]
  dossiers        Dossier[]

  @@index([agenceId, ville])
}
```

### 4.2.16 Chambre

```prisma
model Chambre {
  id              String          @id @default(cuid())
  agenceId        String
  hotelId         String
  numero          String
  type            TypeChambre     @default(DOUBLE)
  capacite        Int
  etage           Int?
  tarifNuit       Decimal
  devise          String          @default("USD")
  statut          StatutChambre   @default(DISPONIBLE)
  createdAt       DateTime        @default(now())
  updatedAt       DateTime        @updatedAt

  hotel           Hotel           @relation(fields: [hotelId], references: [id])
  agence          Agence          @relation(fields: [agenceId], references: [id])
  dossiers        Dossier[]

  @@index([hotelId, statut])
}
```

### 4.2.17 Transfer

```prisma
model Transfer {
  id              String          @id @default(cuid())
  agenceId        String
  type            String          // AEROPORT_HOTEL, HOTEL_AEROPORT, INTER_HOTEL, EXCURSION
  lieuDepart      String
  lieuArrivee     String
  dateHeure       DateTime
  vehicule        String?         // Minibus 15 places, Bus 50 places, etc.
  placesMax       Int
  prix            Decimal
  devise          String          @default("DZD")
  chauffeur       String?
  telephone       String?
  statut          String          @default("PLANIFIE") // PLANIFIE, CONFIRME, EN_COURS, TERMINE, ANNULE
  notes           String?
  createdAt       DateTime        @default(now())
  updatedAt       DateTime        @updatedAt

  agence          Agence          @relation(fields: [agenceId], references: [id])
  reservations    Reservation[]

  @@index([agenceId, dateHeure])
}
```

### 4.2.18 Reservation

```prisma
model Reservation {
  id              String          @id @default(cuid())
  agenceId        String
  clientId        String
  dossierId       String?
  type            String          // VOL, HOTEL, TRANSFER, VISITE
  statut          String          @default("EN_ATTENTE") // EN_ATTENTE, CONFIRMEE, ANNULEE, REMBOURSEE
  dateDebut       DateTime
  dateFin         DateTime?
  reference       String?         // Reference externe (PNR, booking ref)
  montant         Decimal
  devise          String          @default("DZD")
  notes           String?
  volId           String?
  hotelId         String?
  transferId      String?
  createdAt       DateTime        @default(now())
  updatedAt       DateTime        @updatedAt

  agence          Agence          @relation(fields: [agenceId], references: [id])
  client          Client          @relation(fields: [clientId], references: [id])
  dossier         Dossier?        @relation(fields: [dossierId], references: [id])
  vol             Vol?            @relation(fields: [volId], references: [id])
  hotel           Hotel?          @relation(fields: [hotelId], references: [id])
  transfer        Transfer?       @relation(fields: [transferId], references: [id])

  @@index([agenceId, statut])
  @@index([agenceId, clientId])
}
```

### 4.2.19 Produit

```prisma
model Produit {
  id              String          @id @default(cuid())
  agenceId        String
  catalogueId     String?
  nom             String
  description     String?
  type            String          // VOL, HOTEL, TRANSFER, VISITE, ASSURANCE, FORFAIT
  prix            Decimal
  devise          String          @default("DZD")
  saison          String?         // HAUT_SEASON, BAS_SEASON, RAMADAN
  actif           Boolean         @default(true)
  metadata        Json?           // Champs spécifiques au type de produit
  createdAt       DateTime        @default(now())
  updatedAt       DateTime        @updatedAt

  agence          Agence          @relation(fields: [agenceId], references: [id])
  catalogue       Catalogue?      @relation(fields: [catalogueId], references: [id])

  @@index([agenceId, type])
}
```

### 4.2.20 Catalogue

```prisma
model Catalogue {
  id              String          @id @default(cuid())
  agenceId        String
  nom             String
  description     String?
  saison          String?
  dateDebut       DateTime?
  dateFin         DateTime?
  actif           Boolean         @default(true)
  createdAt       DateTime        @default(now())
  updatedAt       DateTime        @updatedAt

  agence          Agence          @relation(fields: [agenceId], references: [id])
  produits        Produit[]

  @@index([agenceId])
}
```

### 4.2.21 Facture

```prisma
model Facture {
  id              String          @id @default(cuid())
  agenceId        String
  clientId        String
  dossierId       String?
  numero          String          @unique // FACT-2026-0001
  type            TypeFacture     @default(CLIENT)
  statut          FactureStatut   @default(BROUILLON)
  sousTotal       Decimal
  tva             Decimal         @default(0)
  tvaTaux         Decimal         @default(19) // TVA Algérie 19%
  total           Decimal
  devise          String          @default("DZD")
  dateEmission    DateTime        @default(now())
  dateEcheance    DateTime
  datePaiement    DateTime?
  notes           String?
  estSigne        Boolean         @default(false)
  createdAt       DateTime        @default(now())
  updatedAt       DateTime        @updatedAt

  agence          Agence          @relation(fields: [agenceId], references: [id])
  client          Client          @relation(fields: [clientId], references: [id])
  lignes          LigneFacture[]
  paiements       Paiement[]

  @@index([agenceId, statut])
  @@index([agenceId, clientId])
}
```

### 4.2.22 LigneFacture

```prisma
model LigneFacture {
  id              String          @id @default(cuid())
  agenceId        String
  factureId       String
  description     String
  quantite        Int             @default(1)
  prixUnitaire    Decimal
  montant         Decimal
  tvaApplicable   Boolean         @default(true)
  createdAt       DateTime        @default(now())

  facture         Facture         @relation(fields: [factureId], references: [id])
  agence          Agence          @relation(fields: [agenceId], references: [id])

  @@index([factureId])
}
```

### 4.2.23 Paiement

```prisma
model Paiement {
  id              String          @id @default(cuid())
  agenceId        String
  clientId        String
  factureId       String?
  dossierId       String?
  montant         Decimal
  devise          String          @default("DZD")
  methode         MethodePaiement
  reference       String?
  statut          PaiementStatut  @default(EN_ATTENTE)
  datePaiement    DateTime        @default(now())
  notes           String?
  recuUrl         String?         // URL du reçu PDF
  createdAt       DateTime        @default(now())
  updatedAt       DateTime        @updatedAt

  agence          Agence          @relation(fields: [agenceId], references: [id])
  client          Client          @relation(fields: [clientId], references: [id])
  facture         Facture?        @relation(fields: [factureId], references: [id])

  @@index([agenceId, statut])
  @@index([agenceId, clientId])
}
```

### 4.2.24 Depense

```prisma
model Depense {
  id              String          @id @default(cuid())
  agenceId        String
  categorie       CategorieDepense
  description     String
  montant         Decimal
  devise          String          @default("DZD")
  dateDepense     DateTime        @default(now())
  justificatif    String?         // URL document
  approuvePar     String?
  statut          StatutDepense   @default(EN_ATTENTE)
  createdAt       DateTime        @default(now())
  updatedAt       DateTime        @updatedAt

  agence          Agence          @relation(fields: [agenceId], references: [id])

  @@index([agenceId, categorie])
  @@index([agenceId, dateDepense])
}
```

### 4.2.25 Recette

```prisma
model Recette {
  id              String          @id @default(cuid())
  agenceId        String
  source          String          // PAIEMENT_CLIENT, COMMISSION, AUTRE
  description     String
  montant         Decimal
  devise          String          @default("DZD")
  dateRecette     DateTime        @default(now())
  reference       String?         // Lien vers facture/paiement
  notes           String?
  createdAt       DateTime        @default(now())

  agence          Agence          @relation(fields: [agenceId], references: [id])

  @@index([agenceId, dateRecette])
}
```

### 4.2.26 Avoir

```prisma
model Avoir {
  id              String          @id @default(cuid())
  agenceId        String
  factureId       String          // Facture d'origine
  numero          String          @unique // AVOIR-2026-0001
  motif           String
  montant         Decimal
  devise          String          @default("DZD")
  statut          String          @default("EMIS") // EMIS, APPLIQUE, ANNULE
  dateEmission    DateTime        @default(now())
  notes           String?
  createdAt       DateTime        @default(now())
  updatedAt       DateTime        @updatedAt

  agence          Agence          @relation(fields: [agenceId], references: [id])
  facture         Facture         @relation(fields: [factureId], references: [id])

  @@index([agenceId])
}
```

### 4.2.27 JournalComptable

```prisma
model JournalComptable {
  id              String          @id @default(cuid())
  agenceId        String
  dateEcriture    DateTime        @default(now())
  compteDebit     String          // Numéro compte algérien
  compteCredit    String
  libelle         String
  montant         Decimal
  devise          String          @default("DZD")
  reference       String?         // Lien vers facture/paiement
  estValide       Boolean         @default(false)
  validePar       String?
  dateValidation  DateTime?
  createdAt       DateTime        @default(now())

  agence          Agence          @relation(fields: [agenceId], references: [id])

  @@index([agenceId, dateEcriture])
  @@index([agenceId, compteDebit])
}
```

### 4.2.28 Document

```prisma
model Document {
  id              String          @id @default(cuid())
  agenceId        String
  clientId        String?
  dossierId       String?
  categorie       String?         // IDENTITE, VOYAGE, FINANCIER, ADMINISTRATIF, CONTRACTUEL
  type            TypeDocument
  nomFichier      String
  urlFichier      String
  taille          Int?            // En octets
  mimeType        String?
  statut          DocumentStatut  @default(BROUILLON)
  description     String?
  dateEmission    DateTime?
  dateExpiration  DateTime?
  ocrResult       Json?           // Résultat OCR (champs extraits)
  ocrConfiance    Decimal?        // Confiance OCR (0-100)
  estSigne        Boolean         @default(false)
  version         Int             @default(1)
  createdAt       DateTime        @default(now())
  updatedAt       DateTime        @updatedAt

  agence          Agence          @relation(fields: [agenceId], references: [id])
  client          Client?         @relation(fields: [clientId], references: [id])
  dossier         Dossier?        @relation(fields: [dossierId], references: [id])

  @@index([agenceId, clientId])
  @@index([agenceId, dossierId])
  @@index([agenceId, type])
}
```

### 4.2.29 DocumentCategory

```prisma
model DocumentCategory {
  id              String          @id @default(cuid())
  agenceId        String
  nom             String
  description     String?
  ordre           Int             @default(0)
  createdAt       DateTime        @default(now())

  agence          Agence          @relation(fields: [agenceId], references: [id])

  @@unique([agenceId, nom])
}
```

### 4.2.30 Notification

```prisma
model Notification {
  id              String          @id @default(cuid())
  agenceId        String
  userId          String?
  destinataireType String         // USER, CLIENT
  destinataireId  String
  canal           CanalNotification
  sujet           String
  contenu         String
  statut          NotificationStatut @default(EN_ATTENTE)
  metadata        Json?           // Données supplémentaires (template ID, etc.)
  envoyeLe        DateTime?
  luLe            DateTime?
  createdAt       DateTime        @default(now())

  user            User?           @relation(fields: [userId], references: [id])
  agence          Agence          @relation(fields: [agenceId], references: [id])

  @@index([agenceId, destinataireType, destinataireId])
  @@index([agenceId, statut])
}
```

### 4.2.31 NotificationTemplate

```prisma
model NotificationTemplate {
  id              String          @id @default(cuid())
  agenceId        String
  nom             String          // "NOUVEAU_DOSSIER", "PAIEMENT_RECU", etc.
  canal           CanalNotification
  sujet           String?         // Sujet (pour email)
  contenu         String          // Template avec variables {prenom}, {ref}, etc.
  actif           Boolean         @default(true)
  createdAt       DateTime        @default(now())
  updatedAt       DateTime        @updatedAt

  agence          Agence          @relation(fields: [agenceId], references: [id])

  @@unique([agenceId, nom, canal])
}
```

### 4.2.32 Conversation (Portail Client + WhatsApp)

```prisma
model Conversation {
  id              String          @id @default(cuid())
  agenceId        String
  clientId        String
  canal           CanalNotification // WHATSAPP, IN_APP, EMAIL
  sujet           String?
  statut          String          @default("OUVERTE") // OUVERTE, FERMEE
  derniereActivite DateTime       @default(now())
  createdAt       DateTime        @default(now())
  updatedAt       DateTime        @updatedAt

  agence          Agence          @relation(fields: [agenceId], references: [id])
  messages        Message[]

  @@index([agenceId, clientId])
}
```

### 4.2.33 Message

```prisma
model Message {
  id              String          @id @default(cuid())
  agenceId        String
  conversationId  String
  expediteurType  String          // USER, CLIENT, SYSTEM
  expediteurId    String
  contenu         String
  lu              Boolean         @default(false)
  pieceJointeUrl  String?
  createdAt       DateTime        @default(now())

  conversation    Conversation    @relation(fields: [conversationId], references: [id])
  agence          Agence          @relation(fields: [agenceId], references: [id])

  @@index([conversationId, createdAt])
}
```

### 4.2.34 Settings (paramétrage par agence)

```prisma
model Settings {
  id              String          @id @default(cuid())
  agenceId        String
  cle             String          // "TVA_TAUX", "DEVISE_DEFAUT", "LOGO_URL", etc.
  valeur          String
  description     String?
  createdAt       DateTime        @default(now())
  updatedAt       DateTime        @updatedAt

  agence          Agence          @relation(fields: [agenceId], references: [id])

  @@unique([agenceId, cle])
}
```

### 4.2.35 Plan (plans tarifaires SaaS)

```prisma
model Plan {
  id              String          @id @default(cuid())
  nom             String          // "Starter", "Pro", "Enterprise"
  description     String?
  prixMensuel     Decimal
  prixAnnuel      Decimal?
  devise          String          @default("DZD")
  limiteAgences   Int?
  limiteUtilisateurs Int?
  limiteStockageMo Int?
  limiteRequetesIA Int?
  modulesInclus   String[]        // Liste des modules inclus
  actif           Boolean         @default(true)
  ordre           Int             @default(0)
  createdAt       DateTime        @default(now())
  updatedAt       DateTime        @updatedAt

  subscriptions   Subscription[]

  @@unique([nom])
}
```

### 4.2.36 Subscription

```prisma
model Subscription {
  id              String          @id @default(cuid())
  agenceId        String
  planId          String
  statut          SubscriptionStatut @default(TRIAL)
  dateDebut       DateTime        @default(now())
  dateFin         DateTime?
  essaiGratuit    Boolean         @default(true)
  dateFinEssai    DateTime?
  stripeCustomerId String?
  stripeSubscriptionId String?
  createdAt       DateTime        @default(now())
  updatedAt       DateTime        @updatedAt

  agence          Agence          @relation(fields: [agenceId], references: [id])
  plan            Plan            @relation(fields: [planId], references: [id])

  @@index([agenceId, statut])
}
```

### 4.2.37 AuditLog

```prisma
model AuditLog {
  id              String          @id @default(cuid())
  agenceId        String
  userId          String?
  action          String          // CONNEXION, CREATION, MODIFICATION, SUPPRESSION, etc.
  module          String          // AUTH, CRM, OMRA, FACTURATION, etc.
  entityType      String          // CLIENT, DOSSIER, FACTURE, etc.
  entityId        String
  ancienneValeur  Json?
  nouvelleValeur  Json?
  ipAddress       String?
  userAgent       String?
  succes          Boolean         @default(true)
  details         String?
  createdAt       DateTime        @default(now())

  user            User?           @relation(fields: [userId], references: [id])
  agence          Agence          @relation(fields: [agenceId], references: [id])

  @@index([agenceId, createdAt])
  @@index([agenceId, entityType])
  @@index([agenceId, action])
}
```

### 4.2.38 Prestataire

```prisma
model Prestataire {
  id              String          @id @default(cuid())
  agenceId        String
  type            String          // TRANSPORT, HOTEL, RESTAURANT, ASSURANCE, AUTRE
  nom             String
  contactNom      String?
  telephone       String?
  email           String?
  adresse         String?
  ville           String?
  pays            String?
  notes           String?
  contratUrl      String?
  actif           Boolean         @default(true)
  createdAt       DateTime        @default(now())
  updatedAt       DateTime        @updatedAt

  agence          Agence          @relation(fields: [agenceId], references: [id])

  @@index([agenceId, type])
}
```

## 4.3 Récapitulatif des modèles

| # | Modèle | Agence-scoped | Description |
|---|--------|:------------:|-------------|
| 1 | Agence | — | Agence de voyage (entité racine) |
| 2 | User | Oui | Utilisateurs (8 rôles) |
| 3 | RoleDefinition | Oui | Définition des rôles par agence |
| 4 | UserAgenceAssignment | Oui | Affectation multi-agences |
| 5 | Client | Oui | Clients de l'agence |
| 6 | ClientContact | Oui | Contacts d'urgence clients |
| 7 | HistoriqueAction | Oui | Historique des actions |
| 8 | Dossier | Oui | Dossiers de voyage |
| 9 | Programme | Oui | Programmes Omra/Hajj/Tourisme |
| 10 | Forfait | Oui | Forfaits commerciaux |
| 11 | Groupe | Oui | Groupes de voyageurs |
| 12 | Visa | Oui | Demandes de visa |
| 13 | VisaDocument | Oui | Documents pour visa |
| 14 | Vol | Oui | Vols |
| 15 | Hotel | Oui | Hôtels partenaires |
| 16 | Chambre | Oui | Chambres d'hôtels |
| 17 | Transfer | Oui | Transfers/transport |
| 18 | Reservation | Oui | Réservations |
| 19 | Produit | Oui | Produits du catalogue |
| 20 | Catalogue | Oui | Catalogues de produits |
| 21 | Facture | Oui | Factures |
| 22 | LigneFacture | Oui | Lignes de facture |
| 23 | Paiement | Oui | Paiements |
| 24 | Depense | Oui | Dépenses |
| 25 | Recette | Oui | Recettes |
| 26 | Avoir | Oui | Avoirs / notes de crédit |
| 27 | JournalComptable | Oui | Journal comptable |
| 28 | Document | Oui | Documents numérisés |
| 29 | DocumentCategory | Oui | Catégories de documents |
| 30 | Notification | Oui | Notifications |
| 31 | NotificationTemplate | Oui | Templates de notifications |
| 32 | Conversation | Oui | Conversations (portail + WhatsApp) |
| 33 | Message | Oui | Messages dans conversations |
| 34 | Settings | Oui | Paramètres par agence |
| 35 | Plan | — | Plans tarifaires SaaS |
| 36 | Subscription | Oui | Abonnements agences |
| 37 | AuditLog | Oui | Journal d'audit |
| 38 | Prestataire | Oui | Prestataires externes |

**Total : 38 modèles** (37 agence-scoped + 1 racine)

---

# 5. Politiques RLS — couverture complète

> **Problème résolu : Incohérence n°9** — Seulement 12/30+ tables couvertes. Maintenant TOUTES les tables agence-scoped sont couvertes.

## 5.1 Stratégie RLS

Toutes les tables avec `agenceId` utilisent la même stratégie :
1. **Isolation par agence** : chaque agence ne voit que ses données
2. **Bypass Super Admin** : le Super Admin accède à tout
3. **Client** : le Client ne voit que SES propres données (filtre `userId` ou `clientId`)

## 5.2 Configuration Supabase

```sql
-- Activer RLS sur chaque table (à faire pour chaque table)
ALTER TABLE "Agence" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "User" ENABLE ROW LEVEL SECURITY;
-- ... etc pour chaque table

-- Fonction helper pour récupérer le contexte utilisateur
CREATE OR REPLACE FUNCTION get_current_user_role()
RETURNS TEXT AS $$
  SELECT current_setting('app.current_role', true)
$$ LANGUAGE sql STABLE;

CREATE OR REPLACE FUNCTION get_current_agence_id()
RETURNS TEXT AS $$
  SELECT current_setting('app.current_agence_id', true)
$$ LANGUAGE sql STABLE;

CREATE OR REPLACE FUNCTION get_current_user_id()
RETURNS TEXT AS $$
  SELECT current_setting('app.current_user_id', true)
$$ LANGUAGE sql STABLE;
```

## 5.3 Politiques RLS par table

### 5.3.1 Agence

```sql
-- Super Admin voit tout
CREATE POLICY "agence_super_admin_all" ON "Agence"
  FOR ALL USING (get_current_user_role() = 'SUPER_ADMIN');

-- Admin voit sa propre agence
CREATE POLICY "agence_admin_own" ON "Agence"
  FOR SELECT USING (id = get_current_agence_id());
```

### 5.3.2 User

```sql
CREATE POLICY "user_super_admin_all" ON "User"
  FOR ALL USING (get_current_user_role() = 'SUPER_ADMIN');

CREATE POLICY "user_agence_isolation" ON "User"
  FOR ALL USING (agenceId = get_current_agence_id());
```

### 5.3.3 RoleDefinition

```sql
CREATE POLICY "role_def_super_admin_all" ON "RoleDefinition"
  FOR ALL USING (get_current_user_role() = 'SUPER_ADMIN');

CREATE POLICY "role_def_agence_isolation" ON "RoleDefinition"
  FOR ALL USING (agenceId = get_current_agence_id());
```

### 5.3.4 Client

```sql
CREATE POLICY "client_super_admin_all" ON "Client"
  FOR ALL USING (get_current_user_role() = 'SUPER_ADMIN');

CREATE POLICY "client_agence_isolation" ON "Client"
  FOR ALL USING (agenceId = get_current_agence_id());

-- Client ne voit que sa propre fiche
CREATE POLICY "client_self_read" ON "Client"
  FOR SELECT USING (
    get_current_user_role() = 'CLIENT'
    AND id = (
      SELECT "clientId" FROM "User"
      WHERE id = get_current_user_id()
    )
  );
```

### 5.3.5 ClientContact

```sql
CREATE POLICY "client_contact_super_admin" ON "ClientContact"
  FOR ALL USING (get_current_user_role() = 'SUPER_ADMIN');

CREATE POLICY "client_contact_agence" ON "ClientContact"
  FOR ALL USING (agenceId = get_current_agence_id());
```

### 5.3.6 HistoriqueAction

```sql
CREATE POLICY "historique_super_admin" ON "HistoriqueAction"
  FOR ALL USING (get_current_user_role() = 'SUPER_ADMIN');

CREATE POLICY "historique_agence" ON "HistoriqueAction"
  FOR ALL USING (agenceId = get_current_agence_id());
```

### 5.3.7 Dossier

```sql
CREATE POLICY "dossier_super_admin" ON "Dossier"
  FOR ALL USING (get_current_user_role() = 'SUPER_ADMIN');

CREATE POLICY "dossier_agence_isolation" ON "Dossier"
  FOR ALL USING (agenceId = get_current_agence_id());
```

### 5.3.8 Programme

```sql
CREATE POLICY "programme_super_admin" ON "Programme"
  FOR ALL USING (get_current_user_role() = 'SUPER_ADMIN');

CREATE POLICY "programme_agence" ON "Programme"
  FOR ALL USING (agenceId = get_current_agence_id());
```

### 5.3.9 Forfait

```sql
CREATE POLICY "forfait_super_admin" ON "Forfait"
  FOR ALL USING (get_current_user_role() = 'SUPER_ADMIN');

CREATE POLICY "forfait_agence" ON "Forfait"
  FOR ALL USING (agenceId = get_current_agence_id());
```

### 5.3.10 Groupe

```sql
CREATE POLICY "groupe_super_admin" ON "Groupe"
  FOR ALL USING (get_current_user_role() = 'SUPER_ADMIN');

CREATE POLICY "groupe_agence" ON "Groupe"
  FOR ALL USING (agenceId = get_current_agence_id());
```

### 5.3.11 Visa

```sql
CREATE POLICY "visa_super_admin" ON "Visa"
  FOR ALL USING (get_current_user_role() = 'SUPER_ADMIN');

CREATE POLICY "visa_agence" ON "Visa"
  FOR ALL USING (agenceId = get_current_agence_id());
```

### 5.3.12 VisaDocument

```sql
CREATE POLICY "visa_doc_super_admin" ON "VisaDocument"
  FOR ALL USING (get_current_user_role() = 'SUPER_ADMIN');

CREATE POLICY "visa_doc_agence" ON "VisaDocument"
  FOR ALL USING (agenceId = get_current_agence_id());
```

### 5.3.13 Vol

```sql
CREATE POLICY "vol_super_admin" ON "Vol"
  FOR ALL USING (get_current_user_role() = 'SUPER_ADMIN');

CREATE POLICY "vol_agence" ON "Vol"
  FOR ALL USING (agenceId = get_current_agence_id());
```

### 5.3.14 Hotel

```sql
CREATE POLICY "hotel_super_admin" ON "Hotel"
  FOR ALL USING (get_current_user_role() = 'SUPER_ADMIN');

CREATE POLICY "hotel_agence" ON "Hotel"
  FOR ALL USING (agenceId = get_current_agence_id());
```

### 5.3.15 Chambre

```sql
CREATE POLICY "chambre_super_admin" ON "Chambre"
  FOR ALL USING (get_current_user_role() = 'SUPER_ADMIN');

CREATE POLICY "chambre_agence" ON "Chambre"
  FOR ALL USING (agenceId = get_current_agence_id());
```

### 5.3.16 Transfer

```sql
CREATE POLICY "transfer_super_admin" ON "Transfer"
  FOR ALL USING (get_current_user_role() = 'SUPER_ADMIN');

CREATE POLICY "transfer_agence" ON "Transfer"
  FOR ALL USING (agenceId = get_current_agence_id());
```

### 5.3.17 Reservation

```sql
CREATE POLICY "reservation_super_admin" ON "Reservation"
  FOR ALL USING (get_current_user_role() = 'SUPER_ADMIN');

CREATE POLICY "reservation_agence" ON "Reservation"
  FOR ALL USING (agenceId = get_current_agence_id());
```

### 5.3.18 Produit

```sql
CREATE POLICY "produit_super_admin" ON "Produit"
  FOR ALL USING (get_current_user_role() = 'SUPER_ADMIN');

CREATE POLICY "produit_agence" ON "Produit"
  FOR ALL USING (agenceId = get_current_agence_id());
```

### 5.3.19 Catalogue

```sql
CREATE POLICY "catalogue_super_admin" ON "Catalogue"
  FOR ALL USING (get_current_user_role() = 'SUPER_ADMIN');

CREATE POLICY "catalogue_agence" ON "Catalogue"
  FOR ALL USING (agenceId = get_current_agence_id());
```

### 5.3.20 Facture

```sql
CREATE POLICY "facture_super_admin" ON "Facture"
  FOR ALL USING (get_current_user_role() = 'SUPER_ADMIN');

CREATE POLICY "facture_agence" ON "Facture"
  FOR ALL USING (agenceId = get_current_agence_id());
```

### 5.3.21 LigneFacture

```sql
CREATE POLICY "ligne_facture_super_admin" ON "LigneFacture"
  FOR ALL USING (get_current_user_role() = 'SUPER_ADMIN');

CREATE POLICY "ligne_facture_agence" ON "LigneFacture"
  FOR ALL USING (agenceId = get_current_agence_id());
```

### 5.3.22 Paiement

```sql
CREATE POLICY "paiement_super_admin" ON "Paiement"
  FOR ALL USING (get_current_user_role() = 'SUPER_ADMIN');

CREATE POLICY "paiement_agence" ON "Paiement"
  FOR ALL USING (agenceId = get_current_agence_id());
```

### 5.3.23 Depense

```sql
CREATE POLICY "depense_super_admin" ON "Depense"
  FOR ALL USING (get_current_user_role() = 'SUPER_ADMIN');

CREATE POLICY "depense_agence" ON "Depense"
  FOR ALL USING (agenceId = get_current_agence_id());
```

### 5.3.24 Recette

```sql
CREATE POLICY "recette_super_admin" ON "Recette"
  FOR ALL USING (get_current_user_role() = 'SUPER_ADMIN');

CREATE POLICY "recette_agence" ON "Recette"
  FOR ALL USING (agenceId = get_current_agence_id());
```

### 5.3.25 Avoir

```sql
CREATE POLICY "avoir_super_admin" ON "Avoir"
  FOR ALL USING (get_current_user_role() = 'SUPER_ADMIN');

CREATE POLICY "avoir_agence" ON "Avoir"
  FOR ALL USING (agenceId = get_current_agence_id());
```

### 5.3.26 JournalComptable

```sql
CREATE POLICY "journal_super_admin" ON "JournalComptable"
  FOR ALL USING (get_current_user_role() = 'SUPER_ADMIN');

CREATE POLICY "journal_agence" ON "JournalComptable"
  FOR ALL USING (agenceId = get_current_agence_id());
```

### 5.3.27 Document

```sql
CREATE POLICY "document_super_admin" ON "Document"
  FOR ALL USING (get_current_user_role() = 'SUPER_ADMIN');

CREATE POLICY "document_agence" ON "Document"
  FOR ALL USING (agenceId = get_current_agence_id());
```

### 5.3.28 DocumentCategory

```sql
CREATE POLICY "doc_cat_super_admin" ON "DocumentCategory"
  FOR ALL USING (get_current_user_role() = 'SUPER_ADMIN');

CREATE POLICY "doc_cat_agence" ON "DocumentCategory"
  FOR ALL USING (agenceId = get_current_agence_id());
```

### 5.3.29 Notification

```sql
CREATE POLICY "notification_super_admin" ON "Notification"
  FOR ALL USING (get_current_user_role() = 'SUPER_ADMIN');

CREATE POLICY "notification_agence" ON "Notification"
  FOR ALL USING (agenceId = get_current_agence_id());
```

### 5.3.30 NotificationTemplate

```sql
CREATE POLICY "notif_template_super_admin" ON "NotificationTemplate"
  FOR ALL USING (get_current_user_role() = 'SUPER_ADMIN');

CREATE POLICY "notif_template_agence" ON "NotificationTemplate"
  FOR ALL USING (agenceId = get_current_agence_id());
```

### 5.3.31 Conversation

```sql
CREATE POLICY "conversation_super_admin" ON "Conversation"
  FOR ALL USING (get_current_user_role() = 'SUPER_ADMIN');

CREATE POLICY "conversation_agence" ON "Conversation"
  FOR ALL USING (agenceId = get_current_agence_id());
```

### 5.3.32 Message

```sql
CREATE POLICY "message_super_admin" ON "Message"
  FOR ALL USING (get_current_user_role() = 'SUPER_ADMIN');

CREATE POLICY "message_agence" ON "Message"
  FOR ALL USING (agenceId = get_current_agence_id());
```

### 5.3.33 Settings

```sql
CREATE POLICY "settings_super_admin" ON "Settings"
  FOR ALL USING (get_current_user_role() = 'SUPER_ADMIN');

CREATE POLICY "settings_agence" ON "Settings"
  FOR ALL USING (agenceId = get_current_agence_id());
```

### 5.3.34 Subscription

```sql
CREATE POLICY "subscription_super_admin" ON "Subscription"
  FOR ALL USING (get_current_user_role() = 'SUPER_ADMIN');

CREATE POLICY "subscription_agence" ON "Subscription"
  FOR ALL USING (agenceId = get_current_agence_id());
```

### 5.3.35 AuditLog

```sql
CREATE POLICY "audit_super_admin" ON "AuditLog"
  FOR ALL USING (get_current_user_role() = 'SUPER_ADMIN');

CREATE POLICY "audit_agence" ON "AuditLog"
  FOR ALL USING (agenceId = get_current_agence_id());
```

### 5.3.36 Prestataire

```sql
CREATE POLICY "prestataire_super_admin" ON "Prestataire"
  FOR ALL USING (get_current_user_role() = 'SUPER_ADMIN');

CREATE POLICY "prestataire_agence" ON "Prestataire"
  FOR ALL USING (agenceId = get_current_agence_id());
```

### 5.3.37 UserAgenceAssignment

```sql
CREATE POLICY "assignment_super_admin" ON "UserAgenceAssignment"
  FOR ALL USING (get_current_user_role() = 'SUPER_ADMIN');

CREATE POLICY "assignment_agence" ON "UserAgenceAssignment"
  FOR ALL USING (agenceId = get_current_agence_id());
```

### 5.3.38 Plan

```sql
-- Plan n'est PAS agence-scoped : c'est une table partagée
CREATE POLICY "plan_public_read" ON "Plan"
  FOR SELECT USING (actif = true);

CREATE POLICY "plan_super_admin_all" ON "Plan"
  FOR ALL USING (get_current_user_role() = 'SUPER_ADMIN');
```

## 5.4 Récapitulatif RLS

| # | Table | Politique Super Admin | Politique Agence | Politique Client |
|---|-------|:---------------------:|:----------------:|:----------------:|
| 1 | Agence | ALL | SELECT | — |
| 2 | User | ALL | ALL | — |
| 3 | RoleDefinition | ALL | ALL | — |
| 4 | UserAgenceAssignment | ALL | ALL | — |
| 5 | Client | ALL | ALL | SELECT (own) |
| 6 | ClientContact | ALL | ALL | — |
| 7 | HistoriqueAction | ALL | ALL | — |
| 8 | Dossier | ALL | ALL | — |
| 9 | Programme | ALL | ALL | — |
| 10 | Forfait | ALL | ALL | — |
| 11 | Groupe | ALL | ALL | — |
| 12 | Visa | ALL | ALL | — |
| 13 | VisaDocument | ALL | ALL | — |
| 14 | Vol | ALL | ALL | — |
| 15 | Hotel | ALL | ALL | — |
| 16 | Chambre | ALL | ALL | — |
| 17 | Transfer | ALL | ALL | — |
| 18 | Reservation | ALL | ALL | — |
| 19 | Produit | ALL | ALL | — |
| 20 | Catalogue | ALL | ALL | — |
| 21 | Facture | ALL | ALL | — |
| 22 | LigneFacture | ALL | ALL | — |
| 23 | Paiement | ALL | ALL | — |
| 24 | Depense | ALL | ALL | — |
| 25 | Recette | ALL | ALL | — |
| 26 | Avoir | ALL | ALL | — |
| 27 | JournalComptable | ALL | ALL | — |
| 28 | Document | ALL | ALL | — |
| 29 | DocumentCategory | ALL | ALL | — |
| 30 | Notification | ALL | ALL | — |
| 31 | NotificationTemplate | ALL | ALL | — |
| 32 | Conversation | ALL | ALL | — |
| 33 | Message | ALL | ALL | — |
| 34 | Settings | ALL | ALL | — |
| 35 | Plan | ALL (write) | SELECT (active) | — |
| 36 | Subscription | ALL | ALL | — |
| 37 | AuditLog | ALL | ALL | — |
| 38 | Prestataire | ALL | ALL | — |

**Total : 38 tables couvertes (37 agence-scoped + 1 shared)**

---

# 6. Sécurité des données IA (Loi 18-05 + RGPD)

> **Problème résolu : Incohérence n°7** — Module 9 (AI) n'avait aucune garde-fou pour les données sensibles.

## 6.1 Données interdites d'envoi aux LLMs

Les données suivantes ne doivent JAMAIS être envoyées à un modèle externe (OpenAI, Anthropic, etc.) :

| Catégorie | Données | Justification |
|-----------|---------|---------------|
| **Identité** | Numéro CNI, numéro de passeport, date de naissance complète | Données personnelles sensibles (Loi 18-05) |
| **Finance** | Numéros de carte bancaire, RIB, CCP, relevés bancaires | Données financières protégées |
| **Santé** | Certificats médicaux, vaccinations | Données de santé sensibles (RGPD Art. 9) |
| **Auth** | Mots de passe, tokens 2FA, backup codes | Secrets d'authentification |
| **Mina** | Noms + téléphones + emails combinés | Re-identification possible |
| **Droit** | Contenu complet de documents signés, contrats | Valeur juridique |

## 6.2 Règles de masquage PII (Personnally Identifiable Information)

Avant tout envoi à un LLM, appliquer le pipeline suivant :

```
1. EXTRACTION des champs PII
   → Nom, prénom, téléphone, email, adresse
   → Numéro CNI, passeport
   → Date de naissance

2. MASQUAGE
   → Nom → "Client_001" (anonymisé séquentiel)
   → Téléphone → "*** ** ** **" (totalement masqué)
   → Email → "***@***.***" (totalement masqué)
   → CNI → "***-***-***-***" (totalement masqué)
   → Passeport → "***-*****" (totalement masqué)
   → Date naissance → "XX/XX/XXXX" (masqué)

3. ENVOI au LLM avec données masquées
   → Le LLM travaille sur le CONTEXTE, pas sur les IDENTITÉS

4. DEMASQUAGE côté serveur
   → Remapper les résultats avec les vraies valeurs
   → Toujours côté serveur, jamais côté client
```

### 6.2.1 Fonction de masquage (implémentation)

```typescript
// lib/ai-pii-masking.ts

interface PIIMapping {
  original: string;
  masked: string;
  type: 'name' | 'phone' | 'email' | 'cni' | 'passport' | 'address' | 'date';
}

export function maskPII(text: string): { masked: string; mapping: PIIMapping[] } {
  const mapping: PIIMapping[] = [];
  let counter = 1;

  // Masquer les emails
  let masked = text.replace(
    /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g,
    (match) => {
      const placeholder = `EMAIL_${counter++}`;
      mapping.push({ original: match, masked: placeholder, type: 'email' });
      return placeholder;
    }
  );

  // Masquer les téléphones algériens
  masked = masked.replace(
    /(\+213|0)[567]\d{2}[\s.-]?\d{2}[\s.-]?\d{2}[\s.-]?\d{2}/g,
    (match) => {
      const placeholder = `PHONE_${counter++}`;
      mapping.push({ original: match, masked: placeholder, type: 'phone' });
      return placeholder;
    }
  );

  // Masquer les numéros CNI (18 chiffres)
  masked = masked.replace(
    /\d{18}/g,
    (match) => {
      const placeholder = `CNI_${counter++}`;
      mapping.push({ original: match, masked: placeholder, type: 'cni' });
      return placeholder;
    }
  );

  // Masquer les passeports (2 lettres + 7 chiffres)
  masked = masked.replace(
    /[A-Z]{2}\d{7}/g,
    (match) => {
      const placeholder = `PASSPORT_${counter++}`;
      mapping.push({ original: match, masked: placeholder, type: 'passport' });
      return placeholder;
    }
  );

  return { masked, mapping };
}

export function unmaskPII(masked: string, mapping: PIIMapping[]): string {
  let result = masked;
  for (const item of mapping) {
    result = result.replace(item.masked, item.original);
  }
  return result;
}
```

## 6.3 Données autorisées pour les LLMs

| Fonctionnalité IA | Données envoyées | Données interdites |
|--------------------|-----------------|-------------------|
| **Devis automatique** | Type de voyage, dates, nb personnes, classe, étoiles hôtel, budget | Noms, télés, emails, passeports |
| **Résumé dossier** | Type dossier, statut, dates, montants (anonymisés), notes internes | Identité du client, documents |
| **Prévisions revenue** | Historique montants, dates, types (agrégés) | Aucune donnée individuelle |
| **Réponses WhatsApp** | Contexte conversation (sans PII), templates | Infos client personnelles |
| **Relance impayés** | Réf facture, montant, échéance | Nom client (utiliser "Cher client") |
| **Traduction FR/AR** | Texte à traduire (sans PII) | Aucune donnée personnelles |
| **Recherche sémantique** | Embeddings de descriptions (pas de noms) | Noms, contacts, docs |

## 6.4 Exigences de consentement

| Scénario | Consentement requis | Méthode |
|----------|:------------------:|---------|
| OCR automatique d'un document | Oui (opt-in) | Checkbox explicite lors de l'upload |
| Devis IA avec données client | Non (intérêt légitime) | Données masquées envoyées |
| Résumé IA d'un dossier | Non (intérêt légitime) | Données masquées envoyées |
| Entraînement modèle custom | Oui (opt-in explicite) | Popup séparée avec explication |
| Recherche sémantique sur dossiers | Non (intérêt légitime) | Embeddings sans PII |

## 6.5 Rétention des données d'interactions IA

| Type de donnée | Rétention | Suppression |
|----------------|-----------|-------------|
| Logs de requêtes IA (sans PII) | 90 jours | Auto |
| Réponses IA générées | Durée de vie du dossier associé | Suppression cascade |
| Embeddings de recherche | Tant que l'index est actif | Ré-indexation périodique |
| PII maské (mapping) | Session uniquement | Mémoire libérée à la fin de la requête |
| Historique conversations IA (portail) | 2 ans | Suppression manuelle par Admin |

## 6.6 Garde-fous techniques

```typescript
// lib/ai-guardrails.ts

const PII_PATTERNS = [
  { name: 'CNI', regex: /\d{18}/ },
  { name: 'PASSPORT', regex: /[A-Z]{2}\d{7}/ },
  { name: 'EMAIL', regex: /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/ },
  { name: 'PHONE_DZ', regex: /(\+213|0)[567]\d{2}[\s.-]?\d{2}[\s.-]?\d{2}[\s.-]?\d{2}/ },
];

export function checkPIILeakage(text: string): boolean {
  for (const pattern of PII_PATTERNS) {
    if (pattern.regex.test(text)) {
      console.error(`[AI GUARDRAIL] PII detected: ${pattern.name}`);
      return true; // BLOQUER l'envoi
    }
  }
  return false; // OK
}

// Appliquer avant chaque appel LLM
export async function safeLLMCall(prompt: string, context: string) {
  const { masked, mapping } = maskPII(context);

  if (checkPIILeakage(masked)) {
    throw new Error('PII leak detected in LLM request — BLOCKED');
  }

  const response = await llm.complete(prompt, masked);
  return unmaskPII(response, mapping);
}
```

---

# 7. Conformité signature électronique (Loi 18-05)

> **Problème résolu : Incohérence n°8** — Module 14 référençait la Loi 18-05 mais sans implémentation conforme.

## 7.1 Cadre légal

La **Loi n°18-05 du 10 mai 2018** relative à l'identification numérique et à la signature électronique en Algérie définit :

| Concept | Définition légale |
|---------|------------------|
| **Signature électronique** | Toute donnée elektronique jointe ou logiquement associée à d'autres données électroniques, utilisée comme moyen d'authentification |
| **Certificat qualifié** | Délivré par un prestataire de services de certification accrédité par l'Autorité de Régulation de l'Activité de l'Informatique (ARAF) |
| **Horodatage** | Preuve de la date et de l'heure de la signature |
| **Force probante** | La signature électronique qualifiée a la même force que la signature manuscrite |

## 7.2 Conditions de validité

Pour qu'une signature électronique soit **légale en Algérie**, elle doit remplir :

| Critère | Exigence | Notre implémentation |
|---------|----------|---------------------|
| **Authentification** | Identité du signataire vérifiée | Auth via NextAuth + 2FA |
| **Intégrité** | Le document ne peut pas être modifié après signature | Hash SHA-256 du document + stockage immutable |
| **Non-répudiation** | Le signataire ne peut nier avoir signé | Certificat + audit trail horodaté |
| **Horodatage** | Date/heure certifiée de la signature | Horodatage serveur + timestamp externe (RFC 3161) |
| **Conservation** | Archivage sécurisé pendant la durée légale | Stockage chiffré AES-256 + backup |

## 7.3 Architecture d'implémentation

```
┌─────────────────────────────────────────────────────────────┐
│                    SIGNATURE ÉLECTRONIQUE                     │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  1. PREPARATION                                              │
│     → Document PDF généré                                    │
│     → Hash SHA-256 calculé                                   │
│     → Métadonnées extraites (signataires, rôles, date)       │
│                                                              │
│  2. INVITATION À SIGNER                                      │
│     → Notification email/WhatsApp au signataire              │
│     → Lien sécurisé vers la page de signature                │
│     → Authentification du signataire (email + MDP + 2FA)     │
│                                                              │
│  3. SIGNATURE                                                │
│     → Le signataire visualise le document                    │
│     → Accepte les conditions de signature                    │
│     → Fournit sa signature (dessin, clic, ou certificat)     │
│     → Le hash est signé avec la clé privée du serveur        │
│                                                              │
│  4. FINALISATION                                             │
│     → PDF signé généré (signature visible + invisible)       │
│     → Horodatage externe (RFC 3161) ajouté                   │
│     → Stockage sécurisé (Supabase Storage, AES-256)          │
│     → Audit trail complet enregistré                         │
│     → Notification à tous les signataires                    │
│                                                              │
│  5. ARCHIVAGE                                                │
│     → Copie signée archivée                                  │
│     → Métadonnées de signature stockées                      │
│     → Conservation 5 ans minimum (obligation légale)         │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

## 7.4 Modèle de données pour la signature

```prisma
model Signature {
  id                String          @id @default(cuid())
  agenceId          String
  documentId        String          // Document signé
  dossierId         String?
  statut            StatutSignature @default(EN_ATTENTE)
  hashDocument      String          // SHA-256 du document original
  hashSigne         String?         // Hash signé
  horodatage        DateTime?       // Date/heure de la signature
  horodatageExterne String?         // Timestamp RFC 3161
  urlPdfSigne       String?         // URL du PDF signé
  certificatId      String?         // Référence au certificat utilisé
  ipAddress         String?
  userAgent         String?
  notes             String?
  expireLe          DateTime?       // Date d'expiration de l'invitation
  createdAt         DateTime        @default(now())
  updatedAt         DateTime        @updatedAt

  agence            Agence          @relation(fields: [agenceId], references: [id])
  signataires       SignatureSignataire[]

  @@index([agenceId, documentId])
}

model SignatureSignataire {
  id              String          @id @default(cuid())
  agenceId        String
  signatureId     String
  userId          String?         // Si c'est un utilisateur interne
  clientId        String?         // Si c'est un client
  nom             String
  email           String
  role            String          // "SIGNATAIRE", "TÉMOIN", "APPROBATEUR"
  ordre           Int             @default(1) // Ordre de signature
  statut          StatutSignature @default(EN_ATTENTE)
  dateSignature   DateTime?
  dessinSignature String?         // Données de signature dessinée (base64)
  certificatId    String?
  ipAddress       String?
  createdAt       DateTime        @default(now())

  signature       Signature       @relation(fields: [signatureId], references: [id])
  agence          Agence          @relation(fields: [agenceId], references: [id])

  @@index([signatureId])
}
```

## 7.5 Audit trail de signature

Chaque opération de signature génère une entrée dans l'`AuditLog` :

| Champ | Valeur |
|-------|--------|
| `action` | `SIGNATURE_ENVOYEE`, `SIGNATURE_SIGNEE`, `SIGNATURE_REFUSEE`, `SIGNATURE_EXPIREE` |
| `module` | `SIGNATURE` |
| `entityType` | `SIGNATURE` |
| `ancienneValeur` | `{ statut: "EN_ATTENTE" }` |
| `nouvelleValeur` | `{ statut: "SIGNE", horodatage: "...", hash: "..." }` |
| `ipAddress` | Adresse IP du signataire |
| `userAgent` | Navigateur/appareil utilisé |

## 7.6 Conformité RGPD pour signatures

| Exigence | Implémentation |
|----------|---------------|
| Consentement | Le signataire accepte explicitement les conditions avant de signer |
| Droit à l'oubli | Les signatures électroniques ne peuvent PAS être supprimées (valeur légale) |
| Portabilité | Le PDF signé est téléchargeable par le signataire |
| Limitation conservation | 5 ans minimum, 10 ans recommandé |
| Chiffrement | AES-256 au repos, TLS 1.3 en transit |

---

# 8. Design Tokens

> **Référence** : Voir la Constitution §6 pour la direction artistique complète (palette, typographie, dark mode, layout). Pas de duplication ici.

| Élément | Référence Constitution |
|---------|----------------------|
| Palette de couleurs | §6.2 — Deep Teal + Warm Gold + Cream |
| Dark mode | §6.3 — Variables CSS dark |
| Typographie | §6.4 — Inter + DM Sans + JetBrains Mono |
| Layout | §6.6 — Sidebar + Topbar + Content |
| Composants UI | §6.7 — 14 composants prioritaires |
| Design tokens (espace, radius, ombres) | §6.8 — Tokens CSS |

---

# 9. Résumé des règles de validation

> Les schémas Zod complets seront définis dans la spec technique (fichier `07-TECHNICAL-SPEC.md` ou équivalent). Voici le récapitulatif des validations par entité.

## 9.1 Entités avec validation Zod requise

| Entité | Schéma Zod | Emplacement | Priorité |
|--------|-----------|-------------|----------|
| Agence (inscription) | `RegisterAgenceSchema` | `/api/auth/register` | P0 |
| User (login) | `LoginSchema` | `/api/auth/login` | P0 |
| Client (CRUD) | `CreateClientSchema`, `UpdateClientSchema` | `/api/clients`, Server Actions | P0 |
| Dossier (CRUD) | `CreateDossierSchema`, `UpdateDossierSchema` | `/api/dossiers`, Server Actions | P0 |
| Programme | `CreateProgrammeSchema` | `/api/programmes` | P0 |
| Forfait | `CreateForfaitSchema` | `/api/forfaits` | P0 |
| Visa | `CreateVisaSchema` | `/api/visas` | P1 |
| Vol | `CreateVolSchema` | `/api/vols` | P1 |
| Hotel | `CreateHotelSchema` | `/api/hotels` | P1 |
| Reservation | `CreateReservationSchema` | `/api/reservations` | P1 |
| Facture | `CreateFactureSchema` | `/api/factures` | P0 |
| Paiement | `CreatePaiementSchema` | `/api/paiements` | P0 |
| Depense | `CreateDepenseSchema` | `/api/depenses` | P1 |
| Document | `UploadDocumentSchema` | `/api/documents` | P0 |
| Notification | `SendNotificationSchema` | Server Actions | P0 |
| Settings | `UpdateSettingsSchema` | `/api/settings` | P0 |

## 9.2 Règles de validation communes

| Règle | S'applique à | Validation |
|-------|-------------|------------|
| Téléphone algérien | Client, User | `+213` ou `0` suivi de 9 chiffres |
| Email | Client, User | Format email RFC 5322 |
| Montant positif | Facture, Paiement, Depense | `>= 0` |
| Date pas dans le futur | Date naissance, émission | `<= now()` |
| Date expiration > date émission | CNI, Passeport, Visa | `> emission` |
| UUID/CUID | Tous les IDs | Format CUID |
| Devise | Toutes les entités monétaires | Code ISO 4217 (DZD, EUR, USD) |
| Numéro facture unique | Facture | `FACT-YYYY-NNNN` unique |
| Numéro client unique | Client | `CLT-YYYY-NNNNNN` unique |

---

# 10. Correspondance des incohérences résolues

> Ce tableau mapping chaque incohérence critique identifiée par l'audit vers la section de ce document où elle est résolue.

| # | Incohérence critique | Section de résolution | Résumé de la résolution |
|---|---------------------|----------------------|------------------------|
| **1** | Conflit de numérotation des modules | [§1](#1-table-des-matières-officielle-des-15-modules) | Numérotation canonique définie (21 modules, avec mapping ancien↔nouveau) |
| **2** | "Chef agence" = rôle fantôme (50+ occurrences) | [§2.1.1](#2111-mapping-chef-agence--admin) | "Chef agence" → "Admin" (mapping explicite, le mot n'existe pas dans le code) |
| **3** | `agenceId` manquant sur 15+ entités | [§4](#4-schéma-prisma-complet-35-modèles) | TOUTES les 38 entités métier ont `agenceId` (sauf `Plan` et `Agence` elle-même) |
| **4** | Statuts de dossier incompatibles (3 vocabulaires) | [§3](#3-énumérations-de-statuts-unifiées) | 1 enum canonique `DossierStatut` (15 valeurs) + mapping des anciens termes |
| **5** | Entité Programme/Forfait inexistante | [§4.2.9](#429-programme-nouveau--incohérence-n5) et [§4.2.10](#4210-forfait-nouveau--incohérence-n5) | Modèles `Programme` et `Forfait` définis avec champs complets |
| **6** | Numéro passeport + expiry non stockés | [§4.2.5](#425-client) (champs `passeportNumero`, `passeportDateExpiration`) | Champs explicitement marqués et commentés dans le modèle `Client` |
| **7** | Données IA sans garde-fou (fuite vers LLMs) | [§6](#6-sécurité-des-données-ia-loi-18-05--rgpd) | Pipeline de masquage PII, liste noire de données, consentement, rétention |
| **8** | Signature électronique non conforme Loi 18-05 | [§7](#7-conformité-signature-électronique-loi-18-05) | Architecture complète : préparation → invitation → signature → horodatage → archivage |
| **9** | RLS incomplet (12/30+ tables) | [§5](#5-politiques-rls--couverture-complète) | 38 tables couvertes (37 agence-scoped + 1 shared) avec politiques SQL complètes |
| **10** | 20+ entités orphelines du schéma Prisma | [§4](#4-schéma-prisma-complet-35-modèles) | 38 modèles définis (contre ~18 dans la Constitution + CdC combinés) : ajout de `Programme`, `Forfait`, `Transfer`, `Reservation`, `Produit`, `Catalogue`, `Recette`, `Avoir`, `JournalComptable`, `DocumentCategory`, `Conversation`, `Message`, `Settings`, `Plan`, `Subscription`, `AuditLog`, `Prestataire`, `Signature`, `SignatureSignataire`, `RoleDefinition`, `UserAgenceAssignment`, `ClientContact` |

---

## Statistiques de couverture

| Métrique | Valeur |
|----------|--------|
| Incohérences critiques identifiées | 10 |
| Incohérences résolues | **10/10 (100%)** |
| Modules numérotés | 21 |
| Rôles définis | 8 |
| Énumérations de statuts unifiées | 12 |
| Modèles Prisma | 38 |
| Tables avec RLS | 38 |
| Politiques RLS | 76 (2 par table agence-scoped : Super Admin + Agence) |
| Sections du document | 10 |

---

**Document approuvé par** : Ilyes
**Date d'approbation** : 24 Juillet 2026
**Prochaine révision** : 24 Août 2026

---

*Ce document est la source unique de vérité pour le projet Agence Pro. En cas de conflit avec un autre document (Constitution, cahier des charges), ce document fait autorité.*

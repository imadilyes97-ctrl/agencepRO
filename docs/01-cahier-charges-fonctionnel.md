# Agence Pro -- Cahier des Charges Fonctionnel

**Version :** 1.0
**Date :** 24/07/2026
**Statut :** Draft
**Auteur :** Product Management Senior

---

# Table des matieres

## PARTIE I -- FONCTIONS TRANSVERSALES

### MODULE 1 : Authentification & RBAC
- 1.1 Vue d'ensemble
- 1.2 Inscription agence
- 1.3 Authentification (login, sessions, 2FA)
- 1.4 Reinitialisation mot de passe
- 1.5 Gestion des sessions (JWT, refresh token)
- 1.6 Audit trail
- 1.7 SSO (Google, GitHub) -- optionnel
- 1.8 Matrice de permissions complete (8 roles)

### MODULE 2 : CRM 360 degres
- 2.1 Vue d'ensemble
- 2.2 Fiche client complete
- 2.3 Gestion des documents numerises et OCR
- 2.4 Historique client
- 2.5 Tags, segments et scoring
- 2.6 Recherche avancee
- 2.7 Import / Export / Dedoublonnage
- 2.8 QR Code client

### MODULE 3 : Gestion Omra & Hajj
- 3.1 Vue d'ensemble du cycle de vie
- 3.2 Etape 1 -- Creation du dossier
- 3.3 Etape 2 -- Choix du programme
- 3.4 Etape 3 -- Repartition automatique des chambres
- 3.5 Etape 4 -- Gestion des groupes
- 3.6 Etape 5 -- Documents requis
- 3.7 Etape 6 -- Suivi des statuts
- 3.8 Etape 7 -- Checklist de depart
- 3.9 Etape 8 -- Post-voyage
- 3.10 Tableau de bord Omra/Hajj

## PARTIE II -- GESTION COMMERCIALE

### MODULE 4 : Produits & Catalogue
- 4.1 Types de produits (forfaits, vols, hotels, transferts, visites)
- 4.2 Parametrage des forfaits
- 4.3 Gestion tarifaire et saisons
- 4.4 Packs et promotions
- 4.5 Produits liees aux programmes Omra/Hajj

### MODULE 5 : Gestion des Reservations
- 5.1 Cycle de vie d'une reservation
- 5.2 Reservation de vol
- 5.3 Reservation hotel
- 5.4 Reservation transfer / transport
- 5.5 Reservation visite / activite
- 5.6 Conflits et overbooking
- 5.7 Annulation et remboursement

### MODULE 6 : Facturation & Paiements
- 6.1 Generation de factures
- 6.2 Modes de paiement (ESPECES, VIREMENT, CCP, BARIDIMOB, CIB, CHEQUE)
- 6.3 Acomptes et echeanciers
- 6.4 Impayes et relances
- 6.5 Avoirs et notes de credit
- 6.6 Cloture de caisse
- 6.7 Journal de caisse

## PARTIE III -- OPERATIONS & LOGISTIQUE

### MODULE 7 : Planning & Agenda
- 7.1 Calendrier des voyages
- 7.2 Planning des agents
- 7.3 Evenements et rappels
- 7.4 Alertes automatiques

### MODULE 8 : Guides & prestataires
- 8.1 Annuaire des guides
- 8.2 Evaluation des guides
- 8.3 Annuaire des prestataires (transport, hotels)
- 8.4 Contrats et tarifs

### MODULE 9 : Suivi en temps reel des voyages
- 9.1 Tableau de bord voyage actif
- 9.2 Positions et itineraires
- 9.3 Gestion des incidents sur le terrain
- 9.4 Communication guide-client

## PARTIE IV -- COMPTABILITE & REPORTING

### MODULE 10 : Comptabilite
- 10.1 Plan comptable alguerien
- 10.2 Ecritures automatiques
- 10.3 Rapprochement bancaire
- 10.4 TVA et declarations
- 10.5 Bilan et comptes de resultat

### MODULE 11 : Reporting & Analytics
- 11.1 Tableaux de bord direction
- 11.2 KPIs agence
- 11.3 Rapports financiers
- 11.4 Rapports commerciaux
- 11.5 Export et planification

### MODULE 12 : Notifications & Communication
- 12.1 Systeme de notifications internes
- 12.2 Notifications SMS (Algerie)
- 12.3 Notifications email
- 12.4 Notifications WhatsApp (API)
- 12.5 Modele de templates

## PARTIE V -- CONFIGURATION & ADMINISTRATION

### MODULE 13 : Parametrage agence
- 13.1 Informations agence
- 13.2 Logo et branding
- 13.3 Parametres fiscaux
- 13.4 Devises et taux de change
- 13.5 Zones geographiques

### MODULE 14 : Administration technique
- 14.1 Gestion des backups
- 14.2 Logs systeme
- 14.3 Maintenance et mises a jour
- 14.4 Rate limiting et securite

---

# PARTIE I -- FONCTIONS TRANSVERSALES

---

# MODULE 1 : Authentification & RBAC

## 1.1 Vue d'ensemble

Ce module gere l'inscription des agences, l'authentification des utilisateurs, le controle d'acces base sur les roles (RBAC), la gestion des sessions, l'audit trail et les options de SSO.

### Roles definis

| # | Role | Description | Portee |
|---|------|-------------|--------|
| 1 | **Super Admin** | Administrateur de la plateforme SaaS | Toutes les agences |
| 2 | **Admin** | Administrateur d'une agence | Toute son agence |
| 3 | **Manager** | Responsable d'equipe / de departement | Son equipe + ses dossiers |
| 4 | **Agent** | Agent de voyage (commercial, reservation) | Ses dossiers uniquement |
| 5 | **Comptable** | Comptable de l'agence | Module financier + lecture sur tout |
| 6 | **Guide** | Guide touristique (Omra, Hajj, visite) | Voyages assigns uniquement |
| 7 | **Commercial** | Commercial hors agence (field) | Ses leads + ses clients |
| 8 | **Client** | Client final de l'agence | Son compte, ses reservations, ses paiements |

---

## 1.2 Inscription agence

### 1.2.1 Fonctionnalite : Inscription d'une nouvelle agence

**Declencheur :** Un proprietaire d'agence visite la page d'inscription de la plateforme Agence Pro et remplit le formulaire.

**Champs du formulaire :**

| Champ | Type | Obligatoire | Validation | Description |
|-------|------|------------|------------|-------------|
| `nom_agence` | Texte | OUI | 3-100 caracteres, alpha avec espaces et tirets | Raison sociale de l'agence |
| `nom_commercial` | Texte | OUI | 3-80 caracteres | Nom d'affichage public |
| `adresse_siege` | Texte | OUI | 10-200 caracteres | Adresse complete du siege |
| `wilaya` | Select | OUI | Valeur parmi les 58 wilayas d'Algerie | Wilaya de siege |
| `commune` | Texte | OUI | 2-80 caracteres | Commune |
| `rc_number` | Texte | OUI | Format : chiffres uniquement, 8-20 caracteres | Numero de Registre de Commerce |
| `nif_number` | Texte | OUI | 15 chiffres | Numero d'Identification Fiscale |
| `nis_number` | Texte | NON | 15 chiffres | Numero d'Identification Statistique |
| `telephone_fixe` | Telephone | OUI | Format algerien : 0XX XX XX XX | Telephone fixe |
| `telephone_mobile` | Telephone | OUI | Format algerien : 05XX XX XX XX / 06XX XX XX XX | Telephone mobile principal |
| `email_agence` | Email | OUI | Format email valide, unique | Email professionnel de l'agence |
| `site_web` | URL | NON | URL valide avec protocole | Site web (optionnel) |
| `logo` | Fichier image | NON | PNG/JPG, max 2 Mo, min 200x200px | Logo de l'agence |
| `nom_responsable` | Texte | OUI | 3-80 caracteres | Nom complet du proprietaire/admin |
| `email_responsable` | Email | OUI | Format email valide | Email du compte admin |
| `telephone_responsable` | Telephone | OUI | Format algerien | Telephone du compte admin |
| `password` | Mot de passe | OUI | Min 8 caracteres, 1 majuscule, 1 chiffre, 1 special | Mot de passe du compte admin |
| `password_confirm` | Mot de passe | OUI | Identique a `password` | Confirmation |
| `accept_cgu` | Checkbox | OUI | Doit etre coche | Acceptation des CGU |

**Regles metier :**

1. Un seul compte admin par agence. Si un compte admin agence existe deja avec le meme `rc_number`, refuser l'inscription.
2. Le `rc_number` et le `nif_number` doivent etre uniques dans la base.
3. A la soumission, un email de verification est envoye a `email_responsable`.
4. Le compte est cree en statut `EN_ATTENTE_VERIFICATION` jusqu'a confirmation email.
5. Un Super Admin doit valider manuellement l'agence (passage en statut `ACTIVE`) sauf si l'agence a ete pre-validee via un code d'invitation.
6. L'inscription cree automatiquement :
   - Le compte agence (`AGENCES` table)
   - Le premier utilisateur avec le role `ADMIN` (`UTILISATEURS` table)
   - Les 8 roles par defaut dans `ROLE_DEFINITIONS` pour cette agence
   - Un espace de stockage documentaire vide

**Donnees en sortie :**
- Compte agence cree (statut : `EN_ATTENTE_VERIFICATION`)
- Compte admin cree (statut : `INACTIF` tant que non verifie)
- Email de verification envoye

### 1.2.2 Fonctionnalite : Validation agence (Super Admin)

**Declencheur :** Un Super Admin valide ou rejette une agence en attente.

**Actions autorisees :**
- Valider l'agence -> statut passe a `ACTIVE`, email de confirmation envoye
- Rejeter l'agence -> statut passe a `REJETEE`, email de rejet envoye avec motif
- Demander des documents complementaires -> statut passe a `EN_ATTENTE_DOCUMENTS`

**Donnees en sortie :**
- Changement de statut de l'agence
- Notification email au proprietaire
- Creation automatique de la configuration par defaut (modeles de facture, parametres fiscaux)

---

## 1.3 Authentification (login, sessions, 2FA)

### 1.3.1 Fonctionnalite : Connexion

**Declencheur :** Un utilisateur saisit son email et mot de passe sur la page de login.

**Champs du formulaire :**

| Champ | Type | Obligatoire | Validation |
|-------|------|------------|------------|
| `email` | Email | OUI | Format email valide |
| `password` | Mot de passe | OUI | Non vide |
| `remember_me` | Checkbox | NON | Coche = session longue |

**Regles metier :**

1. Tentatives maximales : 5 en 15 minutes. Apres 5 echecs :
   - Compte bloque temporairement 15 minutes
   - Notification email a l'utilisateur : "Tentative de connexion suspecte"
   - Notification au Super Admin si c'est un Admin ou Super Admin
2. Si 2FA active pour l'utilisateur :
   - Apres validation email+MDP, afficher l'ecran de saisie du code 2FA
   - Le code est a 6 chiffres, delai de validite 30 secondes
   - 3 tentatives max pour le code 2FA avant blocage 15 min
3. Apres connexion reussie :
   - Generer un access token JWT (duree : 15 minutes)
   - Generer un refresh token (duree : 7 jours)
   - Enregistrer la connexion dans l'audit trail (IP, user-agent, heure)
   - Rediriger selon le role :
     - Super Admin -> `/admin/platform/dashboard`
     - Admin -> `/agency/dashboard`
     - Manager -> `/agency/dashboard` (vue equipe)
     - Agent -> `/agency/mes-dossiers`
     - Comptable -> `/agency/comptabilite`
     - Guide -> `/agency/guide/mes-voyages`
     - Commercial -> `/agency/mes-leads`
     - Client -> `/client/dashboard`

**Donnees en sortie :**
- Access token JWT
- Refresh token
- Informations utilisateur minimales (id, nom, role, avatar)
- URL de redirection

### 1.3.2 Fonctionnalite : Activation 2FA

**Declencheur :** Un utilisateur active la verification en deux etapes depuis son profil.

**Etapes :**
1. L'utilisateur clique "Activer 2FA" dans `Mon Profil > Securite`
2. Le systeme genere un secret TOTP
3. Affichage d'un QR code (format URI otpauth://) pour scanner avec Google Authenticator / Authy / etc.
4. L'utilisateur saisit le code genere par l'app pour valider
5. Le systeme affiche 5 codes de recuperation (backup codes) -- a copier et conserver
6. La 2FA est activee

**Regles metier :**
- La 2FA est optionnelle pour tous les roles sauf Super Admin (obligatoire).
- Les backup codes sont stockes en base哈希 SHA-256 (jamais en clair).
- Un backup code ne peut etre utilise qu'une seule fois.
- La desactivation de 2FA necessite la saisie d'un code TOTP valide OU un backup code.

**Donnees en entree :** Code TOTP a 6 chiffres
**Donnees en sortie :** 2FA activee + 5 backup codes

### 1.3.3 Fonctionnalite : Connexion SSO (Google/GitHub) -- optionnel

**Declencheur :** Un utilisateur clique sur "Continuer avec Google" ou "Continuer avec GitHub".

**Regles metier :**
1. La premiere connexion SSO cree un compte lie au provider.
2. Le compte est lie a l'agence via l'email domain (ex: `@agencepro.dz` -> auto-attribution).
3. Si l'email n'appartient a aucune agence, invitation a creer ou rejoindre une agence.
4. Le SSO ne remplace pas le mot de passe local : les deux methodes restent actives.
5. La 2FA SSO est geree par le provider (Google/GitHub).

---

## 1.4 Reinitialisation mot de passe

### 1.4.1 Fonctionnalite : Mot de passe oublie (par email)

**Declencheur :** L'utilisateur clique "Mot de passe oublie" sur la page de login.

**Champs :**

| Champ | Type | Obligatoire | Validation |
|-------|------|------------|------------|
| `email` | Email | OUI | Doit correspondre a un compte existant et actif |

**Regles metier :**
1. Un lien de reinitialisation est envoye par email.
2. Le lien est valide 30 minutes.
3. Le lien contient un token unique (UUID v4 + HMAC).
4. Apres utilisation, le token est invalide (usage unique).
5. Un maximum de 3 demandes par heure.
6. Si le compte est bloque, le reset est impossible.
7. Le nouveau mot de passe ne doit pas etre identique aux 5 derniers mots de passe.
8. Tous les sessions actives de l'utilisateur sont invalidees apres reinitialisation.

**Donnees en sortie :**
- Email de reinitialisation envoye
- Token de reinitialisation genere

### 1.4.2 Fonctionnalite : Mot de passe oublie (par SMS) -- optionnel

**Declencheur :** L'utilisateur choisit "Recevoir par SMS" sur l'ecran de reinitialisation.

**Champs :**

| Champ | Type | Obligatoire | Validation |
|-------|------|------------|------------|
| `telephone` | Telephone | OUI | Doit correspondre au telephone du compte |
| `code_sms` | Code | OUI | Code a 6 chiffres genere aleatoirement |

**Regles metier :**
1. Le code SMS est valide 10 minutes.
2. 3 tentatives maximales de saisie du code.
3. Le SMS est envoye via l'API Twilio/Algérie Telecom (a configurer).
4. Le code est哈希 SHA-256 avant stockage.
5. Meme regles de reinitialisation que par email ensuite.

---

## 1.5 Gestion des sessions (JWT, refresh token)

### 1.5.1 Architecture des tokens

| Token | Type | Duree | Stockage | Usage |
|-------|------|-------|----------|-------|
| Access Token | JWT | 15 min | Cookie httpOnly + localStorage (refresh) | Authentification des requetes API |
| Refresh Token | UUID | 7 jours | Cookie httpOnly (secure) | Renouvellement de l'access token |
| Reset Token | UUID + HMAC | 30 min | Base de donnees (哈希) | Reinitialisation mot de passe |

### 1.5.2 Fonctionnalite : Renouvellement automatique

**Declencheur :** L'access token est proche de l'expiration (< 2 minutes restantes).

**Regles metier :**
1. Le client (frontend) detecte que l'access token va expirer.
2. Il envoie une requete `POST /api/auth/refresh` avec le refresh token.
3. Le serveur verifie la validite du refresh token :
   - Token present dans la base
   - Pas expire
   - Pas dans la liste noire (deconnexion)
   - Correspond a la meme IP/user-agent
4. Si valide : nouveau access token + nouveau refresh token (rotation).
5. L'ancien refresh token est ajoute a la liste noire (rotation).
6. Si invalide : deconnexion forcee, redirection vers la page de login.

### 1.5.3 Fonctionnalite : Deconnexion

**Declencheur :** L'utilisateur clique "Deconnexion" ou le Super Admin force la deconnexion.

**Regles metier :**
1. Le refresh token est ajoute a la liste noire.
2. Le cookie de session est supprime.
3. La deconnexion est enregistree dans l'audit trail.
4. Si deconnexion forcee par Super Admin : notification email a l'utilisateur.

### 1.5.4 Fonctionnalite : Sessions multiples

**Regles metier :**
- Un utilisateur peut avoir jusqu'a 3 sessions actives simultanees.
- Au-dela de 3, la session la plus ancienne est invalidee.
- Le tableau des sessions actives est visible dans `Mon Profil > Securite > Sessions actives`.
- L'utilisateur peut fermer une session a distance.

---

## 1.6 Audit trail

### 1.6.1 Donnees enregistrees

Chaque action significative est enregistree avec :

| Champ | Type | Description |
|-------|------|-------------|
| `id` | UUID | Identifiant unique de l'entree |
| `timestamp` | Datetime (UTC) | Date et heure de l'action |
| `utilisateur_id` | UUID | ID de l'utilisateur (ou null si systeme) |
| `agence_id` | UUID | ID de l'agence concernee |
| `action` | Enum | Type d'action (voir ci-dessous) |
| `module` | String | Module concerne (ex: `CRM`, `OMRA`, `FACTURATION`) |
| `entite_type` | String | Type d'entite modifiee (ex: `CLIENT`, `DOSSIER`, `FACTURE`) |
| `entite_id` | UUID | ID de l'entite modifiee |
| `ancien_valeur` | JSON | Valeur avant modification (null si creation) |
| `nouvelle_valeur` | JSON | Valeur apres modification (null si suppression) |
| `ip_address` | String | Adresse IP de la requete |
| `user_agent` | String | Navigateur/appareil |
| `succes` | Boolean | Si l'action a reussi |

### 1.6.2 Actions tracees

| Action | Description |
|--------|-------------|
| `CONNEXION` | Connexion reussie |
| `CONNEXION_ECHEC` | Tentative de connexion echouee |
| `DECONNEXION` | Deconnexion |
| `CREATION` | Creation d'une entite |
| `MODIFICATION` | Modification d'une entite |
| `SUPPRESSION` | Suppression d'une entite |
| `VALIDATION` | Validation / approbation |
| `REJET` | Rejet d'une demande |
| `EXPORT` | Export de donnees |
| `IMPORT` | Import de donnees |
| `CHANGEMENT_STATUT` | Changement de statut d'une entite |
| `CHANGEMENT_ROLE` | Modification de role/utilisateur |
| `ACCES_REFUSE` | Tentative d'acces non autorise |
| `ANNULATION` | Annulation d'une reservation/facture |
| `PAIEMENT` | Enregistrement d'un paiement |
| `IMPRESSION` | Impression d'un document |

### 1.6.3 Regles metier

1. L'audit trail est **IMMUTABLE** : aucune modification, aucune suppression possible.
2. Seul un Super Admin peut consulter l'audit trail de toutes les agences.
3. Un Admin peut consulter l'audit trail de sa propre agence uniquement.
4. Un Manager peut consulter l'audit trail des utilisateurs de son equipe.
5. Conservation : 5 ans minimum (obligation legale alguerienne).
6. Les `ancien_valeur` et `nouvelle_valeur` sont stockes en JSON.
7. Les champs sensibles (mot de passe, token) sont masques dans l'audit trail.

---

## 1.7 SSO (Google, GitHub) -- optionnel

### 1.7.1 Configuration

| Parametre | Google | GitHub |
|-----------|--------|--------|
| Protocol | OAuth 2.0 | OAuth 2.0 |
| Client ID | Configurable par Super Admin | Configurable par Super Admin |
| Client Secret | Stocke哈希 en base | Stocke哈希 en base |
| Scopes | `email`, `profile` | `user:email` |
| Callback URL | `/api/auth/sso/google/callback` | `/api/auth/sso/github/callback` |

### 1.7.2 Regles metier

1. Le SSO est active ou desactive au niveau de la plateforme (Super Admin).
2. Les agences individuelles ne peuvent pas activer/desactiver le SSO.
3. La premiere connexion SSO lie le compte au provider.
4. Les comptes SSO sont soumis aux memes regles RBAC que les comptes classiques.
5. La deconnexion SSO ne deconnecte pas de la session Agence Pro (tokens separes).

---

## 1.8 Matrice de permissions complete

### 1.8.1 Legende

| Symbole | Signification |
|---------|---------------|
| C | Creer |
| R | Lire |
| M | Modifier |
| S | Supprimer |
| V | Valider / Approuver |
| X | Aucun acces |
| - | Meme regle que "M" (lecture + modification) |

### 1.8.2 Module Authentification & Utilisateurs

| Action | Super Admin | Admin | Manager | Agent | Comptable | Guide | Commercial | Client |
|--------|:-----------:|:-----:|:-------:|:-----:|:---------:|:-----:|:----------:|:------:|
| Voir tous les utilisateurs (toutes agences) | CRUD | X | X | X | X | X | X | X |
| Voir les utilisateurs de son agence | - | CRUD | RU | R* | R* | R* | R* | X |
| Creer un utilisateur dans son agence | - | C | C | X | X | X | X | X |
| Modifier son propre profil | R | R | R | R | R | R | R | R |
| Modifier le profil d'un autre utilisateur | X | M | M** | X | X | X | X | X |
| Supprimer un utilisateur (desactivation) | X | S | X | X | X | X | X | X |
| Changer le role d'un utilisateur | X | C | X | X | X | X | X | X |
| Activer/Desactiver 2FA pour un user | X | M | X | X | X | X | X | X |
| Reinitialiser le MDP d'un user | X | C | X | X | X | X | X | X |
| Voir l'audit trail (toutes agences) | R | X | X | X | X | X | X | X |
| Voir l'audit trail (son agence) | - | R | R*** | X | R | X | X | X |

\* Les agents, comptables, guides et commerciaux ne voient que les utilisateurs de leur equipe/role dans l'agence, pas tous les utilisateurs.

\** Un Manager ne peut modifier que les agents de son equipe (pas les autres Managers, pas l'Admin).

\*** Un Manager ne voit que l'audit trail des utilisateurs de son equipe.

### 1.8.3 Module CRM 360 degres

| Action | Super Admin | Admin | Manager | Agent | Comptable | Guide | Commercial | Client |
|--------|:-----------:|:-----:|:-------:|:-----:|:---------:|:-----:|:----------:|:------:|
| Voir tous les clients (toutes agences) | R | X | X | X | X | X | X | X |
| Voir les clients de son agence | - | R | R | R*** | R*** | R | R*** | X |
| Creer un client | - | C | C | C | X | X | C | X |
| Modifier un client | - | M | M*** | M*** | M*** | R | M*** | M* |
| Supprimer un client | - | S | X | X | X | X | X | X |
| Voir les documents d'un client | - | R | R | R*** | R | R | R*** | R* |
| Uploader un document | - | C | C | C | X | C | C | C* |
| Supprimer un document | - | S | X | X | X | X | X | X* |
| Voir les notes internes | - | R | R | R*** | R | X | R*** | X |
| Ajouter une note interne | - | C | C | C | C | X | C | X |
| Exporter les clients (CSV/Excel) | R | R | R | X | X | X | X | X |
| Importer des clients | - | C | C | X | X | X | X | X |
| Voir les tags et segments | - | R | R | R | R | R | R | X |
| Gerer les tags | - | C | C | X | X | X | X | X |
| Voir le score de fidelite | - | R | R | R | R | R | R | R* |
| Voir le QR code client | - | R | R | R | R | R | R | R* |

\* Le Client ne voit et ne modifie QUE sa propre fiche.
\*** L'Agent ne voit que les clients lies a SES dossiers. Le Manager voit les clients lies aux dossiers de SON EQUIPE.

### 1.8.4 Module Omra & Hajj

| Action | Super Admin | Admin | Manager | Agent | Comptable | Guide | Commercial | Client |
|--------|:-----------:|:-----:|:-------:|:-----:|:---------:|:-----:|:----------:|:------:|
| Voir tous les dossiers (toutes agences) | R | X | X | X | X | X | X | X |
| Voir les dossiers de son agence | - | R | R | R*** | R | R**** | X | X |
| Creer un dossier Omra/Hajj | - | C | C | C | X | X | X | X |
| Modifier un dossier | - | M | M | M*** | R | R | X | M* |
| Changer le statut d'un dossier | - | C | C | C*** | X | C**** | X | X |
| Choisir le programme | - | C | C | C | X | X | X | X |
| Repartir les chambres | - | C | C | C | X | X | X | X |
| Creer un groupe | - | C | C | C | X | X | X | X |
| Ajouter un client au groupe | - | C | C | C | X | X | X | X |
| Gerer les documents du dossier | - | C | C | C | R | C | X | C* |
| Faire la checklist de depart | - | C | C | C | X | C | X | X |
| Voir la checklist (lecture seule) | - | R | R | R | R | X | X | R* |
| Archiver un dossier | - | C | C | X | X | X | X | X |
| Annuler un dossier | - | C | C | M*** | X | X | X | X* |
| Voir le tableau de bord Omra/Hajj | - | R | R | R | R | R | R | X |

\* Le Client ne voit et ne modifie QUE ses propres dossiers.
\*** L'Agent ne modifie que SES dossiers.
\**** Le Guide voit uniquement les voyages auxquels il est affecte.

### 1.8.5 Module Facturation & Paiements

| Action | Super Admin | Admin | Manager | Agent | Comptable | Guide | Commercial | Client |
|--------|:-----------:|:-----:|:-------:|:-----:|:---------:|:-----:|:----------:|:------:|
| Voir toutes les factures (toutes agences) | R | X | X | X | X | X | X | X |
| Voir les factures de son agence | - | R | R | R*** | R | X | R*** | X |
| Creer une facture | - | C | C | C | C | X | C | X |
| Modifier une facture | - | M | M | X | M | X | X | X |
| Valider / Envoyer une facture | - | V | V | X | V | X | X | X |
| Annuler une facture | - | C | X | X | C | X | X | X |
| Enregistrer un paiement | - | C | C | C | C | X | C | X |
| Voir le journal de caisse | - | R | R | X | R | X | X | X |
| Faire la cloture de caisse | - | C | X | X | C | X | X | X |
| Relancer un impaye | - | C | C | C | C | X | C | X |
| Generer un avoir / note de credit | - | C | X | X | C | X | X | X |
| Voir ses propres paiements | - | X | X | X | X | X | X | R* |

\* Le Client ne voit que SES factures et SES paiements.

### 1.8.6 Module Planning & Guide

| Action | Super Admin | Admin | Manager | Agent | Comptable | Guide | Commercial | Client |
|--------|:-----------:|:-----:|:-------:|:-----:|:---------:|:-----:|:----------:|:------:|
| Voir le calendrier (toutes agences) | R | X | X | X | X | X | X | X |
| Voir le calendrier de son agence | - | R | R | R | R | R | R | R* |
| Creer un evenement | - | C | C | C | X | X | C | X |
| Modifier un evenement | - | M | M | M*** | X | X | M*** | X |
| Supprimer un evenement | - | S | M*** | X | X | X | X | X |
| Affecter un guide a un voyage | - | C | C | X | X | X | X | X |
| Voir ses voyages assigns | - | X | X | X | X | R* | X | R* |
| Marquer un point de presence | - | X | X | X | X | C* | X | X |
| Signaler un incident | - | X | X | X | X | C* | X | C* |

\* Le Guide ne voit que SES voyages. Le Client voit le planning de SES voyages.
\*** L'Agent ne modifie que les evenements lies a SES dossiers.

### 1.8.7 Module Comptabilite

| Action | Super Admin | Admin | Manager | Agent | Comptable | Guide | Commercial | Client |
|--------|:-----------:|:-----:|:-------:|:-----:|:---------:|:-----:|:----------:|:------:|
| Voir les ecritures comptables | R | X | X | X | R | X | X | X |
| Creer une ecriture | - | X | X | X | C | X | X | X |
| Valider les ecritures | - | X | X | X | V | X | X | X |
| Faire le rapprochement bancaire | - | X | X | X | C | X | X | X |
| Voir les declarations TVA | - | X | X | X | R | X | X | X |
| Generer un rapport financier | - | R | X | X | C | X | X | X |
| Exporter les rapports | - | R | X | X | C | X | X | X |

### 1.8.8 Module Parametrage

| Action | Super Admin | Admin | Manager | Agent | Comptable | Guide | Commercial | Client |
|--------|:-----------:|:-----:|:-------:|:-----:|:---------:|:-----:|:----------:|:------:|
| Parametrer une agence (toutes) | CRUD | X | X | X | X | X | X | X |
| Parametrer son agence | - | M | X | X | X | X | X | X |
| Gerer les produits/catalogue | - | C | C | X | X | X | X | X |
| Gerer les tarifs | - | M | M | X | X | X | X | X |
| Gerer les modeles de facture | - | M | X | X | X | X | X | X |
| Gerer les parameters fiscaux | - | M | X | X | R | X | X | X |
| Gerer les zones geographiques | CRUD | X | X | X | X | X | X | X |
| Gerer le backup | CRUD | X | X | X | X | X | X | X |
| Voir les logs systeme | R | X | X | X | X | X | X | X |

### 1.8.9 Conditions speciales par role

#### Super Admin
- Voit TOUT, partout, toutes les agences.
- Ne peut pas etre desactive (protection anti-lockout).
- Ses actions sont auditees avec un niveau de detail superieur.
- Il ne modifie jamais directement les donnees d'une agence (il delegue a l'Admin de cette agence).
- Maximum 1 Super Admin par plateforme.

#### Admin
- Admin total de SA seule agence.
- Ne voit AUCUNE donnee d'une autre agence.
- Peut creer, modifier et desactiver les utilisateurs de son agence.
- Ne peut PAS se desactiver lui-meme.
- Son compte ne peut etre desactive que par un Super Admin.

#### Manager
- Gere une equipe d'agents (et optionnellement de commerciaux).
- Voit les dossiers et clients de SON EQUIPE uniquement.
- Peut affecter des dossiers a ses agents.
- Ne peut PAS gerer les comptes utilisateurs (pas de CUD sur les utilisateurs).
- Ne peut PAS acceder aux fonctions comptables.
- Limite de visibilite : un seul departement (Omra, Hajj, Voyages classiques, etc.).

#### Agent
- Voit UNIQUEMENT les dossiers et clients qui lui sont assigns.
- Ne voit PAS les dossiers des autres agents.
- Ne voit PAS les donnees financieres detaillees (juste le montant de SES factures).
- Peut creer des clients (mais pas les supprimer).
- Peut modifier les clients de SES dossiers uniquement.
- Limite : 50 dossiers actifs maximum (configurable par Admin).

#### Comptable
- Lecture seule sur tout le CRM et les dossiers.
- Ecriture/Modification uniquement sur les modules financiers.
- Peut voir les noms et montants, mais pas les details personnels sensibles des clients (CNI, passeport) sauf si necessaire pour une facture.
- Peut generer des rapports financiers.
- Ne peut PAS annuler des reservations.
- Ne peut PAS modifier les produits ou tarifs.

#### Guide
- Voit UNIQUEMENT les voyages auxquels il est affecte.
- Voit les informations des clients de SES voyages uniquement (noms, telephones, notes speciales -- pas les documents numerises).
- Peut signaler des incidents pendant le voyage.
- Peut marquer des points de presence (geolocalisation).
- Peut ajouter des commentaires post-voyage.
- Ne voit AUCUNE donnee financiere.

#### Commercial
- Travaille hors agence (terrain, salons,Prospection).
- Voit UNIQUEMENT ses leads et ses clients convertis.
- Peut creer des clients et des dossiers de reservation.
- Peut enregistrer des paiements.
- Ne voit PAS les donnees financieres detaillees de l'agence.
- Ne voit PAS les dossiers des autres commerciaux.
- Limite : 100 leads actifs maximum.

#### Client
- Voit UNIQUEMENT ses propres donnees.
- Peut modifier ses informations personnelles (nom, telephone, email, preferences).
- Peut consulter ses reservations et factures.
- Peut effectuer des paiements en ligne.
- Peut telecharger ses documents (billet, voucher).
- Peut laisser des evaluations et commentaires.
- Ne voit AUCUNE donnee d'un autre client.
- Ne voit PAS les marges, tarifs internes, ou donnees financieres de l'agence.

---

# MODULE 2 : CRM 360 degres

## 2.1 Vue d'ensemble

Le CRM 360 degres est le coeur du systeme. Il centralise toutes les informations relatives aux clients d'une agence de voyage. Chaque client dispose d'une fiche complete rassemblant ses donnees personnelles, ses documents, son historique de voyages, ses preferences et son score de fidelite.

### Objectifs
- Remplacer les fichiers Excel et les listes WhatsApp
- Offrir une vue unique et complete de chaque client
- Permettre un service personnalise et rapide
- Assurer la conformite RGPD/lois algeriennes sur les donnees personnelles

---

## 2.2 Fiche client complete

### 2.2.1 Schema de la fiche client

#### Section A : Informations personnelles

| Champ | Type | Obligatoire | Validation | Description |
|-------|------|------------|------------|-------------|
| `id` | UUID | auto | Auto-genere | Identifiant unique |
| `numero_client` | Texte | auto | Format : `CLT-AAAA-NNNNNN` (annee + sequence) | Numero sequentiel unique |
| `civilite` | Enum | OUI | `MONSIEUR`, `MADAME`, `MADEMOISELLE` | Civilitte |
| `nom` | Texte | OUI | 2-50 caracteres, alpha + tirets + espaces | Nom de famille |
| `prenom` | Texte | OUI | 2-50 caracteres | Prenom |
| `date_naissance` | Date | OUI | Pas de futur, age >= 0 | Date de naissance |
| `lieu_naissance` | Texte | OUI | 2-100 caracteres | Lieu de naissance |
| `sexe` | Enum | OUI | `HOMME`, `FEMME` | Sexe (pour repartition chambres) |
| `nationalite` | Texte | OUI | 2-50 caracteres | Nationalite (defaut : Algerienne) |
| `telephone_principal` | Telephone | OUI | Format algerien : `05XX XX XX XX` ou `06XX XX XX XX` | Telephone principal |
| `telephone_secondaire` | Telephone | NON | Format algerien | Telephone secondaire |
| `email` | Email | OUI | Format email valide, unique dans l'agence | Adresse email |
| `adresse_complete` | Texte | OUI | 10-200 caracteres | Adresse postale complete |
| `wilaya` | Select | OUI | Valeur parmi les 58 wilayas | Wilaya de residence |
| `commune` | Texte | OUI | 2-80 caracteres | Commune |
| `code_postal` | Texte | NON | 5 chiffres | Code postal |
| `photo_profil` | Fichier image | NON | PNG/JPG, max 1 Mo, 200x200px min | Photo du client |
| `statut` | Enum | auto | `ACTIF`, `INACTIF`, `BLOQUE`, `BLACKLISTE` | Statut (defaut : ACTIF) |
| `source_acquisition` | Enum | OUI | `BOCA_BOUCHE`, `INTERNET`, `RECOMMANDATION`, `SALON`, `PARTENAIRE`, `AUTRE` | Comment le client a ete acquis |
| `agent_id` | UUID | auto | ID de l'agent qui a cree la fiche | Agent reference |

#### Section B : Documents d'identite

| Champ | Type | Obligatoire | Validation | Description |
|-------|------|------------|------------|-------------|
| `cni_numero` | Texte | OUI | 18 chiffres (format algerien) | Numero CNI |
| `cni_date_emission` | Date | OUI | Pas de futur | Date d'emission CNI |
| `cni_date_expiration` | Date | OUI | Apres `date_emission` | Date d'expiration CNI |
| `cni_lieu_emission` | Texte | OUI | 2-80 caracteres | Lieu d'emission CNI |
| `passeport_numero` | Texte | NON | 2 lettres + 7 chiffres (algerien) | Numero de passeport |
| `passeport_date_emission` | Date | NON | -- | Date d'emission passeport |
| `passeport_date_expiration` | Date | NON | >= 6 mois pour Omra/Hajj | Date expiration passeport |
| `passeport_lieu_emission` | Texte | NON | -- | Lieu d'emission passeport |
| `passeport_nationalite` | Texte | NON | Defaut : Algerienne | Nationalite sur passeport |

#### Section C : Contacts d'urgence

| Champ | Type | Obligatoire | Validation | Description |
|-------|------|------------|------------|-------------|
| `contact_urgence_nom` | Texte | OUI | 3-80 caracteres | Nom du contact d'urgence |
| `contact_urgence_lien` | Enum | OUI | `EPOUX`, `PARENT`, `FRERE_SOEUR`, `AMI`, `AUTRE` | Lien de parente |
| `contact_urgence_telephone` | Telephone | OUI | Format algerien | Telephone du contact |
| `contact_urgence_email` | Email | NON | Format email valide | Email du contact |

#### Section D : Preferences

| Champ | Type | Obligatoire | Validation | Description |
|-------|------|------------|------------|-------------|
| `pref_alimentaires` | Multi-select | NON | `SANS_RESTRICTION`, `HALAL`, `VEGETARIEN`, `VEGAN`, `SANS_GLUTEN`, `SANS_LACTOSE`, `AUTRE` | Restrictions alimentaires |
| `pref_alimentaires_autre` | Texte | NON | 0-100 caracteres | Precisions si "AUTRE" |
| `pref_handicap` | Multi-select | NON | `AUCUN`, `MOBILITE_REDUITE`, `VISUEL`, `AUDITIF`, `AUTRE` | Besoins specifiques |
| `pref_handicap_details` | Texte | NON | 0-200 caracteres | Details des besoins |
| `pref_chambre` | Enum | NON | `SINGLE`, `DOUBLE`, `TWIN`, `FAMILY`, `SUITE`, `PAS_DE_PREFERENCE` | Type de chambre preferee |
| `pref_niveau_confort` | Enum | NON | `ECONOMIQUE`, `STANDARD`, `CONFORT`, `LUXE`, `PRESTIGE` | Niveau de confort |
| `pref_destination` | Multi-select | NON | Liste des destinations actives | Destinations preferees |
| `pref_saison` | Multi-select | NON | `PRINTEMPS`, `ETE`, `AUTOMNE`, `HIVER`, `PANNE` | Saisons preferees |
| `pref_budget_min` | Decimal | NON | >= 0 | Budget minimum par voyage |
| `pref_budget_max` | Decimal | NON | >= `budget_min` | Budget maximum par voyage |
| `pref_langue` | Multi-select | NON | `FRANCAIS`, `ARABE`, "TAMAZIGHT", `ANGLAIS` | Langues parlees |
| `notes_preferences` | Texte long | NON | 0-1000 caracteres | Notes libres sur les preferences |

#### Section E : Score de fidelite

| Champ | Type | Calcul | Description |
|-------|------|--------|-------------|
| `score_fidelite` | Entier | 0-100 (auto) | Score calcule automatiquement |
| `niveau_fidelite` | Enum | Auto | `BRONZE`, `ARGENT`, `OR`, `PLATINE`, `DIAMANT` |
| `nombre_voyages` | Entier | Auto | Nombre total de voyages effectues |
| `montant_total_depense` | Decimal | Auto | Montant total depense |
| `dernier_voyage_date` | Date | Auto | Date du dernier voyage |
| `days_depuis_dernier_voyage` | Entier | Auto | Jours depuis le dernier voyage |

**Algorithme de score de fidelite :**

```
score = 0

// Frequence (max 40 points)
Si nombre_voyages >= 10 : score += 40
Si nombre_voyages >= 5 : score += 30
Si nombre_voyages >= 3 : score += 20
Si nombre_voyages >= 1 : score += 10

// Montant depense (max 30 points)
Si montant_total >= 5,000,000 DA : score += 30
Si montant_total >= 2,000,000 DA : score += 25
Si montant_total >= 1,000,000 DA : score += 20
Si montant_total >= 500,000 DA : score += 15
Si montant_total >= 100,000 DA : score += 10

// Recence (max 20 points)
Si dernier_voyage < 3 mois : score += 20
Si dernier_voyage < 6 mois : score += 15
Si dernier_voyage < 12 mois : score += 10
Si dernier_voyage < 24 mois : score += 5

// Evaluation (max 10 points)
Si moyenne_notes >= 4.5 : score += 10
Si moyenne_notes >= 4.0 : score += 8
Si moyenne_notes >= 3.0 : score += 5
Si moyenne_notes < 3.0 : score += 0

// Niveaux
BRONZE    : 0-20
ARGENT    : 21-40
OR        : 41-60
PLATINE   : 61-80
DIAMANT   : 81-100
```

#### Section F : Tags et segments

| Champ | Type | Obligatoire | Validation | Description |
|-------|------|------------|------------|-------------|
| `tags` | Array of strings | NON | 1-30 caracteres par tag, max 20 tags | Etiquettes libres |
| `segments` | Array of enums | NON | `VIP`, `FREQUENT`, `NOUVEAU`, `GROUPE`, `FAMILLE`, `AFFAIRE`, `SENIOR`, `ETUDIANT`, `DIASPORA` | Segments predefinis |

**Regles metier :**
- Les tags sont crees librement par l'Admin/Manager.
- Les segments sont predefinis et ne peuvent pas etre modifies par l'Agent.
- Un client peut appartenir a plusieurs segments.
- Le segment `VIP` est attribue manuellement par Admin/Manager (pas automatique).
- Le segment `NOUVEAU` est retire automatiquement apres le 1er voyage.
- Le segment `FREQUENT` est attribue automatiquement a partir de 3 voyages.

### 2.2.2 Regles de validation globales

1. La combinaison `nom` + `prenom` + `date_naissance` + `telephone_principal` doit etre unique dans l'agence (anti-doublon).
2. Le `passeport_date_expiration` doit etre dans au moins 6 mois pour les dossiers Omra/Hajj.
3. Le `cni_date_expiration` ne doit pas etre expirée (sinon warning, pas blocage).
4. L'email doit etre unique dans l'agence.
5. Le numero de client (`numero_client`) est genere automatiquement et unique.

### 2.2.3 Transitions de statut client

| Statut source | Statuts cibles | Conditions | Roles autorises |
|---------------|---------------|------------|-----------------|
| `ACTIF` | `INACTIF` | Aucun voyage actif en cours | Admin, Manager |
| `ACTIF` | `BLOQUE` | Manuel (dette, litige) | Admin |
| `ACTIF` | `BLACKLISTE` | Manuel (fraude, comportement grave) | Admin, Super Admin |
| `INACTIF` | `ACTIF` | Manuel (reactivation) | Admin, Manager, Agent |
| `BLOQUE` | `ACTIF` | Paiement effectue ou litige resolu | Admin |
| `BLACKLISTE` | `ACTIF` | Decision Super Admin uniquement | Super Admin |

---

## 2.3 Gestion des documents numerises et OCR

### 2.3.1 Types de documents supportes

| Type | Extensions | Taille max | Obligatoire pour |
|------|-----------|------------|-----------------|
| Passeport (page garde + page visa) | JPG, PNG, PDF | 5 Mo par fichier | Omra, Hajj, Voyage international |
| CNI (recto + verso) | JPG, PNG, PDF | 5 Mo par fichier | Tous les voyages |
| Visa | JPG, PNG, PDF | 5 Mo par fichier | Selon destination |
| Photo d'identite | JPG, PNG | 2 Mo | Omra, Hajj |
| Certificat vaccination | JPG, PNG, PDF | 5 Mo par fichier | Omra, Hajj (COVID, meningite) |
| Autre document | JPG, PNG, PDF | 5 Mo par fichier | Selon besoin |

### 2.3.2 Fonctionnalite : Upload de document

**Declencheur :** Un utilisateur avec le role C sur les documents clique "Ajouter un document".

**Champs :**

| Champ | Type | Obligatoire | Validation |
|-------|------|------------|------------|
| `type_document` | Enum | OUI | Parmi les types listes ci-dessus |
| `fichier` | Fichier | OUI | Extension et taille conformes |
| `description` | Texte | NON | 0-200 caracteres |
| `date_emission` | Date | NON | Date du document |
| `date_expiration` | Date | NON | Date d'expiration du document |

**Regles metier :**
1. Le fichier est stocke dans un stockage objet (S3/MinIO) avec chiffrement AES-256 au repos.
2. Un chemin unique est genere : `{agence_id}/clients/{client_id}/{type}/{annee}/{uuid}.{ext}`
3. Apres upload, un job OCR est lance automatiquement.
4. L'OCR extrait les champs cles (numero CNI, nom, date de naissance, etc.) et propose de pre-remplir la fiche client.
5. L'utilisateur valide ou corrige les champs OCR extraites.
6. Un thumbnail est genere automatiquement (max 200x200).
7. L'historique des versions est conserve (pas d'ecrasement).

### 2.3.3 Fonctionnalite : OCR automatique

**Declencheur :** Automatique apres upload d'un document.

**Champs extraits par type :**

| Type document | Champs OCR |
|---------------|-----------|
| CNI recto | `cni_numero`, `nom`, `prenom`, `date_naissance`, `lieu_naissance`, `sexe`, `nationalite` |
| CNI verso | `cni_date_emission`, `cni_date_expiration`, `cni_lieu_emission` |
| Passeport | `passeport_numero`, `nom`, `prenom`, `date_naissance`, `nationalite`, `sexe` |
| Passeport page visa | `pays_destination`, `date_validite_visa`, `type_visa` |
| Photo d'identite | Detection de visage (qualite, position) |

**Regles metier :**
1. Le taux de confiance OCR est affiche a cote de chaque champ (ex: "Confiance : 95%").
2. Si confiance < 80%, le champ est surligne en jaune (verification manuelle recommandee).
3. Si confiance < 50%, le champ n'est pas pre-rempli (trop peu fiable).
4. L'OCR ne MODIFIE PAS automatiquement les champs existants -- il propose seulement.
5. L'utilisateur doit cliquer "Appliquer" pour valider les champs OCR.

### 2.3.4 Regles de visibilite des documents

| Role | Voir les documents | Telecharger | Supprimer |
|------|-------------------|-------------|-----------|
| Admin | Tous (son agence) | Oui | Oui |
| Manager | Tous (son equipe) | Oui | Non |
| Agent | Documents de SES clients | Oui | Non |
| Comptable | Justificatifs de facturation uniquement | Oui | Non |
| Guide | Passeport + visa + photos des clients de SES voyages | Non (affichage uniquement) | Non |
| Commercial | Documents de SES clients | Oui | Non |
| Client | Ses propres documents | Oui | Non |

---

## 2.4 Historique client

### 2.4.1 Vue historique

L'historique client rassemble automatiquement :

| Section | Contenu | Source |
|---------|---------|--------|
| **Voyages** | Liste de tous les dossiers (Omra, Hajj, Classique, Groupe) | Module Omra/Hajj + Reservations |
| **Paiements** | Tous les paiements (acomptes, soldes, avenants) | Module Facturation |
| **Evaluations** | Notes et commentaires post-voyage | Module Post-voyage |
| **Interactions** | Appels, emails, rendez-vous, notes | CRM (ajoutées manuellement) |
| **Documents** | Liste des documents avec dates | Module Documents |
| **Changements** | Historique des modifications de la fiche | Audit trail (module Auth) |

### 2.4.2 Filtres de l'historique

| Filtre | Type | Valeurs |
|--------|------|---------|
| Periode | Date range | De... A... |
| Type de voyage | Multi-select | Omra, Hajj, Classique, Groupe, Croisiere |
| Statut | Multi-select | En cours, Termine, Annule |
| Montant | Range | Min... Max... |
| Destination | Multi-select | Liste des destinations |

---

## 2.5 Tags, segments et scoring

### 2.5.1 Gestion des tags

**Creer un tag :**
| Champ | Type | Obligatoire | Validation |
|-------|------|------------|------------|
| `nom_tag` | Texte | OUI | 1-30 caracteres, unique dans l'agence |
| `couleur` | Code couleur | OUI | Hex color (#RRGGBB) |

**Regles metier :**
- Maximum 100 tags par agence.
- Un tag peut etre retire d'un client a tout moment.
- Les tags sont visibles sur la fiche client et dans les filtres de recherche.
- Un tag supprime est retire de tous les clients concernes.

### 2.5.2 Attribution de segment

**Attribution automatique :**

| Segment | Condition | Retrait automatique |
|---------|-----------|-------------------|
| `NOUVEAU` | Premiere creation dans le CRM | Apres 1er voyage complete |
| `FREQUENT` | >= 3 voyages effectues | Jamais |
| `DIASPORA` | Adresse en dehors d'Algerie + nationalite Algerienne | Manuel uniquement |
| `FAMILLE` | >= 3 personnes dans un meme dossier | Jamais (mais peut devenir INACTIF si plus de dossier famille) |

**Attribution manuelle :**

| Segment | Qui peut attribuer |
|---------|-------------------|
| `VIP` | Admin, Manager |
| `GROUPE` | Admin, Manager, Agent |
| `AFFAIRE` | Admin, Manager, Agent |
| `SENIOR` | Admin, Manager, Agent |
| `ETUDIANT` | Admin, Manager, Agent |

---

## 2.6 Recherche avancee

### 2.6.1 Barre de recherche globale

**Champs indexes (recherche instantanee, < 200ms) :**

| Critere | Type de recherche | Exemple |
|---------|------------------|---------|
| Nom / Prenom | Contient, insensible a la casse | "ben ali" trouve "Ben Ali", "BEN ALI" |
| Telephone | Contient (sans espaces/tirets) | "0555" trouve "05 55 12 34 56" |
| Email | Contient | "ahmed" trouve "ahmed@gmail.com" |
| Numero passeport | Exact | "12345678" |
| Numero CNI | Exact | "123456789012345678" |
| Numero client | Exact | "CLT-2026-000123" |
| Tags | Exact (tag coche) | Selection de tag(s) |
| Segments | Exact (segment coche) | Selection de segment(s) |

### 2.6.2 Filtres avances

| Filtre | Type | Description |
|--------|------|-------------|
| `wilaya` | Multi-select | Wilaya de residence |
| `sexe` | Select | Homme / Femme |
| `age_min` / `age_max` | Entier | Tranche d'age (calcule depuis date_naissance) |
| `statut` | Multi-select | Actif, Inactif, Bloque, Blackliste |
| `score_min` / `score_max` | Entier | Score de fidelite |
| `niveau_fidelite` | Multi-select | Bronze, Argent, Or, Platine, Diamant |
| `nombre_voyages_min` / `_max` | Entier | Nombre de voyages |
| `dernier_voyage_avant` / `_apres` | Date | Recence du dernier voyage |
| `source_acquisition` | Multi-select | Comment acquis |
| `agent_reference` | Select | Agent qui a cree la fiche |
| `date_creation_avant` / `_apres` | Date | Date de creation de la fiche |
| `a_documents_expires` | Boolean | Clients avec documents expires |
| `a_passeport_expire_6_mois` | Boolean | Passeport expire dans < 6 mois |
| `pref_handicap` | Multi-select | Besoins specifiques |
| `pref_alimentaires` | Multi-select | Restrictions alimentaires |

### 2.6.3 Resultats de recherche

| Colonne | Tri possible | Affichage |
|---------|-------------|-----------|
| Photo miniature | Non | 40x40px |
| Numero client | Oui | CLT-AAAA-NNNNNN |
| Nom Prenom | Oui | "Ahmed BENALI" |
| Telephone | Oui | 05 XX XX XX XX |
| Segments | Non | Badges colores |
| Tags | Non | Badges colores (max 3 visibles + "+N") |
| Score fidelite | Oui | Badge colore par niveau |
| Nombre voyages | Oui | Chiffre |
| Statut | Oui | Badge colore |
| Actions | Non | Voir, Modifier, Supprimer (selon role) |

**Pagination :**
- 20 resultats par page (defaut), 50, 100 (configurable).
- Compteur total : "Affichage 1-20 sur 1 234 clients".

---

## 2.7 Import / Export / Dedoublonnage

### 2.7.1 Export CSV/Excel

**Declencheur :** Un Admin/Manager clique "Exporter" depuis la liste des clients.

**Champs d'export :**

| Option | Description |
|--------|-------------|
| Format | CSV (UTF-8) ou Excel (.xlsx) |
| Colonnes | Selection de colonnes a exporter (toutes par defaut) |
| Filtres | Les filtres actuels sont appliques a l'export |
| Encodage | UTF-8 (defaut) ou UTF-8 BOM (compatibilite Excel algerien) |

**Regles metier :**
1. L'export est limite a 10 000 lignes par requete.
2. Si plus de 10 000 resultats : proposer un export par tranches ou un export complet en tache de fond (notification quand pret).
3. Les documents numerises ne sont PAS inclus dans l'export (juste les liens).
4. Les notes internes sont incluses (si export par Admin/Manager).
5. L'export est enregistre dans l'audit trail.
6. Un timestamp est ajoute au nom du fichier : `clients_export_2026-07-24_14-30.csv`.

### 2.7.2 Import en masse

**Declencheur :** Un Admin/Manager clique "Importer" depuis la liste des clients.

**Format d'import :**

| Colonne CSV/Excel | Obligatoire | Format | Description |
|-------------------|------------|--------|-------------|
| `civilite` | OUI | MONSIEUR/MADAME/MADEMOISELLE | Civilitte |
| `nom` | OUI | Texte 2-50 char | Nom |
| `prenom` | OUI | Texte 2-50 char | Prenom |
| `date_naissance` | OUI | JJ/MM/AAAA | Date de naissance |
| `sexe` | OUI | HOMME/FEMME | Sexe |
| `telephone_principal` | OUI | 05XX... / 06XX... | Telephone |
| `email` | OUI | Format email | Email |
| `wilaya` | OUI | Nom ou code de la wilaya | Wilaya |
| `adresse_complete` | OUI | Texte | Adresse |
| `cni_numero` | OUI | 18 chiffres | CNI |
| `passeport_numero` | NON | 2L + 7 chiffres | Passeport |
| `contact_urgence_nom` | OUI | Texte | Contact d'urgence |
| `contact_urgence_telephone` | OUI | Telephone | Tel. contact |
| `contact_urgence_lien` | OUI | EPOUX/PARENT/FRERE_SOEUR/AMI/AUTRE | Lien |

**Etapes d'import :**

1. **Upload du fichier** : L'utilisateur selectionne le fichier CSV/Excel.
2. **Validation structurelle** : Le systeme verifie les colonnes, le format, les types.
3. **Rapport d'erreurs** : Si des erreurs sont detectees, afficher un tableau avec ligne/erreur/suggestion.
4. **Preview** : Afficher les 5 premieres lignes avec detection des doublons potentiels.
5. **Detection de doublons** : Pour chaque ligne, verifier si un client similaire existe (nom+prenom+naissance ou telephone ou email).
   - Si doublon detecte : proposer "Ignorer", "Mettre a jour", "Creer quand meme".
6. **Validation metier** : Verifier les regles de metier (telephone algerien, email valide, etc.).
7. **Import effectif** : Importer ligne par ligne avec barre de progression.
8. **Rapport final** : "X clients importes, Y doublons ignores, Z erreurs".
9. **Audit trail** : Enregistrer l'import avec nombre de lignes traitees.

### 2.7.3 Dedoublonnage

**Declencheur :** Un Admin/Manager clique "Detecter les doublons" dans le CRM.

**Algorithme de detection :**

| Critere | Poids | Seuil de match |
|---------|-------|---------------|
| Nom + Prenom (phonetique, Soundex algerien) | 40% | >= 85% similarite |
| Telephone (sans espaces) | 30% | 100% (exact) |
| Email | 20% | 100% (exact) |
| Date de naissance | 10% | 100% (exact) |
| **Seuil global** | **100%** | **>= 70%** |

**Actions sur les doublons :**

| Action | Description |
|--------|-------------|
| **Fusionner** | Fusionner les deux fiches. L'utilisateur choisit quels champs garder pour chaque conflit. Les historiques sont combines. |
| **Ignorer** | Marquer comme "non-doublon" -- ne plus proposer cette paire. |
| **Supprimer le doublon** | Supprimer la fiche secondaire (les dossiers lies sont deplaces vers la fiche principale). |

---

## 2.8 QR Code client

### 2.8.1 Fonctionnalite : Generer le QR Code

**Declencheur :** Un utilisateur avec les droits R sur le client clique "Generer QR Code" dans la fiche client.

**Contenu du QR Code :**
- URL unique : `https://{domaine}/client/{numero_client}` (acces rapide fiche)
- Contenu minimal : `NOM PRENOM | CLT-AAAA-NNNNNN | TEL: 05XX XX XX XX`

**Format :**
- PNG, 300x300px, blanc sur noir
- Logo Agence Pro au centre (optionnel)

### 2.8.2 Fonctionnalite : Scanner le QR Code

**Declencheur :** Un agent/manager scanne le QR code d'un client (via l'app mobile ou un scanner web).

**Comportement :**
- Si scanne depuis l'app Agence Pro : ouvre directement la fiche client complete (selon les droits du role).
- Si scanne depuis un navigateur web : redirige vers la page de login si non connecte, puis fiche client.
- Si le client n'existe pas dans la base : message "Client introuvable -- Voulez-vous en creer un nouveau ?"

### 2.8.3 Utilisation physique

- Le QR Code peut etre imprime et remis au client (carte de fidelite physique).
- Le QR Code peut etre ajoute sur les factures et contrats.
- Le QR Code peut etre affiche sur l'ecran de l'agent pendant un appel avec le client (scan rapide pour acceder aux infos).

---

# MODULE 3 : Gestion Omra & Hajj

## 3.1 Vue d'ensemble du cycle de vie

Le module Omra & Hajj gere le cycle de vie complet d'un dossier de voyage religieux, de la creation a l'archivage. C'est un module critique pour les agences algeriennes car l'Omra et le Hajj representent une part significative du chiffre d'affaires.

### Cycle de vie d'un dossier

```
BROUILLON
   |
   v
EN_COURS_DEConfiguration
   |
   v
EN_ATTENTE_VALIDATION
   |
   v
CONFIRME
   |
   v
VISA_EN_COURS
   |
   v
VISA_OBTENU
   |
   v
PAYEMENT_EN_COURS
   |
   v
PAYE
   |
   v
PRET_A_PARTIR
   |
   v
EN_COURS
   |
   v
TERMINE
   |
   v
ARCHIVE
```

**Transitions annulation (depuis n'importe quel statut sauf ARCHIVE et TERMINE) :**

```
* -> ANNULE
   - Condition : motif obligatoire
   - Declencheur de remboursement si des paiements existent
```

### 3.1.1 Types de voyage

| Code | Libelle | Description |
|------|---------|-------------|
| `OMRA_RAMADAN` | Omra Ramadan | Omra pendant le mois de Ramadan |
| `OMRA_HORS_RAMADAN` | Omra hors Ramadan | Omra en dehors du Ramadan |
| `HAJJ` | Hajj | Hajj complet (pelerinage obligatoire) |
| `HAJJ_MOUWATANA` | Hajj par la nationale | Hajj via les quotas nationaux |
| `HAJJ_NON_MOUWATANA` | Hajj hors quota | Hajj hors quota officiel |
| `UMRA_PLUS` | Omra+ | Omra + visite touristique |
| `AUTRE` | Autre voyage religieux | Autre type de voyage a vocation religieuse |

### 3.1.2 Periodes

| Periode | Dates approximatives | Remarque |
|---------|---------------------|----------|
| Omra Ramadan | 1er Ramadan - 27 Ramadan (selon calendrier lunaire) | Forte demande, tarifs eleves |
| Omra hors Ramadan | Toute l'annee | Periodes creuses moins cheres |
| Hajj | 8-12 Dhoul Hijja (selon calendrier lunaire) | Quota limite par pays |
| Omra+ | Toute l'annee | Combinaison Omra + tourisme |

---

## 3.2 Etape 1 : Creation du dossier

### 3.2.1 Fonctionnalite : Creer un dossier Omra/Hajj

**Declencheur :** Un Agent/Manager/Admin clique "Nouveau dossier Omra/Hajj" depuis le tableau de bord ou depuis la fiche d'un client existant.

**Champs du formulaire de creation :**

#### Section A : Informations generales

| Champ | Type | Obligatoire | Validation | Description |
|-------|------|------------|------------|-------------|
| `type_voyage` | Enum | OUI | `OMRA_RAMADAN`, `OMRA_HORS_RAMADAN`, `HAJJ`, `HAJJ_MOUWATANA`, `HAJJ_NON_MOUWATANA`, `UMRA_PLUS`, `AUTRE` | Type de voyage |
| `client_id` | UUID | OUI | Client existant dans le CRM | Client principal du dossier |
| `periode_souhaitee` | Texte | OUI | 5-50 caracteres | Periode souhaitee (ex: "3eme decennie Ramadan 2027") |
| `date_debut_souhaitee` | Date | OUI | >= date du jour | Date de debut souhaitee |
| `date_fin_souhaitee` | Date | OUI | >= `date_debut_souhaitee` | Date de fin souhaitee |
| `nombre_personnes` | Entier | OUI | 1-50 | Nombre de personnes dans le dossier (client + accompagnants) |
| `type_groupe` | Enum | OUI | `INDIVIDUEL`, `FAMILLE`, `GROUPE` | Type de voyage |
| `notes_agent` | Texte long | NON | 0-2000 caracteres | Notes de l'agent (visibles par l'equipe uniquement) |

**Regles metier :**
1. Le dossier est cree en statut `BROUILLON`.
2. Le client selectionne DOIT etre present dans le CRM (pas de creation depuis ce formulaire -- on crée le client d'abord).
3. Le `nombre_personnes` inclut le client principal.
4. Pour le Hajj, la periode est fixe (Dhoul Hijja) -- le champ `periode_souhaitee` est pre-rempli.
5. Un seul dossier actif par client pour la meme periode de Hajj.
6. Maximum 3 dossiers Omra actifs par client a la fois.

**Donnees en sortie :**
- Dossier cree en statut `BROUILLON`
- Numero de dossier genere : `{TYPE}-{ANNEE}-{SEQUENCE}` (ex: `OMR-2027-000456`, `HAJ-2026-000123`)

### 3.2.2 Ajout des accompagnants

**Declencheur :** L'utilisateur clique "Ajouter un accompagnant" dans le dossier.

**Champs :**

| Champ | Type | Obligatoire | Validation | Description |
|-------|------|------------|------------|-------------|
| `client_id` | UUID | NON | Client existant OU creer nouveau | Lien vers le CRM |
| `civilite` | Enum | OUI | MONSIEUR/MADAME/MADEMOISELLE | Civilitte |
| `nom` | Texte | OUI | 2-50 caracteres | Nom |
| `prenom` | Texte | OUI | 2-50 caracteres | Prenom |
| `date_naissance` | Date | OUI | >= 0 ans | Date de naissance |
| `sexe` | Enum | OUI | HOMME/FEMME | Sexe |
| `lien_avec_client` | Enum | OUI | `EPOUX`, `EPOUXE`, `ENFANT`, `PARENT`, `FRERE_SOEUR`, `AMI`, `AUTRE` | Lien avec le client principal |
| `telephone` | Telephone | OUI | Format algerien | Telephone |
| `passeport_numero` | Texte | OUI | 2L+7C | Numero de passeport |
| `passeport_expiration` | Date | OUI | >= 6 mois | Expiration passeport |
| `besoin_chambre` | Enum | OUI | `OUI`, `NON` | A-t-il besoin d'une chambre ? |
| `besoins_speciaux` | Texte | NON | 0-500 caracteres | Handicap, regime alimentaire, etc. |

**Regles metier :**
1. Le nombre d'accompagnants ne peut pas depasser `nombre_personnes - 1`.
2. Si l'accompagnant est deja un client du CRM, ses informations sont pre-remplies.
3. Si l'accompagnant n'est pas dans le CRM, il est cree automatiquement dans le CRM avec le statut `ACTIF`.
4. Les accompagnants mineurs ( < 18 ans) ne peuvent pas etre clients principaux.

---

## 3.3 Etape 2 : Choix du programme

### 3.3.1 Fonctionnalite : Selectionner le programme

**Declencheur :** L'Agent/Manager clique "Choisir le programme" dans un dossier en statut `BROUILLON` ou `EN_COURS_DE_CONFIGURATION`.

**Champs :**

#### A. Forfait

| Champ | Type | Obligatoire | Validation | Description |
|-------|------|------------|------------|-------------|
| `programme_id` | UUID | OUI | Programme existant et actif pour le type + periode | Forfait selectionne |
| `nom_programme` | Texte | auto | Copie du programme | Nom du programme |
| `date_debut` | Date | OUI | >= date du jour, dans la periode du programme | Date debut effective |
| `date_fin` | Date | OUI | > `date_debut` | Date fin effective |
| `nombre_nuits` | Entier | auto | Calcule | Nombre de nuits |
| `nombre_jours` | Entier | auto | Calcule | Nombre de jours |
| `type_chambre` | Enum | OUI | `SINGLE`, `DOUBLE`, `TWIN`, `TRIPLE`, `QUAD`, `FAMILY` | Type de chambre |
| `classe_programme` | Enum | OUI | `ECONOMIQUE`, `STANDARD`, `CONFORT`, `LUXE`, `PRESTIGE` | Niveau du programme |
| `tarif_base_personne` | Decimal | auto | Copie du tarif programme | Tarif par personne (DA) |
| `remise_pourcentage` | Decimal | NON | 0-50% | Remise eventuelle |
| `remise_montant` | Decimal | auto | Calcule | Montant de la remise |
| `supplement_chambre_single` | Decimal | auto | Selon programme | Supp. chambre individuelle |
| `prix_total` | Decimal | auto | Calcule | Prix total du forfait |
| `conditions_annulation` | Texte | auto | Copie du programme | Conditions d'annulation |

**Algorithme de calcul du prix total :**

```
prix_total = (tarif_base_personne * nombre_personnes) - remise_montant
Si type_chambre == SINGLE ET nombre_personnes > 1:
    prix_total += supplement_chambre_single * (nombre_personnes - 1)
```

#### B. Vol

| Champ | Type | Obligatoire | Validation | Description |
|-------|------|------------|------------|-------------|
| `compagnie` | Texte | OUI | 2-50 caracteres | Compagnie aerienne |
| `vol_numero` | Texte | OUI | Format : 2 lettres + 4 chiffres (ex: AH3020) | Numero de vol |
| `aeroport_depart` | Texte | OUI | Code IATA ou nom complet | Aeroport de depart (ex: ALG) |
| `aeroport_arrivee` | Texte | OUI | Code IATA ou nom complet | Aeroport d'arrivee (ex: JED) |
| `date_heure_depart` | DateTime | OUI | ISO 8601 | Date et heure de depart |
| `date_heure_arrivee` | DateTime | OUI | > `date_heure_depart` | Date et heure d'arrivee |
| `classe` | Enum | OUI | `ECONOMIQUE`, `PREMIUM_ECO`, `BUSINESS`, `PREMIER` | Classe de vol |
| `tarif_personne` | Decimal | OUI | >= 0 | Tarif par personne (DA) |
| `escales` | Texte | NON | 0-200 caracteres | Details des escales |
| `bagage_cabine_kg` | Decimal | NON | Defaut: 7 | Poids bagage cabine |
| `bagage_soute_kg` | Decimal | NON | Defaut: 23 | Poids bagage soute |

**Regles metier :**
1. Le vol aller et le vol retour sont saisis separement.
2. Un dossier Omra/Hajj a TOUJOURS un vol aller + retour.
3. Le `tarif_personne` est multiplie par le `nombre_personnes` pour le sous-total vol.
4. Si le vol est avec un partenaire (compagnie non directe), le statut est `EN_ATTENTE_CONFIRMATION_PARTENAIRE`.

#### C. Hotel

| Champ | Type | Obligatoire | Validation | Description |
|-------|------|------------|------------|-------------|
| `hotel_id` | UUID | OUI | Hotel partenaire actif | Hotel selectionne |
| `nom_hotel` | Texte | auto | Copie | Nom de l'hotel |
| `ville` | Texte | OUI | Mecque, Medina, Jedda, Autre | Ville de l'hotel |
| `distance_haram_km` | Decimal | auto | Copie du referentiel | Distance au Haram (km) |
| `etoiles` | Entier | auto | Copie | Nombre d'etoiles |
| `date_checkin` | Date | OUI | Conforme au programme | Date d'arrivee a l'hotel |
| `date_checkout` | Date | OUI | > `date_checkin` | Date de depart de l'hotel |
| `nombre_nuits` | Entier | auto | Calcule | Nombre de nuits |
| `type_chambre` | Enum | OUI | SINGLE/DOUBLE/TWIN/TRIPLE/QUAD/FAMILY/SUITE | Type de chambre |
| `nombre_chambres` | Entier | OUI | Calcule selon le type et le nombre de personnes | Nombre de chambres |
| `tarif_nuit_chambre` | Decimal | OUI | >= 0 | Tarif par nuit par chambre (DA) |
| `petit_dejeuner_inclus` | Boolean | OUI | true/false | Petit-dejeuner inclus ? |
| `wifi_inclus` | Boolean | NON | defaut: true | WiFi inclus ? |
| `transfert_hotel_inclus` | Boolean | NON | defaut: false | Transfert aeroport-hotel inclus ? |
| `sous_total_hotel` | Decimal | auto | Calcule | Sous-total hotel |

**Algorithme de calcul sous-total hotel :**

```
sous_total_hotel = tarif_nuit_chambre * nombre_chambres * nombre_nuits
```

#### D. Transport terrestre

| Champ | Type | Obligatoire | Validation | Description |
|-------|------|------------|------------|-------------|
| `type_transport` | Enum | OUI | `BUS_PRIVE`, `BUS_COLLECTIF`, "VOITURE_PRIVEE", `MINI_BUS` | Type de transport |
| `prestataire_id` | UUID | OUI | Prestataire actif | Prestataire de transport |
| `itineraire` | Texte | OUI | 5-200 caracteres | Ex: "Aeroport Jedda -> Hotel Mecque -> Haram" |
| `date_depart` | DateTime | OUI | Conforme au programme | Date/heure de depart |
| `date_arrivee` | DateTime | OUI | > `date_depart` | Date/heure d'arrivee |
| `nombre_vehicules` | Entier | OUI | Selon le nombre de personnes | Nombre de vehicules |
| `capacite_vehicule` | Entier | OUI | Capacite par vehicule | Capacite par vehicule |
| `tarif_total` | Decimal | OUI | >= 0 | Tarif total du transport (DA) |

**Regles metier :**
1. Le transport est generalement inclus dans le programme (Omra/Hajj包组织).
2. Si transport non inclus, il est ajoute separement.
3. Le tarif est par trajet (aeroport-hotel, hotel-Haram, etc.).

### 3.3.2 Synthese financiere du programme

Apres selection de tous les elements, un resume est affiche :

| Poste | Montant (DA) |
|-------|-------------|
| Forfait (x nombre_personnes) | XXX,XXX |
| Vol aller+retour | XXX,XXX |
| Hotel | XXX,XXX |
| Transport terrestre | XXX,XXX |
| Visa (si applicable) | XXX,XXX |
| Assurance voyage | XXX,XXX |
| **Sous-total HT** | **XXX,XXX** |
| TVA (19%) | XX,XXX |
| **Total TTC** | **XXX,XXX** |
| Remise (si applicable) | -XX,XXX |
| **APRES REMISE** | **XXX,XXX** |
| Commission agence (configurable) | XX,XXX |
| **PRIX CLIENT FINAL** | **XXX,XXX** |

### 3.3.3 Validation du programme

**Conditions pour valider le programme :**
1. Au moins un forfait selectionne.
2. Vol aller + retour saisi.
3. Au moins un hotel saisi (Mecque + Medina pour Omra/Hajj classique).
4. Le `date_debut_programme` est compatible avec les dates des elements reserves.
5. Le nombre de chambres suffit pour le nombre de personnes.
6. Tous les tarifs sont saisis et positifs.

---

## 3.4 Etape 3 : Repartition automatique des chambres

### 3.4.1 Algorithme de repartition

**Entrees :**
- Liste des personnes (client + accompagnants)
- Type de chambre selectionne
- Nombre de chambres reservees
- Regles de repartition

**Regles de repartition :**

| Regle | Priorite | Description |
|-------|----------|-------------|
| **Separation genres** | 1 | Hommes et femmes ne partagent PAS de chambre (sauf couples) |
| **Familles ensemble** | 2 | Les membres d'une meme famille partagent une chambre si possible |
| **Couples ensemble** | 3 | Les couples (EPOUX/EPOUXE) partagent toujours une chambre |
| **Mineurs avec parents** | 4 | Les mineurs (< 18 ans) partagent la chambre de leurs parents |
| **Capacite maximale** | 5 | Respecter la capacite max de chaque type de chambre |
| **Preferences individuelles** | 6 | Respecter les preferences de chambre de chaque personne |

**Capacite par type de chambre :**

| Type | Cap. max personnes | Composition typique |
|------|-------------------|---------------------|
| SINGLE | 1 | 1 personne seule |
| DOUBLE | 2 | 2 adultes (hommes ou femmes ou couple) |
| TWIN | 2 | 2 lits separes (hommes ou femmes) |
| TRIPLE | 3 | 3 personnes du meme genre ou famille |
| QUAD | 4 | 4 personnes du meme genre ou famille |
| FAMILY | 4-6 | Famille avec enfants |
| SUITE | 2-4 | Couple ou famille, luxe |

### 3.4.2 Fonctionnalite : Voir la repartition proposee

**Affichage :**

Pour chaque chambre :

| Champ | Description |
|-------|-------------|
| `numero_chambre` | Identifiant (CHB-01, CHB-02...) |
| `type_chambre` | Type |
| `occupants` | Liste des personnes avec nom, prenom, lien |
| `genre` | Genre dominant de la chambre |
| `statut` | `CONFIRMEE`, `EN_ATTENTE`, `MODIFIEE` |

### 3.4.3 Fonctionnalite : Modifier la repartition

**Declencheur :** L'utilisateur clique "Modifier la repartition" pour changer manuellement l'affectation.

**Actions possibles :**
- Deplacer une personne d'une chambre a une autre
- Creer une chambre supplementaire
- Supprimer une chambre vide
- Permuter deux chambres

**Regles metier :**
1. Apres modification, les regles de separation de genre sont reverifiees automatiquement.
2. Si une violation est detectee, un warning est affiche (pas un blocage -- l'utilisateur peut forcer avec justification).
3. Un changement de chambre peut impacter les tarifs (si le type de chambre change).
4. L'historique des modifications est conserve.

### 3.4.4 Repartition automatique vs manuelle

| Mode | Declencheur | Conditions |
|------|-------------|------------|
| **Automatique** | Clique "Repartition automatique" | Toutes les personnes ont leur genre et lien renseignes |
| **Manuelle** | Clique "Modifier la repartition" | A tout moment |
| **Hybride** | Lancement auto puis ajustement | Par defaut |

---

## 3.5 Etape 4 : Gestion des groupes

### 3.5.1 Fonctionnalite : Creer un groupe

**Declencheur :** Un Admin/Manager/Agent cree un groupe depuis le tableau de bord Omra/Hajj ou depuis un dossier existant.

**Champs :**

| Champ | Type | Obligatoire | Validation | Description |
|-------|------|------------|------------|-------------|
| `nom_groupe` | Texte | OUI | 3-100 caracteres, unique par annee et type | Nom du groupe |
| `type_voyage` | Enum | OUI | Meme enum que les dossiers | Type de voyage concerne |
| `periode` | Texte | OUI | 5-50 caracteres | Periode du voyage |
| `date_debut` | Date | OUI | -- | Date de debut |
| `date_fin` | Date | OUI | > `date_debut` | Date de fin |
| `nombre_max` | Entier | OUI | 10-200 | Capacite maximale du groupe |
| `chef_groupe_id` | UUID | OUI | Agent ou Guide de l'agence | Chef de groupe designe |
| `description` | Texte long | NON | 0-1000 caracteres | Description du programme du groupe |
| `statut` | Enum | auto | `FORMATION`, `COMPLET`, `CONFIRME`, `EN_COURS`, `TERMINE` | Statut du groupe |

### 3.5.2 Fonctionnalite : Ajouter un dossier au groupe

**Declencheur :** L'utilisateur selectionne un ou plusieurs dossiers et les affecte a un groupe.

**Regles metier :**
1. Un dossier ne peut appartenir qu'a UN SEUL groupe a la fois.
2. Le dossier doit etre du meme `type_voyage` que le groupe.
3. Le dossier doit etre dans la meme periode (chevauchement de dates).
4. Ajouter un dossier au groupe ajoute automatiquement toutes ses personnes au compteur.
5. Si le nombre de personnes depasse `nombre_max`, un warning est affiche (pas de blocage -- l'Admin peut forcer).
6. Le statut du groupe passe a `COMPLET` quand `nombre_max` est atteint.

### 3.5.3 Fonctionnalite : Liste des membres du groupe

**Affichage :**

| Colonne | Description |
|---------|-------------|
| Nom Prenom | Membre |
| Dossier | Numero de dossier |
| Client principal | Nom du client principal du dossier |
| Type chambre | Type de chambre affectee |
| Telephone | Telephone du membre |
| Statut dossier | Statut actuel du dossier |
| Documents | Statut des documents (complet/incomplet) |
| Paiement | Statut du paiement (paye/partiel/en attente) |
| Actions | Retirer du groupe, Voir dossier |

### 3.5.4 Statuts du groupe

| Statut | Description | Transitions possibles |
|--------|-------------|----------------------|
| `FORMATION` | Le groupe est en cours de constitution | -> `COMPLET`, `CONFIRME`, `ANNULE` |
| `COMPLET` | Le nombre max est atteint | -> `CONFIRME`, `ANNULE` |
| `CONFIRME` | Le programme est valide et paye | -> `EN_COURS`, `ANNULE` |
| `EN_COURS` | Le voyage est en cours | -> `TERMINE` |
| `TERMINE` | Le voyage est termine | -> (etat final) |
| `ANNULE` | Le groupe est annule | -> (etat final) |

---

## 3.6 Etape 5 : Documents requis

### 3.6.1 Matrice documents par type de voyage

| Document | OMRA_RAMADAN | OMRA_HORS_RAMADAN | HAJJ | UMRA_PLUS | AUTRE |
|----------|:------------:|:-----------------:|:----:|:---------:|:-----:|
| Passeport (>= 6 mois) | OUI | OUI | OUI | OUI | OUI |
| CNI | OUI | OUI | OUI | OUI | OUI |
| Photo d'identite (fond blanc) | 4 | 4 | 4 | 4 | 2 |
| Certificat vaccination meningite | OUI | OUI | OUI | OUI | NON |
| Certificat vaccination COVID | OUI | OUI | OUI | NON | NON |
| Certificat vaccination grippe | NON | NON | RECOMMANDE | NON | NON |
| Visa Omra | OUI | OUI | NON (vise Hajj) | OUI | SELON |
| Visa Hajj | NON | NON | OUI | NON | SELON |
| Assurance voyage | OUI | OUI | OUI | OUI | RECOMMANDE |
| Contrat de voyage | OUI | OUI | OUI | OUI | OUI |
| Attestation de volonte Hajj | NON | NON | OUI | NON | NON |
| Registre de famille | NON | NON | RECOMMANDE | NON | NON |

### 3.6.2 Fonctionnalite : Suivi des documents par dossier

**Pour CHAQUE personne du dossier :**

| Champ | Description |
|-------|-------------|
| `personne` | Nom + Prenom |
| `passeport` | Statut : `EN_ATTENTE`, `SOUMIS`, `VERIFIE`, `REJETE`, `EXPIRE` |
| `cni` | Statut : idem |
| `photo` | Statut : idem |
| `vaccin_meningite` | Statut : idem |
| `vaccin_covid` | Statut : idem |
| `visa` | Statut : idem |
| `assurance` | Statut : idem |
| `contrat` | Statut : idem |
| `score_completude` | Pourcentage (0-100%) |
| `actions` | Uploader, Voir, Remplacer |

### 3.6.3 Regles metier pour les documents

1. Un document est en statut `EN_ATTENTE` par defaut.
2. L'agent upload le document -> statut `SOUMIS`.
3. Le Manager/Agent verifie le document -> statut `VERIFIE` ou `REJETE` (avec motif).
4. Un document expire (date de passeport < 6 mois au depart) -> statut `EXPIRE` + notification automatique.
5. Le `score_completude` est calcule ainsi : `documents_verifies / documents_requis * 100`.
6. La checklist de depart (Etape 7) ne peut etre lancee que si le score de completude est a 100%.
7. Les notifications sont envoyees automatiquement :
   - 30 jours avant le depart : rappel des documents manquants
   - 15 jours avant : alerte critique si incomplet
   - 7 jours avant : alerte maximale + escalation au Manager

### 3.6.4 Statuts de document

| Statut | Description | Transitions possibles |
|--------|-------------|----------------------|
| `EN_ATTENTE` | Document non encore soumis | -> `SOUMIS` |
| `SOUMIS` | Document upload, en attente de verification | -> `VERIFIE`, `REJETE` |
| `VERIFIE` | Document valide | -> `SOUMIS` (si remplacement) |
| `REJETE` | Document invalide (motif requis) | -> `SOUMIS` (nouveau document) |
| `EXPIRE` | Document expire | -> `SOUMIS` (nouveau document) |

---

## 3.7 Etape 6 : Suivi des statuts

### 3.7.1 Transitions d'etat du dossier

| Statut source | Statuts cibles | Conditions | Roles autorises | Notifications |
|---------------|---------------|------------|-----------------|---------------|
| `BROUILLON` | `EN_COURS_DE_CONFIGURATION` | Au moins 1 element saisi | Agent, Manager, Admin | -- |
| `EN_COURS_DE_CONFIGURATION` | `EN_ATTENTE_VALIDATION` | Programme complet, tous les elements saisis | Agent, Manager, Admin | Notification au Manager |
| `EN_ATTENTE_VALIDATION` | `CONFIRME` | Programme valide et accepte par le client | Manager, Admin | Notification a l'Agent + Client |
| `EN_ATTENTE_VALIDATION` | `ANNULE` | Client refuse | Agent, Manager, Admin | Notification au Client |
| `CONFIRME` | `VISA_EN_COURS` | Demande de visa soumise | Agent, Manager, Admin | -- |
| `VISA_EN_COURS` | `VISA_OBTENU` | Visa obtenu et verifie | Agent, Manager, Admin | Notification a tous |
| `VISA_OBTENU` | `PAYEMENT_EN_COURS` | Acompte recu | Agent, Manager, Admin, Comptable | Notification au Client (solde restant) |
| `PAYEMENT_EN_COURS` | `PAYE` | Solde entierement regle | Agent, Manager, Admin, Comptable | Confirmation au Client |
| `CONFIRME` | `PAYEMENT_EN_COURS` | Paiement recu directement | Agent, Manager, Admin, Comptable | -- |
| `PAYE` | `PRET_A_PARTIR` | Checklist de depart completee (100%) | Agent, Manager, Admin, Guide | Notification "Pret a partir" |
| `PRET_A_PARTIR` | `EN_COURS` | Client embarque / groupe parti | Guide, Manager, Admin | Notification "Voyage en cours" |
| `EN_COURS` | `TERMINE` | Voyage termine, retour en Algerie | Guide, Manager, Admin | Notification "Voyage termine" + demande d'evaluation |
| `TERMINE` | `ARCHIVE` | Delai de 30 jours apres `TERMINE` OU action manuelle | Manager, Admin | -- |
| `*` (sauf ARCHIVE, TERMINE) | `ANNULE` | Motif obligatoire | Agent, Manager, Admin | Notification + declenche remboursement si paiement |

### 3.7.2 Tableau de bord des statuts (vue Manager/Admin)

| Statut | Badge couleur | Nombre de dossiers | Actions rapides |
|--------|:------------:|:------------------:|-----------------|
| `BROUILLON` | Gris | N | Continuer la configuration |
| `EN_COURS_DE_CONFIGURATION` | Bleu clair | N | Voir les dossiers incomplets |
| `EN_ATTENTE_VALIDATION` | Orange | N | Valider / Rejeter |
| `CONFIRME` | Vert | N | Lancer la demande de visa |
| `VISA_EN_COURS` | Jaune | N | Mettre a jour le statut visa |
| `VISA_OBTENU` | Vert fonce | N | Enregistrer le paiement |
| `PAYEMENT_EN_COURS` | Orange fonce | N | Relancer le client |
| `PAYE` | Vert lime | N | Faire la checklist de depart |
| `PRET_A_PARTIR` | Bleu | N | Affecter le guide |
| `EN_COURS` | Violet | N | Suivi en temps reel |
| `TERMINE` | Gris fonce | N | Demander l'evaluation |
| `ARCHIVE` | Gris tres clair | N | Consulter l'historique |
| `ANNULE` | Rouge | N | Voir le motif |

### 3.7.3 Notifications automatiques par changement de statut

| Transition | Destinataire | Canal | Contenu |
|------------|-------------|-------|---------|
| -> `EN_ATTENTE_VALIDATION` | Manager | Email + Push | "Dossier {numero} en attente de validation" |
| -> `CONFIRME` | Agent + Client | Email + SMS + Push | "Dossier {numero} confirme. ETAPE SUIVANTE : visa" |
| -> `ANNULE` | Agent + Client + Manager | Email + SMS + Push | "Dossier {numero} annule. Motif : {motif}" |
| -> `VISA_OBTENU` | Agent + Client | SMS + Push | "Visa obtenu pour {numero}. Prochaine etape : paiement" |
| -> `PAYE` | Agent + Client + Guide | Email + Push | "Paiement complet pour {numero}. Pret pour le depart" |
| -> `EN_COURS` | Admin + Manager | Push | "Voyage {numero} en cours" |
| -> `TERMINE` | Agent + Client | Email + SMS + Push | "Voyage termine. Merci de laisser votre evaluation" |

---

## 3.8 Etape 7 : Checklist de depart

### 3.8.1 Fonctionnalite : Checklist avant depart

**Declencheur :** Un Agent/Manager/Agent clique "Lancer la checklist de depart" pour un dossier en statut `PAYE`.

**Bloc 1 : Documents**

| # | Element | Verification | Statut |
|---|---------|-------------|--------|
| 1.1 | Passeport client principal | Verifie (>= 6 mois) | [ ] OK / [ ] KO |
| 1.2 | Passeport accompagnants | Tous verifies | [ ] OK / [ ] KO |
| 1.3 | CNI clients | Tous verifies | [ ] OK / [ ] KO |
| 1.4 | Visa Omra/Hajj | Obtenus pour tous | [ ] OK / [ ] KO |
| 1.5 | Photos d'identite | 4 par personne | [ ] OK / [ ] KO |
| 1.6 | Certificat vaccination meningite | Tous verifies | [ ] OK / [ ] KO |
| 1.7 | Certificat vaccination COVID | Tous verifies | [ ] OK / [ ] KO |
| 1.8 | Assurance voyage | Souscrite pour tous | [ ] OK / [ ] KO |
| 1.9 | Contrat de voyage | Signe par tous | [ ] OK / [ ] KO |

**Bloc 2 : Paiements**

| # | Element | Verification | Statut |
|---|---------|-------------|--------|
| 2.1 | Acompte paye | 100% confirme | [ ] OK / [ ] KO |
| 2.2 | Solde paye | 100% confirme | [ ] OK / [ ] KO |
| 2.3 | Complement supplement | Le cas echeant | [ ] OK / [ ] KO / [ ] N/A |

**Bloc 3 : Logistique**

| # | Element | Verification | Statut |
|---|---------|-------------|--------|
| 3.1 | Vol confirme | Reservation vol OK | [ ] OK / [ ] KO |
| 3.2 | Hotel confirme | Reservation hotel OK | [ ] OK / [ ] KO |
| 3.3 | Transferts organises | Aller + retour | [ ] OK / [ ] KO |
| 3.4 | Repartition chambres | Validee | [ ] OK / [ ] KO |
| 3.5 | Groupe forme (si applicable) | Liste complete | [ ] OK / [ ] KO / [ ] N/A |

**Bloc 4 : Information client**

| # | Element | Verification | Statut |
|---|---------|-------------|--------|
| 4.1 | Briefing client effectue | Instructions voyage | [ ] OK / [ ] KO |
| 4.2 | Kit voyage remis | Guide + contacts | [ ] OK / [ ] KO |
| 4.3 | Contact d'urgence | Confirme | [ ] OK / [ ] KO |
| 4.4 | Guide affecte | Guide assigne au voyage | [ ] OK / [ ] KO |

**Bloc 5 : Contingence**

| # | Element | Verification | Statut |
|---|---------|-------------|--------|
| 5.1 | Medicaments de base | Si besoin | [ ] OK / [ ] KO / [ ] N/A |
| 5.2 | Groupe WhatsApp cree | Communication groupe | [ ] OK / [ ] KO |
| 5.3 | Programme detaile envoye | Email/SMS au client | [ ] OK / [ ] KO |

### 3.8.2 Regles metier de la checklist

1. Le statut global de la checklist est : `EN_COURS` tant que tous les elements ne sont pas OK.
2. Si un element est KO : la checklist ne peut pas etre validee.
3. Chaque element KO genere un **point d'action** avec :
   - Description du probleme
   - Responsable (Agent ou Manager)
   - Echeance (avant la date de depart)
   - Statut : `OUVERT`, `EN_COURS`, `RESOLU`
4. La checklist ne peut passer a `COMPLETEE` que si :
   - Tous les elements sont OK ou N/A
   - Tous les points d'action sont RESOLU
5. Le passage a `PRET_A_PARTIR` est automatique quand la checklist est COMPLETEE.

### 3.8.3 Signature numerique

- L'Agent qui valide la checklist doit la signer numeriquement (confirmation avec mot de passe).
- La signature est enregistree dans l'audit trail.
- La checklist signee est generee en PDF et archivee avec le dossier.

---

## 3.9 Etape 8 : Post-voyage

### 3.9.1 Fonctionnalite : Evaluation client

**Declencheur :** Automatiquement 3 jours apres la date de fin du voyage, un email/SMS est envoye au client avec un lien d'evaluation.

**Formulaire d'evaluation :**

| Champ | Type | Obligatoire | Validation | Description |
|-------|------|------------|------------|-------------|
| `note_globale` | Etoiles | OUI | 1 a 5 etoiles | Note globale du voyage |
| `note_programme` | Etoiles | OUI | 1 a 5 | Qualite du programme |
| `note_hotel` | Etoiles | OUI | 1 a 5 | Qualite de l'hotel |
| `note_vol` | Etoiles | OUI | 1 a 5 | Confort et ponctualite du vol |
| `note_guide` | Etoiles | OUI | 1 a 5 | Qualite du guide |
| `note_transport` | Etoiles | OUI | 1 a 5 | Transports terrestres |
| `note_alimentation` | Etoiles | NON | 1 a 5 | Qualite de la nourriture |
| `note_accompagnement` | Etoiles | NON | 1 a 5 | Suivi et accompagnement |
| `commentaire` | Texte long | NON | 0-2000 caracteres | Commentaire libre |
| `recommanderiez` | Boolean | OUI | Oui / Non | Recommanderiez-vous l'agence ? |
| `photos_voyage` | Fichiers | NON | Max 10 photos, 5 Mo chacune | Photos du voyage (optionnel) |

**Regles metier :**
1. Le formulaire est accessible via un lien unique envoye par email/SMS.
2. Le lien est valide 30 jours.
3. L'evaluation n'est pas anonyme (liee au client) mais visible uniquement par l'Admin/Manager.
4. Le score de fidelite du client est recalcule automatiquement apres l'evaluation.
5. Les evaluations avec < 3 etoiles sont signalees au Manager pour suivi.
6. Les evaluations >= 4 etoiles peuvent etre utilisees (avec accord du client) pour les references de l'agence.

### 3.9.2 Fonctionnalite : Suivi post-voyage (interne)

**Tableau de bord post-voyage :**

| Champ | Description |
|-------|-------------|
| `dossier` | Numero du dossier |
| `client` | Nom du client |
| `date_retour` | Date de retour effective |
| `evaluation_recue` | Oui / Non / En attente |
| `note_moyenne` | Moyenne des notes (si evaluation recue) |
| `points_action` | Nombre de points d'action ouverts |
| `dossier_archivable` | true si delai de 30 jours ecoule |

### 3.9.3 Fonctionnalite : Archivage

**Declencheur :** Automatique 30 jours apres la fin du voyage OU manuel par un Admin/Manager.

**Regles metier :**
1. L'archivage est irreversible (mais le dossier reste consultable en lecture seule).
2. Avant archivage, verifications :
   - Toutes les evaluations recues ou delai depasse
   - Toutes les factures soldees
   - Tous les points d'action resolus
3. Le dossier archive est deplace dans la section "Archives" avec un acces par recherche uniquement.
4. Les donnees sont conservees pendant 10 ans minimum (obligation legale).
5. Le stockage documentaire est conserve (pas de suppression automatique).

---

## 3.10 Tableau de bord Omra/Hajj

### 3.10.1 KPIs cles

| KPI | Definition | Calcul | Cible |
|-----|-----------|--------|-------|
| Dossiers actifs | Nombre de dossiers en cours | COUNT(statut NOT IN ARCHIVE, TERMINE, ANNULE) | -- |
| Taux de conversion | Dossiers confirmes / dossiers crees | COUNT(CONFIRME+) / COUNT(TOTAL) | > 70% |
| Delai moyen de confirmation | Jours entre creation et confirmation | AVG(date_confirmation - date_creation) | < 15 jours |
| Taux de completude documents | % dossiers avec 100% documents | COUNT(completude=100) / COUNT(total actif) | > 80% |
| Montant total reserve | Chiffre d'affaires des dossiers actifs | SUM(prix_total) WHERE statut NOT IN ANNULE, ARCHIVE | -- |
| Montant recu | Paiements encaisses | SUM(paiements) WHERE statut NOT IN ANNULE | -- |
| Reste a percevoir | Montant impaye | Montant total reserve - Montant recu | -- |
| Taux d'annulation | Dossiers annules / dossiers crees | COUNT(ANNULE) / COUNT(TOTAL) | < 10% |
| Note moyenne client | Moyenne des evaluations | AVG(note_globale) | > 4.0 |
| Groupes actifs | Nombre de groupes en cours | COUNT(statut = FORMATION OU COMPLET OU CONFIRME OU EN_COURS) | -- |
| Capacite restante groupes | Places disponibles dans les groupes | SUM(nombre_max - nombre_actuel) pour chaque groupe | -- |

### 3.10.2 Vues du tableau de bord

**Vue par statut (pipeline) :**

```
BROUILLON (N) -> CONFIG (N) -> VALIDATION (N) -> CONFIRME (N) -> VISA (N) -> PAYE (N) -> PARTI (N) -> TERMINE (N)
                                                                                                           |
                                                                                                      ARCHIVE (N)
```

**Vue par periode :**

| Periode | Dossiers | Montant | Paye | En attente |
|---------|---------|---------|------|------------|
| Omra Ramadan 2027 | N | X DA | X DA | X DA |
| Hajj 2026 | N | X DA | X DA | X DA |
| Omra hors Ramadan T1 2027 | N | X DA | X DA | X DA |

**Vue par guide :**

| Guide | Voyages assignes | En cours | A venir | Note moy. |
|-------|-----------------|----------|---------|-----------|
| Guide A | N | N | N | 4.5 |
| Guide B | N | N | N | 4.2 |

**Vue financiere :**

| Poste | Montant (DA) |
|-------|-------------|
| Total reservations Omra/Hajj | X DA |
| Total recu | X DA |
| Reste a percevoir | X DA |
| Impayes > 30 jours | X DA |
| Annulations (remboursements) | X DA |

---

*Fin des Modules 1, 2 et 3 du Cahier des Charges Fonctionnel.*
*Modules 4 a 14 a developper dans les documents suivants.*

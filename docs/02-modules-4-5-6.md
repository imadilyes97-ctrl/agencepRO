# Agence Pro — Cahier des Charges Fonctionnel

## Modules 4, 5 et 6

> **Version** : 1.0  
> **Date** : 24 juillet 2026  
> **Portee** : Modules Gestion des Visas, Gestion des Vols, Hotels & Transport  
> **Niveau de detail** : Exhaustif — chaque fonctionnalite inclut declencheur, donnees, regles metier, validations et roles autorises

---

# MODULE 4 : Gestion des Visas

## 4.1 Vue d'ensemble

Ce module couvre le cycle complet de vie d'une demande de visa : de la creation initiale jusqu'a l'obtention ou le refus, en passant par le suivi des documents, le depot au consulat, et les alertes proactives. Il est au coeur de l'activite de l'agence et doit garantir un taux de succes optimal grace a une gestion rigoureuse des documents et des delais.

### 4.1.1 Types de visas geres

| Code | Type | Description | Usage typique |
|------|------|-------------|---------------|
| `TOURISTIQUE` | Visa Touristique | Sejour temporaire pour loisirs et tourisme | Vacances, decouverte |
| `AFFAIRES` | Visa Affaires | Sejour professionnel, reunions, conferences | Missions d'affaires |
| `MEDICAL` | Visa Medical | Sejour pour traitement medical | Operations, soins |
| `TRANSIT` | Visa Transit | Passage par le pays sans sejour prolonge | Correspondances |
| `ETUDIANT` | Visa Etudiant | Sejour pour etudes ou formation | Inscription universitaire |
| `HAJJ` | Visa Hajj | Pelerinage a La Mecque | Hajj (1 fois/an) |
| `OMRA` | Visa Omra | Pelerinage hors periode Hajj | Omra (tout moment) |

### 4.1.2 Pays geres

| Code | Pays | Ambassade / Consulat a Alger | Delai moyen (jours ouvrables) |
|------|------|------------------------------|-------------------------------|
| `FR` | France | Consulat General de France, Alger | 5 -- 10 |
| `IT` | Italie | Ambassade d'Italie, Alger | 7 -- 15 |
| `ES` | Espagne | Ambassade d'Espagne, Alger | 7 -- 14 |
| `DE` | Allemagne | Ambassade d'Allemagne, Alger | 5 -- 10 |
| `UK` | Royaume-Uni | Ambassade du Royaume-Uni, Alger | 10 -- 21 |
| `US` | Etats-Unis | Ambassade des Etats-Unis, Alger | 15 -- 45 |
| `CA` | Canada | Ambassade du Canada, Alger | 15 -- 30 |
| `SA` | Arabie Saoudite | Ambassade d'Arabie Saoudite, Alger | 3 -- 7 |
| `TR` | Turquie | Ambassade de Turquie, Alger | 3 -- 7 |
| `TN` | Tunisie | Ambassade de Tunisie, Alger | 2 -- 5 |
| `MA` | Maroc | Ambassade du Maroc, Alger | 2 -- 5 |

### 4.1.3 Matrice documents requis par type et pays

#### Documents communs a tous les types et tous les pays

| # | Document | Obligatoire | Remarques |
|---|----------|-------------|-----------|
| 1 | Passeport original (min. 6 mois validite restante) | Oui | Scan recto + verso |
| 2 | Formulaire de demande dument remplit | Oui | Par pays, format papier ou en ligne |
| 3 | Photos d'identite (format pays cible) | Oui | 35x45mm Europe, 5x5cm USA, etc. |
| 4 | Justificatif d'hebergement | Oui | Hotel booking ou invitation |
| 5 | Justificatif de moyens financiers | Oui | Releve bancaire 3 derniers mois |
| 6 | Assurance voyage | Oui | Couverture minimum 30 000 EUR (Europe) |
| 7 | Justificatif d'emploi / activite | Oui | Attestation employeur ou patente |

#### Documents supplementaires par type de visa

| Type | Documents supplementaires |
|------|--------------------------|
| **Touristique** | Programme de sejour, justificatifs de liens avec l'Algerie (propriete, famille) |
| **Affaires** | Lettre d'invitation de l'entreprise accueillante, contrat commercial, programme professionnel |
| **Medical** | Certificat medical du medecin traitant, lettre de l'hopital de destination, preuve de depot de paiement |
| **Transit** | Billet pour la destination finale, visa du pays de destination finale (si requis) |
| **Etudiant** | Attestation d'inscription universitaire, preuve de bourse ou de ressources, certificat de langue |
| **Hajj** | Passport Hajj officiel, certificat vaccination (meningite, COVID), attestation d'organisme agree, certificat medical |
| **Omra** | Passport Omra officiel, certificat vaccination, attestation d'organisme agree |

#### Documents supplementaires par pays

| Pays | Documents specifiques |
|------|----------------------|
| **France (FR)** | Justificatif de domicile (< 3 mois), attestation OFII si sejour > 3 mois |
| **Italie (IT)** | Lettera d'invito certifiee (si invitation), polizza assicurativa min. 30 000 EUR |
| **Espagne (ES)** | Certificado de antecedentes penales (si sejour > 90 jours) |
| **Allemagne (DE)** | Erklaerung des Einladenden (formulaire d'invitation certifie), Kopie du passeport de l'hote |
| **Royaume-Uni (UK)** | TB test certificate (si provenance de pays a risque tuberculose), bank statements 6 mois |
| **Etats-Unis (US)** | DS-160 completion, fee MRV receipt, interview appointment letter, I-20 (etudiant) |
| **Canada (CA)** | Biometrie (empreintes + photo), letter of explanation, family info form (IMM 5707) |
| **Arabie Saoudite (SA)** | Attestation de bonne conduite, certificat medical specifique, vaccination meningite ACWY |
| **Turquie (TR)** | Justificatif de reservation de vol aller-retour, attestation d'emploi |
| **Tunisie (TN)** | Certificat d'hebergement ou attestation d'hotel, billet de transport |
| **Maroc (MA)** | Certificat d'hebergement, justificatif de ressources financieres min. 70 EUR/jour |

### 4.1.4 Frais par type et pays (en EUR)

| Type | FR | IT | ES | DE | UK | US | CA | SA | TR | TN | MA |
|------|----|----|----|----|----|----|----|----|----|----|----|
| Touristique | 80 | 90 | 80 | 80 | 115 | 185 | 110 | 40 | 60 | 30 | 30 |
| Affaires | 80 | 90 | 80 | 80 | 115 | 185 | 110 | 40 | 60 | 30 | 30 |
| Medical | 80 | 90 | 80 | 80 | 115 | 185 | 110 | 40 | 60 | 30 | 30 |
| Transit | 80 | 90 | 80 | 80 | 65 | 185 | 110 | 25 | 50 | 25 | 25 |
| Etudiant | 50 | 50 | 60 | 75 | 115 | 185 | 110 | 40 | 50 | 30 | 30 |
| Hajj | -- | -- | -- | -- | -- | -- | -- | 100 | -- | -- | -- |
| Omra | -- | -- | -- | -- | -- | -- | -- | 80 | -- | -- | -- |

**Frais agence (superposes aux frais consulaires) :**

| Type de service | Frais agence (DZD) | Description |
|-----------------|--------------------|----|
| Visa Touristique | 5 000 -- 8 000 | Preparation dossier + depot |
| Visa Affaires | 7 000 -- 10 000 | Dossier complexe + relance |
| Visa Medical | 8 000 -- 12 000 | Dossier specialise + suivi |
| Visa Transit | 4 000 -- 6 000 | Dossier simplifie |
| Visa Etudiant | 10 000 -- 15 000 | Dossier complet + accompagnement |
| Visa Hajj | 15 000 -- 25 000 | Pack Hajj complet |
| Visa Omra | 12 000 -- 20 000 | Pack Omra complet |

### 4.1.5 Cycle de statuts du visa

```
EN_PREPARATION --> DEPOT --> EN_COURS --> APPROUVE
                                 |            |
                                 v            v
                            REFUSE ----> NOUVELLE_DEMANDE (optionnel)
                                 |
                                 v
                            EXPIRE (apres duree de validite)
```

| Statut | Code | Description | Transitions possibles | Roles autorises |
|--------|------|-------------|----------------------|-----------------|
| En preparation | `EN_PREPARATION` | Dossier en cours de constitution | `DEPOT` | Agent, Chef agence |
| Depot | `DEPOT` | Dossier depose au consulat | `EN_COURS` | Agent, Chef agence |
| En cours | `EN_COURS` | Dossier en traitement par le consulat | `APPROUVE`, `REFUSE` | Agent (lecture seule), Chef agence (lecture seule) |
| Approuve | `APPROUVE` | Visa delivre | `EXPIRE` (automatique) | Systeme (automatique) |
| Refuse | `REFUSE` | Visa refuse par le consulat | `NOUVELLE_DEMANDE` | Agent, Chef agence |
| Expire | `EXPIRE` | Visa arrive a expiration | -- | Systeme (automatique) |

---

## 4.2 Fonctionnalites detaillees

### 4.2.1 Creation d'une demande de visa

**Declencheur :** L'utilisateur (Agent ou Chef agence) clique sur "Nouvelle demande de visa" depuis le tableau de bord ou le dossier client.

**Formulaire de creation :**

| Champ | Type | Obligatoire | Regle de validation | Source |
|-------|------|-------------|---------------------|--------|
| Client | Select/Search | Oui | Doit exister dans la base clients | Selection depuis la base |
| Type de visa | Select | Oui | Valeur parmi les 7 types definis | Liste deroulante |
| Pays de destination | Select | Oui | Valeur parmi les 11 pays geres | Liste deroulante |
| Date de sejour prevue - Debut | Date picker | Oui | >= date du jour + 1, min 15 jours avant la date visee | Saisie manuelle |
| Date de sejour prevue - Fin | Date picker | Oui | > Date debut | Saisie manuelle |
| Motif du sejour | Textarea | Oui (Medical, Etudiant) | Max 500 caracteres | Saisie manuelle |
| Type de passeport | Select | Oui | Diplomatique, Ordinaire, Service, Special | Liste deroulante |
| Niveau d'urgence | Select | Non | Normal (defaut), Express, Critical | Saisie manuelle |

**Regle metier RC-VISA-001 :** La date de sejour doit etre eloignee d'au moins 15 jours ouvrables de la date de creation, sauf pour le visa Transit (minimum 3 jours ouvrables).

**Regle metier RC-VISA-002 :** Un client ne peut pas avoir plus de 3 demandes de visa actives simultanement (statuts EN_PREPARATION, DEPOT, ou EN_COURS).

**Regle metier RC-VISA-003 :** Le passeport du client doit avoir une validite superieure a 6 mois a compter de la date de fin de sejour prevue. Le systeme verifie automatiquement.

**Regle metier RC-VISA-004 :** Pour un visa Hajj, le client ne peut en demander qu'un par an civile. Le systeme verifie l'historique.

**Regle metier RC-VISA-005 :** Pour un visa Touristique vers la France, le systeme applique automatiquement les conditions de la Convention de Schengen si le sejour est < 90 jours.

**Validation cote client :**
- Le client doit exister et avoir un profil complet (nom, prenom, date de naissance, nationalite, adresse)
- Le passeport doit etre scane (recto + verso) et attache avant la soumission
- Les photos d'identite doivent etre telechargees (format accepte : JPEG, PNG, max 5 Mo)

**Validation cote serveur :**
- Aucune demande en doublon (meme client + meme type + meme pays + periode chevauchante)
- Les dates sont coherentes
- Le type de visa est compatible avec le pays selectionne

**Action post-creation :**
1. Le systeme genere automatiquement la checklist de documents dynamique (section 4.2.2)
2. Un statut `EN_PREPARATION` est applique
3. Une notification est envoyee au client (email + SMS) : "Votre demande de visa [type] pour [pays] a ete enregistree"
4. La demande apparait dans le tableau de bord de l'agent assigne
5. Un evenement est journalise dans l'historique

**Roles autorises :** Agent, Chef agence, Admin

---

### 4.2.2 Checklist documents dynamique

**Declencheur :** Creation d'une demande de visa OU modification du type/pays d'une demande existante.

**Principe :** La checklist est generee dynamiquement en croisant :
- Les documents communs (tous types, tous pays)
- Les documents specifiques au type de visa
- Les documents specifiques au pays de destination
- Les conditions personnalisees (age du client, historique precedent)

**Structure d'un element de checklist :**

| Champ | Type | Description |
|-------|------|-------------|
| ID | UUID | Identifiant unique |
| Libelle | String | Nom du document |
| Obligatoire | Boolean | Si true, le dossier ne peut pas etre depose sans |
| Fourni | Boolean | Si true, le document a ete fourni et valide |
| Fichier | File | Scan ou photo du document (optionnel si non oblige) |
| Date de fourniture | DateTime | Date a laquelle le document a ete remis |
| Verifie par | User ID | Agent qui a valide le document |
| Commentaire | Text | Remarque ou demande de rectification |
| Date d'expiration du document | Date | Pour les documents temporels (certificats medicaux, attestations) |

**Regles metier checklist :**

| Code | Regle | Impact |
|------|-------|--------|
| RC-CHK-001 | Tous les documents obligatoires doivent etre marques "Fourni" + "Verifie" avant de passer au statut DEPOT | Blocage de transition |
| RC-CHK-002 | Un document peut etre "Fourni" mais "Non verifie" (en attente de validation) | Alert visuelle jaune |
| RC-CHK-003 | Si un document a une date d'expiration, le systeme alerte si < 15 jours | Alerte automatique |
| RC-CHK-004 | Si le type de visa change, la checklist est regeneree (les documents deja fournis sont conserves si toujours applicables) | Mise a jour intelligente |
| RC-CHK-005 | Les documents declares "Non conformes" generent une demande de re-fourniture | Notification au client |
| RC-CHK-006 | Pour le visa Hajj/Omra, le certificat de vaccination doit dater de moins de 6 mois | Validation automatique de date |

**Calcul du pourcentage de completion :**

```
Completion = (nombre de documents obligatoires fournis et verifies / nombre total de documents obligatoires) * 100
```

Le pourcentage est affiche en temps reel dans le dossier de la demande.

---

### 4.2.3 Suivi des statuts avec historique

**Declencheur :** Changement de statut de n'importe quelle demande de visa.

**Entite Historique :**

| Champ | Type | Description |
|-------|------|-------------|
| ID | UUID | Identifiant unique de l'evenement |
| Demande ID | FK | Reference a la demande de visa |
| Statut precedent | Enum | Statut avant le changement |
| Statut nouveau | Enum | Statut applique |
| Date de changement | DateTime | Horodatage precis (UTC) |
| Utilisateur | FK | Qui a effectue le changement |
| Motif | Text | Raison du changement (obligatoire pour REFUSE) |
| Pieces jointes | Files | Justificatifs (decision consulat, etc.) |

**Regles de transition :**

| Transition | Precondition | Postcondition | Roles autorises |
|------------|-------------|---------------|-----------------|
| EN_PREPARATION -> DEPOT | Checklist 100% complete | Date de depot enregistree | Agent, Chef agence |
| DEPOT -> EN_COURS | Confirmation de depot | Horodatage de depot | Agent, Chef agence |
| EN_COURS -> APPROUVE | Decision consulat positive | Date d'expiration du visa generee | Agent, Chef agence, Admin |
| EN_COURS -> REFUSE | Decision consulat negative | Motif de refus obligatoire | Agent, Chef agence |
| REFUSE -> NOUVELLE_DEMANDE | Analyse du refus faite | Nouveau dossier cree | Agent, Chef agence |

**Regle metier RC-HIST-001 :** Toute transition de statut est irrevocable et immentre dans l'historique. Aucun supprimer possible.

**Regle metier RC-HIST-002 :** Le motif est obligatoire uniquement pour les transitions vers REFUSE et NOUVELLE_DEMANDE.

**Notification automatique a chaque transition :**

| Transition | Notification client | Notification agent | Canaux |
|------------|--------------------|--------------------|--------|
| -> DEPOT | "Votre dossier a ete depose au consulat de [pays]" | Aucune | Email + SMS |
| -> EN_COURS | "Votre dossier est en cours de traitement" | Aucune | Email |
| -> APPROUVE | "Felicitations ! Votre visa [type] pour [pays] a ete approuve" | "Visa approuve pour [client]" | Email + SMS + Push |
| -> REFUSE | "Votre demande de visa a ete refusee. Motif : [motif]" | "Visa refuse pour [client]. Relance recommandee" | Email + SMS + Push |

---

### 4.2.4 Alertes automatiques

**Types d'alertes :**

| Code | Alerte | Declencheur | Calendrier | Canaux |
|------|--------|-------------|------------|--------|
| `ALR-PASSPORT-EXP` | Passeport bientot expire | Validite passeport < 6 mois | Hebdomadaire | Email + SMS + Push |
| `ALR-PASSPORT-URGENT` | Passeport expire dans < 3 mois | Validite passeport < 3 mois | 2x/semaine | Email + SMS + Push |
| `ALR-VISA-EXP` | Visa bientot expire | Validite visa < 30 jours | Hebdomadaire | Email + SMS + Push |
| `ALR-VISA-URGENT` | Visa expire dans < 7 jours | Validite visa < 7 jours | Quotidien | Email + SMS + Push |
| `ALR-DOC-EXPIRED` | Document de checklist expire | Date expiration document | A la connexion + quotidien | Email + Push |
| `ALR-DOC-REMAINING` | Document bientot expire | Document expire dans < 15 jours | Hebdomadaire | Email + Push |
| `ALR-DELAI-DEPOT` | Delai de depassement | Depot prevu depasse de 3 jours | Quotidien | Email + SMS + Push |
| `ALR-DEMANDE-IDLE` | Demande inactive | Aucune action depuis 7 jours | Hebdomadaire | Email (agent) |
| `ALR-VISA-OBTAINED` | Visa obtenu (non retire) | Approuve + non retire depuis 15 jours | Hebdomadaire | Email + SMS (client) |
| `ALR-RENOUVELLEMENT` | Delai de renouvellement | 90 jours avant expiration visa | Mensuel | Email + SMS + Push |

**Configuration des alertes :**

| Parametre | Valeur par defaut | Configurable par |
|-----------|-------------------|------------------|
| Heure d'envoi des emails | 08:00 (timezone Alger) | Admin |
| Frequence max SMS/jour | 2 | Admin |
| Delai de grace avant alerte | 24h | Chef agence |
| Destinataires alerte agent | Agent assigne + Chef agence | Admin |
| Mode silencieux | Desactive | Client (opt-out) |

**Regle metier RC-ALR-001 :** Le client peut desactiver les alertes non-critiques (hebdomadaire, mensuel) mais jamais les alertes critiques (quotidien, urgence).

**Regle metier RC-ALR-002 :** Chaque alerte generee est journalisee. L'historique des alertes est visible par l'agent dans le dossier client.

**Regle metier RC-ALR-003 :** Si un client repond a une alerte (via lien de confirmation dans le SMS/email), l'agent en est notifie.

---

### 4.2.5 Statistiques visas

**Declencheur :** Acces au tableau de bord Visa, ou demande de rapport.

**Metriques disponibles :**

| Metrique | Calcul | Granularite | Filtres |
|----------|--------|-------------|---------|
| Taux de succes global | (Approuves / Total traitees) * 100 | Par mois, trimestre, annee | Pays, type, agent |
| Taux de succes par pays | (Approuves pays X / Total traitees pays X) * 100 | Par mois, trimestre, annee | Type, agent |
| Taux de succes par type | (Approuves type X / Total traitees type X) * 100 | Par mois, trimestre, annee | Pays, agent |
| Delai moyen de traitement | Moyenne(depot -> approbation/refus) en jours | Par mois | Pays, type |
| Delai moyen par consulat | Moyenne(depot -> decision) par pays | Par mois | Type |
| Nombre de demandes en cours | Compteur statuts EN_PREPARATION + DEPOT + EN_COURS | Temps reel | Agent |
| Taux de refus | (Refuses / Total traitees) * 100 | Par mois, trimestre, annee | Pays, type, motif |
| Motifs de refus frequents | Top 10 des motifs de refus | Par trimestre, annee | Pays |
| CA visas | Somme des frais agence collectes | Par mois, trimestre | Type, pays, agent |
| Revenu moyen par dossier | CA visas / Nombre de dossiers | Par mois | Type, pays |
| Alertes generees | Compteur par type d'alerte | Par mois | Type, statut |
| Taux de reclamation | (Reclamations / Total dossiers) * 100 | Par mois | Type, pays |

**Visualisations :**

- Graphique taux de succes : Barres empilees (approuves / refuses / en cours) par mois
- Carte thermique : Taux de succes par pays (couleur = taux)
- Courbe delais : Evolution des delais moyens de traitement par consulat
- Camembert refus : Repartition des motifs de refus
- Tableau d'impact : CA par type et par pays

**Export :** PDF, Excel, CSV. Planification d'envoi automatique (hebdomadaire, mensuel).

---

### 4.2.6 Gestion des refus

**Declencheur :** Transition vers le statut REFUSE.

**Formulaire de declaration de refus :**

| Champ | Type | Obligatoire | Regle |
|-------|------|-------------|-------|
| Motif principal | Select + Text | Oui | Selection parmi motifs predefinis + details |
| Motifs predefinis | Select multiple | Oui | Documentation insuffisante, Revenus insuffisants, Lien avec l'Algerie faible, Historique de voyages insuffisant, Erreur dans le dossier, Motif non specifie |
| Piece jointe du consulat | File | Non | Scan de la lettre de refus |
| Analyse de l'agent | Textarea | Oui | Min 50 caracteres. Analyse du refus et recommandations |
| Plan d'action | Select | Oui | Relance, Nouvelle demande, Recours, Abandon |
| Commentaire client | Textarea | Non | Retour au client |

**Processus post-refus :**

| Plan d'action | Etapes | Delai | Notifications |
|---------------|--------|-------|---------------|
| **Relance** | 1. Analyser motif -> 2. Corriger dossier -> 3. Relancer au consulat | 10 jours | Agent + Chef agence |
| **Nouvelle demande** | 1. Analyser motif -> 2. Constituer nouveau dossier -> 3. Creer nouvelle demande | Variable | Agent + Client |
| **Recours** | 1. Analyser motif -> 2. Constituer recours -> 3. Deposer recours | 30 jours | Agent + Chef agence + Admin |
| **Abandon** | 1. Cloturer la demande -> 2. Rembourser (si applicable) -> 3. Informer le client | Immmediat | Agent + Client + Comptable |

**Regle metier RC-REF-001 :** Tout refus doit etre analyse dans un delai de 48 heures par l'agent.

**Regle metier RC-REF-002 :** Le taux de refus par agent est surveille. Si > 30% sur 3 mois, une alerte est envoyee au Chef agence.

**Regle metier RC-REF-003 :** L'historique des refus par client influence les futures demandes : le systeme surligne les refus precedents et suggest des actions correctives.

---

### 4.2.7 Conditions de renouvellement

**Declencheur :** Le systeme detecte qu'un visa expire dans 90 jours OU l'utilisateur demande un renouvellement.

**Conditions par type de visa :**

| Type | Renouvelable ? | Conditions | Delai minimum entre 2 visas |
|------|---------------|------------|----------------------------|
| Touristique | Oui | Justifier du motif de retour | 30 jours |
| Affaires | Oui | Nouvelle lettre d'invitation | Aucun |
| Medical | Oui | Certificat medical actualise | 30 jours |
| Transit | Non | Nouvelle demande obligatoire | Aucun |
| Etudiant | Oui | Attestation de re-inscription | 30 jours |
| Hajj | Non | Nouvelle demande l'annee suivante | 1 an |
| Omra | Oui | Aucune restriction | Aucun |

**Processus de renouvellement :**

1. Detection automatique (alerte ALR-RENOUVELLEMENT a J-90)
2. Verification des conditions de renouvellement
3. Pre-remplissage du formulaire (donnees du visa precedent)
4. Mise a jour de la checklist (documents a actualiser)
5. Notification au client : "Votre visa expire le [date]. Souhaitez-vous le renouveler ?"
6. Si oui -> Creation d'une nouvelle demande avec reference au visa precedent
7. Le visa precedent est conserve dans l'historique

---

### 4.2.8 Entites de donnees — Schema detaille

#### DemandeVisa

| Champ | Type | Contrainte | Description |
|-------|------|------------|-------------|
| id | UUID | PK | Identifiant unique |
| reference | String(20) | UNIQUE, NOT NULL | Ref auto-generee : VIS-AAAA-XXXXX |
| client_id | UUID | FK -> Client | Client demandeur |
| type_visa | Enum | NOT NULL | 7 types definis |
| pays_destination | String(2) | NOT NULL | Code ISO 2 lettres |
| date_sejour_debut | Date | NOT NULL | Debut du sejour prevu |
| date_sejour_fin | Date | NOT NULL | Fin du sejour prevu |
| motif_sejour | Text | Nullable | Obligatoire pour Medical, Etudiant |
| type_passeport | Enum | NOT NULL | Diplomatique, Ordinaire, Service, Special |
| niv_urgence | Enum | DEFAULT 'NORMAL' | Normal, Express, Critical |
| statut | Enum | NOT NULL, DEFAULT 'EN_PREPARATION' | 6 statuts definis |
| agent_id | UUID | FK -> Utilisateur | Agent traiteur |
| date_creation | DateTime | NOT NULL, DEFAULT NOW() | Date de creation |
| date_depot | DateTime | Nullable | Date de depot au consulat |
| date_decision | DateTime | Nullable | Date de la decision consulat |
| motif_refus | Text | Nullable | Motif si refuse |
| numero_visa | String(50) | Nullable | Numero du visa delivre |
| date_expiration_visa | Date | Nullable | Date d'expiration du visa |
| frais_consulaires | Decimal(10,2) | NOT NULL | Frais consulaires en EUR |
| frais_agence | Decimal(10,2) | NOT NULL | Frais agence en DZD |
| created_at | DateTime | NOT NULL | Timestamp creation |
| updated_at | DateTime | NOT NULL | Timestamp mise a jour |

#### DocumentVisa

| Champ | Type | Contrainte | Description |
|-------|------|------------|-------------|
| id | UUID | PK | Identifiant unique |
| demande_visa_id | FK -> DemandeVisa | NOT NULL, ON DELETE CASCADE | Demande liee |
| type_document | Enum | NOT NULL | Type de document requis |
| libelle | String(200) | NOT NULL | Libelle affiche |
| obligatoire | Boolean | NOT NULL, DEFAULT true | Si obligatoire |
| fourni | Boolean | NOT NULL, DEFAULT false | Si document remis |
| verifie | Boolean | NOT NULL, DEFAULT false | Si document verifie |
| fichier_url | String(500) | Nullable | URL du fichier scanne |
| date_fourniture | DateTime | Nullable | Date de remise |
| verifie_par | UUID | FK -> Utilisateur | Qui a verifie |
| commentaire | Text | Nullable | Observations |
| date_expiration | Date | Nullable | Expiration du document |
| statut_conformite | Enum | DEFAULT 'EN_ATTENTE' | Conforme, NonConforme, EnAttente |

#### HistoriqueVisa

| Champ | Type | Contrainte | Description |
|-------|------|------------|-------------|
| id | UUID | PK | Identifiant unique |
| demande_visa_id | FK -> DemandeVisa | NOT NULL | Demande liee |
| statut_precedent | Enum | Nullable | Statut avant |
| statut_nouveau | Enum | NOT NULL | Statut apres |
| date_changement | DateTime | NOT NULL, DEFAULT NOW() | Horodatage |
| utilisateur_id | UUID | FK -> Utilisateur | Qui a fait le changement |
| motif | Text | Nullable | Obligatoire pour REFUSE |
| pieces_jointes | JSON | Nullable | Liste d'URLs de fichiers |

#### AlerteVisa

| Champ | Type | Contrainte | Description |
|-------|------|------------|-------------|
| id | UUID | PK | Identifiant unique |
| type_alerte | Enum | NOT NULL | Type d'alerte |
| demande_visa_id | FK -> DemandeVisa | NOT NULL | Demande concernee |
| client_id | UUID | FK -> Client | Client concerne |
| date_generation | DateTime | NOT NULL | Date de generation |
| date_envoi | DateTime | Nullable | Date d'envoi reel |
| canal | Enum | NOT NULL | Email, SMS, Push |
| statut | Enum | NOT NULL | EnAttente, Envoyee, Livree, Erreur |
| lue | Boolean | DEFAULT false | Si lue par le destinataire |

---
---

# MODULE 5 : Gestion des Vols

## 5.1 Vue d'ensemble

Ce module gere l'integralite du processus de reservation de vols : de la recherche au billet, en passant par la gestion des bagages, le suivi des statuts et les alertes en temps reel. Il est etroitement lie au dossier client et aux autres modules (Visa, Hotels, Hajj/Omra).

### 5.1.1 Types de trajets

| Code | Type | Description | Regles |
|------|------|-------------|--------|
| `ALLER_SIMPLE` | Aller simple | Un seul vol, une seule direction | Aucune restriction |
| `ALLER_RETOUR` | Aller-retour | Vol aller + vol retour | Ecart min. 1 jour, max 365 jours |
| `MULTI_DEST` | Multi-destinations | 2+ vols liees | Max 6 escales, meme continent recommande |

### 5.1.2 Classes de vol

| Code | Class | Bagages inclus | Flexibilite | Prix relatif |
|------|-------|----------------|-------------|-------------|
| `ECONOMY` | Economy | 1 bagage cabine (7-10 kg) + 1 bagage soute (20-23 kg) | Faible | 1x |
| `PREMIUM_ECONOMY` | Premium Economy | 1 bagage cabine (10 kg) + 2 bagages soute (23 kg) | Moyenne | 1.5x -- 2x |
| `BUSINESS` | Business | 2 bagages cabine (12-15 kg) + 2 bagages soute (32 kg) | Elevee | 3x -- 5x |
| `FIRST` | First Class | 3 bagages cabine (15-18 kg) + 3 bagages soute (32 kg) | Maximale | 5x -- 10x |

---

## 5.2 Entites de donnees — Schema detaille

### 5.2.1 Compagnie Aerienne

| Champ | Type | Contrainte | Description |
|-------|------|------------|-------------|
| id | UUID | PK | Identifiant unique |
| nom | String(100) | NOT NULL, UNIQUE | Nom commercial |
| code_iata | String(3) | NOT NULL, UNIQUE | Code IATA 3 lettres (ex: AF, TK, HR) |
| code_icao | String(4) | UNIQUE | Code ICAO (ex: AFR, THY, DAH) |
| pays_origine | String(2) | NOT NULL | Code ISO pays |
| logo_url | String(500) | Nullable | URL du logo |
| site_web | String(500) | Nullable | Site officiel |
| telephone | String(20) | Nullable | Contact telephonique |
| email_reservation | String(255) | Nullable | Email reservations |
| telephone_reservation | String(20) | Nullable | Telephone reservations |
| active | Boolean | DEFAULT true | Si compagnie active |
| created_at | DateTime | NOT NULL | Timestamp |

### 5.2.2 Aeroport

| Champ | Type | Contrainte | Description |
|-------|------|------------|-------------|
| id | UUID | PK | Identifiant unique |
| code_iata | String(3) | NOT NULL, UNIQUE | Code IATA |
| nom | String(200) | NOT NULL | Nom complet |
| ville | String(100) | NOT NULL | Ville |
| pays | String(2) | NOT NULL | Code ISO |
| timezone | String(50) | NOT NULL | Fuseau horaire |
| latitude | Decimal(9,6) | Nullable | Coordonnees GPS |
| longitude | Decimal(9,6) | Nullable | Coordonnees GPS |

### 5.2.3 Vol

| Champ | Type | Contrainte | Description |
|-------|------|------------|-------------|
| id | UUID | PK | Identifiant unique |
| numero_vol | String(10) | NOT NULL | Numero de vol (ex: AF7725) |
| compagnie_id | FK -> CompagnieAerienne | NOT NULL | Compagnie |
| aeroport_depart_id | FK -> Aeroport | NOT NULL | Aeroport de depart |
| aeroport_arrivee_id | FK -> Aeroport | NOT NULL | Aeroport d'arrivee |
| date_heure_depart | DateTime | NOT NULL | Date et heure de depart (UTC) |
| date_heure_arrivee | DateTime | NOT NULL | Date et heure d'arrivee (UTC) |
| duree_minutes | Integer | NOT NULL | Duree du vol en minutes |
| nb_escales | Integer | DEFAULT 0 | Nombre d'escales |
| escales | JSON | Nullable | Tableau d'escales [{aeroport, duree, duree_attente}] |
| avion_modele | String(100) | Nullable | Modele d'avion (ex: Boeing 737-800) |
| places_total | Integer | NOT NULL | Capacite totale |
| places_economy | Integer | NOT NULL | Places en economy |
| places_premium | Integer | DEFAULT 0 | Places en premium economy |
| places_business | Integer | DEFAULT 0 | Places en business |
| places_first | Integer | DEFAULT 0 | Places en first class |
| prix_economy | Decimal(10,2) | NOT NULL | Prix de base economy |
| prix_premium | Decimal(10,2) | Nullable | Prix premium economy |
| prix_business | Decimal(10,2) | Nullable | Prix business |
| prix_first | Decimal(10,2) | Nullable | Prix first class |
| devise | String(3) | DEFAULT 'EUR' | Devise des prix |
| statut | Enum | DEFAULT 'PROGRAMME' | Programme, EnCours, Annule, Retarde, Termine |
| source | Enum | NOT NULL | Manuelle, Amadeus, Travelsky |
| updated_at | DateTime | NOT NULL | Derniere mise a jour |

### 5.2.4 Reservation

| Champ | Type | Contrainte | Description |
|-------|------|------------|-------------|
| id | UUID | PK | Identifiant unique |
| reference | String(20) | UNIQUE, NOT NULL | Ref auto-generee : VOL-AAAA-XXXXX |
| client_id | FK -> Client | NOT NULL | Client principal |
| dossier_id | FK -> Dossier | Nullable | Dossier voyage lie |
| vol_id | FK -> Vol | NOT NULL | Vol reserve |
| type_trajet | Enum | NOT NULL | Aller simple, aller-retour, multi-dest |
| reservation_parent_id | FK -> Reservation | Nullable | Lien aller-retour (retour pointe vers aller) |
| classe | Enum | NOT NULL | Economy, Premium, Business, First |
| passagers | JSON | NOT NULL | [{nom, prenom, date_naissance, passport, nationalite, siege}] |
| nb_passagers | Integer | NOT NULL, DEFAULT 1 | Nombre de passagers |
| siege | String(5) | Nullable | Numero de siege (ex: 12A) ou "AUTO" |
| statut | Enum | NOT NULL, DEFAULT 'EN_ATTENTE' | Statut de la reservation |
| prix_unitaire | Decimal(10,2) | NOT NULL | Prix par passager |
| prix_total | Decimal(10,2) | NOT NULL | Prix total (prix_unitaire * nb_passagers) |
| devise | String(3) | NOT NULL | Devise |
| frais_agence | Decimal(10,2) | NOT NULL | Frais de service agence |
| montant_total | Decimal(10,2) | NOT NULL | Montant total facture |
| mode_paiement | Enum | NOT NULL | Especes, Virement, CCP, Baridimob, CIB |
| statut_paiement | Enum | DEFAULT 'NON_PAYE' | NonPaye, Partiel, Paye, Rembourse |
| billet_url | String(500) | Nullable | URL du billet PDF genere |
| billet_qr_code | String(500) | Nullable | URL ou contenu du QR code |
| notes | Text | Nullable | Notes internes |
| date_reservation | DateTime | NOT NULL, DEFAULT NOW() | Date de creation |
| date_modification | DateTime | Nullable | Derniere modification |
| created_by | UUID | FK -> Utilisateur | Qui a cree la reservation |
| updated_at | DateTime | NOT NULL | Timestamp |

### 5.2.5 Bagage

| Champ | Type | Contrainte | Description |
|-------|------|------------|-------------|
| id | UUID | PK | Identifiant unique |
| reservation_id | FK -> Reservation | NOT NULL | Reservation liee |
| passager_index | Integer | NOT NULL | Index du passager (0-based) |
| type_bagage | Enum | NOT NULL | Cabine, Soute, Extra, Surpoids |
| poids_kg | Decimal(5,2) | NOT NULL | Poids en kilogrammes |
| dimensions | String(20) | Nullable | Dimensions (LxHxP cm) |
| inclusion | Enum | NOT NULL | Inclus, Extra, Surpoids |
| tarif | Decimal(10,2) | NOT NULL | Tarif applique |
| devise | String(3) | NOT NULL | Devise |
| statut | Enum | DEFAULT 'ENREGISTRE' | Enregistre, EnTransit, Remis, Perdu |
| numero_etiquette | String(50) | Nullable | Numero d'etiquette bagage |
| created_at | DateTime | NOT NULL | Timestamp |

### 5.2.6 Sieges (pour selection interactive)

| Champ | Type | Contrainte | Description |
|-------|------|------------|-------------|
| id | UUID | PK | Identifiant unique |
| vol_id | FK -> Vol | NOT NULL | Vol concerne |
| numero_siege | String(5) | NOT NULL | Code siege (ex: 12A, 14F) |
| rangee | Integer | NOT NULL | Numero de rangee |
| lettre | String(1) | NOT NULL | Position (A-F pour narrow, A-J pour wide) |
| classe | Enum | NOT NULL | Classe du siege |
| type | Enum | NOT NULL | Normale, Fenetre, Couloir, Milieu |
| statut | Enum | DEFAULT 'DISPONIBLE' | Disponible, Reserve, Occupe, Bloque |
| reservation_id | FK -> Reservation | Nullable | Si reserve |
| surcharges | Decimal(10,2) | DEFAULT 0 | Supplement eventuel |
| UNIQUE(vol_id, numero_siege) | | | |

---

## 5.3 Fonctionnalites detaillees

### 5.3.1 Recherche de vols

**Declencheur :** L'utilisateur clique sur "Rechercher un vol" depuis le tableau de bord, le dossier client, ou lors de la creation d'un package voyage.

**Formulaire de recherche :**

| Champ | Type | Obligatoire | Regle de validation |
|-------|------|-------------|---------------------|
| Aeroport de depart | Search/Select | Oui | Code IATA ou recherche par ville |
| Aeroport d'arrivee | Search/Select | Oui | Code IATA ou recherche par ville |
| Date de depart | Date picker | Oui | >= date du jour |
| Date de retour | Date picker | Conditionnel | Obligatoire pour aller-retour, >= date depart |
| Type de trajet | Radio | Oui | Aller simple, aller-retour, multi-dest |
| Nombre de passagers | Number | Oui | Min 1, max 9 |
| Classe | Select | Oui | Economy, Premium, Business, First |
| Compagnie preferee | Select | Non | Filtre optionnel |

**Modes de recherche :**

| Mode | Description | Delai | Fiabilite |
|------|-------------|-------|-----------|
| **Manuelle** | Saisie du vol existant dans le systeme | Immediate | 100% |
| **Amadeus API** | Integration GDS Amadeus | 3 -- 8 secondes | 95% (soumis a disponibilite) |
| **Travelsky API** | Integration GDS Travelsky (compagnies chinoises) | 3 -- 8 secondes | 90% |
| **Hybride** | Recherche API + fallback manuel | 5 -- 15 secondes | 97% |

**Resultats de recherche :**

Les resultats sont affiches sous forme de liste triee par defaut par prix croissant, avec option de tri par duree, nombre d'escales, et heure de depart.

Pour chaque vol, les informations affichees :
- Compagnie + logo
- Heures de depart/arrivee (locales + fuseau)
- Duree totale
- Nombre d'escales (avec details)
- Prix par classe
- Places restantes

**Regle metier RC-VOL-001 :** Si la recherche API echoue, le systeme propose automatiquement le mode manuel avec un message informatif.

**Regle metier RC-VOL-002 :** Les resultats expirent apres 15 minutes. Un rafraichissement automatique est propose.

**Regle metier RC-VOL-003 :** Pour les vols Hajj/Omra, le systeme privilegie les compagnies avec accord special (Saudi Airlines, Air Algerie, Flynas) et les aeroports de Jeddah/Medina.

**Regle metier RC-VOL-004 :** Pour les recherches multi-destinations, le systeme propose des combinaisons optimisees (meilleur prix global ou duree minimale).

**Roles autorises :** Agent, Chef agence, Admin, Client (en consultation via portal)

---

### 5.3.2 Reservation de vol

**Declencheur :** L'utilisateur selectionne un vol dans les resultats de recherche OU saisit manuellement les informations de vol.

**Etapes du processus de reservation :**

#### Etape 1 : Selection du vol

| Action | Donnees | Regles |
|--------|---------|--------|
| Selectionner le vol | Vol ID | Le vol doit etre a statut PROGRAMME |
| Verifier disponibilite | Places restantes | >= nb_passagers demandes |
| Selectionner la classe | Classe | Prix applicable pour cette classe |

#### Etape 2 : Informations passagers

Pour chaque passager :

| Champ | Type | Obligatoire | Regle de validation |
|-------|------|-------------|---------------------|
| Nom | Text | Oui | Exactement comme sur le passeport |
| Prenom | Text | Oui | Exactement comme sur le passeport |
| Date de naissance | Date | Oui | >= 18 ans pour adulte, sinon enfant/bedonant |
| Nationalite | Select | Oui | Code ISO |
| Type piece d'identite | Select | Oui | Passeport, Carte nationale |
| Numero piece d'identite | Text | Oui | Format selon le type |
| Date expiration piece | Date | Oui | > date de vol |
| Email | Email | Non | Pour notifications |
| Telephone | Phone | Non | Pour SMS |

**Regle metier RC-RES-001 :** Les noms et prenoms doivent correspondre exactement aux documents d'identite. Toute erreur necessite une modification avant confirmation.

**Regle metier RC-RES-002 :** Pour les enfants (2-11 ans), un tarif reduit s'applique (generalement 75% du tarif adulte). Pour les bebes (< 2 ans), tarif de 10% sans place propre.

#### Etape 3 : Selection du siege

| Option | Description | Tarif |
|--------|-------------|-------|
| Auto-assignation | Le systeme assigne le meilleur siege disponible | Gratuit |
| Selection manuelle | Le client choisit le siege sur le plan de cabine | Gratuit ou supplement (selon siege) |
| Siege premium | Rangees 1-5, plus de place, priorite debarquement | Supplement variable |

**Plan de cabine interactif :**
- Representation visuelle du schema de sieges
- Code couleur : vert (disponible), rouge (occupe), gris (bloque), bleu (selectionne)
- Affichage du type : fenetre, couloir, milieu
- Zoom par rangee

#### Etape 4 : Bagages

| Type | Conditions | Tarif |
|------|------------|-------|
| Cabine (inclus) | Selon classe : 1 bagage 7-10 kg (Economy) a 3 bagages 15-18 kg (First) | Inclus |
| Soute (inclus) | Selon classe : 1 bagage 20-23 kg (Economy) a 3 bagages 32 kg (First) | Inclus |
| Bagage supplementaire | 1 bagage soute additionnel 23 kg | 40 -- 75 EUR selon compagnie |
| Surpoids | Bagage > poids autorise | 50 -- 150 EUR selon surpoids |
| Bagage special | Musique, sport, equipement fragile | Variable selon compagnie |

**Regle metier RC-BAG-001 :** Le systeme calcule automatiquement les bagages inclus selon la classe selectionnee et propose les options supplementaires.

#### Etape 5 : Tarification et paiement

| Element | Calcul | Affichage |
|---------|--------|-----------|
| Prix vol | Prix unitaire classe * nb_passagers | Detail par passager |
| Bagages extras | Somme des supplements bagage | Detail par type |
| Frais agence | Configurable par admin (defaut : 5 000 -- 10 000 DZD) | Montant fixe |
| Taxe airport | Selon aeroport de depart | Montant fixe |
| **Total** | Somme de tous les elements | **Montant total en DZD** |

**Modes de paiement acceptes :**

| Mode | Delai de confirmation | Commission |
|------|----------------------|------------|
| Especes | Immediate | 0% |
| Virement bancaire | 24 -- 48h | 0% |
| CCP | 24 -- 48h | 0% |
| Baridimob | Immediate | 1% |
| CIB / Edahabia | Immediate | 1.5% |
| Paiement fractionne | Selon echeancier | 0% |

**Regle metier RC-PAI-001 :** La reservation passe en statut CONFIRME uniquement apres paiement total OU acompte minimum de 50%.

**Regle metier RC-PAI-002 :** En cas d'annulation, les conditions de remboursement dependent du type de billet (refundable / non-refundable).

#### Etape 6 : Confirmation

1. Le systeme reserve le(s) vol(s) aupres de la compagnie (via API ou manuellement)
2. Un numero de confirmation est genere (PNR si API)
3. Le statut passe a CONFIRME
4. Le billet PDF est genere automatiquement
5. Notifications envoyees :
   - Client : Email + SMS avec le billet et les details
   - Agent : Notification de confirmation
   - Comptable : Enregistrement du paiement

---

### 5.3.3 Generation de billet (PDF avec QR code)

**Declencheur :** Confirmation de reservation OU regeneration a la demande.

**Contenu du billet PDF :**

| Section | Contenu |
|---------|---------|
| En-tete | Logo agence, "Agence Pro", reference reservation |
| Infos passager | Nom, prenom, numero piece d'identite |
| Infos vol | Numero vol, compagnie, aeroports, dates/heures |
| Classe et siege | Classe de vol, numero de siege |
| Bagages | Bagages inclus + bagages supplementaires |
| QR Code | QR code encodant la reference + PNR + infos essentielles |
| Conditions | Conditions de transport, bagages, annulation |
| Pied de page | Coordonnees agence, version du document |

**Specifications techniques du billet :**

| Parametre | Valeur |
|-----------|--------|
| Format | A4 (210 x 297 mm) |
| Orientation | Paysage |
| Format fichier | PDF 1.7 |
| QR Code | Standard IATA Bar Coded Ticket (BCDT) |
| Resolution | 300 DPI minimum |
| Police | Arial ou Helvetica (embeddee) |
| Taille max | 2 Mo |
| Stockage | S3 / stockage local avec URL signee |

**Regle metier RC-BIL-001 :** Le QR code doit etre lisible par tout scanner standard et contenir les informations essentielles du billet.

**Regle metier RC-BIL-002 :** Le billet est genere en 2 versions : une pour l'impression (haute resolution) et une pour affichage numerique (optimisee).

**Regle metier RC-BIL-003 :** En cas de modification, le billet est regenere avec un numero de version incrementee.

---

### 5.3.4 Suivi des statuts de reservation

**Cycle de statuts :**

```
EN_ATTENTE --> CONFIRME --> EN_COURS_DE_VOL --> TERMINE
     |              |              |
     v              v              v
  ANNULE      MODIFIE         ANNULE
     |
     v
  EXPIRE (pas de paiement sous 48h)
```

| Statut | Code | Description | Transitions possibles |
|--------|------|-------------|----------------------|
| En attente | EN_ATTENTE | Reservation creee, non payee | CONFIRME, ANNULE, EXPIRE |
| Confirme | CONFIRME | Paiement effectue, place reservee | EN_COURS_DE_VOL, MODIFIE, ANNULE |
| En cours de vol | EN_COURS_DE_VOL | Passager en deplacement | TERMINE, ANNULE |
| Termine | TERMINE | Vol effectue | -- |
| Annule | ANNULE | Reservation annulee | -- |
| Modifie | MODIFIE | Reservation modifiee | CONFIRME (nouveau) |
| Expire | EXPIRE | Delai de paiement depasse | -- |

**Regle metier RC-SUIV-001 :** La transition CONFIRME -> EN_COURS_DE_VOL est declenchee automatiquement a l'heure de depart du vol.

**Regle metier RC-SUIV-002 :** La transition EN_COURS_DE_VOL -> TERMINE est declenchee automatiquement a l'heure d'arrivee du vol.

**Regle metier RC-SUIV-003 :** Le statut EXPIRE est applique automatiquement 48 heures apres la creation si aucun paiement n'est enregistre.

---

### 5.3.5 Gestion des bagages

**Operations sur les bagages :**

| Operation | Donnees | Regles | Roles |
|-----------|---------|--------|-------|
| Ajouter bagage | reservation_id, type, poids | Verifier limite par classe | Agent |
| Modifier bagage | bagage_id, poids, type | Recalculer tarif | Agent |
| Supprimer bagage | bagage_id | Interdit si statut EN_TRANSIT | Agent |
| Enregistrer bagage | reservation_id + bagages | A l'enregistrement (check-in) | Agent |
| Suivre bagage | bagage_id | Statut en temps reel si API dispo | Agent, Client |

**Tarification bagages (reference) :**

| Type | Economy | Premium | Business | First |
|------|---------|---------|----------|-------|
| Cabine inclus | 1 x 10 kg | 1 x 10 kg | 2 x 15 kg | 3 x 18 kg |
| Soute inclus | 1 x 23 kg | 2 x 23 kg | 2 x 32 kg | 3 x 32 kg |
| Extra soute | 40 EUR | 35 EUR | 0 EUR | 0 EUR |
| Surpoids /kg | 15 EUR/kg | 12 EUR/kg | Gratuit < 5 kg | Gratuit < 5 kg |

---

### 5.3.6 Alertes de vol

| Code | Alerte | Declencheur | Canaux | Destinataires |
|------|--------|-------------|--------|---------------|
| `ALR-VOL-RETARD` | Vol retarde | Mise a jour statut retard API | SMS + Push + Email | Passagers + Agent |
| `ALR-VOL-ANNULE` | Vol annule | Annulation confirmee | SMS + Push + Email | Passagers + Agent + Chef agence |
| `ALR-VOL-GATE` | Changement de porte | Mise a jour porte API | Push | Passagers |
| `ALR-VOL-HORAIRE` | Changement d'horaire | Modification horaire API | SMS + Email | Passagers + Agent |
| `ALR-VOL-EMBARQUE` | Embarquement commence | Debut d'embarquement | Push | Passagers |
| `ALR-VOL-ANNULATION-PROCHE` | Risque d'annulation | Annulation > 50% proba (ML future) | Email | Agent + Chef agence |
| `ALR-BILLET-EXPIRE` | Billet non utilise | Depassement heure de depart | Email + SMS | Client + Agent |
| `ALR-REMBOURSEMENT` | Remboursement traite | Virement effectue | Email + SMS | Client |

**Regles d'alertes vols :**

| Code | Regle | Detail |
|------|-------|--------|
| RC-ALRV-001 | Delai de notification retard | Max 15 minutes apres information |
| RC-ALRV-002 | Frequence max SMS/vol | 3 SMS maximum par evenement |
| RC-ALRV-003 | Annulation = action obligatoire | L'agent doit proposer un vol alternatif dans les 24h |
| RC-ALRV-004 | Client peut opt-out | Sauf alertes critiques (annulation, retard > 2h) |

---

### 5.3.7 Historique vols par client

**Vue d'ensemble** : Chaque client dispose d'un historique complet de tous ses vols, accessible depuis son dossier.

| Information | Description |
|-------------|-------------|
| Nombre total de vols | Compteur toutes reservations TERMINE |
| Pays visites | Liste unique des pays d'arrivee |
| Compagnies utilisees | Liste des compagnies avec nb vols |
| Classe moyenne | Classe la plus utilisee |
| Distance totale parcourue | Somme des distances entre aeroports |
| Dernier vol | Date + destination du dernier vol |
| Depenses totales | Somme des montants payes (EUR + DZD) |
| Fidelite | Badge base sur le nombre de vols (Bronze > 3, Argent > 10, Or > 25) |

---

## 5.4 Integration APIs

### 5.4.1 Amadeus

| Parametre | Valeur |
|-----------|--------|
| API | Amadeus Self-Service APIs |
| Auth | OAuth2 (API Key + Secret) |
| Endpoints utilises | Flight Offers Search, Flight Offers Price, Flight Create Order, SeatMap |
| Rate limit | 10 appels/seconde (tier gratuit) |
| Mode | Production + Sandbox (test) |
| Cache | TTL 15 min pour les recherches |

### 5.4.2 Travelsky

| Parametre | Valeur |
|-----------|--------|
| API | Travelsky Open Platform |
| Auth | API Key |
| Endpoints utilises | Flight Search, Booking |
| Usage | Compagnies chinoises et Asie-Pacifique |
| Fallback | Mode manuel si API indisponible |

### 5.4.3 Mode manuel

| Champ | Description |
|-------|-------------|
| Selection compagnie | Liste des compagnies enregistrees |
| Saisie numero vol | Numero de vol manuel |
| Dates et horaires | Saisie directe |
| Prix | Montant saisi manuellement |
| Verification | L'agent confirme les informations |

**Regle metier RC-API-001 :** Le systeme tente d'abord l'API, puis fallback manuel. L'utilisateur est informe du mode utilise.

**Regle metier RC-API-002 :** Les donnees API sont stockees en cache (Redis, TTL 15 min) pour eviter les appels redondants.

**Regle metier RC-API-003 :** En cas d'echec API 3 fois consecutives, le systeme bascule automatiquement en mode manuel et notifie l'admin.

---
---

# MODULE 6 : Hotels & Transport

## PARTIE A : GESTION DES HOTELS

### 6.1.1 Vue d'ensemble

Ce module gere les hotels partenaires, les chambres, les reservations hotellieres, le planning visuel, les tarifs saisonniers, et l'integration avec les dossiers Hajj/Omra. Il est etroitement lie au module Vols (liaison dossier client) et au module Transport (transfers).

---

### 6.1.2 Entites de donnees — Schema detaille

#### Hotel

| Champ | Type | Contrainte | Description |
|-------|------|------------|-------------|
| id | UUID | PK | Identifiant unique |
| nom | String(200) | NOT NULL | Nom de l'hotel |
| ville | String(100) | NOT NULL | Ville |
| pays | String(2) | NOT NULL | Code ISO pays |
| adresse | String(500) | NOT NULL | Adresse complete |
| code_postal | String(20) | Nullable | Code postal |
| latitude | Decimal(9,6) | Nullable | Coordonnees GPS |
| longitude | Decimal(9,6) | Nullable | Coordonnees GPS |
| etoiles | Integer | NOT NULL | 1 a 5 |
| telephone | String(20) | NOT NULL | Telephone principal |
| telephone_2 | String(20) | Nullable | Telephone secondaire |
| email | String(255) | Nullable | Email reservations |
| site_web | String(500) | Nullable | Site officiel |
| contact_nom | String(200) | Nullable | Nom du contact commercial |
| contact_telephone | String(20) | Nullable | Telephone du contact |
| contact_email | String(255) | Nullable | Email du contact |
| logo_url | String(500) | Nullable | Logo de l'hotel |
| photos | JSON | Nullable | Tableau d'URLs de photos |
| amenities | JSON | Nullable | [{nom, description, icone}] (piscine, spa, wifi, etc.) |
| description | Text | Nullable | Description de l'hotel |
| politique_annulation | Text | Nullable | Conditions d'annulation |
| actif | Boolean | DEFAULT true | Si hotel partenaire actif |
| created_at | DateTime | NOT NULL | Timestamp |
| updated_at | DateTime | NOT NULL | Timestamp |

#### Chambre

| Champ | Type | Contrainte | Description |
|-------|------|------------|-------------|
| id | UUID | PK | Identifiant unique |
| hotel_id | FK -> Hotel | NOT NULL | Hotel parent |
| numero | String(10) | NOT NULL | Numero de chambre |
| type | Enum | NOT NULL | Single, Double, Triple, Family, Suite |
| etage | Integer | Nullable | Numero d'etage |
| superficie_m2 | Integer | Nullable | Superficie en metres carres |
| description | Text | Nullable | Description de la chambre |
| lit | String(50) | NOT NULL | Description des lits (ex: "1 King" ou "2 Twins") |
| capacite_max | Integer | NOT NULL | Nombre max de personnes |
| prix_base | Decimal(10,2) | NOT NULL | Prix de base par nuit (HDS) |
| devise | String(3) | DEFAULT 'EUR' | Devise |
| vue | Enum | Nullable | Vue mer, vue ville, vue jardin, standard |
| equipements | JSON | Nullable | [{nom, description}] (AC, TV, minibar, balcon, etc.) |
| photos | JSON | Nullable | Tableau d'URLs de photos |
| disponible | Boolean | DEFAULT true | Disponibilite generale |
| accessible | Boolean | DEFAULT false | Adaptation PMR |
| fumeur | Boolean | DEFAULT false | Chambre fumeur/non-fumeur |
| statut | Enum | DEFAULT 'DISPONIBLE' | Disponible, EnMaintenance, HorsService |
| created_at | DateTime | NOT NULL | Timestamp |

**Types de chambres :**

| Type | Code | Capacite | Lit(s) | Superficie indicative |
|------|------|----------|--------|----------------------|
| Single | SINGLE | 1 | 1 simple | 15 -- 20 m2 |
| Double | DOUBLE | 2 | 1 double ou 2 twins | 20 -- 30 m2 |
| Triple | TRIPLE | 3 | 1 double + 1 simple, ou 3 simples | 25 -- 35 m2 |
| Family | FAMILY | 4 -- 6 | 2 doubles ou 1 double + 2 simples | 35 -- 50 m2 |
| Suite | SUITE | 2 -- 4 | 1 king + salon | 45 -- 80 m2 |

#### ReservationHotel

| Champ | Type | Contrainte | Description |
|-------|------|------------|-------------|
| id | UUID | PK | Identifiant unique |
| reference | String(20) | UNIQUE, NOT NULL | Ref auto-generee : HTL-AAAA-XXXXX |
| hotel_id | FK -> Hotel | NOT NULL | Hotel reserve |
| chambre_id | FK -> Chambre | NOT NULL | Chambre assignee |
| client_id | FK -> Client | NOT NULL | Client |
| dossier_id | FK -> Dossier | Nullable | Dossier voyage lie |
| date_arrivee | Date | NOT NULL | Date d'arrivee |
| date_depart | Date | NOT NULL | Date de depart |
| nb_nuits | Integer | NOT NULL | Nombre de nuits (calcule) |
| nb_adultes | Integer | NOT NULL | Nombre d'adultes |
| nb_enfants | Integer | DEFAULT 0 | Nombre d'enfants |
| ages_enfants | JSON | Nullable | Tableau des ages des enfants |
| prix_par_nuit | Decimal(10,2) | NOT NULL | Prix applicable par nuit |
| prix_total | Decimal(10,2) | NOT NULL | Prix total (prix_par_nuit * nb_nuits) |
| devise | String(3) | NOT NULL | Devise |
| frais_agence | Decimal(10,2) | NOT NULL | Frais de service agence |
| montant_total | Decimal(10,2) | NOT NULL | Montant total facture |
| saison | Enum | NOT NULL | Haute, Basse, Pique |
| statut | Enum | NOT NULL, DEFAULT 'EN_ATTENTE' | Statut reservation |
| statut_paiement | Enum | DEFAULT 'NON_PAYE' | NonPaye, Partiel, Paye, Rembourse |
| mode_paiement | Enum | NOT NULL | Especes, Virement, CCP, Baridimob, CIB |
| demands_speciales | Text | Nullable | Demands du client (etage eleve, lit bebe, etc.) |
| petits_dejeuners | Boolean | DEFAULT false | Petit-dejeuner inclus |
| conditions_annulation | Text | Nullable | Conditions specifiques |
| notes_internes | Text | Nullable | Notes pour le staff |
| confirmation_hotel | String(50) | Nullable | Numero de confirmation de l'hotel |
| date_reservation | DateTime | NOT NULL | Date de creation |
| created_by | UUID | FK -> Utilisateur | Qui a cree la reservation |
| updated_at | DateTime | NOT NULL | Timestamp |

---

### 6.1.3 Fonctionnalites detaillees

#### A. Allocation de chambres automatique

**Declencheur :** Creation d'une reservation de groupe (Hajj, Omra, circuit) OU demande d'allocation multiple.

**Algorithme d'allocation :**

Le systeme propose automatiquement les meilleures chambres en fonction de :

| Critere | Poids | Description |
|---------|-------|-------------|
| Type de chambre | 30% | Respecter le type demande (Single, Double, etc.) |
| Prix | 25% | Chambre au meilleur tarif disponible |
| Etage | 15% | Regrouper les chambres du meme groupe au meme etage |
| Disponibilite | 20% | Chambre disponible pour toute la periode |
| Preferences client | 10% | Preferences historiques du client |

**Regles d'allocation groupe :**

| Code | Regle | Detail |
|------|-------|--------|
| RC-ALLOC-001 | Regroupement familial | Les familles sont affectees a des chambres adjacentes si possible |
| RC-ALLOC-002 | Separation genres | Pour Hajj, hommes et femmes separes sauf familles |
| RC-ALLOC-003 | VIP | Les clients VIP/Preferentiel sont places au meilleur etage |
| RC-ALLOC-004 | PMR | Les clients a mobilite reduite sont places pres des ascenseurs |
| RC-ALLOC-005 | Overbooking max | Max 5% au-dela de la capacite reelle (buffer annulations) |
| RC-ALLOC-006 | Confirmation | L'allocation est une proposition. L'agent doit confirmer |

**Sortie de l'allocation :**
- Liste des chambres proposees avec justification
- Plan de l'hotel avec chambres surlignees
- Cout total et detalles par chambre
- Bouton "Confirmer l'allocation" ou "Modifier"

---

#### B. Planning visuel (grille dates x chambres)

**Vue grille mensuelle :**

| Axe | Contenu |
|-----|---------|
| Colonnes | Jours du mois (1 -- 31) |
| Lignes | Chambres (tri par etage, puis numero) |
| Cellule | Couleur = statut (disponible, reservee, occupee, maintenance) |
| Interactivite | Clic sur cellule -> details reservation / bloquer / liberer |

**Interactions du planning :**

| Action | Declencheur | Resultat |
|--------|-------------|----------|
| Voir details | Clic sur cellule | Popup avec infos reservation |
| Bloquer chambre | Drag & drop ou clic droit | Chambre marquee "bloquee" |
| Liberer chambre | Clic sur chambre bloquee | Confirmation puis liberation |
| Creer reservation | Selection de plage de dates | Formulaire pre-rempli |
| Modifier dates | Drag & drop des bornees | Recalcul des prix et disponibilite |
| Vue semaine | Bouton "Semaine" | Zoom sur 7 jours |
| Vue jour | Bouton "Jour" | Vue detaillee d'un jour |

**Code couleur du planning :**

| Couleur | Statut | Description |
|---------|--------|-------------|
| Vert clair | Disponible | Chambre libre |
| Bleu | Reservee | Confirmee, pas encore arrived |
| Orange | Occupee | Client actuellement present |
| Gris | Maintenance | Hors service temporairement |
| Rouge | Bloquee | Bloquee par l'administration |
| Violet | VIP | Client VIP |

**Regle metier RC-PLAN-001 :** Le planning est mis a jour en temps reel (WebSocket) pour eviter les conflits d'allocation.

**Regle metier RC-PLAN-002 :** Le conflit de reservation (double booking) est impossible : le systeme verifie la disponibilite au moment de la creation et au moment de la confirmation.

---

#### C. Gestion de la disponibilite

**Operations de disponibilite :**

| Operation | Donnees | Regles | Roles |
|-----------|---------|--------|-------|
| Bloquer chambre | chambre_id, dates, motif | Aucune reservation active sur la periode | Admin, Chef agence |
| Liberer chambre | chambre_id, dates | Confirmation requise | Admin, Chef agence |
| Definir maintenance | chambre_id, date_debut, date_fin | Reservations existantes deplacees ou annulees | Admin |
| Overbooking control | hotel_id | Max 5% au-dela de la capacite | Systeme (automatique) |

**Regles de disponibilite :**

| Code | Regle | Detail |
|------|-------|--------|
| RC-DISP-001 | Check-in : 14h00 | Defaut configurable par hotel |
| RC-DISP-002 | Check-out : 12h00 | Defaut configurable par hotel |
| RC-DISP-003 | Chevauchement | Pas de chevauchement de reservations sur meme chambre |
| RC-DISP-004 | Overbooking buffer | Si taux d'occupation > 95%, alerte au gestionnaire |
| RC-DISP-005 | Blackout dates | Les dates bloquees ne peuvent pas etre reservees |
| RC-DISP-006 | Modification | La modification de dates verifie la disponibilite sur les nouvelles dates |

---

#### D. Prix saisonniers

**Saisons definies :**

| Saison | Periode (defaut) | Coefficient | Justification |
|--------|-------------------|-------------|---------------|
| Haute | Juin -- Aout, Dec 20 -- Jan 05 | 1.25 -- 1.50 | Vacances, fete de fin d'annee |
| Basse | Nov -- Fev (hors fetes), Mars -- Mai | 0.80 -- 1.00 | Periode calme |
| Pique | Hajj, Omra, Ramadan (variable) | 1.50 -- 2.00 | Forte demande specifique |

**Configuration par hotel :**

| Parametre | Description |
|-----------|-------------|
| Prix de base | Prix pour la saison "normale" (Basse) |
| Coefficient haute saison | Multiplicateur (ex: 1.35 = +35%) |
| Coefficient pique | Multiplicateur (ex: 1.75 = +75%) |
| Dates speciales | Periodes specifiques avec tarif unique (Hajj, conferences, etc.) |
| Remise groupe | Discount pour >= 10 chambres reservees |
| Remise fidelite | Discount pour clients retours (> 3 sejours) |

**Calcul du prix :**
```
Prix applicable = Prix base * Coefficient saison * Coefficient groupe * Coefficient fidelite
```

**Regle metier RC-PRIX-001 :** Les prix sont mis a jour automatiquement au changement de saison. Les reservations existantes ne sont pas impactees (prix ferme a la reservation).

**Regle metier RC-PRIX-002 :** Le systeme affiche le prix pour les 3 saisons cote a cote pour aider l'agent a conseiller le client.

---

#### E. Liaison avec dossier Hajj/Omra

**Integration Hajj :**

| Element | Description |
|---------|-------------|
| Package Hajj | La reservation hotel est automatiquement liee au dossier Hajj |
| Periode fixe | Dates du Hajj definies par le royaume d'Arabie Saoudite |
| Hotel assigne | Zone et hotel pre-definis selon l'organisme gestionnaire |
| Groupe | Allocation par groupe de pelerins |
| Services inclus | Repas, transport site, guide |
| Facturation | Cout integre au prix global du package Hajj |
| Separateur hommes/femmes | Allocation distincte sauf familles |

**Integration Omra :**

| Element | Description |
|---------|-------------|
| Package Omra | Reservation liee au dossier Omra |
| Periode flexible | Dates au choix du client |
| Hotel proximite | Priorite aux hotels pres de la Grande Mosquee (Mecque) et de la Mosquee du Prophete (Medina) |
| Distance | Classement par distance a pied aux lieux saints |
| Services | Transfer inclus, repas optionnels |
| Facturation | Cout integre au package Omra |

**Fonctionnalites specifiques Hajj/Omra :**

| Fonctionnalite | Description |
|----------------|-------------|
| Allocation pilgrims | Attribution chambres par groupe avec separateur gender |
| Gestion colis | Suivi des envois de colis aux pelerins |
| Suivi position | Position du groupe (GPS future phase) |
| Communication groupe | Messages diffuses a tout le groupe |
| Gestion incidents | Problemes de sante, retard, perte de documents |

---

#### F. Facturation integree au dossier

**Elements facturables :**

| Element | Calcul | Affichage |
|---------|--------|-----------|
| Nuit d'hotel | Prix par nuit * nombre de nuits | Detail par nuit |
| Supplements chambre | Vue premium, etage eleve, etc. | Supplement journalier |
| Petit-dejeuner | Tarif par personne * nb personnes * nb jours | Optionnel |
| Touristique tax | Selon pays (ex: 1 -- 3 EUR/nuit en Europe) | Montant fixe |
| Frais agence | Configurable | Montant fixe |
| Remises | Groupe, fidelite, promotion | Pourcentage ou montant |
| **Total hotel** | **Somme** | **Montant total** |

**Liaison avec la facture globale du dossier :**
La facture hotel est automatiquement integree a la facture globale du dossier voyage, qui inclut egalement les vols, transferts, et autres services.

---

## PARTIE B : GESTION DU TRANSPORT

### 6.2.1 Vue d'ensemble

Ce module gere les transferts terrestres : depuis/depuis les aeroports, entre hotels, vers les sites touristiques, et les deplacements de groupe. Il est lie aux modules Vols (horaires d'avion) et Hotels (adresses d'hebergement).

---

### 6.2.2 Types de vehicules

| Code | Type | Capacite | Usage typique | Prix relatif |
|------|------|----------|---------------|-------------|
| `BUS` | Bus | 30 -- 50 | Groupes Hajj/Omra, circuits touristiques | 1x |
| `VAN` | Van | 7 -- 15 | Transferts petits groupes, familles | 1.5x |
| `VOITURE_VIP` | Voiture VIP | 1 -- 3 | Clients VIP, securite, luxe | 3x |
| `4X4` | 4x4 | 1 -- 6 | Desert (Sahara), zones montagneuses, off-road | 2x |

---

### 6.2.3 Entites de donnees — Schema detaille

#### Vehicule

| Champ | Type | Contrainte | Description |
|-------|------|------------|-------------|
| id | UUID | PK | Identifiant unique |
| immatriculation | String(20) | NOT NULL, UNIQUE | Plaque d'immatriculation |
| type | Enum | NOT NULL | Bus, Van, VoitureVIP, 4x4 |
| marque | String(100) | NOT NULL | Marque (Mercedes, Toyota, etc.) |
| modele | String(100) | NOT NULL | Modele |
| annee | Integer | NOT NULL | Annee de fabrication |
| couleur | String(50) | Nullable | Couleur exterieure |
| nb_places | Integer | NOT NULL | Nombre de places |
| climatisation | Boolean | DEFAULT true | Si climatise |
| equipements | JSON | Nullable | [{nom}] (GPS, WiFi, ecran, etc.) |
| photo_url | String(500) | Nullable | Photo du vehicule |
| statut | Enum | DEFAULT 'DISPONIBLE' | Disponible, EnService, EnMaintenance, HorsService |
| date_dernier_entretien | Date | Nullable | Dernier entretien |
| date_prochain_entretien | Date | Nullable | Prochain entretien prevu |
| kilometrage | Integer | DEFAULT 0 | Compteur km |
| assurance_numero | String(50) | Nullable | Numero d'assurance |
| assurance_expiration | Date | Nullable | Expiration assurance |
| created_at | DateTime | NOT NULL | Timestamp |
| updated_at | DateTime | NOT NULL | Timestamp |

#### Chauffeur

| Champ | Type | Contrainte | Description |
|-------|------|------------|-------------|
| id | UUID | PK | Identifiant unique |
| nom | String(100) | NOT NULL | Nom complet |
| telephone | String(20) | NOT NULL | Telephone portable |
| telephone_2 | String(20) | Nullable | Telephone secondaire |
| permis_type | String(10) | NOT NULL | Type de permis (B, D, etc.) |
| permis_expiration | Date | NOT NULL | Date d'expiration du permis |
| permis_numero | String(50) | NOT NULL | Numero du permis |
| photo_url | String(500) | Nullable | Photo du chauffeur |
| langue | String(50) | Nullable | Langues parlees |
| note_evaluation | Decimal(3,2) | Nullable | Note moyenne sur 5 |
| statut | Enum | DEFAULT 'DISPONIBLE' | Disponible, EnService, EnConge, Suspendu |
| disponible | Boolean | DEFAULT true | Disponibilite generale |
| zones | JSON | Nullable | Zones couvertes [{ville, regions}] |
| documents | JSON | Nullable | [{type, numero, expiration}] |
| created_at | DateTime | NOT NULL | Timestamp |
| updated_at | DateTime | NOT NULL | Timestamp |

#### Trajet

| Champ | Type | Contrainte | Description |
|-------|------|------------|-------------|
| id | UUID | PK | Identifiant unique |
| reference | String(20) | UNIQUE, NOT NULL | Ref auto-generee : TRJ-AAAA-XXXXX |
| type | Enum | NOT NULL | Transfer, Circuit, Excursion, Location |
| point_depart | String(500) | NOT NULL | Adresse ou lieu de depart |
| point_arrivee | String(500) | NOT NULL | Adresse ou lieu d'arrivee |
| date_heure_depart | DateTime | NOT NULL | Date et heure de depart |
| date_heure_arrivee_prevue | DateTime | NOT NULL | Arrivee prevue |
| duree_estimee_minutes | Integer | NOT NULL | Duree estimee en minutes |
| distance_km | Decimal(8,2) | Nullable | Distance en kilometres |
| vehicule_id | FK -> Vehicule | NOT NULL | Vehicule assigne |
| chauffeur_id | FK -> Chauffeur | NOT NULL | Chauffeur assigne |
| nb_passagers | Integer | NOT NULL | Nombre de passagers |
| passagers | JSON | NOT NULL | [{client_id, nom, telephone}] |
| groupe_id | FK -> Groupe | Nullable | Si transfer de groupe |
| dossier_id | FK -> Dossier | Nullable | Dossier voyage lie |
| statut | Enum | NOT NULL, DEFAULT 'PLANIFIE' | Statut du trajet |
| cout_total | Decimal(10,2) | NOT NULL | Cout du trajet |
| devise | String(3) | NOT NULL | Devise |
| notes | Text | Nullable | Instructions speciales |
| created_by | UUID | FK -> Utilisateur | Qui a cree |
| updated_at | DateTime | NOT NULL | Timestamp |

#### Transfer (sous-entite specialisee)

| Champ | Type | Contrainte | Description |
|-------|------|------------|-------------|
| id | UUID | PK | Identifiant unique |
| trajet_id | FK -> Trajet | NOT NULL | Trajet parent |
| type_transfer | Enum | NOT NULL | AeroportHotel, HotelAeroport, HotelHotel, SiteHotel |
| vol_id | FK -> Vol | Nullable | Vol lie (pour transferts aeroport) |
| reservation_hotel_id | FK -> ReservationHotel | Nullable | Reservation hotel liee |
| lieu_retrait | String(500) | NOT NULL | Point de rassemblement |
| heure_retrait | Time | NOT NULL | Heure de rassemblement |
| badge_vehicule | String(50) | Nullable | Badge/nom affiche sur le vehicule |
| eau_bottles | Boolean | DEFAULT false | Bouteilles d'eau offertes |
| accueil_aeroport | Boolean | DEFAULT false | Panneau d'accueil avec nom |
| langues_guide | JSON | Nullable | Langues du guide/chauffeur |

---

### 6.2.4 Fonctionnalites detaillees

#### A. Planification des transferts

**Declencheur :**
1. **Automatique :** A la confirmation d'un vol (vol avec aeroport d'arrivee dans une ville avec hotel reserve)
2. **Manuel :** L'utilisateur cree un transfert depuis le tableau de bord ou le dossier client
3. **Batch :** Allocation de transferts pour tout un groupe Hajj/Omra

**Formulaire de creation :**

| Champ | Type | Obligatoire | Regle |
|-------|------|-------------|-------|
| Type de trajet | Select | Oui | Transfer, Circuit, Excursion, Location |
| Type de transfer | Select | Conditionnel | Si type = Transfer : AeroportHotel, etc. |
| Point de depart | Text / Select | Oui | Adresse ou lieu predefini (aeroport, hotel) |
| Point d'arrivee | Text / Select | Oui | Adresse ou lieu predefini |
| Date et heure | DateTime | Oui | >= date du jour |
| Vehicule | Select | Oui | Filtrer par type et disponibilite |
| Chauffeur | Select | Oui | Filtrer par disponibilite et zone |
| Passagers | Select/Search | Oui | Depuis la base clients |
| Vol lie | Select | Non | Pour transferts aeroport |
| Hotel lie | Select | Non | Pour transferts hotel |
| Dossier | Select | Non | Pour liaison dossier |

**Regle metier RC-TRJ-001 :** Un chauffeur ne peut pas avoir 2 trajets consecutifs sans un delai minimum de 30 minutes entre eux.

**Regle metier RC-TRJ-002 :** Un vehicule ne peut pas avoir 2 trajets en meme temps (verifier chevauchement temporel).

**Regle metier RC-TRJ-003 :** Pour un transfert aeroport, le systeme calcule automatiquement l'heure de retrait en fonction de l'heure de vol : vol - 3h (international) ou vol - 2h (national).

**Regle metier RC-TRJ-004 :** Les vehicules en maintenance ne sont pas proposs pour les reservations.

**Regle metier RC-TRJ-005 :** Pour les transferts Hajj, le chauffeur doit parler arabe et/ou la langue du groupe.

**Roles autorises :** Agent, Chef agence, Admin, Chauffeur (lecture seule pour ses propres trajets)

---

#### B. Assignation de chauffeur

**Algorithme d'assignation :**

| Critere | Poids | Description |
|---------|-------|-------------|
| Disponibilite | 40% | Chauffeur libre a la date/heure |
| Zone de competence | 25% | Chauffeur connait la zone du trajet |
| Langue | 20% | Parle la langue des passagers |
| Note evaluation | 10% | Meilleures notes priorisees |
| Dernier trajet | 5% | Espace depuis le dernier trajet |

**Informations chauffeur affichees :**

| Information | Description |
|-------------|-------------|
| Photo + Nom | Identification visuelle |
| Telephone | Contact direct |
| Vehicule assigne | Type et immatriculation |
| Note | Evaluation moyenne |
| Langues | Langues parlees |
| Zones couvertes | Regions d'expertise |
| Disponibilite | Calendrier de disponibilite |

**Notification chauffeur :**
A l'assignation, le chauffeur recoit :
- SMS : "Nouveau trajet le [date] a [heure]. Depart : [lieu]. Arrivee : [lieu]. Passagers : [nb]."
- Push notification (si app chauffeur installee -- future phase)
- L'acceptation du chauffeur est requise dans les 2 heures, sinon reassignation automatique

---

#### C. Suivi en temps reel (GPS -- future phase)

**Phase actuelle :**
- Affichage de la position estimee basee sur l'heure et la distance
- Statut du trajet mis a jour manuellement par le chauffeur ou l'agent

**Future phase (GPS) :**

| Fonctionnalite | Description |
|----------------|-------------|
| Tracking en temps reel | Position GPS du vehicule toutes les 30 secondes |
| Carte interactive | Affichage sur carte (OpenStreetMap / Google Maps) |
| Estimation arrivee | Calcul du temps restant en tenant compte du trafic |
| Notification client | "Votre chauffeur arrive dans [X] minutes" |
| Historique parcours | Trajet complete stockee pour audit |
| Geofencing | Alertes quand le vehicule entre/sort d'une zone |

**Regle metier RC-GPS-001 :** Le tracking GPS n'est active qu'avec le consentement du chauffeur et du client.

**Regle metier RC-GPS-002 :** Les donnees GPS sont stockees 90 jours puis supprimees.

---

#### D. Cout par transfert

**Elements de calcul :**

| Element | Calcul | Exemple |
|---------|--------|---------|
| Cout de base | Distance * tarif/km (selon type vehicule) | 50 km * 0.50 EUR = 25 EUR |
| Duree d'attente | > 15 min : supplement | 30 min attente = +15 EUR |
| Nuit (22h -- 06h) | Coefficient 1.5x | 25 EUR * 1.5 = 37.50 EUR |
| Weekend / fete | Coefficient 1.25x | 25 EUR * 1.25 = 31.25 EUR |
| Autoroutes / peages | Cout reel | 8 EUR de peages |
| Zone eloignee | Supplement fixe | +20 EUR si > 30 km du centre |
| **Total** | **Somme** | **Determinant** |

**Tarifs de reference par type :**

| Type | Tarif/km (EUR) | Minimum | Attente/15min (EUR) |
|------|---------------|---------|---------------------|
| Bus | 0.80 -- 1.20 | 50 | 20 |
| Van | 0.60 -- 0.90 | 30 | 15 |
| Voiture VIP | 1.00 -- 1.50 | 40 | 20 |
| 4x4 | 0.70 -- 1.10 | 35 | 15 |

**Regle metier RC-COUT-001 :** Le cout est estime avant confirmation et confirme apres le trajet reel (si modification d'itineraire).

**Regle metier RC-COUT-002 :** Le cout est facture au client final et integre a la facture globale du dossier.

---

#### E. Liaison avec groupe et vol

**Cas d'usage : Transfer aeroport (arrivee)**

1. Le systeme detecte qu'un vol arrive a [aeroport] a [heure]
2. Il verifie si des clients de ce vol ont un hotel reserve a [ville]
3. Il propose automatiquement un transfert :
   - Grouper les clients du meme vol (si >= 3)
   - Selectionner le vehicule adapte (bus si groupe, van si petit groupe, VIP si client premium)
   - Calculer l'heure de retrait (vol - 3h international)
   - Assigner le chauffeur
4. L'agent confirme ou ajuste
5. Le chauffeur est notifie
6. Le client recoit les details du transfert

**Cas d'usage : Transfer groupe Hajj/Omra**

1. Le planning de groupe definit les dates et horaires
2. Le systeme genere automatiquement tous les transferts :
   - Aeroport -> Hotel (arrivee)
   - Hotel -> Site religieux (aller-retour, quotidien)
   - Hotel -> Aeroport (depart)
3. Allocation vehicules et chauffeurs pour chaque trajet
4. Confirmation globale par le Chef agence
5. Notification aux chauffeurs

**Cas d'usage : Circuit touristique**

1. L'agent cree un circuit avec plusieurs etapes
2. Le systeme calcule les transferts entre chaque etape
3. Allocation vehicule + chauffeur pour la duree du circuit
4. Le chauffeur est disponible pendant toute la duree
5. Cout global estime et affiche

**Regle metier RC-LIAI-001 :** Si un vol est retarde, le transfert associe est automatiquement reporte et le chauffeur notifie.

**Regle metier RC-LIAI-002 :** Si un vol est annule, le transfert associe est automatiquement annule et le client notifie.

**Regle metier RC-LIAI-003 :** La modification d'un vol impacte automatiquement le transfert lie (heure, aeroport).

---

## 6.3 Regles transversales Hotels & Transport

### 6.3.1 Cycle de statuts des reservations hotel

```
EN_ATTENTE --> CONFIRME --> CHECKED_IN --> CHECKED_OUT
     |              |             |              |
     v              v             v              v
  ANNULE      MODIFIE        MODIFIE        TERMINE
     |                                     (archive)
     v
  EXPIRE (pas de confirmation sous 24h)
```

### 6.3.2 Cycle de statuts des trajets

```
PLANIFIE --> CONFIRME --> EN_COURS --> TERMINE
    |            |           |           |
    v            v           v           v
 ANNULE      MODIFIE     RETARDE     ANNULE
                              |
                              v
                         INCIDENT (accident, panne, etc.)
```

### 6.3.3 Roles autorises — Matrice complete

| Action | Agent | Chef agence | Admin | Chauffeur | Client |
|--------|-------|-------------|-------|-----------|--------|
| Creer reservation hotel | Oui | Oui | Oui | Non | Non |
| Modifier reservation hotel | Oui | Oui | Oui | Non | Non |
| Annuler reservation hotel | Non | Oui | Oui | Non | Non |
| Bloquer chambre | Non | Oui | Oui | Non | Non |
| Consulter planning | Oui | Oui | Oui | Non | Non |
| Creer trajet | Oui | Oui | Oui | Non | Non |
| Assigner chauffeur | Oui | Oui | Oui | Non | Non |
| Modifier trajet | Oui | Oui | Oui | Non | Non |
| Annuler trajet | Non | Oui | Oui | Non | Non |
| Accepter trajet | Non | Non | Non | Oui | Non |
| Suivre trajet (GPS) | Oui | Oui | Oui | Non | Oui |
| Voir facture | Oui | Oui | Oui | Non | Oui |
| Modifier prix | Non | Non | Oui | Non | Non |

### 6.3.4 Notifications transversales

| Evenement | Client | Agent | Chauffeur | Chef agence | Canaux |
|-----------|--------|-------|-----------|-------------|--------|
| Reservation hotel confirmee | Oui | Non | -- | Non | Email + SMS |
| Reservation hotel modifiee | Oui | Non | -- | Non | Email + SMS |
| Reservation hotel annulee | Oui | Oui | -- | Oui | Email + SMS |
| Jour d'arrivee hotel (J-1) | Oui | Non | -- | Non | Email + SMS + Push |
| Transfert confirme | Oui | Non | Oui | Non | SMS |
| Transfert modifie | Oui | Non | Oui | Non | SMS |
| Transfert annule | Oui | Non | Oui | Non | SMS |
| Chauffeur en route | Oui | Non | -- | Non | SMS + Push |
| Chauffeur arrive | Oui | Non | -- | Non | SMS + Push |
| Check-in hotel | Oui | Non | -- | Non | Email |
| Check-out hotel | Oui | Oui | -- | Non | Email |
| Facture generee | Oui | Non | -- | Non | Email |

### 6.3.5 Validation et garde-fous

| Code | Regle | Impact |
|------|-------|--------|
| RC-TRANSV-001 | Un vehicule en maintenance ne peut pas etre assigne | Blocage assignation |
| RC-TRANSV-002 | Un chauffeur suspendu ne peut pas etre assigne | Blocage assignation |
| RC-TRANSV-003 | Un chauffeur avec permis expire ne peut pas etre assigne | Alerte + blocage |
| RC-TRANSV-004 | L'assurance vehicule doit etre valide | Alerte 30 jours avant expiration |
| RC-TRANSV-005 | La capacite vehicule doit etre >= nb passagers | Blocage reservation |
| RC-TRANSV-006 | Overbooking hotel max 5% | Alerte si depasse |
| RC-TRANSV-007 | Pas de double-booking chambre | Blocage creation |
| RC-TRANSV-008 | Prix saisonniers recalcules automatiquement | Mise a jour sans impact reservations existantes |

---

## 6.4 KPIs et metriques

### 6.4.1 Hotels

| KPI | Calcul | Cible |
|-----|--------|-------|
| Taux d'occupation | (Nuites reservees / Nuites disponibles) * 100 | > 70% |
| RevPAR | Chiffre affaires / Chambres disponibles | >= prix moyen |
| ADR | CA / Nuites reservees | Selon categorie |
| Taux d'annulation | (Annulations / Reservations totales) * 100 | < 10% |
| Delai moyen confirmation | Temps entre creation et confirmation | < 24h |
| Satisfaction client | Note moyenne feedback | >= 4/5 |
| Overbooking rate | Overbooking reel / Overbooking autorise | < 5% |

### 6.4.2 Transport

| KPI | Calcul | Cible |
|-----|--------|-------|
| Taux d'assignation | (Trajets assigns / Trajets crees) * 100 | 100% |
| Taux d'acceptation chauffeur | (Acceptes / Assignes) * 100 | > 95% |
| Delai moyen reponse chauffeur | Temps entre assignation et acceptation | < 1h |
| Retards | Trajets avec retard > 15 min / Total | < 5% |
| Incidents | Nombre d'incidents / Total trajets | < 1% |
| Cout moyen par transfer | CA transfers / Nombre transfers | Selon zone |
| Satisfaction client transport | Note moyenne feedback | >= 4/5 |
| Utilisation flotte | (Jours en service / Jours disponibles) * 100 | > 60% |

---

*Fin du document — Modules 4, 5 et 6.*

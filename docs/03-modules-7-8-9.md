# Agence Pro — Cahier des Charges Fonctionnel

## Modules 7, 8 et 9

> **Version** : 1.0
> **Date** : 24 juillet 2026
> **Portee** : Modules Comptabilite & Facturation, Documents & OCR, Assistant IA
> **Niveau de detail** : Exhaustif — chaque fonctionnalite inclut declencheur, donnees, regles metier, validations et roles autorises

---

# MODULE 7 : Comptabilite & Facturation

## 7.1 Vue d'ensemble

Ce module constitue le socle financier de l'agence. Il gere l'ensemble du cycle comptable algerien — de l'emission des factures conformes jusqu'au suivi de tresorerie, en passant par la gestion des paiements, des depenses, des avoirs, et la production de rapports financiers. Il est concu pour etre conforme aux normes comptables algeriennes, incluant la TVA a taux multiple (19% et 7%), le Registre des Factures (BSC), et le journal de caisse obligatoire.

### 7.1.1 Principes fondamentaux

- **Conformite comptable algerienne** : toutes les factures generees respectent les mentions legales obligatoires, la numerotation auto-incremente, et les taux de TVA en vigueur (19% standard, 7% taux reduit)
- **Devise principale** : Dinar Algerien (DZD) — toutes les operations sont enregistrees en DZD, avec conversion automatique pour les transactions en devises etrangeres
- **Double ecriture** : chaque operation financiere genere automatiquement une entree au debit et au credit dans le journal comptable
- **Traabilité integrale** : chaque modification financiere est journalisee avec horodatage, utilisateur et motif
- **Non-retroactivite** : les factures validees ne peuvent etre modifiees — uniquement annulees via avoir
- **Archivage obligatoire** : les factures sont conservees pendant 10 ans conformement a la reglementation algerienne

### 7.1.2 Entites principales

| Entite | Role | Cycle de vie |
|--------|------|-------------|
| **Facture** | Document comptable legal representant une prestation | Brouillon → Validee → Payee / Partiellement payee / En retard / Impayee / Annulee |
| **LigneFacture** | Ligne detaillee d'une prestation ou d'un produit | Ajoutee → Modifiee → Validee |
| **Paiement** | Enregistrement d'un reglement recu | Enregistre → Confirme / Annule |
| **Depense** | Sortie d'argent (charges, achats, frais) | Brouillon → Validee / Annulee |
| **Recette** | Entree d'argent hors facturation (apports, virements internes) | Enregistree → Validee |
| **Avoir** | Annulation ou reduction partielle d'une facture | cree → Valide → Applique |
| **JournalComptable** | Ecriture comptable automatique (debit/credit) | Auto-generee → Validee |

---

## 7.2 Entites detaillees

### 7.2.1 Entite Facture

| Champ | Type | Obligatoire | Regle | Description |
|-------|------|-------------|-------|-------------|
| id | UUID | Auto | Genere automatiquement | Identifiant unique |
| numero | String | Auto | Format FA-AAAA-NNNNNN (AAAA=annee, NNNNNN=compteur 6 chiffres) | Numero de facture unique et sequentiel |
| agence_id | UUID | Auto | FK vers Agence | Agence emetrice |
| client_id | UUID | Oui | FK vers Client | Client destinataire |
| dossier_id | UUID | Non | FK vers Dossier | Dossier lie (visa, voyage, Omra/Hajj) |
| date_emission | Date | Auto | Date du jour (modifiable uniquement en brouillon) | Date d'emission |
| date_echeance | Date | Oui | >= date_emission, defaut +30 jours | Date limite de paiement |
| statut | Enum | Auto | BROUILLON, VALIDEE, PAYEE, PARTIELLEMENT_PAYEE, EN_RETARD, IMPAYEE, ANNULLEE | Statut courant |
| devise | String | Auto | Defaut DZD, autres: EUR, USD, GBP, SAR, TRY | Devise de facturation |
| taux_change | Decimal | Auto | Taux du jour si devise != DZD, defaut 1.0000 | Taux de conversion |
| montant_ht | Decimal | Auto | Somme des montants HT des lignes | Montant hors taxes |
| taux_tva | Enum | Oui | 19 ou 7, defaut 19 | Taux de TVA applicable |
| montant_tva | Decimal | Auto | montant_ht * (taux_tva / 100) | Montant de la TVA |
| montant_ttc | Decimal | Auto | montant_ht + montant_tva | Montant toutes taxes comprises |
| montant_paye | Decimal | Auto | Somme des paiements confirmes lies | Montant deja regle |
| montant_restant | Decimal | Auto | montant_ttc - montant_paye | Solde a payer |
| percent_paye | Decimal | Auto | (montant_paye / montant_ttc) * 100 | Pourcentage regle |
| reference_externe | String | Non | Alphanumerique | Reference du client ou du dossier |
| notes | Text | Non | Max 2000 caracteres | Notes internes (non imprimees) |
| created_by | UUID | Auto | FK vers User | Utilisateur ayant cree la facture |
| validated_by | UUID | Non | FK vers User | Utilisateur ayant valide |
| created_at | DateTime | Auto | Horodatage creation | Date de creation |
| updated_at | DateTime | Auto | Horodatage derniere modification | Derniere modification |

### 7.2.2 Entite LigneFacture

| Champ | Type | Obligatoire | Regle | Description |
|-------|------|-------------|-------|-------------|
| id | UUID | Auto | Genere automatiquement | Identifiant unique |
| facture_id | FK | Auto | Vers Facture | Facture parente |
| ordre | Integer | Auto | Auto-incremente par facture | Ordre d'affichage |
| description | String | Oui | 3-500 caracteres | Description de la prestation |
| quantite | Decimal | Oui | > 0, defaut 1 | Quantite |
| prix_unitaire_ht | Decimal | Oui | >= 0 | Prix unitaire hors taxes |
| remise_percent | Decimal | Non | 0-100, defaut 0 | Pourcentage de remise |
| montant_ht | Decimal | Auto | quantite * prix_unitaire_ht * (1 - remise_percent/100) | Montant HT de la ligne |
| taux_tva_ligne | Enum | Non | 19 ou 7, herite de la facture si non specifie | TVA specifique a la ligne |
| type_ligne | Enum | Auto | PRESTATION, FRAIS_CONSULAIRE, VOL, HOTEL, TRANSFERT, ASSURANCE, VISITE, AUTRE | Type de prestation |
| reference | String | Non | Reference externe (n vol, n reservation) | Reference du service |
| product_id | UUID | Non | FK vers Product catalogue | Lien au catalogue produits |

### 7.2.3 Entite Paiement

| Champ | Type | Obligatoire | Regle | Description |
|-------|------|-------------|-------|-------------|
| id | UUID | Auto | Genere automatiquement | Identifiant unique |
| facture_id | FK | Oui | Vers Facture | Facture reglee |
| montant | Decimal | Oui | > 0, ne peut exceder le montant_restant | Montant du reglement |
| devise | String | Auto | Identique a la facture | Devise du paiement |
| mode_paiement | Enum | Oui | ESPECES, CIB, VIREMENT, CHEQUE, CCP, BARIDIMOB, ONLINE | Mode de reglement |
| date_paiement | Date | Oui | <= date du jour | Date du reglement |
| reference_paiement | String | Conditionnel | Obligatoire pour CIB, VIREMENT, CHEQUE, ONLINE | Reference du mode |
| banque | String | Non | Nom de la banque | Banque emettrice |
| statut | Enum | Auto | EN_ATTENTE, CONFIRME, REJETTE, ANNULE | Statut de verification |
| confirmed_by | UUID | Non | FK vers User | Agent/Comptable ayant confirme |
| confirmed_at | DateTime | Non | Horodatage confirmation | Date de confirmation |
| recu_pdf | File | Non | Recu scanne ou genere | Justificatif de paiement |
| notes | Text | Non | Max 500 caracteres | Commentaires internes |
| created_by | UUID | Auto | FK vers User | Qui a enregistre le paiement |
| created_at | DateTime | Auto | Horodatage | Date d'enregistrement |

### 7.2.4 Entite Depense

| Champ | Type | Obligatoire | Regle | Description |
|-------|------|-------------|-------|-------------|
| id | UUID | Auto | Genere automatiquement | Identifiant unique |
| agence_id | UUID | Auto | FK vers Agence | Agence concernee |
| dossier_id | UUID | Non | FK vers Dossier | Dossier lie (si depense affectee) |
| date_depense | Date | Oui | <= date du jour | Date de la depense |
| categorie | Enum | Oui | FRAIS_BUREAU, TRANSPORT, TELECOM, SALAIRE, LOYER, FRAIS_CONSULAIRE, FRAIS_REPRESENTATION, FOURNITURES, MARKETING, DIVERS | Categorie comptable |
| description | String | Oui | 5-500 caracteres | Description de la depense |
| montant | Decimal | Oui | > 0 | Montant de la depense |
| mode_paiement | Enum | Oui | Meme modes que Paiement | Mode de reglement |
| fournisseur | String | Non | 2-200 caracteres | Nom du fournisseur |
| numero_facture_fournisseur | String | Non | Reference facture fournisseur | Numero facture externe |
| justificatif | File | Non (Oui si > 50 000 DZD) | Scan du justificatif | Piece justificative |
| statut | Enum | Auto | BROUILLON, VALIDEE, ANNULEE | Statut de validation |
| validated_by | UUID | Non | FK vers User | Comptable ayant valide |
| is_recurrente | Boolean | Non | Defaut false | Genere auto chaque mois |
| created_by | UUID | Auto | FK vers User | Qui a cree l'entree |
| created_at | DateTime | Auto | Horodatage | Date de creation |

### 7.2.5 Entite Recette

| Champ | Type | Obligatoire | Regle | Description |
|-------|------|-------------|-------|-------------|
| id | UUID | Auto | Genere automatiquement | Identifiant unique |
| agence_id | UUID | Auto | FK vers Agence | Agence concernee |
| date_recette | Date | Oui | <= date du jour | Date de la recette |
| categorie | Enum | Oui | APPORT_CAPITAL, VIREMENT_INTERNE, REMBOURSEMENT, CAUTION_RECU, SUBVENTION, AUTRE | Type de recette |
| description | String | Oui | 5-500 caracteres | Description |
| montant | Decimal | Oui | > 0 | Montant recu |
| mode_paiement | Enum | Oui | Meme modes que Paiement | Mode de reglement |
| reference | String | Non | Reference externe | Reference du virement |
| statut | Enum | Auto | EN_ATTENTE, VALIDEE, ANNULEE | Statut de validation |
| created_by | UUID | Auto | FK vers User | Qui a enregistre |
| created_at | DateTime | Auto | Horodatage | Date d'enregistrement |

### 7.2.6 Entite Avoir

| Champ | Type | Obligatoire | Regle | Description |
|-------|------|-------------|-------|-------------|
| id | UUID | Auto | Genere automatiquement | Identifiant unique |
| numero | String | Auto | Format AV-AAAA-NNNNNN | Numero d'avoir unique |
| facture_originale_id | FK | Oui | Vers Facture | Facture annulee ou reduite |
| motif | Enum | Oui | ANNULATION_TOTALE, ANNULATION_PARTIELLE, REMISE, ERREUR_COMMERCIALE, RETARD_LIVRAISON | Raison de l'avoir |
| montant | Decimal | Oui | > 0, <= montant_ttc origine | Montant de l'avoir |
| type | Enum | Auto | ANNULATION ou REDUCTION | Annulation ou reduction |
| date_emission | Date | Auto | Date du jour | Date d'emission |
| notes | Text | Non | Max 1000 caracteres | Justification detaillee |
| statut | Enum | Auto | BROUILLON, VALIDE, APPLIQUE | Statut |
| created_by | UUID | Auto | FK vers User | Qui a cree l'avoir |
| created_at | DateTime | Auto | Horodatage | Date de creation |

### 7.2.7 Entite JournalComptable

| Champ | Type | Obligatoire | Regle | Description |
|-------|------|-------------|-------|-------------|
| id | UUID | Auto | Genere automatiquement | Identifiant unique |
| agence_id | UUID | Auto | FK vers Agence | Agence concernee |
| date_ecriture | Date | Auto | Date du jour | Date de l'ecriture |
| compte_debit | String | Oui | Plan comptable algerien (411=clients, 512=banque) | Compte au debit |
| compte_credit | String | Oui | Plan comptable algerien (707=ventes, 445=TVA collectee) | Compte au credit |
| montant | Decimal | Oui | > 0 | Montant de l'ecriture |
| libelle | String | Oui | 5-200 caracteres | Description de l'ecriture |
| reference_type | String | Non | FACTURE, PAIEMENT, DEPENSE, AVOIR, RECETTE | Source de l'ecriture |
| reference_id | UUID | Non | ID de l'entite source | Lien vers la source |
| journal | Enum | Oui | VENTES (V), ACHATS (A), TRESORERIE (T), OPERATIONS_DIVERS (OD) | Journal comptable |
| created_at | DateTime | Auto | Horodatage | Date de creation |

---

## 7.3 Regles metier TVA algerienne

### 7.3.1 Taux de TVA applicables

| Taux | Code | Applicabilite | Exemples |
|------|------|---------------|----------|
| 19% | TVA Standard | Toutes les prestations sauf exceptions | Frais de dossier, commission agence, transferts |
| 7% | TVA Reduit | Produits et services essentiels | Billets d'avion (selon accord), transports interieurs |
| 0% | TVA Exonere | Exportations, operations internationales | Services clients etrangers hors Algerie |

### 7.3.2 Regles de calcul TVA

**Regle TVA-001 :** Le taux de TVA est determine au niveau de chaque ligne de facture. Par defaut, il herite du taux de la facture parente, mais peut etre surcharge au niveau de la ligne.

**Regle TVA-002 :** La base imposable est le montant HT apres application de la remise. La remise est deduite AVANT calcul de la TVA.

**Regle TVA-003 :** La TVA est arrondie a 2 decimales. L'arrondi s'effectue par ligne, puis le total TVA est la somme des TVA arrondies (pas l'arrondi du total brut).

**Regle TVA-004 :** En cas de facturation en devise etrangere, la base imposable est convertie en DZD au taux de la Banque d'Algerie du jour de la facture, puis la TVA est appliquee en DZD.

**Regle TVA-005 :** Les avoirs sont soumis aux memes taux de TVA que la facture originale. Si la facture originale avait un taux mixte, l'avoir reprend les taux correspondants par ligne.

**Regle TVA-006 :** Le credit de TVA (TVA deductible - TVA collectee) est calcule automatiquement mensuellement et apparait dans le tableau de bord financier.

### 7.3.3 Mentions obligatoires sur la facture (conformite algerienne)

| # | Mention | Source |
|---|---------|--------|
| 1 | Numero de facture unique et sequentiel (FA-AAAA-NNNNNN) | Auto-genere |
| 2 | Date d'emission | Auto-genere |
| 3 | Identite complete du vendeur (Raison sociale, adresse, NIF, RC, NIS) | Parametres agence |
| 4 | Identite complete de l'acheteur (Nom, adresse, NIF si disponible) | Fiche client |
| 5 | Designination detaillee des prestations | Lignes de facture |
| 6 | Quantite et prix unitaire HT | Lignes de facture |
| 7 | Montant total HT | Calcul automatique |
| 8 | Taux de TVA applicable (19% ou 7%) | Selection ou herite |
| 9 | Montant de la TVA | Calcul automatique |
| 10 | Montant total TTC | Calcul automatique |
| 11 | Date d'echeance du paiement | Saisie ou defaut +30j |
| 12 | Conditions et modalites de paiement | Parametres agence |
| 13 | Mentions TVA (sur encaissement ou sur facturation) | Parametrage agence |

### 7.3.4 Numerotation automatique

**Regle NUM-001 :** Le numero de facture suit le format FA-AAAA-NNNNNN :
- AAAA = annee d'emission (4 chiffres)
- NNNNNN = compteur sequentiel a 6 chiffres, reinitialise chaque 1er janvier
- Exemple : FA-2026-000001, FA-2026-000002...

**Regle NUM-002 :** Le compteur est gere par agence. Chaque agence a sa propre sequence.

**Regle NUM-003 :** Les numeros supprimes ne sont jamais reutilises. Le compteur est monotone.

**Regle NUM-004 :** Les avoirs utilisent le format AV-AAAA-NNNNNN avec le meme mecanisme.

**Regle NUM-005 :** Le format est configurable dans les parametres de l'agence.

---

## 7.4 Cycle de statuts de la facture

```
BROUILLON --> VALIDEE --> PAYEE
                   |            ^
                   |            | (paiement total)
                   v            |
            PARTIELLEMENT_PAYEE -'
                   |
                   +--> EN_RETARD (date_echeance + 7j)
                   |         |
                   |         v
                   +--> IMPAYEE (date_echeance + 30j)

VALIDEE --> ANNULLEE (via avoir d'annulation totale)
```

| Statut | Code | Description | Transition depuis | Conditions |
|--------|------|-------------|-------------------|------------|
| Brouillon | BROUILLON | Facture en cours de redaction | Creation | -- |
| Validee | VALIDEE | Facture legalement emise | BROUILLON | Au moins 1 ligne, montant > 0, mentions completes |
| Payee | PAYEE | Reglement total recu | VALIDEE, PARTIELLEMENT_PAYEE | montant_restant = 0 |
| Partiellement payee | PARTIELLEMENT_PAYEE | Acompte recu, solde restant | VALIDEE | 0 < montant_paye < montant_ttc |
| En retard | EN_RETARD | Date d'echeance depassee | PARTIELLEMENT_PAYEE, VALIDEE | date_du_jour > date_echeance + 7j |
| Impayee | IMPAYEE | Aucun paiement apres delai critique | EN_RETARD | date_du_jour > date_echeance + 30j |
| Annulee | ANNULLEE | Facture annulee via avoir | VALIDEE | Avoir d'annulation totale valide |

**Transitions automatiques (cron job quotidien 00h00 UTC) :**

| Regle | Condition | Action |
|-------|-----------|--------|
| AUTO-EN_RETARD | statut = VALIDEE ou PARTIELLEMENT_PAYEE ET date_du_jour > date_echeance + 7 | Passer a EN_RETARD + notification |
| AUTO-IMPAYEE | statut = EN_RETARD ET date_du_jour > date_echeance + 30 | Passer a IMPAYEE + notification + relance |

---

## 7.5 Fonctionnalites detaillees

### 7.5.1 Creation d'une facture

**Declencheur :** L'utilisateur (Agent, Comptable, Chef agence) clique sur "Nouvelle facture" depuis le tableau de bord financier, le dossier client, ou la page facturation.

**Formulaire de creation :**

| Champ | Type | Obligatoire | Regle | Source |
|-------|------|-------------|-------|--------|
| Client | Search/Select | Oui | Doit exister dans la base | Selection depuis la base |
| Dossier lie | Search/Select | Non | Rattacher a un dossier existant | Liste des dossiers du client |
| Date d'emission | Date | Auto | Date du jour, modifiable en BROUILLON | Saisie |
| Date d'echeance | Date | Oui | >= date_emission, defaut +30 jours | Saisie ou calcul |
| Taux de TVA | Select | Oui | 19% (defaut) ou 7% | Selection |
| Devise | Select | Auto | DZD par defaut | Selection |
| Notes internes | Textarea | Non | Max 2000 caracteres | Saisie |

**Ajout de lignes :**

| Champ | Type | Obligatoire | Regle |
|-------|------|-------------|-------|
| Description | Text | Oui | 3-500 caracteres, description claire |
| Type de ligne | Select | Oui | PRESTATION, FRAIS_CONSULAIRE, VOL, HOTEL, TRANSFERT, ASSURANCE, VISITE, AUTRE |
| Quantite | Number | Oui | > 0, 2 decimales |
| Prix unitaire HT | Number | Oui | >= 0, 2 decimales |
| Remise (%) | Number | Non | 0-100, defaut 0 |
| TVA ligne | Select | Non | 19% ou 7%, herite de la facture |

**Regles metier :**

| Code | Regle |
|------|-------|
| FCT-001 | Une facture doit contenir au minimum 1 ligne avec description, quantite et prix > 0 |
| FCT-002 | La date d'echeance ne peut pas etre inferieure a la date d'emission |
| FCT-003 | Seul un Admin ou Comptable peut modifier la date d'emission en BROUILLON |
| FCT-004 | La creation depuis un dossier pre-remplit les lignes avec les prestations du dossier |
| FCT-005 | Un acompte de 50% peut etre genere auto depuis un dossier, echeance J-15 avant depart |

**Action post-creation :**
1. La facture est creee en statut BROUILLON
2. Un numero provisoire est attribue (visible interne)
3. L'utilisateur peut ajouter/modifier/supprimer des lignes
4. La validation genere le numero definitif et passe a VALIDEE
5. Une ecriture comptable est generee automatiquement
6. Une copie PDF est generee automatiquement

**Roles autorises :** Agent (ses dossiers), Comptable (tous), Chef agence (tous), Admin (tous)

---

### 7.5.2 Validation d'une facture

**Declencheur :** Clic sur "Valider" sur une facture en BROUILLON.

**Pre-conditions (toutes obligatoires) :**
1. Au moins 1 ligne de facture existe
2. Le client est selectionne
3. La date d'echeance est definie
4. Pas de doublon (meme client, meme dossier, meme date)
5. Le montant total HT est > 0
6. Toutes les lignes ont une description valide

**Controles de validation :**

| Controle | Type | Message |
|----------|------|---------|
| Montant HT > 0 | Bloquant | La facture doit avoir un montant superieur a zero |
| Client actif | Bloquant | Le client selectionne n'est pas actif |
| Dossier coherent | Avertissement | Ce dossier a deja une facture validee |
| Doublon potentiel | Avertissement | Une facture similaire existe deja |

**Actions post-validation :**
1. Le numero definitif est genere (FA-2026-000042)
2. Le statut passe a VALIDEE
3. Les champs sont geles
4. Le PDF conforme est genere avec mentions legales
5. L'ecriture comptable : debit 411 (clients) / credit 707 (ventes) + 445 (TVA collectee)
6. Notification email + WhatsApp au client avec la facture PDF
7. Le suivi des echeances est active

**Roles autorises :** Comptable, Chef agence, Admin

---

### 7.5.3 Envoi de facture par email et WhatsApp

**Declencheur :** Envoi automatique apres validation OU envoi manuel.

| Canal | Format | Pieces jointes | Template |
|-------|--------|----------------|----------|
| Email | PDF + HTML | Facture PDF, conditions generales | Template agence personnalise |
| WhatsApp | PDF | Facture PDF | Message court avec numero et montant |

**Regles d'envoi :**

| Code | Regle |
|------|-------|
| ENVOI-001 | L'envoi WhatsApp n'est possible que si le client a un numero valide |
| ENVOI-002 | Le PDF ne doit pas depasser 5 Mo. Sinon, compression auto |

- Maximum 3 envois WhatsApp par facture par semaine (anti-spam)
- Si l'email echoue (bounce), alerte generee
- Historique des envois journalise (date, canal, statut)

**Roles autorises :** Agent (ses factures), Comptable, Chef agence, Admin

---

### 7.5.4 Suivi des paiements

**Declencheur :** Consultation du tableau de bord financier ou de la page detail facture.

**Statuts de paiement :**

| Statut | Critere visuel | Action possible |
|--------|----------------|-----------------|
| PAYEE | Badge vert | Consultation seule |
| PARTIELLEMENT_PAYEE | Badge jaune | Ajouter un paiement |
| EN_RETARD | Badge orange | Ajouter un paiement + relance |
| IMPAYEE | Badge rouge | Ajouter un paiement + relance + escalation |

**Enregistrement d'un paiement :**

| Champ | Type | Obligatoire | Regle |
|-------|------|-------------|-------|
| Montant | Number | Oui | > 0, <= montant_restant |
| Mode de paiement | Select | Oui | ESPECES, CIB, VIREMENT, CHEQUE, CCP, BARIDIMOB, ONLINE |
| Date de paiement | Date | Oui | <= date du jour |
| Reference | Text | Conditionnel | Obligatoire pour CIB, VIREMENT, CHEQUE, ONLINE |
| Banque | Text | Non | Pour VIREMENT et CHEQUE |
| Justificatif | File | Non | Recu ou bordereau |

**Regles metier :**

| Code | Regle |
|------|-------|
| PAI-001 | Paiement especes > 100 000 DZD necessite declaration de operations suspectes (DOS) + alerte compliance |
| PAI-002 | Un cheque passe par EN_ATTENTE puis CONFIRME quand l'encaissement est verifie |
| PAI-003 | Un paiement CIB genere automatiquement une reference de transaction verifiee |
| PAI-004 | Un virement bancaire doit avoir un numero de reference valide |
| PAI-005 | Le total des paiements ne peut jamais depasser le montant TTC. Sinon, systeme propose un avoir |
| PAI-006 | Un paiement peut etre affecte a un dossier specifique (repartition au prorata) |

---

### 7.5.5 Relances automatiques

**Declencheur :** Cron job quotidien verifiant les factures en retard.

**Delais et actions :**

| Delai | Action | Canal |
|-------|--------|-------|
| J+7 | Relance 1 — rappel amical | Email |
| J+15 | Relance 2 — rappel ferme | Email + WhatsApp |
| J+30 | Relance 3 — mise en demeure | Email + WhatsApp + Notification interne |
| J+45 | Escalade manuelle | Notification Chef agence |

**Regles de relance :**

| Code | Regle |
|------|-------|
| REL-001 | Maximum 3 relances automatiques, puis escalade |
| REL-002 | Pas de relance si paiement EN_ATTENTE en cours |
| REL-003 | Pas de relance si avoir en cours de traitement |
| REL-004 | Relances personnalisees avec details facture |
| REL-005 | Historique des relances visible sur la facture |
| REL-006 | Relances desactivees si litige ouvert |
| REL-007 | WhatsApp uniquement entre 9h et 18h (heure Algerie) |
| REL-008 | Pas de relance le vendredi et jours feries algeriens |

---

### 7.5.6 Tableau de bord financier

**KPI affiches :**

| KPI | Calcul | Periode |
|-----|--------|---------|
| Chiffre d'affaires (CA) | Somme(montant_ttc VALIDEE + PAYEE) | Mois, trimestre, annee |
| CA par agent | CA / agents actifs | Mois en cours |
| CA par type de dossier | Regroupe par type | Mois en cours |
| Depenses totales | Somme(depenses VALIDEE) | Mois en cours |
| Benefice net | CA - Depenses | Mois en cours |
| Tresorerie | Solde banque + caisse - cheques | Date du jour |
| Encaissements | Somme(paiements CONFIRME) | Mois en cours |
| Factures en attente | Montant VALIDEE + PARTIELLEMENT_PAYEE + EN_RETARD | Date du jour |
| Impayes | Montant IMPAYEE | Date du jour |
| Taux de recouvrement | (Encaissements / CA) * 100 | Mois en cours |
| Delai moyen paiement | Moyenne(date_paiement - date_emission) | Mois en cours |
| Credit TVA | TVA deductible - TVA collectee | Mois en cours |

**Graphiques :**
1. Courbe CA mensuel (12 mois) avec tendance
2. Repartition CA par type de dossier (camembert)
3. Evolution tresorerie (courbe coloree vert/rouge)
4. Factures par statut (barres colorees)
5. Depenses par categorie (treemap)
6. Encaissements vs Echeances (combo)
7. Top 10 clients par CA
8. CA par wilaya (heatmap carte Algerie)

**Filtres :** Periode, type dossier, agent, mode paiement, statut facture, client, devise

---

### 7.5.7 Rapports financiers

| # | Rapport | Periode | Format |
|---|---------|---------|--------|
| 1 | Journal des ventes | Jour/Semaine/Mois | CSV, PDF |
| 2 | Journal des achats | Mois/Trimestre | CSV, PDF |
| 3 | Grand livre | Mois/Trimestre/Annee | CSV, PDF |
| 4 | Balance | Mois/Trimestre/Annee | CSV, PDF |
| 5 | Tableau de TVA | Mois/Annee | CSV, PDF |
| 6 | Etat des impayes | Date du jour | CSV, PDF |
| 7 | Suivi encaissements | Jour/Semaine/Mois | CSV, PDF |
| 8 | Compte de resultat | Mois/Trimestre/Annee | PDF |
| 9 | Bilan simplifie | Annuel | PDF |
| 10 | Rapport de caisse | Jour | PDF |
| 11 | Rapport par client | Toutes periodes | CSV, PDF |
| 12 | Rapport par agent | Mois/Trimestre | CSV, PDF |

- Export CSV : separateur virgule, UTF-8, en-tetes francais, format JJ/MM/AAAA
- Export PDF : en-tete logo, mentions legales, filigrane CONFIDENTIEL, pagination
- Rapports planifiables (quotidien, hebdo, mensuel) envoyes par email
- Historique des rapports conserve 2 ans

---

### 7.5.8 Gestion des avoirs

**Declencheur :** Clic sur "Generer un avoir" depuis une facture VALIDEE ou PAYEE.

| Motif | Type | Montant max |
|-------|------|-------------|
| ANNULATION_TOTALE | Annulation | = montant_ttc |
| ANNULATION_PARTIELLE | Reduction | < montant_ttc |
| REMISE | Reduction | < montant_ttc |
| ERREUR_COMMERCIALE | Reduction | < montant_ttc |
| RETARD_LIVRAISON | Reduction | < montant_ttc |

**Regles :**

| Code | Regle |
|------|-------|
| AVR-001 | Avoir uniquement sur facture VALIDEE ou PAYEE |
| AVR-002 | Montant avoir <= montant TTC facture originale |
| AVR-003 | Avoir partiel : seules les lignes concernees sont annulees |
| AVR-004 | Validation avoir = ecriture comptable inverse automatique |
| AVR-005 | Facture PAYEE + avoir = credit sur compte client |
| AVR-006 | Credit utilisable pour compensation ou remboursement |
| AVR-007 | Avoir valide non modifiable (annulable par nouvel avoir inverse) |
| AVR-008 | Numerotation AV-AAAA-NNNNNN |

---

### 7.5.9 Alertes financieres

| # | Alerte | Declencheur | Destinataire | Canal |
|---|--------|-------------|--------------|-------|
| 1 | Facture en retard | Echeance + 7j, pas paiement | Agent + Comptable | In-app + Email |
| 2 | Impaye critique | Echeance + 30j | Chef agence | In-app + Email + SMS |
| 3 | Seuil TVA depasse | Credit TVA > 500 000 DZD | Comptable + Admin | In-app + Email |
| 4 | Caisse negative | Tresorerie < 0 | Admin | In-app + Email + SMS |
| 5 | Paiement suspect | especes > 100 000 DZD | Compliance + Admin | In-app + Email |
| 6 | Doublon potentiel | Meme client + montant +/- 5% + meme semaine | Agent | In-app |
| 7 | Depense hors budget | Categorie > budget de 20% | Chef agence + Admin | In-app + Email |
| 8 | Cheque en attente | Non encaisse > 15 jours | Comptable | In-app |
| 9 | Objectif CA atteint | CA >= objectif | Toute l'equipe | In-app |
| 10 | Annulation facture | Avoir annulation totale | Chef agence + Admin | In-app + Email |

---

### 7.5.10 Cloture de caisse

**Declencheur :** Fin de journee ou fin de semaine (configurable).

| Champ | Description |
|-------|-------------|
| Date | Date de la cloture |
| Montant ouverture | Montant en caisse en debut de journee |
| Entrees | Total recettes especes |
| Sorties | Total depenses especes |
| Montant fermeture | Calcule (ouverture + entrees - sorties) |
| Montant reel | Saisie manuelle |
| Ecart | Reel - Calcule |
| Justification ecart | Obligatoire si ecart > 0 |

**Regles :**

| Code | Regle |
|------|-------|
| CC-001 | Cloture irreversible une fois validee |
| CC-002 | Ecart > 0 = justification obligatoire |
| CC-003 | Ecart > 10 000 DZD = alerte Chef agence |
| CC-004 | Rapport de caisse genere automatiquement en PDF |
| CC-005 | Email de cloture envoye a l'Admin |
| CC-006 | Operations apres cloture reportees au jour suivant |

---
---

# MODULE 8 : Documents et OCR

## 8.1 Vue d'ensemble

Ce module gere l'ensemble du cycle de vie des documents dans l'agence : depuis l'upload et le stockage securise des pieces justificatives, jusqu'a l'extraction automatique des donnees par OCR, en passant par la generation de documents standardises et la signature electronique. Il constitue le referentiel documentaire centralise de l'agence.

### 8.1.1 Principes fondamentaux

- **Centralisation** : tous les documents stockes dans un referentiel unique
- **Classification intelligente** : l'OCR et les regles metier classifient automatiquement
- **Securite** : chiffrement AES-256 au repos, TLS 1.3 en transit, droits d'acces granulaires
- **Conformite** : conservation 10 ans (documents comptables, reglementation algerienne)
- **Accessibilite** : recherche plein texte, tags, filtres par type/date/client/dossier

### 8.1.2 Types de documents geres

| # | Type | Code | Formats | Taille max |
|---|------|------|---------|------------|
| 1 | Passeport | PASSEPORT | JPEG, PNG, PDF | 10 Mo |
| 2 | Carte Nationale d'Identite | CNI | JPEG, PNG, PDF | 10 Mo |
| 3 | Visa | VISA | JPEG, PNG, PDF | 10 Mo |
| 4 | Photos d'identite | PHOTO | JPEG, PNG | 5 Mo |
| 5 | Certificat de vaccination | VACCINATION | JPEG, PNG, PDF | 10 Mo |
| 6 | Contrat de voyage | CONTRAT | PDF | 10 Mo |
| 7 | Facture | FACTURE | PDF | 10 Mo |
| 8 | Billet d'avion | BILLET | PDF | 10 Mo |
| 9 | Assurance voyage | ASSURANCE | PDF | 10 Mo |
| 10 | Justificatif de domicile | JUSTIF_DOMICILE | JPEG, PNG, PDF | 10 Mo |
| 11 | Attestation d'emploi | ATTESTATION_EMPLOI | JPEG, PNG, PDF | 10 Mo |
| 12 | Releve bancaire | RELEVE_BANCAIRE | PDF | 10 Mo |
| 13 | Autre | AUTRE | Tous formats | 10 Mo |

---

## 8.2 Entites detaillees

### 8.2.1 Entite Document

| Champ | Type | Obligatoire | Regle | Description |
|-------|------|-------------|-------|-------------|
| id | UUID | Auto | Genere auto | Identifiant unique |
| agence_id | UUID | Auto | FK vers Agence | Agence proprietaire |
| client_id | UUID | Non | FK vers Client | Client lie |
| dossier_id | UUID | Non | FK vers Dossier | Dossier lie |
| type_document | Enum | Oui | 13 types definis | Classification |
| sous_type | String | Non | Precision (Passeport ordinaire, etc.) | Sous-classification |
| titre | String | Oui | 5-200 caracteres | Titre descriptif |
| description | Text | Non | Max 500 caracteres | Description detaillee |
| fichier_nom | String | Auto | Nom original | Nom du fichier upload |
| fichier_taille | Integer | Auto | En octets | Taille du fichier |
| fichier_type | String | Auto | MIME type | Type MIME |
| fichier_url | String | Auto | URL securisee | Chemin de stockage |
| fichier_hash | String | Auto | SHA-256 | Empreinte integrite |
| chiffrement | Enum | Auto | AES-256-GCM | Algorithme chiffrement |
| statut | Enum | Auto | EN_ATTENTE, VALIDE, REFUSE, EXPIRE, ARCHIVE | Statut validation |
| ocr_statut | Enum | Auto | EN_ATTENTE, EN_COURS, TERMINE, ECHEC | Etat traitement OCR |
| ocr_donnees | JSON | Auto | Donnees extraites OCR | Resultats extraction |
| ocr_confiance | Decimal | Auto | 0-100 | Score de confiance |
| tags | Array[String] | Non | Tags libres | Tags personnalises |
| date_expiration | Date | Non | Date de peremption | Documents temporaires |
| est_signe | Boolean | Auto | Defaut false | Signature electronique |
| version | Integer | Auto | Commence a 1 | Numero de version |
| version_precedente_id | UUID | Non | FK vers Document precedent | Lien version anterieure |
| confidentiel | Boolean | Non | Defaut false | Admin/Comptable uniquement |
| created_by | UUID | Auto | FK vers User | Qui a uploade |
| created_at | DateTime | Auto | Horodatage | Date d'upload |
| updated_at | DateTime | Auto | Horodatage | Derniere modification |
| accessed_at | DateTime | Auto | Horodatage | Derniere consultation |

### 8.2.2 Entite VersionDocument

| Champ | Type | Obligatoire | Regle | Description |
|-------|------|-------------|-------|-------------|
| id | UUID | Auto | Genere auto | Identifiant unique |
| document_id | FK | Auto | Vers Document parent | Document concerne |
| version | Integer | Auto | Auto-incremente | Numero de version |
| fichier_url | String | Auto | URL du fichier | Stockage de la version |
| fichier_hash | String | Auto | SHA-256 | Empreinte |
| changelog | Text | Non | Description modifications | Motif nouvelle version |
| created_by | UUID | Auto | FK vers User | Qui a cree |
| created_at | DateTime | Auto | Horodatage | Date de creation |

---

## 8.3 Fonctionnalites detaillees

### 8.3.1 Upload de documents

**Declencheur :** Clic sur "Ajouter un document" dans un dossier client/visa/voyage, ou depuis la page Documents.

**Interface d'upload :**

| Element | Description |
|---------|-------------|
| Zone drag and drop | Surface de drop avec texte "Deposez vos fichiers ici" |
| Bouton Parcourir | Selection depuis l'explorateur |
| Selection multiple | Plusieurs fichiers en une fois |
| Barre de progression | Pourcentage d'upload en temps reel |
| Apercu miniature | Images : apercu 150x150px |

**Champs metadata apres upload :**

| Champ | Type | Obligatoire | Regle |
|-------|------|-------------|-------|
| Type de document | Select | Oui | 13 types definis |
| Client concerne | Search | Non | Par nom/prenom/telephone |
| Dossier concerne | Search | Non | Selection parmi les dossiers |
| Titre | Text | Oui | Defaut : nom fichier sans extension |
| Description | Textarea | Non | Max 500 caracteres |
| Tags | Tags input | Non | Tags libres |
| Date d'expiration | Date | Non | Documents temporaires |
| Confidentiel | Checkbox | Non | Defaut false |

**Regles d'upload :**

| Code | Regle | Impact |
|------|-------|--------|
| DOC-001 | Taille max 10 Mo (5 Mo photos) | Rejet si depassement |
| DOC-002 | Formats : JPEG, PNG, PDF uniquement | Rejet si non supporte |
| DOC-003 | Nom nettoye (pas de caracteres speciaux/espaces) | Renommage auto |
| DOC-004 | Chiffrement AES-256-GCM avant stockage | Securite au repos |
| DOC-005 | Hash SHA-256 genere | Verification integrite |
| DOC-006 | Maximum 20 documents par dossier | Alerte si depassement |
| DOC-007 | Type PASSEPORT/CNI = OCR auto | Extraction auto |
| DOC-008 | Doublons detectes (hash identique) | Eviter uploads multiples |
| DOC-009 | Log d'upload cree (utilisateur, date, fichier, taille) | Audit trail |
| DOC-010 | Fichier original jamais modifie | Immutabilite |

**Roles autorises :** Agent (ses dossiers), Chef agence (tous dossiers agence), Admin (tous)

---

### 8.3.2 Extraction OCR

**Declencheur :** Upload d'un document PASSEPORT, CNI, VISA, VACCINATION, JUSTIF_DOMICILE, ATTESTATION_EMPLOI, ou RELEVE_BANCAIRE. Aussi declenchable manuellement.

**Moteurs OCR :**

| Moteur | Usage | Avantages | Limitations |
|--------|-------|-----------|-------------|
| Tesseract OCR | Par defaut (local) | Gratuit, rapide, pas de reseau | Moins precis sur mauvaise qualite |
| Google Cloud Vision | Fallback ou document critique | Tres precis, langues multiples | Payant (1EUR/1000 images) |

**Selection automatique :**
1. Tesseract par defaut
2. Score < 60% = bascule Google Vision
3. Force Google Vision possible manuellement

**Champs extraits par type :**

#### Passeport

| Champ | Methode | Validation |
|-------|---------|------------|
| nom | OCR zone superieure + MRZ | Alpha + tirets, min 2 chars |
| prenom(s) | OCR zone superieure + MRZ | Alpha + espaces, min 2 chars |
| nationalite | OCR zone superieure + MRZ | Valeur connue |
| numero_passeport | MRZ (ligne 2) + OCR | Format 2L + 7C (AL) |
| date_naissance | MRZ + OCR | JJ/MM/AAAA, age >= 0 |
| date_delivrance | MRZ + OCR | JJ/MM/AAAA, <= aujourd'hui |
| date_expiration | MRZ + OCR | JJ/MM/AAAA, > aujourd'hui |
| lieu_naissance | OCR zone superieure | Texte libre |
| sexe | MRZ (ligne 2) | M ou F |
| taille | OCR | 100-220 cm |
| couleur_yeux | OCR | Texte libre |
| mrz_ligne1 | Extraction directe | 44 caracteres, format strict |
| mrz_ligne2 | Extraction directe | 44 caracteres, format strict |
| mrz_ligne3 | Extraction directe | Optionnel |
| photo | Detection zone photo | Image extraite |

#### CNI

| Champ | Methode | Validation |
|-------|---------|------------|
| nom | OCR recto | Alpha + tirets |
| prenom | OCR recto | Alpha + espaces |
| numero_cni | OCR recto | Format algerien |
| date_naissance | OCR recto | JJ/MM/AAAA |
| lieu_naissance | OCR recto | Texte libre |
| date_delivrance | OCR recto | JJ/MM/AAAA |
| date_expiration | OCR recto | JJ/MM/AAAA |
| sexe | OCR recto | M ou F |
| adresse | OCR verso | Texte libre |
| profession | OCR verso | Texte libre |
| wilaya_delivrance | OCR recto | Code ou nom wilaya |
| taille | OCR recto | 100-220 cm |
| groupe_sanguin | OCR recto | A+/-, B+/-, AB+/-, O+/- |
| photo_recto | Extraction zone | Image |
| photo_verso | Image complete | Image |

#### Visa

| Champ | Methode | Validation |
|-------|---------|------------|
| type_visa | OCR + classification auto | TOURISTIQUE, AFFAIRES, etc. |
| pays_delivrance | OCR | Code pays ISO |
| numero_visa | OCR | Alphanumerique |
| date_delivrance | OCR | JJ/MM/AAAA |
| date_expiration | OCR | JJ/MM/AAAA |
| nombre_entrees | OCR | Simple, Double, Multiple |
| duree_sejour | OCR | Nombre + unites |
| nom_titulaire | OCR | Correspondance client |
| delivreur | OCR | Texte libre |

#### Certificat de vaccination

| Champ | Methode | Validation |
|-------|---------|------------|
| type_vaccin | OCR | Meningite ACWY, COVID-19, etc. |
| date_vaccination | OCR | JJ/MM/AAAA |
| dose | OCR | 1, 2, 3, etc. |
| centre | OCR | Texte libre |
| medecin | OCR | Texte libre |
| date_expiration | OCR | JJ/MM/AAAA |
| lot | OCR | Alphanumerique |
| certificat_numero | OCR | Alphanumerique |

#### Justificatif de domicile

| Champ | Methode | Validation |
|-------|---------|------------|
| type_justificatif | OCR + classification | EDF, Gas, Loyer, Propriete |
| titulaire | OCR | Texte |
| adresse | OCR | Texte |
| date_facture | OCR | JJ/MM/AAAA |
| montant | OCR | Decimal DZD |

#### Attestation d'emploi

| Champ | Methode | Validation |
|-------|---------|------------|
| entreprise | OCR | Texte |
| nom_employe | OCR | Texte |
| poste | OCR | Texte |
| date_embauche | OCR | JJ/MM/AAAA |
| salaire | OCR | Decimal DZD |
| date_attestation | OCR | JJ/MM/AAAA |

#### Releve bancaire

| Champ | Methode | Validation |
|-------|---------|------------|
| banque | OCR | Texte |
| titulaire | OCR | Texte |
| numero_compte | OCR | Alphanumerique |
| periode | OCR | Texte |
| solde_ouverture | OCR | Decimal DZD |
| solde_cloture | OCR | Decimal DZD |
| operations | OCR tabulaire | Tableau |

### 8.3.3 Workflow OCR

```
Document uploade
    |
    v
Detection type
    |
    +--> PASSEPORT/CNI/VISA/VACCINATION/etc.
    |         |
    |         v
    |    Lancement Tesseract auto
    |         |
    |         +--> Confiance >= 60% --> Extraction + Validation --> VALIDE
    |         |
    |         +--> Confiance < 60% --> Fallback Google Vision
    |                                    |
    |                                    +--> >= 75% --> Extraction + Validation
    |                                    |
    |                                    +--> < 75% --> Validation manuelle
    |
    +--> AUTRE --> Pas d'OCR auto (lancement manuel possible)
```

### 8.3.4 Validation OCR

| Regle | Description | Impact |
|-------|-------------|--------|
| OCR-VAL-001 | Nom extrait compare avec nom du client lie | Alerte si ecart |
| OCR-VAL-002 | Date expiration passeport > date du jour + 6 mois | Alerte si bientot expire |
| OCR-VAL-003 | Numero passeport verifie (format + checksum MRZ) | Alerte si invalide |
| OCR-VAL-004 | Coherence donnees OCR vs donnees client existantes | Notification si incoherence |
| OCR-VAL-005 | Dates coherentes (delivrance < expiration, naissance < delivrance) | Alerte |
| OCR-VAL-006 | Score de confiance affiche par champ | Badge vert/jaune/rouge |

- Score < 60% sur champ critique = validation manuelle obligatoire
- Document source affiche a cote des champs OCR pour verification
- Corrections enregistrees pour fine-tuning futur

---

### 8.3.5 Generation automatique de documents

| # | Document | Declencheur | Format |
|---|----------|-------------|--------|
| 1 | Contrat de voyage | Creation dossier voyage/Omra/Hajj | PDF |
| 2 | Facture detaillee | Validation facture | PDF conforme |
| 3 | Attestation de voyage | Demande client/consulat | PDF |
| 4 | Checklist de depart | J-7 avant depart | PDF + WhatsApp |
| 5 | Recapitulatif de dossier | Fin de dossier | PDF |
| 6 | Bon de commande | Validation commerciale | PDF |
| 7 | Attestation d'assurance | Souscription assurance | PDF |
| 8 | Lettre d'invitation | Demande visa | PDF |

### 8.3.6 Contrat de voyage — Detail

**Sections du contrat :**

| # | Section | Source |
|---|---------|--------|
| 1 | En-tete (logo, RC, NIF, adresse) | Parametres agence |
| 2 | Parties (client, CNI/Passeport) | Fiche client |
| 3 | Objet (destination, dates, programme) | Dossier voyage |
| 4 | Prestations detaillees | Dossier + Reservations |
| 5 | Tarification (HT, TVA, TTC) | Facture liee |
| 6 | Modalites de paiement | Parametres agence |
| 7 | Conditions d'annulation | Parametres agence |
| 8 | Obligations agence | Modele standard |
| 9 | Obligations client | Modele standard |
| 10 | Responsabilite | Modele standard |
| 11 | Conditions generales | Modele standard |
| 12 | Signatures electroniques | Signature ecran |
| 13 | Annexes (programme, vol, hotel) | Dossier voyage |

**Regles :**

| Code | Regle |
|------|-------|
| CTR-001 | Contrat bilingue (FR + AR) si souhait client |
| CTR-002 | Conditions d'annulation personnalisees par type de voyage |
| CTR-003 | Numerotation CT-AAAA-NNNNNN |
| CTR-004 | Stocke comme document type CONTRAT dans le dossier |
| CTR-005 | Notification au client pour signer |
| CTR-006 | Non signe apres 72h = rappel automatique |

---

### 8.3.7 Signature electronique

**Interface :**

| Element | Description |
|---------|-------------|
| Canvas | 600x200px, dessin tactile/souris |
| Options | Doigt (tablette) ou souris (ordinateur) |
| Effacer | Recommencer |
| Valider | Action irreversible |
| PIN | Optionnel, authentification signataire |

**Donnees de signature :**

| Champ | Type | Description |
|-------|------|-------------|
| id | UUID | Identifiant unique |
| document_id | FK | Document signe |
| signataire_nom | String | Nom complet |
| signataire_role | Enum | CLIENT, AGENT, CHEF_AGENCE, ADMIN |
| signature_image | Blob | Image PNG |
| signature_hash | String | SHA-256 |
| ip_address | String | IP du signataire |
| user_agent | String | Navigateur/appareil |
| geolocalisation | Object | lat, lng si disponible |
| date_signature | DateTime | Horodatage UTC |
| est_valide | Boolean | True a la creation |

**Regles :**

| Code | Regle |
|------|-------|
| SIG-001 | Signature liee au hash du document a la date de signature |
| SIG-002 | Document modifie apres signature = signature invalidee |
| SIG-003 | Contrat voyage : 2 signatures requises (client + representant) |
| SIG-004 | Certificat de signature genere en PDF integre |
| SIG-005 | Historique signatures conserve meme si document supprime |
| SIG-006 | Sans PIN = validee par validation canvas |
| SIG-007 | Avec PIN = signature electronique qualifiee |
| SIG-008 | Plusieurs signatures dans un ordre defini possible |

---

### 8.3.8 Expiration tracking

**Cron job quotidien verifiant les dates d'expiration.**

| Delai avant expiration | Action | Destinataire |
|------------------------|--------|--------------|
| 90 jours | Information | Agent du dossier |
| 60 jours | Rappel | Agent + Client (email) |
| 30 jours | Alerte | Agent + Chef + Client (email + WhatsApp) |
| 15 jours | Alerte critique | Chef + Admin + Client (SMS) |
| 0 jours | Document expire | Badge EXPIRE + blocage |

**Documents concernes :** Passeport, CNI, Visa, Certificat vaccination, Justificatif domicile (< 3 mois), Attestation emploi (< 1 mois), Releve bancaire (< 3 mois), Assurance voyage.

**Regles :**

| Code | Regle |
|------|-------|
| EXP-001 | Passeport expire < 6 mois = inutilisable pour demande visa |
| EXP-002 | Visa expire = blocage nouvelles reservations liees |
| EXP-003 | Vaccination expiree = blocage progression statut |
| EXP-004 | Documents expires non supprimes, visibles avec badge EXPIRE |
| EXP-005 | Renouvellement = nouvelle version (pas modification) |

---

### 8.3.9 Historique des versions

| Fonctionnalite | Description |
|----------------|-------------|
| Liste versions | Chronologique (date, auteur, taille) |
| Comparaison | Cote a cote (images/PDF) |
| Restauration | Restaurer = cree nouvelle version |
| Diff | Modifications metadata entre versions |
| Suppression | Seule la plus recente supprimable |

**Regles :**

| Code | Regle |
|------|-------|
| VER-001 | Modification fichier = nouvelle version |
| VER-002 | Anciennes versions jamais supprimees (sauf purge admin) |
| VER-003 | Nombre de versions illimite |
| VER-004 | Chiffrement AES-256 pour toutes les versions |
| VER-005 | Comparaison disponible uniquement pour PDF et images |

---

## 8.4 Recherche et navigation

**Criteres de recherche :**

| Critere | Type | Exemple |
|---------|------|---------|
| Mot-cle | Plein texte | "passeport Benali" |
| Type | Filtre enum | Tous les passeports |
| Client | Filtre FK | Documents Ahmed Benali |
| Dossier | Filtre FK | Documents dossier Visa France |
| Date creation | Plage | Janvier 2026 |
| Statut | Filtre enum | En attente validation |
| Expiration | Temporel | Expires dans 30 jours |
| Tags | Multi-select | "urgent" + "consulat" |
| Confidentiel | Boolean | Documents confidentiels |
| OCR | Filtre statut | OCR termine |

**Modes d'affichage :** Grille (miniatures), Liste (tabulaire), Detailed (carte + apercu grand format).

---
---

# MODULE 9 : Assistant IA

## 9.1 Vue d'ensemble

L'Assistant IA est le coeur intelligent d'Agence Pro. Il assiste les agents et les clients grace a 7 fonctionnalites principales : devis automatiques, resume de dossiers, reponses clients, previsions, alertes intelligentes, OCR ameliore, et traduction multilingue. Il est bati sur une architecture multi-provider (OpenAI + Anthropic) avec un systeme RAG (Retrieval-Augmented Generation) connecte a la base de connaissances voyages.

### 9.1.1 Principes fondamentaux

- **Contextuel** : acces a toutes les donnees dossier/client/agence en temps reel
- **Transparent** : source, score de confiance, modele utilise affiches
- **Securise** : chiffrement avant envoi aux providers, pas d'entrainement sur donnees client
- **Fallback** : templates predefinis si indisponibilite IA
- **Econome** : optimisation tokens, cache, mode degrade
- **Trilingue** : francais, arabe, anglais

### 9.1.2 Architecture technique

```
+-------------------------------------------------------------+
|                   INTERFACE UTILISATEUR                       |
|  +--------------+  +--------------+  +---------------+       |
|  | Chat flottant|  | Slash cmds   |  | Contextuel    |       |
|  | (widget)     |  | (/devis,etc) |  | (boutons IA)  |       |
|  +------+-------+  +------+-------+  +-------+------+       |
|         +-------------------+------------------+            |
|                            v                                 |
|              +-------------------------+                    |
|              |   ROUTEUR IA CENTRAL     |                    |
|              |   Auth / Rate / Cache    |                    |
|              |   Token tracking         |                    |
|              +---------+---------------+                    |
|                        |                                     |
|              +---------v---------------+                    |
|              |   STRATEGIE PROVIDER     |                    |
|              |   1. OpenAI GPT-4o       |                    |
|              |   2. Anthropic Claude    |                    |
|              |   3. Mode manuel         |                    |
|              +---------+---------------+                    |
|                        |                                     |
|              +---------v---------------+                    |
|              |   MOTEUR RAG             |                    |
|              |   Base connaissances     |                    |
|              |   Historique voyages     |                    |
|              |   Catalogue produits     |                    |
|              |   Politiques agence      |                    |
|              +-------------------------+                    |
+-------------------------------------------------------------+
```

### 9.1.3 Configuration des providers

| Provider | Modele | Usage | Rate limit |
|----------|--------|-------|------------|
| OpenAI | GPT-4o | Principal — toutes les fonctionnalites | 10 000 tokens/min, 500 req/min |
| Anthropic | Claude 3.5 Sonnet | Fallback — OpenAI HS ou quota depasse | 4 000 tokens/min, 200 req/min |
| Mode manuel | Templates predefinis | Degradation — les deux HS | Illimite |

**Strategie :** 1) OpenAI en premier  2) Erreur/timeout 5s = bascule Anthropic  3) Les deux echouent = mode manuel  4) Provider affiche (badge) dans chaque reponse.

### 9.1.4 Systeme RAG

**Base de connaissances indexee :**

| Source | Contenu | Mise a jour | Volume |
|--------|---------|-------------|--------|
| Catalogue produits | Forfaits, hotels, vols, transfers, visites | Quotidien | 500-2 000 |
| Politiques agence | Conditions annulation, regles internes | Mensuel | 50-100 docs |
| Historique voyages | Voyages passes, retours clients | Continu | Croissant |
| Base visas | Conditions par pays, documents requis | Mensuel | 100-200 |
| FAQ clients | Questions frequentes | Hebdomadaire | 200-500 |
| Reglementation | Lois algeriennes tourisme, visas, fiscalite | Trimestriel | 20-50 docs |
| Guides locaux | Informations destinations | Mensuel | 100-300 |

**Fonctionnement RAG :**
1. Question vectorisee (embeddings)
2. 5-10 documents les plus pertinents recuperes (similarite cosinus)
3. Contexte injecte dans le prompt avec sources
4. Reponse generee avec references
5. Sources affichees dans l'interface (cliquables)

---

## 9.2 Fonctionnalites detaillees

### 9.2.1 Devis automatique

**Declencheur :**
- Tape /devis dans le chat IA
- Clique "Generer un devis" depuis un dossier
- Decrit un voyage souhaite en langage naturel

**Donnees d'entree :**

| Champ | Type | Obligatoire | Description |
|-------|------|-------------|-------------|
| Destination | Text | Oui | Pays ou ville |
| Dates de voyage | Plage | Oui | Depart et retour |
| Nombre de voyageurs | Integer | Oui | 1-50 (au-dela = devis groupe) |
| Type de voyage | Enum | Oui | Touristique, Affaires, Hajj, Omra, Medical |
| Budget approximatif | Number | Non | Fourchette en DZD |
| Preferences | Text | Non | Niveau hotel, activites, regime |
| Particularites | Text | Non | Handicap, bebe, animal, etc. |

**Donnees de sortie (devis) :**

| Element | Description |
|---------|-------------|
| Resume du voyage | Titre, destination, dates, voyageurs |
| Detail prestations | Ligne par ligne : vol, hotel, transfert, visa, assurance, activites |
| Ventilation couts | HT, TVA (19% ou 7%), TTC par ligne |
| Total | Montant par personne + total general |
| Options | 2-3 alternatives (hotel premium, activites+) |
| Conditions | Echeancier paiement, conditions annulation |
| Validite | 30 jours par defaut |
| Sources | References au catalogue utilises |

**Regles metier :**

| Code | Regle | Detail |
|------|-------|--------|
| DEV-001 | Devis genere en < 10 secondes | Sinon mode degrade |
| DEV-002 | Prix du catalogue actuel | Pas de prix inventes |
| DEV-003 | TVA conforme regles algeriennes | 19% standard, 7% reduit |
| DEV-004 | Sauvegarde auto dans le dossier client | Historique conserve |
| DEV-005 | Conversion en facture en un clic | Transfert des lignes |
| DEV-006 | > 10 voyageurs = validation Manager | Workflow approbation |
| DEV-007 | Hajj/Omra utilisent programmes specifiques (module 3) | Integration |
| DEV-008 | Frais dossier agence toujours inclus | Transparence |
| DEV-009 | Verifiable par Agent avant envoi | Validation humaine |
| DEV-010 | Envoi email + WhatsApp avec PDF | Multi-canal |

**Validation avant envoi :** Agent verifie prix et coherence, peut modifier, valide, envoie. L'IA note la duree de verification.

**Roles autorises :** Agent, Commercial, Chef agence, Admin

---

### 9.2.2 Resume de dossier

**Declencheur :**
- Tape /resume
- Demande "Resume-moi ce dossier" en langage naturel
- Ouverture automatique d'un dossier

**Donnees analysees :**

| Source | Elements extraits |
|--------|-------------------|
| Dossier | Statut, type, dates, destination, voyageurs |
| Client | Nom, antecedents, preferences, fidelite |
| Visa | Statut, delais, documents manquants |
| Reservations | Vols, hotels, transfers — statuts |
| Factures | Montants, paiements, solde |
| Documents | Checklist, manquants, expirations |
| Historique | Etapes franchies, blocages, notes |

**Format du resume :**

```
Resume du dossier [NUMERO]

Client : [Nom] | Type : [Visa/Voyage/Omra/Hajj]
Destination : [Pays/Ville] | Dates : [Debut] - [Fin]
Statut global : [Badge couleur]

Points cles
- [3-5 points essentiels]

Etat d'avancement
- Visa : [statut + % completion]
- Reservations : [N/Total confirmees]
- Documents : [N/Total fournis]
- Facturation : [TTC / paye / restant]

Alertes et blocages
- [Problemes a resoudre]

Prochaines actions
- [3-5 actions prioritaires avec delais]

Historique recent (7j)
- [Evenements importants]
```

**Regles :**

| Code | Regle |
|------|-------|
| RES-001 | Genere en < 5 secondes |
| RES-002 | Met en avant elements critiques (blocages, impayes, expirations) |
| RES-003 | Dates et montants toujours a jour (pas de cache > 1 min) |
| RES-004 | Envoyable par email au client (version adaptee) |
| RES-005 | Bilingue selon langue du client |

**Roles autorises :** Tous les roles internes

---

### 9.2.3 Reponses clients

**Declencheur :**
- Tape /reponse
- Selectionne message client + "Repondre avec l'IA"
- Colle message client et demande une reponse

**Types de messages geres :**

| Type | Exemple | Mode de reponse |
|------|---------|-----------------|
| Demande de prix | "Combien coute un voyage a Istanbul pour 2 ?" | Devis ou estimation |
| Question dossier | "Ou en est mon visa ?" | Depuis statut reel |
| Annulation | "Je veux annuler ma reservation" | Politique applicable |
| Reclamation | "Mon hotel n'est pas celui reserve" | Empathique + escalade |
| Information | "Quels docs pour visa Schengen ?" | Base de connaissances |
| Modification | "Ajouter un transfert" | Options + impacts tarifaires |
| Generique | "Bonjour, merci" | Courtois et pro |

**Regles metier :**

| Code | Regle | Detail |
|------|-------|--------|
| REP-001 | Reponse personnalisee avec nom du client | Pas de generiques |
| REP-002 | Jamais de prix definitif sans validation Agent | Devis = estimation |
| REP-003 | Reclamations empathiques (framework LEAST) | Listen, Empathize, Apologize, Solve, Thank |
| REP-004 | Jamais d'infos internes (marges, commissions, fournisseurs) | Confidentialite |
| REP-005 | Question hors capacite = proposer transfert Agent | Escalade intelligente |
| REP-006 | Reponse dans la langue du message | Detection FR/AR/EN |
| REP-007 | Reponse sauvegardee dans historique communications | Traçabilite |
| REP-008 | Agent peut modifier avant envoi | Validation humaine |
| REP-009 | Reclamation = alerte Chef agence | Monitoring qualite |
| REP-010 | Ton pro, courtois, conforme image agence | Branding |

**Workflow :**

```
Message recu --> Detection type
    |
    +--> Question simple --> Reponse IA --> Agent verifie + envoie
    |
    +--> Reclamation --> Reponse empathique --> Agent verifie
    |                                              |
    |                                     Resolu? --> envoie
    |                                     Non? --> escalade Chef
    |
    +--> Demande complexe --> Reponse + options --> Agent applique + confirme
    |
    +--> Hors competence --> Notification --> Agent prend le relais
```

**Roles autorises :** Agent (ses clients), Commercial (ses clients), Chef agence (tous)

---

### 9.2.4 Previsions

**Declencheur :**
- Tape /previsions
- Dashboard previsions dans tableau de bord direction
- "Quel sera le CA du mois prochain ?"

**Types de previsions :**

| # | Prevision | Horizon | Methode |
|---|-----------|---------|---------|
| 1 | CA previsionnel | M+1, M+2, M+3 | Moyenne mobile ponderee + saisonnalite |
| 2 | Nombre de dossiers | M+1, M+2 | Tendance + saisonnalite |
| 3 | Taux de conversion | M+1 | Regression lineaire |
| 4 | Besoin en personnel | M+1 a M+3 | Modele de charge |
| 5 | Budget marketing | M+1 | Calcul auto |
| 6 | Flux de tresorerie | J+7, J+30, J+90 | Projection encaissements/decaissements |
| 7 | Risque d'impaye | M+1 | Score de risque client |

**Donnees de sortie :**

| Element | Description |
|---------|-------------|
| Valeur prevue | Estimee avec fourchette haute/basse |
| Tendance | Hausse / Stable / Baisse |
| Facteurs d'influence | Saison, evenement, tendance |
| Confiance | Score 0-100% |
| Recommandations | Actions suggerees |
| Graphique | Courbe prevision vs realite |

**Regles :**

| Code | Regle |
|------|-------|
| PRV-001 | Uniquement si > 6 mois de donnees historiques |
| PRV-002 | Saisonnalite prise en compte (Hajj, vacances, feries) |
| PRV-003 | Toujours affichees avec marge d'erreur |
| PRV-004 | Recalculees chaque semaine automatiquement |
| PRV-005 | Accessibles Admin et Chef agence uniquement |
| PRV-006 | Email synthese chaque 1er du mois |
| PRV-007 | Integrent evenements a venir (foires, salons, feries) |

**Roles autorises :** Chef agence, Admin, Super Admin

---

### 9.2.5 Alertes intelligentes

**Declencheur :** Analyse continue (cron job toutes les 15 min).

| # | Alerte | Analyse | Action |
|---|--------|---------|--------|
| 1 | Client a risque de churn | Inactivite > 60j + annulations | Offre fidelisation |
| 2 | Opportunite de vente | Voyage il y a 11 mois | Proposer similaire |
| 3 | Dossier en retard anormal | Delai > 2x moyenne | Escalade + investigation |
| 4 | Variation prix detectee | Prix hotels > 15% | Reservation anticipee |
| 5 | Document bientot expire | Passeport < 6 mois | Rappel renouvellement |
| 6 | Satisfaction en baisse | Notes en baisse + reclamations | Action corrective |
| 7 | Charge desequilibree | Agent 2x plus de dossiers | Redistribution |
| 8 | Reglementation changee | Mise a jour base connaissance | Notification Admin |
| 9 | Pic d'activite prevu | Forte charge (saison Hajj) | Preparation anticipee |
| 10 | Fraude potentielle | Patterns inhabituels | Alerte compliance |

**Regles :**

| Code | Regle |
|------|-------|
| ALT-001 | Niveaux : INFO, WARNING, CRITICAL |
| ALT-002 | CRITICAL = push + email + SMS |
| ALT-003 | WARNING = in-app + email |
| ALT-004 | INFO = tableau de bord uniquement |
| ALT-005 | Historique conserve 12 mois |
| ALT-006 | Acusse de reception possible |
| ALT-007 | Non traitees > 48h = re-escalade |
| ALT-008 | Apprentissage auto ameliore pertinence |
| ALT-009 | Filtrees par role |
| ALT-010 | Max 10 alertes actives par agent |

---

### 9.2.6 OCR ameliore

**Declencheur :** En complement du module Documents & OCR (Module 8), l'IA ameliore l'extraction par interpretation contextuelle.

| Fonctionnalite | Description | Exemple |
|----------------|-------------|---------|
| Interpretation contextuelle | Contexte du dossier corrige erreurs OCR | "FRANCK" corrige en "FRANCE" si dossier visa France |
| Validation intelligente | Coherence des donnees extraites | Date naissance < date delivrance |
| Remplissage auto | Pre-remplissage formulaires | Scan passeport = formulaire visa pre-rempli |
| Detection anomalies | Incoherences suspectes | Numero passeport != format pays nationalite |
| Classification avancee | Type determine meme non declare | Document = Attestation emploi si contenu correspond |

**Regles :**

| Code | Regle |
|------|-------|
| OIA-001 | Pas de remplacement validation humaine (passeport, CNI) |
| OIA-002 | Score IA affiche a cote score OCR |
| OIA-003 | Corrections tracees (originale + corrigee + raison) |
| OIA-004 | Amelioration appliquee uniquement si OCR < 80% |
| OIA-005 | Modeles entraines sur documents de l'agence (fine-tuning futur) |

---

### 9.2.7 Traduction AR/FR/EN

**Declencheur :**
- Tape /traduire
- Selection texte + clic droit "Traduire"
- Changement auto de langue si client arabophone

**Langues :**

| Langue | Code | Usage |
|--------|------|-------|
| Francais | FR | Langue principale agence |
| Arabe | AR | Clients algeriens |
| Anglais | EN | Clients internationaux |

**Fonctionnalites :**

| Fonctionnalite | Description | Exemple |
|----------------|-------------|---------|
| Traduction chat | Temps reel des messages client | Message AR > FR auto |
| Traduction documents | Documents entiers | Contrat FR > AR+FR bilingue |
| Traduction templates | Templates notification | Email traduit auto |
| Detection langue | Auto-detection du message | Client AR = reponse AR |
| Garde-fous culturels | Adaptation expressions | Pas de traduction litterale proverbes |
| Format bilingue | FR/AR cote a cote | Contrat deux versions meme page |

**Regles :**

| Code | Regle |
|------|-------|
| TRD-001 | Termes techniques en terminologie officielle |
| TRD-002 | Noms propres jamais traduits |
| TRD-003 | Montants/dates en format local (DD/MM/AAAA, DZD) |
| TRD-004 | Contrats bilingues : "Version francaise fait foi en cas de divergence" |
| TRD-005 | Traduction en option, jamais sans consentement |
| TRD-006 | Arabe = police + alignement RTL |
| TRD-007 | Qualite evaluee par utilisateurs (+1/-1) |
| TRD-008 | Traductions frequentes mises en cache |

**Roles autorises :** Tous les roles

---

## 9.3 Interface IA

### 9.3.1 Chat flottant

| Element | Description |
|---------|-------------|
| Position | Coin inferieur droit, deplacable |
| Taille | 380x550 px, redimensionnable |
| Etats | Reduce (bulle), Developpe (panneau), Plein ecran |
| Historique | 30 derniers echanges dans la session |
| Saisie | Zone texte avec auto-complete slash commands |
| Pieces jointes | Attacher document pour analyse IA |
| Vocal | Bouton micro (optionnel) |

### 9.3.2 Commandes slash

| Commande | Description | Exemple |
|----------|-------------|---------|
| /devis | Generer un devis | /devis Istanbul 2 pers. 15-20 mars |
| /resume | Resume du dossier courant | /resume |
| /reponse | Repondre au client | /reponse (apres selection message) |
| /previsions | Voir les previsions | /previsions CA mois prochain |
| /alertes | Voir alertes IA | /alertes |
| /traduire | Traduire un texte | /traduire ar (puis coller texte) |
| /analyser | Analyser un document | /analyser (apres upload) |
| /comparer | Comparer deux elements | /comparer devis1 devis2 |
| /historique | Historique interactions IA | /historique 7j |
| /mode | Changer mode | /mode expert ou /mode simple |
| /feedback | Retour sur reponse | /feedback (apres reponse IA) |
| /aide | Aide + liste commandes | /aide devis |

### 9.3.3 Integration contextuelle

| Contexte | Action IA | Affichage |
|----------|-----------|-----------|
| Page dossier | Resume auto + alertes | Bouton "Resume IA" |
| Page client | Historique + recommandations | Bouton "Suggestions IA" |
| Page facture | Analyse paiements | Bouton "Analyse IA" |
| Message client | Reponse suggerée | Bouton "Repondre avec l'IA" |
| Page visa | Checklist + statut | Bouton "Etat dossier IA" |
| Page reservation | Alternatives | Bouton "Voir alternatives" |
| Tableau de bord | Previsions + alertes | Widget "IA Insights" |

---

## 9.4 Securite et gouvernance IA

### 9.4.1 Tracking des tokens

| Metrique | Description | Seuil alerte |
|----------|-------------|--------------|
| Tokens/jour | Total journalier | > 100 000 |
| Tokens/mois | Total mensuel | > 2 000 000 |
| Couts | Estimation USD | > 500 USD/mois |
| Requetes/min | Nombre de requetes | > 100/min |
| Taux d'erreur | Pourcentage echecs | > 5% |
| Latence | Temps reponse moyen | > 5 000 ms |
| Cache hit rate | Reponses cachees | Objectif > 30% |

### 9.4.2 Securite des donnees

| Regle | Description |
|-------|-------------|
| SEC-IA-001 | Pas de donnee personnelle envoyee sans chiffrement |
| SEC-IA-002 | Conversations non utilisees pour entrainement |
| SEC-IA-003 | Cles API dans vault securise |
| SEC-IA-004 | Reponses cachees 24h pour questions identiques |
| SEC-IA-005 | Journaux conserves 90 jours puis purges |
| SEC-IA-006 | Acces logs restreint Admin + Super Admin |
| SEC-IA-007 | Audit possible par periode/utilisateur |
| SEC-IA-008 | Prompts stockes cote serveur, jamais exposes |

### 9.4.3 Mode degrade

**Declencheur :** Les deux providers indisponibles ou quota depasse.

| Fonctionnalite | Comportement degrade | Impact |
|-----------------|---------------------|--------|
| Devis | Modele pre-rempli produits courants | Prix verifies manuellement |
| Resume | Extraction auto donnees (pas d'analyse IA) | Moins de conseils |
| Reponses | Templates predefinis par type | Moins de personnalisation |
| Previsions | Moyennes historiques simples | Moins de precision |
| Alertes | Regles-metier pures | Pas d'alertes anticipees |
| OCR ameliore | OCR standard | Taux erreur + eleve |
| Traduction | Modeles hors-ligne | Qualite moindre |

**Notification degrade :**
- Bandeau jaune : "Mode degrade — IA temporairement indisponible"
- Email Admin avec estimation duree panne
- Retente auto toutes les 15 minutes

---

## 9.5 Monitoring et amelioration continue

### 9.5.1 Metriques de qualite

| Metrique | Description | Objectif |
|----------|-------------|----------|
| Satisfaction | Score +1/-1 par reponse | > 85% positif |
| Utilisation | % agents utilisant IA >= 1x/jour | > 70% |
| Temps economise | Temps gagne par interaction | 5 min/interaction |
| Precision devis | Ecart devis IA vs prix reel | < 5% |
| Taux modification | % reponses modifiees par Agent | < 30% |
| Escalades | % questions necessitant humain | Suivi tendance |
| Latence | Temps reponse moyen | < 3 secondes |

### 9.5.2 Boucle d'apprentissage

1. **Collecte** : chaque interaction IA + feedback journalise
2. **Analyse** : weekly review patterns echec/succes
3. **Optimisation** : ajustement prompts, RAG, seuils
4. **Deploiement** : mise a jour modeles et regles
5. **Mesure** : verification impact changements

**Roles monitoring :** Admin, Super Admin
**Roles utilisation IA :** Tous

---

*Fin du document — Modules 7, 8 et 9*

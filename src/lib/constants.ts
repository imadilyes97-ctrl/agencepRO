export const APP_NAME = "Agence Pro";
export const APP_DESCRIPTION = "SaaS de gestion pour agences de voyage au Maghreb";
export const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

/** Numéro de séquence par préfixe pour la génération de références. */
export const REF_PREFIXES = {
  DOSSIER: "D",
  CLIENT: "C",
  FACTURE: "FAC",
  PAIEMENT: "PAY",
  DEPENSE: "DEP",
  AVOIR: "AVR",
  PROGRAMME: "P",
  FORFAIT: "FT",
  GROUPE: "G",
} as const;

/** Limites de pagination. */
export const PAGE_SIZE = 25;
export const PAGE_SIZE_OPTIONS = [10, 25, 50, 100] as const;

/** Limites upload (bytes). */
export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 Mo
export const MAX_FILES_PER_DOSSIER = 5;

/** Formats autorisés pour l'upload. */
export const ALLOWED_FILE_TYPES = [
  "application/pdf",
  "image/jpeg",
  "image/png",
  "image/webp",
] as const;

/** TVA Algérie. */
export const TVA_TAUX_STANDARD = 19;
export const TVA_TAUX_REDUIT = 7;

/** Rôles. */
export const ROLES = {
  SUPER_ADMIN: "SUPER_ADMIN",
  ADMIN: "ADMIN",
  MANAGER: "MANAGER",
  AGENT: "AGENT",
  COMPTABLE: "COMPTABLE",
  GUIDE: "GUIDE",
  COMMERCIAL: "COMMERCIAL",
  CLIENT: "CLIENT",
} as const;

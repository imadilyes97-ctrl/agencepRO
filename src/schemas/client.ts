import { z } from "zod";

// ── Constantes de validation ──────────────────────────────────

const TELEPHONE_REGEX = /^\+?213[0-9]{9}$/;
const TELEPHONE_MESSAGE = "Le telephone doit etre au format +213XXXXXXXXX";

// ── Schema de creation de client ──────────────────────────────

export const CreateClientSchema = z.object({
  civilite: z.enum(["MONSIEUR", "MADAME", "MADEMOISELLE"]).optional(),

  nom: z
    .string()
    .min(2, "Le nom doit contenir au moins 2 caracteres")
    .max(100, "Le nom ne doit pas depasser 100 caracteres")
    .transform((v) => v.trim().toUpperCase()),

  prenom: z
    .string()
    .min(1, "Le prenom est obligatoire")
    .max(100, "Le prenom ne doit pas depasser 100 caracteres")
    .transform((v) => v.trim().charAt(0).toUpperCase() + v.trim().slice(1).toLowerCase()),

  telephonePrincipal: z
    .string()
    .min(1, "Le telephone principal est obligatoire")
    .regex(TELEPHONE_REGEX, TELEPHONE_MESSAGE),

  telephoneSecondaire: z
    .string()
    .regex(TELEPHONE_REGEX, TELEPHONE_MESSAGE)
    .optional()
    .or(z.literal("")),

  email: z
    .string()
    .email("Adresse email invalide")
    .optional()
    .or(z.literal("")),

  dateNaissance: z
    .string()
    .optional()
    .or(z.date())
    .refine(
      (val) => {
        if (!val) return true;
        const date = new Date(val);
        const now = new Date();
        const age = now.getFullYear() - date.getFullYear();
        return age >= 0 && age <= 120;
      },
      { message: "La date de naissance n'est pas valide" },
    ),

  lieuNaissance: z.string().max(200).optional().or(z.literal("")),

  sexe: z.enum(["HOMME", "FEMME"]).optional(),

  nationalite: z
    .string()
    .min(2, "La nationalite est obligatoire")
    .max(5, "Code nationalite invalide")
    .default("DZ"),

  adresseComplete: z.string().max(500).optional().or(z.literal("")),

  wilaya: z.string().max(100).optional().or(z.literal("")),

  commune: z.string().max(100).optional().or(z.literal("")),

  codePostal: z.string().max(10).optional().or(z.literal("")),

  sourceAcquisition: z
    .enum(["BOCA_BOUCHE", "INTERNET", "RECOMMANDATION", "SALON", "PARTENAIRE", "AUTRE"])
    .optional(),

  notes: z.string().max(2000).optional().or(z.literal("")),

  tags: z.array(z.string()).optional().default([]),

  segments: z.array(z.string()).optional().default([]),

  assigneA: z.string().optional().or(z.literal("")),

  // Documents d'identite
  cniNumero: z.string().max(50).optional().or(z.literal("")),
  cniDateEmission: z.string().optional().or(z.date()).optional(),
  cniDateExpiration: z.string().optional().or(z.date()).optional(),
  cniLieuEmission: z.string().max(200).optional().or(z.literal("")),

  passeportNumero: z.string().max(50).optional().or(z.literal("")),
  passeportDateEmission: z.string().optional().or(z.date()).optional(),
  passeportDateExpiration: z.string().optional().or(z.date()).optional(),
  passeportLieuEmission: z.string().max(200).optional().or(z.literal("")),
  passeportNationalite: z.string().max(100).optional().or(z.literal("")),

  // Contact d'urgence
  contactUrgenceNom: z.string().max(200).optional().or(z.literal("")),
  contactUrgenceLien: z
    .enum(["EPOUX", "PARENT", "FRERE_SOEUR", "AMI", "AUTRE"])
    .optional(),
  contactUrgenceTelephone: z.string().max(30).optional().or(z.literal("")),
  contactUrgenceEmail: z.string().email().optional().or(z.literal("")),

  // Preferences
  prefAlimentaires: z.array(z.string()).optional().default([]),
  prefChambre: z
    .enum(["SINGLE", "DOUBLE", "TWIN", "FAMILY", "SUITE"])
    .optional(),
  prefNiveauConfort: z
    .enum(["ECONOMIQUE", "STANDARD", "CONFORT", "LUXE", "PRESTIGE"])
    .optional(),
  prefBudgetMin: z.number().min(0).optional(),
  prefBudgetMax: z.number().min(0).optional(),
  prefLangue: z.array(z.string()).optional().default([]),
  notesPreferences: z.string().max(2000).optional().or(z.literal("")),
});

export type CreateClientInput = z.infer<typeof CreateClientSchema>;

// ── Schema de mise a jour (tout est optionnel) ────────────────

export const UpdateClientSchema = CreateClientSchema.partial().extend({
  statut: z.enum(["ACTIF", "INACTIF", "BLOQUE", "BLACKLISTE"]).optional(),
});

export type UpdateClientInput = z.infer<typeof UpdateClientSchema>;

// ── Schema de filtres de recherche ────────────────────────────

export const ClientFilterSchema = z.object({
  query: z.string().optional().default(""),
  statut: z
    .enum(["ACTIF", "INACTIF", "BLOQUE", "BLACKLISTE"])
    .optional(),
  sourceAcquisition: z
    .enum(["BOCA_BOUCHE", "INTERNET", "RECOMMANDATION", "SALON", "PARTENAIRE", "AUTRE"])
    .optional(),
  dateFrom: z.string().optional().or(z.date()).optional(),
  dateTo: z.string().optional().or(z.date()).optional(),
  wilaya: z.string().optional(),
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(25),
  orderBy: z
    .enum(["nom", "prenom", "createdAt", "updatedAt", "nombreVoyages", "montantTotalDepense"])
    .default("createdAt"),
  orderDir: z.enum(["asc", "desc"]).default("desc"),
});

export type ClientFilterInput = z.infer<typeof ClientFilterSchema>;

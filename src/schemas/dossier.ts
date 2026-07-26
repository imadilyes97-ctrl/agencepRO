import { z } from "zod";

// ── Enums ──────────────────────────────────────────────────────

export const DossierStatutEnum = z.enum([
  "PROSPECT",
  "DEVIS",
  "CONFIRME",
  "EN_COURS",
  "EN_ATTENTE_DOCUMENTS",
  "DOSSIER_COMPLET",
  "SOUMIS",
  "EN_COURS_TRAITEMENT",
  "APPROUVE",
  "REFUSE",
  "ENVOYE",
  "TERMINE",
  "PROBLEME",
  "RESOLU",
  "ANNULE",
]);

export const TypeDossierEnum = z.enum(["OMRA", "HAJJ", "TOURISME", "VISA", "CRUISE", "GROUPE"]);

// ── Display labels (FR) ────────────────────────────────────────

export const STATUT_LABELS: Record<z.infer<typeof DossierStatutEnum>, string> = {
  PROSPECT: "Prospect",
  DEVIS: "Devis",
  CONFIRME: "Confirmé",
  EN_COURS: "En cours",
  EN_ATTENTE_DOCUMENTS: "En attente de documents",
  DOSSIER_COMPLET: "Dossier complet",
  SOUMIS: "Soumis",
  EN_COURS_TRAITEMENT: "En cours de traitement",
  APPROUVE: "Approuvé",
  REFUSE: "Refusé",
  ENVOYE: "Envoyé",
  TERMINE: "Terminé",
  PROBLEME: "Problème",
  RESOLU: "Résolu",
  ANNULE: "Annulé",
};

export const TYPE_DOSSIER_LABELS: Record<z.infer<typeof TypeDossierEnum>, string> = {
  OMRA: "Omra",
  HAJJ: "Hajj",
  TOURISME: "Tourisme",
  VISA: "Visa",
  CRUISE: "Cruise",
  GROUPE: "Groupe",
};

// ── Status transition rules ────────────────────────────────────

export const STATUT_TRANSITIONS: Record<
  z.infer<typeof DossierStatutEnum>,
  z.infer<typeof DossierStatutEnum>[]
> = {
  PROSPECT: ["DEVIS", "ANNULE", "PROBLEME"],
  DEVIS: ["CONFIRME", "ANNULE", "PROBLEME"],
  CONFIRME: ["EN_COURS", "ANNULE", "PROBLEME"],
  EN_COURS: ["EN_ATTENTE_DOCUMENTS", "ANNULE", "PROBLEME"],
  EN_ATTENTE_DOCUMENTS: ["DOSSIER_COMPLET", "ANNULE", "PROBLEME"],
  DOSSIER_COMPLET: ["SOUMIS", "ANNULE", "PROBLEME"],
  SOUMIS: ["EN_COURS_TRAITEMENT", "ANNULE", "PROBLEME"],
  EN_COURS_TRAITEMENT: ["APPROUVE", "REFUSE", "PROBLEME"],
  APPROUVE: ["ENVOYE", "ANNULE", "PROBLEME"],
  REFUSE: ["PROSPECT", "ANNULE", "PROBLEME"],
  ENVOYE: ["TERMINE", "PROBLEME"],
  TERMINE: [], // Terminal — no transitions out
  PROBLEME: ["RESOLU", "ANNULE"],
  RESOLU: [], // Back to previous state — handled via manual re-transition
  ANNULE: ["PROSPECT", "PROBLEME"], // Can reopen from annule
};

// ── Status color mapping ───────────────────────────────────────

export const STATUT_COLORS: Record<
  z.infer<typeof DossierStatutEnum>,
  { bg: string; text: string; ring: string }
> = {
  PROSPECT: { bg: "bg-blue-100", text: "text-blue-700", ring: "ring-blue-500/20" },
  DEVIS: { bg: "bg-indigo-100", text: "text-indigo-700", ring: "ring-indigo-500/20" },
  CONFIRME: { bg: "bg-purple-100", text: "text-purple-700", ring: "ring-purple-500/20" },
  EN_COURS: { bg: "bg-amber-100", text: "text-amber-700", ring: "ring-amber-500/20" },
  EN_ATTENTE_DOCUMENTS: { bg: "bg-orange-100", text: "text-orange-700", ring: "ring-orange-500/20" },
  DOSSIER_COMPLET: { bg: "bg-teal-100", text: "text-teal-700", ring: "ring-teal-500/20" },
  SOUMIS: { bg: "bg-cyan-100", text: "text-cyan-700", ring: "ring-cyan-500/20" },
  EN_COURS_TRAITEMENT: { bg: "bg-sky-100", text: "text-sky-700", ring: "ring-sky-500/20" },
  APPROUVE: { bg: "bg-emerald-100", text: "text-emerald-700", ring: "ring-emerald-500/20" },
  REFUSE: { bg: "bg-red-100", text: "text-red-700", ring: "ring-red-500/20" },
  ENVOYE: { bg: "bg-violet-100", text: "text-violet-700", ring: "ring-violet-500/20" },
  TERMINE: { bg: "bg-green-100", text: "text-green-700", ring: "ring-green-500/20" },
  PROBLEME: { bg: "bg-red-100", text: "text-red-700", ring: "ring-red-500/20" },
  RESOLU: { bg: "bg-lime-100", text: "text-lime-700", ring: "ring-lime-500/20" },
  ANNULE: { bg: "bg-gray-100", text: "text-gray-500", ring: "ring-gray-400/20" },
};

// ── Create Dossier Schema ──────────────────────────────────────

export const CreateDossierSchema = z
  .object({
    clientId: z.string().min(1, "Le client est requis"),
    intitule: z
      .string()
      .min(3, "L'intitulé doit contenir au moins 3 caractères")
      .max(200, "L'intitulé ne peut pas dépasser 200 caractères"),
    destination: z
      .string()
      .min(2, "La destination est requise")
      .max(100, "La destination ne peut pas dépasser 100 caractères"),
    typeDossier: TypeDossierEnum,
    dateDepart: z.coerce.date().refine((d) => d > new Date(), {
      message: "La date de départ doit être dans le futur",
    }),
    dateRetour: z.coerce.date().optional(),
    nbAdultes: z.coerce.number().int().min(1, "Au moins 1 adulte requis").max(100),
    nbEnfants: z.coerce.number().int().min(0).max(50).default(0),
    nbBebes: z.coerce.number().int().min(0).max(20).default(0),
    montantTotal: z.coerce.number().min(0, "Le montant total doit être positif").default(0),
    devise: z.string().min(3).max(3).default("DZD"),
    groupeId: z.string().optional(),
    programmeId: z.string().optional(),
    forfaitId: z.string().optional(),
    notes: z.string().max(5000).optional(),
    tags: z.array(z.string()).default([]),
  })
  .refine(
    (data) => {
      if (data.dateRetour && data.dateDepart) {
        return data.dateRetour > data.dateDepart;
      }
      return true;
    },
    {
      message: "La date de retour doit être après la date de départ",
      path: ["dateRetour"],
    },
  );

export type CreateDossierInput = z.infer<typeof CreateDossierSchema>;

// ── Update Dossier Schema ──────────────────────────────────────

export const UpdateDossierSchema = z.object({
  intitule: z.string().min(3).max(200).optional(),
  destination: z.string().min(2).max(100).optional(),
  dateDepart: z.coerce.date().optional(),
  dateRetour: z.coerce.date().optional(),
  nbAdultes: z.coerce.number().int().min(1).max(100).optional(),
  nbEnfants: z.coerce.number().int().min(0).max(50).optional(),
  nbBebes: z.coerce.number().int().min(0).max(20).optional(),
  montantTotal: z.coerce.number().min(0).optional(),
  montantPaye: z.coerce.number().min(0).optional(),
  devise: z.string().length(3).optional(),
  groupeId: z.string().optional().nullable(),
  programmeId: z.string().optional().nullable(),
  forfaitId: z.string().optional().nullable(),
  notes: z.string().max(5000).optional(),
  tags: z.array(z.string()).optional(),
});

export type UpdateDossierInput = z.infer<typeof UpdateDossierSchema>;

// ── Change Statut Schema ───────────────────────────────────────

export const UpdateDossierStatutSchema = z.object({
  statut: DossierStatutEnum,
  notes: z.string().max(2000).optional(),
});

export type UpdateDossierStatutInput = z.infer<typeof UpdateDossierStatutSchema>;

// ── Filter Schema ──────────────────────────────────────────────

export const DossierFilterSchema = z.object({
  statut: DossierStatutEnum.optional(),
  typeDossier: TypeDossierEnum.optional(),
  clientId: z.string().optional(),
  dateFrom: z.coerce.date().optional(),
  dateTo: z.coerce.date().optional(),
  query: z.string().max(200).optional(),
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(25),
});

export type DossierFilters = z.infer<typeof DossierFilterSchema>;

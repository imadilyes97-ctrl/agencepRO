/**
 * Shared TypeScript types for Agence Pro.
 * Enums come from Prisma — these are utility/helper types.
 */

import type {
  Agence,
  User,
  Client,
  Dossier,
  Facture,
  Paiement,
  Document,
  Visa,
  Vol,
  Hotel,
  Chambre,
  Programme,
  Forfait,
  Groupe,
  RoleUser,
} from "@prisma/client";

// ── API Response Envelope ──────────────────────────────────────

export type ApiResponse<T> =
  | { success: true; data: T; meta?: PaginationMeta }
  | { success: false; error: string; code: string; details?: Record<string, string[]> };

export interface PaginationMeta {
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// ── Auth ───────────────────────────────────────────────────────

export interface SessionUser {
  id: string;
  email: string;
  nom: string;
  prenom: string;
  role: RoleUser;
  agenceId: string;
}

// ── Dashboard KPIs ─────────────────────────────────────────────

export interface DashboardKpi {
  value: number;
  trend: "up" | "down" | "flat";
  changePercent: number;
}

export interface DashboardStats {
  caDuMois: DashboardKpi;
  dossiersActifs: DashboardKpi;
  clientsActifs: DashboardKpi;
  impayes: DashboardKpi;
}

// ── Recherche & Filtres ────────────────────────────────────────

export interface SearchFilters {
  query?: string;
  statut?: string;
  dateFrom?: string;
  dateTo?: string;
  page?: number;
  pageSize?: number;
  orderBy?: string;
  orderDir?: "asc" | "desc";
}

// ── Relations courantes (pour les formulaires) ─────────────────

export type ClientWithDossiers = Client & { dossiers: Dossier[] };
export type DossierWithClient = Dossier & { client: Client };
export type DossierComplet = Dossier & {
  client: Client;
  visa: Visa | null;
  vol: Vol | null;
  documents: Document[];
  groupe: Groupe | null;
  programme: Programme | null;
  forfait: Forfait | null;
};
export type FactureComplete = Facture & {
  client: Client;
  paiements: Paiement[];
};
export type ClientComplet = Client & {
  dossiers: Dossier[];
  factures: Facture[];
  documents: Document[];
};

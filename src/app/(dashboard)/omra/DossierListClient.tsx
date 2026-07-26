"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { DossierCard } from "@/components/omra/DossierCard";
import { StatutBadge } from "@/components/omra/StatutBadge";
import { STATUT_LABELS, STATUT_TRANSITIONS, DossierStatutEnum } from "@/schemas/dossier";
import type { z } from "zod";
import type { DossierStatut, TypeDossier } from "@prisma/client";
import {
  Search,
  Plus,
  Filter,
  X,
  LayoutGrid,
  List,
  ChevronLeft,
  ChevronRight,
  Loader2,
} from "lucide-react";

interface SerializedDossier {
  id: string;
  reference: string;
  intitule: string | null;
  destination: string;
  typeDossier: TypeDossier;
  statut: DossierStatut;
  dateDepart: string;
  dateRetour: string | null;
  nbAdultes: number;
  nbEnfants: number;
  nbBebes: number;
  montantTotal: number;
  montantPaye: number;
  montantRestant: number;
  devise: string;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
  client: {
    id: string;
    nom: string;
    prenom: string;
    telephonePrincipal: string;
    email: string | null;
  };
}

interface PaginationMeta {
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

interface DossierListClientProps {
  initialDossiers: SerializedDossier[];
  meta: PaginationMeta;
  initialFilters: {
    statut?: string;
    typeDossier?: string;
    query?: string;
  };
}

const TYPE_DOSSIER_OPTIONS = [
  { value: "", label: "Tous les types" },
  { value: "OMRA", label: "Omra" },
  { value: "HAJJ", label: "Hajj" },
  { value: "TOURISME", label: "Tourisme" },
] as const;

const STATUT_OPTIONS = Object.entries(STATUT_LABELS).map(([value, label]) => ({
  value,
  label,
}));

// ── Kanban columns ─────────────────────────────────────────────

const KANBAN_COLUMNS: { statuts: z.infer<typeof DossierStatutEnum>[]; title: string; color: string }[] = [
  {
    statuts: ["PROSPECT", "DEVIS"],
    title: "Prospection",
    color: "border-blue-400",
  },
  {
    statuts: ["CONFIRME", "EN_COURS", "EN_ATTENTE_DOCUMENTS", "DOSSIER_COMPLET"],
    title: "Preparation",
    color: "border-amber-400",
  },
  {
    statuts: ["SOUMIS", "EN_COURS_TRAITEMENT"],
    title: "Traitement",
    color: "border-sky-400",
  },
  {
    statuts: ["APPROUVE", "ENVOYE", "TERMINE"],
    title: "Finalisation",
    color: "border-emerald-400",
  },
  {
    statuts: ["REFUSE", "PROBLEME", "RESOLU", "ANNULE"],
    title: "Exceptions",
    color: "border-red-400",
  },
];

// ── Component ──────────────────────────────────────────────────

export function DossierListClient({
  initialDossiers,
  meta,
  initialFilters,
}: DossierListClientProps) {
  const router = useRouter();
  const [viewMode, setViewMode] = useState<"table" | "grid" | "kanban">("grid");
  const [searchQuery, setSearchQuery] = useState(initialFilters.query ?? "");
  const [isSearching, setIsSearching] = useState(false);

  const buildQueryString = useCallback(
    (overrides: Record<string, string | undefined>) => {
      const params = new URLSearchParams();
      if (overrides.statut) params.set("statut", overrides.statut);
      if (overrides.typeDossier) params.set("typeDossier", overrides.typeDossier);
      if (overrides.query) params.set("query", overrides.query);
      if (overrides.page) params.set("page", overrides.page);
      return params.toString();
    },
    [],
  );

  const navigateWithFilters = useCallback(
    (overrides: Record<string, string | undefined>) => {
      const qs = buildQueryString({
        statut: overrides.statut ?? initialFilters.statut,
        typeDossier: overrides.typeDossier ?? initialFilters.typeDossier,
        query: overrides.query ?? initialFilters.query,
        page: overrides.page ?? "1",
      });
      router.push(`/omra${qs ? `?${qs}` : ""}`);
    },
    [router, buildQueryString, initialFilters],
  );

  const handleSearch = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      setIsSearching(true);
      navigateWithFilters({ query: searchQuery || undefined, page: "1" });
      setIsSearching(false);
    },
    [searchQuery, navigateWithFilters],
  );

  const handleStatutFilter = useCallback(
    (statut: string) => {
      navigateWithFilters({
        statut: statut || undefined,
        page: "1",
      });
    },
    [navigateWithFilters],
  );

  const handleTypeFilter = useCallback(
    (typeDossier: string) => {
      navigateWithFilters({
        typeDossier: typeDossier || undefined,
        page: "1",
      });
    },
    [navigateWithFilters],
  );

  const clearAllFilters = useCallback(() => {
    router.push("/omra");
  }, [router]);

  const hasActiveFilters =
    !!initialFilters.statut || !!initialFilters.typeDossier || !!initialFilters.query;

  // Group dossiers by statut for kanban
  const dossiersByStatut = new Map<string, SerializedDossier[]>();
  for (const d of initialDossiers) {
    const list = dossiersByStatut.get(d.statut) ?? [];
    list.push(d);
    dossiersByStatut.set(d.statut, list);
  }

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-[family-name:var(--font-heading)] text-2xl font-bold text-[var(--text-primary)]">
            Dossiers Omra / Hajj
          </h1>
          <p className="mt-1 text-sm text-[var(--text-muted)]">
            {meta.total} dossier{meta.total !== 1 ? "s" : ""} au total
          </p>
        </div>
        <button
          type="button"
          className={cn(
            "inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold",
            "bg-[var(--color-primary-500)] text-white",
            "hover:bg-[var(--color-primary-600)] transition-colors",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary-500)] focus-visible:ring-offset-2",
          )}
        >
          <Plus className="h-4 w-4" />
          Nouveau dossier
        </button>
      </div>

      {/* Filters bar */}
      <div className="flex flex-col gap-3 rounded-xl border border-[var(--border-primary)] bg-[var(--bg-card)] p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          {/* Search */}
          <form onSubmit={handleSearch} className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--text-muted)]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Rechercher par reference, client, destination..."
              className={cn(
                "w-full rounded-lg border border-[var(--border-primary)] bg-[var(--bg-primary)]",
                "py-2 pl-10 pr-4 text-sm text-[var(--text-primary)]",
                "placeholder:text-[var(--text-muted)]",
                "focus:border-[var(--color-primary-500)] focus:outline-none focus:ring-1 focus:ring-[var(--color-primary-500)]",
              )}
            />
            {isSearching && (
              <Loader2 className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-[var(--text-muted)]" />
            )}
          </form>

          {/* View mode toggle */}
          <div className="flex items-center rounded-lg border border-[var(--border-primary)] bg-[var(--bg-primary)] p-0.5">
            {[
              { mode: "grid" as const, icon: LayoutGrid, label: "Grille" },
              { mode: "table" as const, icon: List, label: "Tableau" },
              { mode: "kanban" as const, icon: Filter, label: "Kanban" },
            ].map(({ mode, icon: Icon, label }) => (
              <button
                key={mode}
                type="button"
                onClick={() => setViewMode(mode)}
                title={label}
                className={cn(
                  "rounded-md p-2 transition-colors",
                  viewMode === mode
                    ? "bg-[var(--color-primary-500)] text-white"
                    : "text-[var(--text-muted)] hover:bg-[var(--bg-secondary)]",
                )}
              >
                <Icon className="h-4 w-4" />
              </button>
            ))}
          </div>
        </div>

        {/* Type + Statut filter chips */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-medium text-[var(--text-muted)]">Type :</span>
          {TYPE_DOSSIER_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => handleTypeFilter(opt.value)}
              className={cn(
                "rounded-full px-3 py-1 text-xs font-medium transition-colors",
                (initialFilters.typeDossier ?? "") === opt.value
                  ? "bg-[var(--color-primary-500)] text-white"
                  : "bg-[var(--bg-secondary)] text-[var(--text-secondary)] hover:bg-[var(--color-primary-50)]",
              )}
            >
              {opt.label}
            </button>
          ))}

          <span className="mx-1 h-4 w-px bg-[var(--border-primary)]" />

          <span className="text-xs font-medium text-[var(--text-muted)]">Statut :</span>
          <select
            value={initialFilters.statut ?? ""}
            onChange={(e) => handleStatutFilter(e.target.value)}
            className={cn(
              "rounded-lg border border-[var(--border-primary)] bg-[var(--bg-primary)]",
              "px-3 py-1.5 text-xs font-medium text-[var(--text-primary)]",
              "focus:border-[var(--color-primary-500)] focus:outline-none focus:ring-1 focus:ring-[var(--color-primary-500)]",
            )}
          >
            <option value="">Tous les statuts</option>
            {STATUT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>

          {hasActiveFilters && (
            <button
              type="button"
              onClick={clearAllFilters}
              className="inline-flex items-center gap-1 rounded-full bg-red-50 px-2.5 py-1 text-xs font-medium text-red-600 hover:bg-red-100"
            >
              <X className="h-3 w-3" />
              Effacer
            </button>
          )}
        </div>
      </div>

      {/* Content area */}
      {initialDossiers.length === 0 ? (
        <div className="rounded-xl border border-[var(--border-primary)] bg-[var(--bg-card)] py-16 text-center">
          <Filter className="mx-auto h-10 w-10 text-[var(--text-muted)] opacity-40" />
          <p className="mt-3 font-[family-name:var(--font-heading)] text-lg font-semibold text-[var(--text-primary)]">
            Aucun dossier trouve
          </p>
          <p className="mt-1 text-sm text-[var(--text-muted)]">
            {hasActiveFilters
              ? "Essayez de modifier vos filtres ou créez un nouveau dossier."
              : "Commencez par creer votre premier dossier Omra ou Hajj."}
          </p>
        </div>
      ) : viewMode === "kanban" ? (
        /* ── Kanban View ── */
        <div className="flex gap-4 overflow-x-auto pb-4">
          {KANBAN_COLUMNS.map((col) => {
            const colDossiers = col.statuts.flatMap(
              (s) => dossiersByStatut.get(s) ?? [],
            );
            return (
              <div key={col.title} className="min-w-[300px] flex-1">
                <div
                  className={cn(
                    "mb-3 border-t-2 bg-[var(--bg-card)] px-3 py-2",
                    col.color,
                  )}
                >
                  <h3 className="font-[family-name:var(--font-heading)] text-sm font-semibold text-[var(--text-primary)]">
                    {col.title}
                  </h3>
                  <p className="text-xs text-[var(--text-muted)]">
                    {colDossiers.length} dossier{colDossiers.length !== 1 ? "s" : ""}
                  </p>
                </div>
                <div className="space-y-2">
                  {colDossiers.map((d) => (
                    <DossierCard key={d.id} {...d} className="hover:shadow-sm" />
                  ))}
                  {colDossiers.length === 0 && (
                    <p className="py-6 text-center text-xs text-[var(--text-muted)]">
                      Aucun dossier
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : viewMode === "grid" ? (
        /* ── Grid View ── */
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {initialDossiers.map((d) => (
            <DossierCard key={d.id} {...d} />
          ))}
        </div>
      ) : (
        /* ── Table View ── */
        <div className="overflow-x-auto rounded-xl border border-[var(--border-primary)] bg-[var(--bg-card)]">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--border-primary)] bg-[var(--bg-secondary)]">
                <th className="px-4 py-3 text-left font-[family-name:var(--font-heading)] text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">
                  Reference
                </th>
                <th className="px-4 py-3 text-left font-[family-name:var(--font-heading)] text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">
                  Client
                </th>
                <th className="px-4 py-3 text-left font-[family-name:var(--font-heading)] text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">
                  Destination
                </th>
                <th className="px-4 py-3 text-left font-[family-name:var(--font-heading)] text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">
                  Date
                </th>
                <th className="px-4 py-3 text-left font-[family-name:var(--font-heading)] text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">
                  Voyageurs
                </th>
                <th className="px-4 py-3 text-left font-[family-name:var(--font-heading)] text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">
                  Statut
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-primary)]">
              {initialDossiers.map((d) => (
                <tr
                  key={d.id}
                  onClick={() => router.push(`/omra/${d.id}`)}
                  className="cursor-pointer transition-colors hover:bg-[var(--bg-secondary)]"
                >
                  <td className="whitespace-nowrap px-4 py-3 font-medium text-[var(--text-primary)]">
                    {d.reference}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-[var(--text-secondary)]">
                    {d.client.prenom} {d.client.nom}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-[var(--text-secondary)]">
                    {d.destination}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-[var(--text-secondary)]">
                    {new Date(d.dateDepart).toLocaleDateString("fr-FR")}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-[var(--text-secondary)]">
                    {d.nbAdultes + d.nbEnfants + d.nbBebes}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3">
                    <StatutBadge statut={d.statut} size="sm" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {meta.totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-[var(--text-muted)]">
            Page {meta.page} sur {meta.totalPages}
          </p>
          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={meta.page <= 1}
              onClick={() => navigateWithFilters({ page: String(meta.page - 1) })}
              className={cn(
                "inline-flex items-center gap-1 rounded-lg border border-[var(--border-primary)] px-3 py-2 text-sm font-medium",
                "text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)]",
                "disabled:cursor-not-allowed disabled:opacity-40",
              )}
            >
              <ChevronLeft className="h-4 w-4" />
              Precedent
            </button>
            <button
              type="button"
              disabled={meta.page >= meta.totalPages}
              onClick={() => navigateWithFilters({ page: String(meta.page + 1) })}
              className={cn(
                "inline-flex items-center gap-1 rounded-lg border border-[var(--border-primary)] px-3 py-2 text-sm font-medium",
                "text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)]",
                "disabled:cursor-not-allowed disabled:opacity-40",
              )}
            >
              Suivant
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

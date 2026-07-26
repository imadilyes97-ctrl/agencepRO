"use client";

import Link from "next/link";
import { cn, formatDZD, formatDate } from "@/lib/utils";
import { StatutBadge } from "./StatutBadge";
import type { DossierStatut, TypeDossier } from "@prisma/client";
import { MapPin, Calendar, Users, Banknote } from "lucide-react";

interface DossierCardProps {
  id: string;
  reference: string;
  intitule: string | null;
  destination: string;
  typeDossier: TypeDossier;
  statut: DossierStatut;
  dateDepart: Date | string;
  dateRetour: Date | string | null;
  nbAdultes: number;
  nbEnfants: number;
  nbBebes: number;
  montantTotal: number;
  montantPaye: number;
  devise: string;
  client: {
    id: string;
    nom: string;
    prenom: string;
    telephonePrincipal: string;
    email: string | null;
  };
  className?: string;
}

const TYPE_DOSSIER_BADGE: Record<
  TypeDossier,
  { label: string; className: string }
> = {
  OMRA: { label: "Omra", className: "bg-emerald-50 text-emerald-700 ring-emerald-600/10" },
  HAJJ: { label: "Hajj", className: "bg-purple-50 text-purple-700 ring-purple-600/10" },
  TOURISME: { label: "Tourisme", className: "bg-sky-50 text-sky-700 ring-sky-600/10" },
  VISA: { label: "Visa", className: "bg-amber-50 text-amber-700 ring-amber-600/10" },
  CRUISE: { label: "Cruise", className: "bg-cyan-50 text-cyan-700 ring-cyan-600/10" },
  GROUPE: { label: "Groupe", className: "bg-rose-50 text-rose-700 ring-rose-600/10" },
};

export function DossierCard({
  id,
  reference,
  intitule,
  destination,
  typeDossier,
  statut,
  dateDepart,
  dateRetour,
  nbAdultes,
  nbEnfants,
  nbBebes,
  montantTotal,
  montantPaye,
  client,
  className,
}: DossierCardProps) {
  const totalVoyageurs = nbAdultes + nbEnfants + nbBebes;
  const typeInfo = TYPE_DOSSIER_BADGE[typeDossier];
  const progressPct =
    montantTotal > 0 ? Math.round((montantPaye / montantTotal) * 100) : 0;

  return (
    <Link
      href={`/omra/${id}`}
      className={cn(
        "group block rounded-xl border border-[var(--border-primary)] bg-[var(--bg-card)]",
        "p-4 transition-all duration-200",
        "hover:border-[var(--color-primary-300)] hover:shadow-md",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary-500)] focus-visible:ring-offset-2",
        className,
      )}
    >
      {/* Header row: reference + badges */}
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="text-xs font-medium tracking-wide text-[var(--text-muted)]">
            {reference}
          </p>
          <h3 className="mt-0.5 truncate font-[family-name:var(--font-heading)] text-base font-semibold text-[var(--text-primary)]">
            {intitule ?? destination}
          </h3>
        </div>
        <StatutBadge statut={statut} size="sm" />
      </div>

      {/* Type badge */}
      <div className="mt-2.5">
        <span
          className={cn(
            "inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold ring-1 ring-inset",
            typeInfo.className,
          )}
        >
          {typeInfo.label}
        </span>
      </div>

      {/* Info grid */}
      <div className="mt-3 grid grid-cols-2 gap-x-3 gap-y-2 text-sm">
        <div className="flex items-center gap-1.5 text-[var(--text-secondary)]">
          <MapPin className="h-3.5 w-3.5 shrink-0 opacity-60" />
          <span className="truncate">{destination}</span>
        </div>
        <div className="flex items-center gap-1.5 text-[var(--text-secondary)]">
          <Calendar className="h-3.5 w-3.5 shrink-0 opacity-60" />
          <span className="truncate">{formatDate(dateDepart) ?? "—"}</span>
        </div>
        <div className="flex items-center gap-1.5 text-[var(--text-secondary)]">
          <Users className="h-3.5 w-3.5 shrink-0 opacity-60" />
          <span>
            {totalVoyageurs} voyageur{totalVoyageurs > 1 ? "s" : ""}
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-[var(--text-secondary)]">
          <Banknote className="h-3.5 w-3.5 shrink-0 opacity-60" />
          <span className="truncate">{formatDZD(montantTotal)}</span>
        </div>
      </div>

      {/* Client */}
      <div className="mt-3 border-t border-[var(--border-primary)] pt-3">
        <p className="text-xs text-[var(--text-muted)]">
          <span className="font-medium text-[var(--text-secondary)]">
            {client.prenom} {client.nom}
          </span>
        </p>
      </div>

      {/* Payment progress bar */}
      {montantTotal > 0 && (
        <div className="mt-3">
          <div className="mb-1 flex items-center justify-between text-[10px] text-[var(--text-muted)]">
            <span>
              Paye : {formatDZD(montantPaye)}
            </span>
            <span>{progressPct}%</span>
          </div>
          <div className="h-1.5 overflow-hidden rounded-full bg-[var(--bg-secondary)]">
            <div
              className={cn(
                "h-full rounded-full transition-all duration-500",
                progressPct >= 100
                  ? "bg-green-500"
                  : progressPct >= 50
                    ? "bg-[var(--color-primary-500)]"
                    : "bg-amber-400",
              )}
              style={{ width: `${Math.min(progressPct, 100)}%` }}
            />
          </div>
        </div>
      )}
    </Link>
  );
}

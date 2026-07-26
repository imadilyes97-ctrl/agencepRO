"use client";

import { cn } from "@/lib/utils";
import { STATUT_LABELS, STATUT_COLORS, DossierStatutEnum } from "@/schemas/dossier";
import type { z } from "zod";
import { formatDate } from "@/lib/utils";
import {
  CircleDot,
  FileText,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Pencil,
  Plus,
  Trash2,
} from "lucide-react";

interface TimelineEntry {
  id: string;
  action: string;
  ancienneValeur: Record<string, unknown> | null;
  nouvelleValeur: Record<string, unknown> | null;
  details: Record<string, unknown> | null;
  createdAt: Date | string;
  user: {
    nom: string;
    prenom: string;
  } | null;
}

interface DossierTimelineProps {
  entries: TimelineEntry[];
  className?: string;
}

const ACTION_CONFIG: Record<
  string,
  { icon: typeof CircleDot; color: string; label: string }
> = {
  CREATION: {
    icon: Plus,
    color: "text-blue-500 bg-blue-100",
    label: "Dossier cree",
  },
  MODIFICATION: {
    icon: Pencil,
    color: "text-amber-500 bg-amber-100",
    label: "Modification",
  },
  CHANGEMENT_STATUT: {
    icon: CircleDot,
    color: "text-primary-500 bg-primary-100",
    label: "Changement de statut",
  },
  SUPPRESSION: {
    icon: Trash2,
    color: "text-red-500 bg-red-100",
    label: "Suppression",
  },
  AJOUT_DOCUMENT: {
    icon: FileText,
    color: "text-indigo-500 bg-indigo-100",
    label: "Document ajoute",
  },
  PROBLEME: {
    icon: AlertTriangle,
    color: "text-red-500 bg-red-100",
    label: "Probleme signale",
  },
};

function getActionConfig(action: string) {
  return ACTION_CONFIG[action] ?? {
    icon: CircleDot,
    color: "text-gray-500 bg-gray-100",
    label: action,
  };
}

function getStatutDisplay(statut: string) {
  const label = STATUT_LABELS[statut as z.infer<typeof DossierStatutEnum>] ?? statut;
  const colors = STATUT_COLORS[statut as z.infer<typeof DossierStatutEnum>];
  return { label, colors };
}

function renderStatutChange(
  oldStatut: string | null,
  newStatut: string | null,
) {
  if (!oldStatut || !newStatut) return null;
  const oldDisplay = getStatutDisplay(oldStatut);
  const newDisplay = getStatutDisplay(newStatut);

  return (
    <div className="mt-2 flex items-center gap-2 text-sm">
      <span
        className={cn(
          "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset",
          oldDisplay.colors?.bg,
          oldDisplay.colors?.text,
          oldDisplay.colors?.ring,
        )}
      >
        {oldDisplay.label}
      </span>
      <span className="text-[var(--text-muted)]">&#8594;</span>
      <span
        className={cn(
          "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset",
          newDisplay.colors?.bg,
          newDisplay.colors?.text,
          newDisplay.colors?.ring,
        )}
      >
        {newDisplay.label}
      </span>
    </div>
  );
}

function renderNotes(entry: TimelineEntry) {
  const nv = entry.nouvelleValeur as Record<string, unknown> | null;
  if (!nv) return null;

  const notes = (nv.notes as string) || (entry.details?.motif as string);
  if (!notes) return null;

  return (
    <p className="mt-2 rounded-lg bg-[var(--bg-secondary)] px-3 py-2 text-sm italic text-[var(--text-secondary)]">
      &ldquo;{notes}&rdquo;
    </p>
  );
}

export function DossierTimeline({ entries, className }: DossierTimelineProps) {
  if (entries.length === 0) {
    return (
      <div className={cn("py-8 text-center", className)}>
        <CircleDot className="mx-auto h-8 w-8 text-[var(--text-muted)] opacity-40" />
        <p className="mt-2 text-sm text-[var(--text-muted)]">
          Aucun historique pour ce dossier
        </p>
      </div>
    );
  }

  return (
    <div className={cn("relative", className)}>
      {/* Vertical line */}
      <div className="absolute left-4 top-0 bottom-0 w-px bg-[var(--border-primary)]" />

      <div className="space-y-1">
        {entries.map((entry, index) => {
          const config = getActionConfig(entry.action);
          const Icon = config.icon;
          const prevEntry = entries[index + 1];
          const showStatutChange =
            entry.action === "CHANGEMENT_STATUT" &&
            entry.ancienneValeur?.statut &&
            entry.nouvelleValeur?.statut;

          return (
            <div key={entry.id} className="relative flex gap-4 py-3">
              {/* Icon dot */}
              <div
                className={cn(
                  "relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full ring-4 ring-[var(--bg-primary)]",
                  config.color,
                )}
              >
                <Icon className="h-4 w-4" />
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0 pt-0.5">
                <div className="flex items-baseline justify-between gap-2">
                  <p className="text-sm font-medium text-[var(--text-primary)]">
                    {config.label}
                  </p>
                  <time className="shrink-0 text-xs text-[var(--text-muted)]">
                    {formatDate(entry.createdAt)}
                  </time>
                </div>

                {entry.user && (
                  <p className="mt-0.5 text-xs text-[var(--text-muted)]">
                    par {entry.user.prenom} {entry.user.nom}
                  </p>
                )}

                {showStatutChange &&
                  renderStatutChange(
                    entry.ancienneValeur?.statut as string,
                    entry.nouvelleValeur?.statut as string,
                  )}

                {renderNotes(entry)}

                {entry.action === "MODIFICATION" && entry.details && (
                  <div className="mt-2 text-xs text-[var(--text-muted)]">
                    {Object.entries(entry.details).map(([key, value]) => (
                      <div key={key}>
                        <span className="font-medium">{key}:</span>{" "}
                        {String(value)}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

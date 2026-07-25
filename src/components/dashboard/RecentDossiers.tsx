import {
  FolderOpen,
  Plane,
  Globe,
  FileText,
  Users,
  Ship,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { formatDZD, formatDate } from "@/lib/utils";

// ============================================================
// Recent Dossiers — Table of 5 most recent dossiers
// ============================================================

interface DossierRow {
  id: string;
  clientName: string;
  typeDossier: string;
  statut: string;
  montantTotal: number;
  dateDepart: string;
  createdAt: string;
}

interface RecentDossiersProps {
  dossiers: DossierRow[];
}

const typeDossierConfig: Record<
  string,
  { label: string; icon: React.ElementType; color: string }
> = {
  OMRA: {
    label: "Omra",
    icon: Plane,
    color: "bg-[var(--color-primary-100)] text-[var(--color-primary-600)]",
  },
  HAJJ: {
    label: "Hajj",
    icon: Globe,
    color: "bg-[var(--color-accent-100)] text-[var(--color-accent-600)]",
  },
  TOURISME: {
    label: "Tourisme",
    icon: Globe,
    color: "bg-emerald-100 text-emerald-700",
  },
  VISA: {
    label: "Visa",
    icon: FileText,
    color: "bg-blue-100 text-blue-700",
  },
  CRUISE: {
    label: "Croisière",
    icon: Ship,
    color: "bg-cyan-100 text-cyan-700",
  },
  GROUPE: {
    label: "Groupe",
    icon: Users,
    color: "bg-purple-100 text-purple-700",
  },
};

const statutLabels: Record<string, string> = {
  PROSPECT: "Prospect",
  DEVIS: "Devis",
  CONFIRME: "Confirmé",
  EN_COURS: "En cours",
  EN_ATTENTE_DOCUMENTS: "En attente docs",
  DOSSIER_COMPLET: "Dossier complet",
  SOUMIS: "Soumis",
  EN_COURS_TRAITEMENT: "En traitement",
  APPROUVE: "Approuvé",
  REFUSE: "Refusé",
  ENVOYE: "Envoyé",
  TERMINE: "Terminé",
  PROBLEME: "Problème",
  RESOLU: "Résolu",
  ANNULE: "Annulé",
};

const statutDotColor: Record<string, string> = {
  PROSPECT: "bg-gray-400",
  DEVIS: "bg-[var(--color-accent-400)]",
  CONFIRME: "bg-blue-500",
  EN_COURS: "bg-[var(--color-primary-400)]",
  EN_ATTENTE_DOCUMENTS: "bg-amber-500",
  DOSSIER_COMPLET: "bg-indigo-500",
  SOUMIS: "bg-violet-500",
  EN_COURS_TRAITEMENT: "bg-cyan-500",
  APPROUVE: "bg-[var(--color-success)]",
  REFUSE: "bg-[var(--color-error)]",
  ENVOYE: "bg-teal-500",
  TERMINE: "bg-[var(--color-success)]",
  PROBLEME: "bg-[var(--color-error)]",
  RESOLU: "bg-[var(--color-success)]",
  ANNULE: "bg-gray-400",
};

export function RecentDossiers({ dossiers }: RecentDossiersProps) {
  if (dossiers.length === 0) {
    return (
      <div className="rounded-xl border border-[var(--border-primary)] bg-[var(--bg-card)] p-5">
        <div className="flex items-center gap-2 mb-4">
          <FolderOpen className="h-4 w-4 text-[var(--color-primary-500)]" />
          <h2 className="font-[family-name:var(--font-heading)] text-base font-semibold text-[var(--text-primary)]">
            Dossiers récents
          </h2>
        </div>
        <p className="text-sm text-[var(--text-muted)]">
          Aucun dossier pour le moment.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-[var(--border-primary)] bg-[var(--bg-card)] shadow-[var(--shadow-sm)]">
      <div className="flex items-center justify-between border-b border-[var(--border-primary)] px-5 py-4">
        <div className="flex items-center gap-2">
          <FolderOpen className="h-4 w-4 text-[var(--color-primary-500)]" />
          <h2 className="font-[family-name:var(--font-heading)] text-base font-semibold text-[var(--text-primary)]">
            Dossiers récents
          </h2>
        </div>
        <a
          href="/dossiers"
          className="text-xs font-medium text-[var(--color-primary-500)] transition-colors hover:text-[var(--color-primary-700)]"
        >
          Voir tout
        </a>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[var(--border-primary)] text-left text-xs font-medium uppercase tracking-wider text-[var(--text-muted)]">
              <th className="px-5 py-3">Client</th>
              <th className="px-5 py-3">Type</th>
              <th className="px-5 py-3">Statut</th>
              <th className="px-5 py-3 text-right">Montant</th>
              <th className="px-5 py-3">Départ</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border-primary)]">
            {dossiers.map((d) => {
              const typeConfig = typeDossierConfig[d.typeDossier] ?? {
                label: d.typeDossier,
                icon: FolderOpen,
                color: "bg-gray-100 text-gray-600",
              };
              const TypeIcon = typeConfig.icon;

              return (
                <tr
                  key={d.id}
                  className="transition-colors hover:bg-[var(--color-cream-50)]"
                >
                  <td className="whitespace-nowrap px-5 py-3">
                    <span className="font-medium text-[var(--text-primary)]">
                      {d.clientName}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <span
                      className={cn(
                        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium",
                        typeConfig.color,
                      )}
                    >
                      <TypeIcon className="h-3 w-3" />
                      {typeConfig.label}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <span className="inline-flex items-center gap-1.5 text-xs font-medium text-[var(--text-secondary)]">
                      <span
                        className={cn(
                          "inline-block h-2 w-2 rounded-full",
                          statutDotColor[d.statut] ?? "bg-gray-400",
                        )}
                      />
                      {statutLabels[d.statut] ?? d.statut}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-5 py-3 text-right font-[family-name:var(--font-heading)] font-semibold text-[var(--text-primary)]">
                    {formatDZD(d.montantTotal)}
                  </td>
                  <td className="whitespace-nowrap px-5 py-3 text-[var(--text-muted)]">
                    {formatDate(d.dateDepart) ?? "—"}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

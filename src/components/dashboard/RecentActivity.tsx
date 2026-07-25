import {
  Activity,
  Plus,
  Pencil,
  Trash2,
  LogIn,
  CheckCircle,
  XCircle,
  AlertTriangle,
} from "lucide-react";
import { cn } from "@/lib/utils";

// ============================================================
// Recent Activity — Timeline of last 5 HistoriqueAction
// ============================================================

interface ActivityEntry {
  id: string;
  action: string;
  entityType: string;
  entityId: string;
  userName: string;
  succes: boolean;
  createdAt: string;
}

interface RecentActivityProps {
  activities: ActivityEntry[];
}

const actionConfig: Record<
  string,
  { label: string; icon: React.ElementType; color: string }
> = {
  CONNEXION: {
    label: "s'est connecté",
    icon: LogIn,
    color: "bg-blue-100 text-blue-600",
  },
  CREATION: {
    label: "a créé",
    icon: Plus,
    color: "bg-[var(--color-success)]/10 text-[var(--color-success)]",
  },
  MODIFICATION: {
    label: "a modifié",
    icon: Pencil,
    color: "bg-[var(--color-accent-100)] text-[var(--color-accent-600)]",
  },
  SUPPRESSION: {
    label: "a supprimé",
    icon: Trash2,
    color: "bg-[var(--color-error)]/10 text-[var(--color-error)]",
  },
  VALIDATION: {
    label: "a validé",
    icon: CheckCircle,
    color: "bg-[var(--color-success)]/10 text-[var(--color-success)]",
  },
  REJET: {
    label: "a rejeté",
    icon: XCircle,
    color: "bg-[var(--color-error)]/10 text-[var(--color-error)]",
  },
};

const entityTypeLabels: Record<string, string> = {
  CLIENT: "Client",
  DOSSIER: "Dossier",
  FACTURE: "Facture",
  PAIEMENT: "Paiement",
  DOCUMENT: "Document",
  USER: "Utilisateur",
  VISA: "Visa",
  VOL: "Vol",
  HOTEL: "Hôtel",
  GROUPE: "Groupe",
  PROGRAMME: "Programme",
};

function timeAgo(dateStr: string): string {
  const now = new Date();
  const date = new Date(dateStr);
  const diffMs = now.getTime() - date.getTime();
  const diffMin = Math.floor(diffMs / 60_000);
  const diffHours = Math.floor(diffMin / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMin < 1) return "à l'instant";
  if (diffMin < 60) return `il y a ${diffMin} min`;
  if (diffHours < 24) return `il y a ${diffHours}h`;
  if (diffDays < 7) return `il y a ${diffDays}j`;
  return date.toLocaleDateString("fr-FR", { day: "numeric", month: "short" });
}

export function RecentActivity({ activities }: RecentActivityProps) {
  if (activities.length === 0) {
    return (
      <div className="rounded-xl border border-[var(--border-primary)] bg-[var(--bg-card)] p-5">
        <div className="flex items-center gap-2 mb-4">
          <Activity className="h-4 w-4 text-[var(--color-primary-500)]" />
          <h2 className="font-[family-name:var(--font-heading)] text-base font-semibold text-[var(--text-primary)]">
            Activité récente
          </h2>
        </div>
        <p className="text-sm text-[var(--text-muted)]">
          Aucune activité récente.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-[var(--border-primary)] bg-[var(--bg-card)] p-5 shadow-[var(--shadow-sm)]">
      <div className="flex items-center gap-2 mb-4">
        <Activity className="h-4 w-4 text-[var(--color-primary-500)]" />
        <h2 className="font-[family-name:var(--font-heading)] text-base font-semibold text-[var(--text-primary)]">
          Activité récente
        </h2>
      </div>

      <div className="relative">
        {/* Vertical line */}
        <div className="absolute left-[7px] top-2 bottom-2 w-px bg-[var(--border-primary)]" />

        <ul className="space-y-4">
          {activities.map((entry) => {
            const config = actionConfig[entry.action] ?? {
              label: entry.action.toLowerCase(),
              icon: AlertTriangle,
              color: "bg-gray-100 text-gray-600",
            };
            const Icon = config.icon;
            const entityLabel = entityTypeLabels[entry.entityType] ?? entry.entityType;

            return (
              <li key={entry.id} className="relative flex items-start gap-3 pl-0">
                {/* Dot on the timeline */}
                <div
                  className={cn(
                    "relative z-10 mt-0.5 flex h-[15px] w-[15px] shrink-0 items-center justify-center rounded-full border-2 border-[var(--bg-card)]",
                    entry.succes
                      ? config.color
                      : "bg-[var(--color-error)]/10 text-[var(--color-error)]",
                  )}
                >
                  <Icon className="h-2.5 w-2.5" />
                </div>

                <div className="min-w-0 flex-1">
                  <p className="text-sm leading-snug text-[var(--text-primary)]">
                    <span className="font-medium">{entry.userName}</span>{" "}
                    <span className="text-[var(--text-secondary)]">
                      {config.label}
                    </span>{" "}
                    <span className="font-medium">{entityLabel}</span>
                    {!entry.succes && (
                      <span className="ml-1 inline-flex items-center gap-0.5 text-xs text-[var(--color-error)]">
                        <XCircle className="h-3 w-3" />
                        échoué
                      </span>
                    )}
                  </p>
                  <p className="mt-0.5 text-xs text-[var(--text-muted)]">
                    {timeAgo(entry.createdAt)}
                  </p>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

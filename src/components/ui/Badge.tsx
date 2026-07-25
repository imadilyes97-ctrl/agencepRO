import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

type BadgeVariant = "default" | "success" | "warning" | "danger" | "info" | "accent";
type BadgeSize = "sm" | "md";

interface BadgeProps {
  children: ReactNode;
  variant?: BadgeVariant;
  size?: BadgeSize;
  className?: string;
}

const variantStyles: Record<BadgeVariant, string> = {
  default:
    "bg-[var(--color-cream-200)] text-[var(--text-primary)]",
  success:
    "bg-green-100 text-green-800",
  warning:
    "bg-amber-100 text-amber-800",
  danger:
    "bg-red-100 text-red-800",
  info:
    "bg-blue-100 text-blue-800",
  accent:
    "bg-[var(--color-accent-100)] text-[var(--color-accent-800)]",
};

const sizeStyles: Record<BadgeSize, string> = {
  sm: "px-2 py-0.5 text-xs",
  md: "px-2.5 py-1 text-xs",
};

/** Maps ClientStatut to badge variant. */
export function statutBadgeVariant(statut: string): BadgeVariant {
  switch (statut) {
    case "ACTIF":
      return "success";
    case "INACTIF":
      return "default";
    case "BLOQUE":
      return "warning";
    case "BLACKLISTE":
      return "danger";
    default:
      return "default";
  }
}

/** Maps ClientStatut to a human-readable French label. */
export function statutLabel(statut: string): string {
  switch (statut) {
    case "ACTIF":
      return "Actif";
    case "INACTIF":
      return "Inactif";
    case "BLOQUE":
      return "Bloque";
    case "BLACKLISTE":
      return "Blackliste";
    default:
      return statut;
  }
}

/** Maps DossierStatut to badge variant. */
export function dossierStatutBadgeVariant(statut: string): BadgeVariant {
  switch (statut) {
    case "APPROUVE":
    case "TERMINE":
    case "RESOLU":
    case "ENVOYE":
      return "success";
    case "EN_COURS":
    case "EN_COURS_TRAITEMENT":
    case "DOSSIER_COMPLET":
    case "CONFIRME":
      return "info";
    case "EN_ATTENTE_DOCUMENTS":
    case "SOUMIS":
    case "DEVIS":
    case "PROSPECT":
      return "warning";
    case "REFUSE":
    case "ANNULE":
    case "PROBLEME":
      return "danger";
    default:
      return "default";
  }
}

/** Maps DossierStatut to a human-readable French label. */
export function dossierStatutLabel(statut: string): string {
  const labels: Record<string, string> = {
    PROSPECT: "Prospect",
    DEVIS: "Devis",
    CONFIRME: "Confirme",
    EN_COURS: "En cours",
    EN_ATTENTE_DOCUMENTS: "En attente de documents",
    DOSSIER_COMPLET: "Dossier complet",
    SOUMIS: "Soumis",
    EN_COURS_TRAITEMENT: "En cours de traitement",
    APPROUVE: "Approuve",
    REFUSE: "Refuse",
    ENVOYE: "Envoye",
    TERMINE: "Termine",
    PROBLEME: "Probleme",
    RESOLU: "Resolu",
    ANNULE: "Annule",
  };
  return labels[statut] ?? statut;
}

export function Badge({ children, variant = "default", size = "md", className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-[var(--radius-full)] font-medium whitespace-nowrap",
        variantStyles[variant],
        sizeStyles[size],
        className,
      )}
    >
      {children}
    </span>
  );
}

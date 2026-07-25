"use client";

import { cn } from "@/lib/utils";
import {
  STATUT_COLORS,
  STATUT_LABELS,
  type DossierStatutEnum,
} from "@/schemas/dossier";
import type { DossierStatut } from "@prisma/client";

interface StatutBadgeProps {
  statut: DossierStatut;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const SIZE_CLASSES = {
  sm: "px-2 py-0.5 text-[10px]",
  md: "px-2.5 py-1 text-xs",
  lg: "px-3 py-1.5 text-sm",
} as const;

export function StatutBadge({ statut, size = "md", className }: StatutBadgeProps) {
  const colors = STATUT_COLORS[statut as DossierStatutEnum];
  const label = STATUT_LABELS[statut as DossierStatutEnum] ?? statut;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full font-medium ring-1 ring-inset",
        SIZE_CLASSES[size],
        colors.bg,
        colors.text,
        colors.ring,
        className,
      )}
    >
      <span
        className={cn(
          "h-1.5 w-1.5 rounded-full",
          statut === "TERMINE"
            ? "bg-green-500"
            : statut === "PROBLEME"
              ? "bg-red-500"
              : statut === "ANNULE"
                ? "bg-gray-400"
                : "bg-current opacity-60",
        )}
      />
      {label}
    </span>
  );
}

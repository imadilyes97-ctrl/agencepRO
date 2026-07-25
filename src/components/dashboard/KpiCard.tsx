import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { cn, formatDZD } from "@/lib/utils";

// ============================================================
// KPI Card — Metric card with trend indicator
// ============================================================

interface KpiCardProps {
  label: string;
  value: number;
  trend: "up" | "down";
  changePercent: number;
  /** Override formatting. Defaults to DZD currency. */
  format?: "currency" | "number";
  /** For impayés: "up" is bad (warning color), "down" is good (success color). */
  invertTrendColor?: boolean;
}

export function KpiCard({
  label,
  value,
  trend,
  changePercent,
  format = "currency",
  invertTrendColor = false,
}: KpiCardProps) {
  const formattedValue =
    format === "currency" ? formatDZD(value) : value.toLocaleString("fr-FR");

  const isPositiveTrend = trend === "up";
  // For inverted metrics (like impayés), up is bad
  const trendIsGood = invertTrendColor ? !isPositiveTrend : isPositiveTrend;

  return (
    <div className="group relative overflow-hidden rounded-xl border border-[var(--border-primary)] bg-[var(--bg-card)] p-5 shadow-[var(--shadow-sm)] transition-all duration-[var(--transition-normal)] hover:shadow-[var(--shadow-md)] hover:border-[var(--color-primary-200)]">
      {/* Subtle accent line at top */}
      <div className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-[var(--color-primary-400)] to-[var(--color-accent-400)] opacity-0 transition-opacity duration-[var(--transition-normal)] group-hover:opacity-100" />

      <p className="text-sm font-medium text-[var(--text-muted)]">{label}</p>

      <p className="mt-1.5 font-[family-name:var(--font-heading)] text-2xl font-bold tracking-tight text-[var(--text-primary)]">
        {formattedValue}
      </p>

      <div className="mt-2 flex items-center gap-1.5">
        {changePercent === 0 ? (
          <Minus className="h-3.5 w-3.5 text-[var(--text-muted)]" />
        ) : isPositiveTrend ? (
          <TrendingUp
            className={cn(
              "h-3.5 w-3.5",
              trendIsGood ? "text-[var(--color-success)]" : "text-[var(--color-warning)]",
            )}
          />
        ) : (
          <TrendingDown
            className={cn(
              "h-3.5 w-3.5",
              trendIsGood ? "text-[var(--color-success)]" : "text-[var(--color-error)]",
            )}
          />
        )}

        <span
          className={cn(
            "text-xs font-medium",
            changePercent === 0
              ? "text-[var(--text-muted)]"
              : trendIsGood
                ? "text-[var(--color-success)]"
                : "text-[var(--color-error)]",
          )}
        >
          {changePercent === 0 ? "stable" : `${changePercent}%`}
        </span>

        <span className="text-xs text-[var(--text-muted)]">
          vs mois dernier
        </span>
      </div>
    </div>
  );
}

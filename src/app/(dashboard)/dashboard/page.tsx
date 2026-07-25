import { Suspense } from "react";
import { getDashboardStats, getRecentDossiers, getRecentActivity } from "@/server/queries/dashboard";
import { KpiCard } from "@/components/dashboard/KpiCard";
import { RecentDossiers } from "@/components/dashboard/RecentDossiers";
import { RecentActivity } from "@/components/dashboard/RecentActivity";
import { DashboardSkeleton } from "@/components/ui/Skeleton";

// ============================================================
// Dashboard Page — KPIs + Recent Dossiers + Activity
// Server-side data fetching via Prisma
// ============================================================

// TODO: Replace with real auth session when auth is implemented
const MOCK_AGENCE_ID = "placeholder-agence-id";

export const metadata = {
  title: "Tableau de bord | Agence Pro",
  description: "Vue d'ensemble de votre agence de voyage",
};

async function DashboardContent() {
  let stats: Awaited<ReturnType<typeof getDashboardStats>>;
  let dossiers: Awaited<ReturnType<typeof getRecentDossiers>>;
  let activities: Awaited<ReturnType<typeof getRecentActivity>>;

  try {
    [stats, dossiers, activities] = await Promise.all([
      getDashboardStats(MOCK_AGENCE_ID),
      getRecentDossiers(MOCK_AGENCE_ID),
      getRecentActivity(MOCK_AGENCE_ID),
    ]);
  } catch {
    // Graceful fallback when DB is not available (first run, no data, etc.)
    stats = {
      caDuMois: { value: 0, trend: "up" as const, changePercent: 0 },
      dossiersActifs: { value: 0, trend: "up" as const, changePercent: 0 },
      clientsActifs: { value: 0, trend: "up" as const, changePercent: 0 },
      impayes: { value: 0, trend: "down" as const, changePercent: 0 },
    };
    dossiers = [];
    activities = [];
  }

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h1 className="font-[family-name:var(--font-heading)] text-2xl font-bold tracking-tight text-[var(--text-primary)]">
          Tableau de bord
        </h1>
        <p className="mt-1 text-sm text-[var(--text-muted)]">
          Vue d&apos;ensemble de votre agence
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard
          label="CA du mois"
          value={stats.caDuMois.value}
          trend={stats.caDuMois.trend}
          changePercent={stats.caDuMois.changePercent}
          format="currency"
        />
        <KpiCard
          label="Dossiers actifs"
          value={stats.dossiersActifs.value}
          trend={stats.dossiersActifs.trend}
          changePercent={stats.dossiersActifs.changePercent}
          format="number"
        />
        <KpiCard
          label="Clients actifs"
          value={stats.clientsActifs.value}
          trend={stats.clientsActifs.trend}
          changePercent={stats.clientsActifs.changePercent}
          format="number"
        />
        <KpiCard
          label="Impayés"
          value={stats.impayes.value}
          trend={stats.impayes.trend}
          changePercent={stats.impayes.changePercent}
          format="currency"
          invertTrendColor
        />
      </div>

      {/* Bottom sections: Dossiers table + Activity timeline */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-5">
        {/* Recent Dossiers — takes 3 columns on xl */}
        <div className="xl:col-span-3">
          <Suspense fallback={<div className="h-72 animate-pulse rounded-xl bg-[var(--color-cream-100)]" />}>
            <RecentDossiers dossiers={dossiers} />
          </Suspense>
        </div>

        {/* Recent Activity — takes 2 columns on xl */}
        <div className="xl:col-span-2">
          <Suspense fallback={<div className="h-72 animate-pulse rounded-xl bg-[var(--color-cream-100)]" />}>
            <RecentActivity activities={activities} />
          </Suspense>
        </div>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <DashboardContent />
    </Suspense>
  );
}

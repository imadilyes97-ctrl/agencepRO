export default function DashboardPage() {
  return (
    <div>
      <h1 className="font-[family-name:var(--font-heading)] text-2xl font-bold text-[var(--text-primary)]">
        Tableau de bord
      </h1>
      <p className="mt-1 text-sm text-[var(--text-muted)]">
        Vue d&apos;ensemble de votre agence
      </p>

      {/* KPI cards — Phase 4 */}
      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {["CA du mois", "Dossiers actifs", "Clients actifs", "Impayés"].map(
          (label) => (
            <div
              key={label}
              className="rounded-xl border border-[var(--border-primary)] bg-[var(--bg-card)] p-5 shadow-[var(--shadow-sm)]"
            >
              <p className="text-sm text-[var(--text-muted)]">{label}</p>
              <p className="mt-1 font-[family-name:var(--font-heading)] text-2xl font-bold text-[var(--text-primary)]">
                —
              </p>
            </div>
          ),
        )}
      </div>
    </div>
  );
}

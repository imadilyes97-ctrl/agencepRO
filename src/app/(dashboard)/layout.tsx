/**
 * Dashboard layout — sidebar + topbar + content area.
 * Auth check happens here via middleware.
 */

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar placeholder — Phase 4 */}
      <aside className="hidden w-64 shrink-0 border-r border-[var(--border-primary)] bg-[var(--bg-card)] p-4 lg:block">
        <div className="flex items-center gap-2 mb-8">
          <div className="h-8 w-8 rounded-lg bg-[var(--color-primary-500)]" />
          <span className="font-[family-name:var(--font-heading)] text-lg font-bold text-[var(--color-primary-500)]">
            Agence Pro
          </span>
        </div>
        <nav className="space-y-1">
          {/* Nav items — Phase 4 */}
        </nav>
      </aside>

      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Topbar placeholder — Phase 4 */}
        <header className="flex h-14 shrink-0 items-center border-b border-[var(--border-primary)] bg-[var(--bg-card)] px-6">
          <span className="text-sm text-[var(--text-muted)]">Dashboard</span>
        </header>

        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
}

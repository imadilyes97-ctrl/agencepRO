"use client";

import { usePathname } from "next/navigation";
import {
  Search,
  Bell,
  ChevronRight,
  Menu,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar } from "@/components/ui/Avatar";

// ============================================================
// Topbar — Breadcrumbs + Search + Notifications + User menu
// ============================================================

const segmentLabels: Record<string, string> = {
  dashboard: "Tableau de bord",
  clients: "Clients",
  dossiers: "Dossiers",
  omra: "Dossiers Omra",
  groupes: "Groupes",
  facturation: "Factures",
  paiements: "Paiements",
  documents: "Documents",
  parametres: "Paramètres",
  nouvelle: "Nouveau",
  modifier: "Modifier",
};

function buildBreadcrumbs(pathname: string) {
  const segments = pathname.split("/").filter(Boolean);
  // Remove "dashboard" prefix if present, keep meaningful segments
  const crumbs: { label: string; href: string; isLast: boolean }[] = [];

  let accumulated = "";
  for (let i = 0; i < segments.length; i++) {
    const seg = segments[i];
    accumulated += `/${seg}`;
    crumbs.push({
      label: segmentLabels[seg] ?? seg,
      href: accumulated,
      isLast: i === segments.length - 1,
    });
  }

  return crumbs;
}

// Fake user info — replaced by auth context later
const FAKE_USER = {
  name: "Ilyes Imad",
  avatar: null as string | null,
};

interface TopbarProps {
  onMenuToggle?: () => void;
}

export function Topbar({ onMenuToggle }: TopbarProps) {
  const pathname = usePathname();
  const breadcrumbs = buildBreadcrumbs(pathname);

  return (
    <header className="flex h-14 shrink-0 items-center gap-4 border-b border-[var(--border-primary)] bg-[var(--bg-card)] px-4 md:px-6">
      {/* Mobile menu button */}
      <button
        onClick={onMenuToggle}
        className="shrink-0 rounded-md p-1.5 text-[var(--text-muted)] transition-colors hover:bg-[var(--color-cream-100)] hover:text-[var(--text-primary)] md:hidden"
        aria-label="Ouvrir le menu"
      >
        <Menu className="h-5 w-5" />
      </button>

      {/* Breadcrumbs */}
      <nav className="hidden items-center gap-1 text-sm md:flex" aria-label="Fil d'Ariane">
        <span className="text-[var(--text-muted)]">Agence Pro</span>
        {breadcrumbs.map((crumb) => (
          <span key={crumb.href} className="flex items-center gap-1">
            <ChevronRight className="h-3.5 w-3.5 text-[var(--text-muted)]" />
            {crumb.isLast ? (
              <span className="font-medium text-[var(--text-primary)]">
                {crumb.label}
              </span>
            ) : (
              <a
                href={crumb.href}
                className="text-[var(--text-muted)] transition-colors hover:text-[var(--text-primary)]"
              >
                {crumb.label}
              </a>
            )}
          </span>
        ))}
      </nav>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Search bar */}
      <button
        className={cn(
          "hidden items-center gap-2 rounded-lg border border-[var(--border-primary)] bg-[var(--color-cream-50)] px-3 py-1.5 text-sm text-[var(--text-muted)] transition-colors",
          "hover:border-[var(--color-primary-200)] hover:bg-white sm:flex",
        )}
      >
        <Search className="h-4 w-4 shrink-0" />
        <span>Rechercher...</span>
        <kbd className="ml-4 inline-flex items-center gap-0.5 rounded border border-[var(--border-secondary)] bg-[var(--bg-card)] px-1.5 py-0.5 font-mono text-[10px] font-medium text-[var(--text-muted)]">
          <span className="text-[11px]">&#8984;</span>K
        </kbd>
      </button>

      {/* Right section */}
      <div className="flex items-center gap-1">
        {/* Notifications bell */}
        <button
          className="relative rounded-lg p-2 text-[var(--text-muted)] transition-colors hover:bg-[var(--color-cream-100)] hover:text-[var(--text-primary)]"
          aria-label="Notifications"
        >
          <Bell className="h-4.5 w-4.5" />
          {/* Notification badge */}
          <span className="absolute right-1.5 top-1.5 flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--color-error)] opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-[var(--color-error)]" />
          </span>
        </button>

        {/* Language switcher */}
        <button className="hidden rounded-lg px-2 py-1.5 text-xs font-medium text-[var(--text-muted)] transition-colors hover:bg-[var(--color-cream-100)] hover:text-[var(--text-primary)] sm:block">
          FR / AR
        </button>

        {/* User avatar dropdown */}
        <button className="flex items-center gap-2 rounded-lg p-1 transition-colors hover:bg-[var(--color-cream-100)]">
          <Avatar name={FAKE_USER.name} src={FAKE_USER.avatar} size="sm" />
          <span className="hidden text-sm font-medium text-[var(--text-primary)] lg:block">
            Ilyes
          </span>
        </button>
      </div>
    </header>
  );
}

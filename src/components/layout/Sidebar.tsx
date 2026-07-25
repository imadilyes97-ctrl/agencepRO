"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  FolderOpen,
  Plane,
  UsersRound,
  Receipt,
  CreditCard,
  FileText,
  Settings,
  ChevronLeft,
  ChevronRight,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar } from "@/components/ui/Avatar";

// ============================================================
// Sidebar — Main navigation sidebar
// ============================================================

interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
  section?: string;
}

const navigation: NavItem[] = [
  { label: "Tableau de bord", href: "/dashboard", icon: LayoutDashboard },
  // CRM
  { label: "Clients", href: "/clients", icon: Users, section: "CRM" },
  { label: "Dossiers", href: "/dossiers", icon: FolderOpen, section: "CRM" },
  // Omra / Hajj
  { label: "Dossiers Omra", href: "/omra", icon: Plane, section: "Omra / Hajj" },
  { label: "Groupes", href: "/groupes", icon: UsersRound, section: "Omra / Hajj" },
  // Finance
  { label: "Factures", href: "/facturation", icon: Receipt, section: "Finance" },
  { label: "Paiements", href: "/paiements", icon: CreditCard, section: "Finance" },
  // Hors section
  { label: "Documents", href: "/documents", icon: FileText },
  { label: "Paramètres", href: "/parametres", icon: Settings },
];

// Group navigation items by section
function groupBySection(items: NavItem[]): Map<string | undefined, NavItem[]> {
  const groups = new Map<string | undefined, NavItem[]>();
  for (const item of items) {
    const existing = groups.get(item.section) ?? [];
    existing.push(item);
    groups.set(item.section, existing);
  }
  return groups;
}

// Fake user info — replaced by auth context later
const FAKE_USER = {
  name: "Ilyes Imad",
  role: "Administrateur",
  avatar: null as string | null,
};

interface SidebarProps {
  className?: string;
}

export function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  const groups = groupBySection(navigation);

  return (
    <aside
      className={cn(
        "relative flex h-full flex-col border-r border-[var(--border-primary)] bg-[var(--bg-card)] transition-all duration-[var(--transition-normal)]",
        collapsed ? "w-[68px]" : "w-64",
        className,
      )}
    >
      {/* Logo + brand */}
      <div
        className={cn(
          "flex h-14 shrink-0 items-center border-b border-[var(--border-primary)] px-4",
          collapsed ? "justify-center" : "gap-2.5",
        )}
      >
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[var(--color-primary-500)]">
          <span className="font-[family-name:var(--font-heading)] text-sm font-bold text-white">
            AP
          </span>
        </div>
        {!collapsed && (
          <span className="font-[family-name:var(--font-heading)] text-lg font-bold text-[var(--color-primary-500)] tracking-tight">
            Agence Pro
          </span>
        )}
      </div>

      {/* Collapse toggle */}
      <button
        onClick={() => setCollapsed((c) => !c)}
        className="absolute -right-3 top-[72px] z-10 flex h-6 w-6 items-center justify-center rounded-full border border-[var(--border-primary)] bg-[var(--bg-card)] text-[var(--text-muted)] shadow-sm transition-colors hover:bg-[var(--color-cream-100)] hover:text-[var(--text-primary)]"
        aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
      >
        {collapsed ? (
          <ChevronRight className="h-3 w-3" />
        ) : (
          <ChevronLeft className="h-3 w-3" />
        )}
      </button>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-2.5 py-3">
        {Array.from(groups.entries()).map(([section, items], groupIdx) => (
          <div key={section ?? "root"}>
            {/* Section label */}
            {section && !collapsed && (
              <p className="mb-1 mt-4 px-2.5 text-[10px] font-semibold uppercase tracking-widest text-[var(--text-muted)] first:mt-0">
                {section}
              </p>
            )}
            {section && collapsed && groupIdx > 0 && (
              <div className="my-2 mx-2 border-t border-[var(--border-primary)]" />
            )}

            <ul className="space-y-0.5">
              {items.map((item) => {
                const isActive =
                  pathname === item.href ||
                  (item.href !== "/dashboard" && pathname.startsWith(item.href));
                const Icon = item.icon;

                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={cn(
                        "group flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm font-medium transition-all duration-[var(--transition-fast)]",
                        collapsed && "justify-center px-0",
                        isActive
                          ? "bg-[var(--color-primary-500)] text-white shadow-sm"
                          : "text-[var(--text-secondary)] hover:bg-[var(--color-cream-100)] hover:text-[var(--text-primary)]",
                      )}
                      title={collapsed ? item.label : undefined}
                    >
                      <Icon
                        className={cn(
                          "h-4.5 w-4.5 shrink-0",
                          isActive
                            ? "text-white"
                            : "text-[var(--text-muted)] group-hover:text-[var(--color-primary-500)]",
                        )}
                      />
                      {!collapsed && <span>{item.label}</span>}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      {/* User profile mini-card */}
      <div
        className={cn(
          "shrink-0 border-t border-[var(--border-primary)] p-3",
          collapsed && "flex justify-center px-2",
        )}
      >
        {collapsed ? (
          <Avatar name={FAKE_USER.name} src={FAKE_USER.avatar} size="sm" />
        ) : (
          <div className="flex items-center gap-2.5">
            <Avatar name={FAKE_USER.name} src={FAKE_USER.avatar} size="sm" />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-[var(--text-primary)]">
                {FAKE_USER.name}
              </p>
              <p className="truncate text-xs text-[var(--text-muted)]">
                {FAKE_USER.role}
              </p>
            </div>
            <button
              className="shrink-0 rounded-md p-1 text-[var(--text-muted)] transition-colors hover:bg-[var(--color-cream-100)] hover:text-[var(--color-error)]"
              aria-label="Déconnexion"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
    </aside>
  );
}

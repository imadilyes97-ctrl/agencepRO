"use client";

import { useState } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { Topbar } from "@/components/layout/Topbar";
import { cn } from "@/lib/utils";

// ============================================================
// Dashboard layout — sidebar + topbar + content area
// Auth check happens here via middleware.
// ============================================================

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-[var(--bg-primary)]">
      {/* Mobile overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/40 transition-opacity md:hidden"
          onClick={() => setMobileMenuOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar — desktop always visible, mobile as overlay */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-40 transform transition-transform duration-[var(--transition-normal)] md:static md:translate-x-0",
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <Sidebar />
      </div>

      {/* Main content area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <Topbar onMenuToggle={() => setMobileMenuOpen((o) => !o)} />

        <main className="flex-1 overflow-y-auto p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}

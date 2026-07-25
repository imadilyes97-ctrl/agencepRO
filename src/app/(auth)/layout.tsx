import type { Metadata } from "next";
import { APP_NAME } from "@/lib/constants";

// ============================================================
// AUTH LAYOUT — Page centrée, sans sidebar
// ============================================================

export const metadata: Metadata = {
  title: `Connexion — ${APP_NAME}`,
  description: "Connectez-vous à votre compte Agence Pro",
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--bg-primary)] px-4 py-12">
      <div className="w-full max-w-md">
        {children}
      </div>
    </div>
  );
}

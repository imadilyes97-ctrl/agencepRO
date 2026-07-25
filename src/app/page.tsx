import Link from "next/link";

export default function HomePage() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <h1 className="font-[family-name:var(--font-heading)] text-4xl font-bold text-[var(--color-primary-500)]">
          Agence Pro
        </h1>
        <p className="mt-2 text-lg text-[var(--text-muted)]">
          SaaS de gestion pour agences de voyage au Maghreb
        </p>
        <div className="mt-8 flex gap-4 justify-center">
          <Link
            href="/auth/login"
            className="rounded-lg bg-[var(--color-primary-500)] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[var(--color-primary-600)]"
          >
            Connexion
          </Link>
          <Link
            href="/auth/register"
            className="rounded-lg border border-[var(--color-primary-500)] px-6 py-3 text-sm font-semibold text-[var(--color-primary-500)] transition-colors hover:bg-[var(--color-primary-50)]"
          >
            Inscription
          </Link>
        </div>
      </div>
    </div>
  );
}

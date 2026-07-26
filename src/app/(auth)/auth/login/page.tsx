"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { LoginSchema, type LoginInput } from "@/schemas/auth";
import { Eye, EyeOff, Loader2 } from "lucide-react";

// ============================================================
// PAGE LOGIN — Connexion utilisateur
// ============================================================

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? "/dashboard";
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(data: LoginInput) {
    setServerError(null);

    const result = await signIn("credentials", {
      email: data.email,
      password: data.password,
      redirect: false,
    });

    if (result?.error) {
      setServerError("Adresse e-mail ou mot de passe incorrect");
      return;
    }

    router.push(callbackUrl);
    router.refresh();
  }

  return (
    <div className="space-y-8">
      {/* En-tête */}
      <div className="text-center">
        <h1 className="font-[family-name:var(--font-heading)] text-3xl font-bold text-[var(--text-primary)]">
          Connexion
        </h1>
        <p className="mt-2 text-sm text-[var(--text-muted)]">
          Accédez à votre espace {process.env.NEXT_PUBLIC_APP_NAME ?? "Agence Pro"}
        </p>
      </div>

      {/* Formulaire */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
        {/* Erreur serveur */}
        {serverError && (
          <div
            role="alert"
            className="rounded-lg border border-[var(--color-error)]/20 bg-[var(--color-error)]/5 px-4 py-3 text-sm text-[var(--color-error)]"
          >
            {serverError}
          </div>
        )}

        {/* E-mail */}
        <div className="space-y-1.5">
          <label
            htmlFor="email"
            className="block text-sm font-medium text-[var(--text-primary)]"
          >
            Adresse e-mail
          </label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            placeholder="vous@exemple.com"
            className="w-full rounded-[var(--radius-lg)] border border-[var(--border-primary)] bg-[var(--bg-card)] px-4 py-2.5 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] transition-colors focus:border-[var(--color-primary-500)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-500)]/20"
            {...register("email")}
          />
          {errors.email && (
            <p className="text-xs text-[var(--color-error)]">{errors.email.message}</p>
          )}
        </div>

        {/* Mot de passe */}
        <div className="space-y-1.5">
          <label
            htmlFor="password"
            className="block text-sm font-medium text-[var(--text-primary)]"
          >
            Mot de passe
          </label>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              placeholder="••••••••"
              className="w-full rounded-[var(--radius-lg)] border border-[var(--border-primary)] bg-[var(--bg-card)] px-4 py-2.5 pr-10 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] transition-colors focus:border-[var(--color-primary-500)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-500)]/20"
              {...register("password")}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
              tabIndex={-1}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {errors.password && (
            <p className="text-xs text-[var(--color-error)]">{errors.password.message}</p>
          )}
        </div>

        {/* Bouton de connexion */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-[var(--radius-lg)] bg-[var(--color-primary-500)] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[var(--color-primary-600)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-500)]/40 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSubmitting ? (
            <span className="inline-flex items-center gap-2">
              <Loader2 size={16} className="animate-spin" />
              Connexion en cours...
            </span>
          ) : (
            "Se connecter"
          )}
        </button>
      </form>

      {/* Lien inscription */}
      <p className="text-center text-sm text-[var(--text-muted)]">
        Pas encore de compte ?{" "}
        <Link
          href="/auth/register"
          className="font-medium text-[var(--color-primary-500)] hover:text-[var(--color-primary-600)] transition-colors"
        >
          Créer un compte
        </Link>
      </p>
    </div>
  );
}

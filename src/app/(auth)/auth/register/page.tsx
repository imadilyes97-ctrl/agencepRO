"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { RegisterSchema, type RegisterInput } from "@/schemas/auth";
import { Eye, EyeOff, Loader2, Building2 } from "lucide-react";

// ============================================================
// PAGE REGISTER — Inscription utilisateur
// ============================================================

export default function RegisterPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
  } = useForm<RegisterInput>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      nom: "",
      prenom: "",
      email: "",
      password: "",
      passwordConfirm: "",
      nomAgence: "",
    },
  });

  const nomAgenceValue = watch("nomAgence");

  async function onSubmit(data: RegisterInput) {
    setServerError(null);
    setSuccessMessage(null);

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        setServerError(
          result.error || "Une erreur est survenue lors de l'inscription",
        );
        return;
      }

      // Inscription réussie : connexion automatique
      setSuccessMessage("Compte créé avec succès ! Connexion en cours...");

      const signInResult = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      if (signInResult?.error) {
        // Compte créé mais connexion échouée : rediriger vers login
        router.push("/auth/login");
        return;
      }

      router.push("/dashboard");
      router.refresh();
    } catch {
      setServerError("Une erreur réseau est survenue. Veuillez réessayer.");
    }
  }

  return (
    <div className="space-y-8">
      {/* En-tête */}
      <div className="text-center">
        <h1 className="font-[family-name:var(--font-heading)] text-3xl font-bold text-[var(--text-primary)]">
          Créer un compte
        </h1>
        <p className="mt-2 text-sm text-[var(--text-muted)]">
          Rejoignez {process.env.NEXT_PUBLIC_APP_NAME ?? "Agence Pro"} et gérez votre agence
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

        {/* Message de succès */}
        {successMessage && (
          <div
            role="status"
            className="rounded-lg border border-[var(--color-success)]/20 bg-[var(--color-success)]/5 px-4 py-3 text-sm text-[var(--color-success)]"
          >
            {successMessage}
          </div>
        )}

        {/* Prénom + Nom */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label
              htmlFor="prenom"
              className="block text-sm font-medium text-[var(--text-primary)]"
            >
              Prénom
            </label>
            <input
              id="prenom"
              type="text"
              autoComplete="given-name"
              placeholder="Mohamed"
              className="w-full rounded-[var(--radius-lg)] border border-[var(--border-primary)] bg-[var(--bg-card)] px-4 py-2.5 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] transition-colors focus:border-[var(--color-primary-500)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-500)]/20"
              {...register("prenom")}
            />
            {errors.prenom && (
              <p className="text-xs text-[var(--color-error)]">{errors.prenom.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <label
              htmlFor="nom"
              className="block text-sm font-medium text-[var(--text-primary)]"
            >
              Nom
            </label>
            <input
              id="nom"
              type="text"
              autoComplete="family-name"
              placeholder="Benali"
              className="w-full rounded-[var(--radius-lg)] border border-[var(--border-primary)] bg-[var(--bg-card)] px-4 py-2.5 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] transition-colors focus:border-[var(--color-primary-500)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-500)]/20"
              {...register("nom")}
            />
            {errors.nom && (
              <p className="text-xs text-[var(--color-error)]">{errors.nom.message}</p>
            )}
          </div>
        </div>

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

        {/* Nom de l'agence */}
        <div className="space-y-1.5">
          <label
            htmlFor="nomAgence"
            className="flex items-center gap-2 text-sm font-medium text-[var(--text-primary)]"
          >
            <Building2 size={14} />
            Nom de l&apos;agence
            <span className="text-[var(--text-muted)] font-normal">(optionnel)</span>
          </label>
          <input
            id="nomAgence"
            type="text"
            placeholder="Voyages Atlas International"
            className="w-full rounded-[var(--radius-lg)] border border-[var(--border-primary)] bg-[var(--bg-card)] px-4 py-2.5 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] transition-colors focus:border-[var(--color-primary-500)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-500)]/20"
            {...register("nomAgence")}
          />
          {errors.nomAgence && (
            <p className="text-xs text-[var(--color-error)]">{errors.nomAgence.message}</p>
          )}
          <p className="text-xs text-[var(--text-muted)]">
            Si vous êtes le premier utilisateur, une agence sera créée avec ce nom.
            {nomAgenceValue
              ? ` Agence : "${nomAgenceValue}"`
              : ` Une agence par défaut sera créée.`}
          </p>
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
              autoComplete="new-password"
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

        {/* Confirmation du mot de passe */}
        <div className="space-y-1.5">
          <label
            htmlFor="passwordConfirm"
            className="block text-sm font-medium text-[var(--text-primary)]"
          >
            Confirmer le mot de passe
          </label>
          <div className="relative">
            <input
              id="passwordConfirm"
              type={showPasswordConfirm ? "text" : "password"}
              autoComplete="new-password"
              placeholder="••••••••"
              className="w-full rounded-[var(--radius-lg)] border border-[var(--border-primary)] bg-[var(--bg-card)] px-4 py-2.5 pr-10 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] transition-colors focus:border-[var(--color-primary-500)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-500)]/20"
              {...register("passwordConfirm")}
            />
            <button
              type="button"
              onClick={() => setShowPasswordConfirm(!showPasswordConfirm)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
              tabIndex={-1}
            >
              {showPasswordConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {errors.passwordConfirm && (
            <p className="text-xs text-[var(--color-error)]">
              {errors.passwordConfirm.message}
            </p>
          )}
        </div>

        {/* Bouton d'inscription */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-[var(--radius-lg)] bg-[var(--color-primary-500)] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[var(--color-primary-600)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-500)]/40 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSubmitting ? (
            <span className="inline-flex items-center gap-2">
              <Loader2 size={16} className="animate-spin" />
              Création du compte...
            </span>
          ) : (
            "Créer mon compte"
          )}
        </button>
      </form>

      {/* Lien connexion */}
      <p className="text-center text-sm text-[var(--text-muted)]">
        Déjà un compte ?{" "}
        <Link
          href="/auth/login"
          className="font-medium text-[var(--color-primary-500)] hover:text-[var(--color-primary-600)] transition-colors"
        >
          Se connecter
        </Link>
      </p>
    </div>
  );
}

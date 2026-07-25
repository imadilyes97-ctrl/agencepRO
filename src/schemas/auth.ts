import { z } from "zod";

// ============================================================
// AUTH SCHEMAS — Validation client + server
// ============================================================

/** Schema de connexion. */
export const LoginSchema = z.object({
  email: z
    .string()
    .min(1, "L'adresse e-mail est requise")
    .email("Adresse e-mail invalide"),
  password: z
    .string()
    .min(1, "Le mot de passe est requis"),
});

export type LoginInput = z.infer<typeof LoginSchema>;

/** Schema d'inscription. */
export const RegisterSchema = z
  .object({
    nom: z
      .string()
      .min(2, "Le nom doit contenir au moins 2 caractères")
      .max(100, "Le nom ne doit pas dépasser 100 caractères")
      .regex(
        /^[a-zA-ZÀ-ÿ\s'-]+$/,
        "Le nom ne doit contenir que des lettres, espaces, tirets et apostrophes",
      ),
    prenom: z
      .string()
      .min(2, "Le prénom doit contenir au moins 2 caractères")
      .max(100, "Le prénom ne doit pas dépasser 100 caractères")
      .regex(
        /^[a-zA-ZÀ-ÿ\s'-]+$/,
        "Le prénom ne doit contenir que des lettres, espaces, tirets et apostrophes",
      ),
    email: z
      .string()
      .min(1, "L'adresse e-mail est requise")
      .email("Adresse e-mail invalide"),
    password: z
      .string()
      .min(8, "Le mot de passe doit contenir au moins 8 caractères")
      .max(128, "Le mot de passe ne doit pas dépasser 128 caractères")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        "Le mot de passe doit contenir au moins une minuscule, une majuscule et un chiffre",
      ),
    passwordConfirm: z
      .string()
      .min(1, "La confirmation du mot de passe est requise"),
    nomAgence: z
      .string()
      .min(2, "Le nom de l'agence doit contenir au moins 2 caractères")
      .max(200, "Le nom de l'agence ne doit pas dépasser 200 caractères")
      .optional()
      .or(z.literal("")),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    message: "Les mots de passe ne correspondent pas",
    path: ["passwordConfirm"],
  });

export type RegisterInput = z.infer<typeof RegisterSchema>;

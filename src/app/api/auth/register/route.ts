import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db";
import { RegisterSchema } from "@/schemas/auth";
import { ConflictError, ValidationError } from "@/lib/errors";
import type { RoleUser } from "@prisma/client";

// ============================================================
// POST /api/auth/register — Inscription
// ============================================================

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // 1. Validation Zod côté serveur
    const parsed = RegisterSchema.safeParse(body);
    if (!parsed.success) {
      const fieldErrors: Record<string, string[]> = {};
      parsed.error.issues.forEach((issue) => {
        const field = issue.path.join(".");
        if (!fieldErrors[field]) {
          fieldErrors[field] = [];
        }
        fieldErrors[field].push(issue.message);
      });
      return NextResponse.json(
        { error: "Données invalides", details: fieldErrors },
        { status: 400 },
      );
    }

    const { nom, prenom, email, password, nomAgence } = parsed.data;
    const emailNormalized = email.toLowerCase().trim();

    // 2. Vérifier si l'e-mail existe déjà
    const existingUser = await prisma.user.findUnique({
      where: { email: emailNormalized },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "Un compte avec cette adresse e-mail existe déjà" },
        { status: 409 },
      );
    }

    // 3. Hasher le mot de passe
    const passwordHash = await bcrypt.hash(password, 12);

    // 4. Déterminer le rôle et l'agence
    const agenceCount = await prisma.agence.count();
    const isFirstUser = agenceCount === 0;
    const userRole: RoleUser = isFirstUser ? "ADMIN" : "AGENT";

    // 5. Créer l'utilisateur et l'agence (si premier utilisateur) dans une transaction
    const result = await prisma.$transaction(async (tx) => {
      let agenceId: string;

      if (isFirstUser && nomAgence) {
        // Premier utilisateur : créer l'agence
        const agence = await tx.agence.create({
          data: {
            nom: nomAgence,
            nomCommercial: nomAgence,
            adresseSiege: "À définir",
            wilaya: "À définir",
            commune: "À définir",
            rcNumber: `RC-${Date.now()}`,
            nifNumber: `NIF-${Date.now()}`,
            telephoneFixe: "À définir",
            telephoneMobile: "À définir",
            email: emailNormalized,
            statut: "EN_ATTENTE_VERIFICATION",
          },
        });
        agenceId = agence.id;
      } else if (isFirstUser && !nomAgence) {
        // Premier utilisateur sans nom d'agence : on en crée un par défaut
        const agence = await tx.agence.create({
          data: {
            nom: "Mon Agence",
            nomCommercial: "Mon Agence",
            adresseSiege: "À définir",
            wilaya: "À définir",
            commune: "À définir",
            rcNumber: `RC-${Date.now()}`,
            nifNumber: `NIF-${Date.now()}`,
            telephoneFixe: "À définir",
            telephoneMobile: "À définir",
            email: emailNormalized,
            statut: "EN_ATTENTE_VERIFICATION",
          },
        });
        agenceId = agence.id;
      } else {
        // Utilisateurs suivants : doivent avoir une agence existante
        // Pour l'inscription publique, on crée une agence par défaut
        // En production, cette logique sera remplacée par une invitation depuis le dashboard
        const agence = await tx.agence.create({
          data: {
            nom: "Agence",
            nomCommercial: "Agence",
            adresseSiege: "À définir",
            wilaya: "À définir",
            commune: "À définir",
            rcNumber: `RC-${Date.now()}`,
            nifNumber: `NIF-${Date.now()}`,
            telephoneFixe: "À définir",
            telephoneMobile: "À définir",
            email: emailNormalized,
            statut: "EN_ATTENTE_VERIFICATION",
          },
        });
        agenceId = agence.id;
      }

      // Créer l'utilisateur
      const user = await tx.user.create({
        data: {
          agenceId,
          email: emailNormalized,
          nom: nom.trim(),
          prenom: prenom.trim(),
          passwordHash,
          role: userRole,
          statut: "ACTIF",
        },
        select: {
          id: true,
          nom: true,
          prenom: true,
          email: true,
          role: true,
          agenceId: true,
          createdAt: true,
        },
      });

      // Créer l'assignment utilisateur-agence
      await tx.userAgenceAssignment.create({
        data: {
          userId: user.id,
          agenceId,
          role: userRole,
          estPrincipal: true,
        },
      });

      return user;
    });

    // 6. Retourner l'utilisateur créé (sans le mot de passe)
    return NextResponse.json(
      {
        message: "Compte créé avec succès",
        user: result,
      },
      { status: 201 },
    );
  } catch (error) {
    // Gérer les erreurs connues
    if (error instanceof ConflictError) {
      return NextResponse.json(
        { error: error.message },
        { status: error.statusCode },
      );
    }

    if (error instanceof ValidationError) {
      return NextResponse.json(
        { error: error.message, details: error.details },
        { status: error.statusCode },
      );
    }

    console.error("[REGISTER]", error);
    return NextResponse.json(
      { error: "Une erreur interne est survenue. Veuillez réessayer." },
      { status: 500 },
    );
  }
}

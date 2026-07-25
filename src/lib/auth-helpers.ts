import { auth } from "./auth";
import { UnauthorizedError, ForbiddenError } from "./errors";
import type { RoleUser } from "@prisma/client";

// ============================================================
// AUTH HELPERS — Fonctions utilitaires pour les Server Components
// ============================================================

/**
 * Récupère l'utilisateur connecté depuis la session.
 * Retourne null si non authentifié (ne lève pas d'erreur).
 */
export async function getCurrentUser() {
  const session = await auth();

  if (!session?.user) {
    return null;
  }

  return {
    id: session.user.id,
    email: session.user.email,
    nom: session.user.nom,
    prenom: session.user.prenom,
    role: session.user.role,
    agenceId: session.user.agenceId,
  };
}

/**
 * Vérifie qu'un utilisateur est authentifié.
 * Lève UnauthorizedError si non connecté.
 */
export async function requireAuth() {
  const user = await getCurrentUser();

  if (!user) {
    throw new UnauthorizedError("Vous devez être connecté pour accéder à cette ressource");
  }

  return user;
}

/**
 * Vérifie qu'un utilisateur a le rôle requis.
 * Lève UnauthorizedError si non connecté, ForbiddenError si mauvais rôle.
 */
export async function requireRole(role: RoleUser) {
  const user = await requireAuth();

  if (user.role !== role) {
    throw new ForbiddenError(
      `Cette action requiert le rôle "${role}". Votre rôle actuel est "${user.role}".`,
    );
  }

  return user;
}

/**
 * Vérifie qu'un utilisateur a l'un des rôles autorisés.
 * Lève UnauthorizedError si non connecté, ForbiddenError si aucun rôle ne correspond.
 */
export async function requireAnyRole(roles: RoleUser[]) {
  const user = await requireAuth();

  if (!roles.includes(user.role)) {
    throw new ForbiddenError(
      `Cette action requiert l'un des rôles : ${roles.join(", ")}. Votre rôle actuel est "${user.role}".`,
    );
  }

  return user;
}

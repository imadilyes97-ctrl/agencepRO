import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "./db";
import { LoginSchema } from "@/schemas/auth";
import type { RoleUser } from "@prisma/client";

// ============================================================
// NEXTAUTH v5 — Configuration Agence Pro
// ============================================================

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      nom: string;
      prenom: string;
      role: RoleUser;
      agenceId: string;
    };
  }

  interface User {
    id: string;
    email: string;
    nom: string;
    prenom: string;
    role: RoleUser;
    agenceId: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    email: string;
    nom: string;
    prenom: string;
    role: RoleUser;
    agenceId: string;
  }
}

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "E-mail", type: "email" },
        password: { label: "Mot de passe", type: "password" },
      },
      async authorize(credentials) {
        // Validation Zod côté serveur
        const parsed = LoginSchema.safeParse(credentials);
        if (!parsed.success) {
          return null;
        }

        const { email, password } = parsed.data;

        // Rechercher l'utilisateur
        const user = await prisma.user.findUnique({
          where: { email: email.toLowerCase() },
          select: {
            id: true,
            email: true,
            nom: true,
            prenom: true,
            role: true,
            agenceId: true,
            passwordHash: true,
            statut: true,
          },
        });

        if (!user) {
          return null;
        }

        if (user.statut !== "ACTIF") {
          return null;
        }

        // Vérifier le mot de passe
        const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
        if (!isPasswordValid) {
          return null;
        }

        // Mettre à jour la dernière connexion
        await prisma.user.update({
          where: { id: user.id },
          data: { derniereConnexion: new Date() },
        });

        return {
          id: user.id,
          email: user.email,
          nom: user.nom,
          prenom: user.prenom,
          role: user.role,
          agenceId: user.agenceId,
        };
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 jours
  },
  pages: {
    signIn: "/auth/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      // Premier appel : l'utilisateur vient de se connecter
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.nom = user.nom;
        token.prenom = user.prenom;
        token.role = user.role;
        token.agenceId = user.agenceId;
      }
      return token;
    },
    async session({ session, token }) {
      // Transférer les données du JWT vers la session
      session.user.id = token.id;
      session.user.email = token.email;
      session.user.nom = token.nom;
      session.user.prenom = token.prenom;
      session.user.role = token.role;
      session.user.agenceId = token.agenceId;
      return session;
    },
  },
  secret: process.env.AUTH_SECRET,
});

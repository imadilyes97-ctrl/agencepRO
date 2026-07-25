import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// ============================================================
// MIDDLEWARE — Protection des routes + résolution tenant
// ============================================================

/** Routes publiques (pas besoin d'authentification). */
const PUBLIC_PATHS = [
  "/",
  "/auth/login",
  "/auth/register",
  "/api/health",
  "/api/auth",
  "/portal",
];

/**
 * Détermine si un chemin est public.
 */
function isPublicPath(pathname: string): boolean {
  return PUBLIC_PATHS.some(
    (p) => pathname === p || pathname.startsWith(p + "/"),
  );
}

/**
 * Middleware principal :
 * - Laisse passer les routes publiques
 * - Redirige vers /auth/login si pas de session cookie NextAuth
 * - Laisse passer le reste avec le cookie de session
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Routes publiques : pas de vérification
  if (isPublicPath(pathname)) {
    return NextResponse.next();
  }

  // Vérifier la présence du cookie de session NextAuth v5
  // NextAuth v5 utilise "authjs.session-token" en production
  // et "authjs.csrf-token" pour le CSRF
  const sessionToken =
    request.cookies.get("authjs.session-token")?.value ??
    request.cookies.get("__Secure-authjs.session-token")?.value;

  if (!sessionToken) {
    const loginUrl = new URL("/auth/login", request.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Matcher :
     * - Toutes les routes sauf fichiers statiques et images
     * - Exclut _next/static, _next/image, favicon.ico, images
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.png$|.*\\.jpg$|.*\\.svg$).*)",
  ],
};

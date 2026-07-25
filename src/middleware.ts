import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Middleware: route protection + tenant resolution.
 *
 * - /api/health is public.
 * - /auth/* is public.
 * - /portal/* is public (client portal with token).
 * - Everything else requires an auth cookie.
 *
 * Full auth with NextAuth v5 will replace this in Phase 4.
 */

const PUBLIC_PATHS = ["/", "/auth/login", "/auth/register", "/api/health", "/portal"];

function isPublicPath(pathname: string): boolean {
  return PUBLIC_PATHS.some(
    (p) => pathname === p || pathname.startsWith(p + "/"),
  );
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow public paths
  if (isPublicPath(pathname)) {
    return NextResponse.next();
  }

  // Check for session cookie (placeholder — will be NextAuth sessionToken)
  const session = request.cookies.get("session-token");
  if (!session) {
    const loginUrl = new URL("/auth/login", request.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.png$).*)"],
};

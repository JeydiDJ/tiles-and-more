import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { getAdminBasePath, getAdminRoute, isDefaultAdminPath } from "./src/lib/admin-path";
import { updateSupabaseSession } from "./src/lib/supabase/middleware";

function copyCookies(from: NextResponse, to: NextResponse) {
  from.cookies.getAll().forEach((cookie) => {
    to.cookies.set(cookie);
  });

  return to;
}

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const adminBasePath = getAdminBasePath();
  const adminLoginPath = getAdminRoute("/login");
  const adminManifestPath = getAdminRoute("/manifest");
  const isSecretAdminPath = pathname === adminBasePath || pathname.startsWith(`${adminBasePath}/`);
  const isSecretLoginPath = pathname === adminLoginPath;
  const isSecretManifestPath = pathname === adminManifestPath;
  const isInternalAdminPath = pathname === "/admin" || pathname.startsWith("/admin/");
  const isInternalLoginPath = pathname === "/admin-login";
  const isInternalFrameworkLoginPath = pathname === "/login";
  const isInternalManifestPath = pathname === "/manifest";

  function applyAdminSecurityHeaders(response: NextResponse) {
    response.headers.set("Cache-Control", "no-store, no-cache, must-revalidate");
    response.headers.set("Pragma", "no-cache");
    response.headers.set("X-Robots-Tag", "noindex, nofollow, noarchive");
    return response;
  }

  if (isDefaultAdminPath(pathname)) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  if (isInternalLoginPath) {
    return NextResponse.redirect(new URL(adminLoginPath, request.url));
  }

  if (isInternalFrameworkLoginPath) {
    return NextResponse.redirect(new URL(adminLoginPath, request.url));
  }

  if (isInternalManifestPath) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  if (isSecretManifestPath) {
    return applyAdminSecurityHeaders(NextResponse.next());
  }

  if (isSecretAdminPath || isInternalAdminPath) {
    const { response, user } = await updateSupabaseSession(request);

    if (!(isSecretLoginPath || isInternalLoginPath) && !user) {
      const redirectResponse = NextResponse.redirect(new URL(adminLoginPath, request.url));
      return applyAdminSecurityHeaders(copyCookies(response, redirectResponse));
    }

    if ((isSecretLoginPath || isInternalLoginPath) && user) {
      const redirectResponse = NextResponse.redirect(new URL(adminBasePath, request.url));
      return applyAdminSecurityHeaders(copyCookies(response, redirectResponse));
    }

    return applyAdminSecurityHeaders(response);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon|.*\\..*).*)"],
};

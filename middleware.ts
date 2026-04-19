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
  const isSecretAdminPath = pathname === adminBasePath || pathname.startsWith(`${adminBasePath}/`);
  const isSecretLoginPath = pathname === adminLoginPath;
  const isInternalAdminPath = pathname === "/admin" || pathname.startsWith("/admin/");
  const isInternalLoginPath = pathname === "/admin-login";

  if (isDefaultAdminPath(pathname)) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  if (isInternalLoginPath) {
    return NextResponse.redirect(new URL(adminLoginPath, request.url));
  }

  if (isSecretAdminPath || isInternalAdminPath) {
    const { response, user } = await updateSupabaseSession(request);

    if (!(isSecretLoginPath || isInternalLoginPath) && !user) {
      const redirectResponse = NextResponse.redirect(new URL(adminLoginPath, request.url));
      return copyCookies(response, redirectResponse);
    }

    if ((isSecretLoginPath || isInternalLoginPath) && user) {
      const redirectResponse = NextResponse.redirect(new URL(adminBasePath, request.url));
      return copyCookies(response, redirectResponse);
    }

    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon|.*\\..*).*)"],
};

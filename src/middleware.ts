import createMiddleware from "next-intl/middleware";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { routing } from "./i18n/routing";

const protectedRoutes = ["/es/dashboard", "/en/dashboard"];

const intlMiddleware = createMiddleware(routing);

export function middleware(request: NextRequest) {
  const token = request.cookies.get("auth-token")?.value;
  const pathname = request.nextUrl.pathname;

  const isProtected = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  // Permitir acceso sin cookie solo si el preview token secreto coincide
  if (isProtected && !token) {
    const previewToken = request.nextUrl.searchParams.get("preview");
    const secret = process.env.PREVIEW_SECRET;
    if (secret && previewToken === secret) {
      return intlMiddleware(request);
    }
    const loginUrl = new URL("/", request.url);
    return NextResponse.redirect(loginUrl);
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: "/((?!api|trpc|_next|_vercel|.*\\..*).*)",
};

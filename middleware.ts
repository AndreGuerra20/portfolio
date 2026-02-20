import { NextRequest, NextResponse } from "next/server";
import { COOKIE_NAME } from "@/lib/admin-constants";

function secureHeaders(response: NextResponse) {

  // Set security headers for all responses
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
  return response;
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/admin/dashboard") || pathname.startsWith("/api/admin/metrics")) {
    const token = request.cookies.get(COOKIE_NAME)?.value;

    if (!token) {
      if (pathname.startsWith("/api/")) {
        return secureHeaders(NextResponse.json({ message: "Não autorizado." }, { status: 401 }));
      }

      const loginUrl = new URL("/admin", request.url);
      loginUrl.searchParams.set("next", pathname);
      return secureHeaders(NextResponse.redirect(loginUrl));
    }
  }

  return secureHeaders(NextResponse.next());
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};

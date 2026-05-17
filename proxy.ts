import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PUBLIC = ["/", "/login", "/signup"];

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  if (PUBLIC.some((p) => pathname === p || pathname.startsWith("/api"))) {
    return NextResponse.next();
  }
  const auth = req.cookies.get("patentos_auth");
  if (!auth) {
    return NextResponse.redirect(new URL("/login", req.url));
  }
  return NextResponse.next();
}

export const config = { matcher: ["/dashboard/:path*"] };

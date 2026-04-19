import { type NextRequest, NextResponse } from "next/server";

const PROTECTED = ["/dashboard"];
const PUBLIC_WITH_REDIRECT = ["/", "/login"];

export async function proxy(req: NextRequest) {
  const path = req.nextUrl.pathname;
  const token = req.cookies.get("clura_token")?.value;

  if (PROTECTED.some((r) => path.startsWith(r)) && !token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  if (PUBLIC_WITH_REDIRECT.includes(path) && token) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.png$).*)"],
};

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { SESSION_COOKIE, verifyToken } from "@/lib/session";

// Next 16 renames this convention to `proxy.ts` (export `proxy` instead of `middleware`).
export async function middleware(request: NextRequest) {
  const userId = await verifyToken(request.cookies.get(SESSION_COOKIE)?.value);

  if (!userId) {
    // Logged-out visitors go to the landing page with the login pop-up open
    return NextResponse.redirect(new URL("/?auth=login", request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};

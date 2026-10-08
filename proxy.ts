import { NextResponse, type NextRequest } from "next/server";

/**
 * First visit: remember the visitor's region from the IP country (Vercel sets the header), so the
 * inline script in app/layout.tsx shows the right currency before first paint. The header chooser
 * overwrites the cookie; without the header (local dev) the script falls back to the time zone.
 */
export function proxy(request: NextRequest) {
  if (request.cookies.has("zarkoony-region")) return;
  const country = request.headers.get("x-vercel-ip-country");
  if (!country) return;
  const response = NextResponse.next();
  response.cookies.set("zarkoony-region", country === "PK" ? "PK" : "US", {
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
    sameSite: "lax",
  });
  return response;
}

export const config = {
  // Pages only: skip Next internals, images and the well-known files.
  matcher: ["/((?!_next/|images/|favicon\.ico|robots\.txt|sitemap\.xml).*)"],
};

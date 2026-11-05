import type { NextRequest } from "next/server";

import { auth } from "@/lib/auth/server";

const protect = auth.middleware({ loginUrl: "/sign-in" });

export async function proxy(request: NextRequest) {
  const response = await protect(request);
  const location = response.headers.get("location");

  if (response.status >= 300 && response.status < 400 && location) {
    const redirectUrl = new URL(location);
    if (redirectUrl.pathname === "/sign-in" && !redirectUrl.searchParams.has("returnTo")) {
      redirectUrl.searchParams.set(
        "returnTo",
        `${request.nextUrl.pathname}${request.nextUrl.search}`,
      );
      response.headers.set("location", redirectUrl.toString());
    }
  }

  return response;
}

export const config = {
  matcher: ["/invoices/:path*", "/exports/:path*"],
};

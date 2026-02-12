import { NextResponse, NextRequest } from "next/server";

const RESERVED_PATHS = new Set([
  "api",
  "dashboard",
  "signin",
  "signup",
  "forgot-password",
  "reset-password",
  "error",
  "about",
  "features",
  "pricing",
  "settings",
  "admin",
  "blog",
  "help",
  "support",
  "terms",
  "privacy",
  "_next",
  "favicon.ico",
  "sitemap.xml",
  "robots.txt",
  "opengraph-image",
  "twitter-image",
  "icon",
  "apple-icon",
]);

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const slug = pathname.slice(1);

  // Skip if not a potential slug
  if (!slug || slug.includes("/") || RESERVED_PATHS.has(slug.split("/")[0])) {
    return NextResponse.next();
  }

  try {
    const resolveUrl = new URL("/api/links/resolve", request.nextUrl.origin);
    resolveUrl.searchParams.set("slug", slug);

    const response = await fetch(resolveUrl.toString(), { method: "GET" });

    if (!response.ok) {
      return NextResponse.next();
    }

    const { originalUrl, linkId } = await response.json();

    // Fire-and-forget: track the click asynchronously
    const trackUrl = new URL("/api/track", request.nextUrl.origin);
    fetch(trackUrl.toString(), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        linkId,
        slug,
        ip: request.headers.get("x-forwarded-for") || null,
        userAgent: request.headers.get("user-agent") || null,
        referer: request.headers.get("referer") || null,
        country: request.headers.get("x-vercel-ip-country") || null,
        city: request.headers.get("x-vercel-ip-city") || null,
      }),
    }).catch(() => {
      // Silently ignore tracking errors
    });

    return NextResponse.redirect(originalUrl, 301);
  } catch {
    return NextResponse.next();
  }
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|icon|apple-icon|opengraph-image|twitter-image).*)",
  ],
};

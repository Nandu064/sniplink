import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Link from "@/models/Link";
import Click from "@/models/Click";
import { parseUserAgent, hashIp, extractRefererDomain } from "@/lib/analytics";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  try {
    await connectDB();

    const link = await Link.findOne({ slug, isActive: true }).lean();

    if (!link) {
      return NextResponse.redirect(new URL("/", request.nextUrl.origin));
    }

    if (link.expiresAt && new Date(link.expiresAt) < new Date()) {
      return NextResponse.redirect(new URL("/", request.nextUrl.origin));
    }

    // Track the click (fire-and-forget, don't block redirect)
    const userAgent = request.headers.get("user-agent") || null;
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || null;
    const referer = request.headers.get("referer") || null;
    const country = request.headers.get("x-vercel-ip-country") || null;
    const city = request.headers.get("x-vercel-ip-city") || null;

    const parsed = userAgent ? parseUserAgent(userAgent) : { browser: null, os: null, device: "unknown" };

    // Don't await — fire-and-forget to avoid delaying the redirect
    Promise.all([
      Click.create({
        linkId: link._id,
        ip: ip ? hashIp(ip) : null,
        userAgent,
        referer,
        country,
        city,
        device: parsed.device,
        browser: parsed.browser,
        os: parsed.os,
        refererDomain: extractRefererDomain(referer),
      }),
      Link.updateOne({ _id: link._id }, { $inc: { totalClicks: 1 } }),
    ]).catch(() => {
      // Silently ignore tracking errors
    });

    return NextResponse.redirect(link.originalUrl, 301);
  } catch {
    return NextResponse.redirect(new URL("/", request.nextUrl.origin));
  }
}

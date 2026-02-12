import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Link from "@/models/Link";
import Click from "@/models/Click";
import { parseUserAgent, hashIp, extractRefererDomain } from "@/lib/analytics";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { linkId, ip, userAgent, referer, country, city } = body;

    if (!linkId) {
      return NextResponse.json({ error: "linkId required" }, { status: 400 });
    }

    await connectDB();

    const parsed = userAgent ? parseUserAgent(userAgent) : { browser: null, os: null, device: "unknown" };
    const hashedIp = ip ? hashIp(ip) : null;
    const refererDomain = extractRefererDomain(referer);

    await Promise.all([
      Click.create({
        linkId,
        ip: hashedIp,
        userAgent,
        referer,
        country: country || null,
        city: city || null,
        device: parsed.device,
        browser: parsed.browser,
        os: parsed.os,
        refererDomain,
      }),
      Link.updateOne({ _id: linkId }, { $inc: { totalClicks: 1 } }),
    ]);

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}

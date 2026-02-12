import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Link from "@/models/Link";

export async function GET(request: NextRequest) {
  try {
    const slug = request.nextUrl.searchParams.get("slug");
    if (!slug) {
      return NextResponse.json({ error: "Slug is required" }, { status: 400 });
    }

    await connectDB();

    const link = await Link.findOne({ slug, isActive: true }).lean();
    if (!link) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    if (link.expiresAt && new Date(link.expiresAt) < new Date()) {
      return NextResponse.json({ error: "Link expired" }, { status: 410 });
    }

    return NextResponse.json({
      originalUrl: link.originalUrl,
      linkId: link._id.toString(),
    });
  } catch {
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import Link from "@/models/Link";
import { BASE_URL } from "@/lib/constants";

// GET public pinned links for a username
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ username: string }> }
) {
  try {
    const { username } = await params;

    await connectDB();

    const user = await User.findOne({ username: username.toLowerCase() }).lean();
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const links = await Link.find({
      userId: user._id,
      pinnedToBio: true,
      isActive: true,
    })
      .sort({ updatedAt: -1 })
      .lean();

    const result = links.map((link) => ({
      slug: link.slug,
      shortUrl: `${BASE_URL}/${link.slug}`,
      title: link.title,
      originalUrl: link.originalUrl,
      totalClicks: link.totalClicks,
    }));

    return NextResponse.json(result);
  } catch {
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}

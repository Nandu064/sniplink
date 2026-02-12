import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import Link from "@/models/Link";
import { createLinkSchema } from "@/lib/validations";
import { generateSlug } from "@/lib/utils";
import { RESERVED_SLUGS, LINKS_PER_PAGE, BASE_URL } from "@/lib/constants";
import { apiLimiter } from "@/lib/rate-limit";

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
    const limit = Math.min(50, parseInt(searchParams.get("limit") || String(LINKS_PER_PAGE)));
    const search = searchParams.get("search") || "";

    await connectDB();

    const filter: Record<string, unknown> = { userId: session.user.id };
    if (search) {
      filter.$or = [
        { slug: { $regex: search, $options: "i" } },
        { title: { $regex: search, $options: "i" } },
        { originalUrl: { $regex: search, $options: "i" } },
      ];
    }

    const [links, total] = await Promise.all([
      Link.find(filter)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
      Link.countDocuments(filter),
    ]);

    const data = links.map((link) => ({
      id: link._id.toString(),
      originalUrl: link.originalUrl,
      slug: link.slug,
      shortUrl: `${BASE_URL}/${link.slug}`,
      customAlias: link.customAlias,
      title: link.title,
      totalClicks: link.totalClicks,
      isActive: link.isActive,
      expiresAt: link.expiresAt?.toISOString() || null,
      createdAt: link.createdAt.toISOString(),
      updatedAt: link.updatedAt.toISOString(),
    }));

    return NextResponse.json({
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    });
  } catch {
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const limited = apiLimiter(request);
  if (limited) return limited;

  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const result = createLinkSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error.issues[0].message },
        { status: 400 }
      );
    }

    const { url, slug: customSlug, title, expiresAt } = result.data;

    await connectDB();

    let slug: string;
    let customAlias = false;

    if (customSlug) {
      if (RESERVED_SLUGS.has(customSlug.toLowerCase())) {
        return NextResponse.json(
          { error: "This slug is reserved and cannot be used" },
          { status: 400 }
        );
      }

      const existing = await Link.findOne({ slug: customSlug });
      if (existing) {
        return NextResponse.json(
          { error: "This slug is already taken" },
          { status: 409 }
        );
      }

      slug = customSlug;
      customAlias = true;
    } else {
      slug = generateSlug();
      while (await Link.findOne({ slug })) {
        slug = generateSlug();
      }
    }

    const link = await Link.create({
      userId: session.user.id,
      originalUrl: url,
      slug,
      customAlias,
      title: title || null,
      expiresAt: expiresAt ? new Date(expiresAt) : null,
    });

    return NextResponse.json(
      {
        id: link._id.toString(),
        originalUrl: link.originalUrl,
        slug: link.slug,
        shortUrl: `${BASE_URL}/${link.slug}`,
        customAlias: link.customAlias,
        title: link.title,
        totalClicks: link.totalClicks,
        isActive: link.isActive,
        expiresAt: link.expiresAt?.toISOString() || null,
        createdAt: link.createdAt.toISOString(),
        updatedAt: link.updatedAt.toISOString(),
      },
      { status: 201 }
    );
  } catch {
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}

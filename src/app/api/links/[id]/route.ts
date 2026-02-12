import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import Link from "@/models/Link";
import Click from "@/models/Click";
import { updateLinkSchema } from "@/lib/validations";
import { RESERVED_SLUGS, BASE_URL } from "@/lib/constants";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid link ID" }, { status: 400 });
    }

    await connectDB();

    const link = await Link.findOne({ _id: id, userId: session.user.id }).lean();
    if (!link) {
      return NextResponse.json({ error: "Link not found" }, { status: 404 });
    }

    return NextResponse.json({
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
    });
  } catch {
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid link ID" }, { status: 400 });
    }

    const body = await request.json();
    const result = updateLinkSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error.issues[0].message },
        { status: 400 }
      );
    }

    await connectDB();

    const link = await Link.findOne({ _id: id, userId: session.user.id });
    if (!link) {
      return NextResponse.json({ error: "Link not found" }, { status: 404 });
    }

    const updates = result.data;

    if (updates.slug && updates.slug !== link.slug) {
      if (RESERVED_SLUGS.has(updates.slug.toLowerCase())) {
        return NextResponse.json(
          { error: "This slug is reserved" },
          { status: 400 }
        );
      }

      const existing = await Link.findOne({ slug: updates.slug });
      if (existing) {
        return NextResponse.json(
          { error: "This slug is already taken" },
          { status: 409 }
        );
      }
    }

    Object.assign(link, updates);
    await link.save();

    return NextResponse.json({
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
    });
  } catch {
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid link ID" }, { status: 400 });
    }

    await connectDB();

    const link = await Link.findOneAndDelete({ _id: id, userId: session.user.id });
    if (!link) {
      return NextResponse.json({ error: "Link not found" }, { status: 404 });
    }

    await Click.deleteMany({ linkId: id });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}

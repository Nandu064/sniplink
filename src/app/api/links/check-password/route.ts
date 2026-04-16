import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Link from "@/models/Link";
import bcrypt from "bcryptjs";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { slug, password } = body;

    if (!slug || !password) {
      return NextResponse.json(
        { error: "Slug and password are required" },
        { status: 400 }
      );
    }

    await connectDB();

    const link = await Link.findOne({ slug, isActive: true })
      .select("+passwordHash")
      .lean();

    if (!link) {
      return NextResponse.json({ error: "Link not found" }, { status: 404 });
    }

    if (!link.passwordProtected || !link.passwordHash) {
      return NextResponse.json(
        { error: "This link is not password protected" },
        { status: 400 }
      );
    }

    const isMatch = await bcrypt.compare(password, link.passwordHash);

    if (!isMatch) {
      return NextResponse.json(
        { error: "Incorrect password" },
        { status: 401 }
      );
    }

    return NextResponse.json({ destinationUrl: link.originalUrl });
  } catch {
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}

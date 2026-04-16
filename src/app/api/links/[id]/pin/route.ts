import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import Link from "@/models/Link";

// POST toggle pinnedToBio for a link
export async function POST(
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

    const link = await Link.findOne({ _id: id, userId: session.user.id });
    if (!link) {
      return NextResponse.json({ error: "Link not found" }, { status: 404 });
    }

    link.pinnedToBio = !link.pinnedToBio;
    await link.save();

    return NextResponse.json({ pinnedToBio: link.pinnedToBio });
  } catch {
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}

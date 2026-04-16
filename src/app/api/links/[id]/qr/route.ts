import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import Link from "@/models/Link";
import { BASE_URL } from "@/lib/constants";
import QRCode from "qrcode";

export async function GET(
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

    await connectDB();

    const link = await Link.findOne({ _id: id, userId: session.user.id }).lean();
    if (!link) {
      return NextResponse.json({ error: "Link not found" }, { status: 404 });
    }

    const shortUrl = `${BASE_URL}/${link.slug}`;
    const format = request.nextUrl.searchParams.get("format");

    const qrOptions = {
      width: 400,
      margin: 2,
      color: {
        dark: "#7C3AED",
        light: "#FFFFFF",
      },
    };

    if (format === "svg") {
      const svg = await QRCode.toString(shortUrl, {
        ...qrOptions,
        type: "svg",
      });

      return new NextResponse(svg, {
        headers: {
          "Content-Type": "image/svg+xml",
          "Cache-Control": "public, max-age=3600",
        },
      });
    }

    const buffer = await QRCode.toBuffer(shortUrl, {
      ...qrOptions,
      type: "png",
    });

    return new NextResponse(new Uint8Array(buffer), {
      headers: {
        "Content-Type": "image/png",
        "Cache-Control": "public, max-age=3600",
      },
    });
  } catch {
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import { BCRYPT_SALT_ROUNDS } from "@/lib/constants";
import { apiLimiter } from "@/lib/rate-limit";

// GET user profile
export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const user = await User.findById(session.user.id).lean();
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      plan: user.plan ?? "free",
      createdAt: user.createdAt.toISOString(),
    });
  } catch {
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}

// PATCH update profile
export async function PATCH(request: NextRequest) {
  const limited = apiLimiter(request);
  if (limited) return limited;

  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { name, currentPassword, newPassword } = body;

    await connectDB();

    const user = await User.findById(session.user.id).select("+password");
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Update name
    if (name && typeof name === "string" && name.trim().length >= 2) {
      user.name = name.trim();
    }

    // Update password
    if (newPassword) {
      if (!currentPassword) {
        return NextResponse.json(
          { error: "Current password is required" },
          { status: 400 }
        );
      }

      if (typeof newPassword !== "string" || newPassword.length < 8) {
        return NextResponse.json(
          { error: "New password must be at least 8 characters" },
          { status: 400 }
        );
      }

      const isValid = await bcrypt.compare(currentPassword, user.password);
      if (!isValid) {
        return NextResponse.json(
          { error: "Current password is incorrect" },
          { status: 400 }
        );
      }

      user.password = await bcrypt.hash(newPassword, BCRYPT_SALT_ROUNDS);
    }

    await user.save();

    return NextResponse.json({
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      createdAt: user.createdAt.toISOString(),
    });
  } catch {
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}

// DELETE account
export async function DELETE() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    // Import models to delete associated data
    const Link = (await import("@/models/Link")).default;
    const Click = (await import("@/models/Click")).default;

    // Get all user's links to delete their clicks
    const userLinks = await Link.find({ userId: session.user.id }).select("_id").lean();
    const linkIds = userLinks.map((l) => l._id);

    // Delete all clicks, links, and the user
    await Promise.all([
      Click.deleteMany({ linkId: { $in: linkIds } }),
      Link.deleteMany({ userId: session.user.id }),
      User.findByIdAndDelete(session.user.id),
    ]);

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}

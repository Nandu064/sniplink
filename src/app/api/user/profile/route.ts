import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import User from "@/models/User";

const USERNAME_REGEX = /^[a-z0-9_-]{3,30}$/;

// GET current user's profile (username, bio, displayName)
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
      username: user.username ?? null,
      bio: user.bio ?? null,
      displayName: user.displayName ?? null,
      plan: user.plan ?? "free",
    });
  } catch {
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}

// PATCH update username, bio, displayName
export async function PATCH(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { username, bio, displayName } = body;

    await connectDB();

    const user = await User.findById(session.user.id);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Validate and update username
    if (username !== undefined) {
      if (username === null || username === "") {
        user.username = null;
      } else {
        const trimmed = username.trim().toLowerCase();
        if (!USERNAME_REGEX.test(trimmed)) {
          return NextResponse.json(
            {
              error:
                "Username must be 3–30 characters and contain only letters, numbers, underscores, or hyphens",
            },
            { status: 400 }
          );
        }

        // Check uniqueness (exclude self)
        const existing = await User.findOne({
          username: trimmed,
          _id: { $ne: session.user.id },
        }).lean();

        if (existing) {
          return NextResponse.json(
            { error: "Username is already taken" },
            { status: 409 }
          );
        }

        user.username = trimmed;
      }
    }

    if (bio !== undefined) {
      user.bio = bio ? String(bio).slice(0, 200) : null;
    }

    if (displayName !== undefined) {
      user.displayName = displayName ? String(displayName).slice(0, 100) : null;
    }

    await user.save();

    return NextResponse.json({
      id: user._id.toString(),
      username: user.username ?? null,
      bio: user.bio ?? null,
      displayName: user.displayName ?? null,
      plan: user.plan ?? "free",
    });
  } catch {
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}

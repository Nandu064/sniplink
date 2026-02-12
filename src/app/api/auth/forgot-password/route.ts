import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import PasswordReset from "@/models/PasswordReset";
import { sendPasswordResetEmail } from "@/lib/email";
import { passwordResetLimiter } from "@/lib/rate-limit";

export async function POST(request: NextRequest) {
  const limited = passwordResetLimiter(request);
  if (limited) return limited;

  try {
    const { email } = await request.json();

    if (!email || typeof email !== "string") {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    await connectDB();

    const user = await User.findOne({ email: email.toLowerCase() });

    // Always return success to prevent email enumeration
    if (!user) {
      return NextResponse.json({
        message: "If an account exists with that email, you will receive a password reset link.",
      });
    }

    // Invalidate any existing reset tokens for this email
    await PasswordReset.updateMany(
      { email: email.toLowerCase(), used: false },
      { used: true }
    );

    // Generate a secure token
    const token = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    await PasswordReset.create({
      email: email.toLowerCase(),
      token,
      expiresAt,
    });

    // Send the email
    try {
      await sendPasswordResetEmail(email.toLowerCase(), token);
    } catch (emailError) {
      console.error("Failed to send password reset email:", emailError);
      // Don't expose email sending failures to the client
    }

    return NextResponse.json({
      message: "If an account exists with that email, you will receive a password reset link.",
    });
  } catch {
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}

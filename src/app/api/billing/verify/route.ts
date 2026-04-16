import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { stripe } from "@/lib/stripe";
import { connectDB } from "@/lib/db";
import User from "@/models/User";

// Called after Stripe checkout success to immediately sync plan to DB
export async function POST() {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await connectDB();
  const user = await User.findById(session.user.id).select("+stripeCustomerId");
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  if (!user.stripeCustomerId) {
    return NextResponse.json({ plan: "free" });
  }

  try {
    const subscriptions = await stripe.subscriptions.list({
      customer: user.stripeCustomerId,
      status: "active",
      limit: 1,
    });

    const isPro = subscriptions.data.length > 0;
    if (isPro && user.plan !== "pro") {
      await User.findByIdAndUpdate(user._id, { plan: "pro" });
    }

    return NextResponse.json({ plan: isPro ? "pro" : "free" });
  } catch {
    return NextResponse.json({ plan: user.plan ?? "free" });
  }
}

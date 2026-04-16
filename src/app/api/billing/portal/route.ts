import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { stripe } from "@/lib/stripe";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import { BASE_URL } from "@/lib/constants";

export async function POST(request: NextRequest) {
  void request;
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await connectDB();
  const user = await User.findById(session.user.id).select("+stripeCustomerId");
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  if (!user.stripeCustomerId) {
    return NextResponse.json({ error: "No billing account found" }, { status: 400 });
  }

  const portalSession = await stripe.billingPortal.sessions.create({
    customer: user.stripeCustomerId,
    return_url: `${BASE_URL}/dashboard/settings`,
  });

  return NextResponse.json({ url: portalSession.url });
}

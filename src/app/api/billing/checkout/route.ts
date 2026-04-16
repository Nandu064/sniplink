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

  let customerId = user.stripeCustomerId;
  if (!customerId) {
    const customer = await stripe.customers.create({
      email: user.email,
      name: user.name,
      metadata: { userId: user._id.toString() },
    });
    customerId = customer.id;
    await User.findByIdAndUpdate(user._id, { stripeCustomerId: customerId });
  }

  const checkoutSession = await stripe.checkout.sessions.create({
    customer: customerId,
    mode: "subscription",
    line_items: [{ price: process.env.STRIPE_PRO_PRICE_ID!, quantity: 1 }],
    success_url: `${BASE_URL}/dashboard/settings?upgraded=true`,
    cancel_url: `${BASE_URL}/pricing`,
    metadata: { userId: user._id.toString() },
  });

  return NextResponse.json({ url: checkoutSession.url });
}

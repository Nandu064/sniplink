import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { connectDB } from "@/lib/db";
import User from "@/models/User";

export async function POST(request: NextRequest) {
  const body = await request.text();
  const sig = request.headers.get("stripe-signature")!;

  let event: ReturnType<typeof stripe.webhooks.constructEvent>;
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch {
    return NextResponse.json({ error: "Webhook signature invalid" }, { status: 400 });
  }

  await connectDB();

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as {
      metadata?: { userId?: string };
      customer?: string;
      subscription?: string;
    };
    const userId = session.metadata?.userId;
    if (userId) {
      await User.findByIdAndUpdate(userId, { plan: "pro", stripeCustomerId: session.customer });
    }
  }

  if (event.type === "customer.subscription.deleted") {
    const sub = event.data.object as { customer: string };
    await User.findOneAndUpdate({ stripeCustomerId: sub.customer }, { plan: "free" });
  }

  return NextResponse.json({ received: true });
}

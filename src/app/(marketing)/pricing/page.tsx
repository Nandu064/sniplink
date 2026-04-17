"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/Button";

const FREE_FEATURES = [
  "25 short links",
  "Basic click analytics",
  "QR code generation",
  "Custom aliases",
  "Link expiration",
  "Referrer tracking",
];

const PRO_FEATURES = [
  "Unlimited short links",
  "Advanced analytics & insights",
  "Link-in-Bio page",
  "Password-protected links",
  "Geographic & device data",
  "Priority support",
];

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  );
}

export default function PricingPage() {
  const [upgrading, setUpgrading] = useState(false);

  async function handleUpgrade() {
    setUpgrading(true);
    try {
      const res = await fetch("/api/billing/checkout", { method: "POST" });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert(data.error || "Stripe is not configured yet. Add STRIPE_* keys to enable billing.");
        setUpgrading(false);
      }
    } catch {
      alert("Something went wrong. Please try again.");
      setUpgrading(false);
    }
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
      <div className="text-center">
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-slate-900">
          Simple, Honest Pricing
        </h1>
        <p className="mt-4 text-lg text-slate-600">
          Start free. Upgrade when you need more power.
        </p>
      </div>

      <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        {/* Free Plan */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 flex flex-col">
          <div>
            <h3 className="text-lg font-semibold text-slate-700">Free</h3>
            <div className="mt-4 flex items-baseline gap-1">
              <span className="text-5xl font-bold text-slate-900">$0</span>
              <span className="text-slate-500 text-sm">/ forever</span>
            </div>
            <p className="mt-2 text-sm text-slate-500">Everything you need to get started.</p>
          </div>
          <ul className="mt-8 space-y-3 flex-1">
            {FREE_FEATURES.map((feature) => (
              <li key={feature} className="flex items-center gap-3 text-slate-700 text-sm">
                <CheckIcon className="h-5 w-5 text-emerald-500 flex-shrink-0" />
                {feature}
              </li>
            ))}
          </ul>
          <Link href="/signup" className="block mt-8">
            <Button variant="secondary" className="w-full" size="lg">
              Get Started Free
            </Button>
          </Link>
        </div>

        {/* Pro Plan */}
        <div className="relative bg-white rounded-2xl border-2 border-violet-600 shadow-lg p-8 flex flex-col">
          <div className="absolute -top-4 left-1/2 -translate-x-1/2">
            <span className="bg-violet-600 text-white text-xs font-semibold px-4 py-1.5 rounded-full shadow">
              Most Popular
            </span>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-violet-600">Pro</h3>
            <div className="mt-4 flex items-baseline gap-1">
              <span className="text-5xl font-bold text-slate-900">$9</span>
              <span className="text-slate-500 text-sm">/ month</span>
            </div>
            <p className="mt-2 text-sm text-slate-500">For power users and growing teams.</p>
          </div>
          <ul className="mt-8 space-y-3 flex-1">
            {PRO_FEATURES.map((feature) => (
              <li key={feature} className="flex items-center gap-3 text-slate-700 text-sm">
                <CheckIcon className="h-5 w-5 text-violet-500 flex-shrink-0" />
                {feature}
              </li>
            ))}
          </ul>
          <button
            onClick={handleUpgrade}
            disabled={upgrading}
            className="mt-8 w-full bg-violet-600 hover:bg-violet-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg text-base transition-colors"
          >
            {upgrading ? "Redirecting…" : "Upgrade to Pro"}
          </button>
        </div>
      </div>

      <p className="mt-10 text-center text-sm text-slate-400">
        Cancel anytime. No hidden fees.
      </p>
    </div>
  );
}

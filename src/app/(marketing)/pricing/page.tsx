import { Metadata } from "next";
import Link from "next/link";
import { constructMetadata } from "@/lib/seo";
import { Button } from "@/components/ui/Button";

export const metadata: Metadata = constructMetadata({
  title: "Pricing",
  description:
    "Sniplink pricing. Free URL shortener with analytics. Create unlimited short links.",
  path: "/pricing",
});

export default function PricingPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
      <div className="text-center">
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-slate-900">
          Simple Pricing
        </h1>
        <p className="mt-4 text-lg text-slate-600">
          Free to use. No credit card required.
        </p>
      </div>

      <div className="mt-12 max-w-md mx-auto">
        <div className="bg-white rounded-lg border-2 border-indigo-600 shadow-lg p-8">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-indigo-600">Free</h3>
            <div className="mt-4">
              <span className="text-5xl font-bold text-slate-900">$0</span>
              <span className="text-slate-500 ml-2">forever</span>
            </div>
          </div>

          <ul className="mt-8 space-y-3">
            {[
              "Unlimited short links",
              "Custom aliases",
              "Click analytics",
              "Referrer tracking",
              "Device & browser insights",
              "Geographic data",
              "Link expiration",
            ].map((feature) => (
              <li key={feature} className="flex items-center gap-3 text-slate-700">
                <svg
                  className="h-5 w-5 text-emerald-500 flex-shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                {feature}
              </li>
            ))}
          </ul>

          <Link href="/signup" className="block mt-8">
            <Button className="w-full" size="lg">
              Get Started Free
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

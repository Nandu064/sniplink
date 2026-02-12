import { Metadata } from "next";
import { constructMetadata } from "@/lib/seo";

export const metadata: Metadata = constructMetadata({
  title: "Features",
  description:
    "Explore Sniplink features: custom aliases, click analytics, referrer tracking, device insights, and more.",
  path: "/features",
});

const features = [
  {
    title: "Custom Short Links",
    description:
      "Choose your own slug or let us generate one. Create branded links that are easy to remember and share.",
  },
  {
    title: "Click Analytics",
    description:
      "Track every click with timestamps, referrer sources, geographic locations, and device information.",
  },
  {
    title: "Geographic Insights",
    description:
      "See where your audience is located with country-level breakdown of all clicks.",
  },
  {
    title: "Device & Browser Data",
    description:
      "Know what devices and browsers your audience uses, from desktop to mobile.",
  },
  {
    title: "Referrer Tracking",
    description:
      "Understand where your traffic comes from. Track which websites and platforms drive the most clicks.",
  },
  {
    title: "Link Management",
    description:
      "Enable or disable links, set expiration dates, and manage all your shortened URLs from one dashboard.",
  },
];

export default function FeaturesPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
      <div className="text-center">
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-slate-900">
          Features
        </h1>
        <p className="mt-4 text-lg text-slate-600 max-w-2xl mx-auto">
          Everything you need to shorten, track, and optimize your links.
        </p>
      </div>

      <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {features.map((feature) => (
          <div
            key={feature.title}
            className="bg-white rounded-lg border border-slate-200 p-6 hover:shadow-md transition-shadow"
          >
            <h3 className="text-lg font-semibold text-slate-900">
              {feature.title}
            </h3>
            <p className="mt-2 text-slate-600">{feature.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

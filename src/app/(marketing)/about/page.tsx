import { Metadata } from "next";
import { constructMetadata } from "@/lib/seo";

export const metadata: Metadata = constructMetadata({
  title: "About",
  description:
    "Learn about Sniplink, the analytics-powered URL shortener built for teams and individuals.",
  path: "/about",
});

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
      <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-slate-900">
        About Sniplink
      </h1>
      <div className="mt-8 prose prose-slate max-w-none">
        <p className="text-lg text-slate-600 leading-8">
          Sniplink is a modern URL shortener built with performance and analytics
          at its core. We believe every link tells a story, and our analytics help
          you read it.
        </p>

        <h2 className="text-2xl font-semibold text-slate-900 mt-12">
          Our Mission
        </h2>
        <p className="text-slate-600 leading-7">
          We make link management simple, fast, and insightful. Whether you are
          a marketer tracking campaign performance, a developer sharing resources,
          or anyone who needs short, clean links, Sniplink has you covered.
        </p>

        <h2 className="text-2xl font-semibold text-slate-900 mt-12">
          Built for Speed
        </h2>
        <p className="text-slate-600 leading-7">
          Every redirect is handled at the edge for millisecond-level latency.
          Your links resolve instantly, no matter where your audience is.
        </p>

        <h2 className="text-2xl font-semibold text-slate-900 mt-12">
          Privacy First
        </h2>
        <p className="text-slate-600 leading-7">
          We hash IP addresses and never sell your data. Analytics are for you,
          not for advertisers.
        </p>
      </div>
    </div>
  );
}

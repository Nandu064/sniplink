import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ShortenForm } from "@/components/features/ShortenForm";
import { JsonLd } from "@/components/seo/JsonLd";
import { buildWebApplicationJsonLd } from "@/lib/seo";

const features = [
  {
    title: "Detailed Analytics",
    description:
      "Track clicks, referrers, countries, devices, and browsers. Understand your audience with real-time data.",
    icon: (
      <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
      </svg>
    ),
  },
  {
    title: "Custom Aliases",
    description:
      "Create branded short links with custom slugs. Make your links memorable and professional.",
    icon: (
      <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
      </svg>
    ),
  },
  {
    title: "Lightning Fast",
    description:
      "Powered by edge computing for instant redirects. Your short links resolve in milliseconds, worldwide.",
    icon: (
      <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
      </svg>
    ),
  },
];

const steps = [
  { number: "1", title: "Paste", description: "Enter your long URL" },
  { number: "2", title: "Customize", description: "Add a custom alias" },
  { number: "3", title: "Share", description: "Copy and share your link" },
];

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden">
      <JsonLd data={buildWebApplicationJsonLd()} />
      <Header />

      <main className="flex-1">
        {/* Hero */}
        <section className="bg-gradient-to-b from-violet-50 to-white py-16 sm:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-slate-900">
              Shorten Links.
              <br />
              <span className="text-violet-600">Track Clicks.</span>
              <br />
              Grow Faster.
            </h1>
            <p className="mt-6 text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto">
              Create short, memorable links and track every click with detailed
              analytics. Free, fast, and powerful.
            </p>
            <div className="mt-10">
              <ShortenForm />
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="py-16 sm:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl sm:text-3xl font-semibold text-slate-900 text-center">
              Why Choose Sniplink?
            </h2>
            <p className="mt-4 text-slate-600 text-center max-w-2xl mx-auto">
              Everything you need to shorten, track, and optimize your links.
            </p>
            <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
              {features.map((feature) => (
                <div
                  key={feature.title}
                  className="bg-white rounded-lg border border-slate-200 p-6 hover:shadow-md transition-shadow"
                >
                  <div className="text-violet-600 mb-4">{feature.icon}</div>
                  <h3 className="text-lg font-semibold text-slate-900">
                    {feature.title}
                  </h3>
                  <p className="mt-2 text-slate-600">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-16 sm:py-24 bg-slate-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl sm:text-3xl font-semibold text-slate-900 text-center">
              How It Works
            </h2>
            <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
              {steps.map((step) => (
                <div key={step.number} className="text-center">
                  <div className="mx-auto w-12 h-12 rounded-full bg-violet-600 text-white flex items-center justify-center text-lg font-bold">
                    {step.number}
                  </div>
                  <h3 className="mt-4 text-lg font-semibold text-slate-900">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-slate-600">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 sm:py-24 bg-violet-600">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-2xl sm:text-3xl font-semibold text-white">
              Ready to Start Shortening?
            </h2>
            <p className="mt-4 text-violet-100 text-lg">
              Join thousands of users who trust Sniplink for their link
              management.
            </p>
            <Link
              href="/signup"
              className="mt-8 inline-flex items-center gap-2 bg-white text-violet-600 px-8 py-3 rounded-md font-medium text-lg hover:bg-violet-50 transition-colors"
            >
              Get Started Free
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

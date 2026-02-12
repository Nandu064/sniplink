import { Metadata } from "next";
import { constructMetadata } from "@/lib/seo";
import { APP_NAME } from "@/lib/constants";

export const metadata: Metadata = constructMetadata({
  title: "Terms of Service",
  description: `${APP_NAME} Terms of Service. Rules and guidelines for using our URL shortening service.`,
  path: "/terms",
});

export default function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
      <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-slate-900">
        Terms of Service
      </h1>
      <p className="mt-4 text-slate-500 text-sm">
        Last updated: {new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
      </p>

      <div className="mt-8 prose prose-slate max-w-none">
        <p className="text-lg text-slate-600 leading-8">
          By using {APP_NAME}, you agree to these terms. Please read them
          carefully before creating an account or using our service.
        </p>

        <h2 className="text-2xl font-semibold text-slate-900 mt-12">
          1. Acceptance of Terms
        </h2>
        <p className="text-slate-600 leading-7">
          By accessing or using {APP_NAME}, you agree to be bound by these Terms
          of Service. If you do not agree, please do not use the service.
        </p>

        <h2 className="text-2xl font-semibold text-slate-900 mt-12">
          2. Description of Service
        </h2>
        <p className="text-slate-600 leading-7">
          {APP_NAME} is a URL shortening service that allows users to create
          shortened links, track click analytics, and manage their links through
          a web dashboard. The service is provided free of charge.
        </p>

        <h2 className="text-2xl font-semibold text-slate-900 mt-12">
          3. Account Responsibilities
        </h2>
        <p className="text-slate-600 leading-7">
          You are responsible for:
        </p>
        <ul className="list-disc pl-6 text-slate-600 space-y-1 mt-2">
          <li>Maintaining the security of your account credentials</li>
          <li>All activity that occurs under your account</li>
          <li>Providing accurate information during registration</li>
          <li>Notifying us of any unauthorized use of your account</li>
        </ul>

        <h2 className="text-2xl font-semibold text-slate-900 mt-12">
          4. Acceptable Use
        </h2>
        <p className="text-slate-600 leading-7">
          You agree not to use {APP_NAME} to create short links that point to:
        </p>
        <ul className="list-disc pl-6 text-slate-600 space-y-1 mt-2">
          <li>Malware, viruses, or other harmful software</li>
          <li>Phishing pages or scam websites</li>
          <li>Illegal content or services</li>
          <li>Spam or bulk unsolicited messages</li>
          <li>Content that infringes on intellectual property rights</li>
          <li>Content promoting violence, harassment, or discrimination</li>
        </ul>
        <p className="text-slate-600 leading-7 mt-4">
          We reserve the right to disable any link or account that violates
          these guidelines, without prior notice.
        </p>

        <h2 className="text-2xl font-semibold text-slate-900 mt-12">
          5. Link Content
        </h2>
        <p className="text-slate-600 leading-7">
          You are solely responsible for the content of the URLs you shorten.
          {APP_NAME} does not endorse, verify, or take responsibility for the
          content of destination URLs. We reserve the right to disable or remove
          any link at our discretion.
        </p>

        <h2 className="text-2xl font-semibold text-slate-900 mt-12">
          6. Service Availability
        </h2>
        <p className="text-slate-600 leading-7">
          We strive to keep {APP_NAME} available at all times, but we do not
          guarantee uninterrupted service. The service may be temporarily
          unavailable due to maintenance, updates, or circumstances beyond our
          control. We are not liable for any damages resulting from service
          downtime.
        </p>

        <h2 className="text-2xl font-semibold text-slate-900 mt-12">
          7. Data and Privacy
        </h2>
        <p className="text-slate-600 leading-7">
          Your use of {APP_NAME} is also governed by our{" "}
          <a
            href="/privacy"
            className="text-indigo-600 hover:text-indigo-700 underline"
          >
            Privacy Policy
          </a>
          , which describes how we collect, use, and protect your data.
        </p>

        <h2 className="text-2xl font-semibold text-slate-900 mt-12">
          8. Intellectual Property
        </h2>
        <p className="text-slate-600 leading-7">
          The {APP_NAME} name, logo, and website design are our intellectual
          property. The source code is available under the MIT License on{" "}
          <a
            href="https://github.com/Nandu064/sniplink"
            className="text-indigo-600 hover:text-indigo-700 underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub
          </a>
          .
        </p>

        <h2 className="text-2xl font-semibold text-slate-900 mt-12">
          9. Limitation of Liability
        </h2>
        <p className="text-slate-600 leading-7">
          {APP_NAME} is provided &ldquo;as is&rdquo; without warranties of any
          kind, either express or implied. To the fullest extent permitted by
          law, we shall not be liable for any indirect, incidental, special,
          consequential, or punitive damages arising from your use of the
          service.
        </p>

        <h2 className="text-2xl font-semibold text-slate-900 mt-12">
          10. Account Termination
        </h2>
        <p className="text-slate-600 leading-7">
          You may delete your account at any time from the Settings page. We
          may also terminate or suspend your account if you violate these terms.
          Upon termination, your links, analytics data, and account information
          will be permanently deleted.
        </p>

        <h2 className="text-2xl font-semibold text-slate-900 mt-12">
          11. Changes to Terms
        </h2>
        <p className="text-slate-600 leading-7">
          We may update these terms from time to time. Continued use of the
          service after changes constitutes acceptance of the new terms. We will
          update the date at the top of this page when changes are made.
        </p>

        <h2 className="text-2xl font-semibold text-slate-900 mt-12">
          12. Contact
        </h2>
        <p className="text-slate-600 leading-7">
          If you have questions about these terms, please open an issue on our{" "}
          <a
            href="https://github.com/Nandu064/sniplink"
            className="text-indigo-600 hover:text-indigo-700 underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub repository
          </a>
          .
        </p>
      </div>
    </div>
  );
}

import { Metadata } from "next";
import { constructMetadata } from "@/lib/seo";
import { APP_NAME } from "@/lib/constants";

export const metadata: Metadata = constructMetadata({
  title: "Privacy Policy",
  description: `${APP_NAME} Privacy Policy. Learn how we collect, use, and protect your data.`,
  path: "/privacy",
});

export default function PrivacyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
      <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-slate-900">
        Privacy Policy
      </h1>
      <p className="mt-4 text-slate-500 text-sm">
        Last updated: {new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
      </p>

      <div className="mt-8 prose prose-slate max-w-none">
        <p className="text-lg text-slate-600 leading-8">
          At {APP_NAME}, we take your privacy seriously. This policy explains what
          data we collect, how we use it, and your rights regarding that data.
        </p>

        <h2 className="text-2xl font-semibold text-slate-900 mt-12">
          1. Information We Collect
        </h2>

        <h3 className="text-lg font-semibold text-slate-900 mt-6">
          Account Information
        </h3>
        <p className="text-slate-600 leading-7">
          When you create an account, we collect your name, email address, and a
          hashed version of your password. We never store passwords in plain text.
        </p>

        <h3 className="text-lg font-semibold text-slate-900 mt-6">
          Click Analytics Data
        </h3>
        <p className="text-slate-600 leading-7">
          When someone clicks a shortened link, we collect anonymous analytics
          data including:
        </p>
        <ul className="list-disc pl-6 text-slate-600 space-y-1 mt-2">
          <li>IP address (hashed with SHA-256 — we never store raw IPs)</li>
          <li>Country and city (derived from request headers)</li>
          <li>Device type, browser, and operating system</li>
          <li>Referrer URL (the page the click came from)</li>
          <li>Timestamp of the click</li>
        </ul>

        <h3 className="text-lg font-semibold text-slate-900 mt-6">
          Link Data
        </h3>
        <p className="text-slate-600 leading-7">
          We store the URLs you shorten, custom aliases, titles, and associated
          metadata needed to provide the service.
        </p>

        <h2 className="text-2xl font-semibold text-slate-900 mt-12">
          2. How We Use Your Data
        </h2>
        <p className="text-slate-600 leading-7">
          We use your data exclusively to:
        </p>
        <ul className="list-disc pl-6 text-slate-600 space-y-1 mt-2">
          <li>Provide the URL shortening and redirect service</li>
          <li>Display click analytics on your dashboard</li>
          <li>Authenticate your account and maintain your session</li>
          <li>Send password reset emails when requested</li>
          <li>Improve the service and fix bugs</li>
        </ul>
        <p className="text-slate-600 leading-7 mt-4">
          We do not sell, rent, or share your personal data with third parties
          for marketing purposes.
        </p>

        <h2 className="text-2xl font-semibold text-slate-900 mt-12">
          3. Third-Party Services
        </h2>
        <p className="text-slate-600 leading-7">
          We use the following third-party services to operate {APP_NAME}:
        </p>
        <ul className="list-disc pl-6 text-slate-600 space-y-1 mt-2">
          <li>
            <strong>MongoDB Atlas</strong> — database hosting (data stored
            securely in the cloud)
          </li>
          <li>
            <strong>Vercel</strong> — application hosting and edge network
          </li>
          <li>
            <strong>Gmail SMTP</strong> — sending password reset emails
          </li>
        </ul>

        <h2 className="text-2xl font-semibold text-slate-900 mt-12">
          4. Cookies
        </h2>
        <p className="text-slate-600 leading-7">
          We use a single session cookie for authentication purposes. This cookie
          is essential for keeping you logged in and does not track you across
          other websites. We do not use advertising or tracking cookies.
        </p>

        <h2 className="text-2xl font-semibold text-slate-900 mt-12">
          5. Data Retention & Deletion
        </h2>
        <p className="text-slate-600 leading-7">
          Your data is retained for as long as your account is active. You can
          delete your account at any time from the Settings page, which will
          permanently remove your account, all your links, and all associated
          click analytics data. Password reset tokens automatically expire and
          are deleted after 1 hour.
        </p>

        <h2 className="text-2xl font-semibold text-slate-900 mt-12">
          6. Data Security
        </h2>
        <p className="text-slate-600 leading-7">
          We implement industry-standard security measures including:
        </p>
        <ul className="list-disc pl-6 text-slate-600 space-y-1 mt-2">
          <li>Password hashing with bcrypt (12 salt rounds)</li>
          <li>IP address hashing with SHA-256 and a secret salt</li>
          <li>JWT-based session tokens</li>
          <li>HTTPS encryption in transit</li>
          <li>Rate limiting on all API endpoints</li>
          <li>Input validation on all user inputs</li>
        </ul>

        <h2 className="text-2xl font-semibold text-slate-900 mt-12">
          7. Your Rights
        </h2>
        <p className="text-slate-600 leading-7">
          You have the right to:
        </p>
        <ul className="list-disc pl-6 text-slate-600 space-y-1 mt-2">
          <li>Access your personal data through your dashboard</li>
          <li>Update your name and password in Settings</li>
          <li>Delete your account and all associated data</li>
          <li>Export your link data (available via API)</li>
        </ul>

        <h2 className="text-2xl font-semibold text-slate-900 mt-12">
          8. Changes to This Policy
        </h2>
        <p className="text-slate-600 leading-7">
          We may update this privacy policy from time to time. We will notify
          users of significant changes by updating the date at the top of this
          page.
        </p>

        <h2 className="text-2xl font-semibold text-slate-900 mt-12">
          9. Contact
        </h2>
        <p className="text-slate-600 leading-7">
          If you have questions about this privacy policy or your data, please
          open an issue on our{" "}
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

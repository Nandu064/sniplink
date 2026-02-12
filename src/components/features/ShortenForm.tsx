"use client";

import { useState, FormEvent } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { CopyButton } from "@/components/ui/CopyButton";
import { BASE_URL } from "@/lib/constants";
import { showSuccess, showError } from "@/lib/toast";

interface ShortenFormProps {
  showAdvanced?: boolean;
}

export function ShortenForm({ showAdvanced = false }: ShortenFormProps) {
  const { data: session } = useSession();
  const router = useRouter();
  const [url, setUrl] = useState("");
  const [slug, setSlug] = useState("");
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    shortUrl: string;
    slug: string;
  } | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setResult(null);

    if (!session) {
      router.push("/signin");
      return;
    }

    setLoading(true);

    try {
      const body: Record<string, string> = { url };
      if (slug) body.slug = slug;
      if (title) body.title = title;

      const res = await fetch("/api/links", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (!res.ok) {
        showError(data.error || "Something went wrong");
        return;
      }

      setResult({ shortUrl: data.shortUrl, slug: data.slug });
      setUrl("");
      setSlug("");
      setTitle("");
      showSuccess("Link created successfully!");
    } catch {
      showError("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  // Landing page variant — compact inline form
  if (!showAdvanced) {
    return (
      <div className="w-full max-w-2xl mx-auto">
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col sm:flex-row">
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Paste your long URL here..."
              required
              className="flex-1 text-base px-4 py-3 rounded-t-md sm:rounded-l-md sm:rounded-tr-none border border-slate-300 sm:border-r-0 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
            <Button
              type="submit"
              loading={loading}
              size="lg"
              className="rounded-b-md sm:rounded-r-md sm:rounded-bl-none"
            >
              Shorten
            </Button>
          </div>
        </form>

        {result && (
          <div className="mt-4 p-4 bg-emerald-50 border border-emerald-200 rounded-lg">
            <p className="text-sm text-emerald-700 font-medium mb-1">
              Link created successfully!
            </p>
            <div className="flex items-center gap-2">
              <a
                href={result.shortUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-indigo-600 font-medium hover:underline truncate"
              >
                {result.shortUrl}
              </a>
              <CopyButton text={result.shortUrl} />
            </div>
          </div>
        )}
      </div>
    );
  }

  // Dashboard variant — full form with advanced fields
  return (
    <div className="w-full">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Destination URL */}
        <div>
          <label className="block text-sm font-semibold text-slate-800 mb-2">
            Destination URL <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
              <svg className="h-5 w-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
              </svg>
            </div>
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://example.com/your-very-long-url-here"
              required
              className="w-full rounded-lg border border-slate-300 py-3 pl-11 pr-4 text-base placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-shadow"
            />
          </div>
          <p className="mt-1.5 text-xs text-slate-400">Enter the full URL you want to shorten (must start with http:// or https://)</p>
        </div>

        {/* Divider */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-200" />
          </div>
          <div className="relative flex justify-center">
            <span className="bg-white px-3 text-xs font-medium text-slate-400 uppercase tracking-wider">
              Optional Settings
            </span>
          </div>
        </div>

        {/* Custom Alias & Title in a grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {/* Custom Alias */}
          <div>
            <label className="block text-sm font-semibold text-slate-800 mb-2">
              Custom Alias
            </label>
            <div className="flex">
              <span className="inline-flex items-center text-sm text-slate-500 bg-slate-50 border border-r-0 border-slate-300 rounded-l-lg px-3 whitespace-nowrap">
                {BASE_URL.replace(/^https?:\/\//, "")}/
              </span>
              <input
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value.replace(/[^a-zA-Z0-9_-]/g, ""))}
                placeholder="my-link"
                className="flex-1 min-w-0 rounded-r-lg border border-slate-300 px-3 py-2.5 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-shadow"
              />
            </div>
            <p className="mt-1.5 text-xs text-slate-400">Letters, numbers, hyphens & underscores only</p>
          </div>

          {/* Title */}
          <div>
            <label className="block text-sm font-semibold text-slate-800 mb-2">
              Link Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Summer Sale Campaign"
              className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-shadow"
            />
            <p className="mt-1.5 text-xs text-slate-400">A friendly name to identify this link later</p>
          </div>
        </div>

        {/* Submit */}
        <div className="pt-2">
          <Button type="submit" loading={loading} size="lg" className="w-full sm:w-auto min-w-[200px]">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m9.86-2.314a4.5 4.5 0 00-6.364-6.364L4.5 8.25l4.5 4.5" />
            </svg>
            Create Short Link
          </Button>
        </div>
      </form>

      {/* Result Card */}
      {result && (
        <div className="mt-6 p-5 bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-xl">
          <div className="flex items-center gap-2 mb-3">
            <div className="p-1.5 rounded-full bg-emerald-100">
              <svg className="h-4 w-4 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <p className="text-sm font-semibold text-emerald-800">
              Your link is ready!
            </p>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 p-3 bg-white rounded-lg border border-emerald-200">
            <a
              href={result.shortUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-indigo-600 font-semibold text-lg hover:underline truncate"
            >
              {result.shortUrl}
            </a>
            <div className="flex items-center gap-2 sm:ml-auto shrink-0">
              <CopyButton text={result.shortUrl} />
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.push("/dashboard")}
              >
                View All Links
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

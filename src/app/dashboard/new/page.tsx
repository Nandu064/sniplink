"use client";

import Link from "next/link";
import { ShortenForm } from "@/components/features/ShortenForm";

export default function NewLinkPage() {
  return (
    <div className="max-w-3xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <Link
          href="/dashboard"
          className="text-sm text-slate-500 hover:text-slate-700 inline-flex items-center gap-1 mb-4"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
          Back to Dashboard
        </Link>
        <h1 className="text-3xl font-bold text-slate-900">Create New Link</h1>
        <p className="text-slate-500 mt-2">
          Shorten any URL and track its performance with detailed analytics.
        </p>
      </div>

      {/* Form Card */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Gradient accent bar */}
        <div className="h-1 bg-gradient-to-r from-violet-500 via-purple-500 to-violet-600" />

        <div className="p-6 sm:p-8">
          <ShortenForm showAdvanced />
        </div>
      </div>

      {/* Tips */}
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="flex items-start gap-3 p-4 rounded-lg bg-slate-50 border border-slate-100">
          <div className="shrink-0 p-2 rounded-lg bg-violet-100 text-violet-600">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m9.86-2.314a4.5 4.5 0 00-6.364-6.364L4.5 8.25l4.5 4.5" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-medium text-slate-700">Custom Aliases</p>
            <p className="text-xs text-slate-500 mt-0.5">Use memorable slugs like /sale or /promo</p>
          </div>
        </div>
        <div className="flex items-start gap-3 p-4 rounded-lg bg-slate-50 border border-slate-100">
          <div className="shrink-0 p-2 rounded-lg bg-emerald-100 text-emerald-600">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-medium text-slate-700">Click Analytics</p>
            <p className="text-xs text-slate-500 mt-0.5">Track every click with detailed insights</p>
          </div>
        </div>
        <div className="flex items-start gap-3 p-4 rounded-lg bg-slate-50 border border-slate-100">
          <div className="shrink-0 p-2 rounded-lg bg-amber-100 text-amber-600">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-medium text-slate-700">Global Reach</p>
            <p className="text-xs text-slate-500 mt-0.5">See which countries your clicks come from</p>
          </div>
        </div>
      </div>
    </div>
  );
}

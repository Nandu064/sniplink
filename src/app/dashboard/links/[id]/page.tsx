"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { CopyButton } from "@/components/ui/CopyButton";
import { Badge } from "@/components/ui/Badge";
import { Skeleton } from "@/components/ui/Skeleton";
import { AnalyticsOverview } from "@/components/features/AnalyticsOverview";
import { ClicksChart } from "@/components/features/ClicksChart";
import { ReferrerBreakdown } from "@/components/features/ReferrerBreakdown";
import { DeviceBreakdown } from "@/components/features/DeviceBreakdown";
import { CountryMap } from "@/components/features/CountryMap";
import { QRCodeModal } from "@/components/features/QRCodeModal";
import { cn } from "@/lib/utils";
import type { LinkResponse, AnalyticsResponse } from "@/types";

const periods = [
  { label: "7d", value: "7d" },
  { label: "30d", value: "30d" },
  { label: "90d", value: "90d" },
  { label: "All", value: "all" },
];

export default function LinkAnalyticsPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [link, setLink] = useState<LinkResponse | null>(null);
  const [analytics, setAnalytics] = useState<AnalyticsResponse | null>(null);
  const [period, setPeriod] = useState("30d");
  const [loading, setLoading] = useState(true);
  const [qrOpen, setQrOpen] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      const [linkRes, analyticsRes] = await Promise.all([
        fetch(`/api/links/${id}`),
        fetch(`/api/analytics/${id}?period=${period}`),
      ]);

      if (linkRes.status === 401) {
        router.push("/signin");
        return;
      }

      if (linkRes.ok) setLink(await linkRes.json());
      if (analyticsRes.ok) setAnalytics(await analyticsRes.json());
    } catch {
      // handle error
    } finally {
      setLoading(false);
    }
  }, [id, period, router]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-64" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Skeleton className="h-24" />
          <Skeleton className="h-24" />
          <Skeleton className="h-24" />
          <Skeleton className="h-24" />
        </div>
        <Skeleton className="h-72" />
      </div>
    );
  }

  if (!link || !analytics) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-500">Link not found</p>
        <Link href="/dashboard" className="mt-4 inline-block">
          <Button variant="outline">Back to Dashboard</Button>
        </Link>
      </div>
    );
  }

  const todayClicks = analytics.timeline.find(
    (t) => t.date === new Date().toISOString().split("T")[0]
  )?.clicks || 0;

  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/dashboard"
          className="text-sm text-slate-500 hover:text-slate-700 flex items-center gap-1 mb-3"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
          Back to Links
        </Link>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-slate-900">
                /{link.slug}
              </h1>
              <Badge variant={link.isActive ? "success" : "error"}>
                {link.isActive ? "Active" : "Inactive"}
              </Badge>
            </div>
            <p className="text-sm text-slate-500 mt-1 truncate max-w-lg">
              {link.originalUrl}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <CopyButton text={link.shortUrl} />
            <button
              onClick={() => setQrOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-sm font-medium text-slate-700 hover:bg-slate-50 hover:border-violet-300 transition-colors"
              title="View QR Code"
            >
              <svg className="h-4 w-4 text-violet-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 013.75 9.375v-4.5zM3.75 14.625c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5a1.125 1.125 0 01-1.125-1.125v-4.5zM13.5 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 0113.5 9.375v-4.5z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 6.75h.75v.75h-.75v-.75zM6.75 16.5h.75v.75h-.75v-.75zM16.5 6.75h.75v.75h-.75v-.75zM13.5 13.5h.75v.75h-.75v-.75zM13.5 19.5h.75v.75h-.75v-.75zM19.5 13.5h.75v.75h-.75v-.75zM19.5 19.5h.75v.75h-.75v-.75zM16.5 16.5h.75v.75h-.75v-.75z" />
              </svg>
              QR Code
            </button>
            <span className="text-sm text-slate-500">{link.shortUrl}</span>
          </div>
        </div>
      </div>

      {/* Period selector */}
      <div className="flex flex-wrap items-center gap-1 bg-white rounded-lg border border-slate-200 p-1 w-fit">
        {periods.map((p) => (
          <button
            key={p.value}
            onClick={() => {
              setPeriod(p.value);
              setLoading(true);
            }}
            className={cn(
              "px-3 py-1.5 rounded-md text-sm font-medium transition-colors",
              period === p.value
                ? "bg-violet-600 text-white"
                : "text-slate-600 hover:bg-slate-50"
            )}
          >
            {p.label}
          </button>
        ))}
      </div>

      <AnalyticsOverview
        totalClicks={analytics.totalClicks}
        todayClicks={todayClicks}
        topCountry={analytics.countries[0]?.name || null}
        topReferrer={analytics.referrers[0]?.name || null}
      />

      <ClicksChart data={analytics.timeline} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ReferrerBreakdown data={analytics.referrers} />
        <DeviceBreakdown data={analytics.devices} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <CountryMap data={analytics.countries} />
      </div>

      <QRCodeModal
        linkId={id}
        slug={link.slug}
        shortUrl={link.shortUrl}
        isOpen={qrOpen}
        onClose={() => setQrOpen(false)}
      />
    </div>
  );
}

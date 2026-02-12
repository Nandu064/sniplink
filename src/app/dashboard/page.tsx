"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardContent } from "@/components/ui/Card";
import { LinkTable } from "@/components/features/LinkTable";
import { Skeleton } from "@/components/ui/Skeleton";
import { formatNumber } from "@/lib/utils";
import { showError } from "@/lib/toast";
import type { LinkResponse } from "@/types";

export default function DashboardPage() {
  const router = useRouter();
  const [links, setLinks] = useState<LinkResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [stats, setStats] = useState({ total: 0, clicks: 0, active: 0 });

  const fetchLinks = useCallback(async () => {
    try {
      const params = new URLSearchParams({
        page: String(page),
        limit: "10",
      });
      if (search) params.set("search", search);

      const res = await fetch(`/api/links?${params}`);
      if (res.status === 401) {
        router.push("/signin");
        return;
      }
      const data = await res.json();

      setLinks(data.data);
      setTotalPages(data.totalPages);
      setStats({
        total: data.total,
        clicks: data.data.reduce(
          (sum: number, l: LinkResponse) => sum + l.totalClicks,
          0
        ),
        active: data.data.filter((l: LinkResponse) => l.isActive).length,
      });
    } catch {
      // handle error
    } finally {
      setLoading(false);
    }
  }, [page, search, router]);

  useEffect(() => {
    fetchLinks();
  }, [fetchLinks]);

  const handleDelete = async (id: string) => {
    const res = await fetch(`/api/links/${id}`, { method: "DELETE" });
    if (!res.ok) {
      showError("Failed to delete link");
      return;
    }
    fetchLinks();
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Skeleton className="h-24" />
          <Skeleton className="h-24" />
          <Skeleton className="h-24" />
        </div>
        <Skeleton className="h-64" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Your Links</h1>
        <p className="text-slate-500">Manage and track your shortened links</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <Input
          placeholder="Search links..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className="max-w-xs"
        />
        <Link href="/dashboard/new" className="shrink-0">
          <Button>
            <svg className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            New Link
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardContent>
            <p className="text-sm text-slate-500">Total Links</p>
            <p className="text-2xl font-bold text-slate-900">
              {formatNumber(stats.total)}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <p className="text-sm text-slate-500">Total Clicks</p>
            <p className="text-2xl font-bold text-slate-900">
              {formatNumber(stats.clicks)}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <p className="text-sm text-slate-500">Active Links</p>
            <p className="text-2xl font-bold text-slate-900">
              {formatNumber(stats.active)}
            </p>
          </CardContent>
        </Card>
      </div>

      <LinkTable links={links} onDelete={handleDelete} />

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
          >
            Previous
          </Button>
          <span className="text-sm text-slate-500">
            Page {page} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={page === totalPages}
            onClick={() => setPage((p) => p + 1)}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/Table";
import { Badge } from "@/components/ui/Badge";
import { CopyButton } from "@/components/ui/CopyButton";
import { Dropdown } from "@/components/ui/Dropdown";
import { truncateUrl, formatNumber, formatDate } from "@/lib/utils";
import { confirmDelete, showSuccess, showError } from "@/lib/toast";
import type { LinkResponse } from "@/types";

interface LinkTableProps {
  links: LinkResponse[];
  onDelete: (id: string) => Promise<void>;
}

export function LinkTable({ links, onDelete }: LinkTableProps) {
  const router = useRouter();
  const [pinned, setPinned] = useState<Record<string, boolean>>(
    Object.fromEntries(links.map((l) => [l.id, l.pinnedToBio ?? false]))
  );
  const [pinning, setPinning] = useState<Record<string, boolean>>({});

  const handleTogglePin = async (id: string) => {
    setPinning((prev) => ({ ...prev, [id]: true }));
    try {
      const res = await fetch(`/api/links/${id}/pin`, { method: "POST" });
      if (!res.ok) {
        showError("Failed to update pin status");
        return;
      }
      const data = await res.json();
      setPinned((prev) => ({ ...prev, [id]: data.pinnedToBio }));
      showSuccess(data.pinnedToBio ? "Pinned to bio!" : "Unpinned from bio");
    } catch {
      showError("Something went wrong");
    } finally {
      setPinning((prev) => ({ ...prev, [id]: false }));
    }
  };

  const handleDelete = async (id: string) => {
    const confirmed = await confirmDelete();
    if (!confirmed) return;

    try {
      await onDelete(id);
      showSuccess("Link deleted successfully!");
    } catch {
      showError("Failed to delete link");
    }
  };

  if (links.length === 0) {
    return (
      <div className="text-center py-12 text-slate-500">
        <svg
          className="mx-auto h-12 w-12 text-slate-300 mb-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m9.86-2.314a4.5 4.5 0 00-6.364-6.364L4.5 8.25l4.5 4.5"
          />
        </svg>
        <p className="text-lg font-medium text-slate-700">No links yet</p>
        <p className="mt-1">Create your first short link to get started.</p>
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Short URL</TableHead>
          <TableHead className="hidden sm:table-cell">Destination</TableHead>
          <TableHead>Clicks</TableHead>
          <TableHead className="hidden md:table-cell">Created</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="hidden sm:table-cell w-12 text-center">Pin</TableHead>
          <TableHead className="w-12" />
        </TableRow>
      </TableHeader>
      <TableBody>
        {links.map((link) => (
          <TableRow key={link.id}>
            <TableCell>
              <div className="flex items-center gap-1">
                <span className="text-violet-600 font-medium">
                  /{link.slug}
                </span>
                <CopyButton text={link.shortUrl} />
              </div>
              {link.title && (
                <p className="text-xs text-slate-400 mt-0.5">{link.title}</p>
              )}
            </TableCell>
            <TableCell className="hidden sm:table-cell">
              <span className="text-slate-500">
                {truncateUrl(link.originalUrl, 40)}
              </span>
            </TableCell>
            <TableCell>
              <span className="font-medium">
                {formatNumber(link.totalClicks)}
              </span>
            </TableCell>
            <TableCell className="hidden md:table-cell">
              <span className="text-slate-500">
                {formatDate(link.createdAt)}
              </span>
            </TableCell>
            <TableCell>
              <Badge variant={link.isActive ? "success" : "error"}>
                {link.isActive ? "Active" : "Inactive"}
              </Badge>
            </TableCell>
            <TableCell className="hidden sm:table-cell text-center">
              <button
                onClick={() => handleTogglePin(link.id)}
                disabled={pinning[link.id]}
                title={pinned[link.id] ? "Unpin from bio" : "Pin to bio"}
                className={`text-lg leading-none transition-opacity ${
                  pinning[link.id] ? "opacity-40 cursor-not-allowed" : "hover:scale-125"
                } ${pinned[link.id] ? "opacity-100" : "opacity-30 hover:opacity-70"}`}
                style={{ transition: "transform 0.1s, opacity 0.15s" }}
              >
                📌
              </button>
            </TableCell>
            <TableCell>
              <Dropdown
                trigger={
                  <button className="p-1 text-slate-400 hover:text-slate-600 rounded">
                    <svg
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 6.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 12.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 18.75a.75.75 0 110-1.5.75.75 0 010 1.5z"
                      />
                    </svg>
                  </button>
                }
                items={[
                  {
                    label: "View Analytics",
                    onClick: () =>
                      router.push(`/dashboard/links/${link.id}`),
                  },
                  {
                    label: "Delete",
                    onClick: () => handleDelete(link.id),
                    variant: "danger",
                  },
                ]}
              />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

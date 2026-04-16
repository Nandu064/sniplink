"use client";

import { useSession } from "next-auth/react";
import { Dropdown } from "@/components/ui/Dropdown";
import { signOut } from "next-auth/react";

interface DashboardNavProps {
  onMenuClick: () => void;
}

export function DashboardNav({ onMenuClick }: DashboardNavProps) {
  const { data: session } = useSession();

  return (
    <header className="h-16 shrink-0 border-b border-slate-200 bg-white flex items-center justify-between px-4 sm:px-6">
      <button
        className="lg:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-md"
        onClick={onMenuClick}
      >
        <svg
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
      </button>

      <div className="flex-1" />

      <Dropdown
        trigger={
          <button className="h-8 w-8 rounded-full bg-violet-100 text-violet-700 font-medium text-sm flex items-center justify-center">
            {session?.user?.name?.[0]?.toUpperCase() || "U"}
          </button>
        }
        items={[
          {
            label: "Sign Out",
            onClick: () => signOut({ callbackUrl: "/" }),
            variant: "danger",
          },
        ]}
      />
    </header>
  );
}

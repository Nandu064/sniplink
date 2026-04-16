"use client";

import Link from "next/link";
import { signOut } from "next-auth/react";
import { Session } from "next-auth";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { Dropdown } from "@/components/ui/Dropdown";

interface HeaderAuthProps {
  session: Session | null;
}

export function HeaderAuth({ session }: HeaderAuthProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  // Close mobile menu on route change or resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) setMobileOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  if (session?.user) {
    return (
      <div className="flex items-center gap-4">
        <Link href="/dashboard" className="hidden md:block">
          <Button variant="outline" size="sm">
            Dashboard
          </Button>
        </Link>
        <Dropdown
          trigger={
            <button className="h-8 w-8 rounded-full bg-violet-100 text-violet-700 font-medium text-sm flex items-center justify-center">
              {session.user.name?.[0]?.toUpperCase() || "U"}
            </button>
          }
          items={[
            {
              label: "Dashboard",
              onClick: () => {
                window.location.href = "/dashboard";
              },
            },
            {
              label: "Sign Out",
              onClick: () => signOut({ callbackUrl: "/" }),
              variant: "danger",
            },
          ]}
        />
      </div>
    );
  }

  return (
    <>
      <div className="hidden md:flex items-center gap-3">
        <Link href="/signin">
          <Button variant="ghost" size="sm">
            Sign In
          </Button>
        </Link>
        <Link href="/signup">
          <Button size="sm">Get Started</Button>
        </Link>
      </div>

      {/* Mobile menu button */}
      <button
        className="md:hidden p-2 text-slate-600"
        onClick={() => setMobileOpen(!mobileOpen)}
        aria-label={mobileOpen ? "Close menu" : "Open menu"}
      >
        <svg
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          {mobileOpen ? (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          ) : (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4 6h16M4 12h16M4 18h16"
            />
          )}
        </svg>
      </button>

      {mobileOpen && (
        <>
          {/* Backdrop overlay */}
          <div
            className="fixed inset-0 bg-black/30 z-40 md:hidden"
            onClick={() => setMobileOpen(false)}
          />
          {/* Menu panel */}
          <div className="fixed top-16 left-0 right-0 bg-white border-b border-slate-200 p-4 z-50 md:hidden shadow-lg">
            <div className="flex flex-col gap-3">
              <Link
                href="/about"
                className="text-sm text-slate-600 py-2"
                onClick={() => setMobileOpen(false)}
              >
                About
              </Link>
              <Link
                href="/features"
                className="text-sm text-slate-600 py-2"
                onClick={() => setMobileOpen(false)}
              >
                Features
              </Link>
              <Link
                href="/pricing"
                className="text-sm text-slate-600 py-2"
                onClick={() => setMobileOpen(false)}
              >
                Pricing
              </Link>
              <hr className="border-slate-200" />
              <Link href="/signin" onClick={() => setMobileOpen(false)}>
                <Button variant="outline" className="w-full">
                  Sign In
                </Button>
              </Link>
              <Link href="/signup" onClick={() => setMobileOpen(false)}>
                <Button className="w-full">Get Started</Button>
              </Link>
            </div>
          </div>
        </>
      )}
    </>
  );
}

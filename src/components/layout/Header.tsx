import Link from "next/link";
import { auth } from "@/lib/auth";
import { APP_NAME } from "@/lib/constants";
import { HeaderAuth } from "./HeaderAuth";

const navLinks = [
  { href: "/about", label: "About" },
  { href: "/features", label: "Features" },
  { href: "/pricing", label: "Pricing" },
];

export async function Header() {
  const session = await auth();

  return (
    <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-slate-200">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
        <Link
          href="/"
          className="text-xl font-bold text-violet-600 tracking-tight"
        >
          {APP_NAME}
        </Link>

        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm text-slate-600 hover:text-slate-900 transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </div>

        <HeaderAuth session={session} />
      </nav>
    </header>
  );
}

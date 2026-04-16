import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="text-center px-4">
        <h1 className="text-6xl font-bold text-violet-600">404</h1>
        <h2 className="mt-4 text-2xl font-semibold text-slate-900">
          Page Not Found
        </h2>
        <p className="mt-2 text-slate-500">
          The page you are looking for does not exist or has been moved.
        </p>
        <Link href="/" className="inline-block mt-6">
          <Button size="lg">Go Home</Button>
        </Link>
      </div>
    </div>
  );
}

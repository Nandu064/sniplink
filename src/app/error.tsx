"use client";

import { Button } from "@/components/ui/Button";

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="text-center px-4">
        <h1 className="text-6xl font-bold text-red-500">Error</h1>
        <h2 className="mt-4 text-2xl font-semibold text-slate-900">
          Something went wrong
        </h2>
        <p className="mt-2 text-slate-500">
          An unexpected error occurred. Please try again.
        </p>
        <Button onClick={reset} size="lg" className="mt-6">
          Try Again
        </Button>
      </div>
    </div>
  );
}

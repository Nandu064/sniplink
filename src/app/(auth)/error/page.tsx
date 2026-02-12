import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default function AuthErrorPage() {
  return (
    <div className="w-full max-w-md text-center">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-2xl font-bold text-slate-900">
          Authentication Error
        </h1>
        <p className="mt-2 text-slate-500">
          Something went wrong during authentication. Please try again.
        </p>
        <Link href="/signin" className="block mt-6">
          <Button className="w-full">Back to Sign In</Button>
        </Link>
      </div>
    </div>
  );
}

import { cn } from "@/lib/utils";

type BadgeVariant = "default" | "success" | "warning" | "error" | "outline";

interface BadgeProps {
  variant?: BadgeVariant;
  className?: string;
  children: React.ReactNode;
}

const variantStyles: Record<BadgeVariant, string> = {
  default: "bg-violet-50 text-violet-700",
  success: "bg-emerald-50 text-emerald-700",
  warning: "bg-amber-50 text-amber-700",
  error: "bg-red-50 text-red-700",
  outline: "border border-slate-300 text-slate-600 bg-white",
};

export function Badge({ variant = "default", className, children }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center text-xs font-medium px-2.5 py-0.5 rounded-full",
        variantStyles[variant],
        className
      )}
    >
      {children}
    </span>
  );
}

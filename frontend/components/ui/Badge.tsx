import { cn } from "@/lib/utils";

type BadgeVariant = "default" | "new" | "accent" | "muted" | "success";

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
}

const variants: Record<BadgeVariant, string> = {
  default: "bg-ink text-white",
  new: "bg-ink text-micro text-white tracking-wider uppercase",
  accent: "bg-accent text-white",
  muted: "bg-background-alt text-text-muted",
  success: "bg-success-muted text-success",
};

export function Badge({ children, variant = "default", className }: BadgeProps) {
  return (
    <span
      className={cn(
        "text-micro inline-block px-2 py-0.5 font-medium",
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  );
}

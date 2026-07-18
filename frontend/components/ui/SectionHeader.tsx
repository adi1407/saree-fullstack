import Link from "next/link";
import { cn } from "@/lib/utils";

interface SectionHeaderProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  href?: string;
  linkLabel?: string;
  className?: string;
  dark?: boolean;
}

export function SectionHeader({
  eyebrow,
  title,
  subtitle,
  href,
  linkLabel = "View all",
  className,
  dark = false,
}: SectionHeaderProps) {
  return (
    <div className={cn("mb-10 flex flex-col gap-6 md:mb-12 md:flex-row md:items-end md:justify-between", className)}>
      <div className="max-w-2xl">
        {eyebrow && (
          <p className={cn("text-eyebrow mb-3", dark ? "text-secondary" : "text-secondary")}>
            {eyebrow}
          </p>
        )}
        <h2 className={cn("text-chapter", dark ? "text-white" : "text-ink")}>{title}</h2>
        {subtitle && (
          <p
            className={cn(
              "text-lead mt-4 max-w-xl",
              dark ? "text-white/65" : "text-text-muted"
            )}
          >
            {subtitle}
          </p>
        )}
        <div
          className={cn("mt-5 h-px w-16", dark ? "bg-secondary/60" : "bg-secondary")}
          aria-hidden
        />
      </div>
      {href && (
        <Link
          href={href}
          className={cn(
            "text-eyebrow shrink-0 transition-colors hover:underline",
            dark ? "text-secondary hover:text-white" : "text-primary"
          )}
        >
          {linkLabel} →
        </Link>
      )}
    </div>
  );
}

import { cn } from "@/lib/utils";

interface DividerProps {
  className?: string;
  label?: string;
}

export function Divider({ className, label }: DividerProps) {
  if (label) {
    return (
      <div className={cn("flex items-center gap-4", className)}>
        <div className="h-px flex-1 bg-secondary/40" />
        <span className="text-eyebrow text-secondary">{label}</span>
        <div className="h-px flex-1 bg-secondary/40" />
      </div>
    );
  }
  return <div className={cn("h-px w-full bg-secondary/40", className)} />;
}

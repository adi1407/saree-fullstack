import { cn } from "@/lib/utils";
import { WEAVE_LABELS, WeaveType } from "@/lib/types";

interface WeaveChipProps {
  weave: WeaveType;
  className?: string;
}

export function WeaveChip({ weave, className }: WeaveChipProps) {
  return (
    <span
      className={cn(
        "inline-block border border-secondary/40 px-2 py-0.5 text-eyebrow text-secondary",
        className
      )}
    >
      {WEAVE_LABELS[weave]}
    </span>
  );
}

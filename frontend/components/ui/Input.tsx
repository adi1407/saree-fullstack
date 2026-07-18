import { InputHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, id, ...props }, ref) => (
    <div className="w-full">
      {label && (
        <label htmlFor={id} className="text-small mb-1.5 block text-text-muted">
          {label}
        </label>
      )}
      <input
        ref={ref}
        id={id}
        className={cn(
          "text-ui w-full border border-border bg-surface px-4 py-2.5 text-text outline-none transition-colors placeholder:text-text-muted/60 focus:border-secondary",
          error && "border-error",
          className
        )}
        {...props}
      />
      {error && <p className="text-small mt-1 text-error">{error}</p>}
    </div>
  )
);

Input.displayName = "Input";

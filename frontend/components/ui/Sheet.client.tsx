"use client";

import { useEffect, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface SheetProps {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  side?: "left" | "right";
  title?: string;
  className?: string;
  variant?: "light" | "dark";
  showHeader?: boolean;
  footer?: ReactNode;
}

export function Sheet({
  open,
  onClose,
  children,
  side = "right",
  title,
  className,
  variant = "light",
  showHeader = true,
  footer,
}: SheetProps) {
  const [mounted, setMounted] = useState(false);
  const [backdropReady, setBackdropReady] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) {
      setBackdropReady(false);
      return;
    }
    // Prevent iOS ghost-tap from immediately closing the sheet on open
    const timer = window.setTimeout(() => setBackdropReady(true), 350);
    return () => window.clearTimeout(timer);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  if (!open || !mounted) return null;

  const isDark = variant === "dark";

  return createPortal(
    <div className="fixed inset-0 z-[200] isolate" role="presentation">
      <button
        type="button"
        className={cn(
          "fixed inset-0 z-0 bg-ink/60 backdrop-blur-[3px]",
          !backdropReady && "pointer-events-none"
        )}
        onClick={backdropReady ? onClose : undefined}
        aria-label="Close overlay"
        tabIndex={backdropReady ? 0 : -1}
      />
      <aside
        role="dialog"
        aria-modal="true"
        aria-label={title || "Sidebar"}
        className={cn(
          "sheet-panel fixed top-0 z-10 flex h-dvh max-h-dvh w-[min(88vw,20rem)] flex-col shadow-[4px_0_32px_rgba(0,0,0,0.35)]",
          side === "right" ? "right-0 sheet-panel-right" : "left-0 sheet-panel-left",
          isDark ? "bg-ink text-white" : "bg-surface text-ink",
          className
        )}
      >
        {showHeader && (
          <div
            className={cn(
              "flex shrink-0 items-center justify-between border-b px-5 py-4 safe-top",
              isDark ? "border-white/10" : "border-border"
            )}
          >
            {title ? (
              <p className={cn("text-title", isDark ? "text-white" : "text-ink")}>{title}</p>
            ) : (
              <span />
            )}
            <button
              type="button"
              onClick={onClose}
              className={cn(
                "touch-target focus-luxury rounded-sm",
                isDark ? "text-white/70 hover:text-white" : "text-text-muted hover:text-ink"
              )}
              aria-label="Close sidebar"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        )}

        <div className="flex min-h-0 flex-1 flex-col">
          <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 py-5">{children}</div>
          {footer && (
            <div
              className={cn(
                "shrink-0 border-t px-5 py-4 safe-bottom",
                isDark ? "border-white/10 bg-ink" : "border-border bg-surface"
              )}
            >
              {footer}
            </div>
          )}
        </div>
      </aside>
    </div>,
    document.body
  );
}

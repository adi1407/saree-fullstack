"use client";

import { useState, type ReactNode } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface AccordionItem {
  id: string;
  title: string;
  content: ReactNode;
}

interface AccordionProps {
  items: AccordionItem[];
  className?: string;
  defaultOpen?: string;
}

export function Accordion({ items, className, defaultOpen }: AccordionProps) {
  const [openId, setOpenId] = useState<string | null>(defaultOpen ?? items[0]?.id ?? null);

  return (
    <div className={cn("divide-y divide-border border border-border", className)}>
      {items.map((item) => {
        const isOpen = openId === item.id;
        return (
          <div key={item.id}>
            <button
              type="button"
              id={`accordion-${item.id}`}
              aria-expanded={isOpen}
              aria-controls={`panel-${item.id}`}
              onClick={() => setOpenId(isOpen ? null : item.id)}
              className="focus-luxury flex w-full items-center justify-between px-5 py-4 text-left transition-colors hover:bg-background-alt"
            >
              <span className="text-title text-ink">{item.title}</span>
              <ChevronDown
                className={cn(
                  "h-4 w-4 shrink-0 text-secondary transition-transform",
                  isOpen && "rotate-180"
                )}
                aria-hidden
              />
            </button>
            <div
              id={`panel-${item.id}`}
              role="region"
              aria-labelledby={`accordion-${item.id}`}
              hidden={!isOpen}
              className="px-5 pb-5 text-small leading-relaxed text-text-muted"
            >
              {item.content}
            </div>
          </div>
        );
      })}
    </div>
  );
}

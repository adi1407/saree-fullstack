"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { FaqGroup } from "@/content/faq";
import { cn } from "@/lib/utils";

interface FaqAccordionProps {
  groups: FaqGroup[];
}

export function FaqAccordion({ groups }: FaqAccordionProps) {
  const [openId, setOpenId] = useState<string | null>(null);

  return (
    <div className="space-y-12">
      {groups.map((group) => (
        <section key={group.id} id={group.id}>
          <h2 className="text-title text-ink">{group.title}</h2>
          <div className="mt-6 divide-y divide-border border-y border-border">
            {group.items.map((item) => {
              const isOpen = openId === item.id;
              return (
                <div key={item.id}>
                  <button
                    type="button"
                    onClick={() => setOpenId(isOpen ? null : item.id)}
                    className="focus-luxury flex w-full items-center justify-between py-5 text-left"
                    aria-expanded={isOpen}
                  >
                    <span className="pr-4 text-small font-medium text-ink">{item.question}</span>
                    <span className={cn("text-secondary transition-transform", isOpen && "rotate-45")}>
                      +
                    </span>
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <p className="pb-5 text-small leading-relaxed text-text-muted">{item.answer}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </section>
      ))}
    </div>
  );
}

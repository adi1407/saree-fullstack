"use client";

import { Accordion } from "@/components/ui/Accordion.client";
import { Saree } from "@/lib/types";
import { OCCASION_LABELS } from "@/lib/types";

interface ProductDetailsAccordionProps {
  saree: Saree;
}

export function ProductDetailsAccordion({ saree }: ProductDetailsAccordionProps) {
  return (
    <Accordion
      className="mt-8"
      items={[
        {
          id: "fabric",
          title: "Fabric & details",
          content: (
            <ul className="space-y-2">
              <li><strong>Fabric:</strong> {saree.fabric}</li>
              <li><strong>Length:</strong> {saree.length || "5.5m"}</li>
              <li><strong>Blouse:</strong> {saree.blouseIncluded ? "Included" : "Not included"}</li>
              <li><strong>Colours:</strong> {saree.colors.primary}{saree.colors.secondary ? ` & ${saree.colors.secondary}` : ""}</li>
              <li><strong>SKU:</strong> {saree.sku}</li>
            </ul>
          ),
        },
        {
          id: "occasion",
          title: "Occasions",
          content: (
            <p>{saree.occasion.map((o) => OCCASION_LABELS[o]).join(" · ")}</p>
          ),
        },
        {
          id: "care",
          title: "Care & authenticity",
          content: (
            <p>
              Dry clean recommended to preserve silk and zari. Store wrapped in breathable muslin.
              Each piece is handloom authentic — minor irregularities are a mark of true handcraft,
              not defects.
            </p>
          ),
        },
        ...(saree.craftStory
          ? [
              {
                id: "craft",
                title: "Craft story",
                content: <p>{saree.craftStory}</p>,
              },
            ]
          : []),
      ]}
    />
  );
}

"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Search, X } from "lucide-react";
import { apiClient } from "@/lib/api";
import { PaginatedResponse, Saree } from "@/lib/types";

interface SearchDialogProps {
  open: boolean;
  onClose: () => void;
}

export function SearchDialog({ open, onClose }: SearchDialogProps) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<Saree[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open) {
      setQuery("");
      setSuggestions([]);
      return;
    }
    const t = setTimeout(() => inputRef.current?.focus(), 50);
    return () => clearTimeout(t);
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

  useEffect(() => {
    if (!query.trim()) {
      setSuggestions([]);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await apiClient.get<PaginatedResponse<Saree[]>>("/api/sarees", {
          search: query.trim(),
          limit: 4,
        });
        setSuggestions(res.data);
      } catch {
        setSuggestions([]);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  const goToResults = (q?: string) => {
    const term = (q ?? query).trim();
    onClose();
    if (term) {
      router.push(`/sarees?search=${encodeURIComponent(term)}`);
    } else {
      router.push("/sarees");
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100]">
      <button
        type="button"
        className="absolute inset-0 bg-ink/60 backdrop-blur-sm"
        onClick={onClose}
        aria-label="Close search"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Search sarees"
        className="relative mx-auto mt-[10vh] w-full max-w-xl px-4"
      >
        <div className="bg-background shadow-[var(--shadow-soft)]">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              goToResults();
            }}
            className="flex items-center border-b border-border"
          >
            <Search className="ml-4 h-5 w-5 text-text-muted" />
            <input
              ref={inputRef}
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search sarees by name, weave, color..."
              className="flex-1 bg-transparent px-4 py-4 text-ink placeholder:text-text-muted focus:outline-none"
              aria-label="Search query"
            />
            <button
              type="button"
              onClick={onClose}
              className="mr-4 text-text-muted hover:text-ink"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>
          </form>

          <div className="max-h-[50vh] overflow-y-auto p-2">
            {loading && <p className="px-4 py-3 text-small text-text-muted">Searching...</p>}

            {!loading && query.trim() && suggestions.length === 0 && (
              <p className="px-4 py-3 text-small text-text-muted">No matches found.</p>
            )}

            {suggestions.map((saree) => (
              <Link
                key={saree._id}
                href={`/sarees/${saree.slug}`}
                onClick={onClose}
                className="flex items-center gap-3 px-4 py-3 transition-colors hover:bg-background-alt"
              >
                {saree.images.gallery[0] && (
                  <div className="relative h-14 w-10 shrink-0 overflow-hidden bg-background-alt">
                    <Image
                      src={saree.images.gallery[0]}
                      alt=""
                      fill
                      className="object-cover"
                      sizes="40px"
                    />
                  </div>
                )}
                <div>
                  <p className="text-small text-ink line-clamp-1">{saree.name}</p>
                  <p className="text-small text-text-muted">
                    {new Intl.NumberFormat("en-IN", {
                      style: "currency",
                      currency: "INR",
                      maximumFractionDigits: 0,
                    }).format(saree.price)}
                  </p>
                </div>
              </Link>
            ))}

            {query.trim() && (
              <button
                type="button"
                onClick={() => goToResults()}
                className="w-full px-4 py-3 text-left text-small uppercase tracking-wider text-secondary hover:text-primary"
              >
                View all results for &ldquo;{query.trim()}&rdquo;
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

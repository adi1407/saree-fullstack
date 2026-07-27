"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { apiClient } from "@/lib/api";

const SESSION_KEY = "aadiora_chat_session";

type ChatProduct = {
  slug: string;
  name: string;
  price: number;
  image: string;
  inStock: boolean;
  weave?: string;
};

type ChatTurn = {
  id: string;
  role: "user" | "assistant";
  content: string;
  products?: ChatProduct[];
  handoff?: boolean;
};

type ChatApiResponse = {
  success: boolean;
  data: {
    sessionId: string;
    reply: string;
    products: ChatProduct[];
    handoff: boolean;
    mode: "llm" | "mock";
  };
  message?: string;
};

function formatInr(n: number) {
  return `₹${n.toLocaleString("en-IN")}`;
}

function renderPlain(text: string) {
  // Lightweight markdown: **bold** and newlines
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={i} className="font-medium text-ink">
          {part.slice(2, -2)}
        </strong>
      );
    }
    return (
      <span key={i} className="whitespace-pre-wrap">
        {part}
      </span>
    );
  });
}

export function ChatWidget() {
  const panelId = useId();
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [turns, setTurns] = useState<ChatTurn[]>([
    {
      id: "welcome",
      role: "assistant",
      content:
        "Welcome to AADIORA. Ask for a weave, occasion, or budget — or shipping, returns, and care. I only recommend pieces from our live catalog.",
    },
  ]);
  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    try {
      const existing = sessionStorage.getItem(SESSION_KEY);
      if (existing) setSessionId(existing);
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    if (!open) return;
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
    inputRef.current?.focus();
  }, [open, turns, loading]);

  const send = useCallback(async () => {
    const message = input.trim();
    if (!message || loading) return;

    setInput("");
    setError(null);
    const userTurn: ChatTurn = {
      id: `u-${Date.now()}`,
      role: "user",
      content: message,
    };
    setTurns((prev) => [...prev, userTurn]);
    setLoading(true);

    try {
      const res = await apiClient.post<ChatApiResponse>("/api/chat", {
        sessionId: sessionId ?? undefined,
        message,
      });

      const nextSession = res.data.sessionId;
      setSessionId(nextSession);
      try {
        sessionStorage.setItem(SESSION_KEY, nextSession);
      } catch {
        // ignore
      }

      setTurns((prev) => [
        ...prev,
        {
          id: `a-${Date.now()}`,
          role: "assistant",
          content: res.data.reply,
          products: res.data.products?.length ? res.data.products : undefined,
          handoff: res.data.handoff,
        },
      ]);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Chat unavailable";
      setError(msg);
      setTurns((prev) => [
        ...prev,
        {
          id: `e-${Date.now()}`,
          role: "assistant",
          content:
            msg.includes("unavailable") || msg.includes("503")
              ? "Chat is temporarily unavailable. Browse the catalog or email care@aadiora.com."
              : "Something went wrong sending that message. Please try again.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }, [input, loading, sessionId]);

  return (
    <div className="pointer-events-none fixed bottom-5 right-5 z-60 flex flex-col items-end gap-3">
      {open && (
        <section
          id={panelId}
          role="dialog"
          aria-label="AADIORA shopping assistant"
          className="pointer-events-auto flex h-[min(32rem,70vh)] w-[min(24rem,calc(100vw-2.5rem))] flex-col overflow-hidden border border-border bg-surface shadow-[0_18px_50px_rgba(26,20,16,0.18)] motion-safe:origin-bottom-right motion-safe:transition-opacity motion-safe:duration-300"
        >
          <header className="flex items-center justify-between border-b border-border bg-background-alt px-4 py-3">
            <div>
              <p className="font-heading text-lg leading-none text-ink">
                AADIORA Assistant
              </p>
              <p className="mt-1 text-eyebrow text-text-muted">Live catalog · policies</p>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="rounded-sm px-2 py-1 text-body text-text-muted transition-colors hover:bg-background hover:text-ink"
              aria-label="Close chat"
            >
              ✕
            </button>
          </header>

          <div ref={listRef} className="flex-1 space-y-3 overflow-y-auto px-3 py-3">
            {turns.map((turn) => (
              <div
                key={turn.id}
                className={`flex ${turn.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[92%] px-3 py-2 text-body leading-relaxed ${
                    turn.role === "user"
                      ? "bg-primary text-secondary-muted"
                      : "border border-border bg-background text-text"
                  }`}
                >
                  {renderPlain(turn.content)}

                  {turn.products && turn.products.length > 0 && (
                    <ul className="mt-3 space-y-2">
                      {turn.products.map((p) => (
                        <li key={p.slug}>
                          <Link
                            href={`/sarees/${p.slug}`}
                            className="flex gap-2 border border-border/80 bg-surface p-1.5 transition-colors hover:border-secondary"
                          >
                            <div className="relative h-16 w-12 shrink-0 overflow-hidden bg-background-alt">
                              {p.image ? (
                                <Image
                                  src={p.image}
                                  alt=""
                                  fill
                                  className="object-cover"
                                  sizes="48px"
                                />
                              ) : null}
                            </div>
                            <div className="min-w-0 py-0.5">
                              <p className="truncate text-card-title-sm text-ink">{p.name}</p>
                              <p className="text-eyebrow text-text-muted">
                                {formatInr(p.price)}
                                {!p.inStock ? " · unavailable" : ""}
                              </p>
                              <span className="text-eyebrow text-primary">View →</span>
                            </div>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}

                  {turn.handoff && (
                    <p className="mt-2 border-t border-border pt-2 text-eyebrow text-text-muted">
                      Prefer a person?{" "}
                      <Link href="/appointments" className="text-primary underline-offset-2 hover:underline">
                        Book a consultation
                      </Link>{" "}
                      or email care@aadiora.com.
                    </p>
                  )}
                </div>
              </div>
            ))}

            {loading && (
              <p className="text-eyebrow text-text-muted" aria-live="polite">
                Looking through the catalog…
              </p>
            )}
          </div>

          <form
            className="border-t border-border bg-surface p-3"
            onSubmit={(e) => {
              e.preventDefault();
              void send();
            }}
          >
            {error && (
              <p className="mb-2 text-eyebrow text-error" role="alert">
                {error}
              </p>
            )}
            <div className="flex gap-2">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about sarees, shipping…"
                disabled={loading}
                className="min-w-0 flex-1 border border-border bg-background px-3 py-2 text-body text-ink outline-none transition-colors placeholder:text-text-muted focus:border-secondary"
                aria-label="Message"
                maxLength={2000}
              />
              <button
                type="submit"
                disabled={loading || !input.trim()}
                className="shrink-0 bg-primary px-3 py-2 text-eyebrow tracking-wide text-secondary-muted transition-colors hover:bg-primary-hover disabled:opacity-50"
              >
                Send
              </button>
            </div>
          </form>
        </section>
      )}

      <button
        type="button"
        className="pointer-events-auto border border-secondary/40 bg-ink px-4 py-3 text-eyebrow tracking-[0.14em] text-secondary-muted shadow-[0_10px_30px_rgba(26,20,16,0.25)] transition-transform motion-safe:hover:-translate-y-0.5"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((v) => !v)}
      >
        {open ? "Close" : "Ask AADIORA"}
      </button>
    </div>
  );
}

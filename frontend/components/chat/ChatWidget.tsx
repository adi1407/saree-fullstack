"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { X } from "lucide-react";
import { apiClient } from "@/lib/api";
import { BRAND_LOGO_ICON_SRC, BRAND_NAME } from "@/lib/brand";
import type { ApiResponse, User } from "@/lib/types";

const SESSION_KEY = "aadiora_chat_session";

const QUICK_CHIPS = [
  { label: "My orders", message: "Are there any orders of mine?" },
  { label: "Returns", message: "What is your return policy?" },
  { label: "Wedding under ₹15k", message: "Banarasi under 15000 for wedding" },
  { label: "Best picks", message: "Tell me the best saree" },
  { label: "Talk to stylist", message: "I want to speak to a stylist" },
] as const;

const STAGE_LABELS: Record<string, string> = {
  thinking: "Thinking…",
  searching_catalog: "Searching the catalog…",
  checking_orders: "Checking your orders…",
  checking_cart: "Checking your bag…",
  starting_return: "Starting a return…",
  searching_policies: "Looking up store policies…",
  writing_reply: "Writing a reply…",
};

type ChatProduct = {
  id?: string;
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
  needsSignIn?: boolean;
};

type ChatResultData = {
  sessionId: string;
  reply: string;
  products: ChatProduct[];
  handoff: boolean;
  mode: "llm" | "mock" | "degraded";
  needsSignIn?: boolean;
  displayName?: string | null;
};

function formatInr(n: number) {
  return `₹${n.toLocaleString("en-IN")}`;
}

function welcomeText(name?: string | null) {
  if (name) {
    return `Welcome back, ${name}. Ask for a weave, occasion, or budget — or your orders, bag, shipping, and returns. I only recommend pieces from our live catalog.`;
  }
  return `Welcome to ${BRAND_NAME}. Ask for a weave, occasion, or budget — or shipping, returns, and care. Sign in to track orders and use your bag. I only recommend pieces from our live catalog.`;
}

function renderPlain(text: string) {
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

async function streamChat(
  body: { sessionId?: string; message: string },
  signal: AbortSignal,
  onStage: (stage: string) => void
): Promise<ChatResultData> {
  const res = await fetch("/api/chat/stream", {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
    signal,
  });

  if (!res.ok) {
    let message = "Something went wrong";
    try {
      const data = (await res.json()) as { message?: string };
      message = data.message || message;
    } catch {
      // ignore
    }
    throw new Error(message);
  }

  if (!res.body) {
    throw new Error("Chat stream unavailable");
  }

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  let result: ChatResultData | null = null;
  let streamError: string | null = null;

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });

    const parts = buffer.split("\n\n");
    buffer = parts.pop() ?? "";

    for (const block of parts) {
      const lines = block.split("\n");
      let event = "message";
      let dataLine = "";
      for (const line of lines) {
        if (line.startsWith("event:")) event = line.slice(6).trim();
        if (line.startsWith("data:")) dataLine += line.slice(5).trim();
      }
      if (!dataLine) continue;
      try {
        const data = JSON.parse(dataLine) as Record<string, unknown>;
        if (event === "stage" && typeof data.stage === "string") {
          onStage(data.stage);
        } else if (event === "result") {
          result = data as unknown as ChatResultData;
        } else if (event === "error") {
          streamError = typeof data.message === "string" ? data.message : "Chat failed";
        } else if (event === "aborted") {
          throw new DOMException("Aborted", "AbortError");
        }
      } catch (err) {
        if (err instanceof DOMException && err.name === "AbortError") throw err;
        // ignore malformed chunks
      }
    }
  }

  if (streamError) throw new Error(streamError);
  if (!result) throw new Error("No reply from stylist");
  return result;
}

export function ChatWidget() {
  const panelId = useId();
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [stageLabel, setStageLabel] = useState(STAGE_LABELS.thinking);
  const [error, setError] = useState<string | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const [showChips, setShowChips] = useState(true);
  const [addingSlug, setAddingSlug] = useState<string | null>(null);
  const [bagNote, setBagNote] = useState<string | null>(null);
  const [turns, setTurns] = useState<ChatTurn[]>([
    {
      id: "welcome",
      role: "assistant",
      content: welcomeText(null),
    },
  ]);
  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    try {
      const existing = sessionStorage.getItem(SESSION_KEY);
      if (existing) setSessionId(existing);
    } catch {
      // ignore
    }

    apiClient
      .get<ApiResponse<User>>("/api/auth/me")
      .then((res) => {
        const name = res.data?.name?.trim();
        if (name) {
          setUserName(name);
          setTurns((prev) => {
            if (prev.length === 1 && prev[0].id === "welcome") {
              return [{ ...prev[0], content: welcomeText(name) }];
            }
            return prev;
          });
        }
      })
      .catch(() => {
        // guest
      });
  }, []);

  useEffect(() => {
    if (!open) return;
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
    inputRef.current?.focus();
  }, [open, turns, loading, stageLabel]);

  const closePanel = useCallback(() => {
    abortRef.current?.abort();
    abortRef.current = null;
    setOpen(false);
    setLoading(false);
  }, []);

  const addToBag = useCallback(async (product: ChatProduct) => {
    if (!product.id && !product.slug) return;
    setAddingSlug(product.slug);
    setBagNote(null);
    try {
      await apiClient.post("/api/cart/items", {
        sareeId: product.id,
        qty: 1,
      });
      setBagNote(`Added ${product.name} to your bag.`);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Could not add to bag";
      if (msg.toLowerCase().includes("auth") || msg.toLowerCase().includes("sign")) {
        setBagNote("Sign in to add pieces to your bag.");
      } else if (!product.id) {
        setBagNote("Open the product page to add this piece — card id missing.");
      } else {
        setBagNote(msg);
      }
    } finally {
      setAddingSlug(null);
    }
  }, []);

  const sendMessage = useCallback(
    async (raw: string) => {
      const message = raw.trim();
      if (!message || loading) return;

      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;

      setInput("");
      setError(null);
      setBagNote(null);
      setShowChips(false);
      setStageLabel(STAGE_LABELS.thinking);
      const userTurn: ChatTurn = {
        id: `u-${Date.now()}`,
        role: "user",
        content: message,
      };
      setTurns((prev) => [...prev, userTurn]);
      setLoading(true);

      try {
        const data = await streamChat(
          { sessionId: sessionId ?? undefined, message },
          controller.signal,
          (stage) => setStageLabel(STAGE_LABELS[stage] ?? STAGE_LABELS.thinking)
        );

        const nextSession = data.sessionId;
        setSessionId(nextSession);
        try {
          sessionStorage.setItem(SESSION_KEY, nextSession);
        } catch {
          // ignore
        }

        if (data.displayName) {
          setUserName(data.displayName);
        }

        setTurns((prev) => [
          ...prev,
          {
            id: `a-${Date.now()}`,
            role: "assistant",
            content: data.reply,
            products: data.products?.length ? data.products : undefined,
            handoff: data.handoff,
            needsSignIn: data.needsSignIn,
          },
        ]);
      } catch (err) {
        if (err instanceof DOMException && err.name === "AbortError") {
          return;
        }
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
                : msg.includes("Too many")
                  ? "Too many messages just now — please wait a minute and try again."
                  : "Something went wrong sending that message. Please try again.",
          },
        ]);
      } finally {
        if (abortRef.current === controller) abortRef.current = null;
        setLoading(false);
      }
    },
    [loading, sessionId]
  );

  const send = useCallback(async () => {
    await sendMessage(input);
  }, [input, sendMessage]);

  return (
    <div className="pointer-events-none fixed bottom-5 right-5 z-60 flex flex-col items-end gap-4 sm:bottom-7 sm:right-7">
      {open && (
        <section
          id={panelId}
          role="dialog"
          aria-label={`${BRAND_NAME} personal stylist`}
          className="pointer-events-auto flex h-[min(34rem,72vh)] w-[min(26rem,calc(100vw-2.5rem))] flex-col overflow-hidden border border-secondary/35 bg-[linear-gradient(180deg,#fdf8f3_0%,#ffffff_42%)] shadow-[0_22px_60px_rgba(26,20,16,0.22)] motion-safe:origin-bottom-right"
        >
          <header className="relative border-b border-secondary/25 bg-ink px-4 py-3.5 text-secondary-muted">
            <div
              aria-hidden
              className="pointer-events-none absolute inset-x-6 top-0 h-px bg-linear-to-r from-transparent via-secondary/70 to-transparent"
            />
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className="relative flex h-11 w-11 shrink-0 overflow-hidden rounded-full ring-1 ring-secondary/55 ring-offset-2 ring-offset-ink">
                  <Image
                    src={BRAND_LOGO_ICON_SRC}
                    alt=""
                    width={44}
                    height={44}
                    className="h-full w-full object-cover"
                    aria-hidden
                  />
                </span>
                <div>
                  <p className="font-heading text-[1.15rem] leading-none tracking-[0.18em] text-secondary">
                    {BRAND_NAME}
                  </p>
                  <p className="mt-1.5 text-eyebrow tracking-[0.16em] text-secondary-muted/80">
                    {userName ? `Signed in as ${userName}` : "Atelier stylist"}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={closePanel}
                className="rounded-full p-2 text-secondary-muted/80 transition-colors hover:bg-white/5 hover:text-secondary"
                aria-label="Close chat"
              >
                <X className="h-4 w-4" strokeWidth={1.5} aria-hidden />
              </button>
            </div>
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
                        <li key={p.slug} className="border border-border/80 bg-surface p-1.5">
                          <Link
                            href={`/sarees/${p.slug}`}
                            className="flex gap-2 transition-colors hover:border-secondary"
                          >
                            <div className="relative h-16 w-12 shrink-0 overflow-hidden bg-background-alt">
                              {p.image ? (
                                <Image
                                  src={p.image}
                                  alt={p.name}
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
                          {p.inStock && p.id ? (
                            <button
                              type="button"
                              disabled={addingSlug === p.slug}
                              onClick={() => void addToBag(p)}
                              className="mt-1.5 w-full border border-secondary/40 bg-background px-2 py-1 text-eyebrow text-ink transition-colors hover:border-secondary disabled:opacity-50"
                            >
                              {addingSlug === p.slug ? "Adding…" : "Add to bag"}
                            </button>
                          ) : null}
                        </li>
                      ))}
                    </ul>
                  )}

                  {turn.needsSignIn && (
                    <p className="mt-2 border-t border-border pt-2 text-eyebrow text-text-muted">
                      <Link href="/login" className="text-primary underline-offset-2 hover:underline">
                        Sign in
                      </Link>{" "}
                      to view orders, use your bag, and personalize chat.
                    </p>
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

            {showChips && !loading && turns.length <= 1 && (
              <div className="flex flex-wrap gap-1.5 pt-1">
                {QUICK_CHIPS.map((chip) => (
                  <button
                    key={chip.label}
                    type="button"
                    onClick={() => void sendMessage(chip.message)}
                    className="border border-secondary/40 bg-surface px-2.5 py-1 text-eyebrow text-ink transition-colors hover:border-secondary hover:bg-background-alt"
                  >
                    {chip.label}
                  </button>
                ))}
              </div>
            )}

            {loading && (
              <div className="flex items-center justify-between gap-2" aria-live="polite">
                <p className="text-eyebrow text-text-muted">{stageLabel}</p>
                <button
                  type="button"
                  onClick={() => abortRef.current?.abort()}
                  className="text-eyebrow text-primary underline-offset-2 hover:underline"
                >
                  Cancel
                </button>
              </div>
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
            {bagNote && !error && (
              <p className="mb-2 text-eyebrow text-text-muted" role="status">
                {bagNote}{" "}
                <Link href="/cart" className="text-primary underline-offset-2 hover:underline">
                  View bag
                </Link>
              </p>
            )}
            <div className="flex gap-2">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about sarees, orders, shipping…"
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
        className="group pointer-events-auto relative flex items-center gap-0 rounded-full bg-ink/95 p-1.5 pr-1.5 shadow-[0_16px_40px_rgba(26,20,16,0.32)] ring-1 ring-secondary/40 backdrop-blur-sm transition-[padding,box-shadow,transform] duration-500 ease-[var(--ease-luxury)] motion-safe:hover:-translate-y-0.5 motion-safe:hover:pr-4 motion-safe:hover:shadow-[0_20px_48px_rgba(26,20,16,0.4)] motion-safe:hover:ring-secondary/70 motion-safe:active:scale-[0.98] sm:pr-1.5"
        aria-expanded={open}
        aria-controls={panelId}
        aria-label={open ? `Close ${BRAND_NAME} stylist` : `Ask ${BRAND_NAME} stylist`}
        onClick={() => {
          if (open) closePanel();
          else setOpen(true);
        }}
      >
        {!open && (
          <span
            aria-hidden
            className="animate-chat-medallion-glow pointer-events-none absolute left-1.5 top-1.5 h-[3.75rem] w-[3.75rem] rounded-full bg-secondary/40 blur-md"
          />
        )}

        <span className="relative flex h-[3.75rem] w-[3.75rem] shrink-0 items-center justify-center rounded-full bg-[radial-gradient(circle_at_35%_30%,#3a2a20_0%,#1a1410_70%)] p-[3px] shadow-[inset_0_0_0_1px_rgba(201,169,98,0.55)]">
          <span className="flex h-full w-full items-center justify-center overflow-hidden rounded-full ring-1 ring-secondary/30">
            {open ? (
              <span className="flex h-full w-full items-center justify-center bg-ink text-secondary">
                <X className="h-5 w-5" strokeWidth={1.5} aria-hidden />
              </span>
            ) : (
              <Image
                src={BRAND_LOGO_ICON_SRC}
                alt=""
                width={60}
                height={60}
                className="h-full w-full scale-[1.02] object-cover"
                priority
                aria-hidden
              />
            )}
          </span>
        </span>

        {!open && (
          <span className="max-w-0 overflow-hidden opacity-0 transition-[max-width,opacity,margin] duration-500 ease-[var(--ease-luxury)] group-hover:ml-2.5 group-hover:max-w-[7.5rem] group-hover:opacity-100">
            <span className="flex flex-col whitespace-nowrap pr-2 leading-none">
              <span className="font-heading text-[0.95rem] tracking-[0.2em] text-secondary">
                Ask
              </span>
              <span className="mt-1 text-[0.5625rem] uppercase tracking-[0.22em] text-secondary-muted/85">
                Stylist
              </span>
            </span>
          </span>
        )}
      </button>
    </div>
  );
}

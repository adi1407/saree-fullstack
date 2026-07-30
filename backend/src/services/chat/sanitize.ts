/** Mask an email for transcripts / model context (keeps domain, hides local part). */
export function maskEmail(email?: string | null): string | null {
  if (!email?.trim()) return null;
  const trimmed = email.trim();
  const at = trimmed.indexOf("@");
  if (at < 1) return "***";
  const local = trimmed.slice(0, at);
  const domain = trimmed.slice(at + 1);
  const visible = local.slice(0, 1);
  return `${visible}***@${domain}`;
}

const EMAIL_RE = /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}/gi;

function redactEmailsInString(value: string): string {
  return value.replace(EMAIL_RE, (match) => maskEmail(match) ?? "***");
}

/** Deep-redact emails in tool payloads before Mongo persistence / LLM history replay. */
export function sanitizeToolData(toolName: string, data: unknown): unknown {
  if (data == null) return data;

  if (toolName === "get_my_profile" && typeof data === "object" && !Array.isArray(data)) {
    const d = data as Record<string, unknown>;
    if (d.error) return data;
    return {
      name: d.name,
      emailMasked: maskEmail(typeof d.email === "string" ? d.email : null),
      note: "Full email lives in Account settings — never invent an address.",
    };
  }

  return redactDeep(data);
}

function redactDeep(value: unknown): unknown {
  if (typeof value === "string") return redactEmailsInString(value);
  if (Array.isArray(value)) return value.map(redactDeep);
  if (value && typeof value === "object") {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
      if (/email/i.test(k) && typeof v === "string") {
        out[k] = maskEmail(v);
      } else if (/email/i.test(k) && v == null) {
        out[k] = null;
      } else {
        out[k] = redactDeep(v);
      }
    }
    return out;
  }
  return value;
}

export function persistableToolContent(toolName: string, data: unknown): string {
  return JSON.stringify(sanitizeToolData(toolName, data));
}

"use client";

import { useState } from "react";
import { useToast } from "@/components/ui/ToastProvider.client";
import { MagneticButton } from "@/features/experience/motion/MagneticButton.client";
import { BRAND_EMAIL } from "@/lib/brand";

export function ContactForm() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // API endpoint can be wired later; mock success for now
      await new Promise((r) => setTimeout(r, 800));
      toast(`Message sent! We'll reply to ${form.email} within 24 hours.`);
      setForm({ name: "", email: "", subject: "", message: "" });
    } catch {
      toast(`Something went wrong. Email us at ${BRAND_EMAIL}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        <label className="block">
          <span className="text-eyebrow text-text-muted">Name</span>
          <input
            required
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="focus-luxury mt-2 w-full border border-border bg-surface px-4 py-3 text-small"
          />
        </label>
        <label className="block">
          <span className="text-eyebrow text-text-muted">Email</span>
          <input
            required
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="focus-luxury mt-2 w-full border border-border bg-surface px-4 py-3 text-small"
          />
        </label>
      </div>
      <label className="block">
        <span className="text-eyebrow text-text-muted">Subject</span>
        <input
          required
          value={form.subject}
          onChange={(e) => setForm({ ...form, subject: e.target.value })}
          className="focus-luxury mt-2 w-full border border-border bg-surface px-4 py-3 text-small"
        />
      </label>
      <label className="block">
        <span className="text-eyebrow text-text-muted">Message</span>
        <textarea
          required
          rows={5}
          value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
          className="focus-luxury mt-2 w-full resize-none border border-border bg-surface px-4 py-3 text-small"
        />
      </label>
      <MagneticButton
        type="submit"
        disabled={loading}
        className="bg-primary px-10 py-4 text-eyebrow text-white disabled:opacity-60"
      >
        {loading ? "Sending…" : "Send message"}
      </MagneticButton>
    </form>
  );
}

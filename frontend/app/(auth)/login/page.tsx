"use client";

import { Suspense, useCallback, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { BrandLogo } from "@/components/brand/BrandLogo";
import { apiClient } from "@/lib/api";
import { ApiResponse, User } from "@/lib/types";
import { cn } from "@/lib/utils";

type Method = "password" | "otp";

function PasswordForm({ next }: { next: string }) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await apiClient.post<ApiResponse<User>>("/api/auth/login", { email, password });
      router.push(next);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-8 space-y-4">
      <Input
        id="email"
        label="Email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <Input
        id="password"
        label="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      {error && <p className="text-small text-error">{error}</p>}
      <Button type="submit" className="w-full" size="lg" disabled={loading}>
        {loading ? "Signing in..." : "Sign In"}
      </Button>
    </form>
  );
}

function OtpForm({ next }: { next: string }) {
  const router = useRouter();
  const [step, setStep] = useState<"phone" | "code">("phone");
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [loading, setLoading] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const startCooldown = useCallback((seconds: number) => {
    setCooldown(seconds);
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setCooldown((c) => {
        if (c <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          return 0;
        }
        return c - 1;
      });
    }, 1000);
  }, []);

  async function sendOtp(e?: React.FormEvent) {
    e?.preventDefault();
    setLoading(true);
    setError("");
    setNotice("");
    try {
      const res = await apiClient.post<
        ApiResponse<{ verificationId: string; mock: boolean; devCode?: string }>
      >("/api/auth/otp/send", { phone });
      setStep("code");
      startCooldown(30);
      if (res.data.devCode) {
        setNotice(`Demo mode — your code is ${res.data.devCode}`);
      } else {
        setNotice("We sent a 6-digit code to your phone.");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not send OTP");
    } finally {
      setLoading(false);
    }
  }

  async function verifyOtp(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await apiClient.post<ApiResponse<User>>("/api/auth/otp/verify", { phone, code });
      router.push(next);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Verification failed");
    } finally {
      setLoading(false);
    }
  }

  if (step === "phone") {
    return (
      <form onSubmit={sendOtp} className="mt-8 space-y-4">
        <Input
          id="phone"
          label="Phone number"
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          placeholder="+91 98765 43210"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
        />
        {error && <p className="text-small text-error">{error}</p>}
        <Button type="submit" className="w-full" size="lg" disabled={loading}>
          {loading ? "Sending..." : "Send OTP"}
        </Button>
      </form>
    );
  }

  return (
    <form onSubmit={verifyOtp} className="mt-8 space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-small text-text-muted">
          Code sent to <span className="text-ink">{phone}</span>
        </p>
        <button
          type="button"
          onClick={() => {
            setStep("phone");
            setCode("");
            setError("");
            setNotice("");
          }}
          className="text-eyebrow text-primary hover:underline"
        >
          Change
        </button>
      </div>
      <Input
        id="code"
        label="6-digit code"
        inputMode="numeric"
        autoComplete="one-time-code"
        maxLength={6}
        placeholder="______"
        value={code}
        onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
        required
      />
      {notice && <p className="text-small text-accent">{notice}</p>}
      {error && <p className="text-small text-error">{error}</p>}
      <Button type="submit" className="w-full" size="lg" disabled={loading || code.length < 4}>
        {loading ? "Verifying..." : "Verify & Sign In"}
      </Button>
      <button
        type="button"
        onClick={() => sendOtp()}
        disabled={cooldown > 0 || loading}
        className="text-small w-full text-center text-text-muted transition-colors hover:text-primary disabled:opacity-60"
      >
        {cooldown > 0 ? `Resend code in ${cooldown}s` : "Resend code"}
      </button>
    </form>
  );
}

function LoginForm() {
  const searchParams = useSearchParams();
  const next = searchParams.get("next") || "/";
  const [method, setMethod] = useState<Method>("otp");

  return (
    <Container className="flex min-h-[70vh] items-center justify-center py-16">
      <div className="w-full max-w-md">
        <div className="mb-8 flex justify-center">
          <BrandLogo imageClassName="max-w-[200px]" variant="auth" />
        </div>
        <h1 className="text-chapter text-ink">Welcome back</h1>
        <p className="mt-2 text-small text-text-muted">Sign in to continue to checkout</p>

        <div className="mt-6 grid grid-cols-2 gap-1 border border-border p-1">
          {(["otp", "password"] as Method[]).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => setMethod(m)}
              className={cn(
                "text-eyebrow py-2.5 transition-colors",
                method === m
                  ? "bg-primary text-white"
                  : "text-text-muted hover:text-primary"
              )}
            >
              {m === "otp" ? "Phone OTP" : "Email"}
            </button>
          ))}
        </div>

        {method === "otp" ? <OtpForm next={next} /> : <PasswordForm next={next} />}

        <p className="mt-6 text-center text-small text-text-muted">
          Don&apos;t have an account?{" "}
          <Link
            href={`/register?next=${encodeURIComponent(next)}`}
            className="text-primary hover:underline"
          >
            Create one
          </Link>
        </p>
      </div>
    </Container>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<Container className="py-20 text-center">Loading...</Container>}>
      <LoginForm />
    </Suspense>
  );
}

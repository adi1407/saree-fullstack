"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { apiClient } from "@/lib/api";
import { BRAND_NAME } from "@/lib/brand";
import { ApiResponse, CheckoutSession } from "@/lib/types";

declare global {
  interface Window {
    Razorpay: new (options: Record<string, unknown>) => { open: () => void };
  }
}

function loadRazorpayScript(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (document.getElementById("razorpay-script")) {
      resolve();
      return;
    }
    const script = document.createElement("script");
    script.id = "razorpay-script";
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Failed to load Razorpay"));
    document.body.appendChild(script);
  });
}

interface RazorpayButtonProps {
  session: CheckoutSession;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  disabled?: boolean;
}

export function RazorpayButton({
  session,
  customerName,
  customerEmail,
  customerPhone,
  disabled,
}: RazorpayButtonProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleMockPay() {
    setLoading(true);
    setError("");
    try {
      const res = await apiClient.post<ApiResponse<{ orderId: string }>>("/api/checkout/mock-pay", {
        orderId: session.orderId,
      });
      router.push(`/orders/${res.data.orderId}?success=1`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Payment failed");
    } finally {
      setLoading(false);
    }
  }

  async function handleRazorpayPay() {
    setLoading(true);
    setError("");
    try {
      await loadRazorpayScript();

      const rzp = new window.Razorpay({
        key: session.razorpay!.keyId,
        amount: session.razorpay!.amount,
        currency: session.razorpay!.currency,
        name: BRAND_NAME,
        description: `Order ${session.orderNumber}`,
        order_id: session.razorpay!.orderId,
        prefill: {
          name: customerName,
          email: customerEmail,
          contact: customerPhone,
        },
        theme: { color: "#8B2942" },
        handler: async (response: {
          razorpay_order_id: string;
          razorpay_payment_id: string;
          razorpay_signature: string;
        }) => {
          try {
            const res = await apiClient.post<ApiResponse<{ orderId: string }>>("/api/checkout/verify", {
              orderId: session.orderId,
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              signature: response.razorpay_signature,
            });
            router.push(`/orders/${res.data.orderId}?success=1`);
          } catch (err) {
            setError(err instanceof Error ? err.message : "Payment verification failed");
            setLoading(false);
          }
        },
        modal: {
          ondismiss: () => setLoading(false),
        },
      });

      rzp.open();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Payment failed");
      setLoading(false);
    }
  }

  return (
    <div>
      {session.razorpay?.mock && (
        <div className="mb-4 rounded border border-secondary/40 bg-secondary/10 px-4 py-3 text-small text-ink">
          Development mode — payment is simulated. No real charge will be made.
        </div>
      )}
      {error && <p className="mb-3 text-small text-error">{error}</p>}
      <Button
        type="button"
        size="lg"
        className="w-full"
        disabled={disabled || loading}
        onClick={session.razorpay?.mock ? handleMockPay : handleRazorpayPay}
      >
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Processing...
          </>
        ) : session.razorpay?.mock ? (
          `Complete Order — ${session.amounts.total.toLocaleString("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 })}`
        ) : (
          "Pay with Razorpay"
        )}
      </Button>
    </div>
  );
}

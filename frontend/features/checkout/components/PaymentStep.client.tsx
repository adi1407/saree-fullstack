"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Banknote, CreditCard, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { apiClient } from "@/lib/api";
import { ApiResponse, CheckoutQuote, CheckoutSession, ShippingAddress } from "@/lib/types";
import { formatPrice } from "@/lib/utils";
import { RazorpayButton } from "./RazorpayButton.client";

const COD_MAX = 10000;

interface PaymentStepProps {
  address: ShippingAddress;
  saveAddress: boolean;
  quote: CheckoutQuote;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  onEditAddress: () => void;
}

export function PaymentStep({
  address,
  saveAddress,
  quote,
  customerName,
  customerEmail,
  customerPhone,
  onEditAddress,
}: PaymentStepProps) {
  const router = useRouter();
  const [session, setSession] = useState<CheckoutSession | null>(null);
  const [loadingCod, setLoadingCod] = useState(false);
  const [loadingRazorpay, setLoadingRazorpay] = useState(false);
  const [error, setError] = useState("");

  const { amounts, codEligible, razorpayEnabled } = quote;
  const codDisabled = !codEligible;

  async function placeCodOrder() {
    setLoadingCod(true);
    setError("");
    try {
      const res = await apiClient.post<ApiResponse<CheckoutSession>>("/api/checkout/create", {
        shippingAddress: address,
        saveAddress,
        paymentMethod: "cod",
      });
      router.push(`/orders/${res.data.orderId}?success=1&cod=1`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not place order");
    } finally {
      setLoadingCod(false);
    }
  }

  async function startRazorpayCheckout() {
    setLoadingRazorpay(true);
    setError("");
    try {
      const res = await apiClient.post<ApiResponse<CheckoutSession>>("/api/checkout/create", {
        shippingAddress: address,
        saveAddress,
        paymentMethod: "razorpay",
      });
      setSession(res.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not start payment");
    } finally {
      setLoadingRazorpay(false);
    }
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="text-title">Payment</h2>
        <button
          type="button"
          onClick={onEditAddress}
          className="text-small text-secondary hover:underline"
        >
          Edit address
        </button>
      </div>

      <div className="rounded border border-border p-4 text-small">
        <p className="font-medium">{address.name}</p>
        <p className="text-text-muted">
          {address.line1}
          {address.line2 ? `, ${address.line2}` : ""}
        </p>
        <p className="text-text-muted">
          {address.city}, {address.state} — {address.pincode}
        </p>
        <p className="text-text-muted">{address.phone}</p>
      </div>

      <div className="rounded border border-border bg-background-alt p-4">
        <p className="text-small font-medium text-ink">Order total</p>
        <p className="mt-1 text-title text-primary tabular-nums">
          {formatPrice(amounts.total)}
        </p>
      </div>

      {error && <p className="text-small text-error">{error}</p>}

      {!session ? (
        <div className="space-y-3">
          <p className="text-small text-text-muted">Choose how you would like to pay</p>

          {/* Cash on Delivery */}
          <div
            className={`rounded border p-4 ${
              codDisabled ? "border-border bg-background-alt/50 opacity-75" : "border-border"
            }`}
          >
            <div className="flex items-start gap-3">
              <Banknote className="mt-0.5 h-5 w-5 shrink-0 text-secondary" />
              <div className="flex-1">
                <p className="font-medium text-ink">Cash on Delivery</p>
                <p className="mt-1 text-small text-text-muted">
                  Pay when your saree arrives at your doorstep.
                </p>
                {codDisabled ? (
                  <p className="mt-2 text-small text-accent-vibrant">
                    Not available for orders above {formatPrice(COD_MAX)}. Please use Razorpay.
                  </p>
                ) : (
                  <p className="mt-2 text-small text-text-muted">
                    Available for orders up to {formatPrice(COD_MAX)}
                  </p>
                )}
                <Button
                  type="button"
                  variant="outline"
                  className="mt-3"
                  disabled={codDisabled || loadingCod || loadingRazorpay}
                  onClick={placeCodOrder}
                >
                  {loadingCod ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Placing order...
                    </>
                  ) : (
                    "Place Order — Cash on Delivery"
                  )}
                </Button>
              </div>
            </div>
          </div>

          {/* Razorpay */}
          {razorpayEnabled && (
            <div className="rounded border border-border p-4">
              <div className="flex items-start gap-3">
                <CreditCard className="mt-0.5 h-5 w-5 shrink-0 text-secondary" />
                <div className="flex-1">
                  <p className="font-medium text-ink">Pay Online — Razorpay</p>
                  <p className="mt-1 text-small text-text-muted">
                    UPI, cards, netbanking & wallets. Required for orders above{" "}
                    {formatPrice(COD_MAX)}.
                  </p>
                  <Button
                    type="button"
                    className="mt-3"
                    disabled={loadingCod || loadingRazorpay}
                    onClick={startRazorpayCheckout}
                  >
                    {loadingRazorpay ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Preparing payment...
                      </>
                    ) : (
                      `Pay ${formatPrice(amounts.total)} with Razorpay`
                    )}
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        session.razorpay && (
          <RazorpayButton
            session={session}
            customerName={customerName}
            customerEmail={customerEmail}
            customerPhone={customerPhone}
          />
        )
      )}
    </div>
  );
}

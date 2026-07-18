"use client";

import { useEffect, useState } from "react";
import { Container } from "@/components/ui/Container";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { apiClient } from "@/lib/api";
import {
  ApiResponse,
  Address,
  CartItem,
  CheckoutQuote,
  ShippingAddress,
} from "@/lib/types";
import { formatPrice } from "@/lib/utils";
import { PaymentStep } from "./PaymentStep.client";

const INDIAN_STATES = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa",
  "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala",
  "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland",
  "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura",
  "Uttar Pradesh", "Uttarakhand", "West Bengal", "Delhi",
];

const emptyAddress: ShippingAddress = {
  name: "",
  phone: "",
  line1: "",
  line2: "",
  city: "",
  state: "",
  pincode: "",
};

export function CheckoutForm() {
  const [step, setStep] = useState<"address" | "pay">("address");
  const [items, setItems] = useState<CartItem[]>([]);
  const [quote, setQuote] = useState<CheckoutQuote | null>(null);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [user, setUser] = useState<{ name: string; email: string; phone: string } | null>(null);
  const [address, setAddress] = useState<ShippingAddress>(emptyAddress);
  const [saveAddress, setSaveAddress] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([
      apiClient.get<ApiResponse<{ items: CartItem[]; subtotal: number }>>("/api/cart"),
      apiClient.get<ApiResponse<CheckoutQuote>>("/api/checkout/quote"),
      apiClient.get<ApiResponse<{ name: string; email: string; phone: string; addresses: Address[] }>>("/api/auth/me"),
    ])
      .then(([cartRes, quoteRes, meRes]) => {
        if (cartRes.data.items.length === 0) {
          window.location.href = "/cart";
          return;
        }
        setItems(cartRes.data.items);
        setQuote(quoteRes.data);
        setUser({ name: meRes.data.name, email: meRes.data.email, phone: meRes.data.phone });
        setAddresses(meRes.data.addresses || []);
        const defaultAddr = meRes.data.addresses?.find((a) => a.isDefault) || meRes.data.addresses?.[0];
        if (defaultAddr) {
          setAddress({
            name: defaultAddr.name,
            phone: defaultAddr.phone,
            line1: defaultAddr.line1,
            line2: defaultAddr.line2 || "",
            city: defaultAddr.city,
            state: defaultAddr.state,
            pincode: defaultAddr.pincode,
          });
        } else {
          setAddress((a) => ({ ...a, name: meRes.data.name, phone: meRes.data.phone }));
        }
      })
      .catch((err) => {
        if (err.message.includes("401") || err.message.includes("Authentication")) {
          window.location.href = "/login?next=/checkout";
        } else {
          setError(err.message);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  function selectSavedAddress(addr: Address) {
    setAddress({
      name: addr.name,
      phone: addr.phone,
      line1: addr.line1,
      line2: addr.line2 || "",
      city: addr.city,
      state: addr.state,
      pincode: addr.pincode,
    });
  }

  function handleContinue(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setStep("pay");
  }

  if (loading) {
    return <Container className="py-20 text-center text-text-muted">Loading checkout...</Container>;
  }

  if (!quote) {
    return <Container className="py-20 text-center text-error">{error || "Could not load checkout"}</Container>;
  }

  const { amounts } = quote;

  return (
    <Container className="py-10 md:py-16">
      <h1 className="text-chapter text-ink">Checkout</h1>
      {error && <p className="mt-2 text-small text-error">{error}</p>}

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_360px]">
        <div>
          {step === "address" ? (
            <form onSubmit={handleContinue} className="space-y-4">
              <h2 className="text-title">Shipping Address</h2>

              {addresses.length > 0 && (
                <div className="space-y-2">
                  <p className="text-small text-text-muted">Saved addresses</p>
                  {addresses.map((addr) => (
                    <button
                      key={addr._id}
                      type="button"
                      onClick={() => selectSavedAddress(addr)}
                      className="block w-full rounded border border-border p-3 text-left text-small hover:border-secondary"
                    >
                      <span className="font-medium">{addr.label}</span>
                      <span className="mt-1 block text-text-muted">
                        {addr.line1}, {addr.city} — {addr.pincode}
                      </span>
                    </button>
                  ))}
                </div>
              )}

              <div className="grid gap-4 md:grid-cols-2">
                <Input
                  id="name"
                  label="Full name"
                  required
                  value={address.name}
                  onChange={(e) => setAddress({ ...address, name: e.target.value })}
                />
                <Input
                  id="phone"
                  label="Phone"
                  required
                  value={address.phone}
                  onChange={(e) => setAddress({ ...address, phone: e.target.value })}
                />
              </div>
              <Input
                id="line1"
                label="Address line 1"
                required
                value={address.line1}
                onChange={(e) => setAddress({ ...address, line1: e.target.value })}
              />
              <Input
                id="line2"
                label="Address line 2 (optional)"
                value={address.line2 || ""}
                onChange={(e) => setAddress({ ...address, line2: e.target.value })}
              />
              <div className="grid gap-4 md:grid-cols-3">
                <Input
                  id="city"
                  label="City"
                  required
                  value={address.city}
                  onChange={(e) => setAddress({ ...address, city: e.target.value })}
                />
                <div>
                  <label htmlFor="state" className="mb-1 block text-small text-text-muted">
                    State
                  </label>
                  <select
                    id="state"
                    required
                    value={address.state}
                    onChange={(e) => setAddress({ ...address, state: e.target.value })}
                    className="w-full border border-border bg-background px-3 py-2 text-small"
                  >
                    <option value="">Select state</option>
                    {INDIAN_STATES.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
                <Input
                  id="pincode"
                  label="Pincode"
                  required
                  pattern="\d{6}"
                  value={address.pincode}
                  onChange={(e) => setAddress({ ...address, pincode: e.target.value })}
                />
              </div>

              <label className="flex items-center gap-2 text-small">
                <input
                  type="checkbox"
                  checked={saveAddress}
                  onChange={(e) => setSaveAddress(e.target.checked)}
                />
                Save this address for future orders
              </label>

              <Button type="submit" size="lg">
                Continue to Payment
              </Button>
            </form>
          ) : (
            user && (
              <PaymentStep
                address={address}
                saveAddress={saveAddress}
                quote={quote}
                customerName={user.name}
                customerEmail={user.email}
                customerPhone={user.phone}
                onEditAddress={() => setStep("address")}
              />
            )
          )}
        </div>

        <div className="h-fit border border-border bg-surface p-6 lg:sticky lg:top-24">
          <h2 className="text-title">Order Summary</h2>
          <ul className="mt-4 space-y-3">
            {items.map((item) => (
              <li key={item.sareeId} className="flex justify-between text-small">
                <span className="text-text-muted">
                  {item.name} × {item.qty}
                </span>
                <span className="tabular-nums">{formatPrice(item.price * item.qty)}</span>
              </li>
            ))}
          </ul>
          <div className="mt-4 space-y-2 border-t border-border pt-4 text-small">
            <div className="flex justify-between">
              <span className="text-text-muted">Subtotal</span>
              <span className="tabular-nums">{formatPrice(amounts.subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-muted">Shipping</span>
              <span className="tabular-nums">
                {amounts.shipping === 0 ? "Free" : formatPrice(amounts.shipping)}
              </span>
            </div>
          </div>
          <div className="mt-4 flex justify-between border-t border-border pt-4 font-medium">
            <span>Total</span>
            <span className="text-primary tabular-nums">{formatPrice(amounts.total)}</span>
          </div>
          {!quote.codEligible && (
            <p className="mt-3 text-small text-text-muted">
              Orders above ₹10,000 require online payment (Razorpay).
            </p>
          )}
        </div>
      </div>
    </Container>
  );
}

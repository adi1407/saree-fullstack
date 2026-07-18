import { env } from "../config/env";
import { IShippingAddress } from "../models/Order";

export const SHIPROCKET_MOCK = !env.SHIPROCKET_EMAIL || !env.SHIPROCKET_PASSWORD;

interface ShiprocketAuthResponse {
  token: string;
}

interface ShipmentResult {
  awb: string;
  trackingUrl: string;
  mock: boolean;
}

let cachedToken: { token: string; expiresAt: number } | null = null;

async function getToken(): Promise<string> {
  if (cachedToken && Date.now() < cachedToken.expiresAt) {
    return cachedToken.token;
  }

  const res = await fetch("https://apiv2.shiprocket.in/v1/external/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: env.SHIPROCKET_EMAIL,
      password: env.SHIPROCKET_PASSWORD,
    }),
  });

  if (!res.ok) throw new Error(`Shiprocket auth failed: ${res.status}`);

  const data = (await res.json()) as ShiprocketAuthResponse;
  cachedToken = { token: data.token, expiresAt: Date.now() + 9 * 24 * 60 * 60 * 1000 };
  return data.token;
}

export async function createShipment(params: {
  orderNumber: string;
  orderId: string;
  shippingAddress: IShippingAddress;
  weightKg?: number;
  totalAmount: number;
}): Promise<ShipmentResult> {
  const { orderNumber, orderId, shippingAddress, totalAmount } = params;

  if (SHIPROCKET_MOCK) {
    const awb = `MOCK-AWB-${orderNumber}`;
    const trackingUrl = `${env.FRONTEND_URL}/orders/${orderId}`;
    return { awb, trackingUrl, mock: true };
  }

  const token = await getToken();

  const res = await fetch("https://apiv2.shiprocket.in/v1/external/orders/create/adhoc", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      order_id: orderNumber,
      order_date: new Date().toISOString().slice(0, 10),
      pickup_location: env.SHIPROCKET_PICKUP_LOCATION || "Primary",
      billing_customer_name: shippingAddress.name,
      billing_last_name: "",
      billing_address: shippingAddress.line1,
      billing_address_2: shippingAddress.line2 || "",
      billing_city: shippingAddress.city,
      billing_pincode: shippingAddress.pincode,
      billing_state: shippingAddress.state,
      billing_country: "India",
      billing_email: "orders@aadiora.com",
      billing_phone: shippingAddress.phone,
      shipping_is_billing: true,
      order_items: [{ name: "Saree", sku: orderNumber, units: 1, selling_price: totalAmount }],
      payment_method: "Prepaid",
      sub_total: totalAmount,
      length: 30,
      breadth: 25,
      height: 5,
      weight: params.weightKg ?? 0.5,
    }),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Shiprocket create order failed: ${errText}`);
  }

  const data = (await res.json()) as { awb_code?: string; shipment_id?: number };
  const awb = data.awb_code || `SR-${orderNumber}`;
  const trackingUrl = `https://shiprocket.co/tracking/${awb}`;

  return { awb, trackingUrl, mock: false };
}

export type WeaveType =
  | "banarasi"
  | "kanjeevaram"
  | "chanderi"
  | "maheshwari"
  | "bandhani"
  | "patola"
  | "other";

export type OccasionType = "wedding" | "festive" | "office" | "puja" | "casual";

export interface SareeImages {
  gallery: string[];
  spinFrames: string[];
  spinPoster: string;
  /** MP4 of model rotating 360° on turntable — drag to scrub angles */
  spinVideo?: string;
}

export interface Saree {
  _id: string;
  slug: string;
  name: string;
  description: string;
  price: number;
  compareAtPrice?: number;
  sku: string;
  weave: WeaveType;
  occasion: OccasionType[];
  fabric: string;
  length: string;
  blouseIncluded: boolean;
  colors: { primary: string; secondary?: string };
  images: SareeImages;
  inventory: number;
  isPublished: boolean;
  isNewArrival: boolean;
  seoTitle?: string;
  seoDescription?: string;
  craftStory?: string;
}

export type OrderStatus =
  | "pending_payment"
  | "paid"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled";

export interface ShippingAddress {
  name: string;
  phone: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  pincode: string;
}

export interface Address extends ShippingAddress {
  _id: string;
  label: string;
  isDefault?: boolean;
}

export interface OrderItem {
  sareeId: string;
  name: string;
  slug: string;
  price: number;
  qty: number;
  image: string;
}

export interface OrderAmounts {
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
}

export interface Order {
  _id: string;
  userId: string | { _id: string; name: string; email: string; phone: string };
  orderNumber: string;
  items: OrderItem[];
  shippingAddress: ShippingAddress;
  amounts: OrderAmounts;
  status: OrderStatus;
  paymentMethod?: "razorpay" | "cod";
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  awb?: string;
  trackingUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CheckoutQuote {
  amounts: OrderAmounts;
  codEligible: boolean;
  razorpayEnabled: boolean;
  razorpayMock?: boolean;
}

export interface CheckoutSession {
  orderId: string;
  orderNumber: string;
  amounts: OrderAmounts;
  paymentMethod: "razorpay" | "cod";
  status?: OrderStatus;
  razorpay?: {
    keyId: string;
    orderId: string;
    amount: number;
    currency: string;
    mock: boolean;
  };
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: "customer" | "admin";
  addresses?: Address[];
}

export interface CartItem {
  sareeId: string;
  slug: string;
  name: string;
  price: number;
  qty: number;
  image: string;
  inventory: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export const WEAVE_LABELS: Record<WeaveType, string> = {
  banarasi: "Banarasi",
  kanjeevaram: "Kanjeevaram",
  chanderi: "Chanderi",
  maheshwari: "Maheshwari",
  bandhani: "Bandhani",
  patola: "Patola",
  other: "Other",
};

export const OCCASION_LABELS: Record<OccasionType, string> = {
  wedding: "Wedding",
  festive: "Festive",
  office: "Office",
  puja: "Puja",
  casual: "Casual",
};

export const WEAVES: { slug: WeaveType; label: string; region: string }[] = [
  { slug: "banarasi", label: "Banarasi", region: "Varanasi, UP" },
  { slug: "kanjeevaram", label: "Kanjeevaram", region: "Kanchipuram, TN" },
  { slug: "chanderi", label: "Chanderi", region: "Madhya Pradesh" },
  { slug: "maheshwari", label: "Maheshwari", region: "Maheshwar, MP" },
  { slug: "bandhani", label: "Bandhani", region: "Rajasthan & Gujarat" },
  { slug: "patola", label: "Patola", region: "Patan, Gujarat" },
];

export const OCCASIONS: { slug: OccasionType; label: string; description: string }[] = [
  { slug: "wedding", label: "Wedding", description: "Bridal & reception drapes" },
  { slug: "festive", label: "Festive", description: "Diwali, Navratri & celebrations" },
  { slug: "office", label: "Office", description: "Elegant everyday weaves" },
  { slug: "puja", label: "Puja", description: "Traditional ceremonial wear" },
];

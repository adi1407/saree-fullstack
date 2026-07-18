export interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

export interface FaqGroup {
  id: string;
  title: string;
  items: FaqItem[];
}

export const FAQ_GROUPS: FaqGroup[] = [
  {
    id: "orders",
    title: "Orders",
    items: [
      {
        id: "track-order",
        question: "How do I track my order?",
        answer:
          "Once your saree ships, you'll receive an email with tracking details. You can also view order status in your account under Orders.",
      },
      {
        id: "modify-order",
        question: "Can I modify or cancel my order?",
        answer:
          "Orders can be modified or cancelled within 2 hours of placement. Email shop@aadiora.com with your order number.",
      },
    ],
  },
  {
    id: "shipping",
    title: "Shipping",
    items: [
      {
        id: "delivery-time",
        question: "How long does delivery take?",
        answer:
          "Orders dispatch within 2–3 business days. Metro cities receive delivery in 3–5 days; other locations in 5–8 business days.",
      },
      {
        id: "free-shipping",
        question: "Is shipping free?",
        answer:
          "Flat shipping of ₹199 applies on orders below ₹10,000. Enjoy complimentary pan-India delivery on orders above ₹10,000.",
      },
    ],
  },
  {
    id: "returns",
    title: "Returns",
    items: [
      {
        id: "return-policy",
        question: "What is your return policy?",
        answer:
          "Unworn sarees with original tags may be returned within 7 days of delivery. Custom or altered pieces are not eligible.",
      },
      {
        id: "exchange",
        question: "Can I exchange for a different saree?",
        answer:
          "Yes — exchanges are processed as a return and new order. Contact us within 7 days to initiate.",
      },
    ],
  },
  {
    id: "payments",
    title: "Payments",
    items: [
      {
        id: "payment-methods",
        question: "What payment methods do you accept?",
        answer:
          "We accept Razorpay (cards, UPI, netbanking, wallets) and Cash on Delivery for orders up to ₹10,000.",
      },
      {
        id: "cod-limit",
        question: "Why is COD not available on large orders?",
        answer:
          "For orders above ₹10,000, we require prepaid payment via Razorpay to ensure secure handling of high-value heirlooms.",
      },
    ],
  },
  {
    id: "sizing",
    title: "Sizing & Fit",
    items: [
      {
        id: "saree-length",
        question: "What is the standard saree length?",
        answer:
          "Most AADIORA sarees are 5.5–6.5 metres, suitable for heights up to 5'8\". Specific lengths are listed on each product page.",
      },
      {
        id: "blouse",
        question: "Is blouse fabric included?",
        answer:
          "Blouse piece inclusion varies by saree. Check the product details — unattached blouse fabric is noted where included.",
      },
    ],
  },
];

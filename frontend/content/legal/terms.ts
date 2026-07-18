import type { LegalDocument } from "./privacy";

export const TERMS_OF_SERVICE: LegalDocument = {
  title: "Terms of Service",
  lastUpdated: "June 1, 2026",
  intro:
    "By accessing or using the AADIORA website, you agree to these Terms of Service. Please read them carefully before making a purchase.",
  sections: [
    {
      id: "products",
      title: "Products & authenticity",
      paragraphs: [
        "All sarees are handwoven and may exhibit minor variations characteristic of artisan craft. These are not defects.",
        "We guarantee handloom authenticity. GI-tagged products include certification where applicable.",
      ],
    },
    {
      id: "orders",
      title: "Orders & payment",
      paragraphs: [
        "Order confirmation constitutes acceptance of your offer to purchase. We reserve the right to cancel orders in case of pricing errors or stock unavailability.",
        "Prices are in Indian Rupees (INR) and inclusive of applicable taxes unless stated otherwise.",
      ],
    },
    {
      id: "shipping",
      title: "Shipping & delivery",
      paragraphs: [
        "Delivery timelines are estimates. AADIORA is not liable for delays caused by courier partners or force majeure events.",
        "Risk of loss passes to you upon delivery to the address provided.",
      ],
    },
    {
      id: "returns",
      title: "Returns & refunds",
      paragraphs: [
        "Returns must be initiated within 7 days of delivery. Items must be unworn with original tags attached.",
        "Refunds are processed within 7–10 business days after we receive and inspect the returned item.",
      ],
    },
    {
      id: "liability",
      title: "Limitation of liability",
      paragraphs: [
        "AADIORA's liability is limited to the purchase price of the product. We are not liable for indirect or consequential damages.",
      ],
    },
  ],
};

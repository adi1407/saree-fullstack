export interface LegalSection {
  id: string;
  title: string;
  paragraphs: string[];
}

export interface LegalDocument {
  title: string;
  lastUpdated: string;
  intro: string;
  sections: LegalSection[];
}

export const PRIVACY_POLICY: LegalDocument = {
  title: "Privacy Policy",
  lastUpdated: "June 1, 2026",
  intro:
    "AADIORA Fashion (\"we\", \"us\") respects your privacy. This policy explains how we collect, use, and protect your personal information when you use our website and services.",
  sections: [
    {
      id: "collection",
      title: "Information we collect",
      paragraphs: [
        "We collect information you provide directly: name, email, phone, shipping address, and payment details processed securely via Razorpay.",
        "We automatically collect device information, IP address, and browsing behaviour through cookies and analytics to improve our service.",
      ],
    },
    {
      id: "use",
      title: "How we use your information",
      paragraphs: [
        "To process orders, deliver products, and provide customer support.",
        "To send order updates and, with your consent, marketing communications.",
        "To prevent fraud and comply with legal obligations.",
      ],
    },
    {
      id: "sharing",
      title: "Information sharing",
      paragraphs: [
        "We share data with delivery partners and payment processors only as needed to fulfil your order.",
        "We do not sell your personal information to third parties.",
      ],
    },
    {
      id: "rights",
      title: "Your rights",
      paragraphs: [
        "You may request access, correction, or deletion of your personal data by emailing shop@aadiora.com.",
        "You may opt out of marketing emails at any time using the unsubscribe link.",
      ],
    },
    {
      id: "security",
      title: "Security",
      paragraphs: [
        "We use industry-standard encryption for data transmission. Payment card details are handled exclusively by Razorpay and never stored on our servers.",
      ],
    },
  ],
};

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

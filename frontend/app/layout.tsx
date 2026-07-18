import { Cormorant_Garamond, DM_Serif_Display, Inter } from "next/font/google";
import type { Metadata } from "next";
import "./globals.css";
import { BRAND_DESCRIPTION, BRAND_FULL, BRAND_LOGO_ICON_SRC, BRAND_NAME } from "@/lib/brand";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const dmSerifDisplay = DM_Serif_Display({
  variable: "--font-dm-serif",
  subsets: ["latin"],
  weight: ["400"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${BRAND_NAME} — Curated Handwoven Sarees`,
    template: `%s | ${BRAND_NAME}`,
  },
  description: BRAND_DESCRIPTION,
  alternates: { canonical: "/" },
  icons: {
    icon: BRAND_LOGO_ICON_SRC,
    apple: BRAND_LOGO_ICON_SRC,
  },
  openGraph: {
    type: "website",
    title: BRAND_FULL,
    description: BRAND_DESCRIPTION,
    siteName: BRAND_NAME,
    url: SITE_URL,
  },
  twitter: {
    card: "summary_large_image",
    title: BRAND_FULL,
    description: BRAND_DESCRIPTION,
  },
};

const organizationLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: BRAND_NAME,
  url: SITE_URL,
  logo: `${SITE_URL}${BRAND_LOGO_ICON_SRC}`,
  description: BRAND_DESCRIPTION,
};

const websiteLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: BRAND_NAME,
  url: SITE_URL,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${cormorant.variable} ${dmSerifDisplay.variable} ${inter.variable} h-full`}
    >
      <body className="min-h-full flex flex-col antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteLd) }}
        />
        {children}
      </body>
    </html>
  );
}

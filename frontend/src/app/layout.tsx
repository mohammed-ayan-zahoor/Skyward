import type { Metadata } from "next";
import "./globals.css";

const SITE_URL = "https://skywardcanopies.com";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Structural Steel Canopies & PEB Fabricator | Skyward KGF, Karnataka",
    template: "%s | Skyward Structural Canopies",
  },
  description:
    "Skyward is a premier B2B structural fabricator in KGF, Karnataka, specialising in Pre-Engineered Buildings (PEB), high-capacity industrial warehouses, and petrol station canopies certified for wind & seismic loads.",
  keywords: [
    "petrol station canopy fabricator",
    "PEB fabricator Karnataka",
    "pre-engineered steel buildings India",
    "industrial warehouse fabricator",
    "structural steel canopy KGF",
    "canopy fabricator for oil companies",
    "HPCL BPCL canopy contractor",
  ],
  alternates: {
    canonical: SITE_URL,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  icons: {
    icon: [
      { url: "/fav.png", type: "image/png" },
      { url: "/favicon.ico" },
    ],
    shortcut: "/fav.png",
    apple: "/fav.png",
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: SITE_URL,
    siteName: "Skyward Structural Canopies",
    title: "Structural Steel Canopies & PEB Fabricator | Skyward KGF, Karnataka",
    description:
      "B2B structural fabricator specialising in PEB industrial buildings, high-capacity warehouses, and petrol station canopies. Certified for wind & seismic loads. Serving Indian Oil, HPCL, BPCL, Shell & independents.",
    images: [
      {
        url: "/hero-construction.jpg",
        width: 1200,
        height: 630,
        alt: "Skyward Pre-Engineered Steel Canopy Structure",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Structural Steel Canopies & PEB Fabricator | Skyward KGF",
    description:
      "B2B structural fabricator for petrol stations, warehouses, and PEB buildings. Certified wind-rated steel structures. Based in KGF, Karnataka.",
    images: ["/hero-construction.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="font-sans">
      <body className="antialiased font-sans min-h-screen flex flex-col bg-bg-warm text-body-dark">
        {children}
      </body>
    </html>
  );
}

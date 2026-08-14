import Link from "next/link";
import Image from "next/image";
import AppMenuBar from "@/components/ui/app-menu-bar";
import { Footer } from "@/components/ui/footer";
import { PreloaderProvider } from "@/components/ui/preloader-provider";

const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": ["LocalBusiness", "GeneralContractor"],
  name: "Skyward Structural Canopies",
  image: "https://skywardkgf.com/logo.png",
  logo: "https://skywardkgf.com/logo.png",
  description:
    "Premier B2B fabricator of pre-engineered steel buildings (PEB), industrial warehouses, and petrol station canopies in Karnataka, India. Certified for wind & seismic loads.",
  url: "https://skywardkgf.com",
  telephone: "+91-99163-39916",
  email: "skywardkgf@gmail.com",
  address: {
    "@type": "PostalAddress",
    streetAddress: "#27, Krishnageri Lane, Marikuppam Post",
    addressLocality: "K.G.F.",
    addressRegion: "Karnataka",
    postalCode: "563119",
    addressCountry: "IN",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: 12.9563,
    longitude: 78.2719,
  },
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: "09:00",
      closes: "18:00",
    },
  ],
  areaServed: {
    "@type": "State",
    name: "Karnataka",
  },
  sameAs: [
    "https://facebook.com",
    "https://instagram.com",
    "https://linkedin.com",
  ],
};

export default function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <PreloaderProvider>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
      />
      <header className="w-full max-w-7xl mx-auto py-4 px-5 md:px-10 flex items-center justify-between sticky top-0 z-50">
        <Link href="/" className="flex items-center">
          <Image
            src="/logo.png"
            alt="Skyward Logo"
            width={265}
            height={65}
            className="h-20 md:h-28 w-auto object-contain select-none"
            priority
          />
        </Link>
        <AppMenuBar />
      </header>
      <main className="flex-1 flex flex-col">{children}</main>
      <Footer />
    </PreloaderProvider>
  );
}


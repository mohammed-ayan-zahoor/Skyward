import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";
import AppMenuBar from "@/components/ui/app-menu-bar";
import { Footer } from "@/components/ui/footer";
import { PreloaderProvider } from "@/components/ui/preloader-provider";

export const metadata: Metadata = {
  title: "Skyward | Structural Canopies",
  description: "High-span steel and aluminum canopies engineered for petrol stations and commercial sites.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased font-sans min-h-screen flex flex-col bg-bg-warm text-body-dark">
        <PreloaderProvider>
          <header className="w-full max-w-7xl mx-auto py-4 px-5 md:px-10 flex items-center justify-between sticky top-0 z-50">
            <Link href="/" className="flex items-center">
              <img 
                src="/logo.png" 
                alt="Skyward Logo" 
                className="h-12 md:h-16 w-auto object-contain select-none" 
              />
            </Link>
            <AppMenuBar />
          </header>
          <main className="flex-1 flex flex-col">{children}</main>
          <Footer />
        </PreloaderProvider>
      </body>
    </html>
  );
}

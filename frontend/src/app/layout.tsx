import type { Metadata } from "next";
import "./globals.css";

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
    <html lang="en" className="font-sans">
      <body className="antialiased font-sans min-h-screen flex flex-col bg-bg-warm text-body-dark">
        {children}
      </body>
    </html>
  );
}

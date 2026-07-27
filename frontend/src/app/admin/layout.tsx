import type { Metadata } from "next";
import "../globals.css";

export const metadata: Metadata = {
  title: "Skyward · Job Register",
  description: "Admin control panel",
  robots: { index: false, follow: false },
};

// Completely isolated layout — no public header/footer/preloader
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="admin-shell min-h-screen bg-background text-foreground font-sans antialiased">
      {children}
    </div>
  );
}

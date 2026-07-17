import type { ReactNode } from "react";
import { Header } from "./Header";
import { Footer } from "./Footer";

export function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <div className="relative min-h-screen flex flex-col bg-surface">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}

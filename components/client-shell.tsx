"use client";

import { usePathname } from "next/navigation";
import Nav from "./nav";
import Footer from "./footer";
import { Particles } from "./ui";

export default function ClientShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/vault-");

  return (
    <>
      {/* Global overlays */}
      <div className="grain-overlay" />
      <div className="scanlines" />
      <Particles />

      <div className="relative z-[1]">
        {!isAdmin && <Nav />}
        <main className="animate-fade-up">{children}</main>
        {!isAdmin && <Footer />}
      </div>
    </>
  );
}

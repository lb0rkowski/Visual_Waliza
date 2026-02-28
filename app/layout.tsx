import type { Metadata } from "next";
import "./globals.css";
import { BookingProvider } from "@/lib/store";
import ClientShell from "@/components/client-shell";

export const metadata: Metadata = {
  title: "Caseout Studio — Nagrania · Mix · Master · Warszawa",
  description: "Warszawskie studio nagraniowe z undergroundowym DNA. Kopernika 30.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pl">
      <body>
        <BookingProvider>
          <ClientShell>{children}</ClientShell>
        </BookingProvider>
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import "./globals.css";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Ramadanbot v2.0 | Year-Round Islamic Companion",
  description:
    "Ramadanbot v2.0 is now year-round: Quran reader, completion plans, Hadith collections, Hijri calendar, and prayer times."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <header className="site-header">
          <div className="container nav">
            <Link href="/" className="brand">
              Ramadanbot v2.0
            </Link>
            <nav className="menu">
              <Link href="/features">Features</Link>
              <Link href="/library">Islamic Library</Link>
              <Link href="/about">About Founder</Link>
              <Link href="/privacy">Privacy</Link>
              <Link href="/contact">Contact</Link>
            </nav>
          </div>
        </header>
        {children}
      </body>
    </html>
  );
}

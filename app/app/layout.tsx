import type { Metadata, Viewport } from "next";
import { Inter, Amiri, Cinzel, Cormorant_Garamond } from "next/font/google";
import React from "react";
import { PWARegistration } from "@/components/PWARegistration";
import "../globals.css";

const inter = Inter({ subsets: ["latin"], variable: '--font-inter' });
const amiri = Amiri({ weight: ['400', '700'], subsets: ["arabic"], variable: '--font-amiri' });
const cinzel = Cinzel({ subsets: ["latin"], variable: '--font-cinzel' });
const cormorant = Cormorant_Garamond({ weight: ['300', '400', '600'], subsets: ["latin"], variable: '--font-cormorant' });

export const metadata: Metadata = {
  title: "Ramadan Bot: Create Beautiful Spiritual Flyers",
  description: "Create beautiful, personalized Ramadan flyers and Islamic spiritual content with ease. AI-powered reflections grounded in Quranic and Prophetic teachings.",
  metadataBase: new URL("https://www.ramadanbot.app/app"),
  manifest: "/manifest.json",
  keywords: ["Ramadan", "Flyer", "Islamic", "Spiritual", "AI", "Generator"],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://www.ramadanbot.app/app",
    siteName: "Ramadan Bot",
    title: "Ramadan Bot: Create Beautiful Spiritual Flyers",
    description: "Create beautiful, personalized Ramadan flyers and Islamic spiritual content.",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
  themeColor: "#000000",
};

export default function AppLayout({ children }: Readonly<{ children: React.ReactNode; }>) {
  return (
    <html lang="en">
      <head>
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Ramadan Bot" />
        <meta name="application-name" content="Ramadan Bot" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" href="/icon.png" type="image/png" />
        <meta name="theme-color" content="#0f766e" />
        <meta name="description" content="Create beautiful, personalized Ramadan flyers and Islamic spiritual content." />
      </head>
      <body className={`${inter.variable} ${amiri.variable} ${cinzel.variable} ${cormorant.variable} antialiased bg-black flex justify-center items-center h-screen w-screen overflow-hidden`} style={{ backgroundColor: '#000000', color: '#ffffff' }}>
        <PWARegistration />
        {children}
      </body>
    </html>
  );
}

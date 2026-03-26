import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://firstaidbuddy.app";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "First-Aid Buddy — AI-Powered First-Aid Guidance",
    template: "%s — First-Aid Buddy",
  },
  description:
    "Instant, AI-powered first-aid guidance grounded in NHS, Red Cross & St John Ambulance guidelines. Step-by-step instructions with cited sources. Not medical advice — always call emergency services in life-threatening situations.",
  keywords: ["first aid", "emergency guidance", "CPR", "choking", "AI first aid", "first aid steps"],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "First-Aid Buddy — AI-Powered First-Aid Guidance",
    description:
      "Instant, AI-powered first-aid guidance grounded in NHS, Red Cross & St John Ambulance guidelines. Step-by-step first-aid instructions with cited sources. Not medical advice.",
    url: "/",
    siteName: "First-Aid Buddy",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "First-Aid Buddy — AI First-Aid Guidance",
      },
    ],
    locale: "en_GB",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "First-Aid Buddy — AI-Powered First-Aid Guidance",
    description:
      "Instant, AI-powered first-aid guidance grounded in NHS, Red Cross & St John Ambulance guidelines. Not medical advice.",
    images: ["/og-image.png"],
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: "#D4AF37",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="antialiased font-[Inter,system-ui,sans-serif]">
        {/* Skip to main content — WCAG 2.1 SC 2.4.1 */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[9999] focus:px-4 focus:py-2 focus:rounded-xl focus:font-semibold focus:text-sm focus:text-black"
          style={{ background: "#D4AF37" }}
        >
          Skip to main content
        </a>
        {children}
      </body>
    </html>
  );
}

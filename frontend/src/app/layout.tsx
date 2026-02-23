import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "First-Aid Buddy — AI-Powered Emergency Guidance",
  description:
    "Instant, AI-powered first-aid guidance backed by NHS, Red Cross, and St John Ambulance protocols. Step-by-step emergency instructions with cited sources.",
  keywords: ["first aid", "emergency", "NHS", "AI health", "CPR", "choking"],
};

export const viewport: Viewport = {
  themeColor: "#050B18",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="antialiased font-[Inter,system-ui,sans-serif]">
        {children}
      </body>
    </html>
  );
}

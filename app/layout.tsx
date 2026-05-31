import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AYO — The Ancient Seed Game",
  description: "A 3D Ayo mancala game with animated player hands. Play vs a friend or challenge OTA the AI.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#1A0800",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full">
      <body className="h-full bg-[#1A0800]">{children}</body>
    </html>
  );
}

import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Gmail Recovery Helper — Recover Your Locked Gmail Account",
  description: "Step-by-step Gmail account recovery using device verification. Guided process, progress tracking, and automated assistance."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-[#0d1117] text-[#c9d1d9] antialiased">{children}</body>
    </html>
  );
}

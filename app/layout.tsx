import type { Metadata } from "next";
import { Space_Grotesk, IBM_Plex_Sans } from "next/font/google";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: ["500", "700"]
});

const ibmPlexSans = IBM_Plex_Sans({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"]
});

export const metadata: Metadata = {
  metadataBase: new URL("https://gmail-recovery-helper.example.com"),
  title: "Gmail Recovery Helper | Recover Locked Gmail Accounts",
  description:
    "Recover locked Gmail accounts with a guided device verification workflow, proven recovery tactics, and support-ready templates that reduce dead-end attempts.",
  keywords: [
    "gmail recovery",
    "locked gmail account",
    "google account recovery",
    "device verification",
    "email account recovery tool"
  ],
  openGraph: {
    type: "website",
    url: "https://gmail-recovery-helper.example.com",
    title: "Recover Locked Gmail Accounts With Device Verification",
    description:
      "Step-by-step guidance for Gmail account recovery, including method selection, timelines, and support escalation templates.",
    siteName: "Gmail Recovery Helper"
  },
  twitter: {
    card: "summary_large_image",
    title: "Gmail Recovery Helper",
    description:
      "Recover locked Gmail accounts faster with guided device verification and support escalation templates."
  },
  alternates: {
    canonical: "/"
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${spaceGrotesk.variable} ${ibmPlexSans.variable} antialiased`}>{children}</body>
    </html>
  );
}

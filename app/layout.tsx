import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Dango Grid Bot — Automated DeFi Trading",
  description:
    "Automated grid trading bot for Dango Exchange. Farm volume, earn airdrop points, and manage your DeFi strategy — all from one dashboard.",
  openGraph: {
    title: "Dango Grid Bot",
    description: "Automated grid trading on Dango Exchange",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@300;400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="grain">{children}</body>
    </html>
  );
}

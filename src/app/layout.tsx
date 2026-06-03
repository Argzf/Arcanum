import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "URL Shortener",
  description: "Simple link shortener powered by Turso",
  icons: {
    icon: [
      { url: "/links-favicon.svg", type: "image/svg+xml" },
    ],
    // You can also add apple-touch-icon, etc.
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}

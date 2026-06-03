import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "URL Shortener",
  description: "Simple link shortener powered by Turso",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

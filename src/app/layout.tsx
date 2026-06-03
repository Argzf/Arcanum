'use client';

import { usePathname } from 'next/navigation';
import "./globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  let favicon = "/links-favicon.svg"; // default
  if (pathname?.startsWith('/files')) {
    favicon = "/files-favicon.svg";
  }

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href={favicon} type="image/svg+xml" />
      </head>
      <body>{children}</body>
    </html>
  );
}

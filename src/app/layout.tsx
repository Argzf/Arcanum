'use client';

import { usePathname } from 'next/navigation';
import "./globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // Determine favicon based on route
  let favicon = "/central-favicon.svg"; // default for public pages
  if (pathname?.startsWith('/links')) {
    favicon = "/links-favicon.svg";
  } else if (pathname?.startsWith('/files')) {
    favicon = "/files-favicon.svg";
  } else if (pathname?.startsWith('/admin') || pathname?.startsWith('/manage')) {
    favicon = "/central-favicon.svg";
  }

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href={favicon} type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/central-favicon.svg" />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}

'use client';

import { usePathname } from 'next/navigation';
import "./globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // Determine page title and favicon
  let title = 'Arcanum';
  let favicon = "/central-favicon.svg";

  if (pathname?.startsWith('/admin')) {
    title = 'Dashboard – Arcanum';
    favicon = "/central-favicon.svg";
  } else if (pathname?.startsWith('/manage')) {
    title = 'Login – Arcanum';
    favicon = "/central-favicon.svg";
  } else if (pathname?.startsWith('/status')) {
    title = 'Status – Arcanum';
    favicon = "/central-favicon.svg";
  } else if (pathname?.startsWith('/links')) {
    title = 'Arcanum Link Directory';
    favicon = "/links-favicon.svg";
  } else if (pathname?.startsWith('/files')) {
    title = 'Arcanum File Vault';
    favicon = "/files-favicon.svg";
  }

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <title>{title}</title>
        <link rel="icon" href={favicon} type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/central-favicon.icon" />
        <meta name="description" content="Private short links and file hosting" />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}

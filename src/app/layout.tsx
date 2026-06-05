// src/app/layout.tsx
import type { Metadata } from 'next';
import { headers } from 'next/headers';
import "./globals.css";

const defaultMetadata: Metadata = {
  title: 'Arcanum',
  description: 'Private link shortening and file hosting — secure and private',
  openGraph: {
    title: 'Arcanum',
    description: 'Private link shortening and file hosting — secure and private',
    images: [
      {
        url: '/banner.png',
        width: 1200,
        height: 630,
        alt: 'Arcanum Banner',
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Arcanum',
    description: 'Private link shortening and file hosting — secure and private',
    images: ['/banner.png'],
  },
};

const isSharingRoute = (pathname: string) => {
  return pathname.startsWith('/links/') || pathname.startsWith('/files/');
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const headersList = headers();
  const pathname = headersList.get('x-pathname') || '';

  let title = 'Arcanum';
  let favicon = "/central-favicon.svg";

  if (pathname.startsWith('/admin')) {
    title = 'Dashboard – Arcanum';
    favicon = "/central-favicon.svg";
  } else if (pathname.startsWith('/manage')) {
    title = 'Login – Arcanum';
    favicon = "/central-favicon.svg";
  } else if (pathname.startsWith('/status')) {
    title = 'Status – Arcanum';
    favicon = "/central-favicon.svg";
  } else if (pathname.startsWith('/links')) {
    title = 'Arcanum Link Directory';
    favicon = "/links-favicon.svg";
  } else if (pathname.startsWith('/files')) {
    title = 'Arcanum File Vault';
    favicon = "/files-favicon.svg";
  }

  // Ensure description is string or undefined (never null)
  const metaDescription = defaultMetadata.description ?? undefined;

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <title>{title}</title>
        <link rel="icon" href={favicon} type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/central-favicon-180.png" />
        {/* Use the same description for all non‑sharing pages (or only when title is not a sharing title) */}
        <meta name="description" content={!isSharingRoute(pathname) ? metaDescription : undefined} />

        {!isSharingRoute(pathname) && (
          <>
            <meta property="og:type" content={defaultMetadata.openGraph?.type?.toString()} />
            <meta property="og:title" content={defaultMetadata.openGraph?.title?.toString()} />
            <meta property="og:description" content={defaultMetadata.openGraph?.description?.toString()} />
            <meta property="og:image" content={defaultMetadata.openGraph?.images?.[0]?.url.toString()} />
            <meta property="og:image:width" content="1200" />
            <meta property="og:image:height" content="630" />
            <meta property="og:site_name" content="Arcanum" />

            <meta name="twitter:card" content={defaultMetadata.twitter?.card?.toString()} />
            <meta name="twitter:title" content={defaultMetadata.twitter?.title?.toString()} />
            <meta name="twitter:description" content={defaultMetadata.twitter?.description?.toString()} />
            <meta name="twitter:image" content={defaultMetadata.twitter?.images?.[0]?.toString()} />
          </>
        )}
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}

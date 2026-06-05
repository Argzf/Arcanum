// src/app/layout.tsx
import type { Metadata } from 'next';
import { headers } from 'next/headers';
import "./globals.css";

// Static metadata for the website (title, description, etc.)
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
};

// This function determines if the current path is a sharing route (/links/* or /files/*)
const isSharingRoute = (pathname: string) => {
  return pathname.startsWith('/links/') || pathname.startsWith('/files/');
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // We need to get the pathname on the server. In a Client Component,
  // usePathname() is the way, but for layout.tsx (Server Component), we can use headers.
  const headersList = headers();
  const pathname = headersList.get('x-pathname') || ''; 

  // Dynamic favicon logic (unchanged from your current implementation)
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

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Basic Meta Tags */}
        <title>{title}</title>
        <link rel="icon" href={favicon} type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/central-favicon-180.png" />
        <meta name="description" content={title === 'Arcanum' ? defaultMetadata.description : undefined} />

        {/* Conditionally Inject Open Graph & Twitter Meta Tags for non-sharing routes */}
        {!isSharingRoute(pathname) && (
          <>
            {/* Open Graph / Facebook */}
            <meta property="og:type" content={defaultMetadata.openGraph?.type?.toString()} />
            <meta property="og:title" content={defaultMetadata.openGraph?.title?.toString()} />
            <meta property="og:description" content={defaultMetadata.openGraph?.description?.toString()} />
            <meta property="og:image" content={defaultMetadata.openGraph?.images?.[0]?.url.toString()} />
            <meta property="og:image:width" content="1200" />
            <meta property="og:image:height" content="630" />
            <meta property="og:site_name" content="Arcanum" />

            {/* Twitter */}
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

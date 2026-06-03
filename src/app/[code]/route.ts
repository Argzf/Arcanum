import { getLinkByCode } from '@/lib/db';
import { notFound, redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ code: string }> }
) {
  const { code } = await params;
  console.log(`[ShortLink] Looking up code: "${code}"`);

  // Case‑insensitive lookup
  const link = await getLinkByCode(code);

  if (!link) {
    console.log(`[ShortLink] No link found for code: ${code}`);
    notFound(); // returns 404
  }

  console.log(`[ShortLink] Redirecting to: ${link.destination}`);
  redirect(link.destination);
}

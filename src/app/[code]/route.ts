import { getLinkByCode } from '@/lib/db';
import { notFound, redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ code: string }> }
) {
  const url = new URL(request.url);
  const host = request.headers.get('host');
  console.log(`[ShortLink] Request received on host: ${host}, full URL: ${url.href}`);

  const { code } = await params;
  console.log(`[ShortLink] Looking up code: "${code}"`);

  const link = await getLinkByCode(code);

  if (!link) {
    console.log(`[ShortLink] No link found for code: ${code}`);
    return new Response('Not Found', { status: 404 });
  }

  console.log(`[ShortLink] Redirecting to: ${link.destination}`);
  redirect(link.destination);
}

import { getItemByCode } from '@/lib/db';
import { redirect, notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ legacyCode: string }> }
) {
  const { legacyCode } = await params;
  console.log(`[LegacyRoute] Looking for code: ${legacyCode}`); // log for debugging

  const item = await getItemByCode(legacyCode);
  if (!item) {
    console.log(`[LegacyRoute] No item found, calling notFound()`);
    notFound(); // this should trigger our custom 404 page
  }

  const prefix = item.type === 'link' ? 'links' : 'files';
  console.log(`[LegacyRoute] Redirecting to /${prefix}/${legacyCode}`);
  redirect(`/${prefix}/${legacyCode}`);
}

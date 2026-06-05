import { getItemByCode } from '@/lib/db';
import { redirect, notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ legacyCode: string }> }
) {
  const { legacyCode } = await params;
  const item = await getItemByCode(legacyCode);
  if (!item) notFound();

  const prefix = item.type === 'link' ? 'links' : 'files';
  redirect(`/${prefix}/${legacyCode}`);
}

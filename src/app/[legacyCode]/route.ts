import { getItemByCode } from '@/lib/db';
import { notFound, redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ legacyCode: string }> }
) {
  const { legacyCode } = await params;
  // This function searches without type restriction
  const item = await getItemByCode(legacyCode);
  if (!item) notFound();

  const prefix = item.type === 'link' ? 'links' : 'files';
  redirect(`/${prefix}/${legacyCode}`);
}

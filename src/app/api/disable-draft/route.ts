import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

// Next's draft-mode cookie, the one /api/draft sets.
const DRAFT_COOKIE = '__prerender_bypass';

export async function GET() {
  // Not draftMode().disable(): its delete omits Partitioned, which selects a
  // different cookie jar and so never matches what /api/draft set.
  (await cookies()).set({
    name: DRAFT_COOKIE,
    value: '',
    httpOnly: true,
    path: '/',
    partitioned: true,
    secure: true,
    sameSite: 'none',
    expires: new Date(0),
  });

  redirect('/');
}

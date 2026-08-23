import { cookies, draftMode } from 'next/headers';
import { redirect } from 'next/navigation';
import crypto from 'node:crypto';

// Next's COOKIE_NAME_PRERENDER_BYPASS, not a public export.
// /api/disable-draft expires the same name.
const DRAFT_COOKIE = '__prerender_bypass';

// The editor signs every preview request as sha1(space_id:preview_token:
// timestamp) in _storyblok_tk[...]. Recomputing it with our own token proves
// the request came from this space's editor. Valid for one hour.
function isValidEditorRequest(searchParams: URLSearchParams) {
  const spaceId = searchParams.get('_storyblok_tk[space_id]');
  const timestamp = searchParams.get('_storyblok_tk[timestamp]');
  const token = searchParams.get('_storyblok_tk[token]');
  if (!spaceId || !timestamp || !token) return false;

  if (Number(timestamp) < Math.floor(Date.now() / 1000) - 3600) return false;

  const expected = crypto
    .createHash('sha1')
    .update(
      `${spaceId}:${process.env.STORYBLOK_DELIVERY_API_TOKEN}:${timestamp}`
    )
    .digest('hex');

  // Both are sha1 hex, so equal length — but guard anyway, timingSafeEqual
  // throws on a mismatch.
  return (
    token.length === expected.length &&
    crypto.timingSafeEqual(Buffer.from(token), Buffer.from(expected))
  );
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const slug = searchParams.get('slug')?.replace(/^\/+|\/+$/g, '') ?? '';

  // Storyblok signs the editor's iframe requests, but not the links it hands
  // out elsewhere (the publish link, say). Those still get the page — just the
  // published version, with no draft mode.
  if (isValidEditorRequest(searchParams)) {
    (await draftMode()).enable();

    // The editor's iframe is cross-site, where Next's own cookie isn't sent
    // back: it's Lax in dev and never Partitioned. Needs HTTPS.
    // https://github.com/vercel/next.js/issues/49927
    const cookieStore = await cookies();
    const draftCookie = cookieStore.get(DRAFT_COOKIE);
    if (draftCookie) {
      cookieStore.set({
        name: DRAFT_COOKIE,
        value: draftCookie.value,
        httpOnly: true,
        path: '/',
        partitioned: true,
        secure: true,
        sameSite: 'none',
      });
    }
  }

  // The bridge only connects when the _storyblok params reach the page URL.
  searchParams.delete('slug');
  const query = searchParams.toString();

  redirect(`/${slug}${query ? `?${query}` : ''}`);
}

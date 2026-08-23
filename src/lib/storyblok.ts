import { apiPlugin, storyblokInit } from '@storyblok/react/rsc';
import { draftMode } from 'next/headers';
import { notFound } from 'next/navigation';

export const getStoryblokApi = storyblokInit({
  accessToken: process.env.STORYBLOK_DELIVERY_API_TOKEN,
  use: [apiPlugin],
  apiOptions: {
    region: 'eu',
  },
});

export async function fetchStory(slug: string) {
  const { isEnabled: draft } = await draftMode();

  try {
    const storyblokApi = getStoryblokApi();
    const { data } = await storyblokApi.get(`cdn/stories/${slug}`, {
      version: draft ? 'draft' : 'published',
    });

    return data.story;
  } catch (error) {
    // A missing story is a 404. Anything else — bad token, Storyblok down — is
    // a real failure and should surface as a 500, not a missing page.
    if ((error as { status?: number })?.status === 404) notFound();
    throw error;
  }
}

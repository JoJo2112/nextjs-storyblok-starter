import { fetchStory } from '@/lib/storyblok';
import { StoryblokStory } from '@storyblok/react/rsc';

// Nothing is prerendered at build; a path is rendered on first request and then
// cached, revalidating in the background every 3 minutes. Draft mode bypasses
// this cache, so the editor still sees unpublished content.
export const revalidate = 180;

export async function generateStaticParams() {
  return [];
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug?: string[] }>;
}) {
  const { slug } = await params;

  const fullSlug = slug ? slug.join('/') : 'home';
  const story = await fetchStory(fullSlug);

  return <StoryblokStory story={story} />;
}

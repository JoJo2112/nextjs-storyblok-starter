import { getStoryblokApi } from '@/lib/storyblok';
import { loadStoryblokComponents } from '@/util/component-factory';
import { setComponents } from '@storyblok/react/rsc';

export default function StoryblokProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  getStoryblokApi();
  setComponents(loadStoryblokComponents());

  return children;
}

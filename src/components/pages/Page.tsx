import type { Block } from '@schema';
import {
  storyblokEditable,
  StoryblokServerComponent,
} from '@storyblok/react/rsc';

export default function Page({ blok }: { blok: Block<'page'> }) {
  return (
    <main {...storyblokEditable(blok)}>
      {blok.body?.map((nestedBlok) => (
        <StoryblokServerComponent
          blok={nestedBlok}
          key={nestedBlok._uid}
        />
      ))}
    </main>
  );
}

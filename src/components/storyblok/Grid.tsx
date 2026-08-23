import type { Block } from '@schema';
import {
  storyblokEditable,
  StoryblokServerComponent,
} from '@storyblok/react/rsc';

export default function Grid({ blok }: { blok: Block<'grid'> }) {
  return (
    <div
      className="grid"
      {...storyblokEditable(blok)}
    >
      {blok.columns?.map((nestedBlok) => (
        <StoryblokServerComponent
          blok={nestedBlok}
          key={nestedBlok._uid}
        />
      ))}
    </div>
  );
}

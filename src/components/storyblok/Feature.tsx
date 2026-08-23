import FeatureCard from '@/components/ui/FeatureCard';
import type { Block } from '@schema';
import { storyblokEditable } from '@storyblok/react/rsc';

// Maps the block's fields onto a UI component. Schema fields are nullable, so
// this is where defaults get filled in.
export default function Feature({ blok }: { blok: Block<'feature'> }) {
  return (
    <FeatureCard
      {...storyblokEditable(blok)}
      title={blok.name ?? ''}
    />
  );
}

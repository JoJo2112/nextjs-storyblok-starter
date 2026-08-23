import type { SbReactComponentsMap } from '@storyblok/react/rsc';

const componentContexts = [
  require.context('../components/storyblok', false, /\.tsx$/),
  require.context('../components/pages', false, /\.tsx$/),
];

// Registers each component by snake_cased filename (HeroSection.tsx ->
// hero_section), so filenames must match Storyblok's technical names.
export function loadStoryblokComponents(): SbReactComponentsMap {
  const components: SbReactComponentsMap = {};
  for (const context of componentContexts) {
    for (const key of context.keys()) {
      const name = key
        .replace(/^\.\//, '')
        .replace(/\.tsx$/, '')
        .replace(/([a-z0-9])([A-Z])/g, '$1_$2')
        .toLowerCase();
      components[name] = (
        context(key) as { default: React.ElementType }
      ).default;
    }
  }
  return components;
}

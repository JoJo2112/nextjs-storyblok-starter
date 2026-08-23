import {
  defineBlock,
  defineField,
} from '@storyblok/schema';

export const teaserBlock = defineBlock({
  name: 'teaser',
  display_name: '',
  is_root: false,
  is_nestable: true,
  color: '',
  description: '',
  icon: '',
  preview_field: '',
  fields: [
    defineField('headline', {
      type: 'text',
    }),
  ],
});

import {
  defineBlock,
  defineField,
} from '@storyblok/schema';

export const featureBlock = defineBlock({
  name: 'feature',
  display_name: '',
  is_root: false,
  is_nestable: true,
  color: '',
  description: 'Description',
  icon: '',
  preview_field: '',
  fields: [
    defineField('name', {
      type: 'text',
    }),
  ],
});

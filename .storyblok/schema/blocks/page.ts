import {
  defineBlock,
  defineField,
} from '@storyblok/schema';

export const pageBlock = defineBlock({
  name: 'page',
  display_name: '',
  is_root: true,
  is_nestable: false,
  color: '',
  description: '',
  icon: '',
  preview_field: '',
  fields: [
    defineField('body', {
      type: 'bloks',
    }),
  ],
});

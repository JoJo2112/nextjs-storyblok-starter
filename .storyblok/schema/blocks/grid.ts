import {
  defineBlock,
  defineField,
} from '@storyblok/schema';

export const gridBlock = defineBlock({
  name: 'grid',
  display_name: '',
  is_root: false,
  is_nestable: true,
  color: '',
  description: '',
  icon: '',
  preview_field: '',
  fields: [
    defineField('columns', {
      type: 'bloks',
    }),
  ],
});

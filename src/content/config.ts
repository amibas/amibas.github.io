import { defineCollection, z } from 'astro:content';

const postsCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string().min(1),
    description: z.string().min(1),
    pubDate: z.coerce.date(),
    tags: z.array(z.string().min(1)).min(1),
  }),
});

export const collections = {
  posts: postsCollection,
};

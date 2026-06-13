import type { CollectionEntry } from 'astro:content';

export type Post = CollectionEntry<'posts'>;

export async function getAllPosts(): Promise<Post[]> {
  // Dynamic import avoids resolving the Astro virtual module `astro:content`
  // when this file is loaded by Vitest for unit tests of the pure utilities.
  const { getCollection } = await import('astro:content');
  const posts = await getCollection('posts');
  return posts.sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());
}

export function getAllTags(posts: Post[]): string[] {
  return Array.from(new Set(posts.flatMap(post => post.data.tags))).sort();
}

export function getPostsByTag(posts: Post[], tag: string): Post[] {
  return posts.filter(post => post.data.tags.includes(tag));
}

export function getReadingTime(content: string): number {
  const wordsPerMinute = 200;
  const words = content.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / wordsPerMinute));
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date);
}

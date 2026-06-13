import type { CollectionEntry } from 'astro:content';

export type Post = CollectionEntry<'posts'>;

export async function getAllPosts(): Promise<Post[]> {
  const { getCollection } = await import('astro:content');
  const posts = await getCollection('posts');
  return posts.sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());
}

export function getAllTags(posts: Post[]): string[] {
  const tagSet = new Set<string>();
  posts.forEach(post => post.data.tags.forEach(tag => tagSet.add(tag)));
  return Array.from(tagSet).sort();
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

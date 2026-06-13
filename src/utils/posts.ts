import type { CollectionEntry } from 'astro:content';

export type Post = CollectionEntry<'posts'>;

export async function getAllPosts(): Promise<Post[]> {
  // Dynamic import avoids resolving the Astro virtual module `astro:content`
  // when this file is loaded by Vitest for unit tests of the pure utilities.
  const { getCollection } = await import('astro:content');
  const posts = await getCollection('posts');
  const published = import.meta.env.PROD
    ? posts.filter(post => !post.data.draft)
    : posts;
  return published.sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());
}

export function getAllTags(posts: Post[]): string[] {
  return Array.from(new Set(posts.flatMap(post => post.data.tags))).sort();
}

export function getPostsByTag(posts: Post[], tag: string): Post[] {
  return posts.filter(post => post.data.tags.includes(tag));
}

export function getReadingTime(content: string): number {
  // Count CJK characters individually (Chinese/Japanese/Korean do not use spaces).
  const cjkPattern = /[一-鿿぀-ゟ゠-ヿ가-힯]/g;
  const cjkChars = content.match(cjkPattern)?.length || 0;

  // Count Latin words by whitespace after removing CJK characters.
  const latinWords = content
    .replace(cjkPattern, ' ')
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;

  // ~400 CJK chars/min and ~200 Latin words/min.
  const minutes = cjkChars / 400 + latinWords / 200;
  return Math.max(1, Math.ceil(minutes));
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date);
}

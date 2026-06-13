import type { Post } from './posts';

export interface SearchEntry {
  slug: string;
  title: string;
  description: string;
  content: string;
  tags: string[];
}

export function buildSearchIndex(posts: Post[]): SearchEntry[] {
  return posts.map(post => ({
    slug: post.slug,
    title: post.data.title,
    description: post.data.description,
    content: post.body,
    tags: post.data.tags,
  }));
}

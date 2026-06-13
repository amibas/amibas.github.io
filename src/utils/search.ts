import type { Post } from './posts';

export interface SearchEntry {
  id: string;
  title: string;
  description: string;
  content: string;
  tags: string[];
}

export function buildSearchIndex(posts: Post[]): SearchEntry[] {
  return posts.map(post => ({
    id: post.id,
    title: post.data.title,
    description: post.data.description,
    content: post.body,
    tags: post.data.tags,
  }));
}

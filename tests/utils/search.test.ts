import { describe, it, expect } from 'vitest';
import { buildSearchIndex } from '../../src/utils/search';
import type { Post } from '../../src/utils/posts';

function createPost(overrides: Partial<Post> = {}): Post {
  return {
    id: 'test',
    slug: 'test',
    body: 'body content',
    collection: 'posts',
    data: {
      title: 'Test',
      description: 'Test description',
      pubDate: new Date('2026-06-12'),
      tags: ['astro'],
    },
    ...overrides,
  } as Post;
}

describe('buildSearchIndex', () => {
  it('maps posts to search entries', () => {
    const posts = [createPost({ slug: 'hello', body: 'Hello world' })];
    const index = buildSearchIndex(posts);
    expect(index).toEqual([
      {
        slug: 'hello',
        title: 'Test',
        description: 'Test description',
        content: 'Hello world',
        tags: ['astro'],
      },
    ]);
  });
});

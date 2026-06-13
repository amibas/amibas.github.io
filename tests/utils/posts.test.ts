import { describe, it, expect } from 'vitest';
import { getReadingTime, formatDate, getAllTags, getPostsByTag } from '../../src/utils/posts';
import type { Post } from '../../src/utils/posts';

function createPost(overrides: Partial<Post> = {}): Post {
  return {
    id: 'test',
    slug: 'test',
    body: '',
    collection: 'posts',
    data: {
      title: 'Test',
      description: 'Test description',
      pubDate: new Date('2026-06-12'),
      tags: ['astro'],
    },
    ...overrides,
  } satisfies Post as Post;
}

describe('getReadingTime', () => {
  it('returns 1 minute for exactly 200 words', () => {
    const content = 'word '.repeat(200).trim();
    expect(getReadingTime(content)).toBe(1);
  });

  it('rounds up partial minutes', () => {
    const content = 'word '.repeat(201).trim();
    expect(getReadingTime(content)).toBe(2);
  });

  it('returns at least 1 minute for empty content', () => {
    expect(getReadingTime('')).toBe(1);
  });
});

describe('formatDate', () => {
  it('formats date in Chinese', () => {
    const date = new Date('2026-06-12');
    expect(formatDate(date)).toBe('2026年6月12日');
  });
});

describe('getAllTags', () => {
  it('returns sorted unique tags', () => {
    const posts = [
      createPost({ data: { title: 'A', description: 'D', pubDate: new Date(), tags: ['z', 'a'] } }),
      createPost({ data: { title: 'B', description: 'D', pubDate: new Date(), tags: ['a', 'b'] } }),
    ];
    expect(getAllTags(posts)).toEqual(['a', 'b', 'z']);
  });
});

describe('getPostsByTag', () => {
  it('filters posts by tag', () => {
    const posts = [
      createPost({ slug: 'a', data: { title: 'A', description: 'D', pubDate: new Date(), tags: ['astro'] } }),
      createPost({ slug: 'b', data: { title: 'B', description: 'D', pubDate: new Date(), tags: ['react'] } }),
    ];
    expect(getPostsByTag(posts, 'astro')).toHaveLength(1);
    expect(getPostsByTag(posts, 'astro')[0].slug).toBe('a');
  });

  it('returns empty array when no posts match tag', () => {
    const posts = [
      createPost({ slug: 'a', data: { title: 'A', description: 'D', pubDate: new Date(), tags: ['astro'] } }),
    ];
    expect(getPostsByTag(posts, 'react')).toHaveLength(0);
  });
});

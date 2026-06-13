import type { APIRoute } from 'astro';
import { getAllPosts } from '../utils/posts';
import { buildSearchIndex } from '../utils/search';

export const GET: APIRoute = async () => {
  const posts = await getAllPosts();
  const index = buildSearchIndex(posts);

  return new Response(JSON.stringify(index), {
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400',
    },
  });
};

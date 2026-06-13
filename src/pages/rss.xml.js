import rss from '@astrojs/rss';
import { getAllPosts } from '../utils/posts';

export async function GET(context) {
  const posts = await getAllPosts();

  return rss({
    title: '我的博客',
    description: '技术笔记与教程',
    site: context.site,
    items: posts.map(post => ({
      title: post.data.title,
      pubDate: post.data.pubDate,
      description: post.data.description,
      link: `/blog/${post.id}/`,
      categories: post.data.tags,
    })),
  });
}

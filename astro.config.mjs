import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import mdx from '@astrojs/mdx';

// NOTE: 如果 GitHub Pages 是 project site（仓库名不是 <username>.github.io），
// 需要把 base 改为 '/repo-name/'，例如 base: '/blog/'。
export default defineConfig({
  site: 'https://your-username.github.io',
  base: '/',
  integrations: [tailwind(), mdx()],
  output: 'static',
});

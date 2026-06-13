import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import mdx from '@astrojs/mdx';

// NOTE: Replace 'your-username' with your actual GitHub username before deploying.
// For a user site (repo name: your-username.github.io), base should be '/'.
export default defineConfig({
  site: 'https://your-username.github.io',
  base: '/',
  integrations: [tailwind(), mdx()],
  output: 'static',
});

import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

// NOTE: Replace 'your-username' with your actual GitHub username before deploying.
// For a user site (repo name: your-username.github.io), base should be '/'.
export default defineConfig({
  site: 'https://amibas.github.io',
  base: '/',
  integrations: [tailwind(), mdx(), sitemap()],
  output: 'static',
  server: {
    // Bind to all loopback addresses so the dev server is reachable via both
    // 127.0.0.1 (IPv4) and [::1] (IPv6). This fixes WSL2 localhost forwarding
    // from a Windows browser, which connects to 127.0.0.1 internally.
    host: true,
  },
});

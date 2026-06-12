# 个人博客 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 用 Astro + Tailwind + MDX + Shiki + Fuse.js 构建并部署一个深色开发者风的个人技术博客到 GitHub Pages。

**Architecture:** 纯静态站点，内容由 Astro Content Collections 管理 Markdown/MDX 文章；构建时生成页面、RSS 和搜索索引；客户端通过 Fuse.js 读取索引完成搜索；GitHub Actions 推送后自动构建部署。

**Tech Stack:** Astro 4.x, Tailwind CSS 3.x, @astrojs/mdx, @astrojs/rss, @tailwindcss/typography, Fuse.js, Vitest, GitHub Pages

---

## File Structure

```
.
├── .github/
│   └── workflows/
│       └── deploy.yml              # GitHub Pages 部署
├── public/
│   └── favicon.svg                 # 站点图标
├── src/
│   ├── components/
│   │   ├── PostCard.astro          # 文章卡片
│   │   ├── TagList.astro           # 标签列表
│   │   ├── ThemeToggle.astro       # 深色模式切换按钮
│   │   └── SearchBox.astro         # Fuse.js 搜索框
│   ├── content/
│   │   ├── posts/                  # Markdown/MDX 文章
│   │   │   ├── hello-world.md
│   │   │   └── astro-guide.md
│   │   └── config.ts               # 文章 schema
│   ├── layouts/
│   │   ├── BaseLayout.astro        # 全局布局
│   │   └── PostLayout.astro        # 文章页布局
│   ├── pages/
│   │   ├── index.astro             # 首页
│   │   ├── 404.astro               # 404 页面
│   │   ├── about.astro             # 关于页
│   │   ├── search.astro            # 搜索页
│   │   ├── rss.xml.js              # RSS feed
│   │   ├── blog/
│   │   │   ├── index.astro         # 文章列表
│   │   │   └── [slug].astro        # 文章详情
│   │   └── tags/
│   │       ├── index.astro         # 全部标签
│   │       └── [tag].astro         # 单个标签页
│   ├── styles/
│   │   └── global.css              # 全局样式 + Tailwind 指令
│   └── utils/
│       ├── posts.ts                # 文章查询、阅读时间、日期格式化
│       └── search.ts               # 搜索索引构建
├── tests/
│   └── utils/
│       ├── posts.test.ts           # 文章工具函数测试
│       └── search.test.ts          # 搜索索引测试
├── astro.config.mjs
├── tailwind.config.mjs
├── vitest.config.ts
├── package.json
└── tsconfig.json
```

---

## Task 1: Initialize Project

**Files:**
- Create: `package.json`
- Create: `astro.config.mjs`
- Create: `tsconfig.json`
- Create: `.gitignore`
- Modify: N/A

- [ ] **Step 1: Initialize Git repository**

```bash
cd /home/amoeba/code/blog
git init
git branch -M main
```

Expected: Git repo initialized at `/home/amoeba/code/blog`.

- [ ] **Step 2: Create package.json**

```json
{
  "name": "personal-blog",
  "type": "module",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "astro dev",
    "start": "astro dev",
    "build": "astro build",
    "preview": "astro preview",
    "astro": "astro",
    "test": "vitest run",
    "test:watch": "vitest"
  },
  "dependencies": {
    "@astrojs/mdx": "^2.0.0",
    "@astrojs/rss": "^4.0.0",
    "@astrojs/tailwind": "^5.0.0",
    "@tailwindcss/typography": "^0.5.10",
    "astro": "^4.0.0",
    "fuse.js": "^7.0.0",
    "tailwindcss": "^3.4.0"
  },
  "devDependencies": {
    "@types/node": "^20.0.0",
    "vitest": "^1.0.0"
  }
}
```

- [ ] **Step 3: Install dependencies**

```bash
npm install
```

Expected: `node_modules/` created, no errors.

- [ ] **Step 4: Create astro.config.mjs**

```js
import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import mdx from '@astrojs/mdx';

// NOTE: 如果 GitHub Pages 是 project site（仓库名不是 <username>.github.io），
// 需要把 base 改为 '/repo-name/'，例如 base: '/blog/'。
export default defineConfig({
  site: 'https://<username>.github.io',
  base: '/',
  integrations: [tailwind(), mdx()],
  output: 'static',
});
```

Replace `<username>` with the actual GitHub username.

- [ ] **Step 5: Create tsconfig.json**

```json
{
  "extends": "astro/tsconfigs/strict"
}
```

- [ ] **Step 6: Create .gitignore**

```gitignore
# build output
dist/

# generated types
.astro/

# dependencies
node_modules/

# logs
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*

# environment variables
.env
.env.production

# macOS-specific files
.DS_Store
```

- [ ] **Step 7: Commit initialization**

```bash
git add package.json package-lock.json astro.config.mjs tsconfig.json .gitignore
git commit -m "chore: initialize astro project with tailwind and mdx"
```

---

## Task 2: Configure Tailwind and Global Styles

**Files:**
- Create: `tailwind.config.mjs`
- Create: `src/styles/global.css`
- Create: `public/favicon.svg`
- Modify: N/A

- [ ] **Step 1: Create tailwind.config.mjs**

```js
import typography from '@tailwindcss/typography';

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        'bg-primary': '#0B0C0F',
        'bg-secondary': '#14161B',
        'text-primary': '#E6E6E6',
        'text-secondary': '#8B919C',
        accent: '#FFB86C',
        'accent-secondary': '#7EE787',
        border: '#272A33',
      },
      fontFamily: {
        display: ['Space Grotesk', 'sans-serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      typography: ({ theme }) => ({
        DEFAULT: {
          css: {
            color: theme('colors.text-primary'),
            '--tw-prose-headings': theme('colors.text-primary'),
            '--tw-prose-links': theme('colors.accent'),
            '--tw-prose-bold': theme('colors.text-primary'),
            '--tw-prose-counters': theme('colors.text-secondary'),
            '--tw-prose-bullets': theme('colors.text-secondary'),
            '--tw-prose-hr': theme('colors.border'),
            '--tw-prose-quotes': theme('colors.text-secondary'),
            '--tw-prose-code': theme('colors.accent-secondary'),
            '--tw-prose-pre-code': theme('colors.text-primary'),
            '--tw-prose-pre-bg': theme('colors.bg-secondary'),
            '--tw-prose-th-borders': theme('colors.border'),
            '--tw-prose-td-borders': theme('colors.border'),
          },
        },
      }),
    },
  },
  plugins: [typography],
};
```

- [ ] **Step 2: Create src/styles/global.css**

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  html {
    scroll-behavior: smooth;
  }

  body {
    @apply bg-bg-primary text-text-primary font-sans antialiased;
  }

  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    @apply font-display;
  }

  a {
    @apply text-accent transition-colors;
  }

  a:hover {
    @apply underline;
  }

  code {
    @apply font-mono text-sm;
  }

  pre {
    @apply rounded-lg border border-border;
  }

  ::selection {
    @apply bg-accent/30 text-text-primary;
  }
}

@layer utilities {
  .text-balance {
    text-wrap: balance;
  }
}
```

- [ ] **Step 3: Create public/favicon.svg**

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <rect width="100" height="100" rx="20" fill="#0B0C0F"/>
  <text x="50" y="68" font-family="monospace" font-size="55" fill="#FFB86C" text-anchor="middle">&gt;_</text>
</svg>
```

- [ ] **Step 4: Commit Tailwind configuration**

```bash
git add tailwind.config.mjs src/styles/global.css public/favicon.svg
git commit -m "chore: configure tailwind, colors, typography and favicon"
```

---

## Task 3: Set Up Content Collection and Utility Functions

**Files:**
- Create: `src/content/config.ts`
- Create: `src/content/posts/hello-world.md`
- Create: `src/content/posts/astro-guide.md`
- Create: `src/utils/posts.ts`
- Create: `tests/utils/posts.test.ts`
- Create: `vitest.config.ts`
- Modify: N/A

- [ ] **Step 1: Create src/content/config.ts**

```ts
import { defineCollection, z } from 'astro:content';

const postsCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string().min(1),
    description: z.string().min(1),
    pubDate: z.coerce.date(),
    tags: z.array(z.string().min(1)).min(1),
  }),
});

export const collections = {
  posts: postsCollection,
};
```

- [ ] **Step 2: Create sample posts**

`src/content/posts/hello-world.md`:

```markdown
---
title: "Hello World"
description: "这是我的第一篇博客文章，用来测试站点是否正常工作。"
pubDate: 2026-06-12
tags: ["astro", "blog"]
---

欢迎来到我的博客！这里会记录我在技术学习和工作中的笔记与教程。

## 为什么写博客

写作是整理思路最好的方式。通过把学到的东西写出来，可以发现自己理解中的盲点。

```javascript
console.log('Hello, world!');
```

希望这里的内容对你也有帮助。
```

`src/content/posts/astro-guide.md`:

```markdown
---
title: "Astro 入门指南"
description: "介绍如何使用 Astro 构建静态站点，包括内容集合和页面路由。"
pubDate: 2026-06-13
tags: ["astro", "tutorial"]
---

Astro 是一个现代化的静态站点生成器，特别适合内容型网站。

## 内容集合

Content Collections 让你可以用类型安全的方式管理 Markdown 内容。

```astro
---
import { getCollection } from 'astro:content';

const posts = await getCollection('posts');
---
```

更多内容敬请期待。
```

- [ ] **Step 3: Create vitest.config.ts**

```ts
import { defineConfig } from 'vitest/config';

export default defineConfig({
  resolve: {
    alias: {
      '@': new URL('./src', import.meta.url).pathname,
    },
  },
});
```

- [ ] **Step 4: Write failing tests**

`tests/utils/posts.test.ts`:

```ts
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
  } as Post;
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
});
```

- [ ] **Step 5: Run tests to verify they fail**

```bash
npm test
```

Expected: Tests fail with module not found error for `../../src/utils/posts` because the file does not exist yet.

- [ ] **Step 6: Implement src/utils/posts.ts**

```ts
import { getCollection, type CollectionEntry } from 'astro:content';

export type Post = CollectionEntry<'posts'>;

export async function getAllPosts(): Promise<Post[]> {
  const posts = await getCollection('posts');
  return posts.sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());
}

export function getAllTags(posts: Post[]): string[] {
  const tagSet = new Set<string>();
  posts.forEach(post => post.data.tags.forEach(tag => tagSet.add(tag)));
  return Array.from(tagSet).sort();
}

export function getPostsByTag(posts: Post[], tag: string): Post[] {
  return posts.filter(post => post.data.tags.includes(tag));
}

export function getReadingTime(content: string): number {
  const wordsPerMinute = 200;
  const words = content.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / wordsPerMinute));
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date);
}
```

- [ ] **Step 7: Run tests to verify they pass**

```bash
npm test
```

Expected: 7 tests pass.

- [ ] **Step 8: Commit**

```bash
git add src/content src/utils tests vitest.config.ts
git commit -m "feat: add content collection, post utilities and tests"
```

---

## Task 4: Build Layouts and Theme Toggle

**Files:**
- Create: `src/layouts/BaseLayout.astro`
- Create: `src/layouts/PostLayout.astro`
- Create: `src/components/ThemeToggle.astro`
- Modify: N/A

- [ ] **Step 1: Create src/layouts/BaseLayout.astro**

```astro
---
import '../styles/global.css';
import ThemeToggle from '../components/ThemeToggle.astro';

interface Props {
  title: string;
  description?: string;
}

const { title, description = '技术笔记与教程' } = Astro.props;
const canonicalURL = new URL(Astro.url.pathname, Astro.site);
---

<!DOCTYPE html>
<html lang="zh-CN">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="icon" type="image/svg+xml" href={`${import.meta.env.BASE_URL}favicon.svg`} />
    <meta name="generator" content={Astro.generator} />
    <title>{title}</title>
    <meta name="description" content={description} />
    <link rel="canonical" href={canonicalURL} />
    <link rel="alternate" type="application/rss+xml" title="RSS Feed" href={`${import.meta.env.BASE_URL}rss.xml`} />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
      href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&family=Space+Grotesk:wght@500;700&display=swap"
      rel="stylesheet"
    />
    <script is:inline>
      (function () {
        const theme = (() => {
          if (typeof localStorage !== 'undefined' && localStorage.getItem('theme')) {
            return localStorage.getItem('theme');
          }
          if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
            return 'dark';
          }
          return 'light';
        })();
        if (theme === 'dark') {
          document.documentElement.classList.add('dark');
        }
      })();
    </script>
  </head>
  <body class="min-h-screen flex flex-col">
    <header class="border-b border-border sticky top-0 bg-bg-primary/95 backdrop-blur z-50">
      <nav class="max-w-3xl mx-auto px-6 py-4 flex items-center justify-between">
        <a href={`${import.meta.env.BASE_URL}`} class="font-display text-xl font-bold text-text-primary hover:text-accent transition-colors">
          我的博客
        </a>
        <div class="flex items-center gap-4 md:gap-6">
          <a href={`${import.meta.env.BASE_URL}blog`} class="text-sm md:text-base text-text-secondary hover:text-accent transition-colors">
            文章
          </a>
          <a href={`${import.meta.env.BASE_URL}tags`} class="text-sm md:text-base text-text-secondary hover:text-accent transition-colors">
            标签
          </a>
          <a href={`${import.meta.env.BASE_URL}search`} class="text-sm md:text-base text-text-secondary hover:text-accent transition-colors">
            搜索
          </a>
          <a href={`${import.meta.env.BASE_URL}about`} class="text-sm md:text-base text-text-secondary hover:text-accent transition-colors">
            关于
          </a>
          <ThemeToggle />
        </div>
      </nav>
    </header>

    <main class="flex-1 w-full">
      <slot />
    </main>

    <footer class="border-t border-border py-8 mt-12">
      <div class="max-w-3xl mx-auto px-6 text-center text-text-secondary text-sm">
        <p>&copy; {new Date().getFullYear()} 我的博客. All rights reserved.</p>
      </div>
    </footer>
  </body>
</html>
```

- [ ] **Step 2: Create src/components/ThemeToggle.astro**

```astro
<button
  id="theme-toggle"
  type="button"
  aria-label="切换主题"
  class="p-2 rounded-lg text-text-secondary hover:text-accent hover:bg-bg-secondary transition-colors"
>
  <span id="icon-light" class="hidden dark:block" aria-hidden="true">
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
  </span>
  <span id="icon-dark" class="block dark:hidden" aria-hidden="true">
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>
  </span>
</button>

<script>
  const toggle = document.getElementById('theme-toggle');
  const root = document.documentElement;

  toggle?.addEventListener('click', () => {
    const isDark = root.classList.toggle('dark');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  });
</script>
```

- [ ] **Step 3: Create src/layouts/PostLayout.astro**

```astro
---
import BaseLayout from './BaseLayout.astro';
import { formatDate, getReadingTime } from '../utils/posts';
import type { Post } from '../utils/posts';

interface Props {
  post: Post;
}

const { post } = Astro.props;
const { title, description, pubDate, tags } = post.data;
const readingTime = getReadingTime(post.body);
---

<BaseLayout title={title} description={description}>
  <article class="max-w-3xl mx-auto px-6 py-12">
    <header class="mb-10">
      <h1 class="text-3xl md:text-4xl font-bold font-display text-text-primary mb-4 text-balance">
        {title}
      </h1>
      <p class="text-text-secondary mb-4">{description}</p>
      <div class="flex flex-wrap items-center gap-3 text-sm text-text-secondary">
        <time datetime={pubDate.toISOString()}>{formatDate(pubDate)}</time>
        <span>&middot;</span>
        <span>{readingTime} 分钟阅读</span>
        <span>&middot;</span>
        <div class="flex flex-wrap gap-2">
          {tags.map(tag => (
            <a
              href={`${import.meta.env.BASE_URL}tags/${tag}/`}
              class="px-2 py-0.5 rounded bg-bg-secondary text-text-secondary hover:text-accent hover:border-accent border border-border transition-colors"
            >
              #{tag}
            </a>
          ))}
        </div>
      </div>
    </header>

    <div class="prose prose-invert prose-zinc max-w-none">
      <slot />
    </div>
  </article>
</BaseLayout>
```

- [ ] **Step 4: Verify build still passes**

```bash
npm run build
```

Expected: Build succeeds, though pages are not yet created.

- [ ] **Step 5: Commit**

```bash
git add src/layouts src/components
git commit -m "feat: add base layout, post layout and theme toggle"
```

---

## Task 5: Build Home Page

**Files:**
- Create: `src/pages/index.astro`
- Create: `src/components/PostCard.astro`
- Create: `src/components/TagList.astro`
- Modify: N/A

- [ ] **Step 1: Create src/components/PostCard.astro**

```astro
---
import { formatDate } from '../utils/posts';
import type { Post } from '../utils/posts';

interface Props {
  post: Post;
}

const { post } = Astro.props;
const { title, description, pubDate, tags } = post.data;
---

<article class="group border-b border-border py-6 last:border-0">
  <a href={`${import.meta.env.BASE_URL}blog/${post.slug}/`} class="block no-underline">
    <h2 class="text-xl md:text-2xl font-display font-bold text-text-primary group-hover:text-accent transition-colors mb-2">
      {title}
    </h2>
    <p class="text-text-secondary mb-3 line-clamp-2">{description}</p>
    <div class="flex flex-wrap items-center gap-3 text-sm text-text-secondary">
      <time datetime={pubDate.toISOString()}>{formatDate(pubDate)}</time>
      <span>&middot;</span>
      <div class="flex flex-wrap gap-2">
        {tags.map(tag => (
          <span class="px-2 py-0.5 rounded bg-bg-secondary border border-border">#{tag}</span>
        ))}
      </div>
    </div>
  </a>
</article>
```

- [ ] **Step 2: Create src/components/TagList.astro**

```astro
---
interface Props {
  tags: string[];
}

const { tags } = Astro.props;
---

<div class="flex flex-wrap gap-2">
  {tags.map(tag => (
    <a
      href={`${import.meta.env.BASE_URL}tags/${tag}/`}
      class="px-3 py-1 rounded-full bg-bg-secondary border border-border text-sm text-text-secondary hover:text-accent hover:border-accent transition-colors"
    >
      #{tag}
    </a>
  ))}
</div>
```

- [ ] **Step 3: Create src/pages/index.astro**

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
import PostCard from '../components/PostCard.astro';
import TagList from '../components/TagList.astro';
import { getAllPosts, getAllTags } from '../utils/posts';

const posts = await getAllPosts();
const recentPosts = posts.slice(0, 5);
const tags = getAllTags(posts);
---

<BaseLayout title="我的博客 - 技术笔记与教程" description="一个记录技术笔记与教程的个人博客">
  <section class="max-w-3xl mx-auto px-6 pt-16 pb-12">
    <div class="mb-12">
      <h1 class="text-4xl md:text-6xl font-display font-bold text-text-primary mb-4">
        技术笔记与教程<span class="text-accent animate-pulse">▌</span>
      </h1>
      <p class="text-lg text-text-secondary max-w-2xl">
        记录学习、实践和思考。主要关注前端工程、开发工具和技术写作。
      </p>
    </div>

    <div class="mb-12">
      <div class="flex items-center justify-between mb-6">
        <h2 class="text-2xl font-display font-bold text-text-primary">最近文章</h2>
        <a href={`${import.meta.env.BASE_URL}blog`} class="text-sm">查看全部 &rarr;</a>
      </div>
      {recentPosts.length > 0 ? (
        <div>
          {recentPosts.map(post => <PostCard post={post} />)}
        </div>
      ) : (
        <p class="text-text-secondary">还没有文章，快去写一篇吧。</p>
      )}
    </div>

    <div>
      <h2 class="text-2xl font-display font-bold text-text-primary mb-4">标签</h2>
      {tags.length > 0 ? <TagList tags={tags} /> : <p class="text-text-secondary">暂无标签</p>}
    </div>
  </section>
</BaseLayout>
```

- [ ] **Step 4: Run dev server and verify homepage**

```bash
npm run dev
```

Open `http://localhost:4321`. Expected: homepage renders with title, recent posts, tags.

- [ ] **Step 5: Commit**

```bash
git add src/pages/index.astro src/components/PostCard.astro src/components/TagList.astro
git commit -m "feat: add homepage with recent posts and tag cloud"
```

---

## Task 6: Build Blog Index and Tag Pages

**Files:**
- Create: `src/pages/blog/index.astro`
- Create: `src/pages/tags/[tag].astro`
- Modify: N/A

- [ ] **Step 1: Create src/pages/blog/index.astro**

```astro
---
import BaseLayout from '../../layouts/BaseLayout.astro';
import PostCard from '../../components/PostCard.astro';
import TagList from '../../components/TagList.astro';
import { getAllPosts, getAllTags } from '../../utils/posts';

const posts = await getAllPosts();
const tags = getAllTags(posts);
---

<BaseLayout title="全部文章 - 我的博客" description="博客全部文章列表">
  <section class="max-w-3xl mx-auto px-6 py-12">
    <h1 class="text-3xl md:text-4xl font-display font-bold text-text-primary mb-8">全部文章</h1>

    <div class="mb-10">
      <h2 class="text-sm uppercase tracking-wider text-text-secondary mb-3">按标签筛选</h2>
      <TagList tags={tags} />
    </div>

    {posts.length > 0 ? (
      <div>
        {posts.map(post => <PostCard post={post} />)}
      </div>
    ) : (
      <p class="text-text-secondary">还没有文章。</p>
    )}
  </section>
</BaseLayout>
```

- [ ] **Step 2: Create src/pages/tags/[tag].astro**

```astro
---
import BaseLayout from '../../layouts/BaseLayout.astro';
import PostCard from '../../components/PostCard.astro';
import { getAllPosts, getAllTags } from '../../utils/posts';

export async function getStaticPaths() {
  const posts = await getAllPosts();
  const tags = getAllTags(posts);
  return tags.map(tag => ({ params: { tag } }));
}

const { tag } = Astro.params;
const posts = await getAllPosts();
const taggedPosts = posts.filter(post => post.data.tags.includes(tag));
---

<BaseLayout title={`标签 #${tag} - 我的博客`} description={`标签 #${tag} 下的文章`}>
  <section class="max-w-3xl mx-auto px-6 py-12">
    <div class="mb-8">
      <a href={`${import.meta.env.BASE_URL}blog`} class="text-sm text-text-secondary hover:text-accent">&larr; 返回全部文章</a>
      <h1 class="text-3xl md:text-4xl font-display font-bold text-text-primary mt-4">
        #{tag}
      </h1>
      <p class="text-text-secondary mt-2">共 {taggedPosts.length} 篇文章</p>
    </div>

    {taggedPosts.length > 0 ? (
      <div>
        {taggedPosts.map(post => <PostCard post={post} />)}
      </div>
    ) : (
      <p class="text-text-secondary">该标签下没有文章。</p>
    )}
  </section>
</BaseLayout>
```

- [ ] **Step 3: Add tags index page (optional but useful)**

Create `src/pages/tags/index.astro`:

```astro
---
import BaseLayout from '../../layouts/BaseLayout.astro';
import TagList from '../../components/TagList.astro';
import { getAllPosts, getAllTags } from '../../utils/posts';

const posts = await getAllPosts();
const tags = getAllTags(posts);
---

<BaseLayout title="全部标签 - 我的博客" description="博客全部标签">
  <section class="max-w-3xl mx-auto px-6 py-12">
    <h1 class="text-3xl md:text-4xl font-display font-bold text-text-primary mb-8">全部标签</h1>
    <TagList tags={tags} />
  </section>
</BaseLayout>
```

- [ ] **Step 4: Run build and verify**

```bash
npm run build
```

Expected: Build succeeds. `dist/blog/index.html` and `dist/tags/astro/index.html` exist.

- [ ] **Step 5: Commit**

```bash
git add src/pages/blog src/pages/tags
git commit -m "feat: add blog index and tag pages"
```

---

## Task 7: Build Blog Post Detail Page

**Files:**
- Create: `src/pages/blog/[slug].astro`
- Modify: N/A

- [ ] **Step 1: Create src/pages/blog/[slug].astro**

```astro
---
import { getCollection } from 'astro:content';
import PostLayout from '../../layouts/PostLayout.astro';
import { getAllPosts } from '../../utils/posts';

export async function getStaticPaths() {
  const posts = await getCollection('posts');
  return posts.map(post => ({
    params: { slug: post.slug },
    props: { post },
  }));
}

const { post } = Astro.props;
const { Content } = await post.render();

const posts = await getAllPosts();
const currentIndex = posts.findIndex(p => p.slug === post.slug);
const prevPost = currentIndex < posts.length - 1 ? posts[currentIndex + 1] : null;
const nextPost = currentIndex > 0 ? posts[currentIndex - 1] : null;
---

<PostLayout post={post}>
  <Content />

  <nav class="mt-12 pt-8 border-t border-border grid grid-cols-1 md:grid-cols-2 gap-6">
    <div>
      {prevPost && (
        <a href={`${import.meta.env.BASE_URL}blog/${prevPost.slug}/`} class="block group no-underline">
          <span class="text-sm text-text-secondary block mb-1">&larr; 上一篇</span>
          <span class="font-display font-bold text-text-primary group-hover:text-accent transition-colors">
            {prevPost.data.title}
          </span>
        </a>
      )}
    </div>
    <div class="md:text-right">
      {nextPost && (
        <a href={`${import.meta.env.BASE_URL}blog/${nextPost.slug}/`} class="block group no-underline">
          <span class="text-sm text-text-secondary block mb-1">下一篇 &rarr;</span>
          <span class="font-display font-bold text-text-primary group-hover:text-accent transition-colors">
            {nextPost.data.title}
          </span>
        </a>
      )}
    </div>
  </nav>
</PostLayout>
```

- [ ] **Step 2: Run dev server and verify post page**

```bash
npm run dev
```

Open `http://localhost:4321/blog/hello-world/`. Expected: post renders with title, date, tags, code block, prev/next navigation.

- [ ] **Step 3: Commit**

```bash
git add src/pages/blog/[slug].astro
git commit -m "feat: add blog post detail page with navigation"
```

---

## Task 8: Build Search Page with Fuse.js

**Files:**
- Create: `src/utils/search.ts`
- Create: `src/pages/search.json.ts`
- Create: `src/components/SearchBox.astro`
- Create: `src/pages/search.astro`
- Create: `tests/utils/search.test.ts`
- Modify: N/A

- [ ] **Step 1: Create tests/utils/search.test.ts**

```ts
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
```

- [ ] **Step 2: Run tests to verify they fail**

```bash
npm test
```

Expected: Tests fail with module not found error for `../../src/utils/search`.

- [ ] **Step 3: Implement src/utils/search.ts**

```ts
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
```

- [ ] **Step 4: Run tests to verify they pass**

```bash
npm test
```

Expected: 8 tests pass.

- [ ] **Step 6: Create src/pages/search.json.ts**

```ts
import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { buildSearchIndex } from '../utils/search';

export const GET: APIRoute = async () => {
  const posts = await getCollection('posts');
  const index = buildSearchIndex(posts);

  return new Response(JSON.stringify(index), {
    headers: { 'Content-Type': 'application/json' },
  });
};
```

- [ ] **Step 7: Create src/components/SearchBox.astro**

```astro
<div class="search-container">
  <input
    id="search-input"
    type="text"
    placeholder="输入关键词搜索文章..."
    autocomplete="off"
    class="w-full px-4 py-3 rounded-lg bg-bg-secondary border border-border text-text-primary placeholder:text-text-secondary focus:outline-none focus:border-accent transition-colors"
  />
  <ul id="search-results" class="mt-4 space-y-4"></ul>
  <p id="search-status" class="mt-4 text-text-secondary text-sm hidden"></p>
</div>

<script>
  import Fuse from 'fuse.js';
  import type { SearchEntry } from '../utils/search';

  const input = document.getElementById('search-input') as HTMLInputElement;
  const resultsEl = document.getElementById('search-results') as HTMLUListElement;
  const statusEl = document.getElementById('search-status') as HTMLParagraphElement;

  async function initSearch() {
    try {
      const baseUrl = import.meta.env.BASE_URL ?? '/';
      const res = await fetch(`${baseUrl}search.json`);
      if (!res.ok) throw new Error('Failed to load search index');
      const posts: SearchEntry[] = await res.json();

      const fuse = new Fuse(posts, {
        keys: ['title', 'description', 'content'],
        threshold: 0.3,
        includeScore: true,
      });

      input.addEventListener('input', () => {
        const query = input.value.trim();
        statusEl.classList.add('hidden');

        if (!query) {
          resultsEl.innerHTML = '';
          return;
        }

        const results = fuse.search(query);
        if (results.length === 0) {
          resultsEl.innerHTML = '';
          statusEl.textContent = `没有找到与 "${query}" 相关的文章。`;
          statusEl.classList.remove('hidden');
          return;
        }

        resultsEl.innerHTML = results
          .map(
            result => `
            <li class="border-b border-border pb-4 last:border-0">
              <a href="${baseUrl}blog/${result.item.slug}/" class="text-lg font-display font-bold text-text-primary hover:text-accent transition-colors">
                ${result.item.title}
              </a>
              <p class="text-text-secondary mt-1 line-clamp-2">${result.item.description}</p>
              <div class="flex flex-wrap gap-2 mt-2">
                ${result.item.tags.map(tag => `<span class="text-xs text-text-secondary">#${tag}</span>`).join('')}
              </div>
            </li>
          `
          )
          .join('');
      });
    } catch (error) {
      statusEl.textContent = '搜索暂不可用，请直接浏览文章列表。';
      statusEl.classList.remove('hidden');
      input.disabled = true;
    }
  }

  initSearch();
</script>
```

- [ ] **Step 8: Create src/pages/search.astro**

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
import SearchBox from '../components/SearchBox.astro';
---

<BaseLayout title="搜索 - 我的博客" description="搜索博客文章">
  <section class="max-w-3xl mx-auto px-6 py-12">
    <h1 class="text-3xl md:text-4xl font-display font-bold text-text-primary mb-6">搜索文章</h1>
    <SearchBox />
  </section>
</BaseLayout>
```

- [ ] **Step 9: Run build and verify search**

```bash
npm run build
```

Expected: `dist/search.json` and `dist/search/index.html` exist. Open `dist/search/index.html` in a local server (e.g., `npx serve dist`) and verify search works.

- [ ] **Step 10: Commit**

```bash
git add src/utils/search.ts src/pages/search.json.ts src/components/SearchBox.astro src/pages/search.astro tests/utils/search.test.ts
git commit -m "feat: add fuse.js full-text search"
```

---

## Task 9: Build About and 404 Pages

**Files:**
- Create: `src/pages/about.astro`
- Create: `src/pages/404.astro`
- Modify: N/A

- [ ] **Step 1: Create src/pages/about.astro**

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
---

<BaseLayout title="关于 - 我的博客" description="关于博客和作者">
  <section class="max-w-3xl mx-auto px-6 py-12">
    <h1 class="text-3xl md:text-4xl font-display font-bold text-text-primary mb-6">关于</h1>
    <div class="prose prose-invert prose-zinc max-w-none">
      <p>
        这是一个由 Astro 构建的个人博客，主要用于记录技术笔记、教程和开发过程中的思考。
      </p>
      <p>
        如果你对这里的内容感兴趣，可以通过以下方式找到我：
      </p>
      <ul>
        <li>GitHub: <a href="https://github.com/<username>" target="_blank" rel="noopener noreferrer">@username</a></li>
        <li>Email: <a href="mailto:your@email.com">your@email.com</a></li>
      </ul>
      <p>
        欢迎交流！
      </p>
    </div>
  </section>
</BaseLayout>
```

Replace `<username>` and email with actual values.

- [ ] **Step 2: Create src/pages/404.astro**

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
---

<BaseLayout title="404 - 页面未找到" description="页面不存在">
  <section class="max-w-3xl mx-auto px-6 py-24 text-center">
    <h1 class="text-6xl md:text-8xl font-display font-bold text-text-primary mb-4">404</h1>
    <p class="text-xl text-text-secondary mb-8">这个页面不存在，可能已经被移动或删除。</p>
    <a
      href={`${import.meta.env.BASE_URL}`}
      class="inline-block px-6 py-3 rounded-lg bg-accent text-bg-primary font-medium hover:bg-accent/90 transition-colors"
    >
      返回首页
    </a>
  </section>
</BaseLayout>
```

- [ ] **Step 3: Run build and verify**

```bash
npm run build
```

Expected: `dist/about/index.html` and `dist/404.html` exist.

- [ ] **Step 4: Commit**

```bash
git add src/pages/about.astro src/pages/404.astro
git commit -m "feat: add about and 404 pages"
```

---

## Task 10: Add RSS Feed

**Files:**
- Create: `src/pages/rss.xml.js`
- Modify: N/A

- [ ] **Step 1: Create src/pages/rss.xml.js**

```js
import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';

export async function GET(context) {
  const posts = await getCollection('posts');
  const sortedPosts = posts.sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());

  return rss({
    title: '我的博客',
    description: '技术笔记与教程',
    site: context.site,
    items: sortedPosts.map(post => ({
      title: post.data.title,
      pubDate: post.data.pubDate,
      description: post.data.description,
      link: `/blog/${post.slug}/`,
    })),
  });
}
```

- [ ] **Step 2: Run build and verify RSS**

```bash
npm run build
```

Expected: `dist/rss.xml` exists and contains valid RSS with sample posts.

- [ ] **Step 3: Commit**

```bash
git add src/pages/rss.xml.js
git commit -m "feat: add rss feed"
```

---

## Task 11: Configure GitHub Pages Deployment

**Files:**
- Create: `.github/workflows/deploy.yml`
- Modify: `astro.config.mjs`

- [ ] **Step 1: Update astro.config.mjs with correct site and base**

If the GitHub repository is named `<username>.github.io`, set:

```js
site: 'https://<username>.github.io',
base: '/',
```

If the repository is a project site (e.g., `https://github.com/<username>/blog`), set:

```js
site: 'https://<username>.github.io',
base: '/blog',
```

- [ ] **Step 2: Create .github/workflows/deploy.yml**

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm

      - name: Install dependencies
        run: npm ci

      - name: Run tests
        run: npm test

      - name: Build
        run: npm run build

      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: ./dist

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

- [ ] **Step 3: Commit workflow**

```bash
git add .github/workflows/deploy.yml astro.config.mjs
git commit -m "chore: add github pages deployment workflow"
```

- [ ] **Step 4: Push to GitHub**

```bash
git remote add origin https://github.com/<username>/<repo>.git
git push -u origin main
```

Replace with actual remote URL.

- [ ] **Step 5: Enable GitHub Pages**

In repository settings, go to **Pages** → **Source** → select **GitHub Actions**.

- [ ] **Step 6: Verify deployment**

Wait for the Actions workflow to complete. Visit the deployed URL. Expected: site loads correctly.

---

## Task 12: Final Verification and Polish

**Files:**
- Modify: any files needing fixes

- [ ] **Step 1: Run full test suite**

```bash
npm test
```

Expected: All tests pass.

- [ ] **Step 2: Run production build**

```bash
npm run build
```

Expected: Build succeeds with no errors or warnings about missing routes.

- [ ] **Step 3: Verify all pages locally**

```bash
npx serve dist
```

Check:
- `/` homepage renders with posts and tags.
- `/blog` lists all posts.
- `/blog/hello-world/` renders article with code highlighting.
- `/tags/astro/` lists tagged posts.
- `/search` returns results for "Astro".
- `/about` renders.
- `/rss.xml` is valid RSS.
- `/404` renders for unknown routes.
- Dark mode toggle works and persists after refresh.

- [ ] **Step 4: Check responsive design**

Use browser dev tools to verify layout on mobile (375px) and desktop (1440px). Navigation should not overflow on mobile.

- [ ] **Step 5: Final commit**

```bash
git add .
git commit -m "chore: final polish and verification"
```

---

## Self-Review Checklist

### Spec Coverage

| Spec Section | Implementing Task |
|---|---|
| Astro + Tailwind + MDX + Shiki + Fuse.js 技术栈 | Task 1, Task 2, Task 8 |
| 首页 | Task 5 |
| 文章列表 | Task 6 |
| 文章详情 | Task 7 |
| 标签页 | Task 6 |
| 搜索页 | Task 8 |
| 关于页 | Task 9 |
| RSS | Task 10 |
| 404 | Task 9 |
| 深色模式 | Task 4 |
| 内容集合与 schema | Task 3 |
| GitHub Pages 部署 | Task 11 |
| 测试策略 | Task 3, Task 8, Task 12 |

### Placeholder Scan

- No `TBD`, `TODO`, or "implement later".
- Every task has exact file paths.
- Every code step contains complete code.
- Every command has expected output.

### Type Consistency

- `Post` type imported from `src/utils/posts.ts` consistently.
- `SearchEntry` type imported from `src/utils/search.ts` consistently.
- `BASE_URL` used consistently for absolute paths.

### Known Decisions

- `base` in `astro.config.mjs` defaults to `'/'`. Must be updated if using a project-site repository.
- `<username>` placeholders in deploy URLs and about page must be replaced.
- Sample posts can be replaced or removed once real content is added.

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

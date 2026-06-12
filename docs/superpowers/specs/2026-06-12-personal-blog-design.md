# 个人博客设计文档

## 1. 项目定位

- **主题**：技术笔记与教程为主的个人博客。
- **目标读者**：开发者、技术学习者、对作者分享内容感兴趣的同行。
- **核心目标**：让作者可以通过 Markdown + Git 的工作流高效发布文章，读者能够快速发现、阅读和订阅内容。

## 2. 技术架构

| 层级 | 选择 | 理由 |
|---|---|---|
| 静态站点生成器 | Astro | 构建产物为纯静态 HTML/CSS/JS，首屏快，SEO 和 RSS 友好，Content Collections 适合管理 Markdown/MDX 文章。 |
| 样式 | Tailwind CSS | 原子化样式，便于维护深色模式、响应式布局和组件化设计。 |
| 内容格式 | Markdown / MDX | Markdown 满足当前需求；MDX 保留未来在文章中嵌入交互组件的可能性。 |
| 语法高亮 | Shiki | 服务端渲染时生成稳定的彩色代码块，避免运行时加载高亮库。 |
| 搜索 | Fuse.js + 构建时索引 | 客户端全文搜索，无需后端；索引在构建时生成。 |
| 部署 | GitHub Pages + GitHub Actions | 推送即发布，与 Markdown + Git 的工作流完全契合。 |

## 3. 页面结构

| 路由 | 页面 | 功能 |
|---|---|---|
| `/` | 首页 | 简短自我介绍、最近文章列表、标签云入口。 |
| `/blog` | 文章列表 | 全部文章，支持按标签筛选。 |
| `/blog/[slug]` | 文章详情 | 正文、标签、发布时间、预计阅读时间、上一篇/下一篇导航。 |
| `/tags/[tag]` | 标签页 | 某个标签下的所有文章。 |
| `/search` | 搜索页 | 关键词搜索标题、摘要、正文。 |
| `/about` | 关于页 | 个人介绍、联系方式、技术栈。 |
| `/rss.xml` | RSS Feed | 全站文章订阅。 |

## 4. 内容组织

```
src/
  content/
    posts/              # Markdown / MDX 文章
      hello-world.md
      astro-guide.mdx
    config.ts           # 文章 frontmatter schema
  pages/
    index.astro
    blog/
      index.astro
      [slug].astro
    tags/
      [tag].astro
    search.astro
    about.astro
    rss.xml.js
  components/
    PostCard.astro
    TagList.astro
    SearchBox.astro
    ThemeToggle.astro
    Prose.astro
  layouts/
    BaseLayout.astro
    PostLayout.astro
  styles/
    global.css
```

### 文章 frontmatter 规范

每篇文章必须包含以下字段：

```yaml
---
title: "文章标题"
description: "一句话摘要"
pubDate: 2026-06-12
tags: ["astro", "javascript"]
---
```

- `title`：文章标题，用于列表和详情页。
- `description`：一句话摘要，用于列表卡片、搜索索引和 RSS。
- `pubDate`：发布日期，`YYYY-MM-DD` 格式。
- `tags`：标签数组，至少一个。

## 5. 视觉设计系统

### 整体方向

深色 / 开发者风，但避免“黑底绿字”的刻板印象。方向是“终端编辑器 + 印刷排版”的混合：深色背景像 IDE，版式更讲究，像一本技术杂志。

### 配色

| Token | 色值 | 用途 |
|---|---|---|
| `bg-primary` | `#0B0C0F` | 主背景 |
| `bg-secondary` | `#14161B` | 卡片、代码块背景 |
| `text-primary` | `#E6E6E6` | 主文字 |
| `text-secondary` | `#8B919C` | 次要文字、日期、标签 |
| `accent` | `#FFB86C` | 强调色：链接、按钮、hover |
| `accent-secondary` | `#7EE787` | 成功状态、少量标签 hover |
| `border` | `#272A33` | 边框、分隔线 |

### 字体

| 角色 | 字体 | 用途 |
|---|---|---|
| Display | `Space Grotesk` | 首页大标题、文章 H1 |
| Body | `Inter` / 系统无衬线 | 正文、界面文字 |
| Code | `JetBrains Mono` | 行内代码、代码块 |

### 版式

- 最大内容宽度：`780px`，适合长文阅读。
- 首页采用宽松布局：顶部大标题 + 最近 5 篇文章 + 标签云。
- 文章页结构：标题区 → 元信息（日期、标签、预计阅读时间）→ 正文 → 底部导航。
- 代码块：Shiki 高亮，背景 `bg-secondary`，圆角，轻微边框。

### Signature Element

首页顶部标题后有一个缓慢闪烁的橙色光标（`▌`），像一个等待输入的终端提示符。它点明博客的属性：技术、持续更新、手工感。其他地方保持克制，不做额外动画。

## 6. 数据流

1. 作者将文章放入 `src/content/posts/`。
2. 构建时，Astro Content Collections 读取并校验所有文章。
3. Astro 生成首页、文章列表、文章详情、标签页、RSS。
4. 构建脚本同时生成一份 JSON 搜索索引，写入 `dist/search.json`。
5. `/search` 页面加载该索引，使用 Fuse.js 在浏览器端完成搜索。

## 7. 错误处理

| 场景 | 处理方式 |
|---|---|
| frontmatter 缺失或格式错误 | `content/config.ts` 中的 Zod schema 在构建时报错，阻止部署。 |
| 文章 slug 冲突 | 构建时报错，要求修改文件名。 |
| 搜索索引加载失败 | `/search` 页面显示降级提示：“搜索暂不可用，请直接浏览文章列表。” |
| 404 | 提供深色主题的 404 页面，含返回首页链接。 |
| RSS 生成失败 | 构建阶段暴露问题，不会静默跳过。 |

## 8. 暗黑模式

- 默认跟随系统 `prefers-color-scheme`。
- 提供切换按钮，保存用户选择到 `localStorage`。
- 切换时无闪烁：在 `localStorage` 读取完成前，使用内联脚本避免主题跳动（FOUC）。

## 9. 测试策略

| 类型 | 方式 |
|---|---|
| 构建测试 | GitHub Actions 每次提交运行 `astro build`，确保无构建错误。 |
| 内容校验 | Zod schema 自动校验 frontmatter。 |
| 手动检查清单 | 首页、文章页、标签页、搜索页、RSS 在桌面和移动端正常；深色模式切换和持久化正常；代码高亮、链接 hover 正常；RSS 可被常见阅读器解析。 |
| 视觉回归（可选） | 如后续扩展，可用 Playwright 截图对比关键页面。 |

## 10. 开发顺序

1. 初始化 Astro 项目 + Tailwind + Content Collections。
2. 实现文章列表和详情页。
3. 实现标签页和关于页。
4. 生成 RSS。
5. 实现 Fuse.js 搜索。
6. 实现深色模式切换。
7. 配置 GitHub Actions 部署到 GitHub Pages。
8. 视觉打磨：字体、间距、signature 光标。

## 11. 非目标

- 评论系统（暂不需要）。
- 后端服务或数据库。
- 多语言支持（首版仅中文）。
- 复杂动画或页面过渡效果。

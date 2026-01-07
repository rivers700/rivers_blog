---
title: "使用 Next.js 构建静态博客"
date: "2024-12-22"
excerpt: "详细介绍如何使用Next.js构建一个现代化的静态博客网站。"
tags: ["Next.js", "React", "教程", "前端"]
category: "tech"
---

# 使用 Next.js 构建静态博客

Next.js 是一个强大的 React 框架，非常适合构建静态博客网站。

## 为什么选择 Next.js？

1. **静态生成 (SSG)** - 构建时生成HTML，加载速度极快
2. **App Router** - 基于文件系统的路由，简单直观
3. **TypeScript 支持** - 开箱即用的类型检查
4. **优化功能** - 图片优化、字体优化等

## 项目结构

```
blog/
├── src/
│   ├── app/              # App Router 页面
│   │   ├── layout.tsx    # 根布局
│   │   ├── page.tsx      # 首页
│   │   └── posts/
│   │       ├── page.tsx  # 文章列表
│   │       └── [slug]/
│   │           └── page.tsx  # 文章详情
│   ├── components/       # React 组件
│   ├── lib/              # 工具函数
│   └── styles/           # 样式文件
├── content/
│   └── posts/            # Markdown 文章
├── public/               # 静态资源
└── package.json
```

## 核心功能实现

### Markdown 解析

使用 `gray-matter` 解析 frontmatter，`unified` 生态系统处理内容：

```typescript
import matter from 'gray-matter';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import rehypeStringify from 'rehype-stringify';

function processMarkdown(content: string): string {
  const result = unified()
    .use(remarkParse)
    .use(remarkRehype)
    .use(rehypeStringify)
    .processSync(content);
  
  return result.toString();
}
```

### 代码高亮

使用 `rehype-highlight` 插件：

```typescript
import rehypeHighlight from 'rehype-highlight';

// 在 unified 链中添加
.use(rehypeHighlight)
```

### 数学公式

使用 `remark-math` 和 `rehype-katex`：

```typescript
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

// 在 unified 链中添加
.use(remarkMath)
.use(rehypeKatex)
```

## 静态生成配置

在 `next.config.mjs` 中配置：

```javascript
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
};
```

## 部署到 GitHub Pages

1. 配置 GitHub Actions workflow
2. 设置 `basePath` 和 `assetPrefix`
3. 推送代码触发自动部署

## 总结

Next.js 提供了构建静态博客所需的一切功能，结合 Markdown 和现代化的工具链，可以快速创建一个高性能的博客网站。

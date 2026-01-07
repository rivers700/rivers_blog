# 大江东去 - 静态博客

一个使用 Next.js 构建的现代化静态博客网站。

## ✨ 功能特性

- 🚀 **Next.js 14** - 使用 App Router 架构
- 📝 **Markdown 支持** - 使用 Markdown 编写文章
- 🎨 **Tailwind CSS** - 现代化的样式框架
- 🌙 **暗黑模式** - 自动切换明暗主题
- 📱 **响应式设计** - 适配各种屏幕尺寸
- 💻 **代码高亮** - 使用 highlight.js
- 📐 **数学公式** - KaTeX 渲染支持
- 📦 **静态生成** - 部署到 GitHub Pages

## 🛠️ 技术栈

- **框架**: Next.js 14 (App Router)
- **语言**: TypeScript
- **样式**: Tailwind CSS
- **Markdown**: unified + remark + rehype
- **代码高亮**: rehype-highlight
- **数学公式**: remark-math + rehype-katex
- **主题切换**: next-themes

## 📁 项目结构

```
├── src/
│   ├── app/                 # App Router 页面
│   │   ├── layout.tsx       # 根布局
│   │   ├── page.tsx         # 首页
│   │   ├── posts/           # 文章相关页面
│   │   └── about/           # 关于页面
│   ├── components/          # React 组件
│   │   ├── Header.tsx       # 页头导航
│   │   ├── Footer.tsx       # 页脚
│   │   ├── ThemeProvider.tsx # 主题提供者
│   │   ├── ThemeToggle.tsx  # 主题切换按钮
│   │   └── PostCard.tsx     # 文章卡片
│   ├── lib/                 # 工具库
│   │   ├── posts.ts         # 文章处理函数
│   │   └── utils.ts         # 通用工具函数
│   └── styles/              # 样式文件
│       └── globals.css      # 全局样式
├── content/
│   └── posts/               # Markdown 文章
├── public/                  # 静态资源
└── ...配置文件
```

## 🚀 快速开始

### 安装依赖

```bash
npm install
```

### 开发模式

```bash
npm run dev
```

访问 [http://localhost:3000](http://localhost:3000)

### 构建生产版本

```bash
npm run build
```

生成的静态文件在 `out/` 目录。

## ✍️ 写作指南

### 创建新文章

在 `content/posts/` 目录下创建 `.md` 文件：

```markdown
---
title: "文章标题"
date: "2024-12-24"
excerpt: "文章摘要"
tags: ["标签1", "标签2"]
---

# 文章内容

正文内容...
```

### Frontmatter 字段

| 字段 | 类型 | 必填 | 描述 |
|------|------|------|------|
| title | string | 是 | 文章标题 |
| date | string | 是 | 发布日期 (YYYY-MM-DD) |
| excerpt | string | 否 | 文章摘要 |
| tags | string[] | 否 | 标签列表 |

### 代码高亮

使用 Markdown 代码块：

````markdown
```typescript
const hello = "world";
```
````

### 数学公式

行内公式：`$E = mc^2$`

块级公式：

```markdown
$$
\int_{-\infty}^{\infty} e^{-x^2} dx = \sqrt{\pi}
$$
```

## 🌐 部署到 GitHub Pages

1. 将代码推送到 GitHub 仓库

2. 在仓库设置中启用 GitHub Pages：
   - Settings → Pages → Source → GitHub Actions

3. 如果部署到子目录，修改 `next.config.mjs`：

```javascript
const nextConfig = {
  output: 'export',
  basePath: '/your-repo-name',
  assetPrefix: '/your-repo-name/',
  // ...
};
```

4. 推送代码后，GitHub Actions 会自动构建和部署

## 📄 许可证

MIT License

---

> 大江东去，浪淘尽，千古风流人物。

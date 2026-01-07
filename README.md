# 大江东去 - 个人博客

一个基于 Next.js 14 构建的现代化个人博客系统，支持 Markdown 写作、多分类管理、暗色模式等功能。

## ✨ 功能特性

- 🚀 **Next.js 14 App Router** - 使用最新的 App Router 架构
- 📝 **Markdown 支持** - 支持 GFM、代码高亮、数学公式
- 🎨 **Tailwind CSS** - 现代化响应式设计
- 🌙 **暗色模式** - 自动/手动切换明暗主题
- � ***全文搜索** - Cmd/Ctrl+K 快捷键唤起搜索
- � **目码录导航** - 文章自动生成目录，支持平滑滚动
- � **阅读进式度** - 顶部阅读进度条
- 🏷️ **多分类管理** - 技术、生活、工具三大分类
- 📱 **响应式设计** - 完美适配移动端
- � * *管理后台** - 支持在线写作和文件上传
- 📡 **RSS 订阅** - 自动生成 RSS Feed
- 🗺️ **Sitemap** - 自动生成站点地图
- ⚡ **ISR 支持** - 增量静态再生成，60秒自动更新

## 🛠️ 技术栈

| 类别 | 技术 |
|------|------|
| 框架 | Next.js 14 (App Router) |
| 语言 | TypeScript |
| 样式 | Tailwind CSS + @tailwindcss/typography |
| Markdown | unified + remark + rehype |
| 代码高亮 | rehype-highlight |
| 数学公式 | remark-math + rehype-katex |
| 主题切换 | next-themes |
| 认证 | JWT + bcryptjs |
| 验证 | Zod |

## 📁 项目结构

```
├── content/                 # Markdown 文章目录
│   ├── tech/               # 技术文章
│   │   ├── frontend/       # 前端开发
│   │   ├── backend/        # 后端开发
│   │   ├── ai/             # AI / 机器学习
│   │   └── other/          # 其他技术
│   ├── life/               # 生活随笔
│   └── tools/              # 工具分享
├── src/
│   ├── app/                # App Router 页面
│   │   ├── api/            # API 路由
│   │   ├── admin/          # 管理后台
│   │   ├── posts/          # 文章页面
│   │   ├── tech/           # 技术分类
│   │   ├── life/           # 生活分类
│   │   └── tools/          # 工具分类
│   ├── components/         # React 组件
│   ├── lib/                # 工具函数
│   └── styles/             # 全局样式
├── public/                 # 静态资源
└── ...配置文件
```

## 🚀 快速开始

### 环境要求

- Node.js 18.x 或更高版本
- npm 或 yarn

### 安装

```bash
# 克隆项目
git clone https://github.com/your-username/your-repo.git
cd your-repo

# 安装依赖
npm install

# 复制环境变量配置
cp .env.example .env.local
```

### 配置环境变量

编辑 `.env.local` 文件：

```env
# 管理员密码（必须修改！）
ADMIN_PASSWORD=your_secure_password

# 网站地址（部署后修改）
SITE_URL=https://yourdomain.com
```

### 开发

```bash
npm run dev
```

访问 [http://localhost:3000](http://localhost:3000)

### 构建

```bash
npm run build
npm start
```

## ✍️ 写作指南

### 创建文章

在对应分类目录下创建 `.md` 文件，例如 `content/tech/frontend/my-article.md`：

```markdown
---
title: "文章标题"
date: "2024-01-01"
excerpt: "文章摘要"
tags: ["标签1", "标签2"]
---

# 正文内容

这里是文章正文...
```

### Frontmatter 字段

| 字段 | 类型 | 必填 | 描述 |
|------|------|------|------|
| title | string | ✅ | 文章标题 |
| date | string | ✅ | 发布日期 (YYYY-MM-DD) |
| excerpt | string | ❌ | 文章摘要 |
| tags | string[] | ❌ | 标签列表 |

### 代码高亮

支持多种语言的语法高亮：

````markdown
```typescript
const greeting: string = "Hello, World!";
console.log(greeting);
```
````

### 数学公式

支持 KaTeX 渲染数学公式：

```markdown
行内公式：$E = mc^2$

块级公式：
$$
\int_{-\infty}^{\infty} e^{-x^2} dx = \sqrt{\pi}
$$
```

## 🔐 管理后台

访问 `/admin` 进入管理后台，支持：

- 📤 上传 Markdown 文件
- ✏️ 在线编辑器写作
- 📂 选择文章分类

默认密码在 `.env.local` 中配置。

## 🌐 部署

### GitHub Pages

项目已配置 GitHub Actions 自动部署，推送到 `main` 分支后会自动构建并部署到 GitHub Pages。

### 服务器部署

详细的宝塔面板部署指南请参考 [DEPLOY.md](./DEPLOY.md)。

## 📄 许可证

MIT License

---

> 大江东去，浪淘尽，千古风流人物。

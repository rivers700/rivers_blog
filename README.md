# 大江东去

> 浪淘尽，千古风流人物。

基于 Next.js 14 构建的个人博客，简洁、现代、快速。

## 特性

🚀 Next.js 14 App Router　　📝 Markdown + 数学公式　　🌙 暗色模式　　🔍 全文搜索　　📱 响应式设计

## 快速开始

```bash
npm install
cp .env.example .env.local  # 配置管理员密码
npm run dev
```

## 写作

在 `content/` 目录下创建 `.md` 文件：

```markdown
---
title: "文章标题"
date: "2024-01-01"
tags: ["标签"]
---

正文内容...
```

## 部署

推送到 `main` 分支自动部署至 GitHub Pages，服务器部署参考 [DEPLOY.md](./DEPLOY.md)。

## License

MIT

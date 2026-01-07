---
title: "Node.js 后端开发最佳实践"
date: "2024-12-17"
excerpt: "总结 Node.js 后端开发中的最佳实践，包括项目结构、错误处理、安全性等方面。"
tags: ["Node.js", "后端", "最佳实践"]
---

# Node.js 后端开发最佳实践

Node.js 已经成为后端开发的主流选择之一，本文总结一些实用的最佳实践。

## 项目结构

推荐的项目结构：

```
src/
├── config/          # 配置文件
├── controllers/     # 控制器
├── middlewares/     # 中间件
├── models/          # 数据模型
├── routes/          # 路由定义
├── services/        # 业务逻辑
├── utils/           # 工具函数
└── app.js           # 应用入口
```

## 错误处理

### 统一错误处理中间件

```javascript
class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
  }
}

const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.isOperational ? err.message : '服务器内部错误';
  
  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};
```

## 环境变量管理

使用 `dotenv` 管理环境变量：

```javascript
// config/index.js
require('dotenv').config();

module.exports = {
  port: process.env.PORT || 3000,
  dbUrl: process.env.DATABASE_URL,
  jwtSecret: process.env.JWT_SECRET,
};
```

## 安全性

### 必要的安全中间件

```javascript
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const cors = require('cors');

app.use(helmet());
app.use(cors({ origin: process.env.ALLOWED_ORIGINS }));
app.use(rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
}));
```

## 日志记录

使用 `winston` 进行日志管理：

```javascript
const winston = require('winston');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
  ],
});
```

## 总结

遵循这些最佳实践，可以让你的 Node.js 项目更加健壮、安全、易于维护。

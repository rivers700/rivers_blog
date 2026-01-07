# 宝塔面板部署指南

## 一、服务器准备

### 1. 安装宝塔面板
```bash
# CentOS
yum install -y wget && wget -O install.sh https://download.bt.cn/install/install_6.0.sh && sh install.sh ed8484bec

# Ubuntu/Debian
wget -O install.sh https://download.bt.cn/install/install-ubuntu_6.0.sh && sudo bash install.sh ed8484bec
```

### 2. 登录宝塔面板
安装完成后会显示面板地址和账号密码，登录后进入面板。

### 3. 安装必要软件
在宝塔面板「软件商店」中安装：
- Nginx（推荐 1.22+）
- PM2 管理器（Node.js 进程管理）
- Node.js 版本管理器

## 二、安装 Node.js

### 方法一：通过宝塔 Node.js 版本管理器
1. 软件商店 → 搜索「Node.js版本管理器」→ 安装
2. 打开管理器 → 安装 Node.js 18.x 或 20.x
3. 设置为默认版本

### 方法二：命令行安装
```bash
# 安装 nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
source ~/.bashrc

# 安装 Node.js 20
nvm install 20
nvm use 20
nvm alias default 20

# 验证
node -v
npm -v
```

## 三、上传项目

### 方法一：Git 拉取（推荐）
```bash
cd /www/wwwroot
git clone https://github.com/你的用户名/你的仓库.git blog
cd blog
```

### 方法二：宝塔文件管理器上传
1. 打开「文件」→ 进入 `/www/wwwroot/`
2. 创建文件夹 `blog`
3. 上传项目压缩包并解压

## 四、安装依赖和构建

```bash
cd /www/wwwroot/blog

# 安装依赖
npm install

# 构建项目
npm run build
```

## 五、配置环境变量

创建 `.env.local` 文件：
```bash
nano /www/wwwroot/blog/.env.local
```

添加内容：
```env
# 管理员密码（必须修改！）
ADMIN_PASSWORD=你的安全密码

# 网站地址（用于 sitemap 和 RSS）
SITE_URL=https://yourdomain.com
```

## 六、使用 PM2 启动项目

### 方法一：通过宝塔 PM2 管理器
1. 软件商店 → PM2管理器 → 设置
2. 添加项目：
   - 项目名称：`blog`
   - 启动文件：`npm`
   - 参数：`start`
   - 运行目录：`/www/wwwroot/blog`
   - 端口：`3000`

### 方法二：命令行操作
```bash
# 安装 PM2
npm install -g pm2

# 启动项目
cd /www/wwwroot/blog
pm2 start npm --name "blog" -- start

# 保存进程列表
pm2 save

# 设置开机自启
pm2 startup
```

### PM2 常用命令
```bash
pm2 list              # 查看所有进程
pm2 logs blog         # 查看日志
pm2 restart blog      # 重启
pm2 stop blog         # 停止
pm2 delete blog       # 删除
```

## 七、配置 Nginx 反向代理

### 1. 添加网站
宝塔面板 → 网站 → 添加站点：
- 域名：`yourdomain.com`
- 根目录：`/www/wwwroot/blog`
- PHP版本：纯静态

### 2. 配置反向代理
点击网站 → 设置 → 反向代理 → 添加反向代理：
- 代理名称：`blog`
- 目标URL：`http://127.0.0.1:3000`
- 发送域名：`$host`

或者手动编辑 Nginx 配置：

点击网站 → 设置 → 配置文件，替换为：

```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;
    
    # 强制 HTTPS（配置 SSL 后启用）
    # return 301 https://$server_name$request_uri;
    
    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        
        # 超时设置
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }
    
    # 静态文件缓存
    location /_next/static {
        proxy_pass http://127.0.0.1:3000;
        proxy_cache_valid 200 365d;
        add_header Cache-Control "public, max-age=31536000, immutable";
    }
    
    # 公共资源缓存
    location /favicon.svg {
        proxy_pass http://127.0.0.1:3000;
        proxy_cache_valid 200 30d;
        add_header Cache-Control "public, max-age=2592000";
    }
    
    # 访问日志
    access_log /www/wwwlogs/blog.log;
    error_log /www/wwwlogs/blog.error.log;
}
```

### 3. 配置 SSL（HTTPS）
1. 网站 → 设置 → SSL
2. 选择「Let's Encrypt」免费证书
3. 勾选域名 → 申请
4. 开启「强制HTTPS」

## 八、防火墙配置

### 宝塔面板
安全 → 防火墙 → 放行端口：
- 80 (HTTP)
- 443 (HTTPS)
- 3000 (Node.js，仅内网访问)

### 云服务器安全组
在云服务商控制台（阿里云/腾讯云等）的安全组中放行 80 和 443 端口。

## 九、更新部署

### 方法一：Git 更新
```bash
cd /www/wwwroot/blog
git pull origin main
npm install
npm run build
pm2 restart blog
```

### 方法二：创建更新脚本
```bash
nano /www/wwwroot/blog/deploy.sh
```

```bash
#!/bin/bash
cd /www/wwwroot/blog
git pull origin main
npm install
npm run build
pm2 restart blog
echo "部署完成！"
```

```bash
chmod +x deploy.sh
./deploy.sh
```

## 十、常见问题

### 1. 端口被占用
```bash
lsof -i:3000
kill -9 <PID>
```

### 2. 权限问题
```bash
chown -R www:www /www/wwwroot/blog
chmod -R 755 /www/wwwroot/blog
```

### 3. 构建失败
```bash
# 清理缓存重新构建
rm -rf .next node_modules
npm install
npm run build
```

### 4. 查看错误日志
```bash
pm2 logs blog --lines 100
cat /www/wwwlogs/blog.error.log
```

### 5. 内存不足
```bash
# 增加 swap
dd if=/dev/zero of=/swapfile bs=1M count=2048
mkswap /swapfile
swapon /swapfile
```

## 十一、管理后台使用

部署完成后访问：`https://yourdomain.com/admin`

功能：
- 上传 MD 文件
- 在线写作
- 选择分类

默认密码：`admin123`（请在 `.env.local` 中修改！）

## 十二、备份建议

### 定时备份
宝塔面板 → 计划任务 → 添加任务：
- 任务类型：备份网站
- 备份网站：blog
- 执行周期：每天

### 手动备份
```bash
# 备份内容文件夹
tar -czvf content-backup-$(date +%Y%m%d).tar.gz /www/wwwroot/blog/content
```

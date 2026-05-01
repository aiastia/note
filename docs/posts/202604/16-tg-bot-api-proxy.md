---
title: Docker 搭建 Telegram Bot API 代理 + 1Panel Nginx 反代配置
date: 2026-04-16
coverImg: /covers/tg-bot-api-proxy.jpg
categories:
  - 运维
tags:
  - Telegram
  - Docker
  - Bot API
  - Nginx
  - 反向代理
  - 1Panel
---

# Docker 搭建 Telegram Bot API 代理 + 1Panel Nginx 反代配置

通过 Docker 自建 Telegram Bot API 服务器，配合 Nginx 反向代理，可以让 Bot 在正常工作，同时支持本地文件下载加速。本文记录完整的搭建和配置过程。

---

## 一、方案概述

Telegram Bot API 默认托管在 `api.telegram.org`，国内无法直接访问。自建 Bot API 代理的思路：

1. 用 Docker 部署官方 `telegram-bot-api` 服务
2. 通过 Nginx 反向代理对外提供 API 访问
3. 配置文件下载路径映射，支持 Bot 发送本地文件

```
Bot 客户端
    │
    ▼ https://your-domain.com/botxxx/getMe
  Nginx 反向代理
    │
    ▼ http://127.0.0.1:8083/botxxx/getMe
  Telegram Bot API Server (Docker)
    │
    ▼
  Telegram 官方服务器
```

---

## 二、Docker 部署 Telegram Bot API

### 2.1 创建目录

```bash
mkdir -p /opt/telegram-bot-api
```

### 2.2 创建 docker-compose.yml

```bash
cd /opt/telegram-bot-api
nano docker-compose.yml
```

```yaml
version: '3.7'

services:
  telegram-bot-api:
    image: aiogram/telegram-bot-api:latest
    environment:
      TELEGRAM_API_ID: "你的_API_ID"
      TELEGRAM_API_HASH: "你的_API_HASH"
      TELEGRAM_STAT: 1
      TELEGRAM_VERBOSITY: 2
    volumes:
      - telegram-bot-api-data:/var/lib/telegram-bot-api
    ports:
      - "127.0.0.1:8083:8081"
      - "127.0.0.1:8082:8082"
    restart: always

volumes:
  telegram-bot-api-data:
```

::: tip 参数说明
- `TELEGRAM_API_ID` / `TELEGRAM_API_HASH`：从 [my.telegram.org](https://my.telegram.org) 申请
- `TELEGRAM_STAT: 1`：启用统计信息
- `TELEGRAM_VERBOSITY: 2`：日志详细等级（0-4）
- `8083`：API 服务端口，通过 Nginx 反代对外
- `8082`：统计/管理端口（可选）
- `telegram-bot-api-data`：Docker 命名卷，持久化 Bot 文件数据
:::

### 2.3 启动服务

```bash
docker compose up -d
```

### 2.4 验证服务

```bash
# 检查容器状态
docker ps | grep telegram-bot-api

# 测试 API 是否响应
curl http://127.0.0.1:8083/
```

---

## 三、1Panel Nginx 反向代理配置

### 3.1 操作路径

1Panel → **网站** → **创建网站** → 选择 **反向代理** → 填写域名和代理地址 `http://127.0.0.1:8083`

创建完成后，进入站点 **配置** → 编辑 Nginx 配置。

### 3.2 完整 Nginx 配置

```nginx
# 主反向代理
location ^~ / {
    proxy_pass http://127.0.0.1:8083;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header REMOTE-HOST $remote_addr;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection $http_connection;
    proxy_set_header X-Forwarded-Proto $scheme;
    proxy_set_header X-Forwarded-Port $server_port;
    proxy_http_version 1.1;
    add_header X-Cache $upstream_cache_status;
    add_header Cache-Control no-cache;
    proxy_ssl_server_name off;
    proxy_ssl_name $proxy_host;
    add_header Strict-Transport-Security "max-age=31536000";
}

# 处理完整路径的文件下载
# 匹配: /file/bot<token>/var/lib/telegram-bot-api/xxx
location ~* ^/file\/bot[^/]+\/var\/lib\/telegram-bot-api(.*) {
    rewrite ^/file\/bot[^/]+\/var\/lib\/telegram-bot-api(.*) /$1 break;
    try_files $uri @files;
}

# 处理短路径的文件下载
# 匹配: /file/bot<token>:xxx
location ~* \/file\/bot\d+:(.*) {
    rewrite ^/file\/bot(.*) /$1 break;
    try_files $uri @files;
}

# 本地文件服务
location @files {
    root /var/lib/telegram-bot-api;
    gzip on;
    gzip_vary on;
    gzip_proxied any;
    gzip_comp_level 6;
    gzip_buffers 64 8k;
    gzip_http_version 1.1;
    gzip_min_length 1100;
}
```

::: warning 注意
Nginx 容器需要能访问 `/var/lib/telegram-bot-api` 目录。如果 Nginx 也是 Docker 部署的，需要挂载相同的卷：
```bash
-v /opt/telegram-bot-api/data:/var/lib/telegram-bot-api
```
:::

### 3.3 验证配置并重载

```bash
# 验证语法
nginx -t

# 重载配置
nginx -s reload
```

---

## 四、配置解析

### 4.1 API 代理（location ^~ /）

将所有 API 请求转发到本地 Bot API 服务：

| 指令 | 作用 |
|------|------|
| `location ^~ /` | 前缀匹配，优先级高于正则 |
| `proxy_pass http://127.0.0.1:8083` | 转发到 Bot API 服务 |
| `proxy_http_version 1.1` | 支持 WebSocket 长连接（用于 getUpdates） |
| `X-Forwarded-Proto` / `X-Forwarded-Port` | 传递原始协议和端口信息 |
| `Strict-Transport-Security` | 强制 HTTPS |

### 4.2 文件下载路径重写

Telegram Bot API 文件下载 URL 格式为：

```
https://api.telegram.org/file/bot<token>/<file_path>
```

自建 API 服务的文件存储在本地 `/var/lib/telegram-bot-api`，需要 Nginx 直接提供文件服务，不走代理转发。

**两种路径格式：**

| location 匹配 | 示例 URL | 处理方式 |
|------|------|------|
| 完整路径 | `/file/bot123:xxx/var/lib/telegram-bot-api/photos/test.jpg` | rewrite 提取最后部分，try_files 查找本地文件 |
| 短路径 | `/file/bot123:xxx/photos/test.jpg` | rewrite 提取路径，try_files 查找本地文件 |

### 4.3 @files 降级处理

当 `try_files` 找不到文件时，回退到 `@files` location：

```nginx
location @files {
    root /var/lib/telegram-bot-api;
    # ... gzip 压缩配置
}
```

直接从本地磁盘 `/var/lib/telegram-bot-api` 读取文件并返回。

---

## 五、Bot 客户端配置

### 5.1 使用自建 API 地址

将 Bot 的 API Base URL 从默认的 `https://api.telegram.org` 替换为你的域名：

```python
# Python 示例（python-telegram-bot）
from telegram import Bot
bot = Bot(token="YOUR_BOT_TOKEN", base_url="https://your-domain.com/")
```

```bash
# curl 测试
curl https://your-domain.com/bot<YOUR_TOKEN>/getMe
```

### 5.2 常用 API 端点测试

```bash
# 获取 Bot 信息
curl https://your-domain.com/bot<TOKEN>/getMe

# 获取更新
curl https://your-domain.com/bot<TOKEN>/getUpdates

# 发送消息
curl -X POST https://your-domain.com/bot<TOKEN>/sendMessage \
  -d "chat_id=<CHAT_ID>&text=Hello"
```

---

## 六、请求流程

```
Bot 调用 sendMessage 等接口
        │
        ▼ https://your-domain.com/bot<token>/sendMessage
  Nginx location ^~ /
        │
        ▼ proxy_pass
  Docker Bot API Server (127.0.0.1:8083)
        │
        ▼
  Telegram 官方服务器（海外）

---

Bot 调用 getFile 下载文件
        │
        ▼ https://your-domain.com/file/bot<token>/photos/xxx.jpg
  Nginx location ~* \/file\/bot...
        │
        ▼ rewrite + try_files
  本地 /var/lib/telegram-bot-api/photos/xxx.jpg
        │
        ▼
  直接返回文件（@files gzip 压缩）
```

---

## 七、常见问题

### 7.1 API 返回 404

- 确认 Docker 容器正常运行：`docker ps`
- 确认本地端口映射正确：`curl http://127.0.0.1:8083/`

### 7.2 文件下载 404

- 确认文件路径正确，文件存在于 `/opt/telegram-bot-api/data/` 下
- 确认 Nginx 能访问到挂载目录
- 检查 rewrite 规则是否正确匹配

### 7.3 502 Bad Gateway

- 检查 Docker 容器是否运行：`docker logs telegram-bot-api`
- 确认端口没有被其他服务占用：`ss -tlnp | grep 8083`

### 7.4 SSL 证书问题

- 1Panel 中申请 SSL 证书：**网站** → 对应站点 → **HTTPS** → 申请 Let's Encrypt 证书
- 开启强制 HTTPS 跳转

::: tip 建议
- 定期检查 Docker 容器日志：`docker logs -f telegram-bot-api`
- 使用 `docker update --restart=always telegram-bot-api` 确保容器自动重启
- 可配合 `watchtower` 实现镜像自动更新
:::
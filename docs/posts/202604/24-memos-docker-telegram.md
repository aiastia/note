---
title: Memos：自建轻量笔记服务，搭配 Telegram Bot 随手记录
date: 2026-04-23
categories:
  - Docker
tags:
  - Memos
  - Docker
  - Telegram
  - 自建
  - 开源
---

# Memos：自建轻量笔记服务，搭配 Telegram Bot 随手记录

## Memos 是什么

[Memos](https://github.com/usememos/memos) 是一个开源的、自托管的轻量笔记工具。Markdown 原生支持，单 Go 二进制文件，Docker 镜像只有 ~20MB。适合用来收集灵感、摘抄金句、快速记录。

核心特点：

- **即时记录**：打开就写，没有复杂的文件夹结构
- **Markdown 支持**：写笔记、代码块、链接都很方便
- **标签系统**：用 `#标签` 分类管理内容
- **全文搜索**：快速找到之前记录的内容
- **数据自主**：SQLite 存储，数据完全在你手里
- **REST + gRPC API**：方便与其他工具集成

## Docker 部署

### docker-compose.yml

```yaml
services:
  memos:
    image: neosmemo/memos:stable
    container_name: memos
    restart: unless-stopped
    ports:
      - "5230:5230"
    volumes:
      - ./data:/var/opt/memos
    environment:
      MEMOS_PORT: 5230
      MEMOS_DRIVER: sqlite
      MEMOS_INSTANCE_URL: https://your-domain.com
```

把 `MEMOS_INSTANCE_URL` 改成你的实际域名，然后：

```bash
docker compose up -d
```

打开 `http://你的IP:5230` 即可使用。首次访问需要注册账号。

### 为什么用 SQLite

对于个人笔记场景，SQLite 完全够用：

- 几万条笔记：秒查，毫无压力
- 单文件存储：备份就是复制一个文件
- 不需要额外跑 MySQL/PostgreSQL 容器，省内存

以后数据量大了，Memos 也支持迁移到 MySQL/PostgreSQL。

## Telegram Bot 对接

Memos 官方提供了 [Memogram](https://github.com/usememos/telegram-integration) 工具，可以将 Telegram Bot 与 Memos 连接，实现通过 TG 消息直接创建笔记。

### 创建 Bot

1. 在 Telegram 找 [@BotFather](https://t.me/BotFather)
2. 发送 `/newbot`，按提示设置名称
3. 获得 Bot Token

### 部署 Memogram

在 `docker-compose.yml` 中追加 Memogram 服务：

```yaml
  memogram:
    image: ghcr.io/aiastia123/telegram-integration:latest
    container_name: memogram
    restart: unless-stopped
    environment:
      - SERVER_ADDR=dns:memos:5230
      - BOT_TOKEN=你的Bot_Token
      - ALLOWED_USERNAMES=你的TG用户名
```

`ALLOWED_USERNAMES` 是可选的，设置后只有指定用户可以使用 Bot。

重新启动：

```bash
docker compose up -d
```

### 绑定账号

1. 在 Telegram 找到你的 Bot，发送 `/start`
2. 输入你的 Memos Access Token（在 Memos 网页 → 设置 → Access Tokens 中创建）
3. 绑定成功后，直接发消息给 Bot 即可创建笔记
4. 发送图片也会保存到笔记中
5. `/search 关键词` 可以搜索已有笔记

## API 使用

Memos 提供完整的 REST API，可以在 `设置 → Access Tokens` 中创建 Token。

### 创建公开笔记

```bash
curl -X POST "https://your-domain.com/api/v1/memos" \
  -H "Authorization: Bearer 你的Token" \
  -H "Content-Type: application/json" \
  -d '{
    "content": "这是一条笔记\n\n#标签",
    "visibility": "PUBLIC"
  }'
```

`visibility` 可选值：

- `PUBLIC`：公开
- `PROTECTED`：登录可见
- `PRIVATE`：仅自己可见

### 获取笔记列表

```bash
curl "https://your-domain.com/api/v1/memos?pageSize=10" \
  -H "Authorization: Bearer 你的Token"
```

## 反代配置

如果你使用 Nginx 反向代理，基本配置如下：

```nginx
server {
    listen 443 ssl;
    server_name your-domain.com;

    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;

    location / {
        proxy_pass http://127.0.0.1:5230;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

## 日常使用建议

- **随手记录**：通过 Telegram Bot 随时发送想法、金句、待办
- **标签分类**：养成加标签的习惯，比如 `#摘抄` `#感悟` `#TODO`
- **定期回顾**：Memos 支持按时间线浏览，方便回顾

## 项目地址

- Memos：[https://github.com/usememos/memos](https://github.com/usememos/memos)
- Memogram（Telegram Bot）：[https://github.com/usememos/telegram-integration](https://github.com/usememos/telegram-integration)
- 官方文档：[https://usememos.com/docs](https://usememos.com/docs)
- 在线演示：[https://demo.usememos.com](https://demo.usememos.com)

---
title: 有趣的 Docker 运行方式合集
date: 2026-04-21
categories:
  - Docker
tags:
  - docker
  - 工具
  - 网络工具
  - 翻墙
---

# 有趣的 Docker 运行方式合集

收集各种有趣的 Docker 容器运行方式和用途说明，按类别整理。

## 测速类

### Looking Glass Server

基于 WikiHost 的 Looking Glass，提供网络测试页面：

```bash
docker run -d --restart always --network host -e HTTP_PORT=8100 -e SPEEDTEST_FILE_LIST=500MB wikihostinc/looking-glass-server
```

### Speedtest (LibreSpeed)

自建 Speedtest 测速服务器，支持密码保护和混淆：

```bash
docker run -d \
  -e MODE=standalone \
  -e TELEMETRY=true \
  -e ENABLE_ID_OBFUSCATION=true \
  -e PASSWORD="yourPasswordHere" \
  -e WEBPORT=86 \
  -p 86:86 \
  adolfintel/speedtest
```

### Speedtest-X

中文友好的测速页面：

```bash
docker run -d -p 12023:80 --restart=always badapple9/speedtest-x
```

### HTML5 Speedtest

基于 HTML5 的网速测试：

```bash
docker run -d -p 12027:80 ilemonrain/html5-speedtest:latest
```

---

## 文件存储

### Alist

多存储聚合文件列表程序，支持网盘挂载：

```bash
docker run -d --restart always \
  -v /etc/alist:/opt/alist/data \
  -p 12029:5244 \
  xhofe/alist:latest
```

### GD-Utils

Google Drive 操作工具：

```bash
docker run -d \
  -e USERPWD="yourPassword" \
  -p 12023:4200 -p 12024:80 -p 12025:23333 \
  -v /gd-utils:/root/gd-utils \
  --restart=always \
  gdtool/gd-utils-docker
```

### ZFile

在线文件浏览和管理：

```bash
docker run -d --network=host \
  -v /root/zfile/db:/root/.zfile/db \
  -v /root/zfile/logs:/root/.zfile/logs \
  --restart=always \
  zhaojun1998/zfile
```

### ARPT

Telegram Bot + Aria2 远程下载管理，支持 Rclone：

```bash
docker run -d \
  -e Api_hash=your_api_hash \
  -e Api_id=your_api_id \
  -e Aria2_secret=your_aria2_secret \
  -e Remote=your_rclone_remote \
  -e Telegram_bot_api=your_bot_token \
  -e Telegram_user_id="your_chat_id" \
  -e Upload=your_rclone_upload \
  -e Rclone_share=False \
  -e Error_user_info="你没有使用权限" \
  -p 8868:8868 \
  benchao/arpt:v2.1.0
```

---

## 微软工具

### Microsoft Graph

微软账户管理工具：

```bash
docker run -d \
  -p 8099:8099 \
  -v /root/config:/config \
  -v /root/db:/root/.graph/db \
  logr/microsoft:latest
```

### O365

Office 365 相关工具：

```bash
docker run -d \
  -p 9527:9527 \
  -v /root/o365/data:/data \
  vanyouseea/o365
```

### E5Sub

Microsoft E5 订阅自动续订：

```bash
docker run -d \
  -v /path/to/config.yml:/root/config.yml \
  -v /path/to/e5sub.db:/root/e5sub.db \
  --restart=always \
  aiastia/e5sub:sql
```

---

## 其他工具

### 学习强国

自动学习刷分（需自行配置参数）：

```bash
docker run -d \
  --shm-size="2g" \
  -e "ZhuanXiang=True" \
  -e "Pushmode=6" \
  -p "9980:80" \
  techxuexi/techxuexi-amd64:latest
```

### Charles

Charles Web 代理调试工具：

```bash
docker run -d -p 7865:8080 aiastia/charles
```

### RSS Bot

Telegram RSS 订阅机器人：

```bash
docker run -d \
  -v /path/to/rss:/root \
  registry.cn-hongkong.aliyuncs.com/aiastia/rssbot:alpha10 \
  rssbot -d /root/rss your_bot_token
```

### Live Torrent

在线 BT 种子流媒体播放：

```bash
docker run -d -p 8080:8080 davenchy/live-torrent
```

### KMS

KMS 激活服务器：

```bash
docker run -d -p 12031:1688 --restart=always aiastia/kms
```

### MetaTube

视频元数据刮削服务：

```bash
docker run -d -p 8080:8080 --name metatube ghcr.io/metatube-community/metatube-server:latest
```

[官方部署文档](https://metatube-community.github.io/wiki/server-deployment/)

### KKFileView

文件在线预览服务，支持 Office、PDF、视频等：

```bash
docker run -it -p 8012:8012 keking/kkfileview:4.1.0
```

[官方部署文档](https://kkview.cn/zh-cn/docs/production.html)

### SQLite Web

SQLite 数据库 Web 管理界面，支持在线浏览表结构、执行 SQL 查询、编辑数据：

```yaml
services:
  sqlite-web:
    image: coleifer/sqlite-web
    container_name: sqlite-web
    restart: unless-stopped
    ports:
      - "8080:8080"
    volumes:
      - /path/to/data:/data
    environment:
      - SQLITE_DATABASE=your_database.db
```

使用方式：把 `/path/to/data` 替换成你的数据库所在目录，`SQLITE_DATABASE` 填数据库文件名。启动后访问 `http://IP:8080` 即可。

---

## 网络代理

### X-UI

Xray 面板管理工具：

```bash
docker run -d --network=host \
  -v /root/xui/db/:/etc/x-ui/ \
  -v /root/xui/cert/:/root/cert/ \
  --restart=unless-stopped \
  enwaiax/x-ui:latest
```

### FRP

内网穿透客户端：

```bash
docker run -d --network=host \
  -v /path/to/frps.ini:/etc/frp/frps.ini:ro \
  aiastia/frp:dev
```

### AdGuard Home

DNS 去广告和隐私保护：

```bash
docker run -d \
  -v /opt/adguardhome/work:/opt/adguardhome/work \
  -v /opt/adguardhome/conf:/opt/adguardhome/conf \
  --network=host \
  --log-opt max-size=50m --log-opt max-file=3 \
  adguard/adguardhome:latest
```

### NPC

NPS 内网穿透客户端：

```bash
docker run -d --network=host \
  -v /path/to/nps:/conf \
  aiastia/npc:dev
```

---

## 使用建议

- 所有敏感信息（Token、密码、API Key）使用 Docker secrets 或 `.env` 文件管理
- 生产环境注意限制内存和 CPU（`-m`、`--cpus` 参数）
- 建议使用 `--restart=always` 或 `--restart=unless-stopped` 保证服务持续运行
- 日志文件建议使用 `--log-opt` 限制大小，防止磁盘占满

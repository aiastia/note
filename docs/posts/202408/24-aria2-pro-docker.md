---
title: Aria2 Pro Docker 部署
date: 2024-08-24
categories:
  - Docker
tags:
  - docker
  - aria2
  - 下载工具
  - AriaNg
---

# Aria2 Pro Docker 部署

## docker-compose.yml

```yaml
version: "3.8"

services:
  Aria2-Pro:
    image: p3terx/aria2-pro
    environment:
      - PUID=65534
      - PGID=65534
      - UMASK_SET=000
      - RPC_SECRET=ai
      - RPC_PORT=6800
      - LISTEN_PORT=6888
      - DISK_CACHE=64M
      - IPV6_MODE=false
      - UPDATE_TRACKERS=true
      - CUSTOM_TRACKER_URL=https://raw.githubusercontent.com/ngosang/trackerslist/master/trackers_best.txt,https://trackerslist.com/all_aria2.txt
      - TZ=Asia/Shanghai
    volumes:
      - /share/CACHEDEV2_DATA/downbt/AriaII/.aria2/aria2-config:/config
      - /share/CACHEDEV2_DATA/downbt/AriaII/aria2-downloads:/downloads
    network_mode: bridge
    ports:
      - 6800:6800
      - 6888:6888
      - 6888:6888/udp
    restart: unless-stopped
    logging:
      driver: json-file
      options:
        max-size: 1m

  AriaNg:
    container_name: ariang
    image: p3terx/ariang
    command: --port 6880 --ipv6
    network_mode: bridge
    ports:
      - 6880:6880
    restart: unless-stopped
    logging:
      driver: json-file
      options:
        max-size: 1m
```

## 环境变量说明

| 变量 | 说明 |
|------|------|
| `PUID` / `PGID` | 用户/组 ID |
| `RPC_SECRET` | RPC 密钥，AriaNg 连接时需填写 |
| `RPC_PORT` | RPC 端口 |
| `LISTEN_PORT` | BT 监听端口 |
| `DISK_CACHE` | 磁盘缓存大小 |
| `UPDATE_TRACKERS` | 自动更新 Tracker |
| `IPV6_MODE` | 是否启用 IPv6 |

## 端口说明

| 端口 | 用途 |
|------|------|
| 6800 | Aria2 RPC |
| 6888 | BT 下载监听（TCP/UDP） |
| 6880 | AriaNg Web UI |

## 使用

1. 启动服务：`docker-compose up -d`
2. 访问 AriaNg：`http://IP:6880`
3. 在 AriaNg 中填写 RPC 地址和密钥即可

::: tip
如需使用 IPv6 网络，可将 `network_mode` 改为 `host`，无需端口映射。
:::

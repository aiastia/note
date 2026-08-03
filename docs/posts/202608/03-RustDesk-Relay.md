---
title: RustDesk 额外 Relay 部署记录：WebSocket 中继无法连接问题排查
date: 2026-08-03
categories:
  - 运维
tags:
  - RustDesk
  - Docker
  - hbbr
  - 中继服务器
  - WebSocket
  - Nginx
---

# RustDesk 多中继服务器部署：hbbr WebSocket 中继无法连接问题排查

## 背景

在部署 RustDesk 自建服务时，常见架构如下：

```text
客户端
   |
   |
   v
+----------------+
| 服务器 A       |
|                |
| hbbs           |  ID Server
| hbbr           |  主 Relay
| OpenResty      |
+----------------+

        |
        |
        v

+----------------+
| 服务器 B       |
|                |
| hbbr           |  额外 Relay
+----------------+
```

服务器 A 运行完整 RustDesk 服务，服务器 B 作为额外中继服务器，用于分担远程连接流量。

实际部署过程中发现：

* 使用服务器 A 的 Relay 正常连接
* 使用服务器 B 的 Relay 时，客户端提示：

```
无法连接到中继服务器
```

但是服务器 B 的 hbbr 日志显示：

```
Listening on tcp :21117
Listening on websocket :21119

New relay request xxxx
```

看起来 hbbr 已经正常运行，但客户端仍然无法建立中继连接。

---

# 问题定位

RustDesk Relay（hbbr）支持两种连接方式：

| 类型              | 端口    | 说明           |
| --------------- | ----- | ------------ |
| TCP Relay       | 21117 | 默认中继协议       |
| WebSocket Relay | 21119 | WebSocket 中继 |

查看 hbbr 日志：

```
Listening on tcp :21117
Listening on websocket :21119
```

说明 hbbr 同时监听：

```
TCP 21117
WebSocket 21119
```

---

## TCP Relay 正常

直接连接：

```
relay.example.com:21117
```

可以正常使用。

说明：

* hbbr 服务正常
* 密钥正常
* 网络连通正常

---

## WebSocket Relay 失败

使用：

```
wss://relay.example.com
```

连接失败。

原因：

服务器 B 只有 hbbr：

```
客户端
 |
 |
21119
 |
 |
hbbr
```

但是没有 WebSocket 反向代理。

---

# 为什么需要 Nginx/OpenResty？

生产环境通常不会直接暴露 hbbr 的 21119 端口。

推荐结构：

```
客户端
    |
    | wss://relay.example.com
    |
    v

 OpenResty / Nginx
    |
    | ws://127.0.0.1:21119
    |
    v

 hbbr
```

Nginx 负责：

* HTTPS/WSS 加密
* WebSocket Upgrade 转发
* 域名管理
* 统一入口

---

# WebSocket 反向代理配置

服务器 B 安装 Nginx 或 OpenResty。

示例：

```nginx
location = /ws/relay {
    proxy_pass http://127.0.0.1:21119; 
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
}
```

---

# hbbr Docker 配置

服务器 B：

```yaml
services:
  hbbr:
    image: rustdesk/rustdesk-server:latest
    command: hbbr
    volumes:
      - ./data:/data
    working_dir: /data
    ports:
      - "21117:21117"
      - "21119:21119"
```

---

# 验证方法

## 查看 hbbr 是否监听

```bash
ss -lntp | grep 211
```

应该看到：

```
:21117
:21119
```

---

## 测试 WebSocket

检查 Nginx：

```bash
curl -i \
-H "Connection: Upgrade" \
-H "Upgrade: websocket" \
https://relay.example.com
```

如果配置正确，会进入 WebSocket 握手流程。

---

## 查看 hbbr 日志

正常连接：

```
New relay request xxxx

Relayrequest xxxx got paired

Relay xxxx closed
```

关键：

```
got paired
```

表示两个客户端已经成功通过 Relay 建立连接。

---

# 最终架构推荐

生产环境：

```
                 客户端
                    |
        +-----------+-----------+
        |                       |
       TCP                     WSS
      21117                    443
        |                       |
        |                 Nginx/OpenResty
        |                       |
        +-----------+-----------+
                    |
                   hbbr
```

优势：

* TCP Relay 性能最高
* WSS 兼容性最好
* 可以隐藏 21119
* 可以统一使用 HTTPS 证书
* 方便多 Relay 扩展


# 总结

这次问题的根因：

> hbbr 本身运行正常，但服务器 B 没有配置 WebSocket 反向代理，导致客户端通过 WSS 连接 Relay 时失败。

排查重点：

1. hbbr 是否监听 21117/21119
2. TCP Relay 是否正常
3. WebSocket 是否经过 Nginx/OpenResty 转发
4. Nginx 是否配置 Upgrade 头
5. Cloudflare 等代理是否开启 WebSocket 支持

RustDesk 多服务器部署时，额外 Relay 不需要连接 API，也不会主动注册，只需要：

* 使用相同密钥
* 开放 Relay 端口
* 正确配置 TCP/WebSocket 入口

即可作为独立中继节点运行。

```
 networks:
   rustdesk-net:
     external: false
 services:
   rustdesk:
     ports:
       - 21114:21114
       - 21115:21115
       - 21116:21116
       - 21116:21116/udp
       - 21117:21117
       - 21118:21118
       - 21119:21119
     image: lejianwen/rustdesk-server-s6:latest
     environment:
       - RELAY=rustdesk.123.xyz:21117,relay.123.xyz:21117
       - ENCRYPTED_ONLY=1
       - MUST_LOGIN=N #是否必须登录
       - TZ=Asia/Shanghai
       - RUSTDESK_API_RUSTDESK_ID_SERVER=rustdesk.123.xyz:21116
       - RUSTDESK_API_RUSTDESK_RELAY_SERVER=rustdesk.123.xyz:21117,relay.123.xyz:2117
       - RUSTDESK_API_RUSTDESK_API_SERVER=http://rustdesk.123.xyz
       - RUSTDESK_API_RUSTDESK_KEY_FILE=/data/id_ed25519.pub
       - RUSTDESK_API_JWT_KEY=***** # jwt key
       - SINGLE_BANDWIDTH=1024
       - TOTAL_BANDWIDTH=2048
       - LIMIT_SPEED=2048
     volumes:
       - ./data/rustdesk/server:/data  #将server的key挂载出来
       - ./data/rustdesk/api:/app/data #将数据库挂载
     networks:
       - rustdesk-net
     restart: unless-stopped
```

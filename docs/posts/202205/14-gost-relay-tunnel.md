---
title: GOST 网络转发与隧道配置
date: 2022-05-14
categories:
  - 网络工具
tags:
  - gost
  - 转发
  - 隧道
  - WSS
  - 中转
---

# GOST 网络转发与隧道配置

GOST 是一个 Go 语言编写的高性能隧道/转发工具，支持多种协议（TCP、UDP、WSS、Relay 等），常用于内网穿透、流量中转和端口转发。

## 基本端口转发

### 中转机

将本机端口通过 WSS 隧道转发到落地机：

```bash
docker run -d --net=host --restart=always --name relay \
  ginuerzh/gost -L="tcp://:中转端口" -F="relay+wss://落地IP:落地端口"
```

### 落地机

监听 WSS 隧道并转发到本地目标端口：

```bash
docker run -d --net=host --restart=always --name gost-land \
  ginuerzh/gost -L="relay+wss://:落地端口/:本地目标端口"
```

## RTCP 转发

反向 TCP 连接，落地机主动连接中转机：

```bash
# 中转机
docker run -d --net=host --restart=always --name rtcp \
  ginuerzh/gost -L="rtcp://:中转端口/落地域名:落地目标端口"

# 落地机
docker run -d --net=host --restart=always --name rtcp-client \
  ginuerzh/gost -L="rtcp://:本地端口/中转域名:中转端口"
```

## Relay 转发（TCP + UDP）

Relay 转发支持同时转发 TCP 和 UDP 数据，有两种模式。

### 模式一：配合端口转发

```bash
# 服务端
gost -L relay://:12345

# 客户端
gost -L udp://:1053/:53 -L tcp://:1053/:53 -F relay://:12345
```

### 模式二：配合转发隧道

```bash
# 服务端
gost -L relay://:12345/:53

# 客户端
gost -L udp://:1053 -L tcp://:1053 -F relay://:12345
```

## WSS 隧道（带 TLS 证书）

使用自定义 TLS 证书建立加密隧道：

### 落地机

```bash
docker run -d \
  -v /path/to/cert/:/1/ \
  --net=host --restart=always --name gost-tls \
  ginuerzh/gost -L="relay+wss://:端口/:目标端口?cert=/1/cert.pem&key=/1/key.pem"
```

### 中转机

```bash
docker run -d \
  -v /path/to/cert/:/1/ \
  --net=host --restart=always --name relay-tls \
  ginuerzh/gost -L="tcp://:本地端口" -F="relay+wss://落地IP:端口?cert=/1/cert.pem&key=/1/key.pem"
```

## 参数说明

| 参数 | 说明 |
|------|------|
| `--net=host` | 使用宿主机网络 |
| `--restart=always` | 自动重启 |
| `-L` | 监听规则（Listen） |
| `-F` | 转发规则（Forward） |
| `tcp://` | TCP 协议 |
| `udp://` | UDP 协议 |
| `wss://` | WebSocket Secure |
| `relay://` | Relay 转发协议 |
| `rtcp://` | 反向 TCP |
| `?cert=...&key=...` | TLS 证书参数 |

## 使用建议

- 生产环境建议使用 WSS + TLS 加密隧道
- 注意防火墙放行对应端口
- `--net=host` 模式下容器直接使用宿主机网络，无需 `-p` 映射端口

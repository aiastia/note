---
title: 1Panel openresty反向代理
date: 2026-04-17
categories:
  - 运维
tags:
  - openresty
  - 反向代理
  - WebSocket
  - 1Panel
---

# 1Panel openresty 反向代理 WebSocket 配置

在使用 1Panel 管理 反向代理时，如果后端服务使用了 WebSocket（如在线终端、实时推送等），需要额外配置才能正常转发 WebSocket 连接。本文记录一套完整的配置方案。

---

## 场景说明

- 前端静态文件由 openresty 直接托管
- 后端 API / WebSocket 服务运行在 `127.0.0.1:8080`
- 需要通过同一个域名同时提供静态页面和 WebSocket 服务
- 域名：`www.example.com邮箱`

---

## 完整配置

```nginx
# 根路径统一处理
location / {
    # WebSocket 握手 => 内部转到 /ws/xx，再删掉 /ws
    if ($http_upgrade = "websocket") {
        rewrite ^ /ws$uri? last;
    }

    # 静态文件
    root /www/sites/www.example.com/index;
    try_files /index.html =404;

    add_header Strict-Transport-Security "max-age=31536000";
    add_header Alt-Svc 'h3=":443"; ma=2592000';
    add_header Cache-Control no-cache;
}

# WebSocket 专用 location，会把 /ws 去掉再转发
location /ws/ {
    proxy_pass http://127.0.0.1:8080/;
    proxy_http_version 1.1;
    proxy_set_header Host www.example.com;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection "upgrade";
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
}
```

---

## 配置解析

### 根路径 `location /`

| 指令 | 作用 |
|------|------|
| `if ($http_upgrade = "websocket")` | 检测到 WebSocket 升级请求时，内部重写到 `/ws` 前缀路径 |
| `rewrite ^ /ws$uri? last` | 将原始 URI 加上 `/ws` 前缀，`last` 表示内部重定向继续匹配其他 location |
| `root` | 静态文件目录 |
| `try_files /index.html =404` | SPA 应用常用，所有路径回退到 index.html |
| `Strict-Transport-Security` | 强制 HTTPS，有效期 1 年 |
| `Alt-Svc` | 宣告支持 HTTP/3 |
| `Cache-Control no-cache` | 禁止缓存，适合频繁更新的页面 |

### WebSocket `location /ws/`

| 指令 | 作用 |
|------|------|
| `proxy_pass http://127.0.0.1:8080/` | 转发到后端服务，末尾的 `/` 会自动去掉 `/ws` 前缀 |
| `proxy_http_version 1.1` | WebSocket 必须使用 HTTP/1.1 |
| `Upgrade` / `Connection` | WebSocket 握手必需的请求头 |
| `X-Real-IP` / `X-Forwarded-For` | 传递客户端真实 IP |
| `X-Forwarded-Proto` | 传递原始协议（http/https） |

---

## 请求流程

```
客户端请求 wss://www.example.com
        │
        ▼
  openresty location /
  检测到 Upgrade: websocket
        │
        ▼ rewrite → /ws/xxx
  openresty location /ws/
        │
        ▼ proxy_pass → http://127.0.0.1:8080/xxx
  后端服务处理 WebSocket 连接
```

::: tip 关键点
- `rewrite` 的 `last` 参数让请求重新走 location 匹配，不会直接返回
- `proxy_pass` 末尾的 `/` 会将 `/ws/xxx` 映射为 `/xxx`，自动去掉前缀
- `proxy_http_version 1.1` 是 WebSocket 代理的必要条件
:::

---

## 1Panel 中的操作步骤

1. 进入 1Panel 面板 → **网站** → 选择对应站点
2. 点击 **配置** → **反向代理** 或直接编辑 openresty 配置
3. 将上述配置粘贴到 `server` 块中
4. 保存并重载 openresty

```bash
# 验证配置语法
openresty -t

# 重载配置
openresty -s reload
```

---

## 常见问题

### WebSocket 连接立即断开

- 检查 `proxy_http_version 1.1` 是否配置
- 检查 `Upgrade` 和 `Connection` 请求头是否正确设置

### 404 或路径错误

- 确认 `proxy_pass` 末尾有 `/`，这样才会去掉 `/ws` 前缀
- 检查后端服务的路由是否匹配转发后的路径

### 502 Bad Gateway

- 确认后端服务 `127.0.0.1:8080` 正在运行
- 检查防火墙是否允许本地回环连接

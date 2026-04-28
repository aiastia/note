---
title: Cloudflare Worker 反向代理 AI API
date: 2026-04-28
categories:
  - Cloudflare
tags:
  - Worker
  - API
  - 代理
---

## 前言

有些 AI 服务的 API 在国内访问不稳定，或者需要隐藏真实 IP。可以用 Cloudflare Worker 做一个简单的反向代理，把请求转发到目标 API。

## Worker 代码

```js
addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
  // 目标 API 地址
  const apiBase = 'https://api.example.com';

  const userUrl = new URL(request.url);
  const targetUrl = new URL(userUrl.pathname + userUrl.search, apiBase);

  // 复制请求头，删除 IP 相关头
  const headers = new Headers(request.headers);
  headers.delete('X-Forwarded-For');
  headers.delete('CF-Connecting-IP');
  headers.delete('Forwarded');
  headers.delete('X-Real-IP');
  headers.set('User-Agent', 'CF-Worker-Proxy/1.0');

  const newRequest = new Request(targetUrl.toString(), {
    method: request.method,
    headers: headers,
    body: request.body,
    redirect: 'follow'
  });

  try {
    const response = await fetch(newRequest);
    const responseHeaders = new Headers(response.headers);
    responseHeaders.set('Access-Control-Allow-Origin', '*');

    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: responseHeaders
    });
  } catch (error) {
    return new Response('Proxy Error: ' + error.message, { status: 500 });
  }
}
```

## 实现原理

1. **接收请求** — Worker 监听 `fetch` 事件，接收客户端发来的请求
2. **清理 Headers** — 删除 `X-Forwarded-For`、`CF-Connecting-IP` 等可能暴露真实 IP 的请求头
3. **转发请求** — 将路径和参数拼接到目标 API 地址，保持原请求方法和请求体
4. **返回响应** — 透传上游的响应状态和内容，添加 CORS 头支持跨域访问

## 使用方式

1. 登录 [Cloudflare Dashboard](https://dash.cloudflare.com)，进入 Workers & Pages
2. 创建新 Worker，粘贴上面的代码
3. 将 `apiBase` 改成你的目标 API 地址
4. 部署后得到一个 `xxx.workers.dev` 域名
5. 客户端将 API 地址指向 Worker 域名即可

## 使用示例

部署完成后，原来的请求：

```bash
curl https://api.example.com/v1/chat/completions \
  -H "Authorization: Bearer YOUR_KEY" \
  -d '{"model":"xxx","messages":[...]}'
```

改为：

```bash
curl https://your-worker.workers.dev/v1/chat/completions \
  -H "Authorization: Bearer YOUR_KEY" \
  -d '{"model":"xxx","messages":[...]}'
```

其他完全不变，Worker 只是做了一个透明转发。

## 场景二：多源站负载均衡代理

如果你的源站有多台服务器，可以用 Worker 做简单的负载均衡，随机将请求转发到不同的后端：

```js
const servers = [
  "192.0.2.1",
  "192.0.2.2",
  "192.0.2.3"
];

addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
  const server = servers[Math.floor(Math.random() * servers.length)];
  const newRequest = new Request(request);
  // 设置目标站点的 Host，让源站正确识别虚拟主机
  newRequest.headers.set('Host', 'example.com');
  // 传递客户端真实 IP
  newRequest.headers.set('X-Forwarded-For', request.headers.get('cf-connecting-ip'));
  newRequest.headers.set('X-Real-IP', request.headers.get('cf-connecting-ip'));
  const url = new URL(request.url);
  url.protocol = 'http:';
  url.host = server;
  newRequest.url = url.toString();
  return fetch(newRequest);
}
```

### 和场景一的区别

| | 场景一：API 代理 | 场景二：负载均衡 |
|--|--|--|
| 目标 | 转发到外部 API | 转发到自己的多台服务器 |
| IP 处理 | 隐藏客户端 IP | 传递客户端真实 IP |
| Host 头 | 不需要修改 | 需要设置为目标域名 |
| 协议 | 保持 HTTPS | 可改为 HTTP（内网通信） |
| 请求头 | 清理隐私头 | 保留原始请求头 |

## 可选增强

- **限制访问**：在 Worker 里检查 `Authorization` 或 `Referer`，防止被他人滥用
- **自定义域名**：在 CF 里给 Worker 绑定自己的域名
- **缓存**：对相同请求启用 `cache` API，减少重复调用
- **权重负载**：不用 `Math.random()`，按权重分配到不同后端
- **健康检查**：检测后端是否可用，自动剔除故障节点

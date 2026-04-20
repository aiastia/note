---
title: dig 命令使用指南
date: 2026-04-20
categories:
  - 工具使用
tags:
  - Linux
  - DNS
  - dig
  - 网络工具
---

# dig 命令使用指南

`dig`（Domain Information Groper）是一个强大的 DNS 查询工具，用于查询 DNS 名称服务器。它预装在大多数 Linux 和 macOS 系统中。

## 基本用法

### 查询域名

最简单的用法，直接查询域名的 DNS 记录：

```bash
dig google.com
```

### 指定 DNS 服务器

使用 `@` 符号指定要查询的 DNS 服务器：

```bash
dig @1.1.1.1 google.com
```

上面的命令使用 Cloudflare 的 DNS 服务器（1.1.1.1）来查询 google.com 的记录。

其他常用的公共 DNS 服务器：

| 服务商 | IPv4 地址 |
|--------|-----------|
| Cloudflare | 1.1.1.1 / 1.0.0.1 |
| Google | 8.8.8.8 / 8.8.4.4 |
| 阿里 DNS | 223.5.5.5 / 223.6.6.6 |
| 腾讯 DNS | 119.29.29.29 |

### 指定端口查询

默认情况下 dig 使用 53 端口进行 DNS 查询。如果 DNS 服务器运行在非标准端口上，使用 `-p` 参数指定端口：

```bash
dig @8.8.8.8 -p 5353 google.com
```

::: warning 注意
`dig` 不支持使用 `@服务器:端口` 的语法来指定端口，必须使用 `-p` 参数。
:::

## 常用参数

### 指定记录类型

```bash
# 查询 A 记录（默认）
dig google.com A

# 查询 AAAA 记录（IPv6）
dig google.com AAAA

# 查询 MX 记录（邮件交换）
dig google.com MX

# 查询 NS 记录（名称服务器）
dig google.com NS

# 查询 TXT 记录
dig google.com TXT

# 查询 CNAME 记录
dig www.google.com CNAME

# 查询 SOA 记录
dig google.com SOA
```

### 简洁输出

使用 `+short` 参数只显示查询结果：

```bash
dig +short google.com
# 输出：142.250.189.238
```

### 显示 DNS 解析过程

使用 `+trace` 参数跟踪 DNS 解析的完整路径：

```bash
dig +trace google.com
```

### 反向 DNS 查询

使用 `-x` 参数进行反向解析（IP → 域名）：

```bash
dig -x 8.8.8.8
```

### 指定查询类型（ANY）

```bash
dig google.com ANY
```

::: tip 提示
由于 DNS 协议的发展，很多 DNS 服务器已经不再响应 ANY 类型的查询，建议按需查询具体记录类型。
:::

### 使用 TCP 协议

默认 dig 使用 UDP 协议，使用 `+tcp` 强制使用 TCP：

```bash
dig +tcp google.com
```

### 设置超时时间

```bash
dig +timeout=5 google.com
```

### 指定重试次数

```bash
dig +tries=3 google.com
```

## 输出结果解读

```bash
dig google.com
```

输出示例：

```
; <<>> DiG 9.10.6 <<>> google.com
;; global options: +cmd
;; Got answer:
;; ->>HEADER<<- opcode: QUERY, status: NOERROR, id: 12345
;; flags: qr rd ra; QUERY: 1, ANSWER: 1, AUTHORITY: 0, ADDITIONAL: 1

;; QUESTION SECTION:
;google.com.            IN  A

;; ANSWER SECTION:
google.com.     300     IN  A   142.250.189.238

;; Query time: 15 msec
;; SERVER: 1.1.1.1#53(1.1.1.1)
;; WHEN: Sun Apr 20 10:00:00 CST 2026
;; MSG SIZE  rcvd: 60
```

关键字段说明：

| 字段 | 说明 |
|------|------|
| `status: NOERROR` | 查询成功 |
| `status: NXDOMAIN` | 域名不存在 |
| `status: SERVFAIL` | 服务器返回错误 |
| `ANSWER SECTION` | 查询到的 DNS 记录 |
| `300` | TTL（缓存时间，单位秒） |
| `IN A` | 记录类型为 A 记录 |
| `Query time` | 查询耗时 |

## 实用示例

### 批量查询多个域名

```bash
for domain in google.com github.com baidu.com; do
  echo "=== $domain ==="
  dig +short $domain
done
```

### 测试 DNS 服务器的响应速度

```bash
dig @1.1.1.1 google.com | grep "Query time"
dig @8.8.8.8 google.com | grep "Query time"
```

### 检查域名是否生效

```bash
dig +short your-new-domain.com
```

## 相关命令

- `nslookup` - 较老的 DNS 查询工具
- `host` - 简化的 DNS 查询工具
- `whois` - 查询域名注册信息
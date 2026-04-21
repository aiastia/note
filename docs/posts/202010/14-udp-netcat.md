---
title: UDP 通信与 Netcat 使用
date: 2020-10-14
categories:
  - 网络工具
tags:
  - udp
  - netcat
  - nc
  - 网络工具
---

# UDP 通信与 Netcat 使用

## 服务端监听

```bash
nc -l -u 192.168.80.129 8001
```

或者指定监听端口：

```bash
nc -ulp 8888
```

## 客户端连接

```bash
nc -u 192.168.80.129 8001
```

连接后输入字符串，服务端会回显相同的内容，用于验证 UDP 端口是否正常工作。

如果指定端口连接：

```bash
nc -u <服务器IP> 8888
```

## 探测 UDP 端口

使用 `-vuz` 参数探测 UDP 端口是否开放：

```bash
nc -vuz 112.91.151.10 4500
```

如果端口开放，会显示：

```
[112.91.151.10] 500 (isakmp) open
```

## 参数说明

| 参数 | 说明 |
|------|------|
| `-u` | 使用 UDP 协议 |
| `-l` | 监听模式 |
| `-p` | 指定本地端口 |
| `-v` | 显示详细信息 |
| `-z` | 扫描模式，不发送数据 |

## 相关工具

- [NatTypeTester](https://github.com/HMBSbige/NatTypeTester) — NAT 类型测试工具
- [netch](https://github.com/netchx/netch) — 网络代理工具
- [netcat 下载](https://eternallybored.org/misc/netcat/) — Windows 版 netcat

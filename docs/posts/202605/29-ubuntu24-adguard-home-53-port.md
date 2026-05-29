---
title: Ubuntu 24 解决 AdGuard Home 53 端口被占用问题
date: 2026-05-29
categories:
  - 技术文档
  - Linux
  - AdGuard Home
tags:
  - Ubuntu
  - AdGuard Home
  - systemd-resolved
  - DNS
  - 端口冲突
---

# Ubuntu 24 解决 AdGuard Home 53 端口被占用问题

Ubuntu 24 默认启用了 `systemd-resolved`，它会占用 53 端口作为 DNS Stub Listener，导致 AdGuard Home 无法绑定 DNS 端口。

最常见的报错：

```
listen tcp 0.0.0.0:53: bind: address already in use
```

或者：

```
bind: address already in use
```

本质上是 `systemd-resolved` 抢占了 `127.0.0.53:53`。

## 确认是谁占用了 53 端口

```bash
sudo ss -tulnp | grep :53
```

如果看到 `systemd-resolved`，说明就是它在捣鬼。

## 推荐方案：禁用 DNS Stub Listener（Ubuntu 24 最稳定）

### 第一步：编辑 resolved.conf

```bash
sudo nano /etc/systemd/resolved.conf
```

找到 `#DNSStubListener=yes`，修改为：

```ini
[Resolve]
DNS=1.1.1.1
DNSStubListener=no
```

- `DNSStubListener=no`：关闭 53 端口监听，释放给 AdGuard Home
- `DNS=1.1.1.1`：设置一个备用上游 DNS，确保系统自身解析不受影响

### 第二步：重建 resolv.conf

这是 Ubuntu 24 **非常关键**的一步。

先删除原来的软链接：

```bash
sudo rm /etc/resolv.conf
```

然后指向 systemd-resolved 生成的真实配置：

```bash
sudo ln -s /run/systemd/resolve/resolv.conf /etc/resolv.conf
```

### 第三步：重启 systemd-resolved

```bash
sudo systemctl restart systemd-resolved
```

### 第四步：确认 53 端口已释放

```bash
sudo ss -tulnp | grep :53
```

正常情况下不应该再看到 `127.0.0.53:53`。

### 第五步：启动 AdGuard Home

Docker 部署：

```bash
docker compose up -d
```

原生安装：

```bash
sudo ./AdGuardHome -s start
```

## Docker 部署注意事项

如果你用 Docker 部署 AdGuard Home，端口映射必须是真正的 53：

```yaml
ports:
  - "53:53/tcp"
  - "53:53/udp"
```

**不要改成 `5353:53`**——大多数设备（路由器、手机等）无法指定 DNS 端口，改了之后 DNS 查询会完全失效。

## 备选方案：直接禁用 systemd-resolved

```bash
sudo systemctl disable systemd-resolved
sudo systemctl stop systemd-resolved
```

这种方式更暴力，但 Ubuntu 24 有时会导致系统自身的 DNS 解析失效，因此**更推荐上面的 `DNSStubListener=no` 方案**。

## 总结

| 方案 | 推荐度 | 风险 |
|------|--------|------|
| `DNSStubListener=no` + 重建 resolv.conf | ⭐⭐⭐⭐⭐ | 低，系统 DNS 不受影响 |
| 直接禁用 systemd-resolved | ⭐⭐ | 高，可能导致系统 DNS 失效 |

核心思路就是：**让 systemd-resolved 别监听 53 端口，把位置让给 AdGuard Home**。

## 参考

- [Einverne - AdGuard Home 53 端口与 systemd-resolved 冲突解决](https://blog.einverne.info/post/2024/01/adguard-home-53-port-systemd-resolve.html)
- [Localtonet - How to Self-Host AdGuard Home](https://localtonet.com/blog/how-to-self-host-adguard-home)
- [RamNode - AdGuard Home Guide](https://ramnode.com/guides/adguard-home)

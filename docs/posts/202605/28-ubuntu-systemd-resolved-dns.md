---
title: Ubuntu systemd-resolved 配置自定义 DNS
date: 2026-05-28
tags:
  - Ubuntu
  - DNS
  - systemd-resolved
---

# Ubuntu systemd-resolved 配置自定义 DNS

Ubuntu 22.04+ 默认使用 `systemd-resolved` 管理 DNS，直接改 `/etc/resolv.conf` 会被覆盖。正确做法是通过 drop-in 配置文件。

## 设置 DNS（永久生效）

创建配置目录：

```bash
sudo mkdir -p /etc/systemd/resolved.conf.d
```

直接写入配置：

```bash
echo -e "[Resolve]\nDNS=1.1.1.1 8.8.8.8\nFallbackDNS=9.9.9.9" | sudo tee /etc/systemd/resolved.conf.d/dns.conf
```

重启服务：

```bash
sudo systemctl restart systemd-resolved
```

查看是否成功：

```bash
resolvectl status
```

你应该会看到：

```
DNS Servers: 1.1.1.1 8.8.8.8
```

## 国内 DNS 配置

如果想用国内 DNS：

```bash
echo -e "[Resolve]\nDNS=223.5.5.5 119.29.29.29\nFallbackDNS=1.1.1.1" | sudo tee /etc/systemd/resolved.conf.d/dns.conf
```

常见国内公共 DNS：

| 服务商 | DNS 地址 |
|--------|----------|
| 阿里 DNS | `223.5.5.5` / `223.6.6.6` |
| 腾讯 DNSPod | `119.29.29.29` / `119.28.28.28` |
| 字节跳动 | `180.184.1.1` / `180.184.2.2` |

## 恢复默认

删除配置文件即可恢复 DHCP 下发的 DNS：

```bash
sudo rm /etc/systemd/resolved.conf.d/dns.conf
sudo systemctl restart systemd-resolved
```

## 为什么不直接改 /etc/resolv.conf？

`/etc/resolved` 是 `systemd-resolved` 的软链接，重启或网络变化后会被覆盖。通过 drop-in 配置文件的方式才是持久化的正确做法。

---

**参考链接：**
- [systemd-resolved 官方文档](https://www.freedesktop.org/software/systemd/man/systemd-resolved.service.html)
- [Ubuntu DNS 配置指南](https://ubuntu.com/server/docs/network-configuration)

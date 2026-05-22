---
title: Ubuntu Netplan 静态 IP 配置指南（含 IPv6）
date: 2026-05-22
tags:
  - Ubuntu
  - Netplan
  - 网络
  - IPv6
---

# Ubuntu Netplan 静态 IP 配置指南（含 IPv6）

Netplan 是 Ubuntu 18.04+ 的默认网络配置工具，配置文件放在 `/etc/netplan/` 目录下，YAML 格式。

> ⚠️ 修改前建议备份：`sudo cp /etc/netplan/50-manual-config.yaml{,.bak}`

## 配置文件位置

```bash
/etc/netplan/50-manual-config.yaml
```

文件名不固定，`/etc/netplan/` 下的 `.yaml` 文件都会被读取，按字母顺序合并。

## 完整模板（IPv4 + IPv6）

```yaml
network:
  version: 2
  renderer: networkd          # 桌面版用 NetworkManager，服务器用 networkd
  ethernets:
    eth0:                     # 网卡名，用 `ip a` 查看，可能是 ens3、enp1s0 等
      dhcp4: false
      dhcp6: false

      # ---- IPv4 ----
      addresses:
        - 192.168.1.100/24
      routes:
        - to: default
          via: 192.168.1.1
      nameservers:
        addresses:
          - 8.8.8.8
          - 1.1.1.1
        search:
          - localdomain

      # ---- IPv6 ----
      # addresses 里直接追加 IPv6 地址即可
      # 例如下面是 /128 单地址 + /64 子网两种常见写法：
      # addresses 里可混合写 IPv4 和 IPv6：
      # addresses:
      #   - 192.168.1.100/24
      #   - "2001:db8:1234::100/128"
      #   - "2001:db8:1234::/64"        # 如果你有整个 /64 段

      # IPv6 默认路由（网关用 link-local 或全局地址）
      # routes:
      #   - to: "::/0"
      #     via: "fe80::1"              # VPS 常见：用 link-local 网关

      # IPv6 DNS
      # nameservers:
      #   addresses:
      #     - "2001:4860:4860::8888"
      #     - "2606:4700:4700::1111"
```

## 合并写法（更常用）

实际中 IPv4 和 IPv6 写在同一个 addresses 列表里：

```yaml
network:
  version: 2
  renderer: networkd
  ethernets:
    eth0:
      dhcp4: false
      dhcp6: false
      addresses:
        - 192.168.1.100/24
        - "2001:db8:1234::100/128"
      routes:
        - to: default
          via: 192.168.1.1
        - to: "::/0"
          via: "fe80::1"
      nameservers:
        addresses:
          - 8.8.8.8
          - 1.1.1.1
          - "2001:4860:4860::8888"
          - "2606:4700:4700::1111"
```

## VPS 常见场景（Hetzner/Vultr 等）

```yaml
network:
  version: 2
  renderer: networkd
  ethernets:
    ens3:
      dhcp4: false
      dhcp6: false
      addresses:
        - "203.0.113.50/24"
        - "2001:db8:abcd::1/64"
      routes:
        - to: default
          via: "203.0.113.1"
        - to: "::/0"
          via: "fe80::1"
      nameservers:
        addresses:
          - 8.8.8.8
          - "2001:4860:4860::8888"
```

## 只用 DHCP（最简单）

```yaml
network:
  version: 2
  renderer: networkd
  ethernets:
    eth0:
      dhcp4: true
      dhcp6: true
```

## IPv6 只开 SLAAC（自动获取）

```yaml
network:
  version: 2
  renderer: networkd
  ethernets:
    eth0:
      dhcp4: false
      addresses:
        - 192.168.1.100/24
      routes:
        - to: default
          via: 192.168.1.1
      ipv6-accept-ra: true      # 接受路由通告，自动配置 IPv6
      nameservers:
        addresses:
          - 8.8.8.8
          - "2001:4860:4860::8888"
```

## 应用配置

```bash
# 验证语法（不会真正生效）
sudo netplan try

# 直接应用
sudo netplan apply

# debug 模式（排错用）
sudo netplan --debug apply
```

> `netplan try` 会在 120 秒后自动回滚，防止把自己踢下线。**远程操作强烈建议用它。**

## 常见问题

### 1. 网卡名不知道是什么

```bash
ip a
# 或
ls /sys/class/net/
```

### 2. IPv6 不通

```bash
# 检查地址是否生效
ip -6 addr show eth0

# 测试连通性
ping6 google.com

# 查看路由
ip -6 route show
```

### 3. YAML 缩进报错

Netplan 对缩进**非常敏感**，必须用空格（不能用 Tab）。可以用 `netplan generate` 先检查语法。

### 4. 多个 IP / 段

```yaml
addresses:
  - 192.168.1.100/24
  - 192.168.1.101/32        # 额外 IP
  - "2001:db8::100/128"
```

---

**参考链接：**
- [Netplan 官方文档](https://netplan.io/reference)
- [Ubuntu 网络配置](https://ubuntu.com/server/docs/network-configuration)

---
title: OpenWrt 实用配置与运维总结
date: 2026-04-18
coverImg: /covers/openwrt.jpg
sticky: 999
top: true
titleTag: 推荐
categories:
  - 网络运维
tags:
  - OpenWrt
  - 路由器
  - DNS
  - iptables
  - dnsmasq
  - 运维
---

# OpenWrt 实用配置与运维总结（长期更新）

整理了一些在使用 OpenWrt 过程中积累的常用命令、网络调优、DNS 玩法以及开机启动技巧，适合日常运维和折腾参考。

::: tip 适用场景
- 软路由 / x86 OpenWrt
- 家用网络优化
- DNS 分流 / 抗污染
:::

---

## 旁路由无法上网解决方案

旁路由模式下设备无法上网时，开启 **动态伪装** 即可解决。

![动态伪装设置](https://user-images.githubusercontent.com/19776350/152678245-61006ccf-04c9-424b-8503-70d7f2bc92a4.png)

### MTU 设置

旁路由 MTU 建议设置为 `1452`。

### iKuai 端 MTU 设置

路径：安全设置 > 高级设置

- TCP 最大报文长度：启用
- TCP-MSS 值：`1452` 字节（范围 1000-1500，长度需为 4 的整数倍）

### Nginx 端口修改

`/etc/nginx/uci.conf` 是自动生成的文件，修改 Nginx 端口需要在以下位置进行：

```
/etc/config/nginx
```

修改后重载：

```bash
service nginx reload
```

参考资料：
- [旁路由相关问题讨论](https://github.com/kiddin9/OpenWrt_x86-r2s-r4s-r5s-N1/issues/490)

---

## 一、基础软件包管理（opkg）

### 常用命令

```bash
opkg update                # 更新软件源
opkg install <pkg>         # 安装软件
opkg remove <pkg>          # 删除软件
```

### 安装本地 / 远程包

```bash
opkg install /tmp/xxx.ipk
opkg install /tmp/*.ipk
opkg install <url>
```

### 常见问题：锁文件冲突

```bash
rm -f /var/lock/opkg.lock
opkg update
```

### 架构不匹配问题

```bash
cat /proc/cpuinfo
```

::: tip 安装失败大多数是
* 架构不对
* 依赖缺失
* 源版本不一致
:::

---

## 二、Speedtest 测速工具

### 安装

```bash
opkg update && opkg install python3-pip
pip install speedtest_cli
```

### 使用

```bash
speedtest --list | grep -i guangdong
speedtest --share
```

可用于：

* 节点质量检测
* 出口线路评估

---

## 三、网络性能优化（TSO / GSO）

### 查看状态

```bash
ethtool --show-offload eth0
```

### 开启

```bash
ethtool -K eth0 tso on
ethtool -K eth0 gso on
```

### 关闭

```bash
ethtool -K eth0 tso off
ethtool -K eth0 gso off
```

::: warning 注意
* 只开 TSO 没用，必须同时开启 GSO
* 虚拟化环境（ESXi / PVE）建议实际测速验证效果
:::

---

## 四、软件源配置（国内镜像）

### 清华源示例

```bash
src/gz openwrt_core https://mirrors.tuna.tsinghua.edu.cn/openwrt/...
```

### 官方源

```bash
src/gz openwrt_core https://downloads.openwrt.org/...
```

::: tip 建议
* 国内环境优先镜像源
* 必须与当前系统版本完全匹配
:::

---

## 五、防火墙 & NAT 规则

### DNS 劫持（强制走本地 DNS）

```bash
iptables -t nat -A PREROUTING -p udp --dport 53 -j REDIRECT --to-ports 5353
iptables -t nat -A PREROUTING -p tcp --dport 53 -j REDIRECT --to-ports 5353
```

### 指定设备 DNS

```bash
iptables -t nat -A PREROUTING -s 192.168.0.201 -p udp --dport 53 -j DNAT --to 192.168.0.31
```

### NAT 出口

```bash
iptables -t nat -I POSTROUTING -j MASQUERADE
```

使用场景：

* DNS 分流
* 透明代理
* 内网设备控制

::: warning 注意
OpenWrt 22+ 已默认使用 firewall4（nftables），iptables 规则可能需要适配或使用 `nft` 重写。
:::

---

## 六、dnsmasq 高级玩法（流媒体优化）

### 屏蔽 IPv6（Netflix 常见）

```bash
server=/netflix.com/#
address=/netflix.com/::
```

### 指定解析服务器

```bash
[/netflix.com/]tcp://xxx.xxx.xxx.xxx:5353
```

用途：

* 解锁流媒体
* 避免 IPv6 误判
* 精细分流

---

## 七、公共 DNS / DoH

常用公共 DNS：

| 服务商        | IPv4           | DoH 地址                                 |
| ---------- | -------------- | -------------------------------------- |
| Cloudflare | `1.1.1.1`      | `https://cloudflare-dns.com/dns-query` |
| Google     | `8.8.8.8`      | `https://dns.google/dns-query`         |
| 腾讯         | `119.29.29.29` | `https://doh.pub/dns-query`            |
| 阿里         | `223.5.5.5`    | `https://dns.alidns.com/dns-query`     |

::: tip 趋势
明文 DNS 正在逐步被 DoH / DoT 替代，尤其在复杂网络环境中更稳定。
:::

---

## 八、开机启动脚本（重点）

### 常见后台启动方式

```bash
nohup /root/node.sh >/dev/null 2>&1 &
nohup /root/cf.sh >/dev/null 2>&1 &
/root/cfdown.sh >/dev/null 2>&1
```

### 示例：延迟启动服务

```bash
#!/bin/sh
sleep 120s

nohup /root/status-client -dsn wss://xxx -vnstat >/dev/null 2>&1 &
```

关键点：

* `nohup`：防止进程随终端退出
* `sleep`：避免系统未初始化完成
* `&`：后台运行

::: tip 推荐升级写法（更规范）
建议使用 `/etc/init.d/` 或 `procd` 管理服务，支持：
* 开机自启
* 崩溃自动重启
* 依赖管理
:::

---

## 九、常用运维排查命令

### 端口占用

```bash
netstat -ltnp | grep 80
```

### 查进程详情

```bash
ps aux | grep xxx
ls -l /proc/PID
```

### 重启网络

```bash
/etc/init.d/network restart
```

### 挂载为可写

```bash
mount -o remount rw /
```

### 查看系统信息

```bash
uname -a
cat /etc/openwrt_release
df -h
free -m
```

### 查看网络接口（推荐用 ip）

```bash
ip addr show
ip route show
```

---

## 十、DNS 分流规则（流媒体合集）

整理了一整套常见流媒体域名（Netflix / Disney+ / HBO / DMM / Abema 等），用于：

* DNS 分流
* 解锁策略
* 策略路由匹配

### 示例规则

```bash
# Netflix
server=/netflix.com/#
server=/netflix.net/#

# Disney+
server=/disneyplus.com/#

# HBO
server=/hbomax.com/#

# DMM
server=/dmm.com/#

# Abema
server=/abema.tv/#
```

::: tip 建议
* 使用规则仓库（如 geosite）
* 配合 smartdns / mosdns 自动更新
:::

---

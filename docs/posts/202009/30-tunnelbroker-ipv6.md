---
title: Tunnelbroker IPv6 教程
date: 2020-09-30
categories:
  - 网络运维
tags:
  - ipv6
  - tunnelbroker
  - 阿里云
  - he
---

# Tunnelbroker IPv6 教程

通过 [Tunnelbroker](https://www.tunnelbroker.net/) 为不支持 IPv6 的服务器（如阿里云）配置 IPv6 隧道。

## 一、启用 IPv6

阿里云等云服务器默认禁用 IPv6，需要手动开启：

编辑 `/etc/sysctl.conf`，将以下三项修改为 `0`：

```bash
net.ipv6.conf.all.disable_ipv6 = 0
net.ipv6.conf.default.disable_ipv6 = 0
net.ipv6.conf.lo.disable_ipv6 = 0
```

## 二、添加 IPv6 DNS

编辑 `/etc/resolvconf/resolv.conf.d/base`，添加：

```
nameserver 2001:4860:4860::8844
nameserver 2001:470:20::2
```

保存后执行：

```bash
resolvconf -u
```

## 三、配置网络接口

编辑网络接口文件：

```bash
vi /etc/network/interfaces
```

在 Tunnelbroker 获取隧道信息后，添加 `he-ipv6` 接口配置。

## 四、启动隧道

```bash
ifup he-ipv6
```

## 五、重启网络模块

```bash
/etc/init.d/network restart
```

## 六、验证

执行 `ifconfig`，应能看到 `he-ipv6` 网卡。

测试 IPv6 连通性：

```bash
ping6 -c 5 2001:4860:4860::8888
ping6 -c 5 ipv6.google.com
```

Ping 通表示网络已连通，能正常解析域名说明 DNS 也正常。

## IPv6 测试工具

- <https://ipv6-test.com/>
- <https://ipv6test.google.com/>
- <http://test-ipv6.com/>

---
title: ESXi 通过 SSH 修改管理 IP
date: 2026-05-25
categories:
  - 技术文档
  - VMware
  - ESXi
tags:
  - ESXi
  - SSH
  - 网络配置
  - IP 修改
---

# ESXi 通过 SSH 修改管理 IP

当 ESXi 的管理 IP 需要变更，但你暂时无法通过 vSphere Client 或 Web UI 连接时，可以直接 SSH 登录服务器进行修改。

## 前置条件

- ESXi 已开启 SSH（在控制台按 `F2` → `Troubleshooting Options` → `Enable SSH`）
- 你知道目标 IP、子网掩码、网关信息

以下示例将管理 IP 修改为：

| 项目 | 值 |
|------|------|
| IP 地址 | 172.20.0.20 |
| 子网掩码 | 255.255.252.0（/22） |
| 网关 | 172.20.0.1 |

## 第一步：修改 IP 地址和子网掩码

```bash
esxcli network ip interface ipv4 set \
  -i vmk0 \
  -I 172.20.0.20 \
  -N 255.255.252.0 \
  -t static
```

参数说明：
- `-i vmk0`：管理网络接口，通常为 `vmk0`
- `-I`：目标 IP 地址
- `-N`：子网掩码
- `-t static`：静态 IP 模式

## 第二步：设置默认网关

```bash
esxcli network ip route ipv4 add \
  --gateway 172.20.0.1 \
  --network default
```

如果提示路由已存在，先删除旧的再添加：

```bash
esxcli network ip route ipv4 remove \
  --gateway 0.0.0.0 \
  --network default

esxcli network ip route ipv4 add \
  --gateway 172.20.0.1 \
  --network default
```

## 第三步：验证 IP 和路由

查看接口配置：

```bash
esxcli network ip interface ipv4 get
```

查看路由表：

```bash
esxcli network ip route ipv4 list
```

正常应看到：

```
default   172.20.0.1   vmk0
```

## 第四步：配置 DNS

```bash
esxcli network ip dns server add --server=1.1.1.1
esxcli network ip dns server add --server=8.8.8.8
```

查看当前 DNS 配置：

```bash
esxcli network ip dns server list
```

## 第五步：重启管理网络服务

配置修改后，建议重启相关服务使其生效：

```bash
# 方式一：重启管理网络服务
services.sh restart

# 方式二：分别重启 hostd 和 vpxa
/etc/init.d/hostd restart
/etc/init.d/vpxa restart
```

::: tip
`services.sh restart` 会重启所有 ESXi 服务，短暂影响虚拟机管理但不会影响运行中的虚拟机。如果只想重启管理服务，用方式二更精准。
:::

## 常见问题

### Q: 修改后 Web UI 打不开了？

确认新 IP 能 ping 通，然后尝试重启 hostd 服务：

```bash
/etc/init.d/hostd restart
```

### Q: 怎么查看当前管理接口是哪个？

```bash
esxcli network ip interface list
```

一般 `Management Network` 对应的就是 `vmk0`。

### Q: 忘记了当前 IP 怎么办？

在 ESXi 物理控制台（接显示器）可以直接看到管理 IP。或者在同网段其他机器上扫描：

```bash
nmap -sn 172.20.0.0/22
```

---

*创建时间：2026-05-25*

---
title: Ubuntu 24 修改 SSH 端口
date: 2026-04-14
coverImg: /covers/Ubuntu-ssh.jpg
categories:
  - 技术文档
  - Linux
  - SSH
tags:
  - Ubuntu
  - SSH
  - 端口修改
---

# Ubuntu 24 修改 SSH 端口

在 Ubuntu 24 中，可以通过修改 SSH 配置文件来更换默认端口（例如从 `22` 修改为 `22345`），用于提升基础安全性。

## 查看当前 SSH 配置

```

cat /etc/ssh/sshd_config

```

## 修改 SSH 端口（22 → 22345）

```

sudo sed -i 's/^#?Port 22/Port 22345/' /etc/ssh/sshd_config

```

## 确认修改结果

```

cat /etc/ssh/sshd_config

```

确认是否已变更为：

```

Port 22345

```

## 放行新端口（UFW 防火墙）

```

sudo ufw allow 22345/tcp

```

## 重载并重启 SSH 服务

```

sudo systemctl daemon-reload
sudo systemctl restart ssh

```

## 或使用 socket 方式重启（部分系统）

```

sudo systemctl restart ssh.socket

```

## 验证是否生效

```

ssh -p 22345 user@your-server-ip

```

---

*创建时间：2026-04-14*


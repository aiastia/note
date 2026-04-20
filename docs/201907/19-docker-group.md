---
title: Linux 当前用户加入 docker 组
date: 2019-07-19
categories:
  - Linux
tags:
  - Docker
  - 用户权限
  - 运维
---

# Linux 当前用户加入 docker 组

Docker 运行在 root 下，需要使用 `sudo` 方式进行查看（如 `sudo docker ps`）。可以通过将当前普通用户加入到 docker 组里，从而不需要再使用 sudo。

## 操作步骤

通过 `ls -alh /var/run/docker.sock` 可以查看到执行需要 root 权限。

### 1. 把自己加入到 docker group 里

```bash
sudo gpasswd -a ${USER} docker
```

### 2. 重启 Docker

```bash
sudo service docker restart
```

### 3. 切换当前会话到新 group

必须执行以下命令（或者重启 X 会话）：

```bash
newgrp - docker
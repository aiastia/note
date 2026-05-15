---
title: Ubuntu 下取消 sudo 输入密码
date: 2019-09-13
categories:
  - Linux
tags:
  - Ubuntu
  - sudo
  - 用户权限
---

# Ubuntu 下取消 sudo 输入密码

## 操作步骤

编辑 sudoers 文件：

```bash
sudo vi /etc/sudoers
```

找到以下内容：

```
# Allow members of group sudo to execute any command
%sudo   ALL=(ALL:ALL) ALL
```

在下面添加一行：

```
ubuntu ALL=(ALL) NOPASSWD:ALL
```

保存即可。
---
title: 阿里云 Docker 镜像推送
date: 2025-01-21
categories:
  - Docker
tags:
  - docker
  - 阿里云
  - 容器镜像
  - ACR
---

# 阿里云 Docker 镜像推送

## 一、登录阿里云镜像仓库

```bash
docker login --username=<你的阿里云账号> registry.cn-hongkong.aliyuncs.com
```

系统提示输入密码，建议使用阿里云容器服务中的专用镜像仓库密码。

## 二、查看现有镜像

```bash
docker images
```

示例输出：

```
REPOSITORY                                TAG       IMAGE ID       CREATED         SIZE
ginuerzh/gost                             latest    17c6b1488d5d   3 years ago     24.4MB
```

## 三、推送镜像到阿里云

给镜像打上阿里云仓库路径的标签：

```bash
docker tag ginuerzh/gost:latest registry.cn-hongkong.aliyuncs.com/命名空间/gost:latest
```

推送镜像到阿里云：

```bash
docker push registry.cn-hongkong.aliyuncs.com/命名空间/gost:latest
```

如果目标镜像已有阿里云标签，直接推送更新即可。

## 四、去掉阿里云仓库前缀

将镜像重新打标签，移除 `registry.cn-hongkong.aliyuncs.com/` 前缀：

```bash
docker tag registry.cn-hongkong.aliyuncs.com/命名空间/gost:latest 命名空间/gost:latest
```

验证标签：

```bash
docker images
```

## 五、清理旧标签（可选）

```bash
docker rmi registry.cn-hongkong.aliyuncs.com/命名空间/gost:latest
```

## 六、测试镜像（可选）

```bash
docker run --rm 命名空间/gost:latest
```

## 完整命令流程

```bash
# 登录阿里云镜像仓库
docker login --username=<你的阿里云账号> registry.cn-hongkong.aliyuncs.com

# 查看本地镜像
docker images

# 推送镜像到阿里云
docker tag ginuerzh/gost:latest registry.cn-hongkong.aliyuncs.com/命名空间/gost:latest
docker push registry.cn-hongkong.aliyuncs.com/命名空间/gost:latest

# 去掉阿里云前缀标签
docker tag registry.cn-hongkong.aliyuncs.com/命名空间/gost:latest 命名空间/gost:latest

# 验证标签
docker images

# 删除旧标签（可选）
docker rmi registry.cn-hongkong.aliyuncs.com/命名空间/gost:latest

# 测试（可选）
docker run --rm 命名空间/gost:latest
```

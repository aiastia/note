---
title: Ookla Speedtest 在 Ubuntu 24.04 安装失败的解决办法
date: 2025-01-19
categories:
  - Linux
tags:
  - Ubuntu
  - Speedtest
  - 网络工具
---

# Ookla Speedtest 在 Ubuntu 24.04 安装失败的解决办法

Ubuntu 24.04 (Noble) 下通过 apt 安装 Ookla Speedtest CLI 时可能会失败，因为官方源尚未适配 Noble 版本。解决方法是将源中的 `noble` 替换为 `jammy`。

## 解决步骤

### 1. 安装依赖

```bash
sudo apt-get install curl
```

### 2. 添加 Ookla 软件源

```bash
curl -s https://packagecloud.io/install/repositories/ookla/speedtest-cli/script.deb.sh | sudo bash
```

### 3. 替换发行版代号

编辑源文件：

```bash
sudo nano /etc/apt/sources.list.d/ookla_speedtest-cli.list
```

将其中的 `noble` 替换为 `jammy`，保存退出。

### 4. 安装 Speedtest

```bash
sudo apt update
sudo apt-get install speedtest
```

### 5. 运行测试

```bash
speedtest
```

## 原因说明

Ookla 的 packagecloud 仓库在 Ubuntu 24.04 (Noble) 发布时还没有提供对应的包，使用 22.04 (Jammy) 的包可以正常兼容运行。

## 参考链接

- [Ookla 官方解决方案 - Ubuntu 24.04 Noble](https://support.ookla.com/hc/en-us/articles/32139787616141-Ubuntu-24-04-noble)
- [Ookla Speedtest CLI 官网](https://www.speedtest.net/apps/cli)
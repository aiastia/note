---
title: Linux 常见文件解压与压缩方法
date: 2026-04-20
categories:
  - 工具使用
tags:
  - Linux
  - 压缩
  - 解压
  - tar
  - 命令行
---

# Linux 常见文件解压与压缩方法

在 Linux 系统中，我们会遇到各种各样的压缩包格式。本文汇总了常见的压缩与解压命令，方便随时查阅。

## 常用格式速查表

| 格式 | 解压命令 | 压缩命令 |
|------|----------|----------|
| `.tar` | `tar xvf file.tar` | `tar cvf file.tar dir/` |
| `.tar.gz` / `.tgz` | `tar zxvf file.tar.gz` | `tar zcvf file.tar.gz dir/` |
| `.tar.bz2` | `tar jxvf file.tar.bz2` | `tar jcvf file.tar.bz2 dir/` |
| `.tar.xz` | `tar xvf file.tar.xz` | `tar cvf file.tar.xz dir/` |
| `.gz` | `gunzip file.gz` | `gzip file` |
| `.bz2` | `bunzip2 file.bz2` | `bzip2 -z file` |
| `.zip` | `unzip file.zip` | `zip -r file.zip dir/` |
| `.rar` | `rar x file.rar` | `rar a file.rar dir/` |
| `.7z` | `7z x file.7z` | `7z a file.7z dir/` |
| `.Z` | `uncompress file.Z` | `compress file` |
| `.tar.Z` | `tar Zxvf file.tar.Z` | `tar Zcvf file.tar.Z dir/` |

::: tip 提示
`tar` 本身只是打包工具，不是压缩。`tar.gz`、`tar.bz2` 等是先打包再压缩的组合。
:::

## 详细说明

### .tar（打包）

```bash
# 解包
tar xvf file.tar

# 打包
tar cvf file.tar dir/
```

> 注：tar 是打包，不是压缩！

### .tar.gz / .tgz（最常用）

```bash
# 解压
tar zxvf file.tar.gz

# 压缩
tar zcvf file.tar.gz dir/
```

也可以用管道方式：

```bash
# 解压
gzip -dc file.tar.gz | tar xvf -

# 压缩
tar cvf - dir/ | gzip > file.tar.gz
```

### .tar.bz2

```bash
# 解压
tar jxvf file.tar.bz2

# 或者
tar --bzip xvf file.tar.bz2

# 压缩
tar jcvf file.tar.bz2 dir/
```

### .tar.xz

```bash
# 解包
tar xvf file.tar.xz

# 打包
tar cvf file.tar.xz dir/
```

### .gz

```bash
# 解压方式一
gunzip file.gz

# 解压方式二
gzip -d file.gz

# 压缩（原文件会被替换）
gzip file
```

### .bz2

```bash
# 解压方式一
bzip2 -d file.bz2

# 解压方式二
bunzip2 file.bz2

# 压缩
bzip2 -z file
```

### .bz / .tar.bz

```bash
# 解压
bzip2 -d file.bz
# 或
bunzip2 file.bz

# 解包 tar.bz
tar jxvf file.tar.bz
```

### .Z / .tar.Z

```bash
# 解压 .Z
uncompress file.Z

# 压缩 .Z
compress file

# 解压 .tar.Z
tar Zxvf file.tar.Z

# 压缩 .tar.Z
tar Zcvf file.tar.Z dir/
```

### .zip

```bash
# 解压
unzip file.zip

# 压缩文件
zip file.zip file

# 压缩目录（使用 -r 参数递归）
zip -r file.zip dir/
```

### .rar

```bash
# 解压
rar x file.rar

# 压缩
rar a file.rar dir/
```

::: warning 注意
`rar` 不是系统自带的，需要额外安装：
- Ubuntu/Debian: `sudo apt install rar unrar`
- CentOS/RHEL: `sudo yum install rar unrar`
- macOS: `brew install rar`
:::

### .7z

```bash
# 解压
7z x file.7z

# 解压到指定目录
7z x file.7z -o/target/directory/

# 解压带密码
7z x file.7z -p密码

# 压缩
7z a file.7z dir/

# 压缩带密码
7z a file.7z dir/ -p密码

# 查看内容
7z l file.7z

# 批量解压（带密码）
for i in *.7z; do 7z x -p密码 "$i"; done

# 压缩为 tar.7z（更高压缩率）
7z a -ttar -snl file.7z dir/
```

::: tip 安装
- Ubuntu/Debian: `sudo apt install p7zip-full`
- CentOS/RHEL: `sudo yum install p7zip p7zip-plugins`
- macOS: `brew install p7zip`
:::

### .rpm

```bash
# 安装
rpm -i file.rpm

# 解包（不解压到文件系统，只是提取内容）
rpm2cpio file.rpm | cpio -div
```

### .deb

```bash
# 安装
dpkg -i file.deb

# 解包
dpkg-deb -fsys-tarfile file.deb | tar xvf -
# 或
ar p file.deb data.tar.gz | tar zxvf -
```

### .cpio / .cpio.gz

```bash
# 解压 .cpio
cpio -div < file.cpio

# 解压 .cpio.gz
gzip -dc file.cgz | cpio -div
```

## tar 命令参数说明

| 参数 | 含义 |
|------|------|
| `c` | 创建新的归档文件（打包） |
| `x` | 从归档文件中提取（解包） |
| `v` | 显示过程（verbose） |
| `f` | 指定归档文件名 |
| `z` | 使用 gzip 压缩/解压 |
| `j` | 使用 bzip2 压缩/解压 |
| `Z` | 使用 compress 压缩/解压 |
| `t` | 列出归档文件内容（查看不解压） |

## 实用技巧

### 查看压缩包内容（不解压）

```bash
tar tzvf file.tar.gz
```

### 解压到指定目录

```bash
tar zxvf file.tar.gz -C /target/directory/
```

### 排除特定文件

```bash
tar zcvf file.tar.gz --exclude='*.log' dir/
```

### 保留文件权限解压

```bash
tar zxvpf file.tar.gz
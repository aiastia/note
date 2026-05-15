---
title: OneDrive 同步任意文件夹
date: 2020-07-20
categories:
  - Windows
tags:
  - onedrive
  - Windows
  - 符号链接
  - mklink
---

# OneDrive 同步任意文件夹

OneDrive 默认只能同步指定文件夹内的内容，但通过 Windows 符号链接（Symbolic Link），可以将任意文件夹映射到 OneDrive 目录下实现同步。

## 原理

使用 `mklink` 命令创建符号链接，让 OneDrive 认为该文件夹在自己的目录下，实际文件仍然存放在原位置。

## 创建链接（添加同步）

```cmd
mklink /D "D:\OneDrive\同步文件夹名" "D:\实际文件夹路径"
```

### 示例

```cmd
mklink /D "D:\OneDrive\新建文件夹" "D:\测试\新建文件夹"
```

- 第一个路径：OneDrive 目录下的链接位置
- 第二个路径：实际要同步的文件夹路径

执行后会提示：

```
为 D:\OneDrive\新建文件夹 <<===>> D:\测试\新建文件夹 创建的符号链接
```

## 删除链接（取消同步）

```cmd
rmdir "D:\OneDrive\新建文件夹"
```

::: warning 注意
`rmdir` 只删除符号链接，不会删除实际文件。请勿使用 `rd /s` 或手动删除原文件夹。
:::

## 批量同步多个文件夹

可以将多个 `mklink /D` 命令写成一个 `.bat` 批处理文件，方便一次性配置：

```bat
@echo off
mklink /D "D:\OneDrive\文档" "D:\Work\文档"
mklink /D "D:\OneDrive\项目" "D:\Work\项目"
mklink /D "D:\OneDrive\笔记" "D:\Notes"
echo 完成
pause
```

## 适用场景

- 将桌面、文档、下载等系统文件夹同步到 OneDrive
- 同步非系统盘的工作目录
- 多电脑间保持文件夹同步

## 注意事项

- 路径中如有空格，需用双引号包裹
- 链接创建后，OneDrive 会自动开始同步
- 删除链接不会删除源文件，但通过 OneDrive 删除会同步删除源文件
- 建议删除前先在 OneDrive 设置中暂停同步确认

---
title: 合并所有文件夹里的同名txt文件
date: 2019-03-19
categories:
  - 工具使用
tags:
  - Windows
  - 批处理
  - 文件处理
---

# 合并所有文件夹里的同名txt文件

合并所有文件夹里的同名txt文件，并且把不同名的文件提取出来放到一起。

## 方法

自己弄个 `.bat` 批处理文件。新建一个记事本，把下面的内容贴进去，然后保存，把后缀名 `.txt` 改为 `.bat`。

```bat
@echo off

for /r %%i in (*.txt) do type "%%i" >>"%%~ni合并.tmp"

ren *.tmp *.txt
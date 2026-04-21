---
title: 办公与文件处理实用技巧
date: 2019-03-19
categories:
  - 工具使用
tags:
  - Windows
  - Excel
  - 批处理
  - 文件处理
---

# 办公与文件处理实用技巧

收集日常工作中的办公和文件处理小技巧，包括 Excel 公式和批处理脚本。

## 合并同名 txt 文件

> 来源：[#30](https://github.com/aiastia/note/issues/30)

合并所有文件夹里的同名 txt 文件，并且把不同名的文件提取出来放到一起。

### 方法

自己弄个 `.bat` 批处理文件。新建一个记事本，把下面的内容贴进去，然后保存，把后缀名 `.txt` 改为 `.bat`。

```bat
@echo off

for /r %%i in (*.txt) do type "%%i" >>"%%~ni合并.tmp"

ren *.tmp *.txt
```

### 说明

- `for /r` 递归遍历所有子目录中的 `.txt` 文件
- `%%~ni` 获取文件名（不含扩展名），同名文件内容会追加到同一个临时文件
- 最后将 `.tmp` 重命名为 `.txt`

## Excel 数字转换为中文大写

将数字转换为中文大写（如 `123` → `一百二十三`）：

```excel
=TEXT(RIGHT(A1),"[dbnum1]")
```

### 说明

- `[dbnum1]` 是 Excel 内置的格式化代码，用于将数字转换为中文小写数字（一、二、三...）
- 如果需要中文大写（壹、贰、叁...），使用 `[dbnum2]`
- `RIGHT(A1)` 取 A1 单元格的值

---

## Excel 筛选求和

> 来源：[#26](https://github.com/aiastia/note/issues/26)

在 Excel 中对满足特定条件的多个选项进行求和。

### 公式

```excel
=SUM(SUMIF(H2:H42,{"需要的选项"},O2:O42))
```

### 说明

- `SUMIF` 按条件求和，`{"需要的选项"}` 使用数组语法支持多个条件
- 外层 `SUM` 将多个条件的结果相加
- 例如需要同时对"选项A"和"选项B"求和：`=SUM(SUMIF(H2:H42,{"选项A","选项B"},O2:O42))`

## Excel 中将文本公式转换为计算结果

> 来源：[#2](https://github.com/aiastia/note/issues/2)

当 A1 单元格显示的是公式文本（如 `15*15`），如何在 B1 中通过公式引用得到计算结果。

### 方法：使用 EVALUATE 函数

Excel 没有直接在工作表中使用 `EVALUATE` 函数的方式，需要通过「定义名称」来间接调用：

1. 选中 B1 单元格
2. 打开「插入」菜单 →「名称」→「定义」（或「公式」选项卡 →「定义名称」）
3. 在「名称」中输入一个自定义名称，如 `ABCDEFG`
4. 在「引用位置」中输入：

```excel
=EVALUATE(Sheet1!A1)
```

5. 点击确定
6. 在 B1 中输入 `=ABCDEFG`，即可得到 A1 中公式的计算结果
7. 选中 B1，按住右下角填充柄向下拖动即可批量计算

## PowerShell 修改文件创建时间

> 来源：[#77](https://github.com/aiastia/note/issues/77)

使用 PowerShell 批量修改文件的创建时间：

```powershell
(Get-Item "C:\Users\*\Desktop\*\***.pdf").CreationTime = Get-Date "2022-01-01 10:00:00"
```

### 说明

- `Get-Item` 获取文件对象，支持通配符路径
- `CreationTime` 设置文件创建时间
- `Get-Date` 将字符串转换为日期对象
- 如需修改最后修改时间，将 `CreationTime` 改为 `LastWriteTime`
- 如需修改访问时间，将 `CreationTime` 改为 `LastAccessTime`

### 其他时间属性

```powershell
# 同时修改创建时间、修改时间、访问时间
$file = Get-Item "C:\path\to\file.pdf"
$file.CreationTime = Get-Date "2022-01-01 10:00:00"
$file.LastWriteTime = Get-Date "2022-01-01 10:00:00"
$file.LastAccessTime = Get-Date "2022-01-01 10:00:00"
```

### 参考链接

- [百度知道 - 前一单元格显示公式，后一单元格如何显示结果](https://zhidao.baidu.com/question/21668351.html)
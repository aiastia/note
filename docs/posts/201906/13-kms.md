---
title: KMS 激活 Windows
date: 2019-06-13
categories:
  - Windows
tags:
  - KMS
  - Windows
  - 激活
---

# KMS 激活 Windows

以管理员身份运行 cmd，按以下步骤操作：

## 1. 卸载之前的密钥

```bash
slmgr /upk
# 或
slmgr.vbs /upk
```

弹出窗口显示「成功地卸载了产品密钥」。如果提示找不到密钥，不用管，直接跳到下一步。

## 2. 安装产品密钥

```bash
slmgr /ipk W269N-WFGWX-YVC9B-4J6C9-T83GX
```

弹出窗口显示「成功地安装了产品密钥」。

## 3. 设置密钥管理服务器

```bash
slmgr /skms kms.cangshui.net
```

弹出窗口提示「密钥管理服务计算机名称成功地设置为 kms.cangshui.net」。网络上非常多这种 KMS 服务器。

## 4. 激活产品

```bash
slmgr /ato
```

弹出窗口提示「成功地激活了产品」。

## 5. 查看激活信息

```bash
# 查看激活过期时间
slmgr /xpr

# 查看详细激活信息
slmgr /dlv
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
```

## 常用 GVLK 密钥

不同版本的 Windows / Office 需要使用不同的 KMS 客户端安装密钥（GVLK），上文使用的 `W269N-WFGWX-YVC9B-4J6C9-T83GX` 适用于 Windows 10/11 Pro。

更多版本的密钥请查看微软官方文档：

- **Windows**：[KMS 客户端安装密钥](https://learn.microsoft.com/zh-cn/windows-server/get-started/kms-client-activation-keys)
- **Office**：[Office GVLK 密钥](https://learn.microsoft.com/zh-cn/DeployOffice/vlactivation/gvlks)

## KMS 服务器

网络上有很多公开的 KMS 服务器，可参考：

- [KMS 服务器合集 - CoolHub](https://www.coolhub.top/archives/14/comment-page-8)

## 参考链接

- [Windows KMS 客户端激活密钥（英文）](https://learn.microsoft.com/en-us/DeployOffice/vlactivation/gvlks)
- [Windows Server KMS 客户端激活密钥](https://learn.microsoft.com/zh-cn/windows-server/get-started/kms-client-activation-keys)
- [Office GVLK 密钥](https://learn.microsoft.com/zh-cn/DeployOffice/vlactivation/gvlks)

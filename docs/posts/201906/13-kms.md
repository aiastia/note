---
title: KMS 激活 Windows 与 Office
date: 2019-06-13
categories:
  - Windows
tags:
  - KMS
  - Windows
  - Office
  - 激活
---

# KMS 激活 Windows 与 Office

> 整合自 [#60](https://github.com/aiastia/note/issues/60)、[#61](https://github.com/aiastia/note/issues/61)、[#73](https://github.com/aiastia/note/issues/73)

## slmgr.vbs 命令速查表

| 命令 | 功能说明 |
|------|----------|
| `slmgr.vbs -dli` | 显示操作系统版本、部分产品密钥、许可证状态 |
| `slmgr.vbs -dlv` | 最详尽的激活信息（激活ID、安装ID、激活截止日期等） |
| `slmgr.vbs -xpr` | 查看是否彻底激活 / 激活过期时间 |
| `slmgr.vbs -ipk <密钥>` | 安装产品密钥 |
| `slmgr.vbs -upk` | 卸载产品密钥 |
| `slmgr.vbs -ato` | 激活 Windows |
| `slmgr.vbs -skms <服务器>` | 设置 KMS 服务器与端口 |
| `slmgr.vbs -ckms` | 清除所使用的 KMS 服务器信息 |
| `winver` | 显示操作系统版本信息 |

## Windows KMS 激活步骤

以管理员身份运行 cmd，按以下步骤操作：

### 1. 卸载之前的密钥

```bash
slmgr /upk
# 或
slmgr.vbs /upk
```

弹出窗口显示「成功地卸载了产品密钥」。如果提示找不到密钥，不用管，直接跳到下一步。

### 2. 安装产品密钥

```bash
slmgr /ipk W269N-WFGWX-YVC9B-4J6C9-T83GX
```

弹出窗口显示「成功地安装了产品密钥」。

### 3. 设置密钥管理服务器

```bash
slmgr /skms kms.cangshui.net
```

弹出窗口提示「密钥管理服务计算机名称成功地设置为 kms.cangshui.net」。网络上非常多这种 KMS 服务器。

### 4. 激活产品

```bash
slmgr /ato
```

弹出窗口提示「成功地激活了产品」。

### 5. 查看激活信息

```bash
# 查看激活过期时间
slmgr /xpr

# 查看详细激活信息
slmgr /dlv
```

## Office 激活（Office Tool Plus）

Office Tool Plus 是一款 Office 部署与激活工具，支持通过 KMS 方式激活 Office。

### 重要说明

- KMS 只能激活**批量版 (Volume)** 许可证，不能激活零售版 (Retail)
- 激活完成后所有功能正常使用，不存在不能登录账户的说法
- 激活后系统会 **7 天自动续期一次**，不会 180 天后到期（前提是 KMS 服务器和网络正常）
- 激活出问题时请先检查步骤是否有误，**不要盲目重装 Office**
- MSDN 上留存的 Office 安装包太旧，建议从 Office Tool Plus 重新下载

### 使用步骤

1. 打开 Office Tool Plus
2. 进入「激活」页面
3. 点击「清除激活信息」
4. 选择 KMS 激活方式（自动或手动均可）
5. 设置 KMS 服务器地址，点击激活

## 常用 GVLK 密钥

不同版本的 Windows / Office 需要使用不同的 KMS 客户端安装密钥（GVLK），上文使用的 `W269N-WFGWX-YVC9B-4J6C9-T83GX` 适用于 Windows 10/11 Pro。

更多版本的密钥请查看微软官方文档：

- **Windows**：[KMS 客户端安装密钥](https://learn.microsoft.com/zh-cn/windows-server/get-started/kms-client-activation-keys)
- **Office**：[Office GVLK 密钥](https://learn.microsoft.com/zh-cn/DeployOffice/vlactivation/gvlks)

## 零售版转 VOL 版

> 来源：[#46](https://github.com/aiastia/note/issues/46)

Win7 零售版及之后版本可以转换为 VOL（批量授权）版，从而支持 KMS 激活。

### 步骤

1. **查看当前系统版本**（管理员 CMD）：

```bash
wmic os get caption
```

2. **查找对应版本的 GVLK 密钥**：

   [微软官方 KMS 客户端密钥](https://docs.microsoft.com/zh-cn/windows-server/get-started/kmsclientkeys)

3. **安装 GVLK 密钥**（管理员 CMD）：

```bash
slmgr /ipk xxxxx-xxxxx-xxxxx-xxxxx
```

4. **重启电脑**，转换即完成。

适用系统：Win7 ~ Win10。

---

## KMS 服务器

网络上有很多公开的 KMS 服务器，可参考：

- [KMS 服务器合集 - CoolHub](https://www.coolhub.top/archives/14/comment-page-8)

## 参考链接

- [Windows KMS 客户端激活密钥](https://learn.microsoft.com/zh-cn/windows-server/get-started/kms-client-activation-keys)
- [Office GVLK 密钥](https://learn.microsoft.com/zh-cn/DeployOffice/vlactivation/gvlks)
- [Office Tool Plus 官网](https://otp.landian.vip/)
- [Office Tool Plus 激活教程](https://otp.landian.vip/help/)
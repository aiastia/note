---
title: Ubuntu Pro 开启延长安全支持
date: 2026-03-17
categories:
  - 技术文档
  - Ubuntu
  - 安全
tags:
  - Ubuntu Pro
  - LTS
  - 安全更新
  - Livepatch
---

# Ubuntu Pro 开启延长安全支持

Ubuntu Pro 提供 Ubuntu LTS 的扩展安全支持（最长可达 10 年），适用于生产环境与长期运行系统。

## 基本说明

- Ubuntu Pro = Ubuntu LTS 扩展安全维护（ESM）
- 免费额度：个人最多 5 台设备
- 超出需付费（Canonical 官方）
- 需先注册 Ubuntu Pro 账号

👉 注册地址： https://ubuntu.com/pro

---

## 🔐 绑定 Ubuntu Pro 账户

```bash id="p1q7sd"
sudo ua attach YOUR_TOKEN
````

---

## 📊 查看当前状态

```bash id="v6m3ax"
pro status --all
```

---

## ⚙️ 启用推荐安全组件

### 启用应用扩展安全维护

```bash id="k8d2nc"
sudo ua enable esm-apps
```

---

### 启用 Livepatch（免重启内核更新）

```bash id="r4t9qp"
sudo ua enable livepatch
```

---

### 启用安全合规工具

```bash id="z1w8mf"
sudo ua enable usg
```

---

### 启用 FIPS 加密标准（可选）

```bash id="c7n2ld"
sudo ua enable fips
sudo ua enable fips-updates
```

---

## 🔄 更新系统

```bash id="b5x0qe"
sudo apt update
sudo apt upgrade
```

---

## 📌 组件说明

### esm-apps

提供第三方应用与软件的安全补丁支持。

### esm-infra

系统核心基础设施安全维护（通常默认启用）。

### livepatch

允许内核安全更新无需重启系统。

### fips / fips-updates

符合 NIST FIPS-140-2 标准的加密组件。

### usg

安全审计与合规检查工具。

---

## ⚠️ 注意事项

* 使用 mainline kernel（滚动内核）可能影响 Livepatch
* 启用 FIPS 会更换为认证内核（不可随意回退）
* 不理解用途时不建议开启 FIPS

---

## 🚀 一键建议配置（生产环境常用）

```bash id="m9q0zx"
sudo ua enable esm-apps
sudo ua enable livepatch
sudo ua enable usg
```

---

*创建时间：2026-03-17*

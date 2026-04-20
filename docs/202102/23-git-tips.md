---
title: Git 专题
date: 2021-02-23
categories:
  - 工具使用
tags:
  - Git
  - 版本控制
---

# Git 专题

Git 日常使用中积累的常用技巧和命令。

## 查看提交历史

```bash
git log
```

::: tip 提示
退出查看界面按 `q` 键。
:::

## 如何拥有一个全新的提交

清除所有历史记录，重新开始：

```bash
# 1. 创建全新分支（无历史）
git checkout --orphan new-main

# 2. 添加所有文件
git add -A

# 3. 提交
git commit -m "Initial commit (fresh start)"

# 4. 删除旧 main 分支
git branch -D main

# 5. 重命名新分支
git branch -m main

# 6. 强制推送
git push --force origin main
```

## 强制重置本地分支与远程一致

```bash
# 获取远程最新变更（但不自动合并）
git fetch origin

# 强制重置本地分支，使其与远程完全一致
git reset --hard origin/main

# 清理可能残留的旧引用
git clean -fd  # 删除未跟踪的文件和目录
```

## 合并多个提交

将最近的多个提交合并为一个：

```bash
git reset --soft HEAD~3  # 回退到 3 个提交之前，但保留更改
git commit -m "fix: 合并今日所有更改（admin、token、docker 配置）"
git push --force
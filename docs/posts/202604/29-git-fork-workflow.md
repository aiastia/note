---
title: Git Fork 开发工作流：同步上游与推送 PR 指南
date: 2026-04-29
categories:
  - Git
tags:
  - Git
  - GitHub
  - 工作流
---

## 前言

参与开源项目时，通常的流程是 Fork → 修改 → 提 PR。但实际操作中会遇到一些坑：怎么保持和上游同步？怎么推送干净的 PR 而不带自己的 CI 配置？中文文件名怎么处理？

这篇文章记录了一套完整的 Fork 开发工作流。

## 仓库结构

```
origin:   你的 Fork 仓库
upstream: 上游原始仓库

分支说明：
- main → 只跟踪上游，不做开发
- dev  → 日常开发分支
```

## 初始配置（只需一次）

```bash
# 1. Clone 你的 Fork
git clone https://github.com/你的用户名/项目名
cd 项目名

# 2. 添加上游仓库
git remote add upstream https://github.com/原作者/项目名.git

# 3. 验证
git remote -v
# origin    https://github.com/你的用户名/项目名 (fetch)
# origin    https://github.com/你的用户名/项目名 (push)
# upstream  https://github.com/原作者/项目名.git (fetch)
# upstream  https://github.com/原作者/项目名.git (push)
```

## 日常开发

```bash
# 在 dev 分支上开发
git checkout dev

# 正常修改、提交
git add .
git commit -m "feat: 新功能描述"
git push origin dev
```

## 推送到上游（创建 PR）

**核心原则：创建一个干净的 PR 分支，不要把 `.github/workflows/` 推到上游（CI 配置是各仓库自己的）。**

```bash
# 1. 拉取上游最新代码
git fetch upstream

# 2. 基于上游 main 创建干净的 PR 分支
git checkout -b pr-to-upstream upstream/main

# 3. 把 dev 的改动复制过来（排除 .github/ 目录）
git diff upstream/main..dev --name-only -- . ':!.github' | while IFS= read -r file; do
  git checkout dev -- "$file"
done

# ⚠️ 如果文件名包含中文，shell 可能处理不了，用 Python 辅助：
python3 -c "
import subprocess
result = subprocess.run(['git', 'diff', 'upstream/main..dev', '--name-only', '-z', '--', '.', ':!.github'], capture_output=True)
files = result.stdout.decode('utf-8').split('\x00')
for f in files:
    f = f.strip()
    if not f:
        continue
    content = subprocess.run(['git', 'show', f'dev:{f}'], capture_output=True).stdout
    with open(f, 'wb') as fh:
        fh.write(content)
    subprocess.run(['git', 'add', f])
    print(f'Copied: {f}')
"

# 4. 提交
git add -A
git commit -m "feat: 简洁描述本次 PR 的改动"

# 5. 推送到你的 Fork
git push origin pr-to-upstream

# 6. 创建 PR 到上游
gh pr create --repo 原作者/项目名 \
  --head 你的用户名:pr-to-upstream \
  --base main \
  --title "feat: PR 标题" \
  --body "PR 描述"

# 7. 切回 dev 继续开发
git checkout dev
```

## 上游合并后同步

```bash
# 1. 拉取上游最新代码
git fetch upstream

# 2. 同步 main 到上游
git checkout main
git reset --hard upstream/main
git push origin main --force-with-lease

# 3. 切回 dev 继续开发
git checkout dev
```

## 验证 PR 内容

```bash
# 确认排除 .github/ 后零差异（应该没有任何输出）
git diff pr-to-upstream dev -- . ':!.github' --stat

# 查看完整差异（只有 .github/ 应该不同）
git diff pr-to-upstream dev --stat
```

## 避坑经验

### 1. 不要把 merge commit 推到上游

❌ **错误做法**：直接用 dev 分支创建 PR
```bash
# 这会把你的 merge commit 和完整历史都推上去
git push origin dev
gh pr create --head 你的用户名:dev ...
```

✅ **正确做法**：创建干净的 PR 分支，只包含文件差异

### 2. 不要推送 .github/workflows/ 到上游

每个仓库有自己的 CI 配置。推上去会覆盖上游的 CI，导致构建失败。

### 3. main 分支只跟踪上游

- `main` → 与 `upstream/main` 完全一致，不做任何开发
- `dev` → 你的开发分支

这样避免 GitHub Web 端同步时的冲突。

### 4. 中文文件名处理

Git 中中文文件名在 shell 管道中可能编码异常：

```
error: pathspec '...\\346\\267...' did not match any file(s)
```

用上面的 Python 脚本处理即可。

### 5. Git merge 是叠加不是覆盖

合并上游时，Git 是**叠加**，不是覆盖：你的 commit 全部保留，上游的新 commit 也加进来，两者合并在一起。

```
* be619c0 Merge remote-tracking branch 'upstream/main' into dev
|\
| * 1f80a58 上游的 commit
* | 61fd0bb 你的 commit
* | 29803a3 你的 commit
```

## 完整循环

```
开发(dev) → 创建PR分支 → 推送到上游 → 等待合并 → 同步main → 继续开发(dev)
  ↑                                                         |
  └─────────────────────────────────────────────────────────┘
```

## 常用命令速查

| 操作 | 命令 |
|---|---|
| 添加上游 | `git remote add upstream <url>` |
| 拉取上游 | `git fetch upstream` |
| 同步 main | `git checkout main && git reset --hard upstream/main && git push origin main --force-with-lease` |
| 创建 PR | `gh pr create --repo <上游> --head <fork>:<分支> --base main` |
| 查看 dev 与上游差异 | `git diff upstream/main..dev --stat` |
| 排除 .github 查看差异 | `git diff upstream/main..dev -- . ':!.github' --stat` |

---
title: Git Subtree 教程
date: 2022-01-24
categories:
  - Git
tags:
  - git
  - subtree
  - submodule
  - 仓库共用
---

# Git Subtree 教程

关于子仓库或者说仓库共用，Git 官方推荐的工具是 `git subtree`。相比 `git submodule`，`git subtree` 更好用，缺点也在可接受的范围内。

对于仓库共用，在 `git subtree` 与 `git submodule` 之中选择的话，推荐 `git subtree`。

## 主要命令

```bash
git subtree add   --prefix=<prefix> <commit>
git subtree add   --prefix=<prefix> <repository> <ref>
git subtree pull  --prefix=<prefix> <repository> <ref>
git subtree push  --prefix=<prefix> <repository> <ref>
git subtree merge --prefix=<prefix> <commit>
git subtree split --prefix=<prefix> [OPTIONS] [<commit>]
```

## 准备工作

准备两个仓库：
- 父仓库 `photoshop`：`https://github.com/test/photoshop.git`
- 子仓库 `libpng`：`https://github.com/test/libpng.git`

目录结构：

```
photoshop              libpng
    |                      |
    |-- photoshop.c        |-- libpng.c
    |-- photoshop.h        |-- libpng.h
    |-- main.c             \-- README.md
    \-- README.md
```

## 添加子仓库

在父仓库根目录执行：

```bash
git subtree add --prefix=sub/libpng https://github.com/test/libpng.git master --squash
```

`--squash` 参数表示不拉取历史信息，只生成一条 commit。

执行后目录结构变为：

```
photoshop
    |
    |-- sub/
    |   |
    |   \--libpng/
    |       |
    |       |-- libpng.c
    |       |-- libpng.h
    |       \-- README.md
    |
    |-- photoshop.c
    |-- photoshop.h
    |-- main.c
    \-- README.md
```

执行 `git push` 推送到远端即可。

## 拉取子仓库更新

如果源仓库 `libpng` 更新了，在父仓库中执行：

```bash
git subtree pull --prefix=sub/libpng https://github.com/test/libpng.git master --squash
```

## 推送修改到源仓库

如果在父仓库中修改了子仓库的内容，想推送回源仓库：

```bash
git subtree push --prefix=sub/libpng https://github.com/test/libpng.git master
```

## 简化命令

每次输入完整的仓库地址不方便，可以把子仓库地址添加为 remote：

```bash
git remote add -f libpng https://github.com/test/libpng.git
```

之后就可以简化命令：

```bash
# 添加
git subtree add --prefix=sub/libpng libpng master --squash

# 拉取更新
git subtree pull --prefix=sub/libpng libpng master --squash

# 推送修改
git subtree push --prefix=sub/libpng libpng master
```

## 总结

| 操作 | 命令 |
|------|------|
| 添加子仓库 | `git subtree add --prefix=<路径> <仓库> <分支> --squash` |
| 拉取更新 | `git subtree pull --prefix=<路径> <仓库> <分支> --squash` |
| 推送修改 | `git subtree push --prefix=<路径> <仓库> <分支>` |
| 简化 | `git remote add -f <别名> <仓库地址>` |

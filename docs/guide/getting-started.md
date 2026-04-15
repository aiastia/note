---
title: 入门指南
date: 2024-01-01
categories:
  - 使用指南
tags:
  - 快速开始
  - VitePress
top: true
sticky: 1
---

# 🚀 入门指南

欢迎使用 My Docs 文档模板！本指南将帮助你快速搭建属于自己的文档站点。

## 前置要求

- [Node.js](https://nodejs.org/) 24+
- 包管理器（npm / yarn / pnpm）

## 快速开始

### 1. 克隆模板

```bash
git clone https://github.com/aiastia123/my-docs.git
cd my-docs
```

### 2. 安装依赖

```bash
npm install
```

### 3. 启动开发服务器

```bash
npm run docs:dev
```

访问 `http://localhost:5173` 即可预览。

### 4. 构建生产版本

```bash
npm run docs:build
```

构建产物在 `docs/.vitepress/dist` 目录中。

## 项目结构

```
my-docs/
├── docs/
│   ├── .vitepress/
│   │   ├── config.ts      # VitePress 配置文件
│   │   └── theme/
│   │       ├── index.ts    # 主题入口
│   │       └── style.css   # 自定义样式
│   ├── public/             # 静态资源
│   │   └── logo.svg
│   ├── guide/              # 指南文档
│   │   ├── getting-started.md
│   │   ├── configuration.md
│   │   ├── deployment.md
│   │   ├── markdown.md
│   │   ├── custom-theme.md
│   │   └── contributing.md
│   ├── dev/                # 开发文档
│   │   ├── basic.md
│   │   └── arch.md
│   ├── en/                 # 英文文档
│   │   ├── index.md
│   │   ├── guide/
│   │   └── dev/
│   └── index.md            # 首页
├── package.json
└── README.md
```

## 下一步

- 📖 阅读 [配置说明](/guide/configuration) 了解如何自定义站点
- 🎨 查看 [自定义主题](/guide/custom-theme) 打造个性化外观
- 📦 学习 [Markdown 扩展](/guide/markdown) 充分利用排版能力
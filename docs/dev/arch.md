---
title: 架构介绍
date: 2024-02-02
categories:
  - 开发文档
tags:
  - 架构
top: true
sticky: 2
---

# 🏗️ 架构介绍

本页面介绍项目的技术架构和设计理念。

## 技术栈

| 技术 | 用途 | 版本 |
|------|------|------|
| [VitePress](https://vitepress.dev) | 静态站点生成 | 1.x |
| [Vue 3](https://vuejs.org) | UI 组件（VitePress 内置） | 3.x |
| [Vite](https://vitejs.dev) | 构建工具（VitePress 内置） | 5.x |
| [Markdown It](https://github.com/markdown-it/markdown-it) | Markdown 解析 | - |

## 架构设计

```
┌─────────────────────────────────────┐
│           VitePress 引擎             │
├─────────────────────────────────────┤
│  config.ts   │   theme/   │  public/│
│  站点配置     │  主题定制   │  静态资源│
├──────────────┴────────────┴─────────┤
│              Markdown 文档           │
│   guide/    │    dev/    │   en/    │
│   使用指南   │   开发文档  │  英文文档 │
├──────────────┴────────────┴─────────┤
│            构建输出 (dist)           │
└─────────────────────────────────────┘
```

## 核心模块

### 配置系统 (`config.ts`)

VitePress 的核心配置文件，控制：

- 站点元信息（标题、描述、语言）
- 导航栏和侧边栏结构
- 多语言路由
- 搜索功能
- 主题定制

### 主题系统 (`theme/`)

基于 VitePress 默认主题扩展：

- `index.ts` - 主题入口，注册自定义组件
- `style.css` - CSS 变量覆盖，自定义样式

### 内容系统

Markdown 文档按语言和类别组织：

- `guide/` - 使用指南，面向用户
- `dev/` - 开发文档，面向开发者
- `en/` - 英文版本，结构与中文一致

## 构建流程

```
Markdown → Markdown It 解析 → Vue SFC 编译 → Vite 构建 → 静态 HTML
```

1. **Markdown 解析**：Markdown It 将 `.md` 文件转为 HTML
2. **Vue 编译**：支持在 Markdown 中使用 Vue 组件语法
3. **Vite 构建**：打包优化，输出静态文件
4. **SSR 预渲染**：每个页面预渲染为静态 HTML（SEO 友好）

## 扩展点

### 自定义组件

在 Markdown 中使用 Vue 组件：

```md
<script setup>
import CustomComponent from './CustomComponent.vue'
</script>

<CustomComponent />
```

### Frontmatter

每页可通过 frontmatter 控制布局：

```yaml
---
layout: doc        # 文档布局
title: 页面标题
editLink: true
lastUpdated: true
---
```

## 部署架构

推荐部署方式：

- **GitHub Pages** - 免费，适合开源项目
- **Vercel** - 自动部署，CDN 加速
- **Netlify** - 类似 Vercel，功能丰富
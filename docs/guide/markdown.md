---
title: Markdown 扩展
date: 2024-01-04
categories:
  - 进阶使用
tags:
  - Markdown
---

# 📦 Markdown 扩展

VitePress 在标准 Markdown 基础上提供了许多扩展功能，帮助你编写更丰富的文档。

## GitHub 风格警报

使用 `:::` 容器语法创建提示框：

::: tip 提示
这是一个提示信息。
:::

::: info 信息
这是一个信息提示。
:::

::: warning 警告
这是一个警告信息。
:::

::: danger 危险
这是一个危险警告。
:::

::: details 点击展开
这是可折叠的详细内容。
:::

**代码：**

```markdown
::: tip 提示
这是一个提示信息。
:::

::: warning 警告
这是一个警告信息。
:::

::: details 点击展开
这是可折叠的详细内容。
:::
```

## 代码组

可以在多个代码块之间切换：

::: code-group
```bash [npm]
npm install
```

```bash [yarn]
yarn install
```

```bash [pnpm]
pnpm install
```
:::

**代码：**

````markdown
::: code-group
```bash [npm]
npm install
```

```bash [yarn]
yarn install
```
:::
````

## 代码行高亮

```ts{1,3-5}
function hello() {
  const name = 'world'
  console.log('Hello, ' + name)
  console.log('This line is highlighted')
  console.log('This one too')
  // This is not
}
```

**代码：**

````markdown
```ts{1,3-5}
function hello() {
  // ...
}
```
````

## 表格

| 特性 | 支持情况 | 说明 |
|------|:--------:|------|
| 表格 | ✅ | 标准 Markdown 语法 |
| 数学公式 | ✅ | 需要 KaTeX 插件 |
| Emoji | ✅ | 使用 `:emoji:` 语法 |
| 脚注 | ✅ | 标准语法 |

## Emoji

🎉 🚀 📦 🛠️ 🌻

可以使用 [Emoji 列表](https://github.com/markdown-it/markdown-it-emoji/blob/master/lib/data/full.mjs) 中的所有表情。

## 目录

使用 `[[toc]]` 可以在页面中插入目录。

## 自定义锚点

```markdown
## 标题 {#custom-anchor}
```

## 更多

完整的 Markdown 扩展请参考 [VitePress Markdown 指南](https://vitepress.dev/guide/markdown)。
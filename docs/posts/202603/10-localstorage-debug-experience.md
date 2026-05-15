---
title: VitePress 主题配置缓存问题排查与 localStorage 调试经验
date: 2026-03-10
tags:
  - VitePress
  - localStorage
  - 调试
  - SSR
categories:
  - 前端
---

# VitePress 主题配置缓存问题排查与 localStorage 调试经验

## 问题现象

VitePress 博客（使用 vitepress-theme-teek 主题）部署后，首页以**文档模式**显示时，不应该出现文章列表，但实际却出现了 `aria-label="文章列表"` 的博客内容区域。而本地开发环境一切正常。

## 问题根因

### localStorage 缓存

旧代码在组件初始化阶段就读取了 `localStorage`：

```js
const getInitialConfig = () => {
  const saved = localStorage.getItem("tk:configStyle");
  return saved ? configMap[saved] : teekDocConfig;
};
const teekConfig = ref(getInitialConfig());
```

当用户之前在线上站点切换到博客模式时，浏览器执行了：

```js
localStorage.setItem("tk:configStyle", "blog");
```

这个值**持久化保存在浏览器中**，即使关闭页面、重启浏览器也不会消失。下次访问首页时，组件初始化就读到了 `"blog"`，导致 `teekConfig` 被设置为博客配置（`teekHome: true`），从而渲染了文章列表。

### 本地正常的原因

`localhost:5173` 和 `github.io`（或自定义域名）是**不同的域名**，`localStorage` 按域名隔离，互不影响。所以本地没有缓存过博客配置，自然不会出现这个问题。

## 修复方案

### 核心思路：延迟读取 localStorage

```js
// 1. 初始化始终使用文档配置（不读 localStorage）
const teekConfig = ref<TeekConfig>(teekDocConfig);

// 2. onMounted 中才按需恢复用户之前的选择
onMounted(() => {
  const saved = localStorage.getItem("tk:configStyle");
  if (saved && configMap[saved]) {
    // 在客户端动态切换到用户保存的配置
    Object.assign(teekConfig.value, configMap[saved]);
  }
});
```

这样即使 localStorage 中缓存了 `"blog"`，**首次 HTML 渲染一定是文档模式**，等页面加载完毕后才在客户端切换，避免了配置被错误覆盖的问题。

### 修复的好处

1. **SSR 水合一致**：服务端渲染和客户端初始渲染都使用 `teekDocConfig`，不会出现水合不匹配警告
2. **无闪烁**：用户不会看到从博客模式跳回文档模式的闪烁
3. **功能保留**：用户之前选择的配置仍然会在客户端恢复

## localStorage 查看方法

### 浏览器开发者工具

1. 打开目标网站
2. 按 `F12`（Windows/Linux）或 `Cmd + Option + I`（Mac）打开开发者工具
3. 切换到 **Application**（应用程序）标签页
4. 左侧面板找到 **Storage → Local Storage**
5. 点击展开，选择对应的域名
6. 右侧即可查看所有键值对

### 控制台操作

```js
// 查看某个 key 的值
localStorage.getItem("tk:configStyle");

// 查看所有 localStorage 内容
console.table(localStorage);

// 删除指定 key
localStorage.removeItem("tk:configStyle");

// 清空当前域名下所有 localStorage
localStorage.clear();
```

### 按域名隔离

| 域名 | localStorage |
|------|-------------|
| `http://localhost:5173` | 独立存储 |
| `https://your-domain.com` | 独立存储 |

每个域名的 localStorage 互不影响，这就是为什么本地开发正常但线上出问题的原因。

## 经验总结

1. **localStorage 是持久化的**：一旦写入，除非手动清除或代码清除，否则一直存在。用户切换过的配置状态会被长期保留。
2. **SSR 项目中慎用 localStorage**：在 VitePress 等 SSR/SSG 框架中，组件初始化阶段（setup）在服务端执行时没有 `localStorage`。如果在初始化时读取 localStorage，会导致服务端和客户端渲染不一致。
3. **延迟到 onMounted 读取**：`onMounted` 只在客户端执行，是读取浏览器 API（localStorage、window 等）的安全时机。
4. **调试时注意域名隔离**：本地开发环境和部署站点的 localStorage 不共享，遇到"本地正常、线上异常"的问题时要优先考虑缓存差异。
5. **养成清理缓存的习惯**：遇到奇怪的 UI 状态问题，先试试清 localStorage/Cookie 再刷新页面，排除缓存因素。
---
title: jsDelivr 缓存刷新方式
date: 2025-07-23
categories:
  - 技术文档
  - CDN
  - jsDelivr
tags:
  - jsDelivr
  - CDN
  - 缓存刷新
---

# jsDelivr 缓存刷新方式

对于 [jsDelivr](https://cdn.jsdelivr.net/)，缓存刷新的方式也很简单，只需将想刷新的链接的开头的 `https://cdn.jsdelivr.net/` 替换成 `https://purge.jsdelivr.net/` 即可。

## 使用示例

### 原始链接
```
https://cdn.jsdelivr.net/gh/aiastia/note@master/docs/public/blog/bg1.jpg
```

### 刷新缓存链接
```
https://purge.jsdelivr.net/gh/aiastia/note@master/docs/public/blog/bg1.jpg
```

## 工作原理

`purge.jsdelivr.net` 会触发 jsDelivr 重新从源服务器拉取文件，并清除之前的缓存。

## 适用场景

- 图片更新后立即看到新版本
- CSS 文件修改后强制刷新
- 静态资源更新后立即生效

## 注意事项

- `purge` 操作会消耗 jsDelivr API 配额
- 频繁刷新可能导致被限流
- 建议仅在更新后手动刷新

---

*创建时间：2025-07-23*

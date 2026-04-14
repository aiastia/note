---
title: 配置说明
date: 2024-01-02
categories:
  - 使用指南
tags:
  - 配置
---

# ⚙️ 配置说明

VitePress 的配置文件位于 `docs/.vitepress/config.ts`，以下是对各配置项的详细说明。

## 基础配置

```ts
export default defineConfig({
  // 站点标题
  title: 'My Docs',

  // 站点描述（用于 SEO）
  description: '基于 VitePress 的文档模板',

  // 部署基础路径
  // GitHub Pages 部署时需要设置为仓库名，如 '/my-docs/'
  base: '/',

  // 站点语言
  lang: 'zh-CN',

  // 启用最后更新时间
  lastUpdated: true,

  // 启用干净 URL（无 .html 后缀）
  cleanUrls: true,
})
```

## 多语言配置

```ts
locales: {
  root: {
    label: '简体中文',
    lang: 'zh-CN',
    link: '/',
  },
  en: {
    label: 'English',
    lang: 'en-US',
    link: '/en/',
  },
}
```

::: tip 提示
`root` 是默认语言，`link` 必须为 `/`。其他语言需要指定对应的 `link` 路径。
:::

## 导航栏配置

```ts
themeConfig: {
  nav: [
    { text: '使用指南', link: '/guide/getting-started' },
    { text: '开发文档', link: '/dev/basic' },
    {
      text: '更多',
      items: [
        { text: '更新日志', link: 'https://github.com/...' },
      ],
    },
  ],
}
```

## 侧边栏配置

```ts
themeConfig: {
  sidebar: {
    '/guide/': [
      {
        text: '快速开始',
        collapsed: false, // 是否默认折叠
        items: [
          { text: '入门指南', link: '/guide/getting-started' },
          { text: '配置说明', link: '/guide/configuration' },
        ],
      },
    ],
  },
}
```

::: warning 注意
`activeMatch` 用于控制导航栏高亮匹配规则。`link` 路径必须以 `/` 开头。
:::

## 搜索配置

模板已内置本地搜索，无需额外配置即可使用。如需自定义搜索文本：

```ts
search: {
  provider: 'local',
  options: {
    locales: {
      root: {
        translations: {
          button: { buttonText: '搜索文档' },
          modal: { noResultsText: '无法找到相关结果' },
        },
      },
    },
  },
}
```

## 完整配置参考

| 配置项 | 类型 | 说明 |
|--------|------|------|
| `title` | `string` | 站点标题 |
| `description` | `string` | 站点描述 |
| `base` | `string` | 部署基础路径 |
| `lang` | `string` | 默认语言 |
| `lastUpdated` | `boolean` | 显示更新时间 |
| `cleanUrls` | `boolean` | 干净 URL |
| `head` | `HeadConfig[]` | HTML 头部标签 |
| `locales` | `Locales` | 多语言配置 |
| `themeConfig` | `ThemeConfig` | 主题配置 |

更多配置请参考 [VitePress 官方文档](https://vitepress.dev/reference/site-config)。
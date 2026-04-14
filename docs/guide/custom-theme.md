# 🎨 自定义主题

本文介绍如何自定义文档站点的外观和样式。

## CSS 变量覆盖

在 `docs/.vitepress/theme/style.css` 中覆盖默认 CSS 变量：

```css
:root {
  /* 主题色 */
  --vp-c-brand-1: #3c8772;
  --vp-c-brand-2: #2f6d5a;
  --vp-c-brand-3: #245848;

  /* 首页 Hero 名称颜色 */
  --vp-home-hero-name-color: transparent;
  --vp-home-hero-name-background: linear-gradient(135deg, #3c8772, #2f6d5a);

  /* Hero 图片背景光效 */
  --vp-home-hero-image-background-image: linear-gradient(
    135deg,
    rgba(60, 135, 114, 0.2),
    rgba(47, 109, 90, 0.1)
  );
  --vp-home-hero-image-filter: blur(44px);
}
```

## 自定义布局

可以通过在 `docs/.vitepress/theme/index.ts` 中注册自定义组件来扩展布局：

```ts
import DefaultTheme from 'vitepress/theme'
import type { Theme } from 'vitepress'

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    // 注册全局组件
    // app.component('MyComponent', MyComponent)
  },
} satisfies Theme
```

## 暗色模式

VitePress 默认支持暗色模式。你可以自定义暗色模式下的样式：

```css
.dark {
  --vp-c-brand-1: #5abf9e;
  --vp-c-brand-2: #4aad8c;
}
```

## 自定义首页

首页使用 `layout: home` frontmatter 配置，可以自定义：

- `hero` - 主标题区域
- `features` - 特性展示区域
- `actions` - 操作按钮

详细配置请参考 [VitePress 主题配置](https://vitepress.dev/reference/default-theme-config)。

## 添加 Google Analytics

在 `config.ts` 中添加：

```ts
export default defineConfig({
  head: [
    [
      'script',
      {
        async: '',
        src: 'https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX',
      },
    ],
    [
      'script',
      {},
      `window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', 'G-XXXXXXXXXX');`,
    ],
  ],
})
```

## 自定义 404 页面

在 `docs/.vitepress/theme/` 下可以自定义 404 页面布局。
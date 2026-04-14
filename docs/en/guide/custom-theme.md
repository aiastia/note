# 🎨 Custom Theme

Learn how to customize the appearance of your docs site.

## CSS Variables

Override default CSS variables in `docs/.vitepress/theme/style.css`:

```css
:root {
  /* Brand colors */
  --vp-c-brand-1: #3c8772;
  --vp-c-brand-2: #2f6d5a;
  --vp-c-brand-3: #245848;

  /* Hero name gradient */
  --vp-home-hero-name-color: transparent;
  --vp-home-hero-name-background: linear-gradient(135deg, #3c8772, #2f6d5a);

  /* Hero image glow */
  --vp-home-hero-image-background-image: linear-gradient(
    135deg,
    rgba(60, 135, 114, 0.2),
    rgba(47, 109, 90, 0.1)
  );
}
```

## Custom Layout

Extend the default theme in `docs/.vitepress/theme/index.ts`:

```ts
import DefaultTheme from 'vitepress/theme'
import type { Theme } from 'vitepress'

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    // Register global components
    // app.component('MyComponent', MyComponent)
  },
} satisfies Theme
```

## Dark Mode

VitePress supports dark mode by default. Customize dark mode styles:

```css
.dark {
  --vp-c-brand-1: #5abf9e;
  --vp-c-brand-2: #4aad8c;
}
```

## Home Page

The home page uses `layout: home` frontmatter. Customize:

- `hero` - Title area
- `features` - Feature showcase
- `actions` - Action buttons

See [VitePress Theme Config](https://vitepress.dev/reference/default-theme-config) for details.
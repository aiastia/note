# ⚙️ Configuration

The VitePress config file is located at `docs/.vitepress/config.ts`.

## Basic Config

```ts
export default defineConfig({
  title: 'My Docs',
  description: 'A VitePress docs template',
  base: '/',
  lang: 'zh-CN',
  lastUpdated: true,
  cleanUrls: true,
})
```

## i18n Config

```ts
locales: {
  root: { label: 'Chinese', lang: 'zh-CN', link: '/' },
  en: { label: 'English', lang: 'en-US', link: '/en/' },
}
```

::: tip
`root` is the default locale. `link` must be `/`. Other locales need their own `link` path.
:::

## Navigation

```ts
themeConfig: {
  nav: [
    { text: 'Guide', link: '/guide/getting-started' },
    { text: 'Dev', link: '/dev/basic' },
    {
      text: 'More',
      items: [
        { text: 'Changelog', link: 'https://github.com/...' },
      ],
    },
  ],
}
```

## Sidebar

```ts
themeConfig: {
  sidebar: {
    '/guide/': [
      {
        text: 'Getting Started',
        collapsed: false,
        items: [
          { text: 'Quick Start', link: '/guide/getting-started' },
          { text: 'Configuration', link: '/guide/configuration' },
        ],
      },
    ],
  },
}
```

## Search

Local search is enabled by default. Customize search text:

```ts
search: {
  provider: 'local',
  options: {
    locales: {
      en: {
        translations: {
          button: { buttonText: 'Search' },
          modal: { noResultsText: 'No results found' },
        },
      },
    },
  },
}
```

## Config Reference

| Option | Type | Description |
|--------|------|-------------|
| `title` | `string` | Site title |
| `description` | `string` | Site description |
| `base` | `string` | Deploy base path |
| `lang` | `string` | Default language |
| `lastUpdated` | `boolean` | Show last updated time |
| `cleanUrls` | `boolean` | Clean URLs (no .html) |
| `head` | `HeadConfig[]` | HTML head tags |
| `locales` | `Locales` | i18n config |
| `themeConfig` | `ThemeConfig` | Theme config |

See [VitePress Site Config](https://vitepress.dev/reference/site-config) for full reference.
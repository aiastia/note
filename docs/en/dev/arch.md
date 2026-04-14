# 🏗️ Architecture

This page introduces the technical architecture and design of the project.

## Tech Stack

| Tech | Purpose | Version |
|------|---------|---------|
| [VitePress](https://vitepress.dev) | Static site generator | 1.x |
| [Vue 3](https://vuejs.org) | UI components (built-in) | 3.x |
| [Vite](https://vitejs.dev) | Build tool (built-in) | 5.x |
| [Markdown It](https://github.com/markdown-it/markdown-it) | Markdown parser | - |

## Architecture

```
┌─────────────────────────────────────┐
│           VitePress Engine           │
├─────────────────────────────────────┤
│  config.ts   │   theme/   │  public/│
│  Site config │  Theme      │  Assets │
├──────────────┴────────────┴─────────┤
│           Markdown Docs              │
│   guide/    │    dev/    │   en/    │
├──────────────┴────────────┴─────────┤
│         Build Output (dist)          │
└─────────────────────────────────────┘
```

## Core Modules

### Config System (`config.ts`)

Controls site metadata, navigation, sidebar, i18n routing, search, and theming.

### Theme System (`theme/`)

Extends the default VitePress theme:

- `index.ts` - Theme entry, register custom components
- `style.css` - CSS variable overrides

### Content System

Markdown docs organized by language and category:

- `guide/` - User guides
- `dev/` - Developer documentation
- `en/` - English version (mirrors Chinese structure)

## Build Flow

```
Markdown → Markdown It → Vue SFC → Vite Build → Static HTML
```

1. **Parse** Markdown It converts `.md` to HTML
2. **Compile** Vue SFC compilation for component support
3. **Build** Vite bundles and optimizes
4. **SSR** Pre-renders each page to static HTML (SEO friendly)

## Deployment

Recommended platforms:

- **GitHub Pages** - Free, ideal for open source
- **Vercel** - Auto-deploy with CDN
- **Netlify** - Feature-rich, similar to Vercel
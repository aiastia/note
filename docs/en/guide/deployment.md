# 🚀 Deployment

This guide covers deploying your docs site to various platforms.

## Build Output

Run the build command, static files will be in `docs/.vitepress/dist`:

```bash
npm run docs:build
```

## GitHub Pages

### 1. Set base path

In `docs/.vitepress/config.ts`:

```ts
export default defineConfig({
  base: '/my-docs/', // your repo name
})
```

### 2. Create GitHub Actions workflow

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy
on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 24
          cache: npm
      - run: npm ci
      - run: npm run docs:build
      - uses: actions/upload-pages-artifact@v3
        with:
          path: docs/.vitepress/dist
  deploy:
    needs: build
    runs-on: ubuntu-latest
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

::: tip
`node-version: 24` is the Actions runtime Node version, not your project minimum.
:::

### 3. Enable GitHub Pages

In repo Settings → Pages, set Source to **GitHub Actions**.

## Vercel

Import your GitHub repo on [Vercel](https://vercel.com) and configure:

| Setting | Value |
|---------|-------|
| Framework Preset | VitePress |
| Build Command | `npm run docs:build` |
| Output Directory | `docs/.vitepress/dist` |

## Netlify

Import on [Netlify](https://netlify.com) and configure:

| Setting | Value |
|---------|-------|
| Build Command | `npm run docs:build` |
| Publish Directory | `docs/.vitepress/dist` |

::: tip
Vercel and Netlify provide free CDN and HTTPS out of the box.
:::
# 🚀 部署上线

本文介绍如何将文档站点部署到各大平台。

## 构建产物

运行构建命令后，静态文件会输出到 `docs/.vitepress/dist` 目录：

```bash
npm run docs:build
```

## GitHub Pages

### 1. 配置 base 路径

在 `docs/.vitepress/config.ts` 中设置 `base`：

```ts
export default defineConfig({
  base: '/my-docs/', // 替换为你的仓库名
})
```

### 2. 创建 GitHub Actions 工作流

在 `.github/workflows/deploy.yml` 中添加：

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

concurrency:
  group: pages
  cancel-in-progress: false

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
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    needs: build
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

::: tip
`node-version: 24` 是 Actions 运行环境的 Node 版本，与项目最低要求无关。
:::

### 3. 启用 GitHub Pages

在仓库 Settings → Pages 中，将 Source 设为 **GitHub Actions**。

## Vercel

### 1. 导入项目

在 [Vercel](https://vercel.com) 中导入 GitHub 仓库。

### 2. 配置构建

| 配置项 | 值 |
|--------|-----|
| Framework Preset | VitePress |
| Build Command | `npm run docs:build` |
| Output Directory | `docs/.vitepress/dist` |

### 3. vercel.json（可选）

```json
{
  "github": { "silent": true }
}
```

## Netlify

### 1. 导入项目

在 [Netlify](https://netlify.com) 中导入 GitHub 仓库。

### 2. 配置构建

| 配置项 | 值 |
|--------|-----|
| Build Command | `npm run docs:build` |
| Publish Directory | `docs/.vitepress/dist` |

## Cloudflare Pages

### 1. 通过 Dashboard 部署

在 [Cloudflare Dashboard](https://dash.cloudflare.com/) 中进入 **Workers & Pages** → **Create** → **Pages** → **Connect to Git**，选择你的 GitHub 仓库。

配置构建：

| 配置项 | 值 |
|--------|-----|
| Framework Preset | `None` |
| Build Command | `npm run docs:build` |
| Build output directory | `docs/.vitepress/dist` |

项目根目录已包含 `wrangler.toml` 配置文件，Cloudflare 会自动读取其中的构建命令和输出目录。

::: tip 自动适配 base 路径
`config.ts` 会自动检测 Cloudflare Pages 构建环境（通过 `CF_PAGES` 环境变量），自动将 `base` 设为 `/`，无需手动修改配置。
:::

### 2. 通过 Wrangler CLI 部署

安装 Wrangler 并登录：

```bash
npm install -g wrangler
wrangler login
```

构建并部署：

```bash
npm run docs:build
npx wrangler pages deploy docs/.vitepress/dist --project-name=my-docs
```

::: tip 提示
Cloudflare Pages 提供免费的 CDN 加速、HTTPS 和全球边缘网络，速度非常快。
:::

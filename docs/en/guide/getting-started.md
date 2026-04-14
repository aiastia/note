# 🚀 Getting Started

Welcome to the My Docs template! This guide will help you set up your own documentation site.

## Prerequisites

- [Node.js](https://nodejs.org/) 18+
- Package manager (npm / yarn / pnpm)

## Quick Start

### 1. Clone the template

```bash
git clone https://github.com/aiastia123/my-docs.git
cd my-docs
```

### 2. Install dependencies

```bash
npm install
```

### 3. Start dev server

```bash
npm run docs:dev
```

Visit `http://localhost:5173` to preview.

### 4. Build for production

```bash
npm run docs:build
```

The output will be in `docs/.vitepress/dist`.

## Project Structure

```
my-docs/
├── docs/
│   ├── .vitepress/
│   │   ├── config.ts      # VitePress config
│   │   └── theme/
│   │       ├── index.ts    # Theme entry
│   │       └── style.css   # Custom styles
│   ├── public/             # Static assets
│   │   └── logo.svg
│   ├── guide/              # Guide docs (Chinese)
│   ├── dev/                # Dev docs (Chinese)
│   ├── en/                 # English docs
│   │   ├── guide/
│   │   └── dev/
│   └── index.md            # Home page
├── package.json
└── README.md
```

## Next Steps

- 📖 Read [Configuration](/en/guide/configuration) to customize your site
- 🎨 Check [Custom Theme](/en/guide/custom-theme) for personalization
- 📦 Learn [Markdown Extensions](/en/guide/markdown) for rich content
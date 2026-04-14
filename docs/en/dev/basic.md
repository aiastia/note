# 📝 Quick Start (Development)

This is a template page for your development documentation.

## Overview

Describe your project's development workflow and concepts here.

::: tip
This is a template page. Modify the content to fit your project.
:::

## Environment Setup

### Requirements

- Node.js 18+
- Your project dependencies...

### Install

```bash
npm install
npm run docs:dev
```

## Development Flow

### 1. Create a feature branch

```bash
git checkout -b feature/your-feature
```

### 2. Write code

Follow project conventions.

### 3. Test

```bash
npm run test
```

### 4. Commit

```bash
git add .
git commit -m "feat: describe your changes"
```

## Code Conventions

### Directory Structure

```
src/
├── components/    # Components
├── utils/         # Utilities
├── types/         # Type definitions
└── index.ts       # Entry point
```

### Naming Conventions

| Type | Convention | Example |
|------|-----------|---------|
| Files | kebab-case | `my-component.ts` |
| Classes | PascalCase | `MyComponent` |
| Functions | camelCase | `getData()` |
| Constants | UPPER_SNAKE | `MAX_COUNT` |

## FAQ

### How to debug?

VitePress supports HMR in dev mode. Changes are reflected instantly.

### How to add a new page?

1. Create a `.md` file in the appropriate directory
2. Register in `config.ts` sidebar
3. Write content

## See Also

- [Architecture](/en/dev/arch)
- [Contributing](/en/guide/contributing)
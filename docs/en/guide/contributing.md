# 🤝 Contributing

Thanks for your interest in contributing! Here's how to get started.

## Reporting Issues

1. Search [GitHub Issues](https://github.com/aiastia123/my-docs/issues) for existing reports
2. Create a new Issue with detailed description and reproduction steps

## Submitting Code

1. **Fork** the repository

```bash
git clone https://github.com/your-username/my-docs.git
cd my-docs
```

2. **Create a branch**

```bash
git checkout -b feature/your-feature
```

3. **Install and develop**

```bash
npm install
npm run docs:dev
```

4. **Commit and push**

```bash
git add .
git commit -m "feat: your changes"
git push origin feature/your-feature
```

5. **Create a Pull Request** on GitHub

## Writing Guidelines

- Use Markdown for documentation
- Use Emoji sparingly for readability
- Specify language in code blocks
- Use `::: tip` / `::: warning` callouts
- Place images in `docs/public/`

### Commit Convention

| Type | Description |
|------|-------------|
| `feat` | New feature |
| `fix` | Bug fix |
| `docs` | Documentation change |
| `style` | Code format (no functional change) |
| `refactor` | Refactoring |
| `chore` | Build/tooling change |

## Adding New Pages

1. Create `.md` file in the appropriate directory
2. Register in `config.ts` sidebar
3. Write content

```
docs/
├── guide/          # Guide (Chinese)
├── dev/            # Dev docs (Chinese)
└── en/
    ├── guide/      # Guide (English)
    └── dev/        # Dev docs (English)
```

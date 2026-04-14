# 📦 Markdown Extensions

VitePress extends standard Markdown with powerful features.

## GitHub-style Alerts

Use `:::` containers for callouts:

::: tip Tip
This is a tip.
:::

::: info Info
This is info.
:::

::: warning Warning
This is a warning.
:::

::: danger Danger
This is a danger warning.
:::

::: details Click to expand
Foldable content here.
:::

**Code:**

```markdown
::: tip Tip
This is a tip.
:::

::: warning Warning
This is a warning.
:::
```

## Code Groups

Switch between multiple code blocks:

::: code-group
```bash [npm]
npm install
```

```bash [yarn]
yarn install
```

```bash [pnpm]
pnpm install
```
:::

## Line Highlighting

```ts{1,3-5}
function hello() {
  const name = 'world'
  console.log('Hello, ' + name)
  console.log('This line is highlighted')
  console.log('This one too')
  // This is not
}
```

## Tables

| Feature | Support | Notes |
|---------|:-------:|-------|
| Tables | ✅ | Standard Markdown |
| Math | ✅ | Needs KaTeX plugin |
| Emoji | ✅ | Use `:emoji:` syntax |

## More

See [VitePress Markdown Guide](https://vitepress.dev/guide/markdown) for full reference.
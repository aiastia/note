# 📝 My Docs

这是我的文档网站模板，基于 VitePress 2 构建。

> 🌐 [在线预览](https://my.aiastia.me/note/)

## ☁️ 一键部署

点击下方按钮，即可将此项目部署到对应平台（会自动 Fork 仓库并部署）：

[![Deploy to Cloudflare Pages](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/aiastia123/my-docs)
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/aiastia123/my-docs)
[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/aiastia123/my-docs)

---

## 🚀 日常使用（只需 3 步）

### 第 1 步：写 Markdown 文件

在 `docs/` 目录下创建 `.md` 文件就行了！比如：

```
docs/guide/my-new-page.md   ← 中文文档放这里
docs/en/guide/my-new-page.md ← 英文文档放这里
```

### 第 2 步：注册到侧边栏

打开 `docs/.vitepress/config.ts`，在 `sidebar` 里加一行：

```ts
// 找到对应的位置，加一行：
{ text: '我的新页面', link: '/guide/my-new-page' }
```

### 第 3 步：本地预览 & 推送

```bash
npm run docs:dev    # 本地预览（浏览器打开 localhost:5173）
git add .           # 添加文件
git commit -m "docs: 添加新页面"
git push            # 推送到 GitHub，自动部署
```

**就这样！没有第 4 步了。**

---

## 📂 目录结构（你需要关心的部分）

```
docs/
├── guide/              ← 📖 使用指南（中文）
│   ├── getting-started.md
│   ├── configuration.md
│   └── ...在这里添加新的指南页面
├── dev/                ← 💻 开发文档（中文）
│   ├── basic.md
│   └── ...在这里添加新的开发页面
├── en/                 ← 🌍 英文文档（和中文一一对应）
│   ├── guide/
│   └── dev/
└── index.md            ← 🏠 首页
```

> 💡 **简单记**：中文放 `docs/guide/` 或 `docs/dev/`，英文放 `docs/en/` 对应位置。

---

## ✍️ Markdown 写法速查

写文档只需要会用 Markdown 就行，以下是常用语法：

```markdown
# 一级标题（页面大标题）

## 二级标题

### 三级标题

普通文字，**加粗**，*斜体*，`代码`

- 列表项 1
- 列表项 2

1. 有序列表 1
2. 有序列表 2

[链接文字](https://example.com)

![图片描述](./path/to/image.png)

> 这是引用/提示框

| 表头 1 | 表头 2 |
|--------|--------|
| 内容 1 | 内容 2 |

\```bash
代码块
\```

---

<!-- 提示框（VitePress 扩展语法） -->
::: tip 提示
这是一个提示框
:::

::: warning 注意
这是一个警告框
:::
```

---

## 🔧 配置文件说明

| 文件 | 作用 | 你需要改吗？ |
|------|------|-------------|
| `docs/.vitepress/config.ts` | 站点配置、导航栏、侧边栏 | ✅ 添加新页面时改 |
| `docs/.vitepress/theme/style.css` | 自定义样式、颜色 | 随意 |
| `package.json` | 项目依赖 | 一般不用改 |

---

## 📋 添加新页面的完整示例

假设你要添加一个叫「API 接口」的页面：

### 1. 创建文件

创建 `docs/guide/api.md`：

```markdown
# 📡 API 接口文档

这是 API 接口的说明。

## 用户接口

### 获取用户信息

**请求地址：** \`GET /api/user\`

**返回示例：**

\```json
{
  "name": "张三",
  "age": 25
}
\```

::: tip 提示
需要在 Header 中携带 Token。
:::
```

### 2. 修改配置

打开 `docs/.vitepress/config.ts`，找到 `sidebar` 的中文部分：

```ts
// 在 items 数组里加一行：
{ text: '📡 API 接口', link: '/guide/api' }
```

如果要英文版，同样在 `docs/en/guide/api.md` 创建文件，并在配置的英文 sidebar 里注册。

### 3. 完成！

本地预览确认没问题后，`git push` 推送即可。

---

## 🌍 中英文对照

每个中文页面都可以有对应的英文版：

| 中文 | 英文 |
|------|------|
| `docs/guide/getting-started.md` | `docs/en/guide/getting-started.md` |
| `docs/guide/api.md` | `docs/en/guide/api.md` |
| `docs/dev/basic.md` | `docs/en/dev/basic.md` |

不需要英文版也可以，只写中文完全没问题。

---

## 🛠️ 常用命令

```bash
# 本地开发（修改后自动刷新）
npm run docs:dev

# 构建生产版本（检查有没有报错）
npm run docs:build

# 推送到 GitHub（会自动部署）
git add .
git commit -m "docs: 描述你改了什么"
git push
```

---

## ❓ 常见问题

### 页面显示 404？
检查 `config.ts` 里的 `link` 路径是否和文件路径对应（不要加 `.md` 后缀）。

### 侧边栏没有显示新页面？
需要在 `config.ts` 的 `sidebar` 里注册才会显示。

### 怎么修改网站标题/描述？
在 `config.ts` 里修改 `title` 和 `description` 字段。

### 怎么修改主题颜色？
编辑 `docs/.vitepress/theme/style.css`，修改 `--vp-c-brand-1` 等颜色变量。

### 推送后多久能看到更新？
GitHub Pages 自动部署，一般 1-3 分钟。

---

## 📦 环境要求

- [Node.js](https://nodejs.org/) 24+
- npm（Node.js 自带）

---

## ⚙️ 环境变量

| 变量名 | 说明 | 默认值 |
|--------|------|--------|
| `SITE_URL` | 站点域名（RSS 订阅使用） | `https://note.aiastia.com` |
| `BASE` | 部署基础路径 | CF Pages 为 `/`，本地为 `/note/` |

### 为什么不能用相对路径？

RSS 是一种 XML 格式的订阅标准（[RSS 2.0 规范](https://validator.w3.org/feed/docs/rss2.html)），要求所有链接必须是**完整域名**（如 `https://note.aiastia.com/posts/foo`），不支持相对路径。这是为了让 RSS 阅读器（如 Feedly、Inoreader）能正确跳转到文章页面。

### 换域名

设置 `SITE_URL` 环境变量即可：

```bash
# 方式 1：构建时指定
SITE_URL=https://newdomain.com npm run build

# 方式 2：项目根目录创建 .env 文件
echo "SITE_URL=https://newdomain.com" > .env
```

---

## 📄 License

MIT

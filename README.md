# 📝 My Docs

基于 [VitePress](https://vitepress.dev) 的现代化文档模板，参考 [LlmKira/Docs](https://github.com/LlmKira/Docs) 构建。

## ✨ 特性

- 🏠 Hero 首页布局，支持特性展示
- 🌍 中英文双语支持，一键切换
- 🔍 内置全文搜索
- 🎨 自定义主题色和 CSS 变量
- 🌙 暗色模式支持
- 📱 响应式设计
- 🚀 支持多种平台一键部署

## 📦 快速开始

### 环境要求

- [Node.js](https://nodejs.org/) 22+
- npm / yarn / pnpm

### 安装与运行

```bash
# 克隆仓库
git clone https://github.com/aiastia123/my-docs.git
cd my-docs

# 安装依赖
npm install

# 启动开发服务器
npm run docs:dev
```

访问 `http://localhost:5173` 即可预览。

### 构建

```bash
npm run docs:build
```

构建产物在 `docs/.vitepress/dist` 目录。

## 📁 项目结构

```
my-docs/
├── docs/
│   ├── .vitepress/
│   │   ├── config.ts          # VitePress 配置
│   │   └── theme/
│   │       ├── index.ts        # 主题入口
│   │       └── style.css       # 自定义样式
│   ├── public/                 # 静态资源
│   ├── guide/                  # 中文使用指南
│   ├── dev/                    # 中文开发文档
│   ├── en/                     # 英文文档
│   │   ├── guide/
│   │   └── dev/
│   └── index.md                # 首页
├── package.json
└── README.md
```

## ✏️ 写新文档

1. 在 `docs/guide/` 或 `docs/dev/` 下创建新的 `.md` 文件
2. 在 `docs/.vitepress/config.ts` 的侧边栏函数中注册
3. （如需英文版）在 `docs/en/` 对应目录下创建同名文件

## 🚀 部署

支持部署到以下平台：

- **GitHub Pages** - 免费，适合开源项目
- **Vercel** - 自动部署，CDN 加速
- **Netlify** - 功能丰富

详细部署步骤请参考 [部署文档](https://aiastia123.github.io/my-docs/guide/deployment)。

## 🛠️ 自定义

### 修改主题色

编辑 `docs/.vitepress/theme/style.css`：

```css
:root {
  --vp-c-brand-1: #your-color;
  --vp-c-brand-2: #your-color-dark;
}
```

### 修改站点信息

编辑 `docs/.vitepress/config.ts` 中的 `title`、`description` 等字段。

## 📄 License

MIT
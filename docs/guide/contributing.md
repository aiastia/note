---
title: 贡献指南
date: 2024-01-06
categories:
  - 进阶使用
tags:
  - 贡献
---

# 🤝 贡献指南

感谢你对本项目的关注！以下是参与贡献的指南。

## 如何贡献

### 报告问题

如果你发现了 Bug 或有新功能建议：

1. 在 [GitHub Issues](https://github.com/aiastia123/my-docs/issues) 中搜索是否已有相关 Issue
2. 如果没有，创建新的 Issue，详细描述问题和复现步骤

### 提交代码

1. **Fork 仓库** 并克隆到本地

```bash
git clone https://github.com/your-username/my-docs.git
cd my-docs
```

2. **创建分支**

```bash
git checkout -b feature/your-feature
```

3. **安装依赖并开发**

```bash
npm install
npm run docs:dev
```

4. **提交更改**

```bash
git add .
git commit -m "feat: 添加新功能"
```

5. **推送并创建 PR**

```bash
git push origin feature/your-feature
```

## 文档编写规范

### 文件命名

- 使用小写字母和短横线：`getting-started.md`
- 文件名使用英文，即使内容是中文

### Frontmatter

每篇文档应包含 frontmatter：

```yaml
---
title: 页面标题
editLink: true
---
```

### 写作风格

- 使用 Markdown 编写文档
- 适当使用 Emoji 增强可读性
- 代码块标注语言类型
- 使用 `::: tip` / `::: warning` 提示框
- 图片放在 `docs/public/` 目录下

### Commit 规范

| 类型 | 说明 |
|------|------|
| `feat` | 新功能 |
| `fix` | 修复 Bug |
| `docs` | 文档变更 |
| `style` | 代码格式（不影响功能） |
| `refactor` | 重构 |
| `chore` | 构建/工具变更 |

## 目录结构

新增文档时，请在对应的语言目录下创建文件，并在 `config.ts` 中注册侧边栏。

```
docs/
├── guide/          # 中文指南
├── dev/            # 中文开发文档
└── en/
    ├── guide/      # 英文指南
    └── dev/        # 英文开发文档
```

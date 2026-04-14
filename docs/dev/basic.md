# 📝 快速开发

本页面为开发文档模板，你可以在这里编写你的开发指南。

## 概述

在这里介绍你的项目开发流程和基本概念。

::: tip 提示
这是一个模板页面，请根据你的项目实际情况修改内容。
:::

## 环境准备

### 开发环境要求

- Node.js 18+
- 你的项目其他依赖...

### 安装依赖

```bash
# 安装项目依赖
npm install

# 启动开发服务器
npm run docs:dev
```

## 开发流程

### 1. 创建功能分支

```bash
git checkout -b feature/your-feature
```

### 2. 编写代码

按照项目规范编写代码。

### 3. 测试

```bash
# 运行测试
npm run test
```

### 4. 提交代码

```bash
git add .
git commit -m "feat: 描述你的更改"
```

## 代码规范

### 目录结构

```
src/
├── components/    # 组件
├── utils/         # 工具函数
├── types/         # 类型定义
└── index.ts       # 入口文件
```

### 命名规范

| 类型 | 规范 | 示例 |
|------|------|------|
| 文件名 | kebab-case | `my-component.ts` |
| 类名 | PascalCase | `MyComponent` |
| 函数名 | camelCase | `getData()` |
| 常量 | UPPER_SNAKE | `MAX_COUNT` |

## 常见问题

### Q: 如何调试？

在开发模式下，VitePress 支持热更新，修改文件后自动刷新。

### Q: 如何添加新页面？

1. 在对应目录下创建 `.md` 文件
2. 在 `config.ts` 中注册侧边栏
3. 编写文档内容

## 相关链接

- [架构介绍](/dev/arch)
- [贡献指南](/guide/contributing)
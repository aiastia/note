---
title: GitHub Actions 环境变量与机密配置
date: 2024-10-16
categories:
  - GitHub
tags:
  - github
  - actions
  - CI/CD
  - secrets
  - 环境变量
---

# GitHub Actions 环境变量与机密配置

在 GitHub Actions 中，机密信息可以定义在不同的层级，调用方式也有所不同。

## 仓库机密（Repository Secrets）

直接使用 `secrets.SECRET_NAME` 语法访问：

```yaml
steps:
  - name: 使用仓库机密
    run: echo "${{ secrets.DOCKER_PASSWORD }}"
```

## 环境机密（Environment Secrets）

需要在 job 中指定 `environment` 字段后才能访问：

```yaml
jobs:
  deploy:
    runs-on: ubuntu-latest
    environment: production
    steps:
      - name: 访问环境机密
        run: echo "${{ secrets.ENV_SECRET_NAME }}"
```

`ENV_SECRET_NAME` 是在 `production` 环境中定义的机密，通过设置 `environment` 字段即可访问。

## 环境变量（非机密）

普通环境变量通过 `env` 字段定义：

```yaml
jobs:
  build:
    runs-on: ubuntu-latest
    env:
      NODE_VERSION: "18"
      BUILD_DIR: "./dist"
    steps:
      - name: 使用环境变量
        run: echo "Node $NODE_VERSION, 输出目录 $BUILD_DIR"
```

## 作用域对比

| 层级 | 定义位置 | 调用方式 | 适用场景 |
|------|----------|----------|----------|
| 仓库机密 | Settings → Secrets and variables → Actions | `secrets.NAME` | 通用密钥、Token |
| 环境机密 | Settings → Environments → xxx → Secrets | `secrets.NAME`（需指定 environment） | 按环境区分（dev/staging/production） |
| 环境变量 | 工作流文件 `env` 字段 | `env.NAME` 或 `$NAME` | 非敏感配置 |
| 组织机密 | 组织 Settings → Secrets | `secrets.NAME` | 跨仓库共享密钥 |

## 使用建议

- 敏感信息（密码、Token、密钥）使用 Secrets，不要写在代码里
- 不同环境使用不同的 Environment Secrets（如开发/生产）
- 普通配置项（版本号、路径）使用 `env` 字段
- GitHub 会对日志中的 Secrets 值自动脱敏（显示为 `***`）

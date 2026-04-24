---
title: MuMuAINovel - AI 智能小说创作助手部署
date: 2026-04-24
categories:
  - AI
tags:
  - AI
  - 小说
  - Docker
  - 工具
---

# MuMuAINovel - AI 智能小说创作助手部署

最近发现一个挺有意思的项目 [MuMuAINovel](https://github.com/xiamuceer-j/MuMuAINovel)，一款基于 AI 的智能小说创作助手，支持多种主流 AI 模型，可以帮你自动生成大纲、角色、世界观，甚至章节内容。

## 主要特性

- 🤖 **多 AI 模型支持** — OpenAI、Gemini、Claude 等主流模型
- 📝 **智能向导** — AI 自动生成大纲、角色和世界观
- 👥 **角色管理** — 人物关系、组织架构可视化管理
- 📖 **章节编辑** — 支持创建、编辑、重新生成和润色
- 🌐 **世界观设定** — 构建完整的故事背景
- 🎭 **职业等级体系** — 自定义修仙境界、魔法等级等多种体系
- 🔍 **伏笔管理** — 智能追踪剧情伏笔，提醒未回收线索
- 📚 **拆书功能** — 一键拆书分析

## 系统要求

| 组件 | 最低要求 | 推荐配置 |
|------|---------|---------|
| CPU | 2 核 | 4 核+ |
| 内存 | 2 GB | 8 GB+ |
| 存储 | 10 GB | 20 GB+ SSD |

本项目主要依赖外部 AI API（OpenAI/Claude/Gemini），不需要本地 GPU。

## Docker 部署

### 1. 创建目录

```bash
mkdir -p /opt/mumuainovel && cd /opt/mumuainovel
```

### 2. 创建 .env 配置文件

```bash
cat > .env << 'EOF'
# 数据库配置
POSTGRES_DB=mumuai_novel
POSTGRES_USER=mumuai
POSTGRES_PASSWORD=your_password_here

# 应用配置
APP_NAME=MuMuAINovel
APP_HOST=0.0.0.0
APP_PORT=8000

# AI 模型配置（至少配置一个）
# OPENAI_API_KEY=sk-xxx
# OPENAI_BASE_URL=https://api.openai.com/v1
EOF
```

### 3. 创建 docker-compose.yml

```yaml
services:
  postgres:
    image: postgres:18-alpine
    container_name: mumuainovel-postgres
    environment:
      POSTGRES_DB: ${POSTGRES_DB:-mumuai_novel}
      POSTGRES_USER: ${POSTGRES_USER:-mumuai}
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD:-123456}
      POSTGRES_INITDB_ARGS: "--encoding=UTF8 --locale=C"
      TZ: ${TZ:-Asia/Shanghai}
    volumes:
      - postgres_data:/var/lib/postgresql
      - ./backend/scripts/init_postgres.sql:/docker-entrypoint-initdb.d/init.sql:ro
    restart: unless-stopped
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U ${POSTGRES_USER:-mumuai} -d ${POSTGRES_DB:-mumuai_novel}"]
      interval: 10s
      timeout: 5s
      retries: 5
      start_period: 10s
    networks:
      - ai-story-network

  mumuainovel:
    image: mumujie/mumuainovel:latest
    container_name: mumuainovel
    depends_on:
      postgres:
        condition: service_healthy
    ports:
      - "${APP_PORT:-8000}:8000"
    volumes:
      - ./logs:/app/logs
      - ./storage/generated_covers:/app/storage/generated_covers
      - ./.env:/app/.env:ro
    environment:
      - APP_NAME=${APP_NAME:-MuMuAINovel}
      - APP_HOST=${APP_HOST:-0.0.0.0}
      - APP_PORT=8000
      - TZ=${TZ:-Asia/Shanghai}
    restart: unless-stopped
    networks:
      - ai-story-network

networks:
  ai-story-network:
    driver: bridge

volumes:
  postgres_data:
```

::: warning
需要先从项目仓库下载 `backend/scripts/init_postgres.sql` 文件到本地对应路径。或者直接 clone 整个仓库：
:::

```bash
# 方式一：clone 整个仓库
git clone https://github.com/xiamuceer-j/MuMuAINovel.git
cd MuMuAINovel
# 编辑 .env 后直接启动
docker compose up -d

# 方式二：只下载需要的文件
mkdir -p backend/scripts
curl -o backend/scripts/init_postgres.sql \
  https://raw.githubusercontent.com/xiamuceer-j/MuMuAINovel/main/backend/scripts/init_postgres.sql
```

### 4. 启动

```bash
docker compose up -d
```

启动后访问 `http://IP:8000` 即可。

## 使用说明

1. 首次访问需要注册账号（支持 LinuxDO OAuth 或本地账户）
2. 在设置中配置你的 AI API Key（至少需要一个）
3. 创建新项目 → 使用智能向导生成大纲和角色
4. 开始创作！

## 项目地址

- GitHub: [https://github.com/xiamuceer-j/MuMuAINovel](https://github.com/xiamuceer-j/MuMuAINovel)

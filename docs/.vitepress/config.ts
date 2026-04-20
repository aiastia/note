import { defineConfig } from "vitepress"
import { defineTeekConfig } from "vitepress-theme-teek/config"
import { readdirSync, readFileSync } from "node:fs"
import { resolve } from "node:path"

/**
 * Teek 主题配置
 * 文档：https://teek.seasir.top/
 */
const teekConfig = defineTeekConfig({
  // 启用侧边栏展开/折叠触发器
  sidebarTrigger: true,

  // 文章默认作者信息，会显示在文章列表和文章页
  author: { name: "西米露", link: "https://github.com/aiastia" },

  // 博主信息卡片，显示在首页左侧
  blogger: {
    name: "西米露",
    slogan: "记录技术探索与折腾之路",
    avatar: "https://avatars.githubusercontent.com/u/19776350?v=4",
    shape: "circle-rotate", // 头像形状：circle-rotate 旋转圆形
    circleSize: 120,        // 头像尺寸（px）
  },

  // 页脚信息配置
  footerInfo: {
    theme: {
      name: "Theme By Teek", // 主题名称显示
    },
    copyright: {
      createYear: 2026,    // 站点创建年份
      suffix: "西米露",     // 版权所有者
    },
  },

  // 文章列表配置
  post: {
    showCapture: true, // 是否在文章列表显示摘要截取内容
  },

  // 内置 Vite 插件配置
  vitePlugins: {
    // 侧边栏插件：按年月目录自动分组，按路径区分不同侧边栏
    sidebarOption: {
      path: "posts",                // 扫描 posts 目录
      collapsed: true,              // 分组默认折叠
      initItemsText: true,          // 显示目录名作为分组标题
      sortNumFromFileName: true,    // 按文件名前缀序号排序
      scannerRootMd: false,         // 不扫描根目录 md
      // 合并所有年月到 /posts/ 路径 + 手动添加 /ai/ 侧边栏
      sidebarResolved: (data: any) => {
        const result: Record<string, any> = {};

        // 1. 收集所有分组，合并到 /posts/ 下
        const allGroups: any[] = [];
        const obj = data as Record<string, any>;
        Object.keys(obj).forEach((key) => {
          const groups = obj[key];
          if (Array.isArray(groups)) {
            groups.forEach((group: any) => {
              if (group.items) {
                // 修正链接：补上 /posts 前缀
                group.items.forEach((item: any) => {
                  if (item.link && !item.link.startsWith("/posts")) {
                    item.link = "/posts" + (item.link.startsWith("/") ? "" : "/") + item.link;
                  }
                });
                // 文章倒序
                group.items.reverse();
              }
              allGroups.push(group);
            });
          }
        });

        // 按年份月份倒序排列
        allGroups.sort((a: any, b: any) => (b.text || "").localeCompare(a.text || ""));
        result["/posts/"] = allGroups;

        // 2. AI 页面侧边栏（自动扫描 docs/ai/ 目录生成）
        const aiDir = resolve("docs/ai");
        try {
          const aiFiles = readdirSync(aiDir)
            .filter((f: string) => f.endsWith(".md"))
            .sort();
          const aiItems = aiFiles.map((f: string) => {
            const link = `/ai/${f.replace(/\.md$/, "")}`;
            // 读取 frontmatter title 或 h1 标题
            const content = readFileSync(resolve(aiDir, f), "utf-8");
            const titleMatch = content.match(/^---\n[\s\S]*?^title:\s*["']?(.+?)["']?\s*$/m);
            const h1Match = content.match(/^#\s+(.+)$/m);
            const text = (titleMatch ? titleMatch[1] : h1Match ? h1Match[1] : f.replace(/\.md$/, "")).trim();
            return { text, link };
          });
          result["/ai/"] = aiItems;
        } catch {
          result["/ai/"] = [];
        }

        return result;
      },
    },
    // 排除 ai 目录下的文件，使其不出现在首页文章列表、归档、分类、标签中
    // 但仍可通过导航栏直接访问
    fileContentLoaderIgnore: ["**/ai/**"],
  },
})

/**
 * VitePress 站点配置
 */
export default defineConfig({
  extends: teekConfig,   // 继承 Teek 主题配置
  lang: "zh-CN",         // 站点语言：中文
  title: "西米露的笔记",  // 站点标题
  base: process.env.BASE || (process.env.CF_PAGES ? "/" : "/note"), // 部署基础路径：CF Pages 用根路径，本地用 /note
  description: "西米露的技术博客 - 记录技术探索与折腾之路", // 站点描述（SEO）
  lastUpdated: true,     // 启用「最近更新」时间显示
  cleanUrls: true,       // 启用干净 URL（去掉 .html 后缀）

  // HTML <head> 额外标签
  head: [
    ["meta", { name: "theme-color", content: "#3c8772" }], // 浏览器主题色（移动端地址栏颜色）
  ],

  themeConfig: {
    // 顶部导航栏
    nav: [
      { text: "首页", link: "/" },
      { text: "归档", link: "/@pages/archivesPage" },
      { text: "分类", link: "/@pages/categoriesPage" },
      { text: "标签", link: "/@pages/tagsPage" },
      { text: "🐾 Clawy 专栏", link: "/ai/clawy-first-post" },
    ],

    // 页面编辑链接（点击可跳转到 GitHub 编辑对应文件）
    editLink: {
      pattern: "https://github.com/aiastia/note/edit/tree/docs/:path",
      text: "在 GitHub 上编辑此页",
    },

    // 社交链接（显示在导航栏右侧）
    socialLinks: [
      { icon: "github", link: "https://github.com/aiastia" },
    ],

    // 页脚配置
    footer: {
      message: "基于 VitePress + Teek 主题构建",
      copyright: "Copyright © 2026-present 西米露",
    },

    // 「最近更新」时间显示配置
    lastUpdated: {
      text: "更新于",
      formatOptions: {
        dateStyle: "full",   // 完整日期格式
        timeStyle: "medium", // 中等时间格式
      },
    },

    // 文章大纲配置：显示 h1 ~ h3 级别标题
    outline: [1, 3],

    // 搜索配置：使用 VitePress 内置本地搜索
    search: {
      provider: "local",
    },
  },
})
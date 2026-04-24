import { defineConfig } from "vitepress"
import { teekConfig } from "./teekConfig"
import { RssPlugin } from "vitepress-plugin-rss"

/**
 * VitePress 站点配置
 */
export default defineConfig({
  extends: teekConfig,   // 继承 Teek 主题配置
  lang: "zh-CN",         // 站点语言：中文
  title: "YOLO的笔记",  // 站点标题
  base: process.env.BASE || (process.env.CF_PAGES ? "/" : "/note/"), // 部署基础路径：CF Pages 用根路径，本地用 /note
  description: "YOLO的技术博客 - 记录技术探索与折腾之路", // 站点描述（SEO）
  lastUpdated: true,     // 启用「最近更新」时间显示
  cleanUrls: true,       // 启用干净 URL（去掉 .html 后缀）

  // HTML <head> 额外标签
  head: [
    ["link", { rel: "icon", type: "image/svg+xml", href: "/logo.svg" }], // 网站图标（favicon）
    ["meta", { name: "theme-color", content: "#3c8772" }], // 浏览器主题色（移动端地址栏颜色）
  ],

  // RSS 订阅配置
  vite: {
    plugins: [
      RssPlugin({
        title: "YOLO的笔记",
        baseUrl: "https://note.aiastia.com",
        copyright: "Copyright © 2019-present YOLO",
        description: "YOLO的技术博客 - 记录技术探索与折腾之路",
      }),
    ],
  },

  themeConfig: {
    // 文章页底部导航文本
    docFooter: {
      prev: "上一页",
      next: "下一页",
    },
    // 顶部导航栏
    nav: [
      { text: "首页", link: "/" },
      { text: "📝 笔记", link: "/posts/" },
      { text: "🐾 Clawy 专栏", link: "/ai/" },
      {
        text: "功能页",
        items: [
          { text: "归档", link: "/@pages/archivesPage" },
          { text: "清单页", link: "/@pages/articleOverviewPage" },
          { text: "分类", link: "/@pages/categoriesPage" },
          { text: "标签", link: "/@pages/tagsPage" },
        ],
      },
    ],

    // 页面编辑链接（点击可跳转到 GitHub 编辑对应文件）
    editLink: {
      pattern: "https://github.com/aiastia/note/edit/master/docs/:path",
      text: "在 GitHub 上编辑此页",
    },

    // 社交链接（显示在导航栏右侧）
    socialLinks: [
      { icon: "github", link: "https://github.com/aiastia" },
    ],

    // 页脚配置
    footer: {
      message: "基于 VitePress + Teek 主题构建",
      copyright: "Copyright © 2026-present YOLO",
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
    outline: {
      level: [2, 3],
      label: "本页导航",
    },

    // 搜索配置：使用 VitePress 内置本地搜索
    search: {
      provider: "local",
      options: {
        locales: {
          root: { translations: { button: { buttonText: "搜索" } } },
        },
      },
    },

    // 暗色模式切换按钮文字中文化
    darkModeSwitchLabel: "主题模式",
    lightModeSwitchTitle: "切换到浅色模式",
    darkModeSwitchTitle: "切换到深色模式",

    // 导航栏菜单（移动端）
    sidebarMenuLabel: "菜单",
    returnToTopLabel: "回到顶部",
    langMenuLabel: "选择语言",
  },
})
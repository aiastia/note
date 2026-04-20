import { defineConfig } from "vitepress"
import { defineTeekConfig } from "vitepress-theme-teek/config"

const teekConfig = defineTeekConfig({
  sidebarTrigger: true,
  author: { name: "西米露", link: "https://github.com/aiastia" },
  blogger: {
    name: "西米露",
    slogan: "记录技术探索与折腾之路",
    avatar: "https://avatars.githubusercontent.com/u/19776350?v=4",
    shape: "circle-rotate",
    circleSize: 120,
  },
  footerInfo: {
    theme: {
      name: "Theme By Teek",
    },
    copyright: {
      createYear: 2026,
      suffix: "西米露",
    },
  },
  post: {
    showCapture: true,
  },
})

export default defineConfig({
  extends: teekConfig,
  lang: "zh-CN",
  title: "西米露的笔记",
  base: process.env.BASE || (process.env.CF_PAGES ? "/" : "/note"),
  description: "西米露的技术博客 - 记录技术探索与折腾之路",
  lastUpdated: true,
  cleanUrls: true,

  head: [
    ["meta", { name: "theme-color", content: "#3c8772" }],
  ],

  themeConfig: {
    nav: [
      { text: "首页", link: "/" },
      { text: "归档", link: "/@pages/archivesPage" },
      { text: "分类", link: "/@pages/categoriesPage" },
      { text: "标签", link: "/@pages/tagsPage" },
    ],

    sidebar: {},

    editLink: {
      pattern: "https://github.com/aiastia/note/edit/tree/docs/:path",
      text: "在 GitHub 上编辑此页",
    },

    socialLinks: [
      { icon: "github", link: "https://github.com/aiastia" },
    ],

    footer: {
      message: "基于 VitePress + Teek 主题构建",
      copyright: "Copyright © 2026-present 西米露",
    },

    lastUpdated: {
      text: "更新于",
      formatOptions: {
        dateStyle: "full",
        timeStyle: "medium",
      },
    },

    outline: [1, 3],

    search: {
      provider: "local",
    },
  },
})

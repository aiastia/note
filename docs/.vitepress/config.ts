import { defineConfig } from "vitepress"
import { defineTeekConfig } from "vitepress-theme-teek/config"

const teekConfig = defineTeekConfig({
  sidebarTrigger: true,
  author: { name: "未来", link: "https://github.com/aiastia" },
  blogger: {
    name: "西米露",
    slogan: "这也不会，那也不会",
    avatar: "https://avatars.githubusercontent.com/u/19776350?v=4",
    shape: "circle-rotate",
    circleSize: 120,
  },
  footerInfo: {
    theme: {
      name: "Theme By Teek",
    },
    copyright: {
      createYear: 2024,
      suffix: "aiastia",
    },
  },
  post: {
    showCapture: true,
  },
})

export default defineConfig({
  extends: teekConfig,
  lang: "zh-CN",
  title: "My Docs",
  base: process.env.BASE || (process.env.CF_PAGES ? "/" : "/my-docs/"),
  description: "基于 VitePress + Teek 主题的文档站",
  lastUpdated: true,
  cleanUrls: true,

  head: [
    ["meta", { name: "theme-color", content: "#3c8772" }],
  ],

  themeConfig: {
    nav: [
      { text: "首页", link: "/" },
      { text: "使用指南", link: "/guide/getting-started", activeMatch: "/guide/" },
      { text: "开发文档", link: "/dev/basic", activeMatch: "/dev/" },
      {
        text: "更多",
        items: [
          { text: "更新日志", link: "https://github.com/aiastia123/my-docs/releases" },
          { text: "贡献指南", link: "/guide/contributing" },
        ],
      },
    ],

    sidebar: {
      "/guide/": [
        {
          text: "快速开始",
          collapsed: false,
          items: [
            { text: "入门指南", link: "/guide/getting-started" },
            { text: "配置说明", link: "/guide/configuration" },
            { text: "部署上线", link: "/guide/deployment" },
          ],
        },
        {
          text: "进阶使用",
          collapsed: false,
          items: [
            { text: "Markdown 扩展", link: "/guide/markdown" },
            { text: "自定义主题", link: "/guide/custom-theme" },
            { text: "贡献指南", link: "/guide/contributing" },
          ],
        },
      ],
      "/dev/": [
        {
          text: "开发指南",
          items: [
            { text: "快速开发", link: "/dev/basic" },
            { text: "架构介绍", link: "/dev/arch" },
          ],
        },
      ],
    },

    editLink: {
      pattern: "https://github.com/aiastia123/my-docs/edit/teek/docs/:path",
      text: "在 GitHub 上编辑此页",
    },

    socialLinks: [
      { icon: "github", link: "https://github.com/aiastia123/my-docs" },
    ],

    footer: {
      message: "基于 VitePress + Teek 主题构建",
      copyright: "Copyright © 2024-present",
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

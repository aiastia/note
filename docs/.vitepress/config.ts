import { defineConfig } from 'vitepress'

export default defineConfig({
  // 基本信息
  lang: 'zh-CN',
  title: 'My Docs',
  // 如果部署到 GitHub Pages，请修改 base 为你的仓库名，如 '/my-docs/'
  base: '/',
  description: '基于 VitePress 的文档模板',

  // 功能开关
  lastUpdated: true,
  cleanUrls: true,

  // 多语言支持
  locales: {
    root: {
      label: '简体中文',
      lang: 'zh-CN',
      link: '/',
    },
    en: {
      label: 'English',
      lang: 'en-US',
      link: '/en/',
    },
  },

  // HTML 头部配置
  head: [
    ['meta', { name: 'theme-color', content: '#3c8772' }],
    ['link', { rel: 'icon', type: 'image/svg+xml', href: '/logo.svg' }],
  ],

  // 主题配置
  themeConfig: {
    nav: navBar(),
    siteTitle: 'My Docs',
    logo: '/logo.svg',

    sidebar: {
      '/guide/': sidebarGuide(),
      '/dev/': sidebarDev(),
      '/en/guide/': sidebarGuideEn(),
      '/en/dev/': sidebarDevEn(),
    },

    editLink: {
      pattern: 'https://github.com/aiastia123/my-docs/edit/main/docs/:path',
      text: '在 GitHub 上编辑此页',
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/aiastia123/my-docs' },
    ],

    footer: {
      message: '基于 VitePress 构建',
      copyright: 'Copyright © 2024-present',
    },

    lastUpdated: {
      text: '更新于',
      formatOptions: {
        dateStyle: 'full',
        timeStyle: 'medium',
      },
    },

    outline: [1, 3],

    search: {
      provider: 'local',
      options: {
        locales: {
          root: {
            translations: {
              button: {
                buttonText: '搜索文档',
                buttonAriaLabel: '搜索文档',
              },
              modal: {
                noResultsText: '无法找到相关结果',
                resetButtonTitle: '清除查询条件',
                footer: {
                  selectText: '选择',
                  navigateText: '切换',
                },
              },
            },
          },
          en: {
            translations: {
              button: {
                buttonText: 'Search',
                buttonAriaLabel: 'Search',
              },
              modal: {
                noResultsText: 'No results found',
                resetButtonTitle: 'Reset search',
                footer: {
                  selectText: 'Select',
                  navigateText: 'Navigate',
                },
              },
            },
          },
        },
      },
    },
  },
})

/* ========================================
 * 导航栏配置
 * ======================================== */
function navBar() {
  return [
    { text: '使用指南', link: '/guide/getting-started', activeMatch: '/guide/' },
    { text: '开发文档', link: '/dev/basic', activeMatch: '/dev/' },
    {
      text: '更多',
      items: [
        {
          text: '更新日志',
          link: 'https://github.com/aiastia123/my-docs/releases',
        },
        {
          text: '贡献指南',
          link: '/guide/contributing',
        },
      ],
    },
  ]
}

/* ========================================
 * 侧边栏 - 中文
 * ======================================== */
function sidebarGuide() {
  return [
    {
      text: '快速开始',
      collapsed: false,
      items: [
        { text: '入门指南', link: '/guide/getting-started' },
        { text: '配置说明', link: '/guide/configuration' },
        { text: '部署上线', link: '/guide/deployment' },
      ],
    },
    {
      text: '进阶使用',
      collapsed: false,
      items: [
        { text: 'Markdown 扩展', link: '/guide/markdown' },
        { text: '自定义主题', link: '/guide/custom-theme' },
        { text: '贡献指南', link: '/guide/contributing' },
      ],
    },
  ]
}

function sidebarDev() {
  return [
    {
      text: '开发指南',
      items: [
        { text: '快速开发', link: '/dev/basic' },
        { text: '架构介绍', link: '/dev/arch' },
      ],
    },
  ]
}

/* ========================================
 * 侧边栏 - 英文
 * ======================================== */
function sidebarGuideEn() {
  return [
    {
      text: 'Getting Started',
      collapsed: false,
      items: [
        { text: 'Getting Started', link: '/en/guide/getting-started' },
        { text: 'Configuration', link: '/en/guide/configuration' },
        { text: 'Deployment', link: '/en/guide/deployment' },
      ],
    },
    {
      text: 'Advanced',
      collapsed: false,
      items: [
        { text: 'Markdown Extensions', link: '/en/guide/markdown' },
        { text: 'Custom Theme', link: '/en/guide/custom-theme' },
        { text: 'Contributing', link: '/en/guide/contributing' },
      ],
    },
  ]
}

function sidebarDevEn() {
  return [
    {
      text: 'Development',
      items: [
        { text: 'Quick Start', link: '/en/dev/basic' },
        { text: 'Architecture', link: '/en/dev/arch' },
      ],
    },
  ]
}
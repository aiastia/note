import type { TeekConfig } from "vitepress-theme-teek";

// 文档配置
export const teekDocConfig: TeekConfig = {
  themeEnhance: {
    layoutSwitch: {
      defaultMode: "bothWidthAdjustable",
    },
  },
};

// 博客基础配置
const teekBlogCommonConfig: TeekConfig = {
  teekHome: true,
  vpHome: false,
  loading: true,
  wallpaper: {
    enabled: true,
    hideBanner: true,
  },
  friendLink: {
    list: [
      {
        name: "未来",
        desc: "记录学习与成长",
        avatar: "https://avatars.githubusercontent.com/u/19776350?v=4",
        link: "https://github.com/aiastia",
      },
      {
        name: "VitePress",
        desc: "由 Vite 和 Vue 驱动的静态站点生成器",
        avatar: "https://vitepress.dev/vitepress-logo-mini.svg",
        link: "https://vitepress.dev",
      },
      {
        name: "Teek 主题",
        desc: "轻量、简洁高效的 VitePress 主题",
        avatar: "https://vp.teek.top/teek-logo-mini.svg",
        link: "https://github.com/Kele-Bingtang/vitepress-theme-teek",
      },
    ],
    autoScroll: true,
  },
};

// 博客默认配置
export const teekBlogConfig: TeekConfig = {
  ...teekBlogCommonConfig,
  banner: {
    name: "🎉 西米露的笔记",
    description: "记录学习与成长",
    bgStyle: "partImg",
    imgSrc: ["/blog/bg1.jpg"],
  },
};

// 博客小图配置
export const teekBlogParkConfig: TeekConfig = {
  ...teekBlogCommonConfig,
  banner: {
    name: "🎉 西米露的笔记",
    bgStyle: "partImg",
    imgSrc: ["/blog/bg1.jpg"],
    description: [
      "记录学习与成长",
      "积跬步以至千里",
      "这一生波澜壮阔或是不惊都没问题",
    ],
    descStyle: "switch",
  },
  footerGroup: [
    {
      title: "链接",
      links: [
        { name: "GitHub", link: "https://github.com/aiastia" },
        { name: "Telegram", link: "https://t.me/aiastia" },
      ],
    },
    {
      title: "联系我",
      links: [
        { name: "X (Twitter)", link: "https://x.com/aiastia123" },
      ],
    },
  ],
};

// 博客大图配置
export const teekBlogFullConfig: TeekConfig = {
  ...teekBlogCommonConfig,
  post: {
    coverImgMode: "full",
  },
  banner: {
    name: "🎉 西米露的笔记",
    bgStyle: "fullImg",
    imgSrc: ["/blog/bg1.jpg"],
    description: [
      "记录学习与成长",
      "积跬步以至千里",
      "这一生波澜壮阔或是不惊都没问题",
    ],
    descStyle: "types",
  },
  codeBlock: {
    overlay: true,
  },
};

// 博客全图配置
export const teekBlogBodyConfig: TeekConfig = {
  ...teekBlogCommonConfig,
  pageStyle: "segment-nav",
  bodyBgImg: {
    imgSrc: ["/blog/bg1.jpg"],
  },
  banner: {
    name: "🎉 西米露的笔记",
    description: [
      "记录学习与成长",
      "积跬步以至千里",
      "这一生波澜壮阔或是不惊都没问题",
    ],
    descStyle: "types",
  },
  themeEnhance: {
    layoutSwitch: {
      defaultMode: "original",
    },
  },
};

// 博客卡片配置
export const teekBlogCardConfig: TeekConfig = {
  ...teekBlogCommonConfig,
  post: {
    postStyle: "card",
  },
  homeCardListPosition: "left",
  banner: {
    name: "🎉 西米露的笔记",
    bgStyle: "fullImg",
    imgSrc: ["/blog/bg1.jpg"],
    description: [
      "记录学习与成长",
      "积跬步以至千里",
      "这一生波澜壮阔或是不惊都没问题",
    ],
    descStyle: "types",
  },
};

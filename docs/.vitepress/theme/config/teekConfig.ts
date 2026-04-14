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
  footerInfo: {
    copyright: {
      createYear: 2024,
      suffix: "aiastia",
    },
  },
};

// 博客默认配置
export const teekBlogConfig: TeekConfig = {
  ...teekBlogCommonConfig,
  banner: {
    name: "🎉 My Docs",
    description: "记录学习与成长",
    bgStyle: "partImg",
  },
};

// 博客小图配置
export const teekBlogParkConfig: TeekConfig = {
  ...teekBlogCommonConfig,
  banner: {
    name: "🎉 My Docs",
    bgStyle: "partImg",
    imgSrc: ["/blog/bg1.webp", "/blog/bg2.webp", "/blog/bg3.webp"],
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
  ],
};

// 博客大图配置
export const teekBlogFullConfig: TeekConfig = {
  ...teekBlogCommonConfig,
  post: {
    coverImgMode: "full",
  },
  banner: {
    name: "🎉 My Docs",
    bgStyle: "fullImg",
    imgSrc: ["/blog/bg1.webp", "/blog/bg2.webp", "/blog/bg3.webp"],
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
    imgSrc: ["/blog/bg1.webp", "/blog/bg2.webp", "/blog/bg3.webp"],
  },
  banner: {
    name: "🎉 My Docs",
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
    name: "🎉 My Docs",
    bgStyle: "fullImg",
    imgSrc: ["/blog/bg1.webp", "/blog/bg2.webp", "/blog/bg3.webp"],
    description: [
      "记录学习与成长",
      "积跬步以至千里",
      "这一生波澜壮阔或是不惊都没问题",
    ],
    descStyle: "types",
  },
};

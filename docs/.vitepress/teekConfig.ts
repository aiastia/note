import { defineTeekConfig } from "vitepress-theme-teek/config"

/**
 * Teek 主题配置
 * 文档：https://teek.seasir.top/
 * 配置参考：https://vp.teek.top/reference/config.html
 */
export const teekConfig = defineTeekConfig({
  // ==================== 基础配置 ====================

  teekTheme: true,   // 启用 Teek 主题
  teekHome: true,    // 启用 Teek 博客首页风格
  vpHome: true,      // 同时支持 VitePress 默认首页

  // ==================== 站点分析 ====================

  siteAnalytics: [
    {
      provider: "clarity" as any,
      options: {
        id: "wev0xq9wxg",
      },
    },
  ],

  // ==================== 作者 & 博主信息 ====================

  // 文章默认作者信息，会显示在文章列表和文章页
  author: { name: "YOLO", link: "https://github.com/aiastia" },

  // 博主信息卡片，显示在首页左侧
  blogger: {
    name: "YOLO",
    slogan: "记录技术探索与折腾之路",
    avatar: "https://avatars.githubusercontent.com/u/19776350?v=4",
    shape: "circle-rotate", // 头像形状：square 方形 | circle 圆形 | circle-rotate 旋转圆形
    circleSize: 120,        // 头像尺寸（px）
  },

  // ==================== 侧边栏 & 导航 ====================

  // 启用侧边栏展开/折叠触发器
  sidebarTrigger: true,

  // 面包屑导航
  breadcrumb: {
    enabled: true,
    showCurrentName: false, // 面包屑最后一列是否显示当前文章文件名
    separator: "/",         // 分隔符
    homeLabel: "首页",      // 首页图标提示文案
  },

  // ==================== 页面样式 ====================

  // 右下角回到顶部
  backTop: {
    enabled: true,
    content: "progress", // progress 显示进度 | icon 只显示图标
  },

  // 文章页样式：default 原生风格 | card 卡片风格 | segment 片段卡片风格
  pageStyle: "default",

  // 代码块增强
  codeBlock: {
    enabled: true,
    collapseHeight: 700,             // 超出高度自动折叠
    langTextTransform: "uppercase",   // 语言标签大写
    copiedDone: (TkMessage: any) => TkMessage.success("复制成功！"),
  },

  // ==================== 分类 & 标签 ====================

  // 分类卡片配置
  category: {
    enabled: true,
    path: "/categories",   // 分类页访问地址（对应 categoriesPage.md 的 permalink）
  },

  // 标签卡片配置
  tag: {
    enabled: true,
    path: "/tags",         // 标签页访问地址（对应 tagsPage.md 的 permalink）
  },

  // ==================== 文章相关 ====================

  // 文章列表配置
  post: {
    postStyle: "list",      // 文章列表风格：list | card
    showCapture: true,      // 显示摘要截取内容
    showMore: true,         // 显示「阅读全文」按钮
    moreLabel: "阅读全文 >",
    emptyLabel: "暂无文章",
  },

  // 文章页 Banner
  articleBanner: {
    enabled: true,        // 启用文章页顶部 Banner
    showCategory: true,   // 显示分类
    showTag: true,        // 显示标签
  },

  // 文章分享
  articleShare: {
    enabled: true,
    text: "分享此页面",
    copiedText: "链接已复制",
  },

  // 文章信息显示
  articleAnalyze: {
    showIcon: true,        // 显示文章信息图标
    showInfo: true,        // 显示作者、日期、分类、标签等
    showAuthor: true,      // 显示作者
    showCreateDate: true,  // 显示创建日期
    showUpdateDate: false, // 不显示更新日期（文章页才生效）
    showCategory: true,    // 显示分类
    showTag: true,         // 显示标签
  },

  // 分页配置
  page: {
    pageSize: 12,          // 每页显示条目数
  },

  // ==================== 页脚配置 ====================

  footerInfo: {
    theme: {
      name: "Theme By Teek",
    },
    copyright: {
      createYear: 2026,
      suffix: "YOLO",
    },
  },

  // ==================== 内置 Vite 插件 ====================

  vitePlugins: {
    // 侧边栏插件：自动扫描目录生成侧边栏
    sidebarOption: {
      collapsed: false,      // 分组默认展开
      initItems: false,      // 不包裹额外的分组层
      ignoreIndexMd: true,   // 忽略 index.md 文件
    },
    // 排除 ai 目录下的文件，使其不出现在首页文章列表、归档、分类、标签中
    // 但仍可通过导航栏直接访问
    fileContentLoaderIgnore: ["**/ai/**", "**/posts/index.md"],
  },
})
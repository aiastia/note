<script setup lang="ts">
import type { TeekConfig } from "vitepress-theme-teek";
import Teek, { teekConfigContext } from "vitepress-theme-teek";
import { ref, provide, onMounted, computed, watch } from "vue";
import { useData } from "vitepress";
import { teekDocConfig, teekBlogConfig, teekBlogParkConfig, teekBlogFullConfig, teekBlogBodyConfig, teekBlogCardConfig } from "../config/teekConfig";
import ConfigSwitch from "./ConfigSwitch.vue";
import HitokotoBanner from "./HitokotoBanner.vue";

// 配置映射
const configMap: Record<string, TeekConfig> = {
  doc: teekDocConfig,
  blog: teekBlogConfig,
  "blog-part": teekBlogParkConfig,
  "blog-full": teekBlogFullConfig,
  "blog-body": teekBlogBodyConfig,
  "blog-card": teekBlogCardConfig,
};

// 使用 VitePress 的 frontmatter 判断首页，兼容不同 base 路径（/note/ 和 /）
// 排除标签、分类、归档等特殊页面（它们也使用 layout: home）
const { frontmatter } = useData();
const isHomePage = computed(() =>
  frontmatter.value.layout === "home" &&
  !frontmatter.value.tagsPage &&
  !frontmatter.value.categoriesPage &&
  !frontmatter.value.archivesPage
);

// 初始配置始终使用文档配置，避免 SSR 水合不匹配和 localStorage 缓存导致的问题
// 保存的配置在 onMounted 中按需应用
const teekConfig = ref<TeekConfig>(teekDocConfig);
provide(teekConfigContext, teekConfig);

// 获取所有文章链接
const getPostLinks = (): string[] => {
  const links: string[] = [];
  const posts = document.querySelectorAll("a[class*='title']");
  posts.forEach((el) => {
    const href = (el as HTMLAnchorElement).href;
    if (href && !href.includes("#")) {
      const url = new URL(href);
      if (url.pathname !== '/' && url.pathname !== '/note/') {
        links.push(href);
      }
    }
  });
  return links;
};

const goRandom = () => {
  let links: string[] = [];
  const cached = sessionStorage.getItem('postLinks');
  if (cached) {
    links = JSON.parse(cached);
  } else {
    links = getPostLinks();
    if (links.length > 0) {
      sessionStorage.setItem('postLinks', JSON.stringify(links));
    }
  }
  if (links.length > 0) {
    window.location.href = links[Math.floor(Math.random() * links.length)];
  }
};

// 从一言 Hitokoto API 获取多条不重复句子
const fetchHitokotoList = async (count: number): Promise<string[]> => {
  const fallbacks = ["适才相戏耳", "浮生若梦，为欢几何", "这一生波澜壮阔或是不惊都没问题"];
  const results: Set<string> = new Set();
  try {
    for (let i = 0; i < count * 2 && results.size < count; i++) {
      const res = await fetch(`https://v1.hitokoto.cn/?c=a&c=b&c=d&c=i&c=k&_t=${Date.now()}-${i}`);
      const data = await res.json();
      if (data.hitokoto && !results.has(data.hitokoto)) {
        results.add(data.hitokoto);
      }
    }
    const list = Array.from(results);
    return list.length > 0 ? list : fallbacks;
  } catch {
    return fallbacks;
  }
};

// 当前配置样式
const currentStyle = ref("doc");

// 判断是否为标签/分类等需要博客布局的特殊页面
const isSpecialPage = computed(() =>
  !!frontmatter.value.tagsPage || !!frontmatter.value.categoriesPage
);

// Layout key：页面切换时强制重建组件，杜绝旧 DOM 闪现
const layoutKey = computed(() => {
  if (isHomePage.value) return "home-" + currentStyle.value;
  if (frontmatter.value.tagsPage) return "tags";
  if (frontmatter.value.categoriesPage) return "categories";
  return "other";
});

// 首页时缓存文章链接 + 初始化一言
onMounted(async () => {
  if (isHomePage.value) {
    // 读取保存的样式，并在客户端应用对应配置
    const saved = localStorage.getItem("tk:configStyle");
    if (saved && configMap[saved]) {
      currentStyle.value = saved;
      const config = configMap[saved];
      Object.assign(teekConfig.value, config);
      if (config.banner) teekConfig.value.banner = { ...config.banner };
      if (config.bodyBgImg) teekConfig.value.bodyBgImg = { ...config.bodyBgImg };
    }

    const links = getPostLinks();
    if (links.length > 0) {
      sessionStorage.setItem('postLinks', JSON.stringify(links));
    }

    // 首页初始加载时获取一言，确保首次渲染就有打字机效果
    const hitokotoList = await fetchHitokotoList(3);
    if (teekConfig.value.banner) {
      teekConfig.value.banner = {
        ...teekConfig.value.banner,
        descStyle: "types",
        description: hitokotoList,
      };
    }
  }

  // 标签/分类页首次加载时，如果是文档模式则启用 teekHome 以显示内容
  if (isSpecialPage.value && currentStyle.value === "doc") {
    teekConfig.value.teekHome = true;
  }
});

// 监听页面切换，强制重建 config（不使用 Object.assign，避免旧字段残留）
watch(
  () => ({ isHome: isHomePage.value, isSpecial: isSpecialPage.value }),
  ({ isHome, isSpecial }) => {
    if (isHome) {
      const config = configMap[currentStyle.value] || teekDocConfig;
      // 关键：彻底重建，而不是 Object.assign merge
      teekConfig.value = {
        ...config,
        teekHome: false,
        vpHome: true,
      };
    } else if (isSpecial) {
      // 标签/分类页需要 teekHome 来显示内容
      teekConfig.value = {
        ...teekConfig.value,
        teekHome: true,
        vpHome: false,
      };
    }
  },
  { flush: "sync" }
);

let previousStyle = "";

const handleConfigSwitch = async (config: TeekConfig, style: string) => {
  if (style === previousStyle) return;
  previousStyle = style;
  currentStyle.value = style;
  // 注意：不再在非首页时 return，允许状态记录
  // 但只在首页时实际切换配置
  if (!isHomePage.value) return;

  // 所有模式都从一言 API 获取 description
  const hitokotoList = await fetchHitokotoList(3);

  // 展开 + 赋值 + 再展开，确保 Vue 响应式追踪
  if (config.banner) teekConfig.value.banner = { ...config.banner };
  if (config.bodyBgImg) teekConfig.value.bodyBgImg = { ...config.bodyBgImg };
  Object.assign(teekConfig.value, config);
  if (teekConfig.value.banner) teekConfig.value.banner = { ...teekConfig.value.banner };
  if (teekConfig.value.bodyBgImg) teekConfig.value.bodyBgImg = { ...teekConfig.value.bodyBgImg };

  if (teekConfig.value.banner) {
    teekConfig.value.banner.descStyle = "types";
    teekConfig.value.banner.description = hitokotoList;
  }
};
</script>

<template>
  <Teek.Layout :key="layoutKey">
    <template #teek-theme-enhance-bottom>
      <ClientOnly>
        <ConfigSwitch @switch="handleConfigSwitch" />
      </ClientOnly>
    </template>

    <template #nav-screen-content-after>
      <ClientOnly>
        <ConfigSwitch @switch="handleConfigSwitch" />
      </ClientOnly>
    </template>

    <template #nav-bar-content-after>
      <button class="nav-random-btn" @click="goRandom" title="随机看一篇">🎲</button>
    </template>

    <template #home-hero-after>
      <ClientOnly>
        <HitokotoBanner v-if="isHomePage && currentStyle === 'doc'" />
      </ClientOnly>
    </template>
  </Teek.Layout>
</template>

<style>
.nav-random-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  font-size: 18px;
  background: transparent;
  border: none;
  cursor: pointer;
  transition: transform 0.25s, color 0.25s;
  color: var(--vp-c-text-1);
}
.nav-random-btn:hover {
  transform: rotate(180deg) scale(1.2);
  color: var(--vp-c-brand);
}
</style>

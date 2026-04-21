<script setup lang="ts">
import type { TeekConfig } from "vitepress-theme-teek";
import Teek, { teekConfigContext } from "vitepress-theme-teek";
import { ref, provide, onMounted, computed } from "vue";
import { useData } from "vitepress";
import { teekDocConfig, teekBlogConfig, teekBlogParkConfig, teekBlogFullConfig, teekBlogBodyConfig, teekBlogCardConfig } from "../config/teekConfig";
import ConfigSwitch from "./ConfigSwitch.vue";

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
const { frontmatter } = useData();
const isHomePage = computed(() => frontmatter.value.layout === "home");

// 从 localStorage 读取保存的配置
// 非首页时排除 teekHome/vpHome 等首页专用属性，避免文章页面格式错乱
const getInitialConfig = (): TeekConfig => {
  if (typeof window === "undefined") return teekDocConfig;
  const saved = localStorage.getItem("tk:configStyle");
  const config = saved ? (configMap[saved] || teekDocConfig) : teekDocConfig;

  if (!isHomePage.value) {
    const { teekHome, vpHome, ...safeConfig } = config as TeekConfig & { teekHome?: boolean; vpHome?: boolean };
    return safeConfig as TeekConfig;
  }
  return config;
};

const teekConfig = ref<TeekConfig>(getInitialConfig());
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

// 首页时缓存文章链接 + 初始化一言
onMounted(async () => {
  if (isHomePage.value) {
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
});

let previousStyle = "";

const handleConfigSwitch = async (config: TeekConfig, style: string) => {
  if (style === previousStyle) return;
  previousStyle = style;

  // 所有博客模式都从一言 API 获取 description
  const blogStyles = ["doc", "blog", "blog-part", "blog-full", "blog-body", "blog-card"];
  const hitokotoList = blogStyles.includes(style) ? await fetchHitokotoList(3) : [];

  // 非首页时排除首页专用属性，避免文章页面格式错乱
  let safeConfig = config;
  if (!isHomePage.value) {
    const { teekHome, vpHome, ...rest } = config as TeekConfig & { teekHome?: boolean; vpHome?: boolean };
    safeConfig = rest as TeekConfig;
  }

  // 先展开嵌套对象，创建新引用，确保 Vue 能追踪到深层变更
  if (safeConfig.banner) teekConfig.value.banner = { ...safeConfig.banner };
  if (safeConfig.bodyBgImg) teekConfig.value.bodyBgImg = { ...safeConfig.bodyBgImg };

  // 其他配置再 merge
  Object.assign(teekConfig.value, safeConfig);

  // 再次展开，确保赋值后的引用也是新的
  if (teekConfig.value.banner) teekConfig.value.banner = { ...teekConfig.value.banner };
  if (teekConfig.value.bodyBgImg) teekConfig.value.bodyBgImg = { ...teekConfig.value.bodyBgImg };

  if (blogStyles.includes(style) && teekConfig.value.banner) {
    teekConfig.value.banner.descStyle = "types";
    teekConfig.value.banner.description = hitokotoList;
  }
};
</script>

<template>
  <Teek.Layout>
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
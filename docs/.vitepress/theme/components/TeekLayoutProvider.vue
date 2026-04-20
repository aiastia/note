<script setup lang="ts">
import type { TeekConfig } from "vitepress-theme-teek";
import Teek, { teekConfigContext } from "vitepress-theme-teek";
import { ref, provide, onMounted } from "vue";
import { teekDocConfig, teekBlogConfig, teekBlogParkConfig, teekBlogFullConfig, teekBlogBodyConfig, teekBlogCardConfig } from "../config/teekConfig";
import ConfigSwitch from "./ConfigSwitch.vue";

// 从 localStorage 读取保存的配置，避免初始加载时需要 remount
const getInitialConfig = () => {
  if (typeof window === "undefined") return teekDocConfig;
  const saved = localStorage.getItem("tk:configStyle");
  if (saved === "blog") return teekBlogConfig;
  if (saved === "blog-part") return teekBlogParkConfig;
  if (saved === "blog-full") return teekBlogFullConfig;
  if (saved === "blog-body") return teekBlogBodyConfig;
  if (saved === "blog-card") return teekBlogCardConfig;
  return teekDocConfig;
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
      // 排除首页
      const url = new URL(href);
      if (url.pathname !== '/' && url.pathname !== '/note/') {
        links.push(href);
      }
    }
  });
  return links;
};

const goRandom = () => {
  // 先从 sessionStorage 获取缓存的链接列表
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

// 首页时缓存文章链接
onMounted(() => {
  if (window.location.pathname === '/' || window.location.pathname === '/note/') {
    const links = getPostLinks();
    if (links.length > 0) {
      sessionStorage.setItem('postLinks', JSON.stringify(links));
    }
  }
});

// 从一言 Hitokoto API 获取多条不重复句子
const fetchHitokotoList = async (count: number): Promise<string[]> => {
  const fallbacks = ["适才相戏耳", "浮生若梦，为欢几何", "这一生波澜壮阔或是不惊都没问题"];
  const results: Set<string> = new Set();
  try {
    // 多请求几次，确保去重后有足够条目
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

let previousStyle = "";

const handleConfigSwitch = async (config: TeekConfig, style: string) => {
  if (style === previousStyle) return;
  previousStyle = style;

  // 所有博客模式都从一言 API 获取 description
  const blogStyles = ["doc", "blog", "blog-part", "blog-full", "blog-body", "blog-card"];
  const hitokotoList = blogStyles.includes(style) ? await fetchHitokotoList(3) : [];

  // 用 Object.assign 就地更新，保持 Vue 响应式引用不变，
  // Teek 内部组件会自动响应属性变化，无需 remount Layout
  Object.assign(teekConfig.value, config);

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

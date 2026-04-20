<script setup lang="ts">
import type { TeekConfig } from "vitepress-theme-teek";
import Teek, { teekConfigContext } from "vitepress-theme-teek";
import { ref, provide, onMounted, nextTick } from "vue";
import { teekDocConfig, teekBlogConfig, teekBlogParkConfig, teekBlogFullConfig, teekBlogBodyConfig, teekBlogCardConfig } from "../config/teekConfig";
import ConfigSwitch from "./ConfigSwitch.vue";
import { withBase } from "vitepress";

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

const teekConfig = ref(getInitialConfig());
provide(teekConfigContext, teekConfig);

// 通过 DOM 操作直接更新背景图 CSS 变量，无需 remount Layout
const updateBackgroundImages = (config: typeof teekDocConfig) => {
  if (typeof window === "undefined") return;

  // 更新 Banner 背景图
  const bannerBgEl = document.querySelector(".tk-banner-bg-image") as HTMLElement;
  if (bannerBgEl) {
    const imgSrc = config.banner?.imgSrc;
    if (imgSrc?.length) {
      const src = Array.isArray(imgSrc) ? imgSrc[0] : typeof imgSrc === 'string' ? imgSrc : '';
      const url = withBase(src);
      bannerBgEl.style.setProperty("--tk-banner-bg-image-banner-img-bg", `url(${url}) center center / cover no-repeat`);
    }
  }

  // 更新 Body 背景图
  const bodyBgEl = document.querySelector(".tk-body-bg-image") as HTMLElement;
  if (bodyBgEl) {
    const imgSrc = config.bodyBgImg?.imgSrc;
    if (imgSrc?.length) {
      const src = Array.isArray(imgSrc) ? imgSrc[0] : typeof imgSrc === 'string' ? imgSrc : '';
      const url = withBase(src);
      bodyBgEl.style.setProperty("--tk-body-bg-image-body-bg-img", `url(${url}) center center / cover no-repeat`);
    }
  }
};

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
  if (blogStyles.includes(style)) {
    const hitokotoList = await fetchHitokotoList(3);
    teekConfig.value = {
      ...config,
      banner: {
        ...config.banner,
        descStyle: "types",
        description: hitokotoList,
      },
    };
  } else {
    teekConfig.value = config;
  }

  // 通过 DOM 操作更新背景图，避免 remount 导致文章内容消失
  await nextTick();
  updateBackgroundImages(teekConfig.value);
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

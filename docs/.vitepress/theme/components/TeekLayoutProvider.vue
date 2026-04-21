<script setup lang="ts" name="TeekLayoutProvider">
import type { TeekConfig } from "vitepress-theme-teek";
import Teek, { teekConfigContext } from "vitepress-theme-teek";
import { ref, provide, onMounted } from "vue";
import {
  teekDocConfig,
  teekBlogConfig,
  teekBlogParkConfig,
  teekBlogFullConfig,
  teekBlogBodyConfig,
  teekBlogCardConfig,
} from "../config/teekConfig";
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
      const url = new URL(href);
      if (url.pathname !== "/" && url.pathname !== "/note/") {
        links.push(href);
      }
    }
  });
  return links;
};

const goRandom = () => {
  let links: string[] = [];
  const cached = sessionStorage.getItem("postLinks");
  if (cached) {
    links = JSON.parse(cached);
  } else {
    links = getPostLinks();
    if (links.length > 0) {
      sessionStorage.setItem("postLinks", JSON.stringify(links));
    }
  }
  if (links.length > 0) {
    window.location.href = links[Math.floor(Math.random() * links.length)];
  }
};

// 首页时缓存文章链接
onMounted(() => {
  if (window.location.pathname === "/" || window.location.pathname === "/note/") {
    const links = getPostLinks();
    if (links.length > 0) {
      sessionStorage.setItem("postLinks", JSON.stringify(links));
    }
  }
});

// 参考官方实现：直接替换整个配置对象
let previousStyle = "";
const handleConfigSwitch = (config: TeekConfig, style: string) => {
  if (style === previousStyle) return;
  previousStyle = style;

  // 直接替换整个 ref 值，确保 Vue 能追踪到所有深层变更
  teekConfig.value = config;

  // 博客全图模式：添加 body class
  document.body.classList.toggle("tk-style-blog-body", style === "blog-body");
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
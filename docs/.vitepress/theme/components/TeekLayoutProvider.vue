<script setup lang="ts">
import type { TeekConfig } from "vitepress-theme-teek";
import Teek, { teekConfigContext } from "vitepress-theme-teek";
import { ref, provide, onMounted, nextTick } from "vue";
import { teekDocConfig } from "../config/teekConfig";
import ConfigSwitch from "./ConfigSwitch.vue";

const teekConfig = ref(teekDocConfig);
const layoutKey = ref(0);
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
  // 防止 Layout 重新挂载时 ConfigSwitch 再次触发导致无限循环
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

  await nextTick();
  layoutKey.value++;
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

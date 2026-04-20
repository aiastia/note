<script setup lang="ts">
import type { TeekConfig } from "vitepress-theme-teek";
import Teek, { teekConfigContext } from "vitepress-theme-teek";
import { ref, provide } from "vue";
import { teekDocConfig } from "../config/teekConfig";
import ConfigSwitch from "./ConfigSwitch.vue";

const teekConfig = ref(teekDocConfig);
provide(teekConfigContext, teekConfig);

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

const handleConfigSwitch = async (config: TeekConfig, style: string) => {
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
  </Teek.Layout>
</template>
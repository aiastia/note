<script setup lang="ts" name="ConfigSwitch">
import { TkSegmented, TkMessage, isClient, useCommon } from "vitepress-theme-teek";
import { nextTick, ref, watch } from "vue";
import {
  teekDocConfig,
  teekBlogConfig,
  teekBlogParkConfig,
  teekBlogFullConfig,
  teekBlogBodyConfig,
  teekBlogCardConfig,
} from "../config/teekConfig";

const segmentedOptions = [
  { value: "doc", label: "文档预设", title: "文档默认风格" },
  { value: "blog", label: "博客预设", title: "首页默认风格" },
  { value: "blog-part", label: "博客小图", title: "首页 Banner 小图" },
  { value: "blog-full", label: "博客大图", title: "首页 Banner 大图" },
  { value: "blog-body", label: "博客全图", title: "全站背景图 + 碎片化文章页" },
  { value: "blog-card", label: "博客卡片", title: "首页卡片文章列表" },
];

const emit = defineEmits<{
  switch: [config: typeof teekDocConfig, style: string];
}>();

const themeStyle = defineModel({ default: "doc" });

// 简易 localStorage 持久化
const storageKey = "tk:configStyle";
const currentStyle = ref(typeof window !== "undefined" ? localStorage.getItem(storageKey) || "doc" : "doc");

const teekConfig = ref(teekDocConfig);
const { isMobile } = useCommon();

const update = async (style: string) => {
  if (style === "doc") teekConfig.value = teekDocConfig;
  if (style === "blog") teekConfig.value = teekBlogConfig;
  if (style === "blog-part") teekConfig.value = teekBlogParkConfig;
  if (style === "blog-full") teekConfig.value = teekBlogFullConfig;
  if (style === "blog-body") teekConfig.value = teekBlogBodyConfig;
  if (style === "blog-card") teekConfig.value = teekBlogCardConfig;

  emit("switch", teekConfig.value, style);

  if (typeof window !== "undefined") localStorage.setItem(storageKey, style);

  await nextTick();

  if (!isClient) return;
  const navDom = document.querySelector(".VPNavBar") as HTMLElement;
  if (["blog-full", "blog-body", "blog-card"].includes(style) && teekConfig.value.banner?.enabled !== false) {
    navDom?.classList.add("full-img-nav-bar");
  } else navDom?.classList.remove("full-img-nav-bar");
};

watch(themeStyle, update, { immediate: true });
watch(currentStyle, newVal => {
  if (newVal) {
    themeStyle.value = newVal;
  }
}, { immediate: true });

const handleCopy = async () => {
  try {
    await navigator.clipboard.writeText(JSON.stringify(teekConfig.value, null, 2));
    TkMessage.success({ message: "复制成功！", plain: true });
  } catch {
    TkMessage.error({ message: "复制失败！", plain: true });
  }
};
</script>

<template>
  <div class="config-switch">
    <div class="config-switch-header">
      <h3>配置切换</h3>
      <button @click="handleCopy">Copy</button>
    </div>
    <TkSegmented v-model="currentStyle" :options="segmentedOptions" />
  </div>
</template>

<style scoped>
.config-switch {
  margin-top: 16px;
}
.config-switch-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.config-switch-header h3 {
  font-size: 12px;
  opacity: 0.8;
}
.config-switch-header button {
  font-size: 14px;
  font-weight: 500;
  outline: none;
  color: var(--vp-c-text-1);
  cursor: pointer;
  background: none;
  border: none;
}
.config-switch-header button:hover {
  color: #5171d7;
}
</style>

<style>
.config-switch .tk-segmented {
  display: grid !important;
  grid-template-columns: repeat(3, 1fr) !important;
  flex-wrap: wrap;
  gap: 4px;
}
.config-switch .tk-segmented .tk-segmented-item {
  min-width: auto !important;
}
</style>

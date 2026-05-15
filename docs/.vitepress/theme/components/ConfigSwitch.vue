<script setup lang="ts" name="ConfigSwitch">
import { TkSegmented, TkMessage } from "vitepress-theme-teek";
import { ref, onMounted, watch } from "vue";
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

// 单一数据源
const currentStyle = ref("doc");
const teekConfig = ref(teekDocConfig);

const storageKey = "tk:configStyle";

const configMap: Record<string, typeof teekDocConfig> = {
  doc: teekDocConfig,
  blog: teekBlogConfig,
  "blog-part": teekBlogParkConfig,
  "blog-full": teekBlogFullConfig,
  "blog-body": teekBlogBodyConfig,
  "blog-card": teekBlogCardConfig,
};

// 统一更新函数
const update = (style: string, shouldReload = false) => {
  teekConfig.value = configMap[style] || teekDocConfig;
  emit("switch", teekConfig.value, style);
  localStorage.setItem(storageKey, style);
  // 切换后刷新页面，确保 Banner 图片立即更新
  // （Teek 内部 useSwitchData 不会即时响应配置变更）
  if (shouldReload) {
    setTimeout(() => window.location.reload(), 50);
  }
};

onMounted(() => {
  const saved = localStorage.getItem(storageKey);
  if (saved) currentStyle.value = saved;
  update(currentStyle.value);
  // 用户手动切换时，保存后刷新页面
  watch(currentStyle, (val) => update(val, true));
});

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
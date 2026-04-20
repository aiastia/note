<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";

const fallbacks = ["适才相戏耳", "浮生若梦，为欢几何", "这一生波澜壮阔或是不惊都没问题"];
const sentences = ref<string[]>(fallbacks);
const displayText = ref("");
const sentenceIdx = ref(0);
let charIdx = 0;
let isDeleting = false;
let timer: ReturnType<typeof setTimeout> | null = null;

const typeSpeed = 100;
const deleteSpeed = 50;
const pauseTime = 2000;

const tick = () => {
  const current = sentences.value[sentenceIdx.value % sentences.value.length];
  if (!isDeleting) {
    charIdx++;
    displayText.value = current.slice(0, charIdx);
    if (charIdx >= current.length) {
      isDeleting = true;
      timer = setTimeout(tick, pauseTime);
      return;
    }
  } else {
    charIdx--;
    displayText.value = current.slice(0, charIdx);
    if (charIdx <= 0) {
      isDeleting = false;
      sentenceIdx.value++;
    }
  }
  timer = setTimeout(tick, isDeleting ? deleteSpeed : typeSpeed);
};

const fetchHitokoto = async () => {
  try {
    const results: Set<string> = new Set();
    for (let i = 0; i < 6 && results.size < 3; i++) {
      const res = await fetch(`https://v1.hitokoto.cn/?c=a&c=b&c=d&c=i&c=k&_t=${Date.now()}-${i}`);
      const data = await res.json();
      if (data.hitokoto && !results.has(data.hitokoto)) {
        results.add(data.hitokoto);
      }
    }
    if (results.size > 0) {
      sentences.value = Array.from(results);
      sentenceIdx.value = 0;
      charIdx = 0;
      isDeleting = false;
    }
  } catch {
    // 保持 fallback
  }
};

onMounted(() => {
  tick();
  fetchHitokoto();
});

onUnmounted(() => {
  if (timer) clearTimeout(timer);
});
</script>

<template>
  <div class="hitokoto-banner">
    <span class="hitokoto-text">{{ displayText }}<span class="cursor">|</span></span>
  </div>
</template>

<style scoped>
.hitokoto-banner {
  text-align: center;
  padding: 20px 16px;
  font-size: 1.2rem;
  color: var(--vp-c-text-2);
  min-height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.hitokoto-text {
  line-height: 1.8;
}
.cursor {
  animation: blink 1s infinite;
  margin-left: 2px;
}
@keyframes blink {
  0%,
  50% {
    opacity: 1;
  }
  51%,
  100% {
    opacity: 0;
  }
}
</style>
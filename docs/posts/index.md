---
title: 笔记
---

<div class="pi">

<div class="pi-hero">
  <div class="pi-hero-glow"></div>
  <div class="pi-terminal">
    <div class="pi-terminal-bar">
      <span class="pi-terminal-dot pi-terminal-dot--red"></span>
      <span class="pi-terminal-dot pi-terminal-dot--yellow"></span>
      <span class="pi-terminal-dot pi-terminal-dot--green"></span>
      <span class="pi-terminal-title">yolo@notes:~</span>
    </div>
    <div class="pi-terminal-body">
      <span class="pi-t-prompt">$</span>
      <span class="pi-t-cmd">cat welcome.txt</span>
      <br>
      <span class="pi-t-output">📝 技术笔记 — 记录折腾之路，积跬步以至千里</span>
      <br>
      <br>
      <span class="pi-t-prompt">$</span>
      <span class="pi-t-cmd">ls -la ./categories/</span>
      <br>
      <span class="pi-t-output">drwxr-xr-x  🐳 Docker容器/</span>
      <br>
      <span class="pi-t-output">drwxr-xr-x  🐧 Linux运维/</span>
      <br>
      <span class="pi-t-output">drwxr-xr-x  🌐 网络工具/</span>
      <br>
      <span class="pi-t-output">drwxr-xr-x  🔀 Git版本控制/</span>
      <br>
      <span class="pi-t-output">drwxr-xr-x  🛠️ 实用工具/</span>
      <br>
      <span class="pi-t-output">drwxr-xr-x  📡 服务器VPS/</span>
      <br>
      <br>
      <span class="pi-t-prompt">$</span>
      <span class="pi-t-cmd">wc -l ./posts/**/*.md</span>
      <br>
      <span class="pi-t-output">36 篇笔记  |  2019 - 2026  |  持续更新中</span>
      <br>
      <br>
      <span class="pi-t-prompt">$</span>
      <span class="pi-t-cmd">cat motto.txt</span>
      <br>
      <span class="pi-t-output">"这一生波澜壮阔或是不惊都没问题"</span>
      <br>
      <br>
      <span class="pi-t-prompt">$</span>
      <span class="pi-t-cmd pi-t-typing" id="pi-typing"></span>
      <span class="pi-t-cursor">▊</span>
    </div>
  </div>
</div>

<div class="pi-footer">
  <span class="pi-footer-blink">⚡</span>
  左侧侧边栏浏览全部文章
</div>

</div>

<script setup>
import { onMounted } from 'vue'

onMounted(() => {
  const texts = [
    'neofetch',
    'sudo rm -rf /bugs/',
    'git push origin master',
    'echo "Happy Hacking!"',
    'ping blog.teek.top',
    'docker compose up -d',
    'chmod +x learn.sh',
  ]
  const el = document.getElementById('pi-typing')
  if (!el) return
  let textIdx = 0, charIdx = 0, deleting = false
  const type = () => {
    const text = texts[textIdx]
    if (!deleting) {
      el.textContent = text.slice(0, ++charIdx)
      if (charIdx === text.length) { deleting = true; setTimeout(type, 2000); return }
    } else {
      el.textContent = text.slice(0, --charIdx)
      if (charIdx === 0) { deleting = false; textIdx = (textIdx + 1) % texts.length }
    }
    setTimeout(type, deleting ? 35 : 75)
  }
  type()
})
</script>

<style>
.pi {
  max-width: 860px;
  margin: 0 auto;
  padding: 10px 0 40px;
}

.pi-hero {
  position: relative;
  padding: 50px 0 30px;
  text-align: center;
}
.pi-hero-glow {
  position: absolute;
  top: 0; left: 50%;
  width: 400px; height: 200px;
  transform: translateX(-50%);
  background: radial-gradient(ellipse, var(--vp-c-brand) / 15%, transparent 70%);
  filter: blur(40px);
  pointer-events: none;
}

.pi-terminal {
  max-width: 560px;
  margin: 0 auto;
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid var(--vp-c-divider);
  background: var(--vp-code-block-bg);
  box-shadow: 0 4px 24px rgba(0,0,0,0.12);
  text-align: left;
  font-size: 0.86rem;
}
.pi-terminal-bar {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 10px 14px;
  background: var(--vp-c-bg-soft);
  border-bottom: 1px solid var(--vp-c-divider);
}
.pi-terminal-dot {
  width: 10px; height: 10px;
  border-radius: 50%;
}
.pi-terminal-dot--red { background: #ff5f57; }
.pi-terminal-dot--yellow { background: #febc2e; }
.pi-terminal-dot--green { background: #28c840; }
.pi-terminal-title {
  margin-left: auto;
  color: var(--vp-c-text-3);
  font-size: 0.8rem;
}
.pi-terminal-body {
  padding: 16px 18px;
  line-height: 1.7;
  font-family: var(--vp-font-family-mono);
}
.pi-t-prompt {
  color: var(--vp-c-brand);
  margin-right: 8px;
  font-weight: bold;
}
.pi-t-cmd {
  color: var(--vp-c-text-1);
}
.pi-t-output {
  color: var(--vp-c-text-2);
}
.pi-t-cursor {
  color: var(--vp-c-brand);
  animation: pi-blink 1s step-end infinite;
}
@keyframes pi-blink {
  50% { opacity: 0; }
}

.pi-footer {
  text-align: center;
  color: var(--vp-c-text-3);
  font-size: 0.85rem;
  padding: 20px;
  margin-top: 20px;
  border-top: 1px solid var(--vp-c-divider);
}
.pi-footer-blink {
  display: inline-block;
  animation: pi-blink 1.5s ease infinite;
}
</style>
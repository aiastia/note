import Teek from "vitepress-theme-teek"
import "vitepress-theme-teek/index.css"
import "./style.css"
import TeekLayoutProvider from "./components/TeekLayoutProvider.vue"
import { inBrowser } from "vitepress"

export default {
  extends: Teek,
  Layout: TeekLayoutProvider,

  enhanceApp() {
    if (typeof window !== "undefined") {
      // ✅ 只绑定一次（关键）
      if ((window as any).__BASE_PATCHED__) return
      ;(window as any).__BASE_PATCHED__ = true

      document.addEventListener("click", (e) => {
        const target = e.target as HTMLElement
        const link = target.closest("a")
        if (!link) return

        const href = link.getAttribute("href")
        if (!href) return

        // 👉 只处理内部路径
        if (href.startsWith("/") && !href.startsWith("/note/")) {
          e.preventDefault()
          window.location.href = "/note" + href
        }
      })
    }
  },

  setup() {
    if (inBrowser) {
      const origError = console.error;
      console.error = (...args: any[]) => {
        if (typeof args[0] === "string" && args[0].includes("Hydration")) return;
        origError.apply(console, args);
      };
    }
  },
}
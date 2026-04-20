import Teek from "vitepress-theme-teek"
import "vitepress-theme-teek/index.css"
import "./style.css"
import TeekLayoutProvider from "./components/TeekLayoutProvider.vue"
import { inBrowser } from "vitepress"

export default {
  extends: Teek,
  Layout: TeekLayoutProvider,
  setup() {
    // 静默 Teek 主题 SSR 水合不匹配警告（不影响功能）
    if (inBrowser) {
      const origError = console.error;
      console.error = (...args: any[]) => {
        if (typeof args[0] === "string" && args[0].includes("Hydration")) return;
        origError.apply(console, args);
      };
    }
  },
}

import Teek from "vitepress-theme-teek"
import "vitepress-theme-teek/index.css"
import TeekLayoutProvider from "./components/TeekLayoutProvider.vue"

export default {
  extends: Teek,
  Layout: TeekLayoutProvider,
}

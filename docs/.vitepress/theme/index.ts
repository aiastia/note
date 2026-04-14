import DefaultTheme from 'vitepress/theme'
import type { Theme } from 'vitepress'
import './style.css'

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    // 在这里注册自定义全局组件
    // app.component('MyComponent', MyComponent)
  },
} satisfies Theme
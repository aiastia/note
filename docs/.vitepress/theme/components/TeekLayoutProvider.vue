<script setup lang="ts">
import type { TeekConfig } from "vitepress-theme-teek";
import Teek, { teekConfigContext } from "vitepress-theme-teek";
import { useData } from "vitepress";
import { watch, ref, provide } from "vue";
import { teekDocConfig } from "../config/teekConfig";
import ConfigSwitch from "./ConfigSwitch.vue";

const { frontmatter } = useData();

const currentStyle = ref("doc");
const teekConfig = ref(teekDocConfig);
provide(teekConfigContext, teekConfig);

const handleConfigSwitch = (config: TeekConfig, style: string) => {
  teekConfig.value = config;
};
</script>

<template>
  <Teek.Layout>
    <template #teek-theme-enhance-bottom>
      <ConfigSwitch v-model="currentStyle" @switch="handleConfigSwitch" />
    </template>

    <template #nav-screen-content-after>
      <ConfigSwitch v-model="currentStyle" @switch="handleConfigSwitch" />
    </template>
  </Teek.Layout>
</template>

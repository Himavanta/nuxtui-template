<template>
  <div :class="$style.AppLayout">
    <AppHeader />

    <main :class="$style.main">
      <RouterView v-slot="{ Component }">
        <component :is="Component" />
      </RouterView>
    </main>
  </div>
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router'

import AppHeader from '@/components/AppHeader.vue'
</script>

<style module lang="scss">
.AppLayout {
  display: flex;
  flex-direction: column;
  min-block-size: 100svh;
}

.main {
  flex: 1;
  margin-inline: auto;
  inline-size: 100%;
  max-inline-size: 80rem;
  padding: 1.5rem 1rem;
}
</style>

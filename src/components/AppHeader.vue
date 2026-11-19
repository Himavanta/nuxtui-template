<template>
  <header :class="$style.AppHeader">
    <div :class="$style.inner">
      <RouterLink to="/" :class="$style.brand">{{ appTitle }}</RouterLink>

      <nav :class="$style.nav">
        <RouterLink v-for="link in links" :key="link.to" :to="link.to" :class="$style.link">
          {{ link.label }}
        </RouterLink>
      </nav>

      <UButton
        :icon="isDark ? 'i-tabler-sun' : 'i-tabler-moon'"
        variant="ghost"
        color="neutral"
        aria-label="切换深浅色主题"
        @click="isDark = !isDark"
      />
    </div>
  </header>
</template>

<script setup lang="ts">
import { useColorMode } from '@vueuse/core'
import { computed } from 'vue'
import { RouterLink } from 'vue-router'

const links = [
  { to: '/', label: '首页' },
  { to: '/about', label: '关于' }
]

// 与 index.html 的 <title>、.env 的 VITE_APP_TITLE 保持一致
const appTitle = import.meta.env.VITE_APP_TITLE || 'Vue App'

const colorMode = useColorMode()

const isDark = computed({
  get: () => colorMode.value === 'dark',
  set: (value) => {
    colorMode.value = value ? 'dark' : 'light'
  }
})
</script>

<style module lang="scss">
.AppHeader {
  border-block-end: 1px solid var(--ui-border);
  background-color: var(--ui-bg);
}

.inner {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-inline: auto;
  inline-size: 100%;
  max-inline-size: 80rem;
  padding: 0.5rem 1rem;
}

.brand {
  font-weight: 600;
  letter-spacing: -0.01em;
  color: var(--ui-text-highlighted);
  text-decoration: none;
}

.nav {
  display: flex;
  gap: 0.25rem;
  margin-inline-start: auto;
}

.link {
  padding: 0.375rem 0.75rem;
  border-radius: var(--ui-radius);
  font-size: 0.875rem;
  color: var(--ui-text-muted);
  text-decoration: none;

  &:hover {
    background-color: var(--ui-bg-elevated);
    color: var(--ui-text);
  }
}
</style>

<template>
  <UCard>
    <template #header>404</template>

    <p>页面不存在或已被移除。</p>

    <template #footer>
      <RouterLink to="/">
        <UButton variant="soft">返回首页</UButton>
      </RouterLink>
    </template>
  </UCard>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'
</script>

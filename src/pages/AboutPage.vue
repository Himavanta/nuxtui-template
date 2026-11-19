<template>
  <UCard>
    <template #header>关于</template>

    <p>当前登录状态：{{ auth.isLoggedIn ? '已登录' : '未登录' }}</p>

    <template #footer>
      <UButton v-if="auth.isLoggedIn" color="error" variant="soft" @click="auth.logout()">
        退出登录
      </UButton>
      <UButton v-else @click="auth.login('demo-token')">模拟登录</UButton>
    </template>
  </UCard>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'

/**
 * 示例页面：演示 Pinia store 的用法。
 * store 只放共享状态，页面自己的局部状态用 ref。
 */
const auth = useAuthStore()
</script>

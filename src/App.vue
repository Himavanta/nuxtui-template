<template>
  <!--
    UApp 是 Nuxt UI 的根组件，提供 toast / tooltip / overlay 等全局能力，必须包在最外层。
    Nuxt UI 的 useToast / useOverlay 在没有 UApp 时不会工作。
  -->
  <UApp>
    <AppLayout />
  </UApp>
</template>

<script setup lang="ts">
import AppLayout from '@/layouts/AppLayout.vue'
</script>

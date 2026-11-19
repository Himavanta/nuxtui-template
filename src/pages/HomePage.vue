<template>
  <div :class="$style.HomePage">
    <section :class="$style.hero">
      <h1 :class="$style.title">首页</h1>
      <p :class="$style.subtitle">
        这个页面演示了 api 模块（<code>src/api/modules/user.ts</code>）、Pinia 与 Nuxt UI
        的协作方式。
      </p>
    </section>

    <UCard>
      <template #header>
        <div :class="$style.toolbar">
          <UInput
            v-model="keyword"
            class="max-w-xs"
            placeholder="搜索用户"
            icon="i-tabler-search"
            @keyup.enter="fetchUsers"
          />
          <UButton :loading="loading" icon="i-tabler-refresh" @click="fetchUsers">刷新</UButton>
        </div>
      </template>

      <p v-if="isEmpty">暂无数据（示例接口未接后端时属正常现象）。</p>
      <p v-else>共 {{ total }} 条，已加载 {{ users.length }} 条。</p>

      <ul v-if="users.length" :class="$style.list">
        <li v-for="user in users" :key="user.id">{{ user.name }} — {{ user.email }}</li>
      </ul>
    </UCard>
  </div>
</template>

<script setup lang="ts">
import { useToast } from '@nuxt/ui/composables/useToast'
import { computed, onMounted, ref } from 'vue'

import { normalizeError } from '@/api/error'
import { userApi, type User } from '@/api/modules/user'

/**
 * 示例页面：演示「api 模块 → 页面状态 → UI 渲染」的完整链路。
 * 新页面照这个骨架改即可。
 */
const users = ref<User[]>([])
const total = ref(0)
const loading = ref(false)
const keyword = ref('')
const toast = useToast()

const isEmpty = computed(() => !loading.value && users.value.length === 0)

async function fetchUsers(): Promise<void> {
  loading.value = true

  try {
    const result = await userApi.list({ keyword: keyword.value || undefined, pageSize: 20 })
    users.value = result.items
    total.value = result.total
  } catch (error) {
    // 统一在页面边界把错误转成用户可读文案，api 层不弹提示
    toast.add({
      title: normalizeError(error).message,
      color: 'error',
      icon: 'i-tabler-alert-circle'
    })
  } finally {
    loading.value = false
  }
}

onMounted(fetchUsers)
</script>

<style module lang="scss">
.HomePage {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.hero {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.title {
  font-size: 1.75rem;
  font-weight: 600;
  color: var(--ui-text-highlighted);
}

.subtitle {
  color: var(--ui-text-muted);
}

.toolbar {
  display: flex;
  gap: 0.75rem;
  align-items: center;
}

.list {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  margin-block-start: 1rem;
  font-size: 0.875rem;
}
</style>

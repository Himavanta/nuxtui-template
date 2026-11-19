import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

import { clearToken, getToken, setToken } from '@/api/client'

/**
 * 登录态 store。
 *
 * 约定：
 * - setup 语法，state 用 ref、派生用 computed、方法直接定义成函数。
 * - store 只放「跨组件共享的状态」，页面内的一次性状态用 ref 就够了。
 * - store 不 import 组件，也不做路由跳转（跳转交给调用方或 router 守卫）。
 */
export const useAuthStore = defineStore('auth', () => {
  const token = ref<string | null>(getToken())

  const isLoggedIn = computed(() => Boolean(token.value))

  function login(nextToken: string): void {
    token.value = nextToken
    setToken(nextToken)
  }

  function logout(): void {
    token.value = null
    clearToken()
  }

  return { token, isLoggedIn, login, logout }
})

import { createRouter, createWebHistory } from 'vue-router'

import { useAuthStore } from '@/stores/auth'

import { routes } from './routes'

/** 需要在构建时就固定下来的应用标题，和 index.html 保持一致 */
const APP_TITLE = import.meta.env.VITE_APP_TITLE || 'Maimai'

export const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior(_to, _from, savedPosition) {
    return savedPosition ?? { top: 0 }
  }
})

/**
 * 全局前置守卫。
 *
 * 规则：无 token 访问 meta.requiresAuth 为 true 的页面时跳登录页，
 * 并把原地址塞进 query.redirect，登录成功后可以直接回跳。
 */
router.beforeEach((to) => {
  const auth = useAuthStore()

  if (to.meta.requiresAuth && !auth.isLoggedIn) {
    return {
      name: 'Login',
      query: { redirect: to.fullPath }
    }
  }

  return true
})

router.afterEach((to) => {
  const title = to.meta.title

  document.title = title ? `${title} - ${APP_TITLE}` : APP_TITLE
})

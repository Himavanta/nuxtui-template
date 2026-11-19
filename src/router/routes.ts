import type { RouteRecordRaw } from 'vue-router'

/**
 * 路由表：唯一真相源。
 *
 * 添加页面的完整步骤：
 * 1. 在 src/pages 下新建 `XxxPage.vue`（后缀固定 Page）。
 * 2. 在本文件追加一条记录，path 用 kebab-case，name 用 PascalCase 且全局唯一。
 * 3. 需要登录的页面把 `meta.requiresAuth` 设为 true。
 *
 * 不用文件约定式路由：路由表由人（或 AI）显式维护，避免页面建了却忘记注册。
 */
export const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/pages/HomePage.vue'),
    meta: { title: '首页' }
  },
  {
    path: '/about',
    name: 'About',
    component: () => import('@/pages/AboutPage.vue'),
    meta: { title: '关于' }
  },
  {
    // 兜底路由必须放最后
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/pages/NotFoundPage.vue')
  }
]

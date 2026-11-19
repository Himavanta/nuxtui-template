import 'vue-router'

/**
 * 路由 meta 的类型约束。
 *
 * 加新的 meta 字段时先在这里声明，否则 router 里写错字段名不会报错。
 */
declare module 'vue-router' {
  interface RouteMeta {
    /** 浏览器标题，afterEach 会拼上应用名 */
    title?: string
    /** 是否要求登录，默认 false */
    requiresAuth?: boolean
  }
}

export {}

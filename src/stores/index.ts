import { createPinia } from 'pinia'

/**
 * Pinia 实例。
 *
 * 约定：store 一律用 setup 语法（defineStore('x', () => {...})），
 * 不用 options 语法，保证和组合式 API 写法一致。
 */
export const pinia = createPinia()

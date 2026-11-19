import ky, { type KyInstance, type Options } from 'ky'

import { normalizeError } from './error'

/**
 * 全局唯一的 ky 实例。
 *
 * 规则：
 * - 只有 api 层 import 这个文件，页面和组件不直接使用 ky。
 * - 接口路径一律写相对路径（如 `users/1`），由 baseUrl 拼接。
 * - 后端返回非 2xx 时 ky 抛 HTTPError，这里统一转成 ApiError。
 */
const baseUrl = import.meta.env.VITE_API_BASE_URL || '/api/'

const instance: KyInstance = ky.create({
  baseUrl,
  timeout: 15_000,
  retry: {
    // 只重试幂等方法，且最多 1 次，避免重复提交
    limit: 1,
    methods: ['get', 'head'],
    statusCodes: [408, 429, 500, 502, 503, 504]
  },
  hooks: {
    beforeRequest: [
      ({ request }) => {
        // 鉴权 token 统一注入，token 的存取见本文件底部
        const token = getToken()

        if (token) {
          request.headers.set('Authorization', `Bearer ${token}`)
        }
      }
    ],
    beforeError: [
      ({ error }) => {
        // ky 会在抛出前经过这里，转成 ApiError 让调用方只需要 catch 一种类型
        return normalizeError(error)
      }
    ]
  }
})

/**
 * 带类型的请求方法。
 *
 * 泛型只描述 data 部分，响应体约定为 `{ data: T }` 或直接是 T，
 * 由 unwrap 决定；遇到后端结构不一致时改 unwrap 就够，不用改调用方。
 */
export const api = {
  get: <T>(url: string, options?: Options) =>
    instance
      .get(url, options)
      .json<ApiEnvelope<T>>()
      .then(unwrap<T>),
  post: <T>(url: string, options?: Options) =>
    instance
      .post(url, options)
      .json<ApiEnvelope<T>>()
      .then(unwrap<T>),
  put: <T>(url: string, options?: Options) =>
    instance
      .put(url, options)
      .json<ApiEnvelope<T>>()
      .then(unwrap<T>),
  patch: <T>(url: string, options?: Options) =>
    instance
      .patch(url, options)
      .json<ApiEnvelope<T>>()
      .then(unwrap<T>),
  delete: <T>(url: string, options?: Options) =>
    instance
      .delete(url, options)
      .json<ApiEnvelope<T>>()
      .then(unwrap<T>)
}

/** 后端统一响应结构，字段名按实际项目调整 */
interface ApiEnvelope<T> {
  code: number
  message: string
  data: T
}

/**
 * 拆信封。接口直接返回裸数据时把这里改成 `return body as T` 即可。
 */
function unwrap<T>(body: ApiEnvelope<T>): T {
  return body.data
}

/**
 * token 存放在 localStorage，读写集中在这里，方便以后换成 cookie 或内存存储。
 */
const TOKEN_KEY = 'access_token'

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY)
}

export function setToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token)
}

export function clearToken(): void {
  localStorage.removeItem(TOKEN_KEY)
}

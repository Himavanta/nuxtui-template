import type { Paginated } from '@/types'

import { api } from '../client'

/**
 * 用户领域接口。
 *
 * 约定：
 * - 一个后端资源或业务域一个文件，文件名用单数小写（user / order / product）。
 * - 只做「拼路径 + 声明类型」，不写业务逻辑，不做 UI 提示。
 * - 返回值都带显式类型，禁止 any。
 */
export interface User {
  id: string
  name: string
  email: string
  avatar?: string
}

export interface UserListQuery {
  page?: number
  pageSize?: number
  keyword?: string
}

export const userApi = {
  getById: (id: string) => api.get<User>(`users/${id}`),

  list: (query: UserListQuery = {}) =>
    api.get<Paginated<User>>('users', { searchParams: toSearchParams({ ...query }) }),

  create: (payload: Omit<User, 'id'>) => api.post<User>('users', { json: payload }),

  update: (id: string, payload: Partial<Omit<User, 'id'>>) =>
    api.patch<User>(`users/${id}`, { json: payload }),

  remove: (id: string) => api.delete<void>(`users/${id}`)
}

/** 过滤掉 undefined，避免拼出 `?keyword=undefined` */
function toSearchParams(
  query: Record<string, string | number | undefined>
): Record<string, string> {
  const params: Record<string, string> = {}

  for (const [key, value] of Object.entries(query)) {
    if (value !== undefined) params[key] = String(value)
  }

  return params
}

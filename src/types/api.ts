/**
 * 跨模块共用的接口类型放这里。
 * 只被单个域（如 user）使用的类型留在 src/api/modules 里，不要往上提。
 */
export interface Paginated<T> {
  items: T[]
  total: number
}

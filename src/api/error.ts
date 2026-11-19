/**
 * 统一错误类型。
 *
 * 约定：
 * - 所有 api 层抛出的错误都是 ApiError（ky 的原始错误挂在 cause 上）。
 * - `message` 是可以直接展示给用户的中文文案。
 * - `code` 是业务错误码，后端没给时用 HTTP 状态码兜底。
 */
export class ApiError extends Error {
  /** 业务错误码；无业务码时是 HTTP 状态码 */
  readonly code: string | number
  /** HTTP 状态码；网络层失败时为 0 */
  readonly status: number
  /** 后端返回的原始响应体，便于调试 */
  readonly data: unknown

  constructor(
    message: string,
    options: { code: string | number; status: number; data?: unknown; cause?: unknown }
  ) {
    super(message, { cause: options.cause })
    this.name = 'ApiError'
    this.code = options.code
    this.status = options.status
    this.data = options.data
  }
}

/** 后端约定的错误响应体结构，按实际接口调整 */
interface ApiErrorBody {
  code?: string | number
  message?: string
}

const STATUS_MESSAGE: Record<number, string> = {
  400: '请求参数有误',
  401: '登录已过期，请重新登录',
  403: '没有权限访问该资源',
  404: '请求的资源不存在',
  408: '请求超时，请稍后重试',
  409: '数据冲突，请刷新后重试',
  422: '提交的数据不合法',
  429: '操作太频繁，请稍后再试',
  500: '服务器开小差了，请稍后重试',
  502: '网关异常，请稍后重试',
  503: '服务暂时不可用，请稍后重试',
  504: '网关超时，请稍后重试'
}

/**
 * 把任意异常规整成 ApiError。
 *
 * 这是一个纯函数，便于在 store / composable 里复用，也方便单测。
 */
export function normalizeError(error: unknown, fallback = '请求失败，请稍后重试'): ApiError {
  if (error instanceof ApiError) return error

  // ky 的 HTTPError：有 response，body 已解析到 data
  if (isHttpError(error)) {
    const status = error.response.status
    const body = asErrorBody(error.data)
    const message = body?.message || STATUS_MESSAGE[status] || `${fallback}（HTTP ${status}）`

    return new ApiError(message, {
      code: body?.code ?? status,
      status,
      data: error.data,
      cause: error
    })
  }

  // ky 的超时 / 网络错误
  if (isKyError(error)) {
    const name = error.name
    const status = 0

    if (name === 'TimeoutError') {
      return new ApiError(STATUS_MESSAGE[408], { code: 'TIMEOUT', status, cause: error })
    }

    return new ApiError('网络连接异常，请检查网络后重试', {
      code: 'NETWORK_ERROR',
      status,
      cause: error
    })
  }

  if (error instanceof Error) {
    return new ApiError(error.message || fallback, { code: 'UNKNOWN', status: 0, cause: error })
  }

  return new ApiError(fallback, { code: 'UNKNOWN', status: 0, cause: error })
}

function asErrorBody(data: unknown): ApiErrorBody | undefined {
  if (!data || typeof data !== 'object') return undefined

  const { code, message } = data as ApiErrorBody
  if (code === undefined && message === undefined) return undefined

  return { code, message }
}

/** ky 的错误类都带 isKyError 标记，且都继承自 KyError */
function isKyError(error: unknown): error is Error & { name: string } {
  return error instanceof Error && 'request' in error
}

/** HTTPError 独有 response 字段 */
function isHttpError(error: unknown): error is Error & { response: Response; data: unknown } {
  return isKyError(error) && 'response' in error
}

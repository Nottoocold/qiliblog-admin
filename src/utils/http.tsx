import ky, { HTTPError, type KyRequest, type KyResponse } from 'ky';
import { type NormalizedOptions } from 'ky';
import { useUserStore } from '@/store/userStore';
import { getAccessToken, getRefreshToken, setToken, clearToken } from './tokenUtils';
import type { MessageInstance } from 'antd/es/message/interface';
import type { ApiResult } from '@/types/server';
import type { LoginResponse } from '@/types/login';

// DEBUG 模式
const DEBUG = import.meta.env.VITE_APP_DEBUG || false;
// 业务错误标识
const BUSINESS_ERROR_FALG = 'Business Error';
// HTTP 错误标识
const HTTP_ERROR_FALG = 'HTTPError';
// 用于存储 antd 的 message 实例
let antdMessage: MessageInstance | null = null;

// 提供一个配置函数，在应用初始化时调用
function configureHttpMessage(messageInstance: MessageInstance) {
  antdMessage = messageInstance;
  if (DEBUG) {
    console.log('Configured antd message instance for HTTP client', antdMessage);
  }
}

/**
 * 自定义的错误类，扩展自 ky 的 HTTPError
 */
class MyError extends HTTPError {
  errorCode: number;
  constructor(response: Response, request: Request, options: NormalizedOptions) {
    super(response, request, options);
    this.errorCode = response.status; // 默认使用 HTTP 状态码
  }

  isBusinessError() {
    return this.name === BUSINESS_ERROR_FALG;
  }

  showError() {
    if (antdMessage) {
      if (this.response.status === 401) {
        antdMessage.error('登录已过期，请重新登录');
        return;
      }
      if (this.response.status === 403) {
        antdMessage.error('无权限访问');
        return;
      }
      antdMessage.error(this.message);
    } else {
      console.error('请求失败 (antd message 未配置):', this.message);
    }
  }

  printError() {
    return this.isBusinessError()
      ? `${this.errorCode}-${this.name}: ${this.message}`
      : `${this.name}: ${this.message} (HTTP ${this.response.status})`;
  }
}

function handleHttpError(error: unknown): void {
  if (error instanceof MyError) {
    error.showError();
  } else {
    console.warn('捕获到非 MyError 类型错误:', error);
    // 可以使用默认的错误提示方式
    if (antdMessage) {
      antdMessage.error('请求失败，请重试');
    }
  }
}

function getBusinessErrorCode(error: unknown): number | null {
  if (error instanceof MyError && error.isBusinessError()) {
    return error.errorCode;
  }
  return null;
}

/**
 * token刷新管理器
 */
class RefreshManager {
  /**
   * 是否正在刷新令牌
   */
  private _isRefreshing;
  /**
   * 队列，用于存储等待刷新的请求
   * resolve: 刷新成功时调用，传入新的访问令牌
   * reject: 刷新失败时调用，传入错误信息
   */
  private _retryQueue: Array<{
    resolve: (value: string) => void;
    reject: (reason: string) => void;
  }>;

  /**
   *  构造函数,初始化状态
   */
  constructor() {
    this._isRefreshing = false;
    this._retryQueue = [];
  }

  private onRefreshSuccess(data: LoginResponse['data']) {
    setToken(data.accessToken, data.refreshToken);
    if (DEBUG) {
      console.log('刷新令牌成功, 有' + this._retryQueue.length + '个并发请求正在等待刷新...');
    }
    this._retryQueue.forEach(({ resolve }) => resolve(data.accessToken));
    this._retryQueue = [];
  }

  private onRefreshFailure() {
    clearToken();
    useUserStore.getState().clear();
    if (DEBUG) {
      console.log('刷新令牌失败, 有' + this._retryQueue.length + '个并发请求正在等待刷新...');
    }
    this._retryQueue.forEach(({ reject }) => reject('刷新令牌失败'));
    this._retryQueue = [];
  }

  /**
   * 刷新令牌
   * @return 返回一个 Promise，解析为新的访问令牌, 或在刷新失败时拒绝
   */
  async refresh(): Promise<string> {
    if (!getRefreshToken()) {
      return Promise.reject('没有刷新令牌');
    }
    if (this._isRefreshing) {
      // 如果已经在刷新，返回一个新的 Promise 并将其加入队列,等待刷新完成
      return new Promise((resolve, reject) => {
        this._retryQueue.push({ resolve, reject });
      });
    }

    // 标记为正在刷新(防止重复刷新),实现并发请求情况下只有一个请求会触发刷新
    this._isRefreshing = true;

    // 执行刷新逻辑
    try {
      const resp = await ky
        .post('/api/auth/refresh', {
          timeout: 5000,
          searchParams: {
            t: Date.now(),
            refresh_token: getRefreshToken() ?? '',
          },
        })
        .json<LoginResponse>();
      const { data, errorCode } = resp;
      if (errorCode === 0 && data) {
        // 刷新成功，处理排队请求
        this.onRefreshSuccess(data);
        return data.accessToken;
      } else {
        // 刷新失败，拒绝所有排队请求
        this.onRefreshFailure();
        return Promise.reject('刷新令牌失败');
      }
    } catch {
      this.onRefreshFailure();
      return Promise.reject('刷新令牌失败');
    } finally {
      // 无论成功或失败，都将状态重置
      this._isRefreshing = false;
    }
  }
}

const refreshManager = new RefreshManager();

function requestHook(request: KyRequest): void {
  const accessToken = getAccessToken();
  if (accessToken) {
    request.headers.set('Authorization', `Bearer ${accessToken}`);
  }
}

async function refreshTokenHook(
  request: KyRequest,
  _options: NormalizedOptions,
  response: KyResponse
): Promise<void | Response> {
  if (response.status === 401) {
    // 401 未授权，尝试刷新令牌
    try {
      const ak = await refreshManager.refresh();
      request.headers.set('Authorization', `Bearer ${ak}`);
      return ky(request);
    } catch {
      // 刷新失败,什么也不做,继续返回原始的 401 响应
    }
  }
}

async function jsonResponseHook(
  _request: KyRequest,
  _options: NormalizedOptions,
  response: KyResponse
): Promise<void | Response> {
  // 对于200 OK 的响应，检查是否是业务错误
  if (response.ok) {
    if (DEBUG) {
      const ct = response.headers.get('Content-Type') || '';
      console.log('Response Content-Type', ct);
    }
    let apiResult: ApiResult<unknown> | null = null;
    try {
      apiResult = await response.json<ApiResult<unknown>>();
      if (apiResult.errorCode !== 0) {
        // 业务错误,构造一个假的 Response 返回,以触发 beforeError 钩子
        if (DEBUG) {
          console.warn('Business error detected in JSON response:', apiResult);
        }
        return new Response(JSON.stringify(apiResult), {
          status: 400,
          statusText: BUSINESS_ERROR_FALG,
          headers: response.headers,
        });
      }
    } catch (e) {
      console.warn('请求失败 (非 JSON 响应):', e);
    }
  }
}

async function handleErrorHook(error: HTTPError): Promise<MyError> {
  const myError = new MyError(error.response, error.request, error.options);
  const { status, statusText } = error.response;
  let apiResult = {} as ApiResult<unknown>;
  try {
    apiResult = await error.response.json<ApiResult<unknown>>();
  } catch {
    // 解析失败，保持 apiResult 为 null
  }
  if (status === 400 && statusText === BUSINESS_ERROR_FALG) {
    // 业务错误
    myError.name = BUSINESS_ERROR_FALG;
    myError.message = apiResult.errorDesc || '业务异常';
    myError.errorCode = apiResult.errorCode;
    if (DEBUG) {
      console.warn('Business error detected:', myError.printError());
    }
  } else {
    // 非业务错误
    myError.name = HTTP_ERROR_FALG;
    myError.message = apiResult.errorDesc || `HTTP Error: ${status}`;
    if (DEBUG) {
      console.error('HTTP error detected:', myError.printError());
    }
  }
  return myError;
}

const httpClient = ky.create({
  prefixUrl: '/api',
  timeout: false,
  hooks: {
    beforeRequest: [requestHook],
    afterResponse: [refreshTokenHook, jsonResponseHook],
    beforeError: [handleErrorHook],
  },
});

export { refreshManager, configureHttpMessage, handleHttpError, getBusinessErrorCode };
export default httpClient;

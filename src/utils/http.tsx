import ky, { HTTPError } from 'ky';
import { type NormalizedOptions } from 'ky';
import { getAccessToken } from './tokenUtils';
import type { MessageInstance } from 'antd/es/message/interface';
import type { ApiResult } from '@/types/server';
import refreshManager from './rtk';

const env = import.meta.env;

let antdMessage: MessageInstance | null = null;

// 提供一个配置函数，在应用初始化时调用
export function configureHttpMessage(messageInstance: MessageInstance) {
  antdMessage = messageInstance;
  if (env.VITE_APP_DEBUG) {
    console.log('Configured antd message instance for HTTP client', antdMessage);
  }
}

const BUSINESS_ERROR_FALG = 'Business Error';
const HTTP_ERROR_FALG = 'HTTPError';

export class MyError extends HTTPError {
  errorCode: number;
  constructor(response: Response, request: Request, options: NormalizedOptions) {
    super(response, request, options);
    this.errorCode = 0;
  }

  isBusinessError() {
    return this.name === BUSINESS_ERROR_FALG;
  }

  showError() {
    if (antdMessage) {
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

export function handleHttpError(error: unknown): void {
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

export function getBusinessErrorCode(error: unknown): number | null {
  if (error instanceof MyError && error.isBusinessError()) {
    return error.errorCode;
  }
  return null;
}

const httpClient = ky.create({
  prefixUrl: '/api',
  timeout: false,
  hooks: {
    beforeRequest: [
      request => {
        const accessToken = getAccessToken();
        if (accessToken) {
          request.headers.set('Authorization', `Bearer ${accessToken}`);
        }
      },
    ],
    afterResponse: [
      async (request, _options, response) => {
        if (response.status === 401) {
          // 401 未授权，尝试刷新令牌
          try {
            const ak = await refreshManager.refresh();
            request.headers.set('Authorization', `Bearer ${ak}`);
            return ky(request);
          } catch {
            // 刷新失败，跳转登录
            antdMessage?.error('登录已过期，请重新登录');
            window.location.href = '/login';
          }
        }
      },
      async (_request, _options, response) => {
        // 这里总会执行，无论是2xx还是非2xx
        if (response.ok) {
          let apiResult: ApiResult<unknown> | null = null;
          try {
            apiResult = await response.json<ApiResult<unknown>>();
            if (apiResult.errorCode !== 0) {
              // 业务错误
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
      },
    ],
    beforeError: [
      async error => {
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
          if (env.VITE_APP_DEBUG) {
            console.warn('Business error detected:', myError.printError());
          }
        } else {
          // 非业务错误
          myError.name = HTTP_ERROR_FALG;
          myError.message = apiResult.errorDesc || `HTTP Error: ${status}`;
          if (env.VITE_APP_DEBUG) {
            console.error('HTTP error detected:', myError.printError());
          }
        }
        return myError;
      },
    ],
  },
});

export default httpClient;

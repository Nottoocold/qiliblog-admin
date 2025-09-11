import ky, { HTTPError } from 'ky';
import { type NormalizedOptions } from 'ky';
import { getAccessToken } from './tokenUtils';
import type { MessageInstance } from 'antd/es/message/interface';
import type { ApiResult } from '@/types/server';

let antdMessage: MessageInstance | null = null;

// 提供一个配置函数，在应用初始化时调用
export function configureHttpMessage(messageInstance: MessageInstance) {
  antdMessage = messageInstance;
  console.log('Configured antd message instance for HTTP client', antdMessage);
}

const BUSINESS_ERROR_FALG = 'Business Error';

export class MyError extends HTTPError {
  constructor(response: Response, request: Request, options: NormalizedOptions) {
    super(response, request, options);
  }

  isBusinessError() {
    return this.name === 'BusinessError';
  }

  showError() {
    if (antdMessage) {
      antdMessage.error(this.message);
    } else {
      console.error('请求失败 (antd message 未配置):', this.message);
    }
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
      (request, options, response) => {
        console.log(
          'afterResponse hook[0] executed, response is',
          response,
          ', request is',
          request,
          ', options is',
          options
        );
      },
      async (_request, _options, response) => {
        // 这里总会执行，无论是2xx还是非2xx
        console.log('afterResponse hook[1] executed, will do custom response handling');
        if (response.ok) {
          // 处理成功响应
          const contentType = response.headers.get('Content-Type');
          if (contentType && contentType.includes('application/json')) {
            const apiResult = await response.json<ApiResult<unknown>>();
            const { errorCode } = apiResult;
            if (errorCode === 0) {
              return new Response(JSON.stringify(apiResult), { status: 200, statusText: 'OK' });
            } else {
              // 业务错误，这里把http状态码从200改成400，方便ky内部做错误处理，能在catch里捕获到
              return new Response(JSON.stringify(apiResult), {
                status: 400,
                statusText: BUSINESS_ERROR_FALG,
                headers: response.headers,
              });
            }
          } else {
            // 非JSON响应,目前基本上都是JSON响应,代码基本不会走到这里,后期再处理非JSON响应,比如文件下载等
            console.log('非JSON响应,直接返回原始响应');
            return response;
          }
        } else {
          // 处理错误响应,这里是http状态码非2xx
          // 非2xx的响应,也被后端统一包装成了json
          const contentType = response.headers.get('Content-Type');
          if (contentType && contentType.includes('application/json')) {
            const apiResult = await response.json<ApiResult<unknown>>();
            return new Response(JSON.stringify(apiResult), {
              status: response.status,
              statusText: response.statusText,
              headers: response.headers,
            });
          } else {
            // 非JSON响应,目前基本上都是JSON响应,代码基本不会走到这里,后期再处理非JSON响应,比如文件下载等
            console.log('非JSON响应,直接返回原始响应');
            return response;
          }
        }
      },
    ],
    beforeError: [
      async error => {
        console.log(
          'beforeError hook[0] executed, customize the error here. original error is',
          error
        );
        const _myError = new MyError(error.response, error.request, error.options);
        const { status, statusText, headers } = error.response;
        let apiResult = new Object() as ApiResult<unknown>;
        const contentType = headers.get('Content-Type');
        if (contentType && contentType.includes('application/json')) {
          apiResult = await error.response.json<ApiResult<unknown>>();
        }
        if (status === 400 && statusText === BUSINESS_ERROR_FALG) {
          // 业务错误
          console.log('业务错误:', apiResult);
          _myError.name = 'BusinessError';
          _myError.message = apiResult.errorDesc || '业务异常';
        } else {
          // 非业务错误
          console.log('HTTP错误:', status, statusText);
          _myError.name = 'HTTPError';
          _myError.message = apiResult.errorDesc || `HTTP Error: ${status}`;
        }
        return _myError;
      },
    ],
  },
});

export default httpClient;

import ky from 'ky';
import { getRefreshToken, setToken } from './tokenUtils';
import type { LoginResponse } from '@/types/login';
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

  /**
   * 刷新令牌
   * @return 返回一个 Promise，解析为新的访问令牌, 或在刷新失败时拒绝
   */
  async refresh(): Promise<string> {
    if (this._isRefreshing) {
      // 如果已经在刷新，返回一个新的 Promise 并将其加入队列,等待刷新完成
      return new Promise((resolve, reject) => {
        this._retryQueue.push({ resolve, reject });
      });
    }

    // 标记为正在刷新(防止重复刷新)
    this._isRefreshing = true;

    // 执行刷新逻辑
    try {
      const resp = await ky
        .post('/api/auth/refresh', {
          timeout: 5000,
          searchParams: {
            t: Date.now(),
            refresh_token: getRefreshToken() || '',
          },
        })
        .json<LoginResponse>();
      const { data, errorCode } = resp;
      if (errorCode === 0 && data) {
        setToken(data.accessToken, data.refreshToken);
        // 刷新成功，处理排队请求
        this._retryQueue.forEach(({ resolve }) => resolve(data.accessToken));
        this._retryQueue = [];
        return data.accessToken;
      } else {
        // 刷新失败，拒绝所有排队请求
        this._retryQueue.forEach(({ reject }) => reject('刷新令牌失败'));
        this._retryQueue = [];
        return Promise.reject('刷新令牌失败');
      }
    } catch {
      return Promise.reject('刷新令牌失败');
    } finally {
      // 无论成功或失败，都将状态重置
      this._isRefreshing = false;
    }
  }
}

const refreshManager = new RefreshManager();

export default refreshManager;

import ky from 'ky';
import { getRefreshToken, setToken } from './tokenUtils';
import type { LoginResponse } from '@/types/login';
class RefreshManager {
  // 是否正在刷新令牌
  _isRefreshing = false;
  // 刷新令牌时排队的请求
  _retryQueue: Array<{
    resolve: (value: string) => void;
    reject: (reason: string | null) => void;
  }> = [];

  constructor() {
    this._isRefreshing = false;
    this._retryQueue = [];
  }

  isRefresh() {
    return this._isRefreshing;
  }

  async refresh(): Promise<string> {
    if (this._isRefreshing) {
      return new Promise((resolve, reject) => {
        this._retryQueue.push({ resolve, reject });
      });
    }

    this._isRefreshing = true; // 标记为正在刷新

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
      return Promise.reject('刷新令牌请求失败');
    } finally {
      this._isRefreshing = false; // 重置刷新状态
    }
  }
}

const refreshManager = new RefreshManager();

export default refreshManager;

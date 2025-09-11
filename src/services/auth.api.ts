import type { LoginParams, LoginResponse, UserInfoResponse } from '@/types/login';
import type { ApiResult } from '@/types/server';
import httpClient from '@/utils/http';

const authApi = httpClient.extend(options => ({ prefixUrl: `${options.prefixUrl}/auth` }));

export const login = (payload: LoginParams) => {
  return authApi.post('login', { json: payload }).json<LoginResponse>();
};

export const getUserInfo = () => {
  return authApi.get('userinfo').json<UserInfoResponse>();
};

export const logout = () => {
  return authApi.post('logout').json<ApiResult<unknown>>();
};

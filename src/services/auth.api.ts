import type { LoginParams, LoginResponse } from '@/types/login';
import httpClient from '@/utils/http';

const authApi = httpClient.extend(options => ({ prefixUrl: `${options.prefixUrl}/auth` }));

export const login = (payload: LoginParams): Promise<LoginResponse> => {
  return authApi.post('login', { json: payload }).json<LoginResponse>();
};

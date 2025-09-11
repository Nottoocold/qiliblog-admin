import type { ApiResult } from './server';

export enum LoginType {
  email = 0,
  phone = 1,
  account = 2,
}

interface BaseLoginParams {
  identifier: string;
  credential?: string;
  loginType: number;
}

interface LoginByPhoneParams extends BaseLoginParams {
  code: string;
}

export type LoginParams = BaseLoginParams | LoginByPhoneParams;

export interface LoginFormValues {
  username?: string;
  password?: string;
  phone?: string;
  code?: string;
  email?: string;
  remember?: boolean;
}

export type LoginResponse = ApiResult<{
  accessToken: string;
  refreshToken: string;
  expiresIn: string;
}>;

export interface UserInfo {
  id: string;
  username: string;
  nickname: string;
  email: string;
  phone?: string;
  avatar?: string;
  roles?: string[];
  permissions?: string[];
}

export type UserInfoResponse = ApiResult<UserInfo>;

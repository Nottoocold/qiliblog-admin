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

export type LoginResponse = ApiResult<{
  accessToken: string;
  refreshToken: string;
  expiresIn: string;
}>;

export enum LoginType {
  email = 0,
  phone = 1,
  account = 2,
}

interface BaseLoginParams {
  remember?: boolean;
  identifier: string;
  credential?: string;
}

interface LoginByPhoneParams extends BaseLoginParams {
  loginType: LoginType.phone;
  code: string;
}

interface LoginByAccountParams extends BaseLoginParams {
  loginType: LoginType.account;
}

interface LoginByEmailParams extends BaseLoginParams {
  loginType: LoginType.email;
}

export type LoginParams = LoginByPhoneParams | LoginByAccountParams | LoginByEmailParams;

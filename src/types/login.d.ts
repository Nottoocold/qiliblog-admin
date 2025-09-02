type LoginByPhoneParams = {
  phone: string;
  code: string;
  remember?: boolean;
};

type LoginByAccountParams = {
  account: string;
  password: string;
  remember?: boolean;
};

export type LoginParams = LoginByPhoneParams | LoginByAccountParams;

import { createContext, useContext } from 'react';
import type { MessageInstance } from 'antd/es/message/interface';
import type { ModalStaticFunctions } from 'antd/es/modal/confirm';
import type { NotificationInstance } from 'antd/es/notification/interface';

interface AntdStaticFunctions {
  message?: MessageInstance;
  notification?: NotificationInstance;
  modal?: ModalStaticFunctions;
}

export const AntdContext = createContext<AntdStaticFunctions>({});

export const useAntd = () => {
  return useContext(AntdContext);
};

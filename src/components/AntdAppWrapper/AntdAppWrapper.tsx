import { App, Modal } from 'antd';
import { AntdContext } from './AntdContext';
import { useEffect } from 'react';
import { configureHttpMessage } from '@/utils/http';

export const AntdAppWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const staticFunctions = App.useApp();

  useEffect(() => {
    configureHttpMessage(staticFunctions.message);
  });

  return (
    <AntdContext.Provider
      value={{
        message: staticFunctions.message,
        notification: staticFunctions.notification,
        modal: {
          ...staticFunctions.modal,
          warn: Modal.warn,
        },
      }}
    >
      {children}
    </AntdContext.Provider>
  );
};

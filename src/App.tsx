import './App.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import routes from './router/router.tsx';
import { ConfigProvider, App as AntdApp } from 'antd';

const router = createBrowserRouter(routes);

const App = () => {
  return (
    <ConfigProvider
      theme={{
        components: {
          Layout: {
            headerHeight: 64,
          },
        },
      }}
    >
      <AntdApp>
        <RouterProvider router={router} />
      </AntdApp>
    </ConfigProvider>
  );
};

export default App;

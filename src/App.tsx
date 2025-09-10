import './App.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import routes from './router/router.tsx';
import { ConfigProvider, App as AntdApp } from 'antd';
import { AntdAppWrapper } from './components/AntdAppWrapper/AntdAppWrapper.tsx';

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
      <AntdApp style={{ height: '100%' }}>
        <AntdAppWrapper>
          <RouterProvider router={router} />
        </AntdAppWrapper>
      </AntdApp>
    </ConfigProvider>
  );
};

export default App;

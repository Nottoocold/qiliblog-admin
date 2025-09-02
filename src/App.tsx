import './App.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import routes from './router/router.tsx';
import { ConfigProvider } from 'antd';

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
      <RouterProvider router={router} />
    </ConfigProvider>
  );
};

export default App;

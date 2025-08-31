import './App.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import routes from './router/router.tsx';
import { ConfigProvider } from 'antd';

const router = createBrowserRouter(routes);

const App = () => {
  return (
    <ConfigProvider>
      <RouterProvider router={router} />
    </ConfigProvider>
  );
};

export default App;

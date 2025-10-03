import './App.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import routes from './router/router.tsx';
import { ConfigProvider, App as AntdApp, theme as AntdTheme } from 'antd';
import { AntdAppWrapper } from './components/AntdAppWrapper/AntdAppWrapper.tsx';
import { useThemeStore } from './store/userTheme.ts';
import { useShallow } from 'zustand/shallow';

const router = createBrowserRouter(routes);

const App = () => {
  const { theme } = useThemeStore(useShallow(state => ({ theme: state.theme })));
  return (
    <ConfigProvider
      theme={{
        algorithm: theme === 'dark' ? AntdTheme.darkAlgorithm : AntdTheme.defaultAlgorithm,
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

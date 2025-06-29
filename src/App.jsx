import { ConfigProvider } from "antd";
import { RouterProvider } from "react-router-dom";
import router from "./router/config";
import "./index.css";

function App() {
  return (
    <ConfigProvider
      theme={{
        token: {
          // Seed Token，影响范围大
          colorPrimary: "#1890ff"
        },
      }}
    >
      <RouterProvider router={router} />
    </ConfigProvider>
  );
}

export default App;

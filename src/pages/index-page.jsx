import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Index() {
  const navigate = useNavigate();

  useEffect(() => {
    // 可以在这里做一些初始化操作，如未登录跳转到登录页，否则跳转到首页
    console.log("index router");
    
    navigate("/dashboard");
  }, [navigate]);

  // return (
  //   <p id="zero-state">
  //     This is a demo for React Router.
  //     <br />
  //     Check out{" "}
  //     <a href="https://reactrouter.com">
  //       the docs at reactrouter.com
  //     </a>
  //     .
  //   </p>
  // );
}

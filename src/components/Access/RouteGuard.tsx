import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import ScreenLoading from '@/components/ScreenLoading/ScreenLoading';
import { useUserStore } from '@/store/userStore';
import { useShallow } from 'zustand/shallow';

const RouteGuard = ({ children }: { children: React.ReactNode }) => {
  const [isValid, setisValid] = useState<boolean | null>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const [isAuthenticated, user] = useUserStore(
    useShallow(state => [state.isAuthenticated, state.user])
  );

  console.log(location.pathname, 'need to be protected');

  useEffect(() => {
    let isMounted = true;
    // 检查用户是否已认证
    if (isMounted) {
      console.log('isAuthenticated:', isAuthenticated, 'user:', user);
      setisValid(isAuthenticated || !!user);
    }
    return () => {
      isMounted = false;
    };
  }, [isAuthenticated, user]);

  useEffect(() => {
    if (isValid === false) {
      navigate('/login', { replace: true, state: { from: encodeURIComponent(location.pathname) } });
    }
  }, [isValid, navigate, location]);

  if (isValid == null) {
    return <ScreenLoading tip="资源加载中..." />;
  }
  if (isValid === true) {
    return children;
  }
  // 此处返回null, 实际跳转操作在useEffect中完成，避免了在渲染阶段跳转，导致组件渲染异常
  // react的渲染过程：1. render阶段，2. commit阶段，3. commit阶段结束后，会触发useEffect
  // react的渲染过程必须是纯函数，不能有副作用，所以不能在render阶段跳转，否则会警告⚠️
  return null;
};

export default RouteGuard;

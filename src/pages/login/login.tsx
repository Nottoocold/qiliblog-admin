import { useState } from 'react';
import { Form, Input, Button, Tabs, Space, theme } from 'antd';
import { MobileOutlined, LockOutlined, UserOutlined, MailOutlined } from '@ant-design/icons';
import styles from './login.module.less';
import type { LoginFormValues, LoginParams } from '@/types/login';
import { LoginType } from '@/types/login.d';
import { useLocation, useNavigate } from 'react-router-dom';
import { handleHttpError } from '@/utils/http';
import { useAntd } from '@/components/AntdAppWrapper/AntdContext';
import { getUserInfo, login } from '@/services/auth.api';
import { useUserStore } from '@/store/userStore';
import { setToken } from '@/utils/tokenUtils';
import { useShallow } from 'zustand/shallow';
import { useBoolean } from 'ahooks';
import { LogoIcon } from '@/components/CustomerIcon/Logo/Logo';

const { useToken } = theme;

const LoginPage = () => {
  const { token } = useToken();
  const { message } = useAntd();
  const { setUserState } = useUserStore(
    useShallow(state => ({ setUserState: state.setUserState }))
  );
  const [form] = Form.useForm<LoginFormValues>();
  const [activeTab, setActiveTab] = useState('account');
  const [countdown, setCountdown] = useState(0);
  const [loading, loadingAction] = useBoolean(false);
  const navigate = useNavigate();
  const location = useLocation();
  const from = decodeURIComponent(location.state?.from || '/');
  const loginMethod =
    activeTab === 'phone'
      ? LoginType.phone
      : activeTab === 'email'
        ? LoginType.email
        : LoginType.account;
  // 获取验证码倒计时
  const getVerificationCode = async () => {
    try {
      await form.validateFields(['phone']);
    } catch {
      return;
    }

    if (countdown > 0) return;

    setCountdown(60);
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    message.success('验证码已发送');
  };

  const onFinish = async (values: LoginFormValues) => {
    let payload: LoginParams;

    switch (loginMethod) {
      case LoginType.phone:
        payload = {
          loginType: LoginType.phone,
          identifier: values.phone || '',
          code: values.code!,
        };
        break;
      case LoginType.email:
        payload = {
          loginType: LoginType.email,
          identifier: values.email || '',
          credential: values.password!,
        };
        break;
      case LoginType.account:
      default:
        payload = {
          loginType: LoginType.account,
          identifier: values.username || '',
          credential: values.password!,
        };
        break;
    }
    loadingAction.setTrue();
    try {
      const loginResponse = await login(payload);
      setToken(loginResponse.data.accessToken, loginResponse.data.refreshToken);
      const userInfoResponse = await getUserInfo();
      // 保存用户信息和认证状态
      setUserState(userInfoResponse.data, true);
      message.success('登录成功');
      navigate(from, { replace: true });
    } catch (error) {
      handleHttpError(error);
    }
    loadingAction.setFalse();
  };

  return (
    <div className={styles.container} style={{ backgroundColor: token.colorBgContainer }}>
      {/* 顶部Logo区域 */}
      <div className={styles.header}>
        <div className={styles.logoSection}>
          <LogoIcon style={{ width: 100, height: 50 }} />
          <h2 className={styles.platformDesc}>后台管理平台</h2>
        </div>
      </div>

      {/* 登录表单区域 */}
      <div className={styles.formWrapper}>
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          centered
          items={[
            {
              key: 'account',
              label: '账号登录',
            },
            {
              key: 'email',
              label: '邮箱登录',
            },
            {
              key: 'phone',
              label: '手机号登录',
            },
          ]}
        />

        <Form form={form} name="login" onFinish={onFinish} size="large">
          {activeTab === 'phone' ? (
            <>
              {/* 手机号登录表单 */}
              <Form.Item
                name="phone"
                rules={[
                  { required: true, message: '请输入手机号!' },
                  { pattern: /^1[3-9]\d{9}$/, message: '手机号格式不正确!' },
                ]}
              >
                <Input prefix={<MobileOutlined />} placeholder="手机号" />
              </Form.Item>

              <Form.Item name="code" rules={[{ required: true, message: '请输入验证码!' }]}>
                <Space.Compact style={{ width: '100%' }}>
                  <Input prefix={<LockOutlined />} placeholder="请输入验证码" />
                  <Button type="default" disabled={countdown > 0} onClick={getVerificationCode}>
                    {countdown > 0 ? `${countdown}s后重新获取` : '获取验证码'}
                  </Button>
                </Space.Compact>
              </Form.Item>
            </>
          ) : activeTab === 'email' ? (
            <>
              {/* 邮箱登录表单 */}
              <Form.Item
                name="email"
                rules={[
                  { required: true, message: '请输入邮箱!' },
                  { type: 'email', message: '邮箱格式不正确!' },
                ]}
                validateTrigger="onBlur"
              >
                <Input prefix={<MailOutlined />} placeholder="邮箱" />
              </Form.Item>

              <Form.Item name="password" rules={[{ required: true, message: '请输入密码!' }]}>
                <Input.Password prefix={<LockOutlined />} placeholder="密码" />
              </Form.Item>
            </>
          ) : (
            <>
              {/* 账号/游戏密码登录表单 */}
              <Form.Item
                name="username"
                rules={[{ required: true, message: '请输入用户名!' }]}
                validateTrigger="onBlur"
              >
                <Input prefix={<UserOutlined />} placeholder="用户名" />
              </Form.Item>

              <Form.Item name="password" rules={[{ required: true, message: '请输入密码!' }]}>
                <Input.Password prefix={<LockOutlined />} placeholder="密码" />
              </Form.Item>
            </>
          )}

          {/* 登录按钮 */}
          <Form.Item>
            <Button type="primary" htmlType="submit" block loading={loading}>
              登录
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default LoginPage;

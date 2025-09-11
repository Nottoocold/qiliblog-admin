import { useState } from 'react';
import { Form, Input, Button, Checkbox, Tabs, Divider, Space } from 'antd';
import {
  MobileOutlined,
  LockOutlined,
  UserOutlined,
  AlipayOutlined,
  TaobaoOutlined,
  WeiboOutlined,
  MailOutlined,
} from '@ant-design/icons';
import styles from './login.module.less';
import type { LoginFormValues, LoginParams } from '@/types/login';
import { LoginType } from '@/types/login.d';
import { useLocation, useNavigate } from 'react-router-dom';
import { handleHttpError } from '@/utils/http';
import { useAntd } from '@/components/AntdAppWrapper/AntdContext';
import { getUserInfo, login } from '@/services/auth.api';
import { useUserStore } from '@/store/userStore';

const LoginPage = () => {
  const { message } = useAntd();
  const { onLogin, onLoadedUserInfo } = useUserStore();
  const [form] = Form.useForm<LoginFormValues>();
  const [activeTab, setActiveTab] = useState<string>('account');
  const [countdown, setCountdown] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
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
    console.log('登录参数:', values);
    setLoading(true);
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
    setLoading(true);
    try {
      const loginResponse = await login(payload);
      // 使用zustand store保存用户信息和token
      onLogin(loginResponse.data.accessToken, loginResponse.data.refreshToken);
      const userinfoResponse = await getUserInfo();
      onLoadedUserInfo(userinfoResponse.data);
      message.success('登录成功');
      navigate(from, { replace: true });
    } catch (error) {
      handleHttpError(error);
    }
    setLoading(false);
  };

  return (
    <div className={styles.container}>
      {/* 顶部Logo区域 */}
      <div className={styles.header}>
        <div className={styles.logoSection}>
          <svg height="48" width="48" className={styles.githubLogo}>
            <path
              fill="#000"
              d="M24 0C10.7 0 0 10.7 0 24c0 10.6 6.9 19.6 16.5 22.8 1.2.2 1.6-.5 1.6-1.1v-4.2c-6.6 1.4-8-3.2-8-3.2-1.1-2.8-2.7-3.5-2.7-3.5-2.2-1.5.2-1.5.2-1.5 2.4.2 3.7 2.5 3.7 2.5 2.2 3.7 5.6 2.7 7 2.1.2-1.7.9-2.7 1.6-3.3-5.5-.6-11.3-2.8-11.3-12.3 0-2.7 1-4.9 2.5-6.6-.3-.6-1.1-3.1.2-6.5 0 0 2-.7 6.6 2.5 1.9-.5 4-.8 6-.8s4.1.3 6 .8c4.6-3.2 6.6-2.5 6.6-2.5 1.3 3.4.5 5.9.2 6.5 1.5 1.7 2.5 3.9 2.5 6.6 0 9.5-5.8 11.7-11.3 12.3.9.8 1.7 2.3 1.7 4.6v6.8c0 .7.4 1.3 1.6 1.1C41.1 43.6 48 34.6 48 24 48 10.7 37.3 0 24 0z"
            />
          </svg>
          <h1 className={styles.platformName}>七里之外</h1>
        </div>
        <p className={styles.platformDesc}>qiliblog博客后台管理平台</p>
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

        <Form form={form} name="login" onFinish={onFinish} autoComplete="off" size="large">
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

          {/* 自动登录和忘记密码 */}
          <Form.Item>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <Form.Item name="remember" valuePropName="checked" noStyle>
                <Checkbox>自动登录</Checkbox>
              </Form.Item>
              <Button type="link" size="small">
                忘记密码
              </Button>
            </div>
          </Form.Item>

          {/* 登录按钮 */}
          <Form.Item>
            <Button type="primary" htmlType="submit" block loading={loading}>
              登录
            </Button>
          </Form.Item>
        </Form>

        {/* 其他登录方式 */}
        <Divider plain>其他登录方式</Divider>
        <div className={styles.socialLogin}>
          <Space size="large">
            <Button type="text" icon={<AlipayOutlined />} className={styles.socialIcon} />
            <Button type="text" icon={<TaobaoOutlined />} className={styles.socialIcon} />
            <Button type="text" icon={<WeiboOutlined />} className={styles.socialIcon} />
          </Space>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

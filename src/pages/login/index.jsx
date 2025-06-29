import React, { useState } from "react";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import {
  Button,
  Checkbox,
  Form,
  Input,
  Card,
  Divider,
  notification,
} from "antd";
import useTitleSetter from "../../hook/useTitleSetter";
import { createStyles, css } from "antd-style";

const useStyles = createStyles(({ token }) => ({
  container: css`
    display: flex;
    justify-content: center;
    align-items: center;
    height: calc(100vh - 40px);
    background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
    padding: 20px;
  `,

  loginCard: css`
    width: 100%;
    max-width: 420px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
    border: none;
    transition: all 0.3s ease;

    &:hover {
      box-shadow: 0 15px 40px rgba(0, 0, 0, 0.15);
    }

    .ant-card-head {
      border-bottom: none;
      text-align: center;
    }
  `,

  logoArea: css`
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 24px;
  `,

  logoIcon: css`
    width: 64px;
    height: 64px;
    background: linear-gradient(135deg, ${token.colorPrimary} 0%, #722ed1 100%);
    border-radius: 15px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 28px;
    font-weight: bold;
    color: white;
    box-shadow: 0 4px 10px rgba(24, 144, 255, 0.3);
    margin-bottom: 12px;
  `,

  appName: css`
    font-size: 24px;
    font-weight: 600;
    color: ${token.colorPrimary};
    margin-bottom: 4px;
  `,

  appDescription: css`
    color: #666;
    font-size: 14px;
  `,

  loginForm: css`
    .ant-form-item-explain-error {
      font-size: 12px;
    }

    .ant-input-prefix {
      color: rgba(0, 0, 0, 0.25);
    }
  `,

  submitButton: css`
    width: 100%;
    height: 42px;
    font-weight: 500;
    background: linear-gradient(to right, ${token.colorPrimary}, #722ed1);
    border: none;
    font-size: 15px;

    &:hover {
      background: linear-gradient(to right, #40a9ff, #9254de) !important;
    }
  `,

  formFooter: css`
    display: flex;
    justify-content: space-between;
    margin-top: 12px;
  `,

  socialLoginArea: css`
    display: flex;
    justify-content: center;
    gap: 16px;
    margin-top: 24px;
  `,

  socialIcon: css`
    width: 44px;
    height: 44px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #f5f7fa;
    color: #666;
    cursor: pointer;
    transition: all 0.3s ease;

    &:hover {
      transform: translateY(-3px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
      background: #e6f7ff;
      color: ${token.colorPrimary};
    }
  `,
}));

const Login = () => {
  useTitleSetter();
  const { styles } = useStyles();
  const [loading, setLoading] = useState(false);

  const onFinish = (values) => {
    console.log("Received values:", values);
    setLoading(true);

    // 模拟登录请求
    setTimeout(() => {
      setLoading(false);
      notification.success({
        message: "登录成功",
        description: "欢迎回到博客后台管理系统",
        placement: "topRight",
      });
    }, 1500);
  };

  return (
    <div className={styles.container}>
      <Card
        title=""
        className={styles.loginCard}
        styles={{ header: { border: 0 } }}
      >
        <div className={styles.logoArea}>
          <div className={styles.logoIcon}>B</div>
          <div className={styles.appName}>博客管理系统</div>
          <div className={styles.appDescription}>高效管理您的博客内容</div>
        </div>

        <Form
          name="login"
          initialValues={{ remember: true }}
          onFinish={onFinish}
          className={styles.loginForm}
          size="large"
        >
          <Form.Item
            name="username"
            rules={[{ required: true, message: "请输入您的用户名!" }]}
          >
            <Input
              prefix={<UserOutlined />}
              placeholder="用户名"
              allowClear
              autoFocus
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: "请输入您的密码!" }]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="密码"
              allowClear
            />
          </Form.Item>

          <Form.Item>
            <Form.Item name="remember" valuePropName="checked" noStyle>
              <Checkbox>记住我</Checkbox>
            </Form.Item>
            <a style={{ float: "right" }} href="#">
              忘记密码?
            </a>
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className={styles.submitButton}
              loading={loading}
            >
              登录系统
            </Button>
          </Form.Item>

          <div className={styles.formFooter}>
            <span>
              还没有账号? <a>立即注册</a>
            </span>
            <a>访问公开博客</a>
          </div>
        </Form>

        <Divider plain>或使用以下方式登录</Divider>

        <div className={styles.socialLoginArea}>
          <div className={styles.socialIcon} title="Google 登录">
            <svg width="20" height="20" viewBox="0 0 24 24">
              <path d="M20.283 10.356h-8.327v3.451h4.792c-.446 2.193-2.313 3.453-4.792 3.453a5.27 5.27 0 0 1-5.279-5.28 5.27 5.27 0 0 1 5.279-5.279c1.259 0 2.397.447 3.29 1.178l2.6-2.599c-1.584-1.381-3.615-2.233-5.89-2.233a8.908 8.908 0 0 0-8.934 8.934 8.907 8.907 0 0 0 8.934 8.934c4.467 0 8.529-3.249 8.529-8.934 0-.528-.081-1.097-.202-1.625z"></path>
            </svg>
          </div>
          <div className={styles.socialIcon} title="Facebook 登录">
            <svg width="20" height="20" viewBox="0 0 24 24">
              <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"></path>
            </svg>
          </div>
          <div className={styles.socialIcon} title="Github 登录">
            <svg width="20" height="20" viewBox="0 0 24 24">
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57C20.565 21.795 24 17.31 24 12c0-6.63-5.37-12-12-12z"
              />
            </svg>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Login;

import { Footer } from '@/components';
import { userRegisterUsingPost } from '@/services/hebi/userController';
import { uploadFileUsingPost } from '@/services/hebi/fileController';
import { LockOutlined, PictureOutlined, UserOutlined } from '@ant-design/icons';
import { ProForm, ProFormText } from '@ant-design/pro-components';
import { Helmet, history, Link } from '@umijs/max';
import { Avatar, Card, Form, message, Typography, Upload } from 'antd';
import { createStyles } from 'antd-style';
import React, { useState } from 'react';
import Settings from '../../../../config/defaultSettings';

const { Title } = Typography;

const useStyles = createStyles(({ token }) => {
  return {
    container: {
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      overflow: 'auto',
      backgroundImage:
        "url('https://mdn.alipayobjects.com/yuyan_qk0oxh/afts/img/V-_oS6r-i7wAAAAAAAAAAAAAFl94AQBr')",
      backgroundSize: '100% 100%',
    },
    card: {
      minWidth: 320,
      maxWidth: '75vw',
      padding: token.paddingLG,
      background: 'transparent',
      border: 'none',
      boxShadow: 'none',
    },
    header: {
      textAlign: 'center',
      marginBottom: 24,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      gap: '16px',
    },
    loginLink: {
      display: 'block',
      textAlign: 'center',
      marginBottom: 24,
    },
    avatarUploader: {
      display: 'flex',
      justifyContent: 'center',
      marginBottom: 24,
    },
  };
});

const Register: React.FC = () => {
  const { styles } = useStyles();
  const [avatarUrl, setAvatarUrl] = useState<string>();
  const [form] = Form.useForm();

  const handleSubmit = async (values: Record<string, any>) => {
    try {
      if (values.userPassword !== values.checkPassword) {
        message.error('两次输入的密码不一致！');
        return;
      }

      const res = await userRegisterUsingPost({ ...values, userAvatar: 'http://img-oss.shuguangwl.com/2025/05/18/6829ae97cee35.png' });
      if (res.code === 0) {
        message.success('注册成功！');
        history.push('/user/login');
      } else {
        message.error(res.message);
      }
    } catch (error) {
      message.error('注册失败，请重试！');
    }
  };

  const uploadButton = (
    <div>
      <PictureOutlined />
      <div style={{ marginTop: 8 }}>上传头像</div>
    </div>
  );

 

  return (
    <div className={styles.container}>
      <Helmet>
        <title>{'注册'} - {Settings.title}</title>
      </Helmet>
      
      <div style={{ flex: '1', padding: '32px 0', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Card className={styles.card}>
          <div className={styles.header}>
            <img alt="logo" src="/logo.svg" style={{ height: 44 }} />
            <div>
              <Title level={3} style={{ margin: 0 }}>基于AIGC的智能数据分析系统</Title>
              <div style={{ color: 'rgba(0,0,0,.45)' }}>本系统助力于让数据分析变得简单高效</div>
            </div>
          </div>

          <Link to="/user/login" className={styles.loginLink}>已有账号？立即登录</Link>

          <ProForm
            form={form}
            onFinish={handleSubmit}
            submitter={{
              searchConfig: { submitText: '注册' },
              render: (_, dom) => dom.pop(),
              submitButtonProps: {
                size: 'large',
                style: { width: '100%' },
              },
            }}
          >
            

            <ProFormText
              name="userAccount"
              fieldProps={{ size: 'large', prefix: <UserOutlined /> }}
              placeholder="请输入账号"
              rules={[
                { required: true, message: '账号是必填项！' },
                { min: 4, message: '账号长度不能小于4位' },
              ]}
            />

            <ProFormText
              name="userName"
              fieldProps={{ size: 'large', prefix: <UserOutlined /> }}
              placeholder="请输入用户名"
              rules={[{ required: true, message: '用户名是必填项！' }]}
            />

            <ProFormText.Password
              name="userPassword"
              fieldProps={{ size: 'large', prefix: <LockOutlined /> }}
              placeholder="请输入密码"
              rules={[
                { required: true, message: '密码是必填项！' },
                { min: 8, message: '密码长度不能小于8位' },
              ]}
            />

            <ProFormText.Password
              name="checkPassword"
              fieldProps={{ size: 'large', prefix: <LockOutlined /> }}
              placeholder="请确认密码"
              rules={[
                { required: true, message: '请确认密码！' },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('userPassword') === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error('两次输入的密码不一致！'));
                  },
                }),
              ]}
            />
          </ProForm>
        </Card>
      </div>
      <Footer />
    </div>
  );
};

export default Register;
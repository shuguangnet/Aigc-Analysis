import React, { useState, useEffect } from 'react';
import { PageContainer, ProCard } from '@ant-design/pro-components';
import {
  Avatar,
  Button,
  Card,
  Descriptions,
  Form,
  Input,
  Modal,
  Space,
  Tabs,
  Tag,
  Upload,
  message,
} from 'antd';
import {
  UserOutlined,
  MailOutlined,
  PhoneOutlined,
  KeyOutlined,
  UploadOutlined,
} from '@ant-design/icons';
import { useModel } from '@umijs/max';
import type {  UploadProps } from 'antd/es/upload';
import { getUserByIdUsingGet, updateUserUsingPost } from '@/services/hebi/userController';
import { countChartsUsingGet } from '@/services/hebi/chartController'; // 新增
import { uploadFileUsingPost } from '@/services/hebi/fileController';
import dayjs from 'dayjs'; // 新增

const { TabPane } = Tabs;

const UserInfo: React.FC = () => {
  const { initialState } = useModel('@@initialState');
  const { currentUser } = initialState || {};
  const [userInfo, setUserInfo] = useState<any>(null);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const [apiCallCount, setApiCallCount] = useState<number>(0); // 新增
  const [avatarUrl, setAvatarUrl] = useState<string>();
  // 拉取用户信息
  useEffect(() => {
    const fetchUserInfo = async () => {
      if (!currentUser?.id) return;
      const res = await getUserByIdUsingGet({ id: currentUser.id });
      if (res && res.code === 0 && res.data) {
        setUserInfo(res.data);
        form.setFieldsValue({
          userName: res.data.userName,
          email: res.data.userAccount, // 假设 userAccount 是邮箱
          phone: res.data.userProfile, // 假设 userProfile 存手机号（如有 phone 字段请替换）
        });
      }
    };
    fetchUserInfo();
  }, [currentUser?.id, form]);

  // 拉取API调用次数
  useEffect(() => {
    const fetchApiCallCount = async () => {
      const res = await countChartsUsingGet();
      if (res && res.code === 0) {
        setApiCallCount(res.data || 0);
      }
    };
    fetchApiCallCount();
  }, []);

  // 处理基本信息更新
  const handleInfoUpdate = async (values: any) => {
    try {
      setLoading(true);
      const res = await updateUserUsingPost({
        id: userInfo.id,
        userName: values.userName,
        userAvatar: avatarUrl||userInfo.userAvatar,
        userProfile: values.phone, // 假设 userProfile 存手机号（如有 phone 字段请替换）
        // 其他字段如有需要可补充
      });
      setLoading(false);
      if (res && res.code === 0) {
        message.success('信息更新成功');
        // 更新本地 userInfo
        setUserInfo({ ...userInfo, userName: values.userName, userProfile: values.phone });
      } else {
        message.error(res?.message || '信息更新失败');
      }
    } catch (error) {
      setLoading(false);
      message.error('信息更新失败');
    }
  };

    const handleUploadChange = async (info: any) => {
    if (info.file.status === 'uploading') {
      return;
    }
    if (info.file.status === 'done') {
      const response = info.file.response;
      if (response.code === 0) {
        setAvatarUrl(response.data);
        message.success('头像上传成功');
        // 更新表单字段值
        form.setFieldValue('userAvatar', response.data);
      } else {
        message.error(response.message || '头像上传失败');
      }
    }
  };

  const customRequest = async ({ file, onSuccess, onError }: any) => {
    try {
      const res = await uploadFileUsingPost(file, {
        file,
        biz: 'user_avatar',
      });
      if (res.code === 0) {
        onSuccess(res);
      } else {
        onError(new Error(res.message));
      }
    } catch (error) {
      onError(error);
    }
  };

  // 处理头像上传
  const handleAvatarUpload: UploadProps['onChange'] = async (info) => {
    if (info.file.status === 'uploading') {
      setLoading(true);
      return;
    }
    if (info.file.status === 'done') {
      message.success('头像更新成功');
      setLoading(false);
    }
  };

  // 处理密码修改
  const handlePasswordChange = async (values: any) => {
    try {
      // 这里应该调用修改密码的API
      // await updatePassword(values);
      message.success('密码修改成功');
      setPasswordVisible(false);
      form.resetFields();
    } catch (error) {
      message.error('密码修改失败');
    }
  };

  return (
    <PageContainer>
      <ProCard split="vertical">
        <ProCard colSpan="30%">
          <div style={{ textAlign: 'center', padding: '24px' }}>
            <Upload
              name="avatar"
              showUploadList={false}
              // onChange={handleAvatarUpload}
              customRequest={customRequest}
              onChange={handleUploadChange}
            >
              <Space direction="vertical" size="large">
                <Avatar
                  size={120}
                  src={avatarUrl || userInfo?.userAvatar}
                  icon={<UserOutlined />}
                />
                <Button icon={<UploadOutlined />} loading={loading}>
                  更换头像
                </Button>
              </Space>
            </Upload>
            <div style={{ marginTop: '16px' }}>
              <h2>{userInfo?.userName}</h2>
              <Tag color="blue">{userInfo?.userRole || '普通用户'}</Tag>
            </div>
          </div>
        </ProCard>

        <ProCard>
          <Tabs defaultActiveKey="1">
            <TabPane tab="基本信息" key="1">
              <Form
                layout="vertical"
                form={form}
                initialValues={{
                  userName: userInfo?.userName,
                  email: userInfo?.userAccount,
                  phone: userInfo?.userProfile,
                }}
                onFinish={handleInfoUpdate}
              >
                <Form.Item
                  label="用户名"
                  name="userName"
                  rules={[{ required: true }]}
                >
                  <Input prefix={<UserOutlined />} />
                </Form.Item>
                <Form.Item
                  label="账号"
                  name="email"
                  // rules={[{ required: true, type: 'email' }]}
                >
                  <Input prefix={<MailOutlined />} disabled />
                </Form.Item>
                {/* <Form.Item label="手机" name="phone">
                  <Input prefix={<PhoneOutlined />} />
                </Form.Item> */}
                <Form.Item>
                  <Button type="primary" htmlType="submit" loading={loading}>
                    保存修改
                  </Button>
                </Form.Item>
              </Form>
            </TabPane>

            

            <TabPane tab="使用统计" key="3">
              <Card>
                <Descriptions column={2}>
                  <Descriptions.Item label="注册时间">
                    {userInfo?.createTime ? dayjs(userInfo.createTime).format('YYYY-MM-DD HH:mm:ss') : '-'}
                  </Descriptions.Item>
                  <Descriptions.Item label="最后登录">
                    {userInfo?.updateTime ? dayjs(userInfo.updateTime).format('YYYY-MM-DD HH:mm:ss') : '-'}
                  </Descriptions.Item>
                  <Descriptions.Item label="API调用次数">
                    {apiCallCount}
                  </Descriptions.Item>
                  <Descriptions.Item label="分析次数">
                    {apiCallCount*2|| 0}
                  </Descriptions.Item>
                </Descriptions>
              </Card>
            </TabPane>
          </Tabs>
        </ProCard>
      </ProCard>

      <Modal
        title="修改密码"
        open={passwordVisible}
        onCancel={() => setPasswordVisible(false)}
        footer={null}
      >
        <Form form={form} onFinish={handlePasswordChange}>
          <Form.Item
            name="oldPassword"
            rules={[{ required: true, message: '请输入原密码' }]}
          >
            <Input.Password prefix={<KeyOutlined />} placeholder="原密码" />
          </Form.Item>
          <Form.Item
            name="newPassword"
            rules={[{ required: true, message: '请输入新密码' }]}
          >
            <Input.Password prefix={<KeyOutlined />} placeholder="新密码" />
          </Form.Item>
          <Form.Item
            name="confirmPassword"
            dependencies={['newPassword']}
            rules={[
              { required: true, message: '请确认新密码' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('newPassword') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('两次输入的密码不一致'));
                },
              }),
            ]}
          >
            <Input.Password prefix={<KeyOutlined />} placeholder="确认新密码" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              确认修改
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </PageContainer>
  );
};

export default UserInfo;
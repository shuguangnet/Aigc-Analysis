import React, { useState } from 'react';
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
import type { RcFile, UploadProps } from 'antd/es/upload';

const { TabPane } = Tabs;

const UserInfo: React.FC = () => {
  const { initialState } = useModel('@@initialState');
  const { currentUser } = initialState || {};
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

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

  // 处理基本信息更新
  const handleInfoUpdate = async (values: any) => {
    try {
      // 这里应该调用更新用户信息的API
      // await updateUserInfo(values);
      message.success('信息更新成功');
    } catch (error) {
      message.error('信息更新失败');
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
              onChange={handleAvatarUpload}
            >
              <Space direction="vertical" size="large">
                <Avatar
                  size={120}
                  src={currentUser?.avatar}
                  icon={<UserOutlined />}
                />
                <Button icon={<UploadOutlined />} loading={loading}>
                  更换头像
                </Button>
              </Space>
            </Upload>
            <div style={{ marginTop: '16px' }}>
              <h2>{currentUser?.name}</h2>
              <Tag color="blue">{currentUser?.role || '普通用户'}</Tag>
            </div>
          </div>
        </ProCard>

        <ProCard>
          <Tabs defaultActiveKey="1">
            <TabPane tab="基本信息" key="1">
              <Form
                layout="vertical"
                initialValues={currentUser}
                onFinish={handleInfoUpdate}
              >
                <Form.Item
                  label="用户名"
                  name="username"
                  rules={[{ required: true }]}
                >
                  <Input prefix={<UserOutlined />} />
                </Form.Item>
                <Form.Item
                  label="邮箱"
                  name="email"
                  rules={[{ required: true, type: 'email' }]}
                >
                  <Input prefix={<MailOutlined />} />
                </Form.Item>
                <Form.Item label="手机" name="phone">
                  <Input prefix={<PhoneOutlined />} />
                </Form.Item>
                <Form.Item>
                  <Button type="primary" htmlType="submit">
                    保存修改
                  </Button>
                </Form.Item>
              </Form>
            </TabPane>

            <TabPane tab="账号安全" key="2">
              <Card>
                <Descriptions>
                  <Descriptions.Item label="账号密码">
                    已设置
                    <Button
                      type="link"
                      onClick={() => setPasswordVisible(true)}
                    >
                      修改密码
                    </Button>
                  </Descriptions.Item>
                  <Descriptions.Item label="手机验证">已绑定</Descriptions.Item>
                  <Descriptions.Item label="邮箱验证">已验证</Descriptions.Item>
                </Descriptions>
              </Card>
            </TabPane>

            <TabPane tab="使用统计" key="3">
              <Card>
                <Descriptions column={2}>
                  <Descriptions.Item label="注册时间">
                    {currentUser?.registerTime || '-'}
                  </Descriptions.Item>
                  <Descriptions.Item label="最后登录">
                    {currentUser?.lastLogin || '-'}
                  </Descriptions.Item>
                  <Descriptions.Item label="API调用次数">
                    {currentUser?.apiCalls || 0}
                  </Descriptions.Item>
                  <Descriptions.Item label="分析次数">
                    {currentUser?.analysisCounts || 0}
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
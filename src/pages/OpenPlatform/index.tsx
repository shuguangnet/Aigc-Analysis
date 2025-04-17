import { PageContainer, ProCard } from '@ant-design/pro-components';
import { Button, Card, Col, Descriptions, Input, message, Modal, Row, Space, Table, Tag } from 'antd';
import React, { useEffect, useState } from 'react';
import { CopyOutlined, KeyOutlined, ReloadOutlined } from '@ant-design/icons';

const OpenPlatform: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [visible, setVisible] = useState<boolean>(false);
  const [apiKey, setApiKey] = useState<string>('');

  // TODO:API密钥数据
  const [keyList, setKeyList] = useState([
    {
      id: 1,
      accessKey: 'ak_xxxxxxxxxxxx',
      secretKey: 'sk_xxxxxxxxxxxx',
      status: 'active',
      createTime: '2024-01-01 12:00:00',
      expiryTime: '2025-01-01 12:00:00',
      calls: 1234,
    },
  ]);

  const columns = [
    {
      title: 'Access Key',
      dataIndex: 'accessKey',
      key: 'accessKey',
    },
    {
      title: 'Secret Key',
      dataIndex: 'secretKey',
      key: 'secretKey',
      render: (text: string) => (
        <Space>
          <span>{'*'.repeat(20)}</span>
          <Button
            icon={<CopyOutlined />}
            type="link"
            onClick={() => {
              navigator.clipboard.writeText(text);
              message.success('复制成功');
            }}
          />
        </Space>
      ),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={status === 'active' ? 'green' : 'red'}>
          {status === 'active' ? '启用' : '禁用'}
        </Tag>
      ),
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
    },
    {
      title: '过期时间',
      dataIndex: 'expiryTime',
      key: 'expiryTime',
    },
    {
      title: '调用次数',
      dataIndex: 'calls',
      key: 'calls',
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: any) => (
        <Space>
          <Button type="link" danger onClick={() => handleDisableKey(record.id)}>
            {record.status === 'active' ? '禁用' : '启用'}
          </Button>
          <Button type="link" danger onClick={() => handleDeleteKey(record.id)}>
            删除
          </Button>
        </Space>
      ),
    },
  ];

  const handleCreateKey = () => {
    setLoading(true);
    // 这里应该调用后端API创建密钥
    setTimeout(() => {
      const newKey = {
        id: keyList.length + 1,
        accessKey: `ak_${Math.random().toString(36).substring(2)}`,
        secretKey: `sk_${Math.random().toString(36).substring(2)}`,
        status: 'active',
        createTime: new Date().toLocaleString(),
        expiryTime: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toLocaleString(),
        calls: 0,
      };
      setKeyList([...keyList, newKey]);
      setLoading(false);
      message.success('创建成功');
    }, 1000);
  };

  const handleDisableKey = (id: number) => {
    setKeyList(
      keyList.map((key) =>
        key.id === id ? { ...key, status: key.status === 'active' ? 'inactive' : 'active' } : key,
      ),
    );
  };

  const handleDeleteKey = (id: number) => {
    Modal.confirm({
      title: '确认删除',
      content: '删除后无法恢复，是否继续？',
      onOk: () => {
        setKeyList(keyList.filter((key) => key.id !== id));
        message.success('删除成功');
      },
    });
  };

  return (
    <PageContainer>
      <Row gutter={16}>
        <Col span={24}>
          <ProCard>
            <Descriptions title="接口信息" column={2}>
              <Descriptions.Item label="接口状态">
                <Tag color="green">正常</Tag>
              </Descriptions.Item>
              <Descriptions.Item label="计费方式">按调用次数</Descriptions.Item>
              <Descriptions.Item label="单价">0.01元/次</Descriptions.Item>
              <Descriptions.Item label="总调用次数">1234次</Descriptions.Item>
            </Descriptions>
          </ProCard>
        </Col>
      </Row>

      <Card
        style={{ marginTop: 16 }}
        title="API密钥管理"
        extra={
          <Button type="primary" icon={<KeyOutlined />} onClick={handleCreateKey} loading={loading}>
            创建密钥
          </Button>
        }
      >
        <Table columns={columns} dataSource={keyList} rowKey="id" />
      </Card>

      <Card style={{ marginTop: 16 }} title="调用示例">
        <Descriptions title="Python示例" column={1}>
          <Descriptions.Item>
            <pre>
              {`import requests

url = "https://api.yourdomain.com/v1/generate"
headers = {
    "Content-Type": "application/json",
    "X-API-KEY": "your_api_key"
}
data = {
    "prompt": "你的提示词",
    "model": "gpt-3.5-turbo"
}

response = requests.post(url, json=data, headers=headers)
print(response.json())`}
            </pre>
          </Descriptions.Item>
        </Descriptions>
      </Card>
    </PageContainer>
  );
};

export default OpenPlatform;
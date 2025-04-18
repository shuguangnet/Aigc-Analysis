import { PageContainer, ProCard } from '@ant-design/pro-components';
import { Button, Card, Col, Descriptions, Input, message, Modal, Row, Space, Table, Tag } from 'antd';
import React, { useState } from 'react';
import { CopyOutlined } from '@ant-design/icons';

const OpenPlatform: React.FC = () => {
  const [keyList] = useState([
    {
      id: 1,
      accessKey: 'sk-1PBIyxIdJ42yyC11XRNqbEXYDt2eZRNVNbd8XxmKjnPXGh5S',
      description: 'GPT-3.5-Turbo API，支持中英文对话，适合日常对话场景',
      status: 'active',
      qps: '3次/秒',
      dailyLimit: '1000次/天',
    },
    {
      id: 2,
      accessKey: 'sk-2ABCyxIdJ42yyC11XRNqbEXYDt2eZRNVNbd8XxmKjnPXABCD',
      description: 'Claude-2 API，支持多语言对话，适合学术研究场景',
      status: 'active',
      qps: '2次/秒',
      dailyLimit: '500次/天',
    },
    {
      id: 3,
      accessKey: 'sk-3DEFyxIdJ42yyC11XRNqbEXYDt2eZRNVNbd8XxmKjnPXDEF',
      description: 'Stable Diffusion API，支持文生图、图生图等功能',
      status: 'active',
      qps: '1次/秒',
      dailyLimit: '100次/天',
    },
  ]);

  const columns = [
    {
      title: 'API Key',
      dataIndex: 'accessKey',
      key: 'accessKey',
      render: (text: string) => (
        <Space>
          <span>{text}</span>
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
      title: '描述',
      dataIndex: 'description',
      key: 'description',
      width: '40%',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={status === 'active' ? 'green' : 'red'}>
          {status === 'active' ? '正常' : '维护中'}
        </Tag>
      ),
    },
    {
      title: 'QPS限制',
      dataIndex: 'qps',
      key: 'qps',
    },
    {
      title: '每日限额',
      dataIndex: 'dailyLimit',
      key: 'dailyLimit',
    },
  ];

  return (
    <PageContainer>
      <Row gutter={16}>
        <Col span={24}>
          <ProCard>
            <Descriptions title="公益API说明" column={1}>
              <Descriptions.Item label="项目介绍">
                本项目提供免费的AI API服务，支持GPT、Claude、Stable Diffusion等多个模型，仅用于学习研究使用。
              </Descriptions.Item>
              <Descriptions.Item label="使用须知">
                1. 请勿用于商业用途
                2. 请勿滥用API资源
                3. 遵守相关法律法规
              </Descriptions.Item>
              <Descriptions.Item label="联系方式">
                遇到问题请通过以下方式联系：
                Email: support@example.com
                GitHub: https://github.com/your-repo
              </Descriptions.Item>
            </Descriptions>
          </ProCard>
        </Col>
      </Row>

      <Card style={{ marginTop: 16 }} title="可用API列表">
        <Table 
          columns={columns} 
          dataSource={keyList} 
          rowKey="id"
          pagination={false}
        />
      </Card>

      <Card style={{ marginTop: 16 }} title="调用示例">
        <Descriptions title="Python示例" column={1}>
          <Descriptions.Item>
            <pre>
              {`import requests

# GPT-3.5对话示例
url = "http://api.example.com/v1/chat/completions"
headers = {
    "Content-Type": "application/json",
    "Authorization": "Bearer ${keyList[0].accessKey}"
}
data = {
    "model": "gpt-3.5-turbo",
    "messages": [
        {"role": "user", "content": "你好，请介绍一下你自己"}
    ]
}

response = requests.post(url, json=data, headers=headers)
print(response.json())`}
            </pre>
          </Descriptions.Item>
        </Descriptions>

        <Descriptions title="Node.js示例" column={1}>
          <Descriptions.Item>
            <pre>
              {`const axios = require('axios');

async function generateImage() {
  const response = await axios.post('http://api.example.com/v1/images/generations', {
    prompt: '一只可爱的猫咪',
    n: 1,
    size: '512x512'
  }, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ${keyList[2].accessKey}'
    }
  });
  
  console.log(response.data);
}`}
            </pre>
          </Descriptions.Item>
        </Descriptions>
      </Card>
    </PageContainer>
  );
};

export default OpenPlatform;
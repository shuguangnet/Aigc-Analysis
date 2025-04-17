import React, { useState } from 'react';
import { Card, Form, Input, Button, Upload, Select, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import type { UploadFile } from 'antd/es/upload/interface';
import { history } from '@umijs/max';

const { TextArea } = Input;

const ForumPublish: React.FC = () => {
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (values: any) => {
    setSubmitting(true);
    try {
      // 这里处理表单提交
      console.log('提交数据:', values);
      message.success('发布成功');
      history.push('/forum/list');
    } catch (error) {
      message.error('发布失败');
    }
    setSubmitting(false);
  };

  return (
    <Card title="发布帖子">
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
      >
        <Form.Item
          name="title"
          label="标题"
          rules={[{ required: true, message: '请输入标题' }]}
        >
          <Input placeholder="请输入帖子标题" />
        </Form.Item>

        <Form.Item
          name="category"
          label="分类"
          rules={[{ required: true, message: '请选择分类' }]}
        >
          <Select>
            <Select.Option value="tech">技术讨论</Select.Option>
            <Select.Option value="share">经验分享</Select.Option>
            <Select.Option value="question">问题求助</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item
          name="content"
          label="内容"
          rules={[{ required: true, message: '请输入内容' }]}
        >
          <TextArea rows={8} placeholder="请输入帖子内容..." />
        </Form.Item>

        <Form.Item label="封面图">
          <Upload
            listType="picture-card"
            fileList={fileList}
            onChange={({ fileList }) => setFileList(fileList)}
            beforeUpload={() => false}
          >
            {fileList.length < 1 && <PlusOutlined />}
          </Upload>
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={submitting}>
            发布
          </Button>
          <Button style={{ marginLeft: 8 }} onClick={() => history.back()}>
            取消
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default ForumPublish;
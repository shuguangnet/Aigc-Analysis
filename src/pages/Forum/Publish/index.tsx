import React, { useState } from 'react';
import { Card, Form, Input, Button, Upload, Select, message, Space, Alert } from 'antd';
import { PlusOutlined, InfoCircleOutlined } from '@ant-design/icons';
import type { UploadFile } from 'antd/es/upload/interface';
import { history } from '@umijs/max';
import styles from './index.less';

const { TextArea } = Input;

const ForumPublish: React.FC = () => {
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [submitting, setSubmitting] = useState(false);

  const categories = [
    { value: 'tech', label: '技术讨论', description: '分享技术经验和最佳实践' },
    { value: 'share', label: '经验分享', description: '分享数据分析案例和心得' },
    { value: 'question', label: '问题求助', description: '寻求技术支持和解决方案' },
  ];

  const handleSubmit = async (values: any) => {
    setSubmitting(true);
    try {
      // 处理表单提交
      console.log('提交数据:', values);
      message.success('发布成功');
      history.push('/forum/list');
    } catch (error) {
      message.error('发布失败');
    }
    setSubmitting(false);
  };

  return (
    <div className={styles.publishContainer}>
      <Card title="发布帖子" className={styles.publishCard}>
        <Alert
          message="发帖提示"
          description="请确保发布的内容与 AIGC 数据分析相关，并遵守社区规范。"
          type="info"
          showIcon
          style={{ marginBottom: 24 }}
        />
        
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          requiredMark="optional"
        >
          <Form.Item
            name="title"
            label={<span className={styles.formLabel}>标题</span>}
            rules={[
              { required: true, message: '请输入标题' },
              { max: 100, message: '标题最多100个字符' }
            ]}
          >
            <Input 
              placeholder="请输入一个简洁明了的标题" 
              showCount 
              maxLength={100}
            />
          </Form.Item>

          <Form.Item
            name="category"
            label={<span className={styles.formLabel}>分类</span>}
            rules={[{ required: true, message: '请选择分类' }]}
            tooltip={{
              title: '选择合适的分类有助于其他用户更好地找到您的帖子',
              icon: <InfoCircleOutlined />
            }}
          >
            <Select placeholder="请选择帖子分类">
              {categories.map(cat => (
                <Select.Option key={cat.value} value={cat.value}>
                  <Space>
                    {cat.label}
                    <span style={{ color: '#999', fontSize: '12px' }}>
                      ({cat.description})
                    </span>
                  </Space>
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="content"
            label={<span className={styles.formLabel}>内容</span>}
            rules={[
              { required: true, message: '请输入内容' },
              { min: 20, message: '内容至少20个字符' }
            ]}
          >
            <TextArea 
              rows={12} 
              placeholder="请详细描述您要分享的内容..." 
              showCount
              maxLength={5000}
            />
          </Form.Item>

          <Form.Item 
            label={<span className={styles.formLabel}>封面图</span>}
            extra={<div className={styles.uploadHint}>支持 jpg、png 格式，建议尺寸 800x450px</div>}
          >
            <Upload
              listType="picture-card"
              fileList={fileList}
              onChange={({ fileList }) => setFileList(fileList)}
              beforeUpload={(file) => {
                const isImage = file.type.startsWith('image/');
                if (!isImage) {
                  message.error('只能上传图片文件！');
                }
                return false;
              }}
              maxCount={1}
            >
              {fileList.length < 1 && (
                <div>
                  <PlusOutlined />
                  <div style={{ marginTop: 8 }}>上传图片</div>
                </div>
              )}
            </Upload>
          </Form.Item>

          <div className={styles.buttonGroup}>
            <Button onClick={() => history.back()}>
              取消
            </Button>
            <Button type="primary" htmlType="submit" loading={submitting}>
              发布帖子
            </Button>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default ForumPublish;
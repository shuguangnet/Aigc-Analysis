import React, { useState } from 'react';
import { Card, Form, Input, Button, Select, message, Alert } from 'antd';
import { history } from '@umijs/max';
import styles from './index.less';
import MDEditor from '@uiw/react-md-editor'; // 直接引入，不用 next/dynamic
import '@uiw/react-md-editor/markdown-editor.css';
import '@uiw/react-markdown-preview/markdown.css';
import { addPostUsingPost } from '@/services/hebi/postController';

const { TextArea } = Input;

const ForumPublish: React.FC = () => {
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);
  const [mdContent, setMdContent] = useState<string>(''); // 新增

  const handleSubmit = async (values: any) => {
    setSubmitting(true);
    try {
      const postAddRequest = {
        title: values.title,
        content: mdContent, // 使用 Markdown 内容
        tags: values.tags || [],
      };
      const res = await addPostUsingPost(postAddRequest);
      if (res && res.code === 0) {
        message.success('发布成功');
        history.push('/forum/list');
      } else {
        message.error(res?.message || '发布失败');
      }
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
            name="tags"
            label={<span className={styles.formLabel}>标签</span>}
            rules={[
              { required: false, type: 'array', message: '请输入标签' }
            ]}
          >
            <Select
              mode="tags"
              style={{ width: '100%' }}
              placeholder="请输入标签，回车分隔"
              tokenSeparators={[',', '，']}
            />
          </Form.Item>
          {/* Markdown 编辑器替换内容输入 */}
          <Form.Item
            label={<span className={styles.formLabel}>内容</span>}
            required
          >
            <div data-color-mode="light">
              <MDEditor
                value={mdContent}
                onChange={setMdContent}
                height={400}
                preview="edit"
                placeholder="请使用 Markdown 语法详细描述您要分享的内容..."
              />
            </div>
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
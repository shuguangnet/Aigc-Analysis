import React, { useEffect, useState } from 'react';
import { PageContainer } from '@ant-design/pro-components';
import { Table, Button, Modal, Form, Input, Tag, Space, Popconfirm, message, Avatar } from 'antd';
import { listAllPostsUsingGet, updatePostUsingPost, deletePostUsingPost, addPostUsingPost } from '@/services/hebi/postController';
import dayjs from 'dayjs'; // 新增

const ForumAdmin: React.FC = () => {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingPost, setEditingPost] = useState<any>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [search, setSearch] = useState<string>(''); 

  // 获取帖子列表
  const fetchPosts = async () => {
    setLoading(true);
    const res = await listAllPostsUsingGet();
    if (res && res.code === 0 && Array.isArray(res.data)) {
      setPosts(res.data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  // 编辑
  const handleEdit = (record: any) => {
    setEditingPost(record);
    setModalVisible(true);
    form.setFieldsValue({
      ...record,
      tags: record.tagList?.join(','),
    });
  };

  // 新增
  const handleAdd = () => {
    setEditingPost(null);
    setModalVisible(true);
    form.resetFields();
  };

  // 删除
  const handleDelete = async (id: number) => {
    const res = await deletePostUsingPost({ id });
    if (res && res.code === 0) {
      message.success('删除成功');
      fetchPosts();
    } else {
      message.error(res?.message || '删除失败');
    }
  };

  // 提交表单
  const handleOk = async () => {
    const values = await form.validateFields();
    const tags = values.tags ? values.tags.split(',').map((t: string) => t.trim()) : [];
    if (editingPost) {
      // 编辑
      const res = await updatePostUsingPost({ ...editingPost, ...values, tags });
      if (res && res.code === 0) {
        message.success('更新成功');
        setModalVisible(false);
        fetchPosts();
      } else {
        message.error(res?.message || '更新失败');
      }
    } else {
      // 新增
      const res = await addPostUsingPost({ ...values, tags });
      if (res && res.code === 0) {
        message.success('新增成功');
        setModalVisible(false);
        fetchPosts();
      } else {
        message.error(res?.message || '新增失败');
      }
    }
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      width: 60,
    },
    {
      title: '标题',
      dataIndex: 'title',
      width: 200,
    },
    {
      title: '标签',
      dataIndex: 'tagList',
      width: 200,
      render: (tags: string[]) => (
        <>
          {tags?.map(tag => (
            <Tag color="blue" key={tag}>{tag}</Tag>
          ))}
        </>
      ),
    },
    {
      title: '作者',
      dataIndex: ['user', 'userName'],
      width: 100,
      render: (_: any, record: any) => (
        <Space>
          {record.user?.userName}
        </Space>
      ),
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      width: 180,
      render: (time: string) => time ? dayjs(time).format('YYYY-MM-DD HH:mm:ss') : '-',
    },
    {
      title: '操作',
      key: 'action',
      width: 160,
      render: (_: any, record: any) => (
        <Space>
          <Button type="link" onClick={() => handleEdit(record)}>编辑</Button>
          <Popconfirm title="确定删除吗？" onConfirm={() => handleDelete(record.id)}>
            <Button type="link" danger>删除</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  // 前端搜索过滤
  const filteredPosts = posts.filter(post => {
    const keyword = search.trim().toLowerCase();
    if (!keyword) return true;
    const titleMatch = post.title?.toLowerCase().includes(keyword);
    const tagsMatch = (post.tagList || []).some((tag: string) =>
      tag.toLowerCase().includes(keyword)
    );
    return titleMatch || tagsMatch;
  });

  return (
    <PageContainer title="论坛管理">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <Button type="primary" onClick={handleAdd}>
          新增帖子
        </Button>
        <Input.Search
          allowClear
          placeholder="搜索标题或标签"
          style={{ width: 300 }}
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>
      <Table
        rowKey="id"
        loading={loading}
        columns={columns}
        dataSource={filteredPosts}
        bordered
        pagination={{ pageSize: 8 }}
      />
      <Modal
        title={editingPost ? '编辑帖子' : '新增帖子'}
        open={modalVisible}
        onOk={handleOk}
        onCancel={() => setModalVisible(false)}
        destroyOnClose
      >
        <Form form={form} layout="vertical">
          <Form.Item name="title" label="标题" rules={[{ required: true, message: '请输入标题' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="content" label="内容" rules={[{ required: true, message: '请输入内容' }]}>
            <Input.TextArea rows={4} />
          </Form.Item>
          <Form.Item name="tags" label="标签（逗号分隔）">
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </PageContainer>
  );
};

export default ForumAdmin;

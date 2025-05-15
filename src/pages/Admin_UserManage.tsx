import React, { useEffect, useState } from 'react';
import { PageContainer } from '@ant-design/pro-components';
import { Table, Button, Modal, Form, Input, Space, Popconfirm, message, Avatar, Select } from 'antd';
import { listUserByPageUsingPost, updateUserUsingPost, deleteUserUsingPost, addUserUsingPost } from '@/services/hebi/userController';

const { Option } = Select;

const UserManage: React.FC = () => {
  const [allUsers, setAllUsers] = useState<any[]>([]); 
  const [users, setUsers] = useState<any[]>([]); 
  const [loading, setLoading] = useState(false);
  const [editingUser, setEditingUser] = useState<any>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 });
  const [search, setSearch] = useState<string>('');
  const [isAdd, setIsAdd] = useState(false); // 新增/编辑标志

  // 拉取所有用户
  const fetchAllUsers = async () => {
    setLoading(true);
    const res = await listUserByPageUsingPost({
      userQueryRequest: {
        current: 1,
        pageSize: 10000, // 假设不会超过1万用户
      },
    });
    if (res && res.code === 0 && res.data) {
      setAllUsers(res.data.records || []);
    }
    setLoading(false);
  };

  // 前端过滤和分页
  const filterAndPaginate = (all: any[], keyword: string, page: number, pageSize: number) => {
    let filtered = all;
    if (keyword.trim()) {
      filtered = all.filter(user =>
        (user.userName || '').toLowerCase().includes(keyword.trim().toLowerCase())
      );
    }
    const total = filtered.length;
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    return {
      users: filtered.slice(start, end),
      total,
    };
  };

  // 初始化和数据变动时处理
  useEffect(() => {
    fetchAllUsers();
  }, []);

  useEffect(() => {
    const { users, total } = filterAndPaginate(allUsers, search, pagination.current, pagination.pageSize);
    setUsers(users);
    setPagination(prev => ({ ...prev, total }));
  }, [allUsers, search, pagination.current, pagination.pageSize]);

  // 搜索时重置到第一页
  const handleSearch = (value: string) => {
    setSearch(value);
    setPagination(prev => ({ ...prev, current: 1 }));
  };

  // 新增
  const handleAdd = () => {
    setIsAdd(true);
    setEditingUser(null);
    setModalVisible(true);
    form.resetFields();
  };

  // 编辑
  const handleEdit = (record: any) => {
    setIsAdd(false);
    setEditingUser(record);
    setModalVisible(true);
    form.setFieldsValue({
      ...record,
    });
  };

  // 提交表单
  const handleOk = async () => {
    const values = await form.validateFields();
    if (isAdd) {
      const res = await addUserUsingPost({ ...values });
      if (res && res.code === 0) {
        message.success('新增成功');
        setModalVisible(false);
        fetchAllUsers();
      } else {
        message.error(res?.message || '新增失败');
      }
    } else {
      const res = await updateUserUsingPost({ ...editingUser, ...values });
      if (res && res.code === 0) {
        message.success('更新成功');
        setModalVisible(false);
        fetchAllUsers();
      } else {
        message.error(res?.message || '更新失败');
      }
    }
  };

  // 删除
  const handleDelete = async (id: number) => {
    const res = await deleteUserUsingPost({ id });
    if (res && res.code === 0) {
      message.success('删除成功');
      fetchAllUsers();
    } else {
      message.error(res?.message || '删除失败');
    }
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      width: 60,
      align: 'center',
    },
    {
      title: '头像',
      dataIndex: 'userAvatar',
      width: 80,
      align: 'center',
      render: (avatar: string) => <Avatar src={avatar} />,
    },
    {
      title: '用户名',
      dataIndex: 'userName',
      width: 160,
      align: 'center',
    },
    {
      title: '账号',
      dataIndex: 'userAccount',
      width: 160,
      align: 'center',
    },
    {
      title: '角色',
      dataIndex: 'userRole',
      width: 100,
      align: 'center',
      render: (role: string) => {
        if (role === 'admin') return <span style={{ color: '#fa541c' }}>管理员</span>;
        if (role === 'ban') return <span style={{ color: '#bfbfbf' }}>禁用</span>;
        return <span>普通用户</span>;
      },
    },
    {
      title: '简介',
      dataIndex: 'userProfile',
      width: 200,
      align: 'center',
      ellipsis: true,
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      width: 180,
      align: 'center',
    },
    {
      title: '操作',
      key: 'action',
      width: 160,
      align: 'center',
      render: (_: any, record: any) => (
        <Space>
          <Button type="link" onClick={() => handleEdit(record)}>编辑</Button>
          <Popconfirm title="确定删除该用户吗？" onConfirm={() => handleDelete(record.id)}>
            <Button type="link" danger>删除</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <PageContainer title="用户管理">
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
        <Button type="primary" onClick={handleAdd}>新增用户</Button>
        <Input.Search
          allowClear
          placeholder="搜索用户名"
          style={{ width: 300 }}
          value={search}
          onChange={e => handleSearch(e.target.value)}
          onSearch={handleSearch}
        />
      </div>
      <Table
        rowKey="id"
        loading={loading}
        columns={columns}
        dataSource={users}
        bordered
        pagination={{
          current: pagination.current,
          pageSize: pagination.pageSize,
          total: pagination.total,
          showSizeChanger: true,
          onChange: (page, pageSize) => setPagination(prev => ({ ...prev, current: page, pageSize })),
        }}
        scroll={{ x: 1000 }}
      />
      <Modal
        title={isAdd ? "新增用户" : "编辑用户"}
        open={modalVisible}
        onOk={handleOk}
        onCancel={() => setModalVisible(false)}
        destroyOnClose
        width={480}
        bodyStyle={{ padding: 24 }}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="userName" label="用户名" rules={[{ required: true, message: '请输入用户名' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="userAccount" label="账号" rules={isAdd ? [{ required: true, message: '请输入账号' }] : []}>
            <Input disabled={!isAdd} />
          </Form.Item>
          <Form.Item name="userAvatar" label="头像链接">
            <Input />
          </Form.Item>
          <Form.Item name="userProfile" label="简介">
            <Input.TextArea rows={3} />
          </Form.Item>
          <Form.Item name="userRole" label="角色" rules={[{ required: true, message: '请选择角色' }]}>
            <Select>
              <Option value="user">普通用户</Option>
              <Option value="admin">管理员</Option>
              <Option value="ban">禁用</Option>
            </Select>
          </Form.Item>
          {isAdd && (
            <Form.Item name="userPassword" label="密码" rules={[{ required: true, message: '请输入密码' }]}>
              <Input.Password />
            </Form.Item>
          )}
        </Form>
      </Modal>
    </PageContainer>
  );
};

export default UserManage;

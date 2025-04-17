import React, { useState } from 'react';
import { Card, List, Tag, Space, Input, Button, Select } from 'antd';
import { history } from '@umijs/max';
import { SearchOutlined, PlusOutlined } from '@ant-design/icons';

const { Search } = Input;

const ForumList: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState('all');

  const categories = [
    { value: 'all', label: '全部' },
    { value: 'tech', label: '技术讨论' },
    { value: 'share', label: '经验分享' },
    { value: 'question', label: '问题求助' },
  ];

  const handleSearch = (value: string) => {
    console.log('搜索:', value);
  };

  return (
    <Card>
      <div style={{ marginBottom: 16 }}>
        <Space size="large">
          <Search
            placeholder="搜索帖子"
            onSearch={handleSearch}
            style={{ width: 300 }}
          />
          <Select
            value={filter}
            onChange={setFilter}
            options={categories}
            style={{ width: 120 }}
          />
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => history.push('/forum/publish')}
          >
            发布帖子
          </Button>
        </Space>
      </div>

      <List
        itemLayout="vertical"
        size="large"
        pagination={{
          pageSize: 10,
        }}
        dataSource={[]} // 这里需要接入实际数据
        renderItem={(item: any) => (
          <List.Item
            key={item.id}
            actions={[
              <Space>
                <span>浏览 {item.views}</span>
                <span>评论 {item.comments}</span>
                <span>点赞 {item.likes}</span>
              </Space>,
            ]}
            extra={
              item.cover && (
                <img
                  width={272}
                  alt="cover"
                  src={item.cover}
                />
              )
            }
          >
            <List.Item.Meta
              title={
                <Space>
                  <a onClick={() => history.push(`/forum/detail/${item.id}`)}>{item.title}</a>
                  <Tag color="blue">{item.category}</Tag>
                </Space>
              }
              description={
                <Space>
                  <span>{item.author}</span>
                  <span>{item.createTime}</span>
                </Space>
              }
            />
            {item.description}
          </List.Item>
        )}
      />
    </Card>
  );
};

export default ForumList;
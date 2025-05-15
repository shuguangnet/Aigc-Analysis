import React, { useState, useEffect } from 'react';
import { Card, List, Tag, Space, Input, Button, Select, Badge, Avatar } from 'antd';
import { history } from '@umijs/max';
import {
  PlusOutlined,
  EyeOutlined,
  MessageOutlined,
  LikeOutlined,
} from '@ant-design/icons';
import styles from './index.less';
import { listAllPostsUsingGet } from '@/services/hebi/postController';
import dayjs from 'dayjs';

const { Search } = Input;

const ForumList: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState('all');
  const [postList, setPostList] = useState<any[]>([]);

  // 拉取帖子数据
  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      try {
        const res = await listAllPostsUsingGet();
        if (res && res.code === 0 && Array.isArray(res.data)) {
          setPostList(res.data);
        } else {
          setPostList([]);
        }
      } catch (e) {
        setPostList([]);
      }
      setLoading(false);
    };
    fetchPosts();
  }, []);

  const categories = [
    { value: 'all', label: '全部' },
    { value: 'tech', label: '技术讨论' },
    { value: 'share', label: '经验分享' },
    { value: 'question', label: '问题求助' },
  ];

  const handleSearch = (value: string) => {
    // 可根据 value 进行前端过滤或请求接口
    console.log('搜索:', value);
  };

  // 分类过滤
  const filteredPosts = filter === 'all'
    ? postList
    : postList.filter(item => item.tagList && item.tagList.includes(filter));

  return (
    <div className={styles.forumContainer}>
      <Card className={styles.searchBar} bordered={false}>
        <Space size="large" wrap>
          <Search
            placeholder="搜索帖子标题或内容"
            onSearch={handleSearch}
            style={{ width: 300 }}
            allowClear
          />
          <Select
            value={filter}
            onChange={setFilter}
            options={categories}
            style={{ width: 120 }}
            placeholder="选择分类"
          />
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => history.push('/forum/publish')}
            size="large"
          >
            发布帖子
          </Button>
        </Space>
      </Card>

      <List
        loading={loading}
        itemLayout="vertical"
        size="large"
        pagination={{
          pageSize: 10,
          showQuickJumper: true,
          showSizeChanger: true,
          showTotal: (total) => `共 ${total} 条帖子`,
        }}
        dataSource={filteredPosts}
        renderItem={(item) => (
          <List.Item
            key={item.id}
            className={styles.postItem}
            actions={[
              <Space key={"actions"} className={styles.postStats}>
                {/* <span key="views" className={styles.statItem}>
                  <EyeOutlined /> {item.viewNum || 0}
                </span> */}
                <span key="comments" className={styles.statItem}>
                  <MessageOutlined /> {item.commentNum || 0}
                </span>
                <span key="likes" className={styles.statItem}>
                  <LikeOutlined /> {item.favourNum || 0}
                </span>
              </Space>,
            ]}
            extra={
              item.cover && (
                <img
                  className={styles.coverImage}
                  width={272}
                  height={153}
                  alt="cover"
                  src={item.cover}
                />
              )
            }
          >
            <List.Item.Meta
              avatar={
                item.user?.userAvatar ? (
                  <Avatar src={item.user.userAvatar} />
                ) : (
                  <Avatar>{item.user?.userName?.[0] || '匿'}</Avatar>
                )
              }
              title={
                <Space size="middle" align="center">
                  <a 
                    className={styles.postTitle}
                    onClick={() => history.push(`/forum/detail/${item.id}`)}
                  >
                    {item.title}
                  </a>
                  {/* 展示所有标签 */}
                  {item.tagList && item.tagList.map((tag: string) => (
                    <Tag className={styles.categoryTag} color="blue" key={tag}>
                      {tag}
                    </Tag>
                  ))}
                  {item.isTop && (
                    <Badge color="red" text="置顶" />
                  )}
                </Space>
              }
              description={
                <Space className={styles.postMeta} size="middle">
                  <span>{item.user?.userName || '匿名用户'}</span>
                  <span>
                    发布于 {dayjs(item.createTime).format('YYYY-MM-DD HH:mm:ss')}
                  </span>
                </Space>
              }
            />
            <div className={styles.postContent} style={{
              display: '-webkit-box',
              WebkitBoxOrient: 'vertical',
              WebkitLineClamp: 5,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}>
              {item.content}
            </div>
          </List.Item>
        )}
      />
    </div>
  );
};

export default ForumList;
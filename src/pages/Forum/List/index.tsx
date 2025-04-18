import React, { useState } from 'react';
import { Card, List, Tag, Space, Input, Button, Select, Badge } from 'antd';
import { history } from '@umijs/max';
import {
  SearchOutlined,
  PlusOutlined,
  EyeOutlined,
  MessageOutlined,
  LikeOutlined,
} from '@ant-design/icons';
import styles from './index.less';

const { Search } = Input;

const ForumList: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState('all');

  const mockPosts = [
    {
      id: 1,
      title: '使用 GPT-4 进行高级数据分析的实践经验',
      category: '技术讨论',
      author: '数据专家',
      createTime: '2024-01-15 14:30',
      description: '分享在大规模数据集上使用 GPT-4 进行智能分析的经验，包括提示词工程、数据预处理技巧，以及如何提高分析准确率...',
      views: 2150,
      comments: 156,
      likes: 342,
      isTop: true,
      cover: 'https://picsum.photos/272/153',
    },
    {
      id: 2,
      title: 'AI 辅助数据可视化最佳实践',
      category: '经验分享',
      author: '可视化工程师',
      createTime: '2024-01-14 16:20',
      description: '探讨如何利用 AI 技术自动生成数据可视化方案，包括图表类型选择、配色方案优化、以及交互设计的智能推荐...',
      views: 1856,
      comments: 89,
      likes: 267,
      isTop: false,
      cover: 'https://picsum.photos/272/153?random=2',
    },
    {
      id: 3,
      title: '智能预测模型准确率问题求助',
      category: '问题求助',
      author: '数据新手',
      createTime: '2024-01-13 09:45',
      description: '在使用系统进行销售预测时发现准确率不够理想，数据预处理已经做了基础清洗，请问还有哪些方面需要优化？...',
      views: 632,
      comments: 42,
      likes: 28,
      isTop: false,
      cover: null,
    },
    {
      id: 4,
      title: 'AIGC 在金融数据分析中的应用实践',
      category: '技术讨论',
      author: '金融分析师',
      createTime: '2024-01-12 11:30',
      description: '分享我们团队使用 AIGC 技术进行金融市场分析的经验，包括风险评估、趋势预测和投资建议生成的完整流程...',
      views: 1967,
      comments: 156,
      likes: 420,
      isTop: true,
      cover: 'https://picsum.photos/272/153?random=4',
    },
    {
      id: 5,
      title: '大规模数据集的智能分析方法论',
      category: '经验分享',
      author: '资深数据科学家',
      createTime: '2024-01-11 15:15',
      description: '详细介绍如何处理和分析大规模数据集，包括数据清洗策略、特征工程技巧、模型选择以及结果验证方法...',
      views: 2543,
      comments: 189,
      likes: 534,
      isTop: false,
      cover: 'https://picsum.photos/272/153?random=5',
    },
  ];

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
        dataSource={mockPosts} // 使用模拟数据
        renderItem={(item) => (
          <List.Item
            key={item.id}
            className={styles.postItem}
            actions={[
              <Space className={styles.postStats}>
                <span className={styles.statItem}>
                  <EyeOutlined /> {item.views}
                </span>
                <span className={styles.statItem}>
                  <MessageOutlined /> {item.comments}
                </span>
                <span className={styles.statItem}>
                  <LikeOutlined /> {item.likes}
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
              title={
                <Space size="middle" align="center">
                  <a 
                    className={styles.postTitle}
                    onClick={() => history.push(`/forum/detail/${item.id}`)}
                  >
                    {item.title}
                  </a>
                  <Tag className={styles.categoryTag} color="blue">
                    {item.category}
                  </Tag>
                  {item.isTop && (
                    <Badge color="red" text="置顶" />
                  )}
                </Space>
              }
              description={
                <Space className={styles.postMeta} size="middle">
                  <span>{item.author}</span>
                  <span>发布于 {item.createTime}</span>
                </Space>
              }
            />
            <div className={styles.postContent}>
              {item.description}
            </div>
          </List.Item>
        )}
      />
    </div>
  );
};

export default ForumList;
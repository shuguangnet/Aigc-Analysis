import React, { useState } from 'react';
import { useParams } from '@umijs/max';
import {
  Card,
  Avatar,
  Typography,
  Space,
  Divider,
  Button,
  Input,
  message,
  Tag,
  List,
} from 'antd';
import {
  LikeOutlined,
  LikeFilled,
  StarOutlined,
  StarFilled,
  ShareAltOutlined,
} from '@ant-design/icons';

const { Title, Paragraph } = Typography;
const { TextArea } = Input;

// Mock comment data
const mockComments = [
  {
    id: 1,
    author: '张三',
    avatar: 'https://joeschmoe.io/api/v1/random',
    content: '这个帖子很有帮助，感谢分享！',
    createTime: '2024-03-20 10:00',
    likes: 5,
  },
  {
    id: 2,
    author: '李四',
    avatar: 'https://joeschmoe.io/api/v1/random',
    content: '我也有一些补充，大家可以参考一下...',
    createTime: '2024-03-20 11:30',
    likes: 3,
  },
  {
    id: 3,
    author: '王五',
    avatar: 'https://joeschmoe.io/api/v1/random',
    content: '学到了很多新知识，期待更多分享！',
    createTime: '2024-03-20 14:15',
    likes: 2,
  },
];

const ForumDetail: React.FC = () => {
  const { id } = useParams();
  const [liked, setLiked] = useState(false);
  const [collected, setCollected] = useState(false);
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState(mockComments);

  const handleSubmitComment = () => {
    if (!comment.trim()) {
      message.warning('请输入评论内容');
      return;
    }
    // 提交评论
    const newComment = {
      id: comments.length + 1,
      author: '当前用户',
      avatar: 'https://joeschmoe.io/api/v1/random',
      content: comment,
      createTime: new Date().toLocaleString(),
      likes: 0,
    };
    setComments([newComment, ...comments]);
    message.success('评论成功');
    setComment('');
  };

  return (
    <Card>
      <article>
        <header style={{ marginBottom: 24 }}>
          <Title level={2}>帖子标题</Title>
          <Space split={<Divider type="vertical" />}>
            <Space>
              <Avatar src="https://joeschmoe.io/api/v1/random" />
              <span>作者名称</span>
            </Space>
            <span>发布时间</span>
            <Tag color="blue">分类</Tag>
            <span>阅读 1000</span>
          </Space>
        </header>

        <Paragraph>
          帖子内容
        </Paragraph>

        <div style={{ marginTop: 24 }}>
          <Space size="large">
            <Button
              icon={liked ? <LikeFilled /> : <LikeOutlined />}
              onClick={() => setLiked(!liked)}
            >
              点赞
            </Button>
            <Button
              icon={collected ? <StarFilled /> : <StarOutlined />}
              onClick={() => setCollected(!collected)}
            >
              收藏
            </Button>
            <Button icon={<ShareAltOutlined />}>
              分享
            </Button>
          </Space>
        </div>

        <Divider />

        <div>
          <Title level={4}>评论区</Title>
          <TextArea
            rows={4}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="写下你的评论..."
            style={{ marginBottom: 16 }}
          />
          <Button type="primary" onClick={handleSubmitComment}>
            发表评论
          </Button>

          <List
            style={{ marginTop: 24 }}
            itemLayout="horizontal"
            dataSource={comments}
            renderItem={(item) => (
              <List.Item
                actions={[
                  <Button type="text" icon={<LikeOutlined />} key="list-loadmore-like">
                    {item.likes}
                  </Button>,
                ]}
              >
                <List.Item.Meta
                  avatar={<Avatar src={item.avatar} />}
                  title={
                    <Space>
                      <span>{item.author}</span>
                      <span style={{ color: 'rgba(0, 0, 0, 0.45)', fontSize: '14px' }}>
                        {item.createTime}
                      </span>
                    </Space>
                  }
                  description={item.content}
                />
              </List.Item>
            )}
          />
        </div>
      </article>
    </Card>
  );
};

export default ForumDetail;
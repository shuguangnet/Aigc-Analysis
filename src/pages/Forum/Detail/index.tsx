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

const ForumDetail: React.FC = () => {
  const { id } = useParams();
  const [liked, setLiked] = useState(false);
  const [collected, setCollected] = useState(false);
  const [comment, setComment] = useState('');

  const handleSubmitComment = () => {
    if (!comment.trim()) {
      message.warning('请输入评论内容');
      return;
    }
    // 提交评论
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

          {/* 评论列表 */}
          {/* 这里可以复用你原有的评论列表组件 */}
        </div>
      </article>
    </Card>
  );
};

export default ForumDetail;
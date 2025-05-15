import React, { useState, useEffect } from 'react';
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
import { getPostVoByIdUsingGet } from '@/services/hebi/postController';
import { doThumbUsingPost } from '@/services/hebi/postThumbController';
import { doPostFavourUsingPost } from '@/services/hebi/postFavourController';
import dayjs from 'dayjs'; 
import MDEditor from '@uiw/react-md-editor'; 
import '@uiw/react-md-editor/markdown-editor.css'; 
import '@uiw/react-markdown-preview/markdown.css'; 

const { Title } = Typography;
const { TextArea } = Input;



import { useModel } from '@umijs/max'; // 新增

const ForumDetail: React.FC = () => {
  const { initialState } = useModel('@@initialState'); // 获取当前登录用户信息
  const currentUser = initialState?.currentUser;
  const { id } = useParams();
  const [liked, setLiked] = useState(false);
  const [collected, setCollected] = useState(false);
  const [comment, setComment] = useState('');
  // mock 评论数据
  const [comments, setComments] = useState([
    {
      id: 1,
      author: '小明',
      avatar: 'https://joeschmoe.io/api/v1/1',
      content: '很棒的分享，受益匪浅！',
      createTime: '2025-05-15 10:00:00',
      likes: 2,
    },
    {
      id: 2,
      author: 'AI助手',
      avatar: 'https://joeschmoe.io/api/v1/2',
      content: '请问有完整代码示例吗？',
      createTime: '2025-05-15 11:20:00',
      likes: 1,
    },
    {
      id: 3,
      author: '匿名用户',
      avatar: 'https://joeschmoe.io/api/v1/random',
      content: '期待更多相关内容！',
      createTime: '2025-05-15 12:45:00',
      likes: 0,
    },
  ]);

  // 帖子详情状态
  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // 拉取帖子详情
  useEffect(() => {
    const fetchDetail = async () => {
      setLoading(true);
      const res = await getPostVoByIdUsingGet({ id }); 
      console.log('res', res);
      if (res && res.code === 0 && res.data) {
        setPost(res.data);
        setLiked(!!res.data.hasThumb);      
        setCollected(!!res.data.hasFavour); 
      }
      setLoading(false);
    };
    if (id) fetchDetail();
  }, [id]);

  // 点赞处理
  const handleLike = async () => {
    try {
      const res = await doThumbUsingPost({ postId: id }); // 直接传字符串 id
      if (res && res.code === 0) {
        setLiked(!liked);
        message.success(liked ? '已取消点赞' : '点赞成功');
      } else {
        message.error(res?.message || '操作失败');
      }
    } catch (e) {
      message.error('操作失败');
    }
  };

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

  // 收藏处理
  const handleFavour = async () => {
    try {
      const res = await doPostFavourUsingPost({ postId: id });
      if (res && res.code === 0) {
        setCollected(!collected);
        message.success(collected ? '已取消收藏' : '收藏成功');
      } else {
        message.error(res?.message || '操作失败');
      }
    } catch (e) {
      message.error('操作失败');
    }
  };

  // 判断是否是当前用户的帖子
  const isMyPost = currentUser?.id === post?.userId;

  return (
    <Card loading={loading}>
      <article>
        <header style={{ marginBottom: 24 }}>
          <Title level={2}>{post?.title || '帖子标题'}</Title>
          <Space split={<Divider type="vertical" />}>
            
            <Space>
              <Avatar src={post?.user?.userAvatar || 'https://joeschmoe.io/api/v1/random'} />
              <span>{post?.user?.userName || '无'}</span>
            </Space>
            <span>
              {post?.createTime ? dayjs(post.createTime).format('YYYY-MM-DD HH:mm:ss') : '发布时间'}
            </span>
            {post?.tagList?.map((tag: string) => (
              <Tag color="blue" key={tag}>{tag}</Tag>
            ))}
            {isMyPost && (
              <Button 
                type="text" 
                onClick={() => {
                  window.location.href = `/forum/publish?id=${id}`;  // 使用 window.location.href 进行跳转
                }}
              >
                修改
              </Button>
            )}
          </Space>
        </header>

        {/* Markdown 渲染帖子内容 */}
        <div data-color-mode="light" style={{ background: '#fff' }}>
          <MDEditor.Markdown source={post?.content || '帖子内容'} />
        </div>

        <div style={{ marginTop: 24 }}>
          <Space size="large">
            <Button
              icon={liked ? <LikeFilled style={{ color: '#ff4d4f' }} /> : <LikeOutlined />}
              onClick={handleLike}
              style={liked ? { color: '#ff4d4f', borderColor: '#ff4d4f', background: '#fff0f0' } : {}}
            >
              点赞 {post?.thumbNum ?? 0}
            </Button>
            <Button
              icon={collected ? <StarFilled style={{ color: '#ff4d4f' }} /> : <StarOutlined />}
              onClick={handleFavour}
              style={collected ? { color: '#ff4d4f', borderColor: '#ff4d4f', background: '#fff0f0' } : {}}
            >
              收藏 {post?.favourNum ?? 0}
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
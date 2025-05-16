import React, { useState, useEffect } from 'react';
import { useParams, useModel } from '@umijs/max';
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
import { getCommentListByPostIdUsingGet, addCommentUsingPost } from '@/services/hebi/commentController';
import dayjs from 'dayjs';
import MDEditor from '@uiw/react-md-editor';
import '@uiw/react-md-editor/markdown-editor.css';
import '@uiw/react-markdown-preview/markdown.css';

const { Title } = Typography;
const { TextArea } = Input;

const ForumDetail: React.FC = () => {
  const { initialState } = useModel('@@initialState');
  const currentUser = initialState?.currentUser;
  const { id } = useParams();
  
  // 帖子相关状态
  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState(false);
  const [collected, setCollected] = useState(false);
  
  // 评论相关状态
  const [comments, setComments] = useState<API.CommentVO[]>([]);
  const [comment, setComment] = useState('');
  const [commentLoading, setCommentLoading] = useState(false);

  // 判断是否是当前用户的帖子
  const isMyPost = currentUser?.id === post?.userId;
  
  

  

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
      const res = await doThumbUsingPost({ postId: id });
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

  

  // 添加获取评论列表的 effect
  useEffect(() => {
    const fetchComments = async () => {
      if (!id) return;
      try {
        const res = await getCommentListByPostIdUsingGet({ postId: id });
        if (res && res.code === 0 && res.data) {
          setComments(res.data);
        }
      } catch (error) {
        message.error('获取评论失败');
      }
    };
    fetchComments();
  }, [id]);

  // 修改提交评论的处理函数
  const handleSubmitComment = async () => {
    if (!comment.trim()) {
      message.warning('请输入评论内容');
      return;
    }
    setCommentLoading(true);
    try {
      const res = await addCommentUsingPost({
        content: comment.trim(),
        postId: id,
      });
      if (res && res.code === 0) {
        message.success('评论成功');
        setComment('');
        // 重新获取评论列表
        const commentsRes = await getCommentListByPostIdUsingGet({ postId: id });
        if (commentsRes && commentsRes.code === 0 && commentsRes.data) {
          setComments(commentsRes.data);
          // 获取最新的帖子信息（包括评论数等）
          const postRes = await getPostVoByIdUsingGet({ id });
          if (postRes && postRes.code === 0 && postRes.data) {
            setPost(postRes.data);
          }
        }
      } else {
        message.error(res?.message || '评论失败');
      }
    } catch (error) {
      message.error('评论失败');
    }
    setCommentLoading(false);
  };

  // 在 return 部分修改评论区渲染
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
          <Button type="primary" onClick={handleSubmitComment} loading={commentLoading}>
            发表评论
          </Button>

          <List
            style={{ marginTop: 24 }}
            itemLayout="horizontal"
            dataSource={comments}
            renderItem={(item) => (
              <List.Item>
                <List.Item.Meta
                  avatar={<Avatar src={item.userAvatar || 'https://joeschmoe.io/api/v1/random'} />}
                  title={
                    <Space>
                      <span>{item.userName || '匿名用户'}</span>
                      <span style={{ color: 'rgba(0, 0, 0, 0.45)', fontSize: '14px' }}>
                        {item.createTime ? dayjs(item.createTime).format('YYYY-MM-DD HH:mm:ss') : ''}
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
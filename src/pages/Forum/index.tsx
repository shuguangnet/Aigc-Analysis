import {LikeFilled,LikeOutlined,MessageOutlined,PlusOutlined,SendOutlined,} from '@ant-design/icons';
import type { UploadFile, UploadProps } from 'antd';
import {Avatar,Button,Card,Comment,Divider,Form,Image,Input,List,message,Space,Tooltip,Upload} from 'antd';
import moment from 'moment';
import React, { useState } from 'react';

const { TextArea } = Input;

type CommentType = {
  id: string;
  author: string;
  avatar: string;
  content: string;
  datetime: string;
  likes: number;
  liked: boolean;
};

type PostType = {
  id: string;
  author: string;
  avatar: string;
  content: string;
  images: string[];
  datetime: string;
  likes: number;
  liked: boolean;
  comments: CommentType[];
  commentVisible: boolean;
};

const Forum: React.FC = () => {
  // 当前用户信息
  const currentUser = {
    name: '当前用户',
    avatar: 'https://joeschmoe.io/api/v1/random',
  };

  // 帖子列表数据
  const [posts, setPosts] = useState<PostType[]>([
    {
      id: '1',
      author: '用户1',
      avatar: 'https://joeschmoe.io/api/v1/1',
      content: '这是一个示例帖子内容，欢迎大家讨论！',
      images: ['https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png'],
      datetime: '2023-05-01 10:00:00',
      likes: 5,
      liked: false,
      comments: [
        {
          id: '1-1',
          author: '用户2',
          avatar: 'https://joeschmoe.io/api/v1/2',
          content: '这个帖子很有意义！',
          datetime: '2023-05-01 10:30:00',
          likes: 2,
          liked: false,
        },
      ],
      commentVisible: false,
    },
    {
      id: '2',
      author: '用户3',
      avatar: 'https://joeschmoe.io/api/v1/3',
      content: '分享一张有趣的图片',
      images: [
        'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
        'https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg',
      ],
      datetime: '2023-05-02 15:00:00',
      likes: 10,
      liked: true,
      comments: [],
      commentVisible: false,
    },
  ]);

  // 新帖子内容
  const [postContent, setPostContent] = useState('');
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState('');

  // 处理图片预览
  const handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = URL.createObjectURL(file.originFileObj as any);
    }
    setPreviewImage(file.url || (file.preview as string));
    setPreviewOpen(true);
  };

  // 处理图片变化
  const handleChange: UploadProps['onChange'] = ({ fileList: newFileList }) => {
    setFileList(newFileList);
  };

  // 上传按钮
  const uploadButton = (
    <div>
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>上传图片</div>
    </div>
  );

  // 发布新帖子
  const handlePostSubmit = () => {
    if (!postContent.trim() && fileList.length === 0) {
      message.warning('请填写内容或上传图片');
      return;
    }

    const newPost: PostType = {
      id: Date.now().toString(),
      author: currentUser.name,
      avatar: currentUser.avatar,
      content: postContent,
      images: fileList.map((file) => file.url || (file.preview as string)),
      datetime: moment().format('YYYY-MM-DD HH:mm:ss'),
      likes: 0,
      liked: false,
      comments: [],
      commentVisible: false,
    };

    setPosts([newPost, ...posts]);
    setPostContent('');
    setFileList([]);
    message.success('帖子发布成功');
  };

  // 点赞帖子
  const handleLikePost = (postId: string) => {
    setPosts(
      posts.map((post) => {
        if (post.id === postId) {
          return {
            ...post,
            likes: post.liked ? post.likes - 1 : post.likes + 1,
            liked: !post.liked,
          };
        }
        return post;
      }),
    );
  };

  // 切换评论可见性
  const toggleCommentVisible = (postId: string) => {
    setPosts(
      posts.map((post) => {
        if (post.id === postId) {
          return {
            ...post,
            commentVisible: !post.commentVisible,
          };
        }
        return post;
      }),
    );
  };

  // 添加评论
  const handleAddComment = (postId: string, content: string) => {
    if (!content.trim()) {
      message.warning('评论内容不能为空');
      return;
    }

    const newComment: CommentType = {
      id: `${postId}-${Date.now()}`,
      author: currentUser.name,
      avatar: currentUser.avatar,
      content: content,
      datetime: moment().format('YYYY-MM-DD HH:mm:ss'),
      likes: 0,
      liked: false,
    };

    setPosts(
      posts.map((post) => {
        if (post.id === postId) {
          return {
            ...post,
            comments: [...post.comments, newComment],
          };
        }
        return post;
      }),
    );
  };

  // 点赞评论
  const handleLikeComment = (postId: string, commentId: string) => {
    setPosts(
      posts.map((post) => {
        if (post.id === postId) {
          return {
            ...post,
            comments: post.comments.map((comment) => {
              if (comment.id === commentId) {
                return {
                  ...comment,
                  likes: comment.liked ? comment.likes - 1 : comment.likes + 1,
                  liked: !comment.liked,
                };
              }
              return comment;
            }),
          };
        }
        return post;
      }),
    );
  };

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: 20 }}>
      {/* 发布新帖子区域 */}
      <Card title="发布新帖子" style={{ marginBottom: 20 }}>
        <Form.Item>
          <TextArea
            rows={4}
            value={postContent}
            onChange={(e) => setPostContent(e.target.value)}
            placeholder="分享你的想法..."
          />
        </Form.Item>

        <Form.Item>
          <Upload
            listType="picture-card"
            fileList={fileList}
            onPreview={handlePreview}
            onChange={handleChange}
            beforeUpload={() => false} // 阻止自动上传
            multiple
          >
            {fileList.length >= 4 ? null : uploadButton}
          </Upload>
        </Form.Item>

        <Form.Item>
          <Button type="primary" onClick={handlePostSubmit} icon={<SendOutlined />}>
            发布
          </Button>
        </Form.Item>
      </Card>

      {/* 图片预览 */}
      {previewImage && (
        <Image
          wrapperStyle={{ display: 'none' }}
          preview={{
            visible: previewOpen,
            onVisibleChange: (visible) => setPreviewOpen(visible),
            afterOpenChange: (visible) => !visible && setPreviewImage(''),
          }}
          src={previewImage}
        />
      )}

      {/* 帖子列表 */}
      <List
        itemLayout="vertical"
        size="large"
        dataSource={posts}
        renderItem={(post) => (
          <Card style={{ marginBottom: 20 }}>
            <Comment
              author={<a>{post.author}</a>}
              avatar={<Avatar src={post.avatar} alt={post.author} />}
              content={<p>{post.content}</p>}
              datetime={
                <Tooltip title={post.datetime}>
                  <span>{moment(post.datetime).fromNow()}</span>
                </Tooltip>
              }
            />

            {/* 帖子图片 */}
            {post.images.length > 0 && (
              <div style={{ marginTop: 16 }}>
                <Image.PreviewGroup>
                  <Space wrap>
                    {post.images.map((img, index) => (
                      <Image
                        key={index}
                        width={150}
                        height={150}
                        src={img}
                        style={{ objectFit: 'cover' }}
                      />
                    ))}
                  </Space>
                </Image.PreviewGroup>
              </div>
            )}

            {/* 帖子操作 */}
            <div style={{ marginTop: 16 }}>
              <Space>
                <span onClick={() => handleLikePost(post.id)} style={{ cursor: 'pointer' }}>
                  {post.liked ? <LikeFilled style={{ color: '#1890ff' }} /> : <LikeOutlined />}
                  <span style={{ paddingLeft: 8 }}>{post.likes}</span>
                </span>
                <span onClick={() => toggleCommentVisible(post.id)} style={{ cursor: 'pointer' }}>
                  <MessageOutlined />
                  <span style={{ paddingLeft: 8 }}>{post.comments.length}</span>
                </span>
              </Space>
            </div>

            {/* 评论区域 */}
            {post.commentVisible && (
              <div style={{ marginTop: 16 }}>
                <Divider orientation="left" plain>
                  评论
                </Divider>

                {/* 评论列表 */}
                <List
                  dataSource={post.comments}
                  renderItem={(comment) => (
                    <Comment
                      author={<a>{comment.author}</a>}
                      avatar={<Avatar src={comment.avatar} alt={comment.author} />}
                      content={<p>{comment.content}</p>}
                      datetime={
                        <Tooltip title={comment.datetime}>
                          <span>{moment(comment.datetime).fromNow()}</span>
                        </Tooltip>
                      }
                      actions={[
                        <span
                          key="comment-like"
                          onClick={() => handleLikeComment(post.id, comment.id)}
                          style={{ cursor: 'pointer' }}
                        >
                          {comment.liked ? (
                            <LikeFilled style={{ color: '#1890ff' }} />
                          ) : (
                            <LikeOutlined />
                          )}
                          <span style={{ paddingLeft: 8 }}>{comment.likes}</span>
                        </span>,
                      ]}
                    />
                  )}
                />

                {/* 添加评论 */}
                <Comment
                  avatar={<Avatar src={currentUser.avatar} alt={currentUser.name} />}
                  content={
                    <Editor
                      onSubmit={(content) => handleAddComment(post.id, content)}
                      placeholder="写下你的评论..."
                    />
                  }
                />
              </div>
            )}
          </Card>
        )}
      />
    </div>
  );
};

// 评论编辑器组件
const Editor = ({
  onSubmit,
  placeholder,
}: {
  onSubmit: (content: string) => void;
  placeholder: string;
}) => {
  const [value, setValue] = useState('');

  const handleSubmit = () => {
    onSubmit(value);
    setValue('');
  };

  return (
    <>
      <TextArea
        rows={2}
        onChange={(e) => setValue(e.target.value)}
        value={value}
        placeholder={placeholder}
      />
      <Form.Item style={{ marginTop: 16, marginBottom: 0 }}>
        <Button htmlType="submit" onClick={handleSubmit} type="primary" disabled={!value.trim()}>
          发表评论
        </Button>
      </Form.Item>
    </>
  );
};

export default Forum;

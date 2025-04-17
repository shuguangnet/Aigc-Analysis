import React, { useState } from 'react';
import { PageContainer } from '@ant-design/pro-components';
import { InboxOutlined, CopyOutlined, DownloadOutlined } from '@ant-design/icons';
import { Upload, Card, Button, Tabs, message, Input, Spin, Radio, Space, Tooltip } from 'antd';
import type { UploadFile } from 'antd/es/upload/interface';
import ReactECharts from 'echarts-for-react';
import Mermaid from '@/components/Mermaid';
import MonacoEditor from '@/components/MonacoEditor';

const { Dragger } = Upload;
const { TabPane } = Tabs;
const { TextArea } = Input;

const CodeAnalysisPage: React.FC = () => {
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [loading, setLoading] = useState(false);
  const [analysisType, setAnalysisType] = useState<'er' | 'module'>('er');
  const [analysisResult, setAnalysisResult] = useState<string>('');
  const [diagramCode, setDiagramCode] = useState<string>('');
  const [codeContent, setCodeContent] = useState<string>('');
  const [activeTab, setActiveTab] = useState<string>('editor');

  // 处理代码编辑
  const handleCodeChange = (value: string) => {
    setCodeContent(value);
  };

  // 处理代码分析
  const handleAnalyze = async () => {
    if (!codeContent.trim()) {
      message.warning('请输入或上传代码');
      return;
    }
    setLoading(true);
    try {
      // 这里应该调用后端API进行分析
      // const response = await analyzeCode({ content: codeContent, type: analysisType });
      
      // 模拟API响应
      setTimeout(() => {
        if (analysisType === 'er') {
          setDiagramCode(`
erDiagram
    USER ||--o{ POST : creates
    POST ||--|{ COMMENT : has
    USER {
        string username
        string email
        timestamp created_at
    }
    POST {
        string title
        text content
        timestamp published_at
    }
    COMMENT {
        text content
        timestamp created_at
    }
          `);
        } else {
          setDiagramCode(`
graph TD
    A[用户模块] --> B[认证服务]
    A --> C[个人中心]
    B --> D[权限管理]
    C --> E[设置]
          `);
        }
        setAnalysisResult('分析完成，建议优化数据库索引结构，添加适当的外键约束。');
        setActiveTab('result');
        message.success('分析成功');
      }, 1500);
    } catch (error) {
      message.error('分析失败');
    }
    setLoading(false);
  };

  // 处理文件上传
  const handleUpload = async (file: File) => {
    setLoading(true);
    try {
      // 读取文件内容
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        setCodeContent(content);
        setActiveTab('editor');
      };
      reader.readAsText(file);
    } catch (error) {
      message.error('文件读取失败');
    }
    setLoading(false);
  };

  return (
    <PageContainer>
      <Card>
        <Space direction="vertical" style={{ width: '100%' }}>
          <Radio.Group
            value={analysisType}
            onChange={(e) => {
              setAnalysisType(e.target.value);
              setFileList([]);
              setDiagramCode('');
              setAnalysisResult('');
            }}
          >
            <Radio.Button value="er">ER图生成</Radio.Button>
            <Radio.Button value="module">功能模块图</Radio.Button>
          </Radio.Group>

          <Tabs activeKey={activeTab} onChange={setActiveTab}>
            <TabPane tab="代码编辑器" key="editor">
              <Card>
                <MonacoEditor
                  language={analysisType === 'er' ? 'sql' : 'typescript'}
                  value={codeContent}
                  onChange={handleCodeChange}
                  height="400px"
                />
                <div style={{ marginTop: 16, textAlign: 'right' }}>
                  <Space>
                    <Dragger
                      showUploadList={false}
                      beforeUpload={(file) => {
                        handleUpload(file);
                        return false;
                      }}
                      style={{ display: 'inline-block' }}
                    >
                      <Button>上传文件</Button>
                    </Dragger>
                    <Button type="primary" onClick={handleAnalyze} loading={loading}>
                      开始分析
                    </Button>
                  </Space>
                </div>
              </Card>
            </TabPane>
            <TabPane tab="分析结果" key="result">
              {diagramCode && (
                <Card>
                  <div style={{ marginBottom: 16 }}>
                    <h3>分析建议</h3>
                    <p>{analysisResult}</p>
                  </div>
                  <Card title="可视化图表" extra={
                    <Space>
                      <Tooltip title="复制图表代码">
                        <Button 
                          icon={<CopyOutlined />}
                          onClick={() => {
                            navigator.clipboard.writeText(diagramCode);
                            message.success('复制成功');
                          }}
                        />
                      </Tooltip>
                      <Tooltip title="导出图表">
                        <Button icon={<DownloadOutlined />} />
                      </Tooltip>
                    </Space>
                  }>
                    <Mermaid chart={diagramCode} />
                  </Card>
                </Card>
              )}
            </TabPane>
          </Tabs>
        </Space>
      </Card>
    </PageContainer>
  );
};

export default CodeAnalysisPage;
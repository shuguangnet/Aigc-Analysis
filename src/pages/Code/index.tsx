import React, { useState } from 'react';
import { PageContainer } from '@ant-design/pro-components';
import { CopyOutlined, DownloadOutlined } from '@ant-design/icons';
import { Upload, Card, Button, Tabs, message, Radio, Space, Tooltip } from 'antd';
import type { UploadFile } from 'antd/es/upload/interface';
import Mermaid from '@/components/Mermaid';
import MonacoEditor from '@/components/MonacoEditor';
import html2canvas from 'html2canvas';
import useAIRequest from '@/hooks/useAIRequest';

const { Dragger } = Upload;
const { TabPane } = Tabs;


const CodeAnalysisPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [analysisType, setAnalysisType] = useState<'er' | 'module'>('er');
  const [analysisResult, setAnalysisResult] = useState<string>('');
  const [diagramCode, setDiagramCode] = useState<string>('');
  const [codeContent, setCodeContent] = useState<string>('');
  const [activeTab, setActiveTab] = useState<string>('editor');

  const handleCodeChange = (value: string) => {
    setCodeContent(value);
  };

  const handleExportDiagram = async () => {
    try {
      const chartElement = document.querySelector('.mermaid') as HTMLElement;
      if (!chartElement) {
        message.warning('未找到图表元素');
        return;
      }

      const canvas = await html2canvas(chartElement, {
        useCORS: true,
        scale: 2,
        backgroundColor: '#ffffff'
      });

      const image = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = image;
      link.download = `diagram_${new Date().getTime()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      message.success('导出成功');
    } catch (error) {
      console.error('导出失败:', error);
      message.error('导出失败，请重试');
    }
  };

  const { loading: aiLoading, sendRequest } = useAIRequest();

  const handleAnalyze = async () => {
    if (!codeContent.trim()) {
      message.warning('请输入或上传代码');
      return;
    }
    setLoading(true);
    try {
      // 删除未使用的 fetch 请求代码

      const content = await sendRequest([
        {
          type: 'text',
          text: analysisType === 'er'
            ? '请分析这段代码并生成对应的ER图，使用mermaid语法,用于计算机科学与技术毕业论文。分析要点：1. 实体关系 2. 属性定义 3. 关系类型'
            : '请分析这段代码并生成功能模块图，使用mermaid语法,用于计算机科学与技术毕业论文。。分析要点：1. 模块划分 2. 依赖关系 3. 调用流程'
        },
        {
          type: 'text',
          text: codeContent
        }
      ]);

      const [diagramPart, analysisPart] = content.split('分析建议：').map(part => part.trim());
      const mermaidCode = diagramPart.match(/```mermaid\n([\s\S]*?)\n```/)?.[1] || diagramPart;

      setDiagramCode(mermaidCode);
      setAnalysisResult(analysisPart || '暂无具体分析建议');
      setActiveTab('result');
      message.success('分析成功');
    } catch (error) {
      console.error('分析失败:', error);
      message.error('分析失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (file: File) => {
    try {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        setCodeContent(content);
        setActiveTab('editor');
        message.success('文件上传成功');
      };
      reader.readAsText(file);
      return false; // 阻止默认上传行为
    } catch (error) {
      message.error('文件读取失败');
      console.error('文件读取失败:', error);
    }
  };

  return (
    <PageContainer>
      <Card>
        <Space direction="vertical" style={{ width: '100%' }}>
          <Radio.Group
            value={analysisType}
            onChange={(e) => {
              setAnalysisType(e.target.value);
              setDiagramCode('');
              setAnalysisResult('');
            }}
          >
            <Radio.Button value="er">ER图生成</Radio.Button>
            <Radio.Button value="module">数据流图</Radio.Button>
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
                    <Button type="primary" onClick={handleAnalyze} loading={aiLoading}>
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
                        <Button icon={<DownloadOutlined />} onClick={handleExportDiagram} />
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

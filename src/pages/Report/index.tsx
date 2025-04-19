import React, { useState } from 'react';
import { PageContainer } from '@ant-design/pro-components';
import { InboxOutlined, FileExcelOutlined, BarChartOutlined, FileWordOutlined } from '@ant-design/icons';
import { Upload, Card, Button, Steps, message, Input, Spin, Result, Progress, Alert, Typography } from 'antd';
import type { UploadFile } from 'antd/es/upload/interface';
import { marked } from 'marked';
import styles from './index.less';
import { Document, Packer, Paragraph as DocxParagraph, TextRun } from 'docx';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';

const { Dragger } = Upload;
const { TextArea } = Input;
const { Title, Paragraph } = Typography;

interface AnalysisResponse {
  id: string;
  choices: {
    message: {
      content: string;
    };
  }[];
}


interface ReportSection {
  title: string;
  content: string;
}

interface ReportData {
  title: string;
  summary: string;
  sections: ReportSection[];
  charts: any[];
  markdown: string;
}

const ReportPage: React.FC = () => {
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [goal, setGoal] = useState('');
  const [reportData, setReportData] = useState<any>(null);
  const [wordUrl, setWordUrl] = useState<string>('');
  const [progress, setProgress] = useState(0);
  const [previewData, setPreviewData] = useState<any>(null);

  const handleUpload = async (file: File) => {
    setLoading(true);
    try {
      const isImage = file.type.startsWith('image/');
      const isExcel = file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || 
                      file.type === 'application/vnd.ms-excel';
      const isCsv = file.type === 'text/csv';

      if (isImage) {
        // 处理图片文件
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = async () => {
          const base64Image = reader.result as string;
          await analyzeData({
            type: 'image_url',
            image_url: {
              url: base64Image
            }
          });
        };
      } else if (isExcel || isCsv) {
        // 处理 Excel/CSV 文件
        const reader = new FileReader();
        reader.onload = async (e) => {
          const data = e.target?.result;
          const workbook = XLSX.read(data, { type: 'array' });
          const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
          const jsonData = XLSX.utils.sheet_to_json(firstSheet, { header: 1 });
          
          // 将数据转换为字符串
          const textContent = jsonData.map(row => row.join('\t')).join('\n');
          
          await analyzeData({
            type: 'text',
            text: textContent
          });
        };
        reader.readAsArrayBuffer(file);
      } else {
        message.error('不支持的文件格式');
        setLoading(false);
      }
    } catch (error) {
      message.error('文件处理失败');
      console.error('文件处理失败:', error);
      setLoading(false);
    }
  };

  const analyzeData = async (content: any) => {
    try {
      const response = await fetch('http://8.218.106.190:3000/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer sk-mw9ekhJlSj3GeGiw0hLRSHlwdkDFst8q6oBfQrW0L15QilbY'
        },
        body: JSON.stringify({
          model: 'deepseek-chat',
          messages: [
            {
              role: 'user',
              content: [
                {
                  type: 'text',
                  text: '请分析这些数据的趋势和关键信息，并给出专业的分析见解。'
                },
                content
              ]
            }
          ],
          max_tokens: 1000
        })
      });

      const data: AnalysisResponse = await response.json();
      
      setPreviewData({
        columns: ['分析结果'],
        data: [[data.choices[0].message.content]]
      });
      
      message.success('数据分析成功');
      setCurrentStep(1);
    } catch (error) {
      message.error('数据分析失败');
      console.error('API调用失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateWordDocument = async (markdown: string) => {
  const doc = new Document({
    sections: [
      {
        properties: {},
        children: markdown.split('\n').map(line => {
          if (line.startsWith('# ')) {
            return new DocxParagraph({
              text: line.replace('# ', ''),
              heading: 'Heading1'
            });
          }
          if (line.startsWith('## ')) {
            return new DocxParagraph({
              text: line.replace('## ', ''),
              heading: 'Heading2'
            });
          }
          return new DocxParagraph({
            children: [
              new TextRun({
                text: line,
                size: 24
              })
            ]
          });
        })
      }
    ]
  });

  const blob = await Packer.toBlob(doc);
  saveAs(blob, '数据分析报告.docx');
};

const handleDownload = async () => {
  if (reportData?.markdown) {
    try {
      await generateWordDocument(reportData.markdown);
      message.success('报告下载成功');
    } catch (error) {
      message.error('报告下载失败');
      console.error('下载失败:', error);
    }
  }
};

  const generateReport = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://8.218.106.190:3000/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer sk-mw9ekhJlSj3GeGiw0hLRSHlwdkDFst8q6oBfQrW0L15QilbY'
        },
        body: JSON.stringify({
          model: 'deepseek-chat',
          messages: [
            {
              role: 'user',
              content: [
                {
                  type: 'text',
                  text: `请基于以下分析目标和数据，生成一份详细的markdown格式分析报告，包含标题、概述、详细分析等章节：${goal}\n${previewData?.data[0][0]}`
                }
              ]
            }
          ],
          max_tokens: 2000
        })
      });

      const data: AnalysisResponse = await response.json();
      const markdownContent = data.choices[0].message.content;
      
      // 解析 markdown 内容
      const titleMatch = markdownContent.match(/^#\s+(.+)$/m);
      const title = titleMatch ? titleMatch[1] : '数据分析报告';
      
      setReportData({
        title,
        summary: '',
        sections: [],
        charts: [],
        markdown: markdownContent
      });

      setWordUrl('https://example.com/report.docx');
      message.success('报告生成成功');
      setCurrentStep(2);
    } catch (error) {
      message.error('报告生成失败');
    } finally {
      setLoading(false);
    }
  };

  const renderPreview = () => {
    if (!previewData) return null;
    return (
      <Card className={styles.previewCard} title="数据预览">
        <table className={styles.previewTable}>
          <thead>
            <tr>
              {previewData.columns.map((col: string) => (
                <th key={col}>{col}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {previewData.data.map((row: any[], index: number) => (
              <tr key={index}>
                {row.map((cell, cellIndex) => (
                  <td key={cellIndex}>{cell}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    );
  };

  const renderReport = () => {
    if (!reportData?.markdown) return null;
    
    return (
      <div 
        className={styles.reportContent}
        dangerouslySetInnerHTML={{ __html: marked(reportData.markdown) }}
      />
    );
  };

  const steps = [
    {
      title: '上传文件',
      icon: <FileExcelOutlined />,
      content: (
        <div className={styles.uploadStep}>
          <Alert
            message="支持的文件格式"
            description="Excel文件 (.xlsx, .xls) 或 CSV文件 (.csv)"
            type="info"
            showIcon
            style={{ marginBottom: 24 }}
          />
          <Dragger
            fileList={fileList}
            beforeUpload={(file) => {
              // const isExcelOrCsv =
              //   file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
              //   file.type === 'application/vnd.ms-excel' ||
              //   file.type === 'text/csv';
              // if (!isExcelOrCsv) {
              //   message.error('只支持上传 Excel 或 CSV 文件！');
              //   return false;
              // }
              setFileList([file]);
              handleUpload(file);
              return false;
            }}
            onRemove={() => {
              setFileList([]);
              setCurrentStep(0);
              setPreviewData(null);
              return true;
            }}
          >
            <p className="ant-upload-drag-icon">
              <InboxOutlined />
            </p>
            <p className="ant-upload-text">点击或拖拽文件到此区域上传</p>
            <p className="ant-upload-hint">支持 Excel 和 CSV 文件格式</p>
          </Dragger>
          {loading && (
            <Progress percent={progress} status="active" style={{ marginTop: 24 }} />
          )}
          {renderPreview()}
        </div>
      ),
    },
    {
      title: '设置目标',
      icon: <BarChartOutlined />,
      content: (
        <div className={styles.goalStep}>
          <Title level={4}>分析目标设置</Title>
          <Paragraph type="secondary">
            请详细描述您的分析需求，例如：
            <ul>
              <li>分析销售趋势和影响因素</li>
              <li>识别客户购买行为模式</li>
              <li>预测未来销售情况</li>
            </ul>
          </Paragraph>
          <TextArea
            placeholder="请输入你想要分析的目标，例如：分析销售趋势、客户分布等"
            rows={4}
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
            className={styles.goalInput}
          />
          <Button 
            type="primary" 
            onClick={generateReport} 
            disabled={!goal}
            size="large"
            className={styles.generateButton}
          >
            开始生成报告
          </Button>
          {loading && (
            <div className={styles.progressContainer}>
              <Progress percent={progress} status="active" />
              <Paragraph type="secondary">正在生成分析报告，请稍候...</Paragraph>
            </div>
          )}
        </div>
      ),
    },
    {
      title: '查看报告',
      icon: <FileWordOutlined />,
      content: wordUrl && (
        <div className={styles.reportStep}>
          <Card>
            <Result
              status="success"
              title="报告生成成功"
              subTitle="您可以查看报告预览或下载完整报告"
              extra={[
                <Button
                  type="primary"
                  icon={<FileWordOutlined />}
                  onClick={handleDownload}
                  key="download"
                  size="large"
                >
                  下载完整报告
                </Button>,
                <Button
                  onClick={() => {
                    setCurrentStep(0);
                    setFileList([]);
                    setGoal('');
                    setWordUrl('');
                    setPreviewData(null);
                    setReportData(null);
                  }}
                  key="again"
                  size="large"
                >
                  重新生成
                </Button>,
              ]}
            />
            {renderReport()}
          </Card>
        </div>
      ),
    },
  ];

  return (
    <PageContainer
      title="智能图表分析"
      subTitle="上传数据图表，快速获取专业分析见解"
    >
      <Card className={styles.container}>
        <Steps
          current={currentStep}
          items={steps}
          className={styles.steps}
        />
        <div className={styles.content}>
          <Spin spinning={loading}>{steps[currentStep].content}</Spin>
        </div>
      </Card>
    </PageContainer>
  );
};



export default ReportPage;

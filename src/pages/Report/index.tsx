import React, { useState } from 'react';
import { PageContainer } from '@ant-design/pro-components';
import { InboxOutlined, FileExcelOutlined, BarChartOutlined, FileWordOutlined } from '@ant-design/icons';
import { Upload, Card, Button, Steps, message, Input, Spin, Result, Space, Progress, Alert, Typography } from 'antd';
import type { UploadFile } from 'antd/es/upload/interface';
import ReactECharts from 'echarts-for-react';
import styles from './index.less';

const { Dragger } = Upload;
const { TextArea } = Input;
const { Title, Paragraph } = Typography;

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
      const formData = new FormData();
      formData.append('file', file);
      
      // 模拟上传进度
      const timer = setInterval(() => {
        setProgress(prev => {
          if (prev >= 99) {
            clearInterval(timer);
            return 99;
          }
          return prev + 10;
        });
      }, 200);

      // 模拟预览数据
      setTimeout(() => {
        setPreviewData({
          columns: ['日期', '销售额', '利润'],
          data: [
            ['2023-01', 1000, 200],
            ['2023-02', 1500, 300],
            ['2023-03', 1200, 250],
          ]
        });
        setProgress(100);
        message.success('文件上传成功');
        setCurrentStep(1);
        setLoading(false);
        clearInterval(timer);
      }, 2000);
    } catch (error) {
      message.error('文件上传失败');
      setLoading(false);
    }
  };

  const generateReport = async () => {
    setLoading(true);
    try {
      let progress = 0;
      const timer = setInterval(() => {
        progress += 20;
        if (progress <= 100) {
          setProgress(progress);
        }
      }, 1000);
  
      setTimeout(() => {
        clearInterval(timer);
        setProgress(100);
        setWordUrl('https://example.com/report.docx');
        setReportData({
          title: '数据分析报告',
          summary: '根据您提供的数据，我们生成了详细的分析报告...',
          charts: [
            {
              title: '销售趋势',
              type: 'line',
              data: {
                title: {
                  text: '销售趋势分析'
                },
                tooltip: {
                  trigger: 'axis'
                },
                xAxis: {
                  type: 'category',
                  data: ['1月', '2月', '3月']
                },
                yAxis: {
                  type: 'value'
                },
                series: [{
                  name: '销售额',
                  type: 'line',
                  data: [1000, 1500, 1200],
                  smooth: true
                }]
              }
            }
          ]
        });
        message.success('报告生成成功');
        setCurrentStep(2);
        setLoading(false);
      }, 5000);
    } catch (error) {
      message.error('报告生成失败');
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
              const isExcelOrCsv =
                file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
                file.type === 'application/vnd.ms-excel' ||
                file.type === 'text/csv';
              if (!isExcelOrCsv) {
                message.error('只支持上传 Excel 或 CSV 文件！');
                return false;
              }
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
                  onClick={() => window.open(wordUrl)}
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
            {reportData && (
              <div className={styles.reportPreview}>
                <Title level={4}>{reportData.title}</Title>
                <Paragraph>{reportData.summary}</Paragraph>
                {reportData.charts.map((chart: any, index: number) => (
                  <Card key={index} title={chart.title} className={styles.chartCard}>
                    <ReactECharts option={chart.data} style={{ height: 300 }} />
                  </Card>
                ))}
              </div>
            )}
          </Card>
        </div>
      ),
    },
  ];

  return (
    <PageContainer
      title="智能报告生成"
      subTitle="上传数据文件，快速生成专业分析报告"
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
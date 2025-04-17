import React, { useState } from 'react';
import { PageContainer } from '@ant-design/pro-components';
import { InboxOutlined } from '@ant-design/icons';
import { Upload, Card, Button, Steps, message, Input, Spin,Result } from 'antd';
import type { UploadFile } from 'antd/es/upload/interface';
import ReactECharts from 'echarts-for-react';
import { DownloadOutlined } from '@ant-design/icons';

const { Dragger } = Upload;
const { TextArea } = Input;

const ReportPage: React.FC = () => {
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [goal, setGoal] = useState('');
  const [reportData, setReportData] = useState<any>(null);
  const [wordUrl, setWordUrl] = useState<string>('');

  const handleUpload = async (file: File) => {
    setLoading(true);
    // 这里应该调用后端API上传文件
    try {
      const formData = new FormData();
      formData.append('file', file);
      // const response = await uploadFile(formData);
      message.success('文件上传成功');
      setCurrentStep(1);
    } catch (error) {
      message.error('文件上传失败');
    }
    setLoading(false);
  };

  const generateReport = async () => {
    setLoading(true);
    try {
      // 这里应该调用后端API生成报告
      // const response = await generateWordReport({ fileId: fileList[0].uid, goal });
      // setWordUrl(response.data.wordUrl);
      
      // 模拟数据
      setTimeout(() => {
        setWordUrl('https://example.com/report.docx');
        message.success('报告生成成功');
        setCurrentStep(2);
      }, 1500);
    } catch (error) {
      message.error('报告生成失败');
    }
    setLoading(false);
  };

  const steps = [
    {
      title: '上传文件',
      content: (
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
            return true;
          }}
        >
          <p className="ant-upload-drag-icon">
            <InboxOutlined />
          </p>
          <p className="ant-upload-text">点击或拖拽文件到此区域上传</p>
          <p className="ant-upload-hint">支持 Excel 和 CSV 文件格式</p>
        </Dragger>
      ),
    },
    {
      title: '设置目标',
      content: (
        <div style={{ textAlign: 'center' }}>
          <TextArea
            placeholder="请输入你想要分析的目标，例如：分析销售趋势、客户分布等"
            rows={4}
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
            style={{ marginBottom: 16 }}
          />
          <Button type="primary" onClick={generateReport} disabled={!goal}>
            生成报告
          </Button>
        </div>
      ),
    },
    {
      title: '查看报告',
      content: wordUrl && (
        <div style={{ textAlign: 'center' }}>
          <Card>
            <Result
              status="success"
              title="报告生成成功"
              subTitle="您可以下载生成的Word报告文档"
              extra={[
                <Button
                  type="primary"
                  icon={<DownloadOutlined />}
                  onClick={() => window.open(wordUrl)}
                  key="download"
                >
                  下载报告
                </Button>,
                <Button
                  onClick={() => {
                    setCurrentStep(0);
                    setFileList([]);
                    setGoal('');
                    setWordUrl('');
                  }}
                  key="again"
                >
                  重新生成
                </Button>,
              ]}
            />
          </Card>
        </div>
      ),
    },
  ];

  return (
    <PageContainer>
      <Card>
        <Steps current={currentStep} items={steps} style={{ marginBottom: 24 }} />
        <Spin spinning={loading}>{steps[currentStep].content}</Spin>
      </Card>
    </PageContainer>
  );
};

export default ReportPage;
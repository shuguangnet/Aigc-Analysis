import React, { useState, useRef } from 'react';
import { PageContainer } from '@ant-design/pro-components';
import {
  Card,
  Select,
  Input,
  Button,
  List,
  Avatar,
  Spin,
  Upload,
  message,
  Tooltip,
  Space,
} from 'antd';
import { SendOutlined, RobotOutlined, UserOutlined, InboxOutlined } from '@ant-design/icons';
import type { UploadFile } from 'antd/es/upload/interface';
import ReactECharts from 'echarts-for-react';

const { Option } = Select;
const { Dragger } = Upload;
const { TextArea } = Input;

interface Message {
  type: 'user' | 'assistant';
  content: string;
  timestamp: number;
  charts?: any;
}

const AnalysisCenter: React.FC = () => {
  const [analysisType, setAnalysisType] = useState<string>('predictive');
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const messagesEndRef = useRef<null | HTMLDivElement>(null);

  const analysisOptions = [
    { value: 'predictive', label: '预测性分析' },
    { value: 'descriptive', label: '描述性统计' },
    { value: 'anomaly', label: '异常检测' },
    { value: 'quality', label: '数据质量分析' },
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSend = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      type: 'user',
      content: inputValue,
      timestamp: Date.now(),
    };

    setMessages([...messages, userMessage]);
    setInputValue('');
    setLoading(true);

    try {
      // 这里应该调用后端API进行分析
      // const response = await analyzeData({ type: analysisType, message: inputValue });
      
      // 模拟API响应
      setTimeout(() => {
        const assistantMessage: Message = {
          type: 'assistant',
          content: generateMockResponse(analysisType),
          timestamp: Date.now(),
          charts: generateMockChart(analysisType),
        };
        setMessages(prev => [...prev, assistantMessage]);
        setLoading(false);
        scrollToBottom();
      }, 1500);
    } catch (error) {
      message.error('分析请求失败');
      setLoading(false);
    }
  };

  const generateMockResponse = (type: string) => {
    const responses: { [key: string]: string } = {
      predictive: '根据历史数据分析，预计未来三个月的销售增长率将达到15%，主要增长点来自新市场的开拓。',
      descriptive: '数据集中包含1000条记录，平均值为45.6，标准差为12.3，分布呈现正态分布特征。',
      anomaly: '检测到3个异常值点，主要出现在数据的边缘区域，建议进行进一步核实。',
      quality: '数据完整性为98.5%，存在少量缺失值，建议对缺失数据进行适当的填充处理。',
    };
    return responses[type] || '分析完成';
  };

  const generateMockChart = (type: string) => {
    const baseOption = {
      xAxis: {
        type: 'category',
        data: ['1月', '2月', '3月', '4月', '5月', '6月'],
      },
      yAxis: {
        type: 'value',
      },
      series: [{
        data: [150, 230, 224, 218, 135, 147],
        type: 'line',
      }],
    };
    return baseOption;
  };

  return (
    <PageContainer>
      <Card>
        <Space direction="vertical" style={{ width: '100%' }}>
          <Select
            style={{ width: '100%' }}
            value={analysisType}
            onChange={setAnalysisType}
            placeholder="请选择分析类型"
          >
            {analysisOptions.map(option => (
              <Option key={option.value} value={option.value}>
                {option.label}
              </Option>
            ))}
          </Select>

          <Dragger
            fileList={fileList}
            onChange={({ fileList }) => setFileList(fileList)}
            beforeUpload={(file) => {
              setFileList([file]);
              return false;
            }}
          >
            <p className="ant-upload-drag-icon">
              <InboxOutlined />
            </p>
            <p className="ant-upload-text">点击或拖拽文件上传</p>
            <p className="ant-upload-hint">支持 CSV、Excel 等数据文件格式</p>
          </Dragger>

          <div style={{ height: '400px', overflowY: 'auto', marginBottom: '16px' }}>
            <List
              itemLayout="horizontal"
              dataSource={messages}
              renderItem={item => (
                <List.Item style={{ justifyContent: item.type === 'user' ? 'flex-end' : 'flex-start' }}>
                  <Card style={{ maxWidth: '80%' }}>
                    <List.Item.Meta
                      avatar={
                        <Avatar icon={item.type === 'user' ? <UserOutlined /> : <RobotOutlined />} />
                      }
                      title={item.type === 'user' ? '你' : 'AI 助手'}
                      description={item.content}
                    />
                    {item.charts && (
                      <div style={{ marginTop: '16px' }}>
                        <ReactECharts option={item.charts} style={{ height: '300px' }} />
                      </div>
                    )}
                  </Card>
                </List.Item>
              )}
            />
            <div ref={messagesEndRef} />
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <TextArea
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="请输入你的分析需求..."
              autoSize={{ minRows: 2, maxRows: 6 }}
              onPressEnter={(e) => {
                if (!e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
            />
            <Button
              type="primary"
              icon={<SendOutlined />}
              onClick={handleSend}
              loading={loading}
              style={{ alignSelf: 'flex-end' }}
            >
              发送
            </Button>
          </div>
        </Space>
      </Card>
    </PageContainer>
  );
};

export default AnalysisCenter;
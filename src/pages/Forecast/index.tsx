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
  Tag,
  Divider,
} from 'antd';
import {
  SendOutlined,
  RobotOutlined,
  UserOutlined,
  InboxOutlined,
  LineChartOutlined,
  BarChartOutlined,
  PieChartOutlined,
  AreaChartOutlined,
} from '@ant-design/icons';
import type { UploadFile } from 'antd/es/upload/interface';
import ReactECharts from 'echarts-for-react';
import styles from './index.less';
import * as XLSX from 'xlsx';

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
    { value: 'predictive', label: '预测性分析', icon: <LineChartOutlined />, color: '#1890ff' },
    { value: 'descriptive', label: '描述性统计', icon: <BarChartOutlined />, color: '#52c41a' },
    { value: 'anomaly', label: '异常检测', icon: <PieChartOutlined />, color: '#faad14' },
    { value: 'quality', label: '数据质量分析', icon: <AreaChartOutlined />, color: '#722ed1' },
  ];

  const generateMockChart = (type: string) => {
    switch (type) {
      case 'predictive':
        return {
          title: { text: '销售趋势预测', left: 'center' },
          tooltip: { trigger: 'axis' },
          legend: { data: ['历史数据', '预测数据'], bottom: 10 },
          grid: { top: 50, right: 20, bottom: 60, left: 40 },
          xAxis: {
            type: 'category',
            data: ['1月', '2月', '3月', '4月', '5月', '6月'],
            axisLabel: { interval: 0 }
          },
          yAxis: { type: 'value', name: '销售额' },
          series: [
            {
              name: '历史数据',
              type: 'line',
              data: [150, 230, 224, 218, 135, 147],
              smooth: true,
            },
            {
              name: '预测数据',
              type: 'line',
              data: [null, null, null, 225, 238, 251],
              smooth: true,
              lineStyle: { type: 'dashed' },
            }
          ]
        };
      case 'descriptive':
        return {
          title: { text: '数据分布情况', left: 'center' },
          tooltip: { trigger: 'axis' },
          grid: { top: 50, right: 20, bottom: 60, left: 40 },
          xAxis: { type: 'category', data: ['极小值', '下四分位', '中位数', '上四分位', '极大值'] },
          yAxis: { type: 'value' },
          series: [{
            type: 'boxplot',
            data: [[10, 25, 35, 50, 70]],
            itemStyle: { color: '#52c41a' }
          }]
        };
    }
    return baseOption;
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleFileAnalysis = async (file: File) => {
  try {
    const reader = new FileReader();
    
    reader.onload = async (e) => {
      const data = e.target?.result;
      let textContent = '';
      
      if (file.name.toLowerCase().endsWith('.csv')) {
        textContent = data as string;
      } else {
        const workbook = XLSX.read(data, { type: 'array' });
        const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(firstSheet, { header: 1 });
        textContent = jsonData.map(row => row.join('\t')).join('\n');
      }

      const response = await fetch('https://aizex.top/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer sk-Bp4AtAw19a6lENrPUQeqfiS9KP46Z5A43j4QkNeX4NRnGKMU'
        },
        body: JSON.stringify({
          model: 'gpt-4o',
          messages: [
            {
              role: 'user',
              content: [
                {
                  type: 'text',
                  text: `请对以下数据进行${analysisOptions.find(opt => opt.value === analysisType)?.label}，并给出专业的分析见解：\n${textContent}`
                }
              ]
            }
          ],
          max_tokens: 2000
        })
      });

      const result = await response.json();
      
      const userMessage: Message = {
        type: 'user',
        content: `已上传文件：${file.name}`,
        timestamp: Date.now(),
      };

      const assistantMessage: Message = {
        type: 'assistant',
        content: result.choices[0].message.content,
        timestamp: Date.now(),
        charts: generateMockChart(analysisType),
      };

      setMessages(prev => [...prev, userMessage, assistantMessage]);
      setLoading(false);
      scrollToBottom();
    };

    if (file.name.toLowerCase().endsWith('.csv')) {
      reader.readAsText(file);
    } else {
      reader.readAsArrayBuffer(file);
    }
  } catch (error) {
    console.error('文件处理失败:', error);
    message.error('文件处理失败');
    setLoading(false);
  }
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

  return (
    <PageContainer
      className={styles.container}
      title="智能预测分析"
      subTitle="上传数据，获取专业的数据分析见解"
    >
      <Card bordered={false} className={styles.mainCard}>
        <Space direction="vertical" style={{ width: '100%' }} size="large">
          <div className={styles.analysisTypeSelector}>
            {analysisOptions.map(option => (
              <Tooltip key={option.value} title={option.label}>
                <Tag
                  className={styles.analysisTag}
                  color={analysisType === option.value ? option.color : 'default'}
                  icon={option.icon}
                  onClick={() => setAnalysisType(option.value)}
                >
                  {option.label}
                </Tag>
              </Tooltip>
            ))}
          </div>

          <Card className={styles.uploadCard}>
            <Dragger
              fileList={fileList}
              onChange={({ fileList }) => setFileList(fileList)}
              beforeUpload={(file) => {
                const isExcelOrCsv = /\.(xlsx|xls|csv)$/.test(file.name.toLowerCase());
                if (!isExcelOrCsv) {
                  message.error('只支持 Excel 或 CSV 文件！');
                  return false;
                }
                setFileList([file]);
                setLoading(true);
                handleFileAnalysis(file);
                return false;
              }}
            >
              <p className="ant-upload-drag-icon">
                <InboxOutlined className={styles.uploadIcon} />
              </p>
              <p className="ant-upload-text">点击或拖拽文件上传</p>
              <p className="ant-upload-hint">支持 Excel (.xlsx, .xls) 或 CSV 文件格式</p>
            </Dragger>
          </Card>

          <div className={styles.chatContainer}>
            <List
              className={styles.messageList}
              itemLayout="horizontal"
              dataSource={messages}
              renderItem={item => (
                <List.Item className={item.type === 'user' ? styles.userMessage : styles.assistantMessage}>
                  <Card className={styles.messageCard}>
                    <List.Item.Meta
                      avatar={
                        <Avatar
                          icon={item.type === 'user' ? <UserOutlined /> : <RobotOutlined />}
                          className={styles.avatar}
                          style={{ padding: '8px' }}
                        />
                      }
                      title={item.type === 'user' ? '你' : 'AI 助手'}
                      description={
                        <div style={{  whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>
                          {item.content}
                        </div>
                      }
                    />
                    {item.charts && (
                      <div className={styles.chartContainer}>
                        <ReactECharts option={item.charts} style={{ height: 300 }} />
                      </div>
                    )}
                  </Card>
                </List.Item>
              )}
            />
            <div ref={messagesEndRef} />
          </div>

          <div className={styles.inputContainer}>
            <TextArea
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="请描述您的分析需求..."
              autoSize={{ minRows: 2, maxRows: 6 }}
              className={styles.input}
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
              className={styles.sendButton}
            >
              分析
            </Button>
          </div>
        </Space>
      </Card>
    </PageContainer>
  );
};



export default AnalysisCenter;
import { PageContainer, ProCard } from '@ant-design/pro-components';
import { Card, Col, Row, Statistic, Space, Tag, Progress } from 'antd';
import React, { useEffect, useState } from 'react';
import ReactECharts from 'echarts-for-react';
import {
  LineChartOutlined,
  BarChartOutlined,
  PieChartOutlined,
  DotChartOutlined,
  UserOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  TeamOutlined,
} from '@ant-design/icons';

const HomePage: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);

  // 统计数据
  const [statisticsData] = useState({
    totalCharts: 126,
    successRate: 95,
    todayGenerated: 28,
    totalUsers: 1580,
    activeUsers: 320,
    avgGenerationTime: 2.5,
  });

  // 图表类型分布 - 用于显示图标的数据
  const chartTypes = [
    { value: 35, name: '折线图', icon: <LineChartOutlined /> },
    { value: 30, name: '柱状图', icon: <BarChartOutlined /> },
    { value: 20, name: '饼图', icon: <PieChartOutlined /> },
    { value: 15, name: '散点图', icon: <DotChartOutlined /> },
  ];
  
  // 为ECharts准备的数据，不包含React组件
  const chartTypesForEcharts = chartTypes.map(({ value, name }) => ({ value, name }));

  const chartOptions = {
    title: {
      text: '近期图表生成趋势',
      show: false,
    },
    tooltip: {
      trigger: 'axis',
      formatter: '{b}: {c} 个图表',
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true,
    },
    xAxis: {
      type: 'category',
      data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
      axisLine: {
        lineStyle: {
          color: '#d9d9d9',
        },
      },
    },
    yAxis: {
      type: 'value',
      axisLine: {
        lineStyle: {
          color: '#d9d9d9',
        },
      },
      splitLine: {
        lineStyle: {
          color: '#f0f0f0',
        },
      },
    },
    series: [
      {
        name: '生成数量',
        type: 'line',
        smooth: true,
        data: [15, 22, 18, 25, 20, 30, 28],
        areaStyle: {
          opacity: 0.1,
        },
        itemStyle: {
          color: '#1890ff',
        },
        lineStyle: {
          width: 3,
        },
      },
    ],
  };

  const pieOptions = {
    tooltip: {
      trigger: 'item',
      formatter: '{b}: {c} ({d}%)',
    },
    legend: {
      orient: 'vertical',
      left: 'left',
      textStyle: {
        color: '#666',
      },
    },
    series: [
      {
        name: '图表类型分布',
        type: 'pie',
        radius: ['40%', '70%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 10,
          borderColor: '#fff',
          borderWidth: 2,
        },
        label: {
          show: false,
          position: 'center',
        },
        emphasis: {
          label: {
            show: true,
            fontSize: '18',
            fontWeight: 'bold',
          },
        },
        labelLine: {
          show: false,
        },
        // 这里使用过滤后的数据，不包含React组件
        data: chartTypesForEcharts,
      },
    ],
  };

  useEffect(() => {
    // 模拟数据加载
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  return (
    <PageContainer>
      <Row gutter={[16, 16]}>
        <Col span={6}>
          <ProCard loading={loading} bordered>
            <Statistic
              title={
                <Space>
                  <LineChartOutlined />
                  <span>总图表数</span>
                </Space>
              }
              value={statisticsData.totalCharts}
              valueStyle={{ color: '#1890ff' }}
            />
            <Progress
              percent={75}
              size="small"
              status="active"
              showInfo={false}
              style={{ marginTop: 8 }}
            />
          </ProCard>
        </Col>
        <Col span={6}>
          <ProCard loading={loading} bordered>
            <Statistic
              title={
                <Space>
                  <CheckCircleOutlined />
                  <span>生成成功率</span>
                </Space>
              }
              value={statisticsData.successRate}
              suffix="%"
              precision={2}
              valueStyle={{ color: '#52c41a' }}
            />
            <Progress
              percent={statisticsData.successRate}
              size="small"
              status="active"
              showInfo={false}
              style={{ marginTop: 8 }}
            />
          </ProCard>
        </Col>
        <Col span={6}>
          <ProCard loading={loading} bordered>
            <Statistic
              title={
                <Space>
                  <ClockCircleOutlined />
                  <span>今日生成</span>
                </Space>
              }
              value={statisticsData.todayGenerated}
              valueStyle={{ color: '#faad14' }}
            />
            <Progress
              percent={60}
              size="small"
              status="active"
              showInfo={false}
              style={{ marginTop: 8 }}
            />
          </ProCard>
        </Col>
        <Col span={6}>
          <ProCard loading={loading} bordered>
            <Statistic
              title={
                <Space>
                  <TeamOutlined />
                  <span>总用户数</span>
                </Space>
              }
              value={statisticsData.totalUsers}
              valueStyle={{ color: '#722ed1' }}
            />
            <Progress
              percent={80}
              size="small"
              status="active"
              showInfo={false}
              style={{ marginTop: 8 }}
            />
          </ProCard>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: '16px' }}>
        <Col span={16}>
          <Card
            loading={loading}
            title="图表生成趋势"
            extra={
              <Space>
                <Tag color="blue">周环比 +12%</Tag>
                <Tag color="green">日环比 +5%</Tag>
              </Space>
            }
          >
            <ReactECharts option={chartOptions} style={{ height: '350px' }} />
          </Card>
        </Col>
        <Col span={8}>
          <Card
            loading={loading}
            title="图表类型分布"
            extra={
              <Space>
                <Tag color="blue">折线图</Tag>
                <Tag color="green">柱状图</Tag>
                <Tag color="orange">饼图</Tag>
                <Tag color="purple">散点图</Tag>
              </Space>
            }
          >
            <ReactECharts option={pieOptions} style={{ height: '350px' }} />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: '16px' }}>
        <Col span={12}>
          <Card loading={loading} title="活跃用户">
            <Space direction="vertical" style={{ width: '100%' }}>
              <Statistic
                title="当前活跃用户"
                value={statisticsData.activeUsers}
                prefix={<UserOutlined />}
              />
              <Progress
                percent={Math.round((statisticsData.activeUsers / statisticsData.totalUsers) * 100)}
                status="active"
              />
            </Space>
          </Card>
        </Col>
        <Col span={12}>
          <Card loading={loading} title="性能指标">
            <Space direction="vertical" style={{ width: '100%' }}>
              <Statistic
                title="平均生成时间"
                value={statisticsData.avgGenerationTime}
                suffix="秒"
                precision={1}
              />
              <Progress
                percent={Math.round((2.5 / 5) * 100)}
                status="active"
                format={(percent) => `${percent}% 优化空间`}
              />
            </Space>
          </Card>
        </Col>
      </Row>
    </PageContainer>
  );
};

export default HomePage;
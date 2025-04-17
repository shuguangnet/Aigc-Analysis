import { PageContainer, ProCard } from '@ant-design/pro-components';
import { Card, Col, Row, Statistic } from 'antd';
import React, { useEffect, useState } from 'react';
import ReactECharts from 'echarts-for-react';
import { useModel } from '@@/exports';

const HomePage: React.FC = () => {
  const { initialState } = useModel('@@initialState');
  const { currentUser } = initialState ?? {};
  const [loading, setLoading] = useState<boolean>(true);

  // TODO : 获取统计数据
  const [statisticsData] = useState({
    totalCharts: 126,
    successRate: 95,
    todayGenerated: 28,
    totalUsers: 1580,
  });

  const chartOptions = {
    title: {
      text: '近期图表生成趋势',
      show: false,
    },
    tooltip: {
      trigger: 'axis',
    },
    xAxis: {
      type: 'category',
      data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
    },
    yAxis: {
      type: 'value',
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
      },
    ],
  };

  const pieOptions = {
    tooltip: {
      trigger: 'item',
    },
    legend: {
      orient: 'vertical',
      left: 'left',
    },
    series: [
      {
        name: '图表类型分布',
        type: 'pie',
        radius: '50%',
        data: [
          { value: 35, name: '折线图' },
          { value: 30, name: '柱状图' },
          { value: 20, name: '饼图' },
          { value: 15, name: '散点图' },
        ],
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)',
          },
        },
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
      <Row gutter={16}>
        <Col span={6}>
          <ProCard loading={loading}>
            <Statistic title="总图表数" value={statisticsData.totalCharts} />
          </ProCard>
        </Col>
        <Col span={6}>
          <ProCard loading={loading}>
            <Statistic
              title="生成成功率"
              value={statisticsData.successRate}
              suffix="%"
              precision={2}
            />
          </ProCard>
        </Col>
        <Col span={6}>
          <ProCard loading={loading}>
            <Statistic title="今日生成" value={statisticsData.todayGenerated} />
          </ProCard>
        </Col>
        <Col span={6}>
          <ProCard loading={loading}>
            <Statistic title="总用户数" value={statisticsData.totalUsers} />
          </ProCard>
        </Col>
      </Row>

      <Row gutter={16} style={{ marginTop: '16px' }}>
        <Col span={16}>
          <Card loading={loading} title="图表生成趋势">
            <ReactECharts option={chartOptions} style={{ height: '350px' }} />
          </Card>
        </Col>
        <Col span={8}>
          <Card loading={loading} title="图表类型分布">
            <ReactECharts option={pieOptions} style={{ height: '350px' }} />
          </Card>
        </Col>
      </Row>
    </PageContainer>
  );
};

export default HomePage;
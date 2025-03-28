import { listChartByPageUsingPost } from '@/services/hebi/chartController';
import { useModel } from '@@/exports';
import { Avatar, Card, Input, List, message, Result } from 'antd';
import ReactECharts from 'echarts-for-react';
import React, { useEffect, useState } from 'react';
const { Search } = Input;

/**
 * 添加图表页面
 * @constructor
 */
const MyChartPage: React.FC = () => {
  const initSearchParams = {
    current: 1,
    pageSize: 6,
    sortField:'createTime',
    sortOrder:'desc',
  };

  const [searchParams, setSearchParams] = useState<API.ChartQueryRequest>({
    ...initSearchParams,
  });
  //获取用户头像可以从初始化状态中获取
  const { initialState } = useModel('@@initialState');
  const { currentUser } = initialState ?? {};
  const [chartList, setChartList] = useState<API.Chart[]>();
  const [total, setTotal] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await listChartByPageUsingPost(searchParams);
      if (res.data) {
        setChartList(res.data.records ?? []);
        setTotal(res.data.total ?? 0);
        // 隐藏图标的tittle
        if (res.data.records) {
          res.data.records.forEach((data) => {
            if(data.status==="succeed"){
              const chartOption = JSON.parse(data.genChart ?? '{}');
              chartOption.title = undefined;
              data.genChart = JSON.stringify(chartOption);
            }
          });
        }
      } else {
        message.error('获取我的图表失败');
      }
    } catch (e: any) {
      message.error('获取我的图表失败' + e.message);
    }
    setLoading(false);
  };

  // 钩子函数
  useEffect(() => {
    loadData();
  }, [searchParams]);

  return (
    <div className="my-chart-page">
      <div>
        <Search
          placeholder="请输入图表名称"
          loading={loading}
          enterButton
          onSearch={(value) => {
            setSearchParams({
              ...initSearchParams,
              name: value,
            });
          }}
        />
      </div>
      <div className="margin-16"></div>
      <List
        itemLayout="vertical"
        grid={{
          gutter: 16,
          xs: 1,
          sm: 1,
          md: 1,
          lg: 2,
          xl: 2,
          xxl: 2,
        }}
        pagination={{
          onChange: (page, pageSize) => {
            setSearchParams({
              ...searchParams,
              current: page,
              pageSize,
            });
          },
          current: searchParams.current,
          pageSize: searchParams.pageSize,
          total: total,
        }}
        loading={loading}
        dataSource={chartList}
        renderItem={(item) => (
          <List.Item key={item.id}>
            <Card style={{ width: '100%' }}>
              <List.Item.Meta
                // 若第一个操作数为 false 或者可以转换为 false 的值（如 null、undefined、0、''、NaN 等），则整个表达式的结果就是这个操作数，并且不会再计算第二个操作数。
                // 若第一个操作数为 true 或者可以转换为 true 的值，那么整个表达式的结果取决于第二个操作数，也就是会返回第二个操作数的值。
                avatar={<Avatar src={currentUser && currentUser.userAvatar} />}
                title={item.name}
                description={item.chartType ? '图表类型：' + item.chartType : undefined}
              />

              <>
                {item.status === 'wait' && (
                  <>
                    <Result
                      status="warning"
                      title="图表待生成"
                      subTitle={item.execMessage ?? '当前图表生成队列繁忙，请耐心你等候'}
                    ></Result>
                  </>
                )}
                {item.status === 'running' && (
                  <>
                    <Result status="info" title="图表生成中" subTitle={item.execMessage}></Result>
                  </>
                )}
                {item.status === 'succeed' && (
                  <>
                    {'分析目标：' + item.goal}
                    <ReactECharts option={JSON.parse(item.genChart ?? '{}')} />
                  </>
                )}
                {item.status === 'failed' && (
                  <>
                    <Result
                      status="error"
                      title="图表生成失败"
                      subTitle={item.execMessage}
                    ></Result>
                  </>
                )}
              </>

            </Card>
          </List.Item>
        )}
      />
      总数：
      {total}
    </div>
  );
};
export default MyChartPage;

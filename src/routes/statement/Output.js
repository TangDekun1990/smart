import React, { Component } from 'react';
import { connect } from 'dva';
import {
  Row,
  Col,
  Icon,
  Card,
  Tabs,
  Table,
  Radio,
  DatePicker,
  Tooltip,
  Menu,
  Dropdown,
  message
} from 'antd';
import numeral from 'numeral';
import {
  ChartCard,
  yuan,
  MiniArea,
  MiniBar,
  MiniProgress,
  Field,
  Bar,
  Pie,
  TimelineChart,
} from '../../components/Charts';
import Trend from '../../components/Trend';
import NumberInfo from '../../components/NumberInfo';
import { getTimeDistance } from '../../utils/utils';
import { routerRedux, Link } from 'dva/router';

import styles from './Analysis.less';
import argument from '../../utils/argument';
import URL from '../../utils/api';
import time from '../../utils/time';
const moment = require('moment');

const { TabPane } = Tabs;
const { RangePicker } = DatePicker;

const rankingListData = [];
for (let i = 1; i < 13; i += 1) {
  rankingListData.push({
    title: `${i} 月份`,
    total: 323234,
  });
}


@connect(({ chart, loading }) => ({
  chart,
  loading: loading.effects['chart/fetch'],
}))
export default class Output extends Component {
  state = {
    salesType: 'all',
    currentTabKey: '',
    rangePickerValue: getTimeDistance('today'), // 修改默认时间
    salesData: [],
    salesData1: [],
    totalNumber: '',
    listName: '',
  };

  componentDidMount() {

    if(localStorage.getItem('loginId') === '') {
      const { dispatch } = this.props;
      message.error('您还未登录,请重新登录!');
      setTimeout(function() {
        dispatch(routerRedux.push('/user/login'));
      }, 500)
      return;
    }


    this.props.dispatch({
      type: 'chart/fetch',
    });

    const that = this;
    const formData = new FormData();
    formData.append('version', argument.version);
    formData.append('tenantId', argument.tenantId);
    formData.append('tokenId', argument.tokenId);
    formData.append('active', 1);
    formData.append('type', 'all');
    formData.append('startDate', time.today);
    formData.append('endDate', time.today);
    formData.append('dateFormat', 'hour');
    fetch( URL + '/machine/getYieldStatistics/v1', {
        method: 'post',
        mode: 'cors',
        body: formData
    }).then(function(res) {
        if (res.ok) {
            res.json().then(function (data) {
              if (data.code === "0") {
                  that.setState({
                     //salesData: data.data.orderList, // 测试数据
                     //totalNumber: data.data.totalNumber,  // 测试数据
                     salesData: JSON.parse(data.data).yieldStatisticsKeyOrderList,
                     salesData1: JSON.parse(data.data).yieldStatisticsValueOrderList,
                     totalNumber: JSON.parse(data.data).totalYield,
                     listName: '今日',
                  });
              } else {
                 message.error(data.msg);
              }
            });
        } else if (res.status === 401) {
            console.log("Oops! You are not authorized.");
        }
    }).then(error=>{
        //console.log(JSON.stringify(error));
    });

  }

  // 所有时间的数据
  allData = (type) => {
    const that = this;
    const formData = new FormData();
    formData.append('version', argument.version);
    formData.append('tenantId', argument.tenantId);
    formData.append('tokenId', argument.tokenId);
    formData.append('active', 1);
    formData.append('type', 'all');
    if(type === 'yesterday') {
      formData.append('dateFormat', 'hour');
      formData.append('startDate', time.yesterday);
      formData.append('endDate', time.yesterday);
      this.setState({
        listName: '昨日'
      });
    } else if (type === 'today') {
      formData.append('dateFormat', 'hour');
      formData.append('startDate', time.today);
      formData.append('endDate', time.today);
      this.setState({
        listName: '今日'
      });
    } else if (type === 'year') {
      formData.append('dateFormat', 'month');
      formData.append('startDate', time.yearStart);
      formData.append('endDate', time.yearEnd);
      this.setState({
        listName: '全年'
      });
    } else if (type === 'week') {
      formData.append('dateFormat', 'day');
      formData.append('startDate', time.weekStart);
      formData.append('endDate', time.weekEnd);
      this.setState({
        listName: '本周'
      });
    } else {
      formData.append('dateFormat', 'day');
      formData.append('startDate', time.monthStart);
      formData.append('endDate', time.monthEnd);
      this.setState({
        listName: '本月'
      });
    }
    fetch(URL + '/machine/getYieldStatistics/v1', {
        method: 'post',
        mode: 'cors',
        body: formData
    }).then(function(res) {
        if (res.ok) {
            res.json().then(function (data) {
              if (data.code === "0") {
                  that.setState({
                    salesData: JSON.parse(data.data).yieldStatisticsKeyOrderList,
                    salesData1: JSON.parse(data.data).yieldStatisticsValueOrderList,
                    totalNumber: JSON.parse(data.data).totalYield,
                  });
              } else {
                 message.error(data.msg);
              }
            });
        } else if (res.status === 401) {
            console.log("Oops! You are not authorized.");
        }
    }).then(error=>{
        //console.log(JSON.stringify(error));
    });
  }



  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'chart/clear',
    });
  }

  handleChangeSalesType = (e) => {
    this.setState({
      salesType: e.target.value,
    });
  };

  handleTabChange = (key) => {
    this.setState({
      currentTabKey: key,
    });
  };

  // 选择时间框查询
  handleRangePickerChange = (rangePickerValue, dateString) => {
    const startDay = dateString[0];
    const endDay = dateString[1];
    //间隔天数
    const startTime = new Date(Date.parse(startDay.replace(/-/g,"/"))).getTime();
    const endTime = new Date(Date.parse(endDay.replace(/-/g,"/"))).getTime();
    const Day = Math.abs((startTime - endTime)) / (1000 * 60 * 60 * 24);
    if(Day > 31) {
      message.error("您选择时间间隔过大,请重新选择!");
      return;
    }

    this.setState({
      rangePickerValue,
    });

    const that = this;
    const formData = new FormData();
    formData.append('version', argument.version);
    formData.append('tenantId', argument.tenantId);
    formData.append('tokenId', argument.tokenId);
    formData.append('active', 1);
    formData.append('type', 'all');

    if(Day) {
      formData.append('dateFormat', 'day');
      formData.append('startDate', dateString[0]);
      formData.append('endDate', dateString[1]);
      this.setState({
        listName: '日'
      });
    }
    if(dateString[0].substring(5, 7) === dateString[1].substring(5, 7)&&dateString[0].substring(8, 10) !== dateString[1].substring(8, 10)) {
      formData.append('dateFormat', 'day');
      formData.append('startDate', dateString[0]);
      formData.append('endDate', dateString[1]);
      this.setState({
        listName: '日'
      });
    } else {
      formData.append('dateFormat', 'hour');
      formData.append('startDate', dateString[0]);
      formData.append('endDate', dateString[1]);
      this.setState({
        listName: '日'
      });
    }
    fetch(URL + '/machine/getYieldStatistics/v1', {
        method: 'post',
        mode: 'cors',
        body: formData
    }).then(function(res) {
        if (res.ok) {
            res.json().then(function (data) {
              if (data.code === "0") {
                  that.setState({
                    salesData: JSON.parse(data.data).yieldStatisticsKeyOrderList,
                    salesData1: JSON.parse(data.data).yieldStatisticsValueOrderList,
                    totalNumber: JSON.parse(data.data).totalYield,
                  });
              } else {
                 message.error(data.msg);
              }
            });
        } else if (res.status === 401) {
            console.log("Oops! You are not authorized.");
        }
    }).then(error=>{
        //console.log(JSON.stringify(error));
    });

    // this.props.dispatch({
    //   type: 'chart/fetchSalesData',
    // });
  };

  // 选择不同时间
  selectDate = (type) => {
    this.setState({
      rangePickerValue: getTimeDistance(type),
    });

    // this.props.dispatch({
    //   type: 'chart/fetchSalesData',
    // });
    {this.allData(type)}   // 拿到所有数据的方法
  };



  isActive(type) {
    const { rangePickerValue } = this.state;
    const value = getTimeDistance(type);
    if (!rangePickerValue[0] || !rangePickerValue[1]) {
      return;
    }
    if (
      rangePickerValue[0].isSame(value[0], 'day') &&
      rangePickerValue[1].isSame(value[1], 'day')
    ) {
      return styles.currentDate;
    }
  }

  render() {
    const { rangePickerValue, salesType, currentTabKey, salesData, salesData1 } = this.state;
    const { chart, loading } = this.props;
    const {
      visitData,
      visitData2,
      searchData,
      offlineData,
      offlineChartData,
      salesTypeData,
      salesTypeDataOnline,
      salesTypeDataOffline,
    } = chart;
    const salesPieData =
      salesType === 'all'
        ? salesTypeData
        : salesType === 'online' ? salesTypeDataOnline : salesTypeDataOffline;

    const menu = (
      <Menu>
        <Menu.Item>操作一</Menu.Item>
        <Menu.Item>操作二</Menu.Item>
      </Menu>
    );

    const iconGroup = (
      <span className={styles.iconGroup}>
        <Dropdown overlay={menu} placement="bottomRight">
          <Icon type="ellipsis" />
        </Dropdown>
      </span>
    );

    // 限制选择框的时间范围
    function disabledDate(current) {
      return current && current > moment().endOf('day');
    }



    const salesExtra = (
      <div className={styles.salesExtraWrap}>
        <div className={styles.salesExtra}>
          <a className={this.isActive('yesterday')} onClick={() => this.selectDate('yesterday')}>
            昨日
          </a>
          <a className={this.isActive('today')} onClick={() => this.selectDate('today')}>
            今日
          </a>
          <a className={this.isActive('week')} onClick={() => this.selectDate('week')}>
            本周
          </a>
          <a className={this.isActive('month')} onClick={() => this.selectDate('month')}>
            本月
          </a>
          <a className={this.isActive('year')} onClick={() => this.selectDate('year')}>
            全年
          </a>
        </div>
        <RangePicker
          value={rangePickerValue}
          onChange={this.handleRangePickerChange}
          style={{ width: 256 }}
          disabledDate={disabledDate}
          allowClear={false}
          //disabledTime={disabledRangeTime}
        />
      </div>
    );

    const columns = [
      {
        title: '排名',
        dataIndex: 'index',
        key: 'index',
      },
      {
        title: '搜索关键词',
        dataIndex: 'keyword',
        key: 'keyword',
        render: text => <a href="/">{text}</a>,
      },
      {
        title: '用户数',
        dataIndex: 'count',
        key: 'count',
        sorter: (a, b) => a.count - b.count,
        className: styles.alignRight,
      },
      {
        title: '周涨幅',
        dataIndex: 'range',
        key: 'range',
        sorter: (a, b) => a.range - b.range,
        render: (text, record) => (
          <Trend flag={record.status === 1 ? 'down' : 'up'}>
            <span style={{ marginRight: 4 }}>{text}%</span>
          </Trend>
        ),
        align: 'right',
      },
    ];

    const activeKey = currentTabKey || (offlineData[0] && offlineData[0].name);

    const CustomTab = ({ data, currentTabKey: currentKey }) => (
      <Row gutter={8} style={{ width: 138, margin: '8px 0' }}>
        <Col span={12}>
          <NumberInfo
            title={data.name}
            subTitle="转化率"
            gap={2}
            total={`${data.cvr * 100}%`}
            theme={currentKey !== data.name && 'light'}
          />
        </Col>
        <Col span={12} style={{ paddingTop: 36 }}>
          <Pie
            animate={false}
            color={currentKey !== data.name && '#BDE4FF'}
            inner={0.55}
            tooltip={false}
            margin={[0, 0, 0, 0]}
            percent={data.cvr * 100}
            height={64}
          />
        </Col>
      </Row>
    );

    const topColResponsiveProps = {
      xs: 24,
      sm: 12,
      md: 12,
      lg: 12,
      xl: 6,
      style: { marginBottom: 24 },
    };
    return (
        <div>
          <Card loading={loading} bordered={false} bodyStyle={{ padding: 0 }}>
            <div className={styles.salesCard}>
              <Tabs tabBarExtraContent={salesExtra} size="large" tabBarStyle={{ marginBottom: 24 }}>
                <TabPane tab="车间所有机器产量总和"  key="sales">
                  <div className={styles.totalNumber}>总产量：{this.state.totalNumber}双</div>
                  <Row>
                    <Col xl={18} lg={16} md={12} sm={24} xs={24} style={{ marginTop: '10%'}}>
                      <div className={styles.salesBar}>
                        <Bar height={295}  data={salesData} />
                      </div>
                    </Col>
                    <Col xl={6} lg={8} md={12} sm={24} xs={24} style={{padding:0}}>
                      <div className={styles.salesRank}>
                        <h4 className={styles.rankingTitle}>{this.state.listName}产量排名</h4>
                        <ul className={styles.rankingList} style={{width:'90%'}}>
                          {salesData1.map((item, i) => (
                            <li key={item.x}>
                              <span className={i < 3 ? styles.active : ''}>{i + 1}</span>
                              <span>{item.x}</span>
                              <span>{item.y}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </Col>
                  </Row>
                </TabPane>
              </Tabs>
            </div>
          </Card>
        </div>

    );
  }
}

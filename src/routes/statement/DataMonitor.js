import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import numeral from 'numeral';
import Authorized from '../../utils/Authorized';
import NumberInfo from '../../components/NumberInfo';
import CountDown from '../../components/CountDown';
import ActiveChart from '../../components/ActiveChart';
import {
  Icon,
  Tabs,
  Table,
  Radio,
  DatePicker,
  Menu,
  Dropdown,
   Row, Col, Card, Tooltip, Input, Button, message, Pagination
} from 'antd';
import {
  ChartCard,
  yuan,
  MiniArea,
  MiniBar,
  MiniProgress,
  Field,
  Bar,
  TimelineChart,
  Pie, WaterWave, Gauge, TagCloud
} from '../../components/Charts';
import Trend from '../../components/Trend';
const { TabPane } = Tabs;
import { getTimeDistance } from '../../utils/utils';

import URL from '../../utils/api.js';
import argument from '../../utils/argument';

import styles from './Monitor.less';
import styles1 from './Analysis.less';

const { Secured } = Authorized;
const targetTime = new Date().getTime() + 3900000;
const moment = require('moment');
//const a = [];
// use permission as a parameter
const havePermissionAsync = new Promise((resolve) => {
  // Call resolve on behalf of passed
  setTimeout(() => resolve(), 1000);
});
@Secured(havePermissionAsync)
@connect(({ monitor, loading }) => ({
  monitor,
  loading: loading.models.monitor,
}))

@connect(({ chart, loading }) => ({
  chart,
  //loading: loading.effects['chart/fetch'],
}))

export default class DataMonitor extends PureComponent {

  state = {
    salesType: 'all',
    currentTabKey: '',
    rangePickerValue: getTimeDistance('year'),
    percent: [],  // 完成度百分比
    arr: [], // 百分比
    name: [],  // 订单名
    number: [],  // 订单编号
    totalNumber: [],  // 订单总量
    finishNumber: [],
    offlineData: [],  // 花样名,花样进度百分比
    offlineChartData: [],
    finishTime: [],  // 预计完成时间
    deliveryTime: [], // 交货时间
    dataCount: '',
    text: [],
  };


  componentWillMount() {
    if(localStorage.getItem('loginId') === '') {
      const { dispatch } = this.props;
      message.error('您还未登录,请重新登录!');
      setTimeout(function() {
        dispatch(routerRedux.push('/user/login'));
      }, 500)
      return;
    }

    const that = this;
    this.timerID = setTimeout(
       () => {location.reload()},
       30000
    );
    const formData = new FormData();
    formData.append('version', argument.version);
    formData.append('tenantId', argument.version);
    formData.append('tokenId', argument.version);
    formData.append('active', 1);
    formData.append('rowSize', 6);
    formData.append('currentPage', 1);
    fetch( URL + '/order/getOrderRateOfProgress/v1', {
        method: 'post',
        mode: 'cors',
        body: formData
    }).then(function(res) {
        if (res.ok) {
            res.json().then(function (data) {
              if (data.code === "0") {
                 const dataArr = JSON.parse(data.data).orderList;
                 const name = [];  // 订单名
                 const number = [];  // 订单编号
                 const totalNumber = [];  // 订单总量
                 const finishNumber = [];  //已完成
                 const designArr = [];
                 const finishTime = [];  // 预计完成时间
                 const deliveryTime = [];  // 交货时间
                 const timeXJ = [];  // 确定预计和完成时间的差值
                 const timeVal = [];
                 const word = [];  // 文字描述
                 const a = [];
                 for(var i = 0; i < dataArr.length; i ++) {
                   a.push(dataArr[i].orderFinishRate);
                   name.push(dataArr[i].name);
                   number.push(dataArr[i].number);
                   totalNumber.push(dataArr[i].totalNumber);
                   finishNumber.push(dataArr[i].orderFinishNumber);
                   deliveryTime.push(dataArr[i].deliveryTime);

                   const startDay = dataArr[i].deliveryTime;
                   const endDay = dataArr[i].orderExpectFinishTime;

                   //间隔天数
                   if( endDay === '未知日期') {
                     finishTime.push(<span>未知日期</span>);
                     word.push(<span>暂未生产,无法预测</span>);
                   }
                   const startTime = new Date(Date.parse(startDay.replace(/-/g,"/"))).getTime();
                   const endTime = new Date(Date.parse(endDay.replace(/-/g,"/"))).getTime();
                   const today = new Date(Date.parse(moment().format('YYYY-MM-D').replace(/-/g,"/"))).getTime();
                   timeXJ.push((startTime - endTime) / (1000 * 60 * 60 * 24)); // 交货减预计完成日期
                   timeVal.push((today - startTime) / (1000 * 60 * 60 * 24));  // 今天减交货日期
                   if (timeVal[i] > 0) {
                     finishTime.push(<span style={{color: 'red'}}>{dataArr[i].orderExpectFinishTime}</span>);
                     word.push(<span style={{color: 'red'}}>已经超期</span>);
                   }
                   if (timeXJ[i] !== NaN && timeXJ[i] >= 7) {
                     finishTime.push(<span style={{color: 'green'}}>{dataArr[i].orderExpectFinishTime}</span>);
                     word.push(<span style={{color: 'green'}}>预计按时完成</span>);
                   }
                   else if (timeXJ[i] !== NaN && timeXJ[i] < 7 && timeXJ[i] >= 0) {
                     finishTime.push(<span style={{color: 'orange'}}>{dataArr[i].orderExpectFinishTime}</span>);
                      word.push(<span style={{color: 'orange'}}>有超期风险</span>);
                   }
                   else if (timeXJ[i] !== NaN && timeXJ[i] < 0) {
                     finishTime.push(<span style={{color: 'red'}}>{dataArr[i].orderExpectFinishTime}</span>);
                     word.push(<span style={{color: 'red'}}>预计超期</span>);
                   }
                 }

                 // 存处理好的数据
                 that.setState({
                   percent: a,
                   name: name,  // 订单名
                   number: number,  // 订单编号
                   totalNumber: totalNumber,  // 订单总量
                   finishNumber: finishNumber, // 完成的数量
                   finishTime: finishTime,  // 预计完成时间
                   deliveryTime: deliveryTime, // 交货时间
                   text: word,
                   dataCount: JSON.parse(data.data).dataCount
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

  //  清定时器
  componentWillUnmount() {
     clearInterval(this.timerID);
  }






  // 点击翻页
  changePage = (page, pageSize) => {
    const that = this;
    const formData = new FormData();
    formData.append('tokenId', argument.tokenId);
    formData.append('tenantId', argument.tokenId);
    formData.append('version', argument.tokenId);
    formData.append('active', 1);
    formData.append('rowSize', 3);
    formData.append('currentPage', page);
    fetch(URL + '/order/getOrderRateOfProgress/v1', {
        method: 'post',
        mode: 'cors',
        body: formData
    }).then(function(res) {
        if (res.ok) {
            res.json().then(function (data) {
                if (data.code === '0') {
                  const dataArr = JSON.parse(data.data).orderList;
                  const name = [];  // 订单名
                  const number = [];  // 订单编号
                  const totalNumber = [];  // 订单总量
                  const finishNumber = [];  //已完成
                  const designArr = [];
                  const finishTime = [];  // 预计完成时间
                  const deliveryTime = [];  // 交货时间
                  const timeXJ = [];  // 确定预计和完成时间的差值
                  const timeVal = [];
                  const word = [];  // 文字描述
                  const a = [];
                  for(var i = 0; i < dataArr.length; i ++) {
                    a.push(dataArr[i].orderFinishRate);
                    name.push(dataArr[i].name);
                    number.push(dataArr[i].number);
                    totalNumber.push(dataArr[i].totalNumber);
                    finishNumber.push(dataArr[i].orderFinishNumber);
                    deliveryTime.push(dataArr[i].deliveryTime);
                    const startDay = dataArr[i].deliveryTime;
                    const endDay = dataArr[i].orderExpectFinishTime;
                    //间隔天数
                    if(startDay === null) {
                      // finishTime.push(<span>未知日期</span>);
                      // word.push(<span>未知日期</span>);
                    } else {
                      const startTime = new Date(Date.parse(startDay.replace(/-/g,"/"))).getTime();
                      const endTime = new Date(Date.parse(endDay.replace(/-/g,"/"))).getTime();
                      const today = new Date(Date.parse(moment().format('YYYY-MM-D').replace(/-/g,"/"))).getTime();
                      timeXJ.push((startTime - endTime) / (1000 * 60 * 60 * 24)); // 交货减预计完成日期
                      timeVal.push((today - startTime) / (1000 * 60 * 60 * 24));  // 今天减交货日期
                      if (timeVal[i] > 0) {
                        finishTime.push(<span style={{color: 'red'}}>{dataArr[i].orderExpectFinishTime}</span>);
                        word.push(<span style={{color: 'red'}}>已经超期</span>);
                      }
                      if (timeXJ[i] !== NaN && timeXJ[i] >= 7) {
                        finishTime.push(<span style={{color: 'green'}}>{dataArr[i].orderExpectFinishTime}</span>);
                        word.push(<span style={{color: 'green'}}>预计按时完成</span>);
                      }
                      else if (timeXJ[i] !== NaN && timeXJ[i] < 7 && timeXJ[i] >= 0) {
                        finishTime.push(<span style={{color: 'orange'}}>{dataArr[i].orderExpectFinishTime}</span>);
                        word.push(<span style={{color: 'orange'}}>有超期风险</span>);
                      }
                      else if (timeXJ[i] !== NaN && timeXJ[i] < 0) {
                        finishTime.push(<span style={{color: 'red'}}>{dataArr[i].orderExpectFinishTime}</span>);
                        word.push(<span style={{color: 'red'}}>预计超期</span>);
                      }
                    }
                  }

                  // 存处理好的数据
                  that.setState({
                    percent: a,
                    name: name,  // 订单名
                    number: number,  // 订单编号
                    totalNumber: totalNumber,  // 订单总量
                    finishNumber: finishNumber, // 完成的数量
                    finishTime: finishTime,  // 预计完成时间
                    deliveryTime: deliveryTime, // 交货时间
                    text: word,
                    dataCount: JSON.parse(data.data).dataCount
                  });
                } else {
                  message.error(data.msg);
                }
            });
        } else if (res.status === 401) {
            console.log("Oops! You are not authorized.");
        }
    }).then(error=>{
        // console.log(JSON.stringify(error));
    });
  }


  handleTabChange = (key) => {
    this.setState({
      currentTabKey: key,
    });
  };

  handleChangeSalesType = (e) => {
    this.setState({
      salesType: e.target.value,
    });
  };

  handleRangePickerChange = (rangePickerValue) => {
    this.setState({
      rangePickerValue,
    });

    this.props.dispatch({
      type: 'chart/fetchSalesData',
    });
  };

  selectDate = (type) => {
    this.setState({
      rangePickerValue: getTimeDistance(type),
    });

    this.props.dispatch({
      type: 'chart/fetchSalesData',
    });
  };

  content() {
    const data = this.state.percent;
    const items = [];
    if(data === null) {
    } else {
      for (var i = 0; i < data.length; i++) {
          items.push(
            <Col xl={6} lg={12} sm={24} xs={24} style={{ marginBottom: 24, marginLeft:'6.7%'}}>
              <Card title={this.state.name[i]} bodyStyle={{ textAlign: 'center', fontSize: 0 }} bordered={false}>
                 { data.length > 0 &&
                   <WaterWave
                     height={161}
                     title="完成率"
                     percent={data[i]}
                   />
                 }
              </Card>
              <div className={styles.textHeader}>
                <div className={styles.textWrap}>
                  <span className={styles.textWord}>订单编号：</span>
                  <span className={styles.textResult}>{this.state.number[i]}</span>
                </div>
                <div className={styles.textWrap}>
                  <span className={styles.textWord}>订单总量(双)：</span>
                  <span className={styles.textResult}>{this.state.totalNumber[i]}</span>
                </div>
                <div className={styles.textWrap}>
                  <span className={styles.textWord}>完成数量(双)：</span>
                  <span className={styles.textResult}>{this.state.finishNumber[i]}</span>
                </div>
                <div className={styles.textWrap}>
                  <span className={styles.textWord}>交货日期：</span>
                  <span className={styles.textResult}>{this.state.deliveryTime[i]}</span>
                </div>
                <div className={styles.textWrap}>
                  <span className={styles.textWord}>预计完成日期：</span>
                  <span className={styles.textResult}>{this.state.finishTime[i]}</span>
                </div>
                <div className={styles.textWrap}>
                  <span className={styles.textCenter}>{this.state.text[i]}</span>
                </div>
              </div>
            </Col>
          )
      }
      return(
        <Row gutter={24}>
            {items}
        </Row>
      )
    }
  }

  renderForm() {
    return this.content();
  }

  render() {
    const { monitor, dispatch } = this.props;
    const { tags } = monitor;
    const { rangePickerValue, salesType, currentTabKey, percent } = this.state;
    const { offlineData, offlineChartData } = this.state;
    const check = () => {
      dispatch(routerRedux.push('/report/details'));
    }
    const activeKey = currentTabKey || (offlineData[0] && offlineData[0].name);
    const CustomTab = ({ data, currentTabKey: currentKey }) => (
      <Row gutter={8} style={{ width: 138, margin: '8px 0' }}>
        <Col span={12}>
          <NumberInfo
            title={data.name}
            subTitle="完成度"
            gap={2}
            total={data.cvr}
            theme={currentKey !== data.name && 'light'}
          />
        </Col>
      </Row>
    );

    return (
      <div className={styles.content}>
        <div style={{marginBottom: '15px', height: '32px'}}>
           该页面30秒刷新一次
           <Button style={{float: 'right'}} onClick={ check }>查看列表</Button>
        </div>
        {/* <div className={styles.leftBtn} onClick={this.changePage}></div> */}
        {this.renderForm()}
        {/* <div className={styles.rightBtn}></div>*/}
        {/*
          <div className={styles.changePage}>
             <Pagination size="small" total={parseInt(this.state.dataCount)} onChange={this.changePage} showQuickJumper />
          </div>
           */}
      </div>
    );
  }
}

import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import {
  Form, Input, DatePicker, Select, Button, Card, InputNumber, Breadcrumb, Radio, Icon, Tooltip, Calendar, Table,
message, Pagination, Popconfirm} from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import { routerRedux } from 'dva/router';
import styles from './style.less';
import URL from '../../utils/api.js';
import argument from '../../utils/argument';

const FormItem = Form.Item;
const { Option } = Select;
const { RangePicker } = DatePicker;
const { TextArea } = Input;


@connect(({ loading }) => ({
  submitting: loading.effects['form/submitRegularForm'],
}))
@Form.create()

export default class BasicForms extends PureComponent {
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        this.props.dispatch({
          type: 'form/submitRegularForm',
          payload: values,
        });
      }
    });
  }

  state = {
    statusList: [],
    customerList: [],
    listShow: [],
    listShow1: [],
    disabled: true,
    dataCount: '',
    status:[],
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

    const that = this;
    this.timerID = setTimeout(
       () => {that.componentDidMount()},
       10000
    );


    const formData = new FormData();
    formData.append('tokenId', argument.tokenId);
    formData.append('tenantId', argument.tenantId);
    formData.append('version', argument.version);
    formData.append('active', 1);
    formData.append('id', sessionStorage.getItem('dataId'));
    fetch(URL + '/productionInstruction/getProductionInstructionById/v1', {
      method: 'post',
      mode: 'cors',
      body: formData
    }).then(function(res) {
      if (res.ok) {
        res.json().then(function (data) {
          if (data.code === "0") {
            const arr = [];
            const statusCode = [];   // 返回的状态信息
            const statusData = JSON.parse(data.data).designTaskList;
            arr.push(JSON.parse(data.data).productionInstruction);
            for (var i = 0; i < statusData.length; i++)  {
              statusCode.push(statusData[i].taskStatusId);
            }
            that.setState({
              listShow: arr,
              status: statusCode,
              listShow1: JSON.parse(data.data).designTaskList,
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

  // 定时器

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
    formData.append('rowSize', pageSize);
    formData.append('currentPage', page);
    formData.append('id', sessionStorage.getItem('dataId'));
    fetch(URL + '/productionInstruction/getProductionInstructionById/v1', {
        method: 'post',
        mode: 'cors',
        body: formData
    }).then(function(res) {
        if (res.ok) {
            res.json().then(function (data) {
                if (data.code === '0') {
                    that.setState({
                      listShow1: JSON.parse(data.data).designTaskList,
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

  // 状态取消事件
  cancel = (record) => {
    const that = this;
    const formData = new FormData();
    formData.append('tokenId', argument.tokenId);
    formData.append('tenantId', argument.tokenId);
    formData.append('version', argument.tokenId);
    formData.append('active', 1);
    formData.append('taskId', record.taskId);
    fetch(URL + '/productionInstruction/cancelDesignTaskByTaskId/v1', {
        method: 'post',
        mode: 'cors',
        body: formData
    }).then(function(res) {
        if (res.ok) {
            res.json().then(function (data) {
                if (data.code === '0') {
                  {that.componentDidMount()}
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

  // 状态重发事件
  resend = (record) => {
    const that = this;
    const formData = new FormData();
    formData.append('tokenId', argument.tokenId);
    formData.append('tenantId', argument.tokenId);
    formData.append('version', argument.tokenId);
    formData.append('active', 1);
    formData.append('taskId', record.taskId);
    fetch(URL + '/productionInstruction/resendDesignTaskByTaskId/v1', {
        method: 'post',
        mode: 'cors',
        body: formData
    }).then(function(res) {
        if (res.ok) {
            res.json().then(function (data) {
                if (data.code === '0') {
                   {that.componentDidMount()}
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

  render() {
    const { submitting } = this.props;
    const { getFieldDecorator, getFieldValue } = this.props.form;
    const { dispatch } = this.props;
    const goBack = () => {
      dispatch(routerRedux.push('/ProductionControl/list'));
    };
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 7 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 12 },
        md: { span: 10 },
      },
    };

    const submitFormLayout = {
      wrapperCol: {
        xs: { span: 24, offset: 0 },
        sm: { span: 10, offset: 7 },
      },
    };

    const columns = [{
      title: '订单编号',
      dataIndex: 'orderNumber',
      align: 'center',
    }, {
      title: '订单名称',
      dataIndex: 'orderName',
      align: 'center',
    }, {
      title: '花样名',
      dataIndex: 'designName',
      align: 'center',
    }, {
      title: '服务器中的花样号',
      dataIndex: 'designNumber',
      align: 'center',
    }, {
      title: '预计完成时间',
      dataIndex: 'expectedFinishedTime',
      align: 'center',
    }, {
      title: '状态',
      dataIndex: 'sendOrderStatusName',
      align: 'center',
    }];

    const columns1 = [{
      title: '机器名',
      dataIndex: 'machineName',
      align: 'center',
    }, {
      title: '创建时间',
      dataIndex: 'createTime',
      align: 'center',
    }, {
      title: '执行时间',
      dataIndex: 'costTime',
      align: 'center',
    }, {
      title: '状态',
      dataIndex: 'taskStatusName',
      align: 'center',
    }, {
      title: '操作',
      dataIndex: '',
      align: 'center',
      render: (record) => {
          if(record.taskStatusId ==='1') {
            return <Popconfirm title="确定取消该任务吗？" okText="是" cancelText="否" onConfirm={() => this.cancel(record)}>
                      <a>取消</a>
                   </Popconfirm>
          }
          if(record.taskStatusId ==='2') {
            return <span>取消</span>;
          }
          if(record.taskStatusId ==='3') {
            return <a onClick={() => this.resend(record)}>重发</a>
          }
          if(record.taskStatusId ==='4') {
            return <span>取消</span>;
          }
          if(record.taskStatusId ==='5') {
            return <a onClick={() => this.resend(record)}>重发</a>
          }
          if(record.taskStatusId ==='6') {
            return <a onClick={() => this.resend(record)}>重发</a>
          }
          if(record.taskStatusId ==='7') {
            return <span>取消</span>;
          }
          if(record.taskStatusId ==='8') {
            return <a onClick={() => this.resend(record)}>重发</a>
          }
      },
    }];






    const children = [];
    for (let i = 10; i < 36; i++) {
      children.push(<Option key={i.toString(36) + i}>{i.toString(36) + i}</Option>);
    }
    return (
      <PageHeaderLayout>
        <Breadcrumb className={styles.bread}>
          <Breadcrumb.Item >&nbsp;</Breadcrumb.Item>
          <Breadcrumb.Item href="#/ProductionControl/list">指令列表</Breadcrumb.Item>
          <Breadcrumb.Item>列表详情</Breadcrumb.Item>
        </Breadcrumb>
        <p className={styles.button}>
           <span>该页面每10秒刷新一次</span>
           <span style={{float: 'right'}}>
              <Button type="primary" onClick={goBack}>返回</Button>
           </span>
        </p>
        <Table
          columns={columns}
          dataSource={ this.state.listShow }
          rowKey={record => record.id}
          pagination={false}
        />
        <Table
          style={{ marginTop: 20}}
          columns={columns1}
          rowKey={record => record.machineId}
          dataSource={ this.state.listShow1 }
          pagination={false}
        />
        <div className={styles.changePage}>
           <Pagination size="small" total={parseInt(this.state.dataCount)} onChange={this.changePage} showQuickJumper />
        </div>
      </PageHeaderLayout>
    );
  }
}

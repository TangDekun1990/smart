import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { Row, Col, Card, Form, Input, Select, Icon, Button, Dropdown, Menu, InputNumber, Modal, message, Badge, Divider, Table, Popconfirm, Option, DatePicker } from 'antd';
import StandardTable from '../../components/StandardTable';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import URL from '../../utils/api';

import styles from './TableList.less';

const FormItem = Form.Item;
//const { Option } = Select;
const getValue = obj => Object.keys(obj).map(key => obj[key]).join(',');
const statusMap = ['default', 'processing', 'success', 'error'];
const status = ['关闭', '运行中', '已上线', '异常'];



@connect(({ rule, loading }) => ({
  rule,
  loading: loading.models.rule,
}))
@Form.create()


export default class NewSchedule extends PureComponent {



  state = {
    modalVisible: false,
    expandForm: false,
    selectedRows: [],
    formValues: {},
    listShow: [],  // 列表数据
    statusList: []  // 状态里表数据
  };
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'rule/fetch',
    });

    const that = this;
    fetch( URL + 'order/getOrderList/1', {
        method: 'get',
        mode: 'cors',
    }).then(function(res) {
        if (res.ok) {
            res.json().then(function (data) {
              console.log(data)
                if (data.code === "0") {
                    that.setState({listShow: JSON.parse(data.data).orderList})
                    that.setState({statusList: JSON.parse(data.data).orderStatusList})
                }
            });
        } else if (res.status === 401) {
            console.log("Oops! You are not authorized.");
        }
    }).then(error=>{
        console.log(JSON.stringify(error));
    });
  }


  // 查询按钮事件
  doQuery = () => {
      const that = this;
      const formData = new FormData();
      console.log(document.getElementById('no').value)
      console.log(document.getElementById('no1').value)
      //console.log(document.getElementById('status2').value)
      formData.append('orderNumber', document.getElementById('no').value);
      formData.append('customerName', document.getElementById('no1').value);
      //formData.append('orderState', document.getElementById('status2').value);
      formData.append('tokenId', '01');
      formData.append('tenantId', 144);
      formData.append('version', 1);
      fetch( URL + 'order/getOrderList/1', {
          method: 'get',
          mode: 'cors',
          // headers: {
          //      "Content-Type": "application/json"
          // },
          body: formData
      }).then(function(res) {
          if (res.ok) {
              res.json().then(function (data) {
                      console.log(data)
                  that.setState({listShow: JSON.parse(data.data).orderList})
              });
          } else if (res.status === 401) {
              console.log("Oops! You are not authorized.");
          }
      }).then(error=>{
          console.log(JSON.stringify(error));
      });
  }

  // 取消订单事件
  deleteList = (orderId) => {
    const that = this;
    const formData = new FormData();
    //formData.append('orderId', orderId});
    formData.append('tokenId', '01');
    formData.append('tenantId', 144);
    formData.append('version', 1);
    fetch( URL + 'order/deleteOrderByOrderId/1', {
        method: 'post',
        mode: 'cors',
        // headers: {
        //      "Content-Type": "application/json"
        // },
        body: formData
    }).then(function(res) {
        if (res.ok) {
            res.json().then(function (data) {
                console.log(data)
                //that.setState({listShow: listShow.filter(item => item.orderId !== orderId)});
            });
        } else if (res.status === 401) {
            console.log("Oops! You are not authorized.");
        }
    }).then(error=>{
        console.log(JSON.stringify(error));
    });
  }







  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    const { dispatch } = this.props;
    const { formValues } = this.state;

    const filters = Object.keys(filtersArg).reduce((obj, key) => {
      const newObj = { ...obj };
      newObj[key] = getValue(filtersArg[key]);
      return newObj;
    }, {});

    const params = {
      currentPage: pagination.current,
      pageSize: pagination.pageSize,
      ...formValues,
      ...filters,
    };
    if (sorter.field) {
      params.sorter = `${sorter.field}_${sorter.order}`;
    }

    dispatch({
      type: 'rule/fetch',
      payload: params,
    });
  }

  handleFormReset = () => {
    const { form, dispatch } = this.props;
    form.resetFields();
    this.setState({
      formValues: {},
    });
    dispatch({
      type: 'rule/fetch',
      payload: {},
    });
  }

  toggleForm = () => {
    this.setState({
      expandForm: !this.state.expandForm,
    });
  }

  handleMenuClick = (e) => {
    const { dispatch } = this.props;
    const { selectedRows } = this.state;

    if (!selectedRows) return;

    switch (e.key) {
      case 'remove':
        dispatch({
          type: 'rule/remove',
          payload: {
            no: selectedRows.map(row => row.no).join(','),
          },
          callback: () => {
            this.setState({
              selectedRows: [],
            });
          },
        });
        break;
      default:
        break;
    }
  }

  handleSelectRows = (rows) => {
    this.setState({
      selectedRows: rows,
    });
  }

  handleSearch = (e) => {
    e.preventDefault();

    const { dispatch, form } = this.props;

    form.validateFields((err, fieldsValue) => {
      if (err) return;

      const values = {
        ...fieldsValue,
        updatedAt: fieldsValue.updatedAt && fieldsValue.updatedAt.valueOf(),
      };

      this.setState({
        formValues: values,
      });

      dispatch({
        type: 'rule/fetch',
        payload: values,
      });
    });
  }

  handleModalVisible = (flag) => {
    this.setState({
      modalVisible: !!flag,
    });
  }

  handleAdd = (fields) => {
    this.props.dispatch({
      type: 'rule/add',
      payload: {
        description: fields.desc,
      },
    });

    message.success('添加成功');
    this.setState({
      modalVisible: false,
    });
  }

  renderSimpleForm() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="订单编号">
              {getFieldDecorator('no1')(
                   <Input placeholder="请输入" />
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="订单名称">
              {getFieldDecorator('no')(
                <Select placeholder="请输入"/>
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
              <Button type="primary"  onClick={this.doQuery}>查询</Button>
              <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>重置</Button>
              <a style={{ marginLeft: 8 }} onClick={this.toggleForm}>
                 展开 <Icon type="down" />
              </a>
          </Col>
        </Row>
      </Form>
    );
  }

  renderAdvancedForm() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="订单编号">
              {getFieldDecorator('no')(
                <Input placeholder="请输入" />
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="订单状态">
              {getFieldDecorator('status')(
                <Input placeholder="请选择" />
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="客户名称">
              {getFieldDecorator('number')(
                <Input placeholder="请输入" style={{ width: '100%' }} />
              )}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="花样名称">
              {getFieldDecorator('status1')(
                <Input placeholder="请输入" style={{ width: '100%' }}/>
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24} >
            <FormItem label="下单日期">
              {getFieldDecorator('date')(
                <DatePicker  placeholder="请输入更新日期" style={{ width: '100%' }}/>
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24} >
            <FormItem label="交货日期">
              {getFieldDecorator('date1')(
                <DatePicker  placeholder="请输入更新日期" style={{ width: '100%' }}/>
              )}
            </FormItem>
          </Col>
        </Row>
        <div style={{ overflow: 'hidden', textAlign: 'center'}}>
          <span>
            <Button type="primary" htmlType="submit">查询</Button>
            <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>重置</Button>
            <a style={{ marginLeft: 8 }} onClick={this.toggleForm}>
              收起 <Icon type="up" />
            </a>
          </span>
        </div>
      </Form>
    );
  }

  renderForm() {
    return this.state.expandForm ? this.renderAdvancedForm() : this.renderSimpleForm();
  }


  render() {
    const { selectedRows, modalVisible } = this.state;

    const menu = (
      <Menu onClick={this.handleMenuClick} selectedKeys={[]}>
        <Menu.Item key="remove">删除</Menu.Item>
        <Menu.Item key="approval">批量审批</Menu.Item>
      </Menu>
    );

    const parentMethods = {
      handleAdd: this.handleAdd,
      handleModalVisible: this.handleModalVisible,
    };

    const columns = [
      {
        title: '订单编号',
        dataIndex: 'orderNumber',
        key: 'orderNumber',
      },
      {
        title: '订单名称',
        dataIndex: 'orderName',
        key: 'orderName',
      },
      {
        title: '花样名称',
        dataIndex: 'customerName',
        key: 'customerName',
      },
      {
        title: '服务器中的花样号',
        dataIndex: 'customerPhone',
        key: 'customerPhone',
      },
      {
        title: '成功下发机器数',
        dataIndex: 'orderTotalNumber',
        key: 'orderTotalNumber',
      },
      {
        title: '选择机器数',
        dataIndex: 'orderTotalNumber',
        key: 'orderTotalNumber1',
      },
      {
        title: '成功率',
        dataIndex: 'orderTotalNumber',
        key: 'orderTotalNumber2',
      },
      {
        title: '预计完成时间',
        dataIndex: 'orderTotalNumber',
        key: 'orderTotalNumber33',
      },
      {
        title: '状态',
        dataIndex: 'orderTotalNumber',
        key: 'orderTotalNumber4',
      },
      {
        title: '详情',
        key: 'hello',
        render: (record) => (
          <Fragment>
            <a >点击查看详情</a>
          </Fragment>
        ),
      },
    ];


    return (
      <PageHeaderLayout>
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>
              {this.renderForm()}
            </div>
            <div style={{  height: 30 }}></div>
            <Table  dataSource={ this.state.listShow } columns={columns} rowKey={record => record.orderId}/>
          </div>
        </Card>
      </PageHeaderLayout>
    );
  }
}

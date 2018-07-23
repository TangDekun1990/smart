import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { Row, Col, Card, Form, Input, Select, Icon, Button, Dropdown, Menu, InputNumber, DatePicker, Modal, message, Badge, Divider, Table, Popconfirm } from 'antd';
import StandardTable from '../../components/StandardTable';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import { routerRedux } from 'dva/router';
import URL from '../../utils/api.js'


import styles from './TableList.less';

const FormItem = Form.Item;
const { Option } = Select;
const getValue = obj => Object.keys(obj).map(key => obj[key]).join(',');
const statusMap = ['default', 'processing', 'success', 'error'];
const status = ['关闭', '运行中', '已上线', '异常'];



@connect(({ rule, loading }) => ({
  rule,
  loading: loading.models.rule,
}))
@Form.create()


export default class Warning extends PureComponent {


  state = {
    modalVisible: false,
    expandForm: false,
    selectedRows: [],
    formValues: {},
    listShow: [],
    statusList: []
  };
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'rule/fetch',
    });

    const that = this;
    //页面家在显示列表请求数据(列表） *fetch*请求
    fetch( '/stockalert/getStockAlertList/1', {
      method: 'post',
      mode: 'cors',
      // body: formData
    }).then(function(res) {
      if (res.ok) {
        res.json().then(function (data) {
          if (data.code === '0') {
            // 存用户列表和工厂列表的数据
            that.setState({listShow: data.data.stockAlertList});
            //that.setState({statusList: JSON.parse(data.data).orderStatusList})
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
  /*doQuery = () => {
    const that = this;
    const formData = new FormData();
    console.log(document.getElementById('no').value)
    console.log(document.getElementById('no1').value)
    formData.append('orderNumber', document.getElementById('no').value);
    formData.append('customerName', document.getElementById('no1').value);
    formData.append('tokenId', '01');
    formData.append('tenantId', 144);
    formData.append('version', 1);
    fetch( URL + 'order/getOrderList/1', {
      method: 'get',
      mode: 'cors',
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
  }*/

  // 取消订单
  deleteList = (id) => {
    const that = this;
    const dataSource = [...this.state.listShow];
    const formData = new FormData();
    formData.append('tokenId', '01');
    formData.append('tenantId', 1);
    formData.append('version', 1);
    formData.append('active', 0);
    formData.append('id', id);
    fetch('/order/deleteOrderById/1', {
      method: 'post',
      mode: 'cors',
      body: formData
    }).then(function(res) {
      if (res.ok) {
        res.json().then(function (data) {
          that.setState({listShow: dataSource.filter(item => item.id !== id)});
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
            <FormItem label="库存编号">
              {getFieldDecorator('no')(
                <Input placeholder="请输入"/>
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="提醒人">
              {getFieldDecorator('no1')(
                <Input placeholder="请输入" />
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem>
              <Button type="primary"  onClick={this.doQuery}>查询</Button>
              <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>重置</Button>
            </FormItem>
          </Col>
        </Row>
      </Form>
    );
  }



  renderForm() {
    return this.state.expandForm ? this.renderAdvancedForm() : this.renderSimpleForm();
  }


  render() {
    //const { rule: { data }, loading } = this.props;
    const { selectedRows, modalVisible } = this.state;
    //const { listShow } = this.state;

    const columns = [
      {
        title: '库存编号',
        dataIndex: 'stockNumber',
        key: 'stockNumber',
      },
      {
        title: '预警数量',
        dataIndex: 'number',
        key: 'number',
      },
      {
        title: '提醒人',
        dataIndex: 'workerName',
        key: 'workerName',
      },
      {
        title: '手机号',
        dataIndex: 'workerPhone',
        key: 'workerPhone',
      },
      {
        title: '编辑',
        key: 'hello',
        render: (record) => (
          <Fragment>
            <a onClick={ updateWarn }>修改</a>
            <Divider type="vertical" />
            <Popconfirm title="确定取消该预警吗？" okText="是" cancelText="否" onConfirm={() => this.deleteList(record.id)}>
              <a href="#">取消</a>
            </Popconfirm>
          </Fragment>
        ),
      },
    ];

    const { dispatch } = this.props;
    const addWarn = () => {
      dispatch(routerRedux.push('/stocks/newWarn'));
    };
    const updateWarn = () => {
      dispatch(routerRedux.push('/stocks/updateWarn'));
    };

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

    return (
      <PageHeaderLayout>
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>
              {this.renderForm()}
            </div>
            <div style={{width: '100%', textAlign: 'right', marginBottom: 15}}>
              <Button type="primary" onClick={ addWarn }>新增</Button>
            </div>
            <Table
              dataSource={ this.state.listShow }
              columns={columns}
              rowKey={record => record.id}
              rowSelection={this.state.selectedRows}
            />
          </div>
        </Card>
      </PageHeaderLayout>
    );
  }
}

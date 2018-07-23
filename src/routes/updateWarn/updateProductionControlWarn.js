import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { Row, Col, Card, Form, Input, Select, Icon, Button, Dropdown, Menu, InputNumber, DatePicker, Modal, message, Badge, Divider, Table } from 'antd';
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
const columns = [
  {
    title: '订单编号',
    dataIndex: 'orderNumber',
    key: 'orderNumber',
  },
  {
    title: '预警数量(只)',
    dataIndex: 'orderName',
    key: 'orderName',
  },
  {
    title: '提醒人',
    dataIndex: 'customerName',
    key: 'customerName',
  },
  {
    title: '手机号',
    dataIndex: 'customerPhone',
    key: 'customerPhone',
  },
  {
    title: '编辑',
    key: 'hello',
    render: () => (
      <Fragment>
        <a href="">修改</a>
        <Divider type="vertical" />
        <a href="">取消</a>
      </Fragment>
    ),
  },
];


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
    listShow: '',
    statusList: []
  };
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'rule/fetch',
    });
    const that = this;
    const formData = new FormData();
    // formData.append('tokenId', '01');
    // formData.append('tenantId', 144);
    // formData.append('version', 1);
    fetch('/productalert/updateProductAlertById/1', {
      method: 'post',
      mode: 'cors',
      body: formData
    }).then(function(res) {
      if (res.ok) {
        res.json().then(function (data) {
          if (data.code === '0') {
             that.setState({listShow: data.data.productAlert});
          }
        });
      } else if (res.status === 401) {
        console.log("Oops! You are not authorized.");
      }
    }).then(error=>{
      console.log(JSON.stringify(error));
    });


  }

  // 更新预警事件
  addSave = () => {
    const that = this;
    const { dispatch } = this.props;
    const formData = new FormData();
    // formData.append('tokenId', '01');
    // formData.append('tenantId', 144);
    // formData.append('version', 1);
    fetch('/productalert/updateProductAlertById/1', {
      method: 'post',
      mode: 'cors',
      body: formData
    }).then(function(res) {
      if (res.ok) {
        res.json().then(function (data) {
          if (data.code === '0') {
            alert(data.msg);
            setTimeout(function(){
              dispatch(routerRedux.push('/ProductionControl/alert'));
            }, 500);
          }
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
        <Row gutter={{ md: 8, lg: 24, xl: 48 }} style={{  marginLeft: '21%' }}>
          <Col md={8} sm={24}>
            <FormItem label="订单编号">
                <Select placeholder="请选择" value={this.state.listShow.orderNumber}>
                  <Option value="0">N2018020178</Option>
                  <Option value="1">L2018020766</Option>
                  <Option value="2">N2018020558</Option>
                  <Option value="3">201803011136</Option>
                </Select>
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="预警类型">
                <Select placeholder="请选择" value={this.state.listShow.type}>
                  <Option value="0">下发成功</Option>
                  <Option value="1">下发失败</Option>
                  <Option value="2">正在下发</Option>
                </Select>
            </FormItem>
          </Col>
        </Row>
        <Row gutter={{ md: 8, lg: 24, xl: 48 }} style={{  marginLeft: '21%' }}>
          <Col md={8} sm={24}>
            <FormItem label="提醒人">
                <Input placeholder="请输入" value={this.state.listShow.workerName} />
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="手机号">
                <Input placeholder="请输入" value={this.state.listShow.workerPhone} />
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

    return (
      <PageHeaderLayout>
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>
              {this.renderForm()}
            </div>
            <div style={{  height: 30 }}></div>
            <div style={{width: '100%', textAlign: 'center'}}>
              <Button type="primary" onClick={ this.addSave }>修改</Button>
            </div>
          </div>
        </Card>
      </PageHeaderLayout>
    );
  }
}

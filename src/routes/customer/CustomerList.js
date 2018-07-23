import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { Row, Col, Card, Form, Input, Select, Icon, Button,
 Dropdown, Menu, InputNumber, DatePicker, Modal, message, Badge, Divider, Table, Popconfirm, Option, Pagination } from 'antd';
import StandardTable from '../../components/StandardTable';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import { routerRedux } from 'dva/router';
import URL from '../../utils/api';
import argument from'../../utils/argument';

import styles from './TableList.less';

const FormItem = Form.Item;
const getValue = obj => Object.keys(obj).map(key => obj[key]).join(',');
const statusMap = ['default', 'processing', 'success', 'error'];
const status = ['关闭', '运行中', '已上线', '异常'];



@connect(({ rule, loading }) => ({
  rule,
  loading: loading.models.rule,
}))
@Form.create()


export default class TableList extends PureComponent {



  state = {
    modalVisible: false,
    expandForm: false,
    selectedRows: [],
    formValues: {},
    listShow: [],  // 列表数据
    value1:'',
    value2:'',
    value3:'',
    value4:'',
    dataCount: '',
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
    document.addEventListener("keydown", this.handleEnterKey);
    const that = this;
    const formData = new FormData();
    formData.append('tokenId', argument.tokenId);
    formData.append('tenantId', argument.tenantId);
    formData.append('version', argument.version);
    formData.append('active', 1);
    fetch(URL + '/customer/getCustomerList/v1', {
        method: 'post',
        mode: 'cors',
        body: formData
    }).then(function(res) {
        if (res.ok) {
            res.json().then(function (data) {
                if (data.code === '0') {
                  that.setState({
                    listShow: JSON.parse(data.data).customerList,
                    dataCount: JSON.parse(data.data).dataCount
                  })
                } else {
                  message.error(data.msg);
                }
            });
        } else if (res.status === 401) {
            //console.log("Oops! You are not authorized.");
        }
    }).then(error=>{
        //console.log(JSON.stringify(error));
    });
  }


  // 查询按钮事件
  doQuery = () => {
      const that = this;
      const formData = new FormData();
      formData.append('tokenId', argument.tokenId);
      formData.append('tenantId', argument.tenantId);
      formData.append('version', argument.version);
      formData.append('active', 1);
      formData.append('name', this.state.value1);
      formData.append('phone', this.state.value2);
      formData.append('companyName', this.state.value3);
      formData.append('deliveryAddress', this.state.value4);
      fetch( URL + '/customer/getCustomerList/v1', {
          method: 'post',
          mode: 'cors',
          body: formData
      }).then(function(res) {
          if (res.ok) {
              res.json().then(function (data) {
                  if(data.code ==='0') {
                    that.setState({
                      listShow: JSON.parse(data.data).customerList,
                      dataCount: JSON.parse(data.data).dataCount
                    })
                  } else {
                    message.error(data.msg);
                  }
              });
          } else if (res.status === 401) {
              // //console.log("Oops! You are not authorized.");
          }
      }).then(error=>{
          // //console.log(JSON.stringify(error));
      });
  }

  handleChange1 = (e) => {
    this.setState({
      value1: e.target.value,
    });
  }

  handleChange2 = (e) => {
    this.setState({
      value2: e.target.value,
    });
  }

  handleChange3 = (e) => {
    this.setState({
      value3: e.target.value,
    });
  }

  handleChange4 = (e) => {
    this.setState({
      value4: e.target.value,
    });
  }

  // 删除客户
  remove = (id) => {
    const that = this;
    const dataSource = [...this.state.listShow];
    const formData = new FormData();
    formData.append('tokenId', argument.tokenId);
    formData.append('tenantId', argument.tenantId);
    formData.append('version', argument.version);
    formData.append('active', 1);
    formData.append('id', id);
    fetch(URL + '/customer/deleteCustomerById/v1', {
      method: 'post',
      mode: 'cors',
      body: formData
    }).then(function(res) {
      if (res.ok) {
        res.json().then(function (data) {
          if(data.code === '0') {
            that.setState({listShow: dataSource.filter(item => item.id !== id)});
          } else {
            message.error(data.msg);
          }
        });
      } else if (res.status === 401) {
        // //console.log("Oops! You are not authorized.");
      }
    }).then(error=>{
      // //console.log(JSON.stringify(error));
    });
  }

  // 点击翻页
  changePage = (page, pageSize) => {
    const that = this;
    const formData = new FormData();
    formData.append('tokenId', argument.tokenId);
    formData.append('tenantId', argument.tokenId);
    formData.append('version', argument.tokenId);
    formData.append('name', this.state.value1);
    formData.append('phone', this.state.value2);
    formData.append('companyName', this.state.value3);
    formData.append('deliveryAddress', this.state.value4);
    formData.append('active', 1);
    formData.append('rowSize', pageSize);
    formData.append('currentPage', page);
    fetch(URL + '/customer/getCustomerList/v1', {
        method: 'post',
        mode: 'cors',
        body: formData
    }).then(function(res) {
        if (res.ok) {
            res.json().then(function (data) {
                if (data.code === '0') {
                    that.setState({
                      listShow: JSON.parse(data.data).customerList
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


  handleFormReset = () => {
    const { form } = this.props;
    form.resetFields();
    this.setState({
      value1:'',
      value2:'',
      value3:'',
      value4:'',
    });
    this.componentDidMount();
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
// 键盘回车查询
handleEnterKey = (e) => {
  if(e.keyCode === 13){
      this.doQuery();
  }
}
  renderSimpleForm() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }} >
          <Col md={8} sm={24}>
            <FormItem label="客户名称">
            {getFieldDecorator('no1',{
              
              rules: [{ max: 30, message: '您输入的字符过长' }],
            })(
                   <Input placeholder="请输入" style={{width:'150%'}} onChange={this.handleChange1} maxLength={31} />
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="联系电话">
            {getFieldDecorator('no2',{
              
              rules: [{ max: 30, message: '您输入的字符过长' }],
            })(
                   <Input placeholder="请输入" style={{width:'150%'}} onChange={this.handleChange2} maxLength={31} />
              )}
            </FormItem>
          </Col>

          <Col md={8} sm={24} >
            <Button type="primary"  onClick={this.doQuery} onKeyDown={this.handleEnterKey}>查询</Button>
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
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}  >
          <Col md={8} sm={24}>
            <FormItem label="客户名称">
            {getFieldDecorator('no1',{
              
              rules: [{ max: 30, message: '您输入的字符过长' }],
            })(
                   <Input placeholder="请输入" style={{width:'150%'}} onChange={this.handleChange1} maxLength={31} />
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="联系电话">
            {getFieldDecorator('no2',{
              
              rules: [{ max: 30, message: '您输入的字符过长' }],
            })(
                   <Input placeholder="请输入" style={{width:'150%'}} onChange={this.handleChange2} maxLength={31} />
              )}
            </FormItem>
          </Col>

          <Col md={8} sm={24}>
            <FormItem label="公司名称" >
            {getFieldDecorator('no3',{
              
              rules: [{ max: 30, message: '您输入的字符过长' }],
            })(
                   <Input placeholder="请输入" style={{width:'150%'}} onChange={this.handleChange3} maxLength={31} />
              )}
            </FormItem>
          </Col>


          <Col md={8} sm={24}>
            <FormItem label="公司地址" style={{marginTop:20}}>
            {getFieldDecorator('no4',{
              
              rules: [{ max: 30, message: '您输入的字符过长' }],
            })(
                   <Input placeholder="请输入" style={{width:'150%'}} onChange={this.handleChange4} maxLength={31} />
              )}
            </FormItem>
          </Col>

          <Col md={8} sm={24} style={{marginTop:20}} >
          <Button type="primary"  onClick={this.doQuery} onKeyDown={this.handleEnterKey}>查询</Button>
            <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>重置</Button>
            <a style={{ marginLeft: 8 }} onClick={this.toggleForm}>
              收起 <Icon type="up" />
            </a>
          </Col>
          </Row>
      </Form>
    );
  }

  renderForm() {
    return this.state.expandForm ? this.renderAdvancedForm() : this.renderSimpleForm();
  }

 //更新操作
  doUpdate = (id) => {
  localStorage.setItem('id',id);
  const { dispatch } = this.props;
  dispatch(routerRedux.push('/setting/updateCustomer'));
};





render() {
    const { selectedRows, modalVisible } = this.state;

    const { dispatch } = this.props;
    // const updateCustomer = () => {
    //   dispatch(routerRedux.push('/setting/updateCustomer'));
    // };
    const addCustomer = () => {
      dispatch(routerRedux.push('/setting/addCustomer'));
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

    const columns = [
      {
        title: '客户编号',
        dataIndex: 'number',
        key: 'number',
        // sorter: (a, b) => {a.number - b.number},
      },
      {
        title: '客户名称',
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: '联系电话',
        dataIndex: 'phone',
        key: 'phone',
      },
      {
        title: '公司名称',
        dataIndex: 'companyName',
        key: 'companyName',
      },
      {
        title: '地址',
        dataIndex: 'deliveryAddress',
        key: 'deliveryAddress',
      },
      {
        title: '备注',
        dataIndex: 'remark',
        key: 'remark',
      },
      {
        title: '编辑',
        key: 'hello',
        render: (record) => (
          <Fragment>
            <a onClick={() => this.doUpdate(record.id)}>修改</a>
            <Divider type="vertical" />
            {/* <Popconfirm title="确定删除吗？"   okText="是" cancelText="否">
              <a href="#">删除</a>
            </Popconfirm> */}
            <Popconfirm title="是否要删除此行？" onConfirm={() => this.remove(record.id)}>
                        <a>删除</a>
                      </Popconfirm>
          </Fragment>
        ),
      },
    ];


    return (
      <PageHeaderLayout>
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div>
              {this.renderForm()}
            </div>
            <div style={{ width: "100%", textAlign:'right', marginRight: '5%' }}>
               <Button type="primary" onClick={ addCustomer } style={{ marginRight: '3%', marginBottom: 20 }}>新增客户</Button>
            </div>
            <Table
              dataSource={ this.state.listShow }
              columns={columns}
              rowKey={record => record.id}
              // rowSelection={this.state.selectedRows}
              onKey={this.remove}
              onKey={this.doUpdate}
              pagination={false}
            />
            <div className={styles.changePage}>
               <Pagination size="small" total={parseInt(this.state.dataCount)} onChange={this.changePage} showQuickJumper />
            </div>
          </div>
        </Card>
      </PageHeaderLayout>
    );
  }
}

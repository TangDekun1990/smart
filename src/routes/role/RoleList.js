import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { Row, Col, Card, Form, Input, Select, Icon, Button, Dropdown, Menu, InputNumber, DatePicker, Modal, message, Badge, Divider, Table, Popconfirm, Option } from 'antd';
import StandardTable from '../../components/StandardTable';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import { routerRedux } from 'dva/router';
import URL from '../../utils/api';

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
  };
  componentDidMount() {
    const that = this;
    const formData = new FormData();
    formData.append('tokenId', '01');
    formData.append('tenantId', 1);
    formData.append('version', 1);
    formData.append('active', 1);
    fetch(URL + '/userRole/getUserRoleList/v1', {
        method: 'post',
        mode: 'cors',
        body: formData
    }).then(function(res) {
        if (res.ok) {
            res.json().then(function (data) {
                if (data.code === '0') {
                    that.setState({listShow: JSON.parse(data.data).userRoleList})
                }
            });
        } else if (res.status === 401) {
            // console.log("Oops! You are not authorized.");
        }
    }).then(error=>{
        // console.log(JSON.stringify(error));
    });
  }
  // componentDidMount() {
  //   const that = this;
  //   const formData = new FormData();
  //   formData.append('tokenId', '01');
  //   formData.append('tenantId', 1);
  //   formData.append('version', 1);
  //   formData.append('active', 1);
  //   fetch('/userRole/getUserRoleList/v1', {
  //       method: 'post',
  //       mode: 'cors',
  //       body: formData
  //   }).then(function(res) {
  //       if (res.ok) {
  //           res.json().then(function (data) {
  //               if (data.code === '0') {
  //                   that.setState({listShow: data.data.userRoleList})
  //               }
  //           });
  //       } else if (res.status === 401) {
  //           // console.log("Oops! You are not authorized.");
  //       }
  //   }).then(error=>{
  //       // console.log(JSON.stringify(error));
  //   });
  // }


  // 查询按钮事件
  doQuery = () => {
      const that = this;
      const formData = new FormData();
      formData.append('version', 1);
      formData.append('tokenId', '01');
      formData.append('tenantId', 1);
      formData.append('active', 1);
      formData.append('loginName', this.state.value1);
      formData.append('loginId', this.state.value2);
      formData.append('permissonCodeName', this.state.value3);
      formData.append('remark', this.state.value4);
      fetch( URL + '/userRole/getUserRoleList/v1', {
          method: 'post',
          mode: 'cors',
          body: formData
      }).then(function(res) {
          if (res.ok) {
              
              res.json().then(function (data) {
                  that.setState({listShow: JSON.parse(data.data).userRoleList})
              });
          } else if (res.status === 401) {
              // console.log("Oops! You are not authorized.");
          }
      }).then(error=>{
          // console.log(JSON.stringify(error));
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
  // remove = (id) => {
  //   const that = this;
  //   const dataSource = [...this.state.listShow];
  //   const formData = new FormData();
  //   formData.append('tokenId', '01');
  //   formData.append('tenantId', 1);
  //   formData.append('version', 1);
  //   formData.append('id', id);
  //   fetch(URL + '/userRole/deleteUserRoleById/v1', {
  //     method: 'post',
  //     mode: 'cors',
  //     body: formData
  //   }).then(function(res) {
  //     if (res.ok) {
  //       res.json().then(function (data) {
  //         that.setState({listShow: dataSource.filter(item => item.id !== id)});
  //       });
  //     } else if (res.status === 401) {
  //       // console.log("Oops! You are not authorized.");
  //     }
  //   }).then(error=>{
  //     // console.log(JSON.stringify(error));
  //   });
  // }
  //本地测试
  remove = (id) => {
    const that = this;
    const dataSource = [...this.state.listShow];
    const formData = new FormData();
    formData.append('tokenId', '01');
    formData.append('tenantId', 1);
    formData.append('version', 1);
    formData.append('id', id);
    fetch('/userRole/getUserRoleList/v1', {
      method: 'post',
      mode: 'cors',
      body: formData
    }).then(function(res) {
      if (res.ok) {
        res.json().then(function (data) {
          that.setState({listShow: dataSource.filter(item => item.id !== id)});
        });
      } else if (res.status === 401) {
        // console.log("Oops! You are not authorized.");
      }
    }).then(error=>{
      // console.log(JSON.stringify(error));
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

  renderSimpleForm() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }} >
          <Col md={8} sm={24}>
            <FormItem label="姓名">
            {getFieldDecorator('no1')(
                   <Input placeholder="请输入" onChange={this.handleChange1} />
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="登录账号">
            {getFieldDecorator('no2')(
                   <Input placeholder="请输入" onChange={this.handleChange2} />
              )}
            </FormItem>
          </Col>
          
        
        <Col md={8} sm={24} >
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
        <Row gutter={{ md: 8, lg: 24, xl: 48 }} >
          <Col md={8} sm={24}>
            <FormItem label="姓名">
            {getFieldDecorator('no1')(
                   <Input placeholder="请输入" onChange={this.handleChange1} />
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="登录账号">
            {getFieldDecorator('no2')(
                   <Input placeholder="请输入" onChange={this.handleChange2} />
              )}
            </FormItem>
          </Col>
         
          
          <Col md={8} sm={24}>
            <FormItem label="权限">
            {getFieldDecorator('no3')(
                   <Input placeholder="请输入" onChange={this.handleChange3} />
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="备&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;注">
            {getFieldDecorator('no4')(
                   <Input placeholder="请输入" onChange={this.handleChange4} />
              )}
            </FormItem>
          </Col>
         
       
        <Col md={8} sm={24} >
          <Button type="primary"  onClick={this.doQuery}>查询</Button>
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
  dispatch(routerRedux.push('/setting/updateRole'));
};
  render() {
    const { selectedRows, modalVisible } = this.state;

    const { dispatch } = this.props;
    const addRole = () => {
      dispatch(routerRedux.push('/setting/addRole'));
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
        title: '姓名',
        dataIndex: 'loginName',
        key: 'loginName',
      },
      {
        title: '登录账号',
        dataIndex: 'loginId',
        key: 'loginId',
      },
      {
        title: '权限',
        dataIndex: 'permissonCodeName',
        key: 'permissonCodeName',
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
            <div className={styles.tableListForm}>
              {this.renderForm()}
            </div>
            <div style={{ width: "100%", textAlign:'right', marginRight: '5%' }}>
               <Button type="primary" onClick={ addRole } style={{ marginRight: '3%', marginBottom: 20 }}>新增用户权限</Button>
            </div>
            <Table
              dataSource={ this.state.listShow }
              columns={columns}
              rowKey={record => record.id}
              rowSelection={this.state.selectedRows}
              onKey={this.remove}
              onKey={this.doUpdate}
            />
          </div>
        </Card>
      </PageHeaderLayout>
    );
  }
}

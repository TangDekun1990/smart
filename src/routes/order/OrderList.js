import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { Row, Col, Card, Form, Pagination,Input, Select, Icon, Button, Dropdown, Menu, InputNumber, DatePicker, Modal, message, Badge, Divider, Table, Popconfirm } from 'antd';
import StandardTable from '../../components/StandardTable';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import { routerRedux } from 'dva/router';
import fetch from 'dva/fetch';
import URL from '../../utils/api';
import argument from '../../utils/argument';

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


export default class OrderList extends PureComponent {
  state = {
    modalVisible: false,
    expandForm: false,
    listShow: [],  // 列表数据
    statusList: [],  // 状态里表数据
    orderValue: '',   //用户Value
    nameValue: '',  // 订单名称
    customerValue: '',  // 客户
    statusValue: '',  // 状态
    timevalue: '',  // 下单日期
    timevalueJ: '', // 交货日期
    dataCount:'',
    cancelId:'',
    orderBy: '' ,
    sort: '',
    rowSize: '',
    currentPage: '',
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

    document.addEventListener("keydown", this.handleEnterKey);  // 监听键盘事件

    const that = this;
    const formData = new FormData();
    formData.append('active', 1);
     formData.append('tokenId', argument.tokenId);
   formData.append('tenantId', argument.tenantId);
   formData.append('version', argument.version);
    fetch( URL + '/order/getOrderList/v1', {
    //fetch('/order/getOrderList/v1', {
        method: 'post',
        mode: 'cors',
        body: formData,
    }).then(function(res) {
        if (res.ok) {
            res.json().then(function (data) {
                if (data.code === "0") {
                     //that.setState({listShow: data.data.orderList});
                    that.setState({listShow: JSON.parse(data.data).orderList});
                    that.setState({statusList: JSON.parse(data.data).orderstatusList});
                    that.setState({dataCount: JSON.parse(data.data).dataCount});
                    JSON.parse(data.data).orderstatusList.map(function(item){
                      if(item.name=='已取消'){
                        that.setState({
                           cancelId:item.id
                        })
                      }
                    })
                } else {
                    message.error(data.msg);
                }
            });
        } else if (res.status === 401) {
            //console.log("Oops! You are not authorized.");
        }
    }).then(error=>{
        ////console.log(JSON.stringify(error));
    });
  }

  // 订单编号
  changeValue = (e) => {
    this.setState({
      orderValue: e.target.value
    });
  }

  // 客户名称
  inputValue = (e) => {
    this.setState({
      customerValue: e.target.value
    });
  }

  // 订单名称
  input1 = (e) => {
    this.setState({
      nameValue: e.target.value
    });
  }

  // 订单状态
  input2 = (value) => {
    if(value==''||value=='all'){
      value=''
      this.setState({
        statusValue: value
      });
    }else{
      this.setState({
        statusValue: value
      });
    }


  }

  // 下单日期
  input3 = (date, dateString) => {
    this.setState({
      timevalue: dateString
    });
  }

  // 交货日期
  input4 = (date, dateString) => {
    this.setState({
      timevalueJ: dateString
    });
  }

  // 查询按钮事件
  doQuery = () => {
      const that = this;
      const formData = new FormData();
      formData.append('number', this.state.orderValue);
      formData.append('customerName', this.state.customerValue);
      formData.append('name', this.state.nameValue);
      formData.append('orderStatusId', this.state.statusValue);
      formData.append('orderTime', this.state.timevalue);
      formData.append('deliveryTime', this.state.timevalueJ);
      formData.append('tokenId', argument.tokenId);
      formData.append('tenantId', argument.tenantId);
      formData.append('version', argument.version);
      formData.append('active', 1);
      fetch(URL + '/order/getOrderList/v1', {
          method: 'post',
          mode: 'cors',
          body: formData,
      }).then(function(res) {
          if (res.ok) {
              res.json().then(function (data) {
                  if(data.code === '0') {
                    that.setState({listShow: JSON.parse(data.data).orderList});
                    that.setState({dataCount: JSON.parse(data.data).dataCount});
                  } else {
                    message.error(data.msg);
                  }
              });
          } else if (res.status === 401) {
              //console.log("Oops! You are not authorized.");
          }
      }).then(error=>{
          ////console.log(JSON.stringify(error));
      });
  }


// 键盘回车查询
handleEnterKey = (e) => {

  if(e.keyCode === 13){

      {this.doQuery()};
  }
}
  // 查看详情
  doCheck = (id) => {
    sessionStorage.setItem('dataId', id);
    const { dispatch } = this.props;
    dispatch(routerRedux.push('/order/check'));
  };

  // 修改事件
  doUpdate = (id) => {
    sessionStorage.setItem('updateId', id);
    const { dispatch } = this.props;
    dispatch(routerRedux.push('/order/update'));
  };

// 取消订单事件
cancel = (id) => {
  const that = this;
  const dataSource = [...this.state.listShow];
  const formData = new FormData();
  formData.append('tokenId', argument.tokenId);
  formData.append('tenantId', argument.tenantId);
  formData.append('version', argument.version);
  formData.append('active', 1);
  formData.append('id', id);
  formData.append('orderStatusId',this.state.cancelId);
  fetch( URL + '/order/cancelOrderById/v1', {
  //fetch('/order/deleteOrderById/v1', {
      method: 'post',
      mode: 'cors',
      body: formData
  }).then(function(res) {
      if (res.ok) {
          res.json().then(function (data) {
            // //console.log(JSON.parse(data.data))
            if(data.code === '0') {
              that.doQuery();
              message.success(data.msg);
            } else {
              message.error(data.msg);
            }
          });
      } else if (res.status === 401) {
          //console.log("Oops! You are not authorized.");
      }
  }).then(error=>{
      ////console.log(JSON.stringify(error));
  });
}


  // 删除订单事件
  deleteList = (id) => {
    const that = this;
    const dataSource = [...this.state.listShow];
    const formData = new FormData();
    formData.append('tokenId', argument.tokenId);
    formData.append('tenantId', argument.tenantId);
    formData.append('version', argument.version);
    formData.append('active', 1);
    formData.append('id', id);
    fetch( URL + '/order/deleteOrderById/v1', {
    //fetch('/order/deleteOrderById/v1', {
        method: 'post',
        mode: 'cors',
        body: formData
    }).then(function(res) {
        if (res.ok) {
            res.json().then(function (data) {
              if(data.code === '0') {
                message.success(data.msg)
                setTimeout(function(){
                  that.doQuery();
                  that.setState({listShow: dataSource.filter(item => item.id !== id)});
                }, 500);
              } else {
                message.error(data.msg);
              }
            });
        } else if (res.status === 401) {
            //console.log("Oops! You are not authorized.");
        }
    }).then(error=>{
        ////console.log(JSON.stringify(error));
    });
  }


  // 排序
  onChange = (pagination, filters, sorter) => {
    const that = this;
    const formData = new FormData();
    formData.append('tokenId', argument.tokenId);
    formData.append('tenantId', argument.tenantId);
    formData.append('version', argument.version);
    formData.append('active', 1);
    formData.append('orderBy', sorter.columnKey);
    formData.append('sort', sorter.order);
    formData.append('rowSize', this.state.rowSize);
    formData.append('currentPage', this.state.currentPage);
    fetch(URL + '/order/getOrderList/v1', {
        method: 'post',
        mode: 'cors',
        body: formData
    }).then(function(res) {
        if (res.ok) {
            res.json().then(function (data) {
                if (data.code === "0") {
                    that.setState({
                      listShow: JSON.parse(data.data).orderList,
                      dataCount: JSON.parse(data.data).dataCount,
                      orderBy: sorter.columnKey,
                      sort: sorter.order,
                    });
                }
            });
        } else if (res.status === 401) {
            // //console.log("Oops! You are not authorized.");
        }
    }).then(error=>{
        // //console.log(JSON.stringify(error));
    });
  }




//分页
changePage=(page, pageSize)=>{

  const that = this;
  const formData = new FormData();
  formData.append('tokenId', argument.tokenId);
  formData.append('tenantId', argument.tenantId);
  formData.append('version', argument.version);
  formData.append('number', this.state.orderValue);
  formData.append('customerName', this.state.customerValue);
  formData.append('name', this.state.nameValue);
  formData.append('orderStatusId', this.state.statusValue);
  formData.append('orderTime', this.state.timevalue);
  formData.append('deliveryTime', this.state.timevalueJ);
  formData.append('rowSize', pageSize);
  formData.append('currentPage', page);
  formData.append('active', 1);
  formData.append('orderBy', this.state.orderBy);
  formData.append('sort', this.state.sort);
  fetch( URL + '/order/getOrderList/v1', {
      method: 'post',
      mode: 'cors',
      body: formData
  }).then(function(res) {
      if (res.ok) {
          res.json().then(function (data) {
            // //console.log(JSON.parse(data.data).stockList);
            if (data.code === "0") {
              that.setState({
                listShow: JSON.parse(data.data).orderList,
                rowSize: pageSize,
                currentPage: page,
              })
          }
          });
      } else if (res.status === 401) {
          //console.log("Oops! You are not authorized.");
      }
  }).then(error=>{
      //console.log(JSON.stringify(error));
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

  // 重置事件
  handleFormReset = () => {
    const { form, dispatch } = this.props;
    form.resetFields();
    this.setState({
      orderValue: '',   //用户Value
      nameValue: '',  // 订单名称
      customerValue: '',  // 客户
      statusValue: '',  // 状态
      timevalue: '',  // 下单日期
      timevalueJ: '', // 交货日期
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
      <Form onSubmit={this.handleSearch} layout="inline" style={{marginBottom:40}}>
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="订单编号">
              {getFieldDecorator('no',{

              rules: [{ max: 30, message: '您输入的字符过长' }],
            })

              (
                <Input placeholder="请输入" maxLength="31" style={{width:'150%'}} onChange={this.changeValue}/>
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="客户名称">
              {getFieldDecorator('no1',{

              rules: [{ max: 30, message: '您输入的字符过长' }],
            })(
                   <Input placeholder="请输入" maxLength="31" style={{width:'150%'}} onChange={this.inputValue} />
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <Button type="primary" onClick={this.doQuery} onKeyDown={this.handleEnterKey}>查询</Button>
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
      <Form onSubmit={this.handleSearch} layout="inline" style={{marginBottom:20}}>
        <Row gutter={{ md: 8, lg: 24, xl: 48 }} style={{marginBottom:10}}>
          <Col md={8} sm={24}>
            <FormItem label="订单编号">
              {getFieldDecorator('no',{

              rules: [{ max: 30, message: '您输入的字符过长' }],
            })(
                <Input placeholder="请输入" maxLength="31" style={{width:'150%'}} onChange={this.changeValue} />
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
              <FormItem label="订单名称">
                {getFieldDecorator('status1',{

              rules: [{ max: 30, message: '您输入的字符过长' }],
            })(
                     <Input placeholder="请输入" maxLength="31" style={{width:'150%'}}  onChange={this.input1} />
                )}
              </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="客户名称">
              {getFieldDecorator('no1',{

              rules: [{ max: 30, message: '您输入的字符过长' }],
            })(
                   <Input placeholder="请输入"  maxLength="31" style={{width:'150%'}} onChange={this.inputValue} />
              )}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={{ md: 8, lg: 24, xl: 48 }} style={{marginBottom:20}}>
          <Col md={8} sm={24}>
            <FormItem label="订单状态">
              {getFieldDecorator('status2', {initialValue:'全部'})(
                 <Select placeholder="请输入"   style={{width:250}} onChange={this.input2}>
                 <Option value='all'>
                            全部
                            </Option>

                     {
                         this.state.statusList.map(function (item) {
                             return (
                                 <Option value={item.id} key={item}>
                                    {item.name}
                                 </Option>
                             )})
                     }
                 </Select>
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="下单日期">
               {getFieldDecorator('status3')(
                  <DatePicker style={{ width: '100%' }} placeholder="请输入更新日期" style={{width:'150%'}} onChange={this.input3} />
               )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="交货日期">
               {getFieldDecorator('status4')(
                  <DatePicker style={{ width: '100%' }} placeholder="请输入更新日期" style={{width:'150%'}} onChange={this.input4} />
               )}
            </FormItem>
          </Col>
        </Row>
        <div style={{ overflow: 'hidden', textAlign: 'center'}}>
          <span>
            <Button type="primary" onClick={this.doQuery} onKeyDown={this.handleEnterKey}>查询</Button>
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

    // 定义复选框的事件
    const rowSelection = {
      onChange(selectedRowKeys) {
        //获取该条数据的key
        //console.log(selectedRowKeys);
      }
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
        title: '订单编号',
        dataIndex: 'number',
        key: 'number',
        sorter: (a, b) => {},
      },
      {
        title: '订单名称',
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: '客户名称',
        dataIndex: 'customerName',
        key: 'customerName',
      },
      {
        title: '联系电话',
        dataIndex: 'customerPhone',
        key: 'customerPhone',
      },
      {
        title: '总件数',
        dataIndex: 'totalNumber',
        key: 'totalNumber',
        sorter: (a, b) => {},
      },
      {
        title: '下单日期',
        dataIndex: 'orderTime',
        key: 'orderTime',
        sorter: (a, b) => {},
      },
      {
        title: '交货日期',
        dataIndex: 'deliveryTime',
        key: 'deliveryTime',
        render:(text,record) =>(
          <span>
             {record.deliveryTime=='2000-01-01'?'':record.deliveryTime}
          </span>
        )
      },
      {
        title: '订单状态',
        dataIndex: 'orderStatusName',
        key: 'orderStatusName',
      },
      {
        title: '详情',
        key: 'hello',
        render: (record) => (

          <Fragment>
            <a onClick={() => this.doCheck(record.id)} >查看</a>
            <Divider type="vertical" />
            <a onClick={() => this.doUpdate(record.id)} >修改</a>
            <Divider type="vertical" />
             {record.orderStatusName=='已取消'?<Popconfirm title="确定删除订单吗？" okText="是" cancelText="否" onConfirm={() => this.deleteList(record.id)}>
                 <a href="#">删除</a>
            </Popconfirm>:(record.orderStatusName=='生产中'||record.orderStatusName=='已完成'||record.orderStatusName=='已超额'  ?  <span>取消</span> : <Popconfirm title="确定取消订单吗？" okText="是" cancelText="否" onConfirm={() => this.cancel(record.id)}>
                 <a href="#">取消</a>
            </Popconfirm>)  }
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
            <div style={{  height: 30 }}></div>
            <Table
              dataSource={ this.state.listShow }
              columns={columns}
              // rowSelection={rowSelection}
              rowKey={record => record.id}
              onkey={this.doCheck}
              pagination={false}
              onChange={this.onChange}
            />
          </div>
          <div className={styles.changePage}>
<Pagination size="small" total={parseInt(this.state.dataCount)} onChange={this.changePage} showQuickJumper />
</div>
        </Card>
      </PageHeaderLayout>
    );
  }
}

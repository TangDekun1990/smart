import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { Row, Col, Card, Form, Input, Select, Icon, Button, Dropdown, Menu, InputNumber, DatePicker, Modal, message, Badge, Divider, Table, Popconfirm } from 'antd';
import StandardTable from '../../components/StandardTable';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import URL from '../../utils/api';
import { routerRedux } from 'dva/router';


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


export default class TableList extends PureComponent {
  state = {
    modalVisible: false,
    expandForm: false,
    selectedRows: [],
    formValues: {},
    listShow: [],  // 列表数据
    value5:'',
    value1:'',
    value2:'',
    value3:'',
    value4:'',
    productCategoryList:[],
    orderList:[]

  };
  componentDidMount() {
    if(localStorage.getItem('loginId')===null) {
      const { dispatch } = this.props;
      message.error('请先登录!')
      dispatch(routerRedux.push('/user/login'));
      return;
       }
    document.addEventListener("keydown", this.handleEnterKey);
    const that = this;
    const formData = new FormData();
    formData.append('tokenId', '01');
    formData.append('tenantId', 1);
    formData.append('version', 1);
    formData.append('active', 1);
    fetch(URL + '/deliveritem/getDeliverItemList/v1', {
        method: 'post',
        mode: 'cors',
        body: formData
    }).then(function(res) {
        if (res.ok) {
            res.json().then(function (data) {               
                if (data.code === "0") {
                  // console.log(JSON.parse(data.data).productCategoryList);
                    that.setState({listShow: JSON.parse(data.data).deliveritemList});  
                    that.setState({productCategoryList: JSON.parse(data.data).productCategoryList});
                    that.setState({orderList: JSON.parse(data.data).orderList});              
                }
            });
        } else if (res.status === 401) {
            console.log("Oops! You are not authorized.");
        }
    }).then(error=>{
        console.log(JSON.stringify(error));
    });
  }
//本地测试
// componentDidMount() {
//   const that = this;
//   const formData = new FormData();
//   formData.append('tokenId', '01');
//   formData.append('tenantId', 1);
//   formData.append('version', 1);
//   formData.append('active', 1);
//   fetch('/deliveritem/getDeliverItemList/v1', {
//       method: 'post',
//       mode: 'cors',
//       body: formData
//   }).then(function(res) {
//       if (res.ok) {
//           res.json().then(function (data) {               
//               if (data.code === "0") {
//                 // console.log(JSON.parse(data.data).productCategoryList);
//                   that.setState({listShow: data.data.deliveritemList});  
//                   that.setState({productCategoryList: data.data.productCategoryList});
//                   that.setState({orderList: data.data.orderList});              
//               }
//           });
//       } else if (res.status === 401) {
//           console.log("Oops! You are not authorized.");
//       }
//   }).then(error=>{
//       console.log(JSON.stringify(error));
//   });
// }

  
  //  删除库存
  remove = (id) => {
    const that = this;
    const dataSource = [...this.state.listShow];
    const formData = new FormData();
    formData.append('tokenId', '01');
    formData.append('tenantId', 1);
    formData.append('id', id );
    formData.append('version', 1);
    fetch( URL + '/deliveritem/deleteDeliverItemById/v1', {
        method: 'post',
        mode: 'cors',
        body: formData
    }).then(function(res) {
        if (res.ok) {
            res.json().then(function (data) {
              // console.log(data);
              that.setState({listShow: dataSource.filter(item => item.id !== id)});
            });
        } else if (res.status === 401) {
            console.log("Oops! You are not authorized.");
        }
    }).then(error=>{
        console.log(JSON.stringify(error));
    });
  }
//本地测试删除
// remove = (id) => {
//   const that = this;
//   const dataSource = [...this.state.listShow];
//   const formData = new FormData();
//   formData.append('tokenId', '01');
//   formData.append('tenantId', 1);
//   formData.append('id', id );
//   formData.append('version', 1);
//   fetch('/deliveritem/getDeliverItemList/v1', {
//       method: 'post',
//       mode: 'cors',
//       body: formData
//   }).then(function(res) {
//       if (res.ok) {
//           res.json().then(function (data) {
//             // console.log(data);
//             that.setState({listShow: dataSource.filter(item => item.id !== id)});
//           });
//       } else if (res.status === 401) {
//           console.log("Oops! You are not authorized.");
//       }
//   }).then(error=>{
//       console.log(JSON.stringify(error));
//   });
// }

  // 查询按钮事件
  doQuery = () => {
      const that = this;
      const formData = new FormData();
      formData.append('productCategoryId', this.state.value1 );
      formData.append('productName', this.state.value2 );
      formData.append('number', this.state.value3 );
      formData.append('orderNumber', this.state.value4);
      formData.append('deliverTime', this.state.value5 );
      formData.append('version', 1);
      formData.append('tokenId', '01');
      formData.append('tenantId', 1);
      formData.append('active', 1);
      fetch( URL + '/deliveritem/getDeliverItemList/v1', {
          method: 'post',
          mode: 'cors',
          body: formData
      }).then(function(res) {
          if (res.ok) {
              res.json().then(function (data) {
                // console.log(JSON.parse(data.data).stockList);
                if (data.code === "0") {
                  that.setState({listShow: JSON.parse(data.data).deliveritemList})
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
    const { form } = this.props;
    form.resetFields();
    this.setState({
      value5:'',
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
  
  //  选择物品类别
  handleChange1 = (value) => {
    this.setState({
      value1: value,
    });
  }
  // 选择物品名称
  handleChange2 = (e) => {
    this.setState({
      value2: e.target.value,
    });
  }
  // 发货编号
  handleChange3 = (e) => {
    this.setState({
      value3: e.target.value,
    });
  }
  //订单编号
  handleChange4 = (e) => {
    this.setState({
      value4: e.target.value,
    });
  }


  //发货时间
  
  handleChange5 = (value) => {
    this.setState({
      value5: value,
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
      <Form onSubmit={this.handleSearch} layout="inline" style={{ marginBottom:30 }}>
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
        <Col md={8} sm={24}>
            <FormItem label="物品类别">
            {getFieldDecorator('no1')(
              <Select className={styles.select} onChange={this.handleChange1}  placeholder="请选择">
                   {
                       this.state.productCategoryList.map(function(item){
                            return (
                            <Option value={item.id} key={item.id}>
                            {item.name}
                            </Option>)
                       })
                   }
                     </Select>
            )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="物品名称">
              {getFieldDecorator('no2')(
                   <Input placeholder="请输入" onChange={this.handleChange2} />
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
      <Form onSubmit={this.handleSearch} layout="inline" style={{ marginBottom:30 }}>
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
        <Col md={8} sm={24}>
            <FormItem label="物品类别">
            {getFieldDecorator('no1')(
              <Select className={styles.select} onChange={this.handleChange1}  placeholder="请选择">
                   {
                       this.state.productCategoryList.map(function(item){
                            return (
                            <Option value={item.id} key={item.id}>
                            {item.name}
                            </Option>)
                       })
                   }
                     </Select>
            )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="物品名称">
              {getFieldDecorator('no2')(
                   <Input placeholder="请输入" onChange={this.handleChange2} />
              )}
            </FormItem>
          </Col>
         
          <Col md={8} sm={24}>
            <FormItem label="发货编号">
              {getFieldDecorator('no3')(
                <Input placeholder="请输入" onChange={this.handleChange3} />
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="订单编号">
              {getFieldDecorator('no4')(
                <Input placeholder="请输入" onChange={this.handleChange4} />
              )}
            </FormItem>
          </Col>
         
          <Col md={8} sm={24} >
            <FormItem label="发货时间">
            {getFieldDecorator('date')(
                <DatePicker style={{ width: '100%' }} placeholder="请输入" onChange={this.handleChange5} />
              )}
              {/* {getFieldDecorator('no5')(
                 <Input placeholder="请输入" onChange={this.handleChange5} />
              )} */}
            </FormItem>
          </Col>
          
        
        
        
         
          <Col md={8} sm={24} >
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
    dispatch(routerRedux.push('/deliver/update'));
  };
  
  render() {
    //const { rule: { data }, loading } = this.props;
    const { selectedRows, modalVisible } = this.state;
    //const { listShow } = this.state;
    const { dispatch } = this.props;
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
            title: '发货编号',
            dataIndex: 'number',
            key: 'number',
          },
          {
            title: '订单编号',
            dataIndex: 'orderNumber',
            key: 'orderNumber',
          },
          {
            title: '物品类别',
            dataIndex: 'productCategoryName',
            key: 'productCategoryName',
          },
          {
            title: '物品名称',
            dataIndex: 'productName',
            key: 'productName',
          },
          {
            title: '发货数量',
            dataIndex: 'productQuantity',
            key: 'productQuantity',
            sorter: (a, b) => a.productQuantity - b.productQuantity,
          },
          {
            title: '物品单位',
            dataIndex: 'unitValue',
            key: 'unitValue',
          },
          {
            title: '发货时间',
            dataIndex: 'deliverTime',
            key: 'deliverTime',
            // sorter: (a, b) => a.deliverTime - b.deliverTime,
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
            <div style={{  height: 30 }}></div>

            <Table
              dataSource={ this.state.listShow }
              columns={columns}
              rowKey={record => record.id}
              rowSelection={this.state.selectedRows}
              onKey={this.remove}
              onKey={this.doUpdate}
              onChange={this.handleStandardTableChange}
            />
          </div>
        </Card>
      </PageHeaderLayout>
    );
  }
}

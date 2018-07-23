import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { Row, Col, Card, Form, Input, Select, Icon, Button,
  Dropdown, Menu, InputNumber, DatePicker, Modal, message, Badge, Divider, Table, Popconfirm, Pagination} from 'antd';
import StandardTable from '../../components/StandardTable';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import URL from '../../utils/api';
import { routerRedux } from 'dva/router';
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


export default class ProductionList extends PureComponent {

  state = {
    modalVisible: false,
    expandForm: false,
    selectedRows: [],
    formValues: {},
    listShow: [],  // 列表数据
    statusList: [],  // 状态列表数据
    input1: [],  // 订单编号
    input2: [],  // 订单状态
    input3: [],  // 订单名称
    input4: [],  // 花样名称
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

    const { dispatch } = this.props;
    dispatch({
      type: 'rule/fetch',
    });
    document.addEventListener("keydown", this.handleEnterKey);  // 监听键盘事件

    const that = this;
    const formData = new FormData();
    formData.append('tokenId', argument.tokenId);
    formData.append('tenantId', argument.tenantId);
    formData.append('version', argument.version);
    formData.append('active', 1);
    fetch( URL + '/productionInstruction/getProductionInstructionList/v1', {
      method: 'post',
      mode: 'cors',
      body: formData
    }).then(function(res) {
      if (res.ok) {
        res.json().then(function (data) {
          if (data.code === '0') {
            that.setState({
              statusList: JSON.parse(data.data).sendProductionInstructionStatusList,
              listShow: JSON.parse(data.data).productionInstructionList,
              dataCount: JSON.parse(data.data).dataCount
            })
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

  componentWillUnmount(){
    //重写组件的setState方法，直接返回空
    this.setState = (state,callback)=>{
      return;
    };
  }


  // 订单
  input1 = (e) => {
    this.setState({
      input1: e.target.value
    })
  }
  // 订单状态
  input2 = (value) => {
    this.setState({
      input2: value
    })
  }
  // 订单名称
  input3 = (e) => {
    this.setState({
      input3: e.target.value
    })
  }
  // 花样名称
  input4 = (e) => {
    this.setState({
      input4: e.target.value
    })
  }

  // 查询按钮事件
  doQuery = () => {
    const that = this;
    const formData = new FormData();
    formData.append('orderNumber', this.state.input1);
    formData.append('sendProductionInstructionStatusId', this.state.input2);
    formData.append('orderName', this.state.input3);
    formData.append('designName', this.state.input4);
    formData.append('tokenId', argument.tokenId);
    formData.append('tenantId', argument.tenantId);
    formData.append('version', argument.version);
    formData.append('active', 1);
    fetch( URL + '/productionInstruction/getProductionInstructionList/v1', {
      method: 'post',
      mode: 'cors',
      body: formData
    }).then(function(res) {
      if (res.ok) {
        res.json().then(function (data) {
          if (data.code === '0') {
            that.setState({
              listShow: JSON.parse(data.data).productionInstructionList,
              dataCount: JSON.parse(data.data).dataCount
            })
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

  // 查询的键盘事件
  handleEnterKey = (e) => {
    if(e.keyCode === 13){
        {this.doQuery()};
    }
  }

  // 查看详情
  check = (id) => {
    sessionStorage.setItem('dataId', id);
    const { dispatch } = this.props;
    dispatch(routerRedux.push('/ProductionControl/details'));
  }

  // 点击翻页
  changePage = (page, pageSize) => {
    const that = this;
    const formData = new FormData();
    formData.append('tokenId', argument.tokenId);
    formData.append('tenantId', argument.tokenId);
    formData.append('version', argument.tokenId);
    formData.append('orderNumber', this.state.input1);
    formData.append('sendProductionInstructionStatusId', this.state.input2);
    formData.append('orderName', this.state.input3);
    formData.append('designName', this.state.input4);
    formData.append('active', 1);
    formData.append('rowSize', pageSize);
    formData.append('currentPage', page);
    fetch(URL + '/productionInstruction/getProductionInstructionList/v1', {
        method: 'post',
        mode: 'cors',
        body: formData
    }).then(function(res) {
        if (res.ok) {
            res.json().then(function (data) {
                if (data.code === '0') {
                    that.setState({
                      listShow: JSON.parse(data.data).productionInstructionList
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
      input1: [],  // 订单编号
      input2: [],  // 订单状态
      input3: [],  // 订单名称
      input4: [],  // 花样名称
    });
    {this.componentDidMount()}
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
                <Input placeholder="请输入" maxLength='30' onChange={this.input1} />
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="指令状态">
              {getFieldDecorator('no')(
                <Select placeholder="请选择" onChange={this.input2} >
                    {
                     this.state.statusList.map(function(item) {
                       return(
                          <Option value={item.id} key={item.id}>
                              {item.name}
                          </Option>
                       )
                     })
                    }
                </Select>
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <Button type="primary"  onClick={this.doQuery} onKeyDown={this.handleEnterKey} >查询</Button>
            <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>重置</Button>
            <a style={{ marginLeft: 8 }} onClick={this.toggleForm}>
              展开 <Icon type="down" />
            </a>
          </Col>
        </Row>
      </Form>
    );
  }

  renderSimpleForm() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form onSubmit={this.handleSearch} layout="inline" style={{ marginBottom:40 }}>
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="订单编号">
              {getFieldDecorator('no1')(
                <Input placeholder="请输入" maxLength='30' style={{width:'150%'}} onChange={this.input1} />
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="指令状态">
              {getFieldDecorator('no')(
                <Select placeholder="请选择" style={{width:248}} onChange={this.input2} >
                    {
                     this.state.statusList.map(function(item) {
                       return(
                          <Option value={item.id} key={item.id}>
                              {item.name}
                          </Option>
                       )
                     })
                    }
                </Select>
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <Button type="primary"  onClick={this.doQuery} onKeyDown={this.handleEnterKey} >查询</Button>
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
      <Form onSubmit={this.handleSearch} layout="inline" style={{ marginBottom:40 }}>
        <Row gutter={{ md: 8, lg: 24, xl: 48 }} style={{ marginBottom:20 }}>
          <Col md={8} sm={24}>
            <FormItem label="订单编号">
              {getFieldDecorator('no1')(
                <Input placeholder="请输入" maxLength='30' style={{width:'150%'}} onChange={this.input1} />
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="指令状态">
              {getFieldDecorator('no')(
                <Select placeholder="请选择" style={{width:248}} onChange={this.input2} >
                    {
                     this.state.statusList.map(function(item) {
                       return(
                          <Option value={item.id} key={item.id}>
                              {item.name}
                          </Option>
                       )
                     })
                    }
                </Select>
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="订单名称">
              {getFieldDecorator('status1')(
                <Input placeholder="请输入" maxLength='30' style={{width:'150%'}} onChange={this.input3}/>
              )}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="花样名称">
              {getFieldDecorator('status2')(
                <Input placeholder="请输入" maxLength='30' style={{width:'150%'}} onChange={this.input4}/>
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <Button type="primary" onClick={this.doQuery} onKeyDown={this.handleEnterKey}>查询</Button>
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


  render() {
    const { selectedRows, modalVisible } = this.state;


    const menu = (
      <Menu onClick={this.handleMenuClick} selectedKeys={[]}>
        <Menu.Item key="remove">删除</Menu.Item>
        <Menu.Item key="approval">批量审批</Menu.Item>
      </Menu>
    );

    // 定义复选框的事件
    const rowSelection = {
      onChange(selectedRowKeys) {
        //获取该条数据的key
        console.log(selectedRowKeys);
      }
    };

    const parentMethods = {
      handleAdd: this.handleAdd,
      handleModalVisible: this.handleModalVisible,
    };

    const columns = [
      {
        title: '创建日期',
        dataIndex: 'createTime',
        key: 'createTime',
        align:'center'
      },
      {
        title: '订单编号',
        dataIndex: 'orderNumber',
        key: 'orderNumber',
        align:'center'
      },
      {
        title: '订单名称',
        dataIndex: 'orderName',
        key: 'orderName',
        align:'center'
      },
      {
        title: '花样名称',
        dataIndex: 'designName',
        key: 'designName',
        align:'center'
      },
      {
        title: '服务器中的花样号',
        dataIndex: 'designNumber',
        key: 'designNumber',
        align:'center'
      },
      {
        title: '成功下发机器数',
        dataIndex: 'sentToMachinesQuantity',
        key: 'sentToMachinesQuantity',
        align:'center'
      },
      {
        title: '选择机器数',
        dataIndex: 'selectedMachinesQuantity',
        key: 'selectedMachinesQuantity',
        align:'center'
      },
      {
        title: '当前成功率',
        dataIndex: 'finishedRate',
        key: 'finishedRate',
        align:'center'
      },
      // {
      //   title: '预计完成时间',
      //   dataIndex: 'expectedFinishedTime',
      //   key: 'expectedFinishedTime',
      //   align:'center'
      // },
      {
        title: '状态',
        dataIndex: 'sendOrderStatusName',
        key: 'sendOrderStatusName',
        align:'center',
        width: '8%'
      },
      {
        title: '详情',
        key: 'hello',
        align:'center',
        render: (record) => (
          <Fragment>
            <a onClick={() => this.check(record.id)}>查看详情</a>
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
            <Table
              dataSource={ this.state.listShow }
              columns={columns}
              rowKey={record => record.id}
              rowSelection={rowSelection}
              onkey={this.check}
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

import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { Row, Col, Card, Form, Input, Select,Pagination, Icon, Button, Dropdown, Menu,Breadcrumb, InputNumber, DatePicker, Modal, message, Badge, Divider, Table, Popconfirm } from 'antd';
import StandardTable from '../../components/StandardTable';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import URL from '../../utils/api';
import { routerRedux } from 'dva/router';
import argument from '../../utils/argument';

import styles from './TableList1.less';

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
    workshopList:[],
    machineStatusList:[],
    dataCount:'',
    orderBy: '' ,
    sort: '',
    rowSize: '',
    currentPage: '',
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
    formData.append('tokenId', argument.tokenId);
    formData.append('tenantId', argument.tenantId);
    formData.append('version', argument.version);
    formData.append('active', 1);
    fetch(URL + '/machine/getMachineList/v1', {
        method: 'post',
        mode: 'cors',
        body: formData
    }).then(function(res) {
        if (res.ok) {
            res.json().then(function (data) {
                if (data.code === "0") {
                    that.setState({listShow: JSON.parse(data.data).machineList});
                    that.setState({workshopList: JSON.parse(data.data).workshopList});
                    that.setState({machineStatusList: JSON.parse(data.data).machineStatusList});
                    that.setState({dataCount: JSON.parse(data.data).pageCount});
                }
            });
        } else if (res.status === 401) {
            // //console.log("Oops! You are not authorized.");
        }
    }).then(error=>{
        // //console.log(JSON.stringify(error));
    });
  }
  remove = (id) => {
    let mac='';
    const that = this;
     that.state.listShow.map(function(item){

        if(id==item.id){
            mac=item.machineMac
        }
     })




    const dataSource = [...this.state.listShow];
    const formData = new FormData();
    formData.append('tokenId', argument.tokenId);
    formData.append('tenantId', argument.tenantId);
    formData.append('version', argument.version);
    formData.append('active', 1);
    formData.append('id', id );
    formData.append('machineMac', mac );
    fetch( URL + '/machine/deleteMachineById/v1', {
        method: 'post',
        mode: 'cors',
        body: formData
    }).then(function(res) {
        if (res.ok) {
            res.json().then(function (data) {
              // //console.log(data);
              that.setState({listShow: dataSource.filter(item => item.id !== id)});
            });
        } else if (res.status === 401) {
            //console.log("Oops! You are not authorized.");
        }
    }).then(error=>{
        //console.log(JSON.stringify(error));
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
    fetch(URL + '/machine/getMachineList/v1', {
        method: 'post',
        mode: 'cors',
        body: formData
    }).then(function(res) {
        if (res.ok) {
            res.json().then(function (data) {
                if (data.code === "0") {
                    that.setState({
                      listShow: JSON.parse(data.data).machineList,
                      dataCount: JSON.parse(data.data).pageCount,
                      oderBy: sorter.columnKey,
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
  formData.append('name', this.state.value1 );
  formData.append('machineEventId', this.state.value2 );
  formData.append('model', this.state.value3 );
  formData.append('workshop', this.state.value4);
  formData.append('rowSize', pageSize);
  formData.append('currentPage', page);
  formData.append('active', 1);
  formData.append('orderBy', this.state.oderBy);
  formData.append('sort', this.state.sort);
  fetch( URL + '/machine/getMachineList/v1', {
      method: 'post',
      mode: 'cors',
      body: formData
  }).then(function(res) {
      if (res.ok) {
          res.json().then(function (data) {
            // //console.log(JSON.parse(data.data).stockList);
            if (data.code === "0") {
              that.setState({
                listShow: JSON.parse(data.data).machineList,
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


  // 查询按钮事件
  doQuery = () => {
      const that = this;
      const formData = new FormData();
      formData.append('name', this.state.value1 );
      formData.append('machineEventId', this.state.value2 );
      formData.append('model', this.state.value3 );
      formData.append('workshop', this.state.value4);
      formData.append('tokenId', argument.tokenId);
      formData.append('tenantId', argument.tenantId);
      formData.append('version', argument.version);
      formData.append('active', 1);
      fetch( URL + '/machine/getMachineList/v1', {
          method: 'post',
          mode: 'cors',
          body: formData
      }).then(function(res) {
          if (res.ok) {
              res.json().then(function (data) {
                // //console.log(JSON.parse(data.data).stockList);
                if (data.code === "0") {
                  that.setState({listShow: JSON.parse(data.data).machineList})
                  that.setState({dataCount: JSON.parse(data.data).pageCount});
              }
              });
          } else if (res.status === 401) {
              //console.log("Oops! You are not authorized.");
          }
      }).then(error=>{
          //console.log(JSON.stringify(error));
      });
  }


  // handleStandardTableChange = (pagination, filtersArg, sorter) => {
  //   const { dispatch } = this.props;
  //   const { formValues } = this.state;
  //
  //   const filters = Object.keys(filtersArg).reduce((obj, key) => {
  //     const newObj = { ...obj };
  //     newObj[key] = getValue(filtersArg[key]);
  //     return newObj;
  //   }, {});
  //
  //   const params = {
  //     currentPage: pagination.current,
  //     pageSize: pagination.pageSize,
  //     ...formValues,
  //     ...filters,
  //   };
  //   if (sorter.field) {
  //     params.sorter = `${sorter.field}_${sorter.order}`;
  //   }

  //   dispatch({
  //     type: 'rule/fetch',
  //     payload: params,
  //   });
  // }

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

  //  选择机器名称
  handleChange1 = (e) => {
    this.setState({
      value1: e.target.value,
    });
  }
  // 当前状态
  handleChange2 = (value) => {
    this.setState({
      value2: value,
    });
  }
  // 电控型号
  handleChange3 = (e) => {
    this.setState({
      value3: e.target.value,
    });
  }
  //车间名称
  handleChange4 = (value) => {
    this.setState({
      value4: value,
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
      <Form onSubmit={this.handleSearch} layout="inline" style={{ marginBottom:40 }}>
        <Row gutter={{ md: 8, lg: 24, xl: 48 }} >
        <Col md={8} sm={24}>
            <FormItem label="机器名称">
            {getFieldDecorator('no1',{

              rules: [{ max: 30, message: '您输入的字符过长' }],
            })(
                   <Input placeholder="请输入" maxLength="31" style={{width:'150%'}} onChange={this.handleChange1} />
              )}
            </FormItem>
          </Col>
          <Col md={9} sm={24}>
            <FormItem label="当前状态">
            {getFieldDecorator('no2')(
              <Select className={styles.select} onChange={this.handleChange2} style={{width:250}} placeholder="请选择">
                   {
                       this.state.machineStatusList.map(function(item){
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


          <Col md={7} sm={24} >
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
        <Row gutter={{ md: 8, lg: 24, xl: 48 }} >
        <Col md={8} sm={24} style={{ marginBottom:20 }} >
            <FormItem label="机器名称">
            {getFieldDecorator('no1',{

              rules: [{ max: 30, message: '您输入的字符过长' }],
            })(
                   <Input placeholder="请输入" maxLength="31" style={{width:'150%'}} onChange={this.handleChange1} />
              )}
            </FormItem>
          </Col>
          <Col md={9} sm={24} style={{ marginBottom:20 }}>
            <FormItem label="当前状态">
            {getFieldDecorator('no2')(
              <Select className={styles.select} onChange={this.handleChange2}  style={{width:250}} placeholder="请选择">
                   {
                       this.state.machineStatusList.map(function(item){
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
            <FormItem label="电控型号" style={{ marginBottom:20 }}>
              {getFieldDecorator('no3',{

              rules: [{ max: 30, message: '您输入的字符过长' }],
            })(
                <Input placeholder="请输入" maxLength="31" style={{width:'150%'}} onChange={this.handleChange3} />
              )}
            </FormItem>
          </Col>


          <Col md={8} sm={24} >
            <FormItem label="车间名称">
            {getFieldDecorator('no4')(
              <Select className={styles.select} onChange={this.handleChange4} style={{width:250}}  placeholder="请选择">
                   {
                       this.state.workshopList.map(function(item){
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

          <Col md={8} sm={24} style={{verticalAlign:'middle'}} >
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
    dispatch(routerRedux.push('/machines/updateMachine'));
  };

  render() {
    //const { rule: { data }, loading } = this.props;
    const { selectedRows, modalVisible } = this.state;
    //const { listShow } = this.state;
    const { dispatch } = this.props;
    const { getFieldDecorator } = this.props;
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
            title: '机器名称',
            dataIndex: 'name',
            key: 'name',
            sorter: (a, b) => {},
          },
          {
            title: '机器编码',
            dataIndex: 'machineMac',
            key: 'machineMac',
          },
          {
            title: '电控型号',
            dataIndex: 'model',
            key: 'model',
          },
          {
            title: 'IP地址',
            dataIndex: 'ip',
            key: 'ip',
            render:(text, record) => (
              <span>
                {record.ip?record.ip:'未分配'}
              </span>
            ),
          },
          {
            title: '车间名称',
            dataIndex: 'workshopName',
            key: 'workshopName',
            // sorter: (a, b) => a.productQuantity - b.productQuantity,
          },
          {
            title: '当前系统',
            dataIndex: 'system',
            key: 'system',
          },
          {
            title: '平均转速',
            dataIndex: 'averageSpeed',
            key: 'averageSpeed',
            // sorter: (a, b) => a.averageSpeed - b.averageSpeed,
          },
          {
            title: '当前花样类型',
            dataIndex: 'designCategoryName',
            key: 'designCategoryName',
          },
          {
            title: '当前花样',
            dataIndex: 'patternName',
            key: 'patternName',
          },
          {
            title: '当前状态',
            dataIndex: 'machineEventValue',
            key: 'machineEventValue',
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
            <div style={{  height: 30 }}></div>

            <Table
              bordered={true}
              dataSource={ this.state.listShow }
              columns={columns}
              rowKey={record => record.id}
              // rowSelection={this.state.selectedRows}
              onKey={this.remove}
              onKey={this.doUpdate}
              onChange={this.onChange}
              pagination={false}
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

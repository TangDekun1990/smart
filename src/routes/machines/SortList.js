import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { Row, Col, Card, Form, Pagination,Input, Select, Icon, Button, Dropdown, Menu, InputNumber, DatePicker, Modal, message, Badge, Divider, Table, Popconfirm,Breadcrumb, List } from 'antd';
import StandardTable from '../../components/StandardTable';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import URL from '../../utils/api';
import { routerRedux } from 'dva/router';
import styles from './TableList1.less';
import argument from '../../utils/argument';
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
    expandForm: true,
    selectedRows: [],
    formValues: {},
    listShow: [],  // 列表数据
    value1:'',
    value2:[],
    value3:'',
    value4:'',
    value5:'',
    value6:'',
    value7:'',
    groupList:[],
    userList:[],
    workshopList:[],
    selectedRowKeys: [],
    loading: false,
    userList1:[],
    groupList1:[],
    userList2:[],
    dataCount:'',
    daylist:[],
    nightlist:[]
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
    fetch(URL+'/machine/getMachineListByFactory/v1', {
        method: 'post',
        mode: 'cors',
        body: formData
    }).then(function(res) {
        if (res.ok) {
            res.json().then(function (data) {

                if (data.code === "0") {
                  // console.log(JSON.parse(data.data).userShiftList)
                    that.setState({listShow: JSON.parse(data.data).machineList});
                    that.setState({workshopList: JSON.parse(data.data).workshopList});
                    that.setState({dataCount: JSON.parse(data.data).pageCount});
                    that.setState({userShiftList: JSON.parse(data.data).userShiftList});
                    that.setState({userList: JSON.parse(data.data).userList});
                    JSON.parse(data.data).userShiftList.map(function(item){
                      if(item.name=='早班'){
                        that.setState({
                          daylist:item.userList
                        })
                      }else if (item.name=='晚班'){
                        that.setState({
                          nightlist:item.userList
                        })
                      }
                    })

                    // console.log(that.state.daylist)
                    // console.log(that.state.nightlist)
                }
            });
        } else if (res.status === 401) {
            // //console.log("Oops! You are not authorized.");
        }
    }).then(error=>{
        // //console.log(JSON.stringify(error));
    });
  }
  //删除操作
  remove = (id) => {
    const that = this;
    const dataSource = [...this.state.listShow];
    const formData = new FormData();
    formData.append('tokenId', argument.tokenId);
    formData.append('tenantId', argument.tenantId);
    formData.append('version', argument.version);
    formData.append('active', 1);
    formData.append('id', id );
    fetch( URL+'/machine/deleteMachineById/v1', {
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
            // //console.log("Oops! You are not authorized.");
        }
    }).then(error=>{
        // //console.log(JSON.stringify(error));
    });
  }
  // 查询按钮事件
  doQuery = () => {
      //console.log(this.state.value1)
      const that = this;
      const formData = new FormData();
      formData.append('workshopId', this.state.value1 );
      formData.append('groupId', this.state.value2 );
      formData.append('userId', this.state.value3 );
      formData.append('tokenId', argument.tokenId);
      formData.append('tenantId', argument.tenantId);
      formData.append('version', argument.version);
      formData.append('active', 1);
      fetch( URL + '/machine/getMachineListByFactory/v1', {
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
              // //console.log("Oops! You are not authorized.");
          }
      })
  }
  //分页
changePage=(page, pageSize)=>{
  const that = this;
  const formData = new FormData();
  formData.append('tokenId', argument.tokenId);
  formData.append('tenantId', argument.tenantId);
  formData.append('version', argument.version);
  formData.append('rowSize', pageSize);
  formData.append('currentPage', page);
  formData.append('workshopId', this.state.value1 );
  formData.append('groupId', this.state.value2 );
  formData.append('userId', this.state.value3 );
  formData.append('active', 1);
  fetch( URL + '/machine/getMachineListByFactory/v1', {
      method: 'post',
      mode: 'cors',
      body: formData
  }).then(function(res) {
      if (res.ok) {
          res.json().then(function (data) {
            // //console.log(JSON.parse(data.data).stockList);
            if (data.code === "0") {
              that.setState({listShow: JSON.parse(data.data).machineList})
          }
          });
      } else if (res.status === 401) {
          //console.log("Oops! You are not authorized.");
      }
  }).then(error=>{
      //console.log(JSON.stringify(error));
  });

}


//重置操作
  handleFormReset = () => {
    const { form } = this.props;
    form.resetFields(['no1','no2','no3']);
    this.setState({
      value1:'',
      value2:[],
      value3:'',
      groupList:[],
      userList1:[],
      workshopList:[],
    });
    this.componentDidMount();
  }


//切换
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
  //批量更新数据
  start = () => {
    this.setState({ loading: true });
    const that = this;
    const {form} = this.props;
    const formData = new FormData();
    formData.append('tokenId', argument.tokenId);
    formData.append('tenantId', argument.tenantId);
    formData.append('version', argument.version);
    formData.append('active', 1);
    formData.append('machineIdList',this.state.selectedRowKeys);
    formData.append('workshopId', this.state.value4);//车间
    formData.append('groupId', this.state.value5);//组别
    formData.append('dayUserId', this.state.value6);//白班挡车工
    formData.append('nightUserId', this.state.value7);//夜班挡车工
    fetch(URL+ '/machine/batchConfigure/v1', {
      method: 'post',
      mode: 'cors',
      body: formData,
    }).then(function(res) {
      if (res.ok) {
        res.json().then(function (data) {
          if (data.code === "0") {
            message.success(data.msg,0.3);
            setTimeout(function(){
              that.setState({
                selectedRowKeys: [],
                loading: false,
                value4:'',
                value5:'',
                value6:'',
                value7:'',
              });
              form.resetFields(['1','2','3','4']);
              that.componentDidMount();
            },100);
          }
        });
      } else if (res.status === 401) {
        // //console.log("Oops! You are not authorized.");
      }
    }).then(error=>{
      // //console.log(JSON.stringify(error));
    });


  }
  //批量编辑
  onSelectChange = (selectedRowKeys) => {
    // //console.log(selectedRowKeys);
    this.setState({ selectedRowKeys });
  }



  //查询选择车间
  handleChange1 = (value) => {
    this.handleFormReset();
    const that = this;
    this.state.workshopList.map(function(item){

      if(value==item.name){
        value=item.id;
        that.setState({
          value1: item.id
        });
      }
    })
    const formData = new FormData();
    formData.append('tokenId', argument.tokenId);
    formData.append('tenantId', argument.tenantId);
    formData.append('version', argument.version);
    formData.append('active', 1);
    formData.append('workshopId', value);
    fetch(URL+'/factory/getFactoryList/v1', {
        method: 'post',
        mode: 'cors',
        body: formData
    }).then(function(res) {
        if (res.ok) {
            res.json().then(function (data) {
                if (data.code === "0") {
                  // //console.log(JSON.parse(data.data).userList)
                       if(JSON.parse(data.data).groupList.length==0){
                        that.setState({groupList:['全部']});
                       }else{
                        that.setState({groupList:JSON.parse(data.data).groupList});
                       }
                       that.setState({userList1:JSON.parse(data.data).userList});
                }
            });
        } else if (res.status === 401) {
            // //console.log("Oops! You are not authorized.");
        }
    }).then(error=>{
        // //console.log(JSON.stringify(error));
    });
  }
  // 查询选择组别
  handleChange2 = (value) => {
    const { form } = this.props;
    form.resetFields(['no3']);
    this.setState({

      value3:'',

    });
    const that = this;
    this.state.groupList.map(function(item){

    if(value==item.name){
      value=item.id;

        that.setState({
          value2:value,
        });

    } else if(value=='2'){
      value=that.state.value1;
      that.setState({
        value2:'',
      });
    }
  })
  // //console.log(value)
    const formData = new FormData();
    formData.append('tokenId', argument.tokenId);
    formData.append('tenantId', argument.tenantId);
    formData.append('version', argument.version);
    formData.append('active', 1);
    formData.append('groupId', value);
    fetch(URL+'/factory/getFactoryList/v1', {
        method: 'post',
        mode: 'cors',
        body: formData
    }).then(function(res) {
        if (res.ok) {
            res.json().then(function (data) {
              // //console.log(JSON.parse(data.data).userList)
                if (data.code === "0") {
                      that.setState({userList1:JSON.parse(data.data).userList});
                }
            });
        } else if (res.status === 401) {
            // //console.log("Oops! You are not authorized.");
        }
    }).then(error=>{
        // //console.log(JSON.stringify(error));
    });
  }
  //查询选择挡车工
  handleChange3 = (value) => {
    const that = this;
if(value=='eW'||value==''){
  that.setState({
    value3: '',
  });
}else{
  that.setState({
    value3: value,
  });
}



    // const that = this;
    // this.state.userList.map(function(item){

    //   if(value==item.name){
    //     value=item.id;
    //     if(value=='3'||value==''){
    //       // value='';
    //       that.setState({
    //         value3:'',
    //       });
    //     }else{
    //       that.setState({
    //         value3: value,
    //       });
    //     }
    //   }
    // })


  }


  //批量设置车间
  handleChange4 = (value) => {
    this.Reset();
    const that = this;
    this.state.workshopList.map(function(item){

      if(value==item.name){
        value=item.id;
        that.setState({
          value4: item.id
        });
      }
    })


    const formData = new FormData();
    formData.append('tokenId', argument.tokenId);
    formData.append('tenantId', argument.tenantId);
    formData.append('version', argument.version);
    formData.append('active', 1);
    formData.append('workshopId', value);
    fetch(URL+'/factory/getFactoryList/v1', {
        method: 'post',
        mode: 'cors',
        body: formData
    }).then(function(res) {
        if (res.ok) {
            res.json().then(function (data) {
                if (data.code === "0") {
                      that.setState({groupList1:JSON.parse(data.data).groupList});
                      that.setState({userList2:JSON.parse(data.data).userList});
                }
            });
        } else if (res.status === 401) {
            // //console.log("Oops! You are not authorized.");
        }
    }).then(error=>{
        // //console.log(JSON.stringify(error));
    });
  }
  //批量设置组别
  handleChange5 = (value) => {
    const { form } = this.props;
    form.resetFields(['3','4']);
    this.setState({

      value6:'',
      value7:'',

    });

    const that = this;
    this.state.groupList1.map(function(item){

    if(value==item.name){
      value=item.id;

        that.setState({
          value5:value,
        });

    }
  })
    const formData = new FormData();
    formData.append('tokenId', argument.tokenId);
    formData.append('tenantId', argument.tenantId);
    formData.append('version', argument.version);
    formData.append('active', 1);
    formData.append('groupId', value);
    fetch(URL+'/factory/getFactoryList/v1', {
        method: 'post',
        mode: 'cors',
        body: formData
    }).then(function(res) {
        if (res.ok) {
            res.json().then(function (data) {
                if (data.code === "0") {
                      that.setState({userList2:JSON.parse(data.data).userList});
                }
            });
        } else if (res.status === 401) {
            // //console.log("Oops! You are not authorized.");
        }
    }).then(error=>{
        // //console.log(JSON.stringify(error));
    });
  }
  //批量设置白班
  handleChange6 = (value) => {
    const that = this;
    this.state.daylist.map(function(item){

      if(value==item.name){
        value=item.id;
        that.setState({
          value6: value,
        });
        }
      })
    }




  //批量设置夜班
  handleChange7 = (value) => {
    const that = this;
    this.state.nightlist.map(function(item){

      if(value==item.name){
        value=item.id;
        that.setState({
          value7: value,
        });
        }
      })
  }

  Reset = ()=>{
    const { form } = this.props;
    form.resetFields(['1','2','3','4']);
    this.setState({
      value4:'',
      value5:'',
      value6:'',
      value7:'',
      groupList1:[],
      userList2:[]

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
        <Row gutter={{ md: 8, lg: 24, xl: 48 }} >
        <Col md={8} sm={24}>
            <FormItem label="车间名称">
            {getFieldDecorator('no1')(
              <Select className={styles.select} onChange={this.handleChange1} style={{width:250}}  placeholder="请选择">
                   {/* {
                       this.state.groupList.map(function(item){
                            return (
                            <Option value={item.id} key={item.id}>
                            {item.name}
                            </Option>)
                       })
                   } */}
                     </Select>
            )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="组别">
              {getFieldDecorator('no2')(
                <Select className={styles.select} onChange={this.handleChange2} style={{width:250}} placeholder="请选择">
                   {
                       this.state.userList.map(function(item){
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
          <Col md={8} sm={24} style={{ marginTop: 20 }} >
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
      <Form onSubmit={this.handleSearch} layout="inline" style={{ marginBottom:40 }}>
        <Row gutter={{ md: 8, lg: 24, xl: 48 }} >
        <Col md={8} sm={24}>
            <FormItem label="车间名称" >
              {getFieldDecorator('no1', {initialValue:'全部'})(
                <Select className={styles.select} onChange={this.handleChange1} style={{width:'300%'}} placeholder="请选择">
                   {/* <Option value={1}>
                            全部
                            </Option>  */}
                   {
                       this.state.workshopList.map(function(item){
                            return (
                            <Option value={item.name} >
                            {item.name}
                            </Option>)
                       })
                   }
                     </Select>
              )}
            </FormItem>
          </Col>
        <Col md={8} sm={24}>
            <FormItem label="组别">
            {getFieldDecorator('no2', {initialValue:'全部'})(
              <Select className={styles.select} onChange={this.handleChange2} style={{width:'300%'}} placeholder="请选择">
                           <Option value={2}>
                            全部
                            </Option>
                              {
                       this.state.groupList.map(function(item){
                            return (
                            <Option  value={item.name}>
                            {item.name}
                            </Option>)
                       })
                   }
                     </Select>
            )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="挡车工">
              {getFieldDecorator('no3', {initialValue:'全部'})(
                <Select className={styles.select} onChange={this.handleChange3}  style={{width:'300%'}} placeholder="请选择">
                <Option value='eW'>
                            全部
                            </Option>
                   {
                       this.state.userList.map(function(item){
                            return (
                            <Option  value={item.id}>
                            {item.name}
                            </Option>)
                       })
                   }
                     </Select>
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24} style={{ marginTop:20,  marginLeft:'40%'}} >
            <Button type="primary"  onClick={this.doQuery} onKeyDown={this.handleEnterKey}>查询</Button>
            <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>重置</Button>
            {/* <a style={{ marginLeft: 8 }} onClick={this.toggleForm}>
              收起 <Icon type="up" />
            </a> */}
          </Col>
          </Row>

      </Form>
    );
  }

  renderForm() {
    return this.state.expandForm ? this.renderAdvancedForm() : this.renderSimpleForm();
  }

  //修改操作
  doUpdate = (id) => {
    sessionStorage.setItem('id',id);
    const { dispatch } = this.props;
    dispatch(routerRedux.push('/setting/updateSort'));
  };

  render() {
    const { loading, selectedRowKeys } = this.state;
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
    };
    const hasSelected = selectedRowKeys.length > 0;
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
            title: '机器名称',
            dataIndex: 'name',
            key: 'name',
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
          },
          {
            title: '车间名称',
            dataIndex: 'workshopName',
            key: 'workshopName',
            render:(text, record) => (
              <span>
                {record.workshopName?record.workshopName:'未分配'}
              </span>
            ),
          },
          {
            title: '组别',
            dataIndex: 'groupName',
            key: 'groupName',
            render:(text, record) => (
             <span>
               {record.groupName?record.groupName:'未分配'}
             </span>
           ),
           },
          {
            title: '白班挡车工',
            dataIndex: 'dayUserName',
            key: 'dayUserName',
            render:(text, record) => (
              <span>
                {record.dayUserName?record.dayUserName:'未分配'}
              </span>
            ),
          },
          {
            title: '夜班挡车工',
            dataIndex: 'nightUserName',
            key: 'nightUserName',
            render:(text, record) => (
              <span>
                {record.nightUserName?record.nightUserName:'未分配'}
              </span>
            ),
          },
        {
        title: '操作',
        key: 'hello',
        render: (record) => (
          <Fragment>
            {/* <a onClick={() => this.doUpdate(record.id)}>修改</a> */}
            {/* <Divider type="vertical" /> */}
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
  const { getFieldDecorator } = this.props.form;
    return (
      <PageHeaderLayout>
        <Card bordered={false}>
         {/* <Breadcrumb className={styles.bread}>
             <Breadcrumb.Item >&nbsp;</Breadcrumb.Item>
             <Breadcrumb.Item>分组列表</Breadcrumb.Item>
         </Breadcrumb> */}
          <div className={styles.tableList}>
            <div>
              {this.renderForm()}
            </div>
            <div style={{ marginBottom: 16 }}>

          {/* <span style={{ marginLeft: 8 }}>
            {hasSelected ? `选择 ${selectedRowKeys.length} 项` : ''}
          </span> */}
          <Form
             layout="inline"
            style={{display:'inline',}}
          >
          <Row gutter={20} className={styles.sortrow} >
            <FormItem
              label="车间名称"
            >
            {getFieldDecorator('1')(
              <Select style={{width:90}}  onChange={this.handleChange4}  placeholder="请选择">
                   {
                       this.state.workshopList.map(function(item){
                            return (
                            <Option value={item.name}>
                            {item.name}
                            </Option>)
                       })
                   }
                     </Select>)}
            </FormItem>
            <FormItem
              label="组别"
            >
            {getFieldDecorator('2')(
               <Select style={{width:90}}  onChange={this.handleChange5}  placeholder="请选择">
                   {
                       this.state.groupList1.map(function(item){
                            return (
                            <Option value={item.name} >
                            {item.name}
                            </Option>)
                       })
                   }
                     </Select>
                     )}
            </FormItem>
            <FormItem
              label="白班挡车工"
            >
            {getFieldDecorator('3')(
               <Select style={{width:90}}  onChange={this.handleChange6}  placeholder="请选择">
                   {
                       this.state.daylist.map(function(item){
                            return (
                            <Option value={item.name} >
                            {item.name}
                            </Option>)
                       })
                   }
                     </Select>
                     )}
            </FormItem>
            <FormItem
              label="夜班挡车工"
            >
            {getFieldDecorator('4')(
              <Select style={{width:90}}  onChange={this.handleChange7}  placeholder="请选择">
                   {
                    this.state.nightlist.map(function(item){
                            return (
                            <Option value={item.name} >
                            {item.name}
                            </Option>)
                       })
                   }
                     </Select>)}
            </FormItem>
            <Button style={{ marginRight: 8 }} onClick={this.Reset}>重置</Button>
            <Button
            type="primary"
            onClick={this.start}
            disabled={!hasSelected}
            loading={loading}
            style={{marginTop:3}}
          >
            批量设置
          </Button>

            </Row>
          </Form>
        </div>
            <Table
              bordered={true}
              dataSource={ this.state.listShow }
              columns={columns}
              rowKey={record => record.id}
              onKey={this.remove}
              onKey={this.doUpdate}
              onChange={this.handleStandardTableChange}
              rowSelection={rowSelection}
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

import React from 'react';
import { connect } from 'dva';
import { Form, Input, Button, Select, Divider, Row, Col, Card, Icon, Dropdown, Menu, InputNumber, DatePicker, Modal, message, Badge, Table, Pagination, Radio} from 'antd';
import { routerRedux } from 'dva/router';
import { digitUppercase } from '../../../utils/utils';
import styles from './style.less';
import argument from '../../../utils/argument';
import URL from '../../../utils/api';

const { Option } = Select;
const RadioGroup = Radio.Group;
const machineArr = [];

const formItemLayout = {
  labelCol: {
    span: 5,
  },
  wrapperCol: {
    span: 19,
  },
};
const FormItem = Form.Item;
const columns = [
  {
    title: '机器名称',
    dataIndex: 'name',
    key:'name',
    align: 'center'
  },
  {
    title: 'MAC地址',
    dataIndex: 'machineMac',
    key:'machineMac',
    align: 'center'
  },
  {
    title: 'IP地址',
    dataIndex: 'ip',
    key:'ip',
    align: 'center'
  },
  {
    title: '组别',
    dataIndex: 'groupName',
    key:'groupName',
    align: 'center'
  },
];

const columns1 = [
  {
    title: '车间',
    dataIndex: 'parentName',
    key:'parentName',
    align: 'center'
  },
  {
    title: '组别',
    dataIndex: 'name',
    key:'name',
    align: 'center'
  },
  // {
  //   title: 'MAC地址',
  //   dataIndex: 'machineMac',
  //   key:'machineMac',
  //   align: 'center'
  // },
  // {
  //   title: 'IP地址',
  //   dataIndex: 'ip',
  //   key:'ip',
  //   align: 'center'
  // },
  // {
  //   title: '组别',
  //   dataIndex: 'groupName',
  //   key:'groupName',
  //   align: 'center'
  // },
];


@Form.create()
class Step2 extends React.PureComponent {
  state = {
    listShow: [],
    groupList: [],
    groupList1: [],
    input: '',
    machineId: [],
    dataCount: '',
    dataCount1: '',
    expandForm1: false,
    disabled: false,
    pageData: [],
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
    fetch( URL + '/factory/getGroupList/v1', {
      method: 'post',
      mode: 'cors',
      body: formData
    }).then(function(res) {
      if (res.ok) {
        res.json().then(function (data) {
          if (data.code === '0') {
            that.setState({
               groupList: JSON.parse(data.data).groupList,
               dataCount1: JSON.parse(data.data).dataCount
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

  // 点击组别以后的请求
  cliclGroup = () => {
    const that = this;
    const formData = new FormData();
    formData.append('tokenId', argument.tokenId);
    formData.append('tenantId', argument.tenantId);
    formData.append('version', argument.version);
    formData.append('active', 1);
    document.getElementById('page1').style.display = 'none';
    document.getElementById('page2').style.display = 'block';
    document.getElementById('table1').style.display = 'none';
    document.getElementById('table2').style.display = 'block';
    document.getElementById('col').style.display = 'none';
    document.getElementById('col1').style.display = 'none';
    document.getElementById('col2').style.width = '100%';
    document.getElementById('col2').style.textAlign = 'center';
    fetch( URL + '/factory/getGroupList/v1', {
      method: 'post',
      mode: 'cors',
      body: formData
    }).then(function(res) {
      if (res.ok) {
        res.json().then(function (data) {
          if (data.code === '0') {
            that.setState({
               groupList: JSON.parse(data.data).groupList,
               dataCount1: JSON.parse(data.data).dataCount,
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

  // 点击机器以后的请求
  cliclMachine = () => {
    const that = this;
    const formData = new FormData();
    formData.append('tokenId', argument.tokenId);
    formData.append('tenantId', argument.tenantId);
    formData.append('version', argument.version);
    formData.append('active', 1);
    document.getElementById('page1').style.display = 'block';
    document.getElementById('page2').style.display = 'none';
    document.getElementById('table1').style.display = 'block';
    document.getElementById('table2').style.display = 'none';
    document.getElementById('col').style.display = 'block';
    document.getElementById('col1').style.display = 'block';
    document.getElementById('col2').style.width = '';
    document.getElementById('col2').style.textAlign = 'none';
    fetch( URL + '/machine/getOnlineMachineList/v1', {
      method: 'post',
      mode: 'cors',
      body: formData
    }).then(function(res) {
      if (res.ok) {
        res.json().then(function (data) {
          if (data.code === '0') {
            that.setState({
               listShow: JSON.parse(data.data).machineList,
               dataCount: JSON.parse(data.data).dataCount,
               groupList1: JSON.parse(data.data).groupList,
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

  // 改变事件调用方法
  selectRadio = (e) => {
    if(e.target.value === 1) {
      {this.cliclMachine()}
    } else if (e.target.value === 2) {
      {this.cliclGroup()}
    }
  }

  // 点击翻页
  changePage = (page, pageSize) => {
    const that = this;
    const formData = new FormData();
    formData.append('tokenId', argument.tokenId);
    formData.append('tenantId', argument.tokenId);
    formData.append('version', argument.tokenId);
    formData.append('groupId', this.state.input);
    formData.append('active', 1);
    formData.append('rowSize', pageSize);
    formData.append('currentPage', page);
    fetch(URL + '/machine/getOnlineMachineList/v1', {
        method: 'post',
        mode: 'cors',
        body: formData
    }).then(function(res) {
        if (res.ok) {
            res.json().then(function (data) {
                if (data.code === '0') {
                    that.setState({
                      listShow: JSON.parse(data.data).machineList,
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

  // 点击翻页
  changePage1 = (page, pageSize) => {
    const that = this;
    const formData = new FormData();
    formData.append('tokenId', argument.tokenId);
    formData.append('tenantId', argument.tokenId);
    formData.append('version', argument.tokenId);
    formData.append('active', 1);
    formData.append('rowSize', pageSize);
    formData.append('currentPage', page);
    fetch(URL + '/factory/getGroupList/v1', {
        method: 'post',
        mode: 'cors',
        body: formData
    }).then(function(res) {
        if (res.ok) {
            res.json().then(function (data) {
                if (data.code === '0') {
                    that.setState({
                      groupList: JSON.parse(data.data).groupList,
                      pageData: sessionStorage.getItem('machineName')
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

  componentWillMount(){
    const that = this;
    const formData = new FormData();
    formData.append('tokenId', argument.tokenId);
    formData.append('tenantId', argument.tenantId);
    formData.append('version', argument.version);
    formData.append('active', 1);
    formData.append('groupId', this.state.input);
    fetch( URL + '/machine/getOnlineMachineList/v1', {
      method: 'post',
      mode: 'cors',
      body: formData
    }).then(function(res) {
      if (res.ok) {
        res.json().then(function (data) {
          if (data.code === '0') {
            that.setState({
              listShow: JSON.parse(data.data).machineList,
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


  select = (value) => {
    this.setState({
      input: value,
    })
  }

  // 查询事件
  doQuery = () => {
    const that = this;
    const formData = new FormData();
    formData.append('tokenId', argument.tokenId);
    formData.append('tenantId', argument.tenantId);
    formData.append('version', argument.version);
    formData.append('active', 1);
    formData.append('groupId', this.state.input);
    fetch( URL + '/machine/getOnlineMachineList/v1', {
      method: 'post',
      mode: 'cors',
      body: formData
    }).then(function(res) {
      if (res.ok) {
        res.json().then(function (data) {
          if (data.code === '0') {
            that.setState({
              listShow: JSON.parse(data.data).machineList,
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
        this.doQuery();
    }
  }

  // 重置事件
  handleFormReset = () => {
    const { form, dispatch } = this.props;
    form.resetFields();
    {this.componentWillMount()}
    this.setState({
      input: '',
    });
  }

  renderSimpleForm() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form onSubmit={this.handleSearch} layout="inline" style={{width: '80%', margin: 'auto'}}>
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24} id = 'col2' style={{paddingTop: '12px', width: '100%', textAlign: 'center'}}>
            <RadioGroup name="radiogroup" defaultValue={2} onChange={this.selectRadio}>
               <Radio value={2}>组别列表</Radio>
               <Radio value={1}>机器列表</Radio>
             </RadioGroup>
          </Col>
          <Col md={8} sm={24} id='col' style={{display: 'none'}}>
            <FormItem label="组别">
              {getFieldDecorator('status')(
                <Select placeholder="请选择" style={{ width: 150 }} onChange={this.select}>
                   {
                     this.state.groupList1.map(function(item) {
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
          <Col md={8} sm={24} id='col1' style={{display: 'none'}}>
            <span className={styles.submitButtons}>
              <Button type="primary" onClick={this.doQuery} onKeyDown={this.handleEnterKey}>查询</Button>
              <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>重置</Button>
            </span>
          </Col>
        </Row>
      </Form>
    );
  }
  renderForm() {
    return  this.renderSimpleForm();
  }



  // Button1() {
  //   return (
  //     <Table
  //       dataSource={this.state.listShow}
  //       columns={columns}
  //       rowSelection={rowSelection}
  //       style={{ marginTop: 15 }}
  //       rowKey={record => record.id}
  //       pagination={false}
  //     />
  //   );
  // }
  //
  // Button2() {
  //   return (
  //     <Table
  //       dataSource={this.state.groupList}
  //       columns={columns1}
  //       rowSelection={rowSelection1}
  //       style={{ marginTop: 15 }}
  //       rowKey={record => record.id}
  //       pagination={false}
  //     />
  //   );
  // }



  toggleForm1 = () => {
    this.setState({
      expandForm1: !this.state.expandForm1,
    });
  }

  // renderForm1() {
  //   return this.state.expandForm1 ? this.Button2() : this.Button1();
  // }


  render() {
    const { form, data, dispatch, submitting } = this.props;
    const { getFieldDecorator, validateFields } = form;
    const onPrev = () => {
      sessionStorage.getItem('machineId');
      sessionStorage.getItem('machineNumber');
      sessionStorage.getItem('machineName');
      if(sessionStorage.getItem('machineNumber') === '') {
        message.error('请选择机器!');
        return;
      }
      dispatch(routerRedux.push('/ProductionControl/new/check'));
    };
    const Prev = () => {
      sessionStorage.setItem('number', '');
      sessionStorage.setItem('name', '');
      sessionStorage.setItem('designName', '');
      sessionStorage.setItem('id', '');
      sessionStorage.setItem('orderDesignId', '');
      sessionStorage.setItem('machineNumber', '');
      sessionStorage.setItem('machineName', '');
      dispatch(routerRedux.push('/ProductionControl/new/info'));
    };


    const rowSelection = {
      onChange:(selectedRowKeys, selectedRows) => {
        //获取该条数据的key
        sessionStorage.setItem('key', 1);
        sessionStorage.setItem('machineId', selectedRowKeys);
        sessionStorage.setItem('machineNumber', selectedRowKeys.length);
        const machineArr = [];
        for (var i = 0; i <selectedRows.length; i++ ) {
            machineArr.push(selectedRows[i].name);
        }
        //sessionStorage.setItem('machineName', machineArr);
      }
    };

    const rowSelection1 = {
      onChange:(selectedRowKeys, selectedRows) => {
        //获取该条数据的key
        sessionStorage.setItem('key', 2);
        sessionStorage.setItem('machineGroup', selectedRowKeys);
        sessionStorage.setItem('machineNumber', selectedRowKeys.length);
        const machineArr = [];
        const that = this;
        for (var i = 0; i < selectedRows.length; i++ ) {
           machineArr.push(selectedRows[i].name)
        }
        sessionStorage.setItem('machineName', machineArr);
      }
    };



    return (
      <div className={styles.stepForm}>
        <div>
          {this.renderForm()}
        </div>
        <div id='table1' style={{display: 'none', width: '80%', margin: 'auto'}}>
          <Table
            dataSource={this.state.listShow}
            columns={columns}
            rowSelection={rowSelection}
            style={{ marginTop: 15 }}
            rowKey={record => record.id}
            pagination={false}

          />
        </div>
        <div id='table2' style={{width: '80%', margin: 'auto'}}>
          <Table
            dataSource={this.state.groupList}
            columns={columns1}
            rowSelection={rowSelection1}
            style={{ marginTop: 15 }}
            rowKey={record => record.id}
            pagination={false}
          />
        </div>
        <div className={styles.changePage} id='page1' style={{display: 'none'}}>
           <Pagination size="small" total={parseInt(this.state.dataCount)} onChange={this.changePage} showQuickJumper />
        </div>
        <div className={styles.changePage} id='page2'>
           <Pagination size="small" total={parseInt(this.state.dataCount1)} onChange={this.changePage1} showQuickJumper />
        </div>
        <div style={{ marginTop: 20, textAlign: 'center' }}>
          <Button onClick={Prev} style={{ marginLeft: 8 }}>
            上一步
          </Button>
          <Button onClick={onPrev} type="primary" style={{ marginLeft: 8 }}>
            下一步
          </Button>
        </div>
      </div>
    );
  }
}

export default connect(({ form, loading }) => ({
  submitting: loading.effects['form/submitStepForm'],
  data: form.step,
}))(Step2);

import React, { Fragment } from 'react';
import { connect } from 'dva';
import { Form, Input, Button, Select, Divider, Row, Col, Card,
Icon, Dropdown, Menu, InputNumber, DatePicker, Modal, message, Badge, Table, Radio, Pagination} from 'antd';
import { routerRedux } from 'dva/router';
import styles from './style.less';
import argument from '../../../utils/argument';
import URL from '../../../utils/api';

const { Option } = Select;
const FormItem = Form.Item;

@Form.create()

class Step1 extends React.PureComponent {
  state = {
    expandForm: false,
    listShow:[],
    input: '',
    input1: '',
    input2: '',
    input3: '',
    input4: '',
    input5: '',
    dataCount: ''
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
    formData.append('rowSize', 10);
    formData.append('currentPage', 1);
    fetch( URL + '/productionInstruction/getProductionInstructionListByDesign/v1', {
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

  // 点击翻页
  changePage = (page, pageSize) => {
    const that = this;
    const formData = new FormData();
    formData.append('tokenId', argument.tokenId);
    formData.append('tenantId', argument.tokenId);
    formData.append('version', argument.tokenId);
    formData.append('number', this.state.input);
    formData.append('name', this.state.input1);
    formData.append('customerName', this.state.input2);
    formData.append('designName', this.state.input3);
    formData.append('orderTime', this.state.input4);
    formData.append('deliveryTime', this.state.input5);
    formData.append('active', 1);
    formData.append('rowSize', pageSize);
    formData.append('currentPage', page);
    fetch(URL + '/productionInstruction/getProductionInstructionListByDesign/v1', {
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

  // 输入订单号
  input = (e) => {
    this.setState({
      input: e.target.value
    })
  }
  // 订单名称
  input1 = (e) => {
    this.setState({
      input1: e.target.value
    })
  }
  // 客户名称
  input2 = (e) => {
    this.setState({
      input2: e.target.value
    })
  }
  // 花样名称
  input3 = (e) => {
    this.setState({
      input3: e.target.value
    })
  }
  // 下单日期
  input4 = (date, dateString) => {
    this.setState({
      input4: dateString
    })
  }
  // 交货日期
  input5 = (date, dateString) => {
    this.setState({
      input5: dateString
    })
  }

  // 点击查询事件
  doQuery = () => {
    const that = this;
    const formData = new FormData();
    formData.append('number', this.state.input);
    formData.append('name', this.state.input1);
    formData.append('customerName', this.state.input2);
    formData.append('designName', this.state.input3);
    formData.append('orderTime', this.state.input4);
    formData.append('deliveryTime', this.state.input5);
    formData.append('tokenId', argument.tokenId);
    formData.append('tenantId', argument.tenantId);
    formData.append('version', argument.version);
    formData.append('active', 1);
    fetch( URL + '/productionInstruction/getProductionInstructionListByDesign/v1', {
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
        this.doQuery();
    }
  }

  // 重置事件
  handleFormReset = () => {
    const { form, dispatch } = this.props;
    form.resetFields();
    this.setState({
      input: '',
      input1: '',
      input2: '',
      input3: '',
      input4: '',
      input5: '',
    });
    {this.componentDidMount()}
  }

  renderSimpleForm() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="订单编号">
              {getFieldDecorator('no')(
                <Input placeholder="请输入" maxLength="30" onChange={this.input}/>
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="客户名称">
              {getFieldDecorator('no1')(
                   <Input placeholder="请输入" maxLength="30" onChange={this.input2}/>
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
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="订单编号">
              {getFieldDecorator('no')(
                <Input placeholder="请输入" maxLength="30" onChange={this.input}/>
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
              <FormItem label="订单名称">
                {getFieldDecorator('status1')(
                     <Input placeholder="请输入" maxLength="30" onChange={this.input1}/>
                )}
              </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="客户名称">
              {getFieldDecorator('no1')(
                   <Input placeholder="请输入"  maxLength="30" onChange={this.input2}/>
              )}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={{ md: 8, lg: 24, xl: 48 }} style={{marginTop: '15px'}}>
          <Col md={8} sm={24}>
            <FormItem label="花样名称">
              {getFieldDecorator('status2')(
                 <Input placeholder="请输入"  maxLength="30" onChange={this.input3}/>
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="下单日期">
               {getFieldDecorator('status3')(
                  <DatePicker style={{ width: '100%' }} placeholder="请选择" onChange={this.input4} />
               )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="交货日期">
               {getFieldDecorator('status4')(
                  <DatePicker style={{ width: '100%' }} placeholder="请选择" onChange={this.input5} />
               )}
            </FormItem>
          </Col>
        </Row>
        <div style={{ overflow: 'hidden', textAlign: 'center', marginTop: '15px'}}>
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

  toggleForm = () => {
    this.setState({
      expandForm: !this.state.expandForm,
    });
  }

  renderForm() {
    return this.state.expandForm ? this.renderAdvancedForm() : this.renderSimpleForm();
  }

  // 新增订单
  select = (record) => {
    sessionStorage.setItem('number', record.number);
    sessionStorage.setItem('name', record.name);
    sessionStorage.setItem('designName', record.designName);
    sessionStorage.setItem('id', record.id);
    sessionStorage.setItem('orderDesignId', record.orderDesignId);
    sessionStorage.setItem('machineNumber', '');
    const { dispatch } = this.props;
    dispatch(routerRedux.push('/ProductionControl/new/machine'));
  }


  render() {
    // const { form, dispatch, data } = this.props;
    // const { getFieldDecorator, validateFields } = form;
    // const onValidateForm = () => {
    //   validateFields((err, values) => {
    //     console.log(values);
    //     if (!err) {
    //       dispatch({
    //         type: 'form/saveStepFormData',
    //         payload: values,
    //       });
    //       dispatch(routerRedux.push('/ProductionControl/new/machine'));
    //     }
    //   });
    // };

    const columns = [
      {
        title: '订单编号',
        dataIndex: 'number',
        key: 'number',
        align: 'center'
      },
      {
        title: '订单名称',
        dataIndex: 'name',
        key: 'name',
        align: 'center'
      },
      {
        title: '客户名称',
        dataIndex: 'customerName',
        key: 'customerName',
        align: 'center'
      },
      {
        title: '联系电话',
        dataIndex: 'customerPhone',
        key: 'customerPhone',
        align: 'center'
      },
      {
        title: '花样名',
        dataIndex: 'designName',
        key: 'designName',
        align: 'center'
      },
      {
        title: '件数(双)',
        dataIndex: 'designQuantity',
        key: 'designQuantity',
        align: 'center'
      },
      {
        title: '下单日期',
        dataIndex: 'orderTime',
        key: 'orderTime',
        align: 'center'
      },
      {
        title: '交货日期',
        dataIndex: 'deliveryTime',
        key: 'deliveryTime',
        align: 'center'
      },
      {
        title: '新增指令',
        render: (record) => (
          <Fragment>
            <a onClick={() => this.select(record)}>新增</a>
          </Fragment>
        ),
        key: 'customerId',
        align: 'center',
      },
    ];


    return (
      <div className={styles.stepForm}>
        <div>
          {this.renderForm()}
        </div>
        <div>
          <Table
            dataSource={this.state.listShow}
            columns={columns}
            style={{ marginTop: 15 }}
            rowKey={record => record.createTime}
            onkey={this.select}
            pagination={false}
          />
          <div className={styles.changePage}>
             <Pagination size="small" total={parseInt(this.state.dataCount)} onChange={this.changePage} showQuickJumper />
          </div>
        </div>
      </div>
    );
  }
}

export default connect(({ form }) => ({
  data: form.step,
}))(Step1);

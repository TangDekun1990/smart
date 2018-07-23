import React, { PureComponent } from 'react';
import { connect } from 'dva';
import {
  Form, Input, DatePicker, Select, Button, Breadcrumb, Card, InputNumber, Radio, Icon, Tooltip, Calendar, Mention,message
} from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from './style.less';
import { routerRedux } from 'dva/router';
import URL from '../../utils/api.js';
import argument from'../../utils/argument';

const FormItem = Form.Item;
const { Option } = Select;
const { RangePicker } = DatePicker;
const { TextArea } = Input;

@connect(({ loading }) => ({
  submitting: loading.effects['form/submitRegularForm'],
}))
@Form.create()
export default class BasicForms extends PureComponent {
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      console.log(values)
      const that = this;
      const formData = new FormData();
      const { dispatch } = this.props;
      formData.append('tokenId', argument.tokenId);
      formData.append('tenantId', argument.tenantId);
      formData.append('version', argument.version);
      formData.append('active', 1);
      formData.append('id', localStorage.getItem('id'));
      formData.append('number', values.user1?values.user1:'');
      formData.append('name', values.user2?values.user2:'');
      formData.append('phone', values.user3?values.user3:'');
      formData.append('companyName', values.user4?values.user4:'');
      formData.append('deliveryAddress', values.user5?values.user5:'');
      formData.append('remark', values.user6?values.user6:'');
      fetch(URL + '/customer/updateCustomerById/v1', {
          method: 'post',
          mode: 'cors',
          body: formData
      }).then(function(res) {
          if (res.ok) {
              res.json().then(function (data) {
                  if(data.code === '0') {
                     message.success(data.msg,0.3);
                     setTimeout(function(){
                       dispatch(routerRedux.push('/setting/customer'));
                     },500);
                  }
              });
          } else if (res.status === 401) {
              //console.log("Oops! You are not authorized.");
          }
      }).then(error=>{
          //console.log(JSON.stringify(error));
      });
    });
  };
  state = {
     listShow: '',
     value1:'',
     value2:'',
     value3:'',
     value4:'',
     value5:'',
     value6:'',
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
    const that = this;
    const dataSource = [...this.state.listShow];
    const formData = new FormData();
    formData.append('id', localStorage.getItem('id'));
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
            that.setState({listShow: JSON.parse(data.data).customerList[0]  });
          }
        });
      } else if (res.status === 401) {
        //console.log("Oops! You are not authorized.");
      }
    }).then(error=>{
      //console.log(JSON.stringify(error));
    });
  }
  

   //  修改客户
  updateCustomer = () => {
    const that = this;
    const formData = new FormData();
    const { dispatch } = this.props;
    formData.append('tokenId', argument.tokenId);
    formData.append('tenantId', argument.tenantId);
    formData.append('version', argument.version);
    formData.append('active', 1);
    formData.append('id', localStorage.getItem('id'));
    formData.append('number', this.state.value1);
    formData.append('name', this.state.value2);
    formData.append('phone', this.state.value3);
    formData.append('companyName', this.state.value4);
    formData.append('deliveryAddress', this.state.value5);
    formData.append('remark', this.state.value6);
    fetch(URL + '/customer/updateCustomerById/v1', {
        method: 'post',
        mode: 'cors',
        body: formData
    }).then(function(res) {
        if (res.ok) {
            res.json().then(function (data) {
                if(data.code === '0') {
                   message.success(data.msg,0.3);
                   setTimeout(function(){
                     dispatch(routerRedux.push('/setting/customer'));
                   },500);
                }
            });
        } else if (res.status === 401) {
            //console.log("Oops! You are not authorized.");
        }
    }).then(error=>{
        //console.log(JSON.stringify(error));
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
  
  handleChange5 = (e) => {
    this.setState({
      value5: e.target.value,
    });
  }
  handleChange6 = (e) => {
    this.setState({
      value6: e.target.value,
    });
  }
 //返回
 goback=()=>{
  const{dispatch}=this.props;
  dispatch(routerRedux.push('/setting/customer'));
}


  render() {
    const { submitting } = this.props;
    const { getFieldDecorator, getFieldValue } = this.props.form;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 7 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 12 },
        md: { span: 10 },
      },
    };
    const submitFormLayout = {
      wrapperCol: {
        xs: { span: 24, offset: 0 },
        sm: { span: 10, offset: 7 },
      },
    };
    const children = [];
    for (let i = 10; i < 36; i++) {
      children.push(<Option key={i.toString(36) + i}>{i.toString(36) + i}</Option>);
    }

    return (
      <PageHeaderLayout>
      <Breadcrumb className={styles.bread}>
    <Breadcrumb.Item >&nbsp;</Breadcrumb.Item>
    <Breadcrumb.Item href="#/setting/customer">客户管理</Breadcrumb.Item>
    <Breadcrumb.Item>更新客户</Breadcrumb.Item>
  </Breadcrumb>
    
        <Card bordered={false}>
          <Form
            onSubmit={this.handleSubmit}
            hideRequiredMark
            style={{ marginTop: 8 }}
          >
            <FormItem
              {...formItemLayout}
              label="客户编号"
            >
            {getFieldDecorator('user1', { initialValue: this.state.listShow.number })(
              <Input  onChange={this.handleChange1} maxLength={30} /> )}
                
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="客户名称"
            >
             {getFieldDecorator('user2', { initialValue: this.state.listShow.name })(
              <Input  onChange={this.handleChange2} maxLength={30} /> )}
                
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="联系电话"
            >
                 {getFieldDecorator('user3', { initialValue: this.state.listShow.phone })(
              <Input  onChange={this.handleChange3} maxLength={30} /> )}
            </FormItem>
            <FormItem
                {...formItemLayout}
                label="公司名称"
              >
              {getFieldDecorator('user4', { initialValue: this.state.listShow.companyName })(
              <Input  onChange={this.handleChange4} maxLength={30} /> )}
                  
              </FormItem>
            
              <FormItem
                {...formItemLayout}
                label="地址"
              >
              {getFieldDecorator('user5', { initialValue: this.state.listShow.deliveryAddress })(
              <Input  onChange={this.handleChange5} maxLength={30} /> )}
                  
              </FormItem>
            

            <FormItem
              {...formItemLayout}
              label="备注"
            >
           {getFieldDecorator('user6', { initialValue: this.state.listShow.remark })(
              <Input onChange={this.handleChange6} maxLength={50} /> )}
                
            </FormItem>
       
          </Form>


            <div style={{textAlign:'center'}}>
            <Form onSubmit={this.handleSubmit}>
            <FormItem {...submitFormLayout}>
            <Button type="primary" htmlType="submit"  style={{marginRight:8}} >
                保存
              </Button>
              <Button  onClick={this.goback} >
                返回
              </Button>
          </FormItem>
          </Form>
          </div>
        </Card>
      </PageHeaderLayout>
    );
  }
}

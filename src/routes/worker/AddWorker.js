import React, { PureComponent } from 'react';
import { connect } from 'dva';
import {
  Form, Input, DatePicker, Select, Row, Button, Card, InputNumber, Radio, Icon, Tooltip, Calendar, Mention,Breadcrumb,message
} from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from './style.less';
import { routerRedux } from 'dva/router';
import URL from '../../utils/api.js'
import Common from '../../utils/version.js';
import argument from '../../utils/argument';

const FormItem = Form.Item;
const { Option } = Select;
const { RangePicker } = DatePicker;
const { TextArea } = Input;
const { toString } = Mention;
let uuid = 0;

@connect(({ loading }) => ({
  submitting: loading.effects['form/submitRegularForm'],
}))
@Form.create()
export default class BasicForms extends PureComponent {
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        this.props.dispatch({
          type: 'form/submitRegularForm',
          payload: values,
        });
      }
    });
  }
  state = {
    value1:'',
    value2:'',
    value3:'',
    // value4:'',
    value5:'', 
    value6:'', 
  };
  componentDidMount(){
    if(localStorage.getItem('loginId') === '') {
      const { dispatch } = this.props;
      message.error('您还未登录,请重新登录!');
      setTimeout(function() {
      dispatch(routerRedux.push('/user/login'));
      }, 500)
      return;
      }
  }
 

  handleChange1 = (e) => {
    this.setState({
      value1:e.target.value
    })
    const that = this;
    const formData = new FormData();
    formData.append('tokenId', argument.tokenId);
    formData.append('tenantId', argument.tenantId);
    formData.append('version', argument.version);
    formData.append('active', 1);
    formData.append('checkNumber', e.target.value );
    fetch(URL + '/user/checkUserNo/v1', {
        method: 'post',
        mode: 'cors',
        body: formData
    }).then(function(res) {
        if (res.ok) {
            res.json().then(function (data) {
                if (data.code === '0') {
                  
                }else{
                  message.error(data.msg);
                  setTimeout(function(){
                    that.props.form.setFieldsValue({
                      input1:''
                    })  
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
  
  handleChange2 = (e) => {
    this.setState({
      value2: e.target.value,
    });
  }
 
  handleChange3 = (value) => {
    this.setState({
      value3:value,
    });
  }
  
  // handleChange4 = (e) => {
  //   this.setState({
  //     value4: e.target.value,
  //   });
  // }
  
  handleChange5 = (e) => {
    this.setState({
      value5: e.target.value
    });
  }
  handleChange6 = (e) => {
    this.setState({
      value6: e.target.value
    });
  }
   //返回
 goback=()=>{
  const{dispatch}=this.props;
  dispatch(routerRedux.push('/setting/worker'));
}

  render() {
    const { submitting } = this.props;
    const { getFieldDecorator, getFieldValue, validateFields } = this.props.form;
    const saveWorker = () => {
      validateFields((err, values) => {
        if (!err) {
          const { dispatch } = this.props;
    const formData = new FormData();
    formData.append('tokenId', argument.tokenId);
    formData.append('tenantId', argument.tenantId);
    formData.append('version', argument.version);
    formData.append('active', 1);
    formData.append('number', this.state.value1);
    formData.append('name', this.state.value2);
    formData.append('sex', this.state.value3);
    formData.append('phone', this.state.value5);
    formData.append('remark', this.state.value6);
    fetch(URL　+　'/user/addUser/v1', {
        method: 'post',
        mode: 'cors',
        body: formData
    }).then(function(res) {
        if (res.ok) {
            res.json().then(function (data) {
                if(data.code === '0') {
                  message.success(data.msg,0.3);
                  setTimeout(function(){
                    dispatch(routerRedux.push('/setting/Worker'));
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
      });
    };
    

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 6 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
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
      <PageHeaderLayout style={{backgroundColor:'#fff'}}>
          <Breadcrumb className={styles.bread}>
    <Breadcrumb.Item >&nbsp;</Breadcrumb.Item>
    <Breadcrumb.Item href="#/setting/worker">员工管理</Breadcrumb.Item>
    <Breadcrumb.Item>新增员工</Breadcrumb.Item>
  </Breadcrumb>
  <Card bordered={false}>
          <Form
             onSubmit={this.handleSubmit}
            hideRequiredMark
            style={{ marginTop: 8 }}
          >
  
            <FormItem
              {...formItemLayout}
              label="工号"
            >
             {getFieldDecorator('input1', { rules: [
                  { required: true, message: '请输入工号' },
                ]})(
              <Input  placeholder="请输入" onBlur={this.handleChange1}  maxLength={30}/>
                )}
            </FormItem>
            <FormItem
               {...formItemLayout}
              label="员工姓名"
            >
             {getFieldDecorator('input2', { rules: [
                  { required: true, message: '请输入员工姓名' },
                ]})(
              <Input  placeholder="请输入" onChange={this.handleChange2} maxLength={30} />
                )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="性别"
            >
              <Select placeholder="请选择"  onChange={this.handleChange3}>
                  <Option value="男">男</Option>
                  <Option value="女">女</Option>
              </Select>
            </FormItem>
            {/* <FormItem
              
              label="线别/组别"
            >
              <Input style={{width:100}} placeholder="请输入" onChange={this.handleChange4} />
            </FormItem> */}
            
            <FormItem
               {...formItemLayout}
              label="联系电话"
            >
              <Input  placeholder="请输入" onChange={this.handleChange5} maxLength={30} />
            </FormItem>
            <FormItem
               {...formItemLayout}
              label="备注"
            >
             <Input placeholder="请输入" onChange={this.handleChange6} maxLength={50} />
            </FormItem>
            
            
            
          </Form>
          <div style={{textAlign:'center'}}>
          <Button type="primary" onClick={ saveWorker } style={{marginRight:8}}>
                保存
              </Button>
              <Button  onClick={this.goback} >
                返回
              </Button>
          
          </div>
            
            </Card>          
      </PageHeaderLayout>
    );
  }
}

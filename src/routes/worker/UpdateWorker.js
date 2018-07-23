import React, { PureComponent } from 'react';
import { connect } from 'dva';
import {
  Form, Input, DatePicker, Select, Button, Card, InputNumber, Radio, Icon, Tooltip, Calendar, Mention,Breadcrumb,message
} from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from './style.less';
import { routerRedux } from 'dva/router';
import URL from '../../utils/api.js';
import argument from '../../utils/argument';

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
    this.props.form.validateFields((err, values) => {
      if (!err) {


    this.props.form.validateFieldsAndScroll((err, values) => {
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
      formData.append('sex', values.user3?values.user3:'');
      // formData.append('factoryName', this.state.value4);
      formData.append('phone', values.user4?values.user4:'');
      formData.append('remark', values.user6?values.user6:'');
      fetch(URL + '/user/updateUserById/v1', {
          method: 'post',
          mode: 'cors',
          body: formData
      }).then(function(res) {
          if (res.ok) {
              res.json().then(function (data) {
                  if(data.code === '0') {
                     message.success(data.msg,0.3);
                     setTimeout(function(){
                       dispatch(routerRedux.push('/setting/worker'));
                     },500);
                  }
              });
          } else if (res.status === 401) {
              //console.log("Oops! You are not authorized.");
          }
      }).then(error=>{
          //console.log(JSON.stringify(error));
      });
  })
      }
})
}

  state = {
     listShow: ''
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
    fetch(URL + '/user/getUserList/v1', {
      method: 'post',
      mode: 'cors',
      body: formData
    }).then(function(res) {
      if (res.ok) {
        res.json().then(function (data) {
          if (data.code === '0') {
            that.setState({listShow: JSON.parse(data.data).userList[0]  });
          }
        });
      } else if (res.status === 401) {
        //console.log("Oops! You are not authorized.");
      }
    }).then(error=>{
      //console.log(JSON.stringify(error));
    });
  }
 
   //返回
   goback=()=>{
    const{dispatch}=this.props;
    dispatch(routerRedux.push('/setting/worker'));
  }
  
  handleChange1 = (e) => {
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
                      user1:''
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
  render() {
    const { submitting } = this.props;
    const { getFieldDecorator, getFieldValue, validateFields } = this.props.form;
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
    <Breadcrumb.Item href="#/setting/worker">员工管理</Breadcrumb.Item>
    <Breadcrumb.Item>更新员工</Breadcrumb.Item>
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
            {getFieldDecorator('user1', { initialValue: this.state.listShow.number,rules: [
                  { required: true, message: '请输入工号' },
                ] })(
              <Input   onBlur={this.handleChange1}  maxLength={30}/> )}
                
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="员工姓名"
            >
             {getFieldDecorator('user2', { initialValue: this.state.listShow.name,rules: [
                  { required: true, message: '请输入员工姓名' },
                ] })(
              <Input  maxLength={30} /> )}
                
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="性别"
            >
                 {getFieldDecorator('user3', { initialValue: this.state.listShow.sex })(
                  <Select>
                  <Option value="男">男</Option>
                  <Option value="女">女</Option>
              </Select>)}
            </FormItem>         
              <FormItem
                {...formItemLayout}
                label="联系电话"
              >
              {getFieldDecorator('user4', { initialValue: this.state.listShow.phone })(
              <Input  maxLength={30} /> )}
                  
              </FormItem>
            

            <FormItem
              {...formItemLayout}
              label="备注"
            >
           {getFieldDecorator('user6', { initialValue: this.state.listShow.remark })(
              <Input maxLength={50} /> )}
                
            </FormItem>
            <FormItem {...submitFormLayout} style={{ marginTop: 32 }}>
            <div style={{textAlign:'center'}}>
              <Button type="primary"  htmlType="submit" style={{marginRight:8}} >  
                保存
              </Button>
              <Button onClick={this.goback} >
                返回
              </Button>
              </div>
            </FormItem>
          </Form>
        </Card>
      </PageHeaderLayout>
    );
  }
}

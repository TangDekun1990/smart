import React, { PureComponent } from 'react';
import { connect } from 'dva';
import {
  Form, Input, DatePicker, Select, Button, Breadcrumb, Card, InputNumber, Radio, Icon, Tooltip, Calendar, Mention,message
} from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from './style.less';
import { routerRedux } from 'dva/router';
import URL from '../../utils/api.js'
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
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        this.props.dispatch({
          type: 'form/submitRegularForm',
          payload: values,
        });
      }
    });
  };
  state = {
     workshopList:[],
     listShow: '',
     value1:'',
     value2:'',
     value3:'',  
  };

  componentDidMount() {
    if(localStorage.getItem('loginId')===null) {
      const { dispatch } = this.props;
      message.error('请先登录!')
      dispatch(routerRedux.push('/user/login'));
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
    fetch(URL + '/machine/getMachineList/v1', {
      method: 'post',
      mode: 'cors',
      body: formData
    }).then(function(res) {
      if (res.ok) {
        res.json().then(function (data) {
          if (data.code === '0') {
            that.setState({listShow: JSON.parse(data.data).machineList[0]  });
            that.setState({workshopList: JSON.parse(data.data).workshopList  });
          }
        });
      } else if (res.status === 401) {
        //console.log("Oops! You are not authorized.");
      }
    }).then(error=>{
      //console.log(JSON.stringify(error));
    });
  }


  //修改



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
  
  handleChange3 = (value) => {
    this.setState({
      value3: value,
    });
  }
  


 //返回
 goback=()=>{
  const{dispatch}=this.props;
  dispatch(routerRedux.push('/machines/machineList'));
}


  render() {
    const { submitting } = this.props;
    const { getFieldDecorator, getFieldValue, validateFields } = this.props.form;
    const  update = () => {
      validateFields((err, values) => {
        if (!err) {
          const that = this;
          const formData = new FormData();
          const { dispatch } = this.props;
          formData.append('tokenId', argument.tokenId);
          formData.append('tenantId', argument.tenantId);
          formData.append('version', argument.version);
          formData.append('active', 1);
          formData.append('id', localStorage.getItem('id'));
          formData.append('name', this.state.value1);
          formData.append('model', this.state.value2);
          formData.append('workshop', this.state.value3);
          fetch(URL + '/machine/updateMachineById/v1', {
              method: 'post',
              mode: 'cors',
              body: formData
          }).then(function(res) {
              if (res.ok) {
                  res.json().then(function (data) {
                      if(data.code === '0') {
                         message.success(data.msg,0.3);
                         setTimeout(function(){
                           dispatch(routerRedux.push('/machines/machineList'));
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

      
    }
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
    {/* <Breadcrumb.Item >机器管理</Breadcrumb.Item> */}
    <Breadcrumb.Item href="#/setting/machine/machinelist">机器列表</Breadcrumb.Item>
    <Breadcrumb.Item>更新机器</Breadcrumb.Item>
  </Breadcrumb>
    
        <Card bordered={false}>
          <Form
            onSubmit={this.handleSubmit}
            hideRequiredMark
            style={{ marginTop: 8 }}
          >
           
            <FormItem
              {...formItemLayout}
              label="机器名称"
            >
             {getFieldDecorator('user2', { initialValue: this.state.listShow.name,  rules: [
                  { required: true, message: '机器名称不可为空' },
                ], })(
              <Input  onChange={this.handleChange1} /> )}
                
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="机器编码"
            >
                 {getFieldDecorator('user3', { initialValue: this.state.listShow.machineMac })(
              <Input    disabled/> )}
            </FormItem>
            <FormItem
                {...formItemLayout}
                label="电控型号"
              >
              {getFieldDecorator('user4', { initialValue: this.state.listShow.model })(
              <Input  disabled /> )}
                  
              </FormItem>
            
              <FormItem
                {...formItemLayout}
                label="车间名称"
              >
              {getFieldDecorator('user5', { initialValue: this.state.listShow.workshopName })(
                <Input  disabled /> 
             )}
                  
              </FormItem>
        
          </Form>
          <div style={{textAlign:'center'}}>
          <Button type="primary" onClick={update} style={{marginRight:8}}   >
                修改
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

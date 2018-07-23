import React, { PureComponent } from 'react';
import { connect } from 'dva';
import {
  Form, Input, DatePicker, Select, Row, Button, Card, InputNumber, Radio, Icon, Tooltip, Calendar, Mention,Col,Checkbox,Rate,TimePicker,Breadcrumb,message
} from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from './style.less';
import { routerRedux } from 'dva/router';
import URL from '../../utils/api.js'
import Common from '../../utils/version.js';
import argument from '../../utils/argument';
import moment from 'moment';
const InputGroup = Input.Group;
const FormItem = Form.Item;
const { Option } = Select;
const { RangePicker } = DatePicker;
const { TextArea } = Input;
const { toString } = Mention;
const CheckboxGroup = Checkbox.Group;
const format = 'HH:mm';




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
    listShow:'',
    value1:'',
    value2:'',
    value3:'',
    // value4:'',
    value5:'', 
    value6:'',
    // checklist:[]
    userList:[],
    options:[],
    array:[],
    list:[],
    open: false,
    idlist:[]
   
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
    const options=[];
    const list=[];
    const arr=[];
    const worker='';
    const that = this;
    const formData = new FormData();
    formData.append('id', localStorage.getItem('id'));
    formData.append('tokenId', argument.tokenId);
    formData.append('tenantId', argument.tenantId);
    formData.append('version', argument.version);
    formData.append('active', 1);
    fetch(URL + '/userShift/getUserShiftList/v1', {
        method: 'post',
        mode: 'cors',
        body:formData
    }).then(function(res) {
        if (res.ok) {
            res.json().then(function (data) {                       
                if (data.code === '0') {
                
                 JSON.parse(data.data).userList.map(function(item){                
                    options.push(item.name)
                  })
                   that.setState({options:options});

                   that.setState({userList:JSON.parse(data.data).userList})
                }
            });
        } else if (res.status === 401) {
            // //console.log("Oops! You are not authorized.");
        }
    }).then(error=>{
        // //console.log(JSON.stringify(error));
    });
  }

 

   //  保存班次
  save = () => {
    const { dispatch } = this.props;
    const formData = new FormData();
    formData.append('tokenId', argument.tokenId);
    formData.append('tenantId', argument.tenantId);
    formData.append('version', argument.version);
    formData.append('active', 1);
    formData.append('name', this.state.value1);
    formData.append('startWorkTime', this.state.value2);
    formData.append('endWorkTime', this.state.value3);
    formData.append('userList', this.state.idlist);
    fetch(URL　+　'/userShift/addUserShift/v1', {
        method: 'post',
        mode: 'cors',
        body: formData
    }).then(function(res) {
        if (res.ok) {
            res.json().then(function (data) {
                if(data.code === '0') {
                  message.success(data.msg,0.3);
                  setTimeout(function(){
                    dispatch(routerRedux.push('/setting/usershift'));
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
  //班次
  handleChange1 = (e) => {
    this.setState({
      value1: e.target.value,
    });
  }
  
  //上班时间
  handleChange2 = (time,value) => {
    let times='';
    times=value.concat(':00');
   this.setState({
     value2: times,
   });
 }
//下班时间
 handleChange3 = (time,value) => {
   let timee='';
   timee=value.concat(':00');
   this.setState({
     value3: timee,
   }); 
 }
  handleChange4 = (value) => {
    this.setState({
      value4: e.target.value
    });
    //console.log(value);
  }
  
  handleChange5=(value)=>{
      const idlist=[];   
      this.state.userList.map(function(item){
        if(value.indexOf(item.name)>0||value[0]==item.name){
          idlist.push(item.id);              
        }
      })
      //console.log(idlist) 
    this.setState({
      list:value,
      idlist:idlist
    })
  }

  //返回
  goback=()=>{
    const{dispatch}=this.props;
    dispatch(routerRedux.push('/setting/usershift'));
  }
  render() {
    const { submitting } = this.props;
    const { getFieldDecorator, getFieldValue } = this.props.form;
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
      <PageHeaderLayout>
        <Breadcrumb className={styles.bread}>
    <Breadcrumb.Item >&nbsp;</Breadcrumb.Item>
    <Breadcrumb.Item href="#/setting/usershift">班次管理</Breadcrumb.Item>
    <Breadcrumb.Item>新增班次</Breadcrumb.Item>
  </Breadcrumb>
      <Card bordered={false}>
        <Form
          onSubmit={this.handleSubmit}
          hideRequiredMark
          style={{ marginTop: 8,marginLeft:0 }}
        >
          <FormItem
            {...formItemLayout}
            label="班次"
            style={{ width: 600 }}
          >
              
              <Input   style={{ width: 100 }} onChange={this.handleChange1} /> 
          </FormItem>
         
         
          <FormItem
      label="工作时间：" {...formItemLayout}
      style={{ width:600 }}
     >
      <Row>
        {/* <Col span="8">
          <Input id="tel1" defaultValue="086" />
        </Col> */}
        
        <Col span="32">
          <InputGroup>
            <Col span="10" style={{width:110}}>
           
              <TimePicker  
              format={format}  
              style={{width:107}}
              onChange={this.handleChange2}
            
              
              />
               
            </Col><Col span="2" style={{marginLeft:0}}>
          <p className="ant-form-split" style={{paddingTop:5}}>到</p>
        </Col>
            <Col span="10">
           
              <TimePicker  
              format={format}  
              style={{width:107}}
              onChange={this.handleChange3}
              
              />
               
            </Col>
           
          </InputGroup>
        </Col>
      </Row>
    </FormItem>
          
          <FormItem
            {...formItemLayout}
            style={{ width: 600 }}
            label={
              <span>
               员工名单
              </span>
            }
          >
          {getFieldDecorator('user4', { initialValue: this.state.list})(
            <TextArea style={{ width: 300,height:240 ,resize:'none'}} readOnly="true" 
            onChange={this.handleChange4} /> )}
             
          </FormItem>
          <div style={{ position:"absolute"  ,left: 480,top: 40}}>员工列表</div>
          
             {getFieldDecorator('checkbox', { initialValue: this.state.list })(
              <Checkbox.Group style={{ position:"absolute",  width: 480,left: 500,top: 90}} 
             options={ this.state.options }        
             onChange={this.handleChange5}
           > 
           <Row gutter={{ md: 8, lg: 24, xl: 48 }} >
           <Col span={0}>
           </Col>
           </Row>
           
           </Checkbox.Group>)}
        </Form>
        <div style={{textAlign:'center'}}>
            <Button type="primary" onClick={this.save} style={{marginRight:8}} >
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



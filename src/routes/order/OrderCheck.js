import React, { PureComponent } from 'react';
import { connect } from 'dva';
import {
  Form, Input, DatePicker, Select, Button, Card, InputNumber,List, Radio, Icon, Tooltip, Calendar, message,Breadcrumb,
  Row, Col
} from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import { routerRedux } from 'dva/router';
import styles from './TableList.less';
import URL from '../../utils/api.js';
import argument from '../../utils/argument';

const FormItem = Form.Item;
const { Option } = Select;
const { RangePicker } = DatePicker;
const { TextArea } = Input;
let num=1;


@connect(({ loading }) => ({
  submitting: loading.effects['form/submitRegularForm'],
}))
@Form.create()

export default class OrderCheck extends PureComponent {
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
    statusList: [],
    customerList: [],
    listShow: '',
    listShow1: '',
    disabled: true,
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
    const formData = new FormData();
    formData.append('tokenId', argument.tokenId);
   formData.append('tenantId', argument.tenantId);
   formData.append('version', argument.version);
    formData.append('active', 1);
    formData.append('id', sessionStorage.getItem('dataId'));
    // fetch( URL + '/order/getOrderById/v1', {
    fetch(URL + '/order/getOrderById/v1', {
        method: 'post',
        mode: 'cors',
        body: formData
    }).then(function(res) {
        if (res.ok) {
            res.json().then(function (data) {
              if (data.code === "0") {
                  that.setState({listShow: JSON.parse(data.data).order});
                  that.setState({listShow1: JSON.parse(data.data).orderDetailList});
                  
                  // that.setState({listShow: data.data.order});
              } else {
                 message.error(data.code);
              }
            });
        } else if (res.status === 401) {
            //console.log("Oops! You are not authorized.");
        }
    }).then(error=>{
        ////console.log(JSON.stringify(error));
    });
  }


  render() {
    let num=1;
    const { submitting } = this.props;
    const { getFieldDecorator, getFieldValue } = this.props.form;
    const { dispatch } = this.props;
    const goBack = () => {
      dispatch(routerRedux.push('/order/list'));
    };
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
    return (
      <PageHeaderLayout>
      <Breadcrumb className={styles.bread}>
    <Breadcrumb.Item >&nbsp;</Breadcrumb.Item>
    
    <Breadcrumb.Item href="#/order/list">订单列表</Breadcrumb.Item>
    <Breadcrumb.Item>查看详情</Breadcrumb.Item>
  </Breadcrumb>
        <div className={styles.tableListForm} style={{backgroundColor:'#fff',marginTop:-24}}  >
        <div  style={{float:"left",fontSize:16,   marginTop:30,marginLeft:30}}>订单信息</div><br></br>
         <Button type="primary" style={{float:'right',marginRight:10}} onClick={ goBack }>
                返回
              </Button> 
          <Form
            onSubmit={this.handleSubmit}
            hideRequiredMark
            layout="inline"
            style={{backgroundColor:'#fff',padding:50,paddingLeft:100}}
          >
            <div>
            
              <Row gutter={{ md: 8, lg: 24, xl: 48 }} style={{marginBottom:20}}>
                <Col md={8} sm={24}>
                  <FormItem label="订单编号">
                      <Input value={this.state.listShow.number} disabled />
                  </FormItem>
                </Col>
                <Col md={8} sm={24}>
                  <FormItem label="下单日期">
                      <Input value={this.state.listShow.orderTime} disabled />
                  </FormItem>
                </Col>
                <Col md={8} sm={24}>
                  <FormItem label="总&nbsp;&nbsp;件&nbsp;&nbsp;数">
                      <Input value={this.state.listShow.totalNumber} disabled />
                  </FormItem>
                </Col>
              </Row>
              <Row gutter={{ md: 8, lg: 24, xl: 48 }} style={{marginBottom:20}}>
                <Col md={8} sm={24}>
                  <FormItem label="订单名称">
                      <Input value={this.state.listShow.name} disabled/>
                      {/* <span>{this.state.listShow.name}</span> */}
                  </FormItem>
                </Col>
                <Col md={8} sm={24}>
                  <FormItem label="交货日期">
                      <Input value={this.state.listShow.deliveryTime?this.state.listShow.deliveryTime:''} disabled />
                  </FormItem>
                </Col>
                <Col md={8} sm={24}>
                  <FormItem label="创建时间">
                      <Input value={this.state.listShow.createTime} disabled />
                  </FormItem>
                </Col>
              </Row>
              <Row gutter={{ md: 8, lg: 24, xl: 48 }} style={{marginBottom:20}}>
                <Col md={8} sm={24}>
                  <FormItem label="客户名称">
                      <Input value={this.state.listShow.customerName} disabled />
                  </FormItem>
                </Col>
                <Col md={8} sm={24}>
                  <FormItem label="订单状态">
                      <Input value={this.state.listShow.orderStatusName} disabled />
                  </FormItem>
                </Col>
              </Row>
              <Row gutter={{ md: 8, lg: 24, xl: 48 }} style={{marginBottom:20}}>
                {/* <Col md={8} sm={24}>
                  <FormItem label="联&nbsp;&nbsp;系&nbsp;&nbsp;人">
                      <Input value={this.state.listShow.contactPerson} disabled />
                  </FormItem>
                </Col> */}
                <Col md={8} sm={24}>
                  <FormItem label="发货地址">
                      <Input value={this.state.listShow.deliveryAddress} disabled />
                  </FormItem>
                </Col>
                <Col md={8} sm={24}>
                  <FormItem label="备&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;注" >
                      <Input value={this.state.listShow.remark} disabled />
                  </FormItem>
                </Col>
              </Row>
              <Row gutter={{ md: 8, lg: 24, xl: 48 }} style={{marginBottom:20}}>
                <Col md={8} sm={24}>
                  <FormItem label="联系电话">
                      <Input value={this.state.listShow.customerPhone} disabled />
                  </FormItem>
                </Col>
                
              </Row>
            </div>
            <div>
            </div>           
          </Form>
          <div  style={{float:"left",fontSize:16, marginTop:-30,marginLeft:30}}>订单花样信息</div><br></br>
          <List
           rowKey="id"
           itemLayout="vertical"
           dataSource={[...this.state.listShow1]}        
           renderItem={item =>(
               <List.Item key={item.id} style={{height:50}}>  

                    <Form
                  layout="inline"
                  style={{backgroundColor:'#fff',paddingLeft:100}}
                    >
                    <Row gutter={{ md: 10, lg: 24, xl: 48 }} style={{marginTop:20}}>
                    <Col md={7} sm={24} >
                   
                      <FormItem 
                       
                      label={
                        `花样${num++}`
                        }>
                      <Input value={item.designName} disabled />    
                      </FormItem>                
                   </Col>
                   <Col md={8} sm={24} >
                   <FormItem style={{width:300}} label="花样件数">
                      <Input value={item.designNumber}  style={{width:'55%'}} addonAfter="双" disabled />  
                      </FormItem> 
                      </Col>
                      </Row>   
                      </Form>       
               </List.Item> 
             )
           }
         >   
         
                   
         </List>
         
        </div>
        <div style={{backgroundColor:'#fff',height:80}}></div>
      </PageHeaderLayout>
    );
  }
}

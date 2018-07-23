import React, { PureComponent } from 'react';
import { connect } from 'dva';
import {
  Form, Input, DatePicker, Select, Button, Card, InputNumber, Radio, Icon, Tooltip, Calendar,Breadcrumb,message
} from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import { routerRedux } from 'dva/router';
import styles from './style.less';
import URL from '../../utils/api.js';

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
  }

  state = {
    orderList: [],
    customerList:[],
    productCategoryList:[],
    unitList:[],
    listShow:'',
    value1:'',
    value2:'',
    value3:'',
    value4:'',
    value5:'',
    value6:'',
    value7:'',
    value8:'',
    value9:'',
    value10:'',
    value11:'',
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
    formData.append('version', 1);
    fetch( URL + '/receivables/getReceivablesList/v1', {
        method: 'post',
        mode: 'cors',
        body: formData
    }).then(function(res) {
        if (res.ok) {
            res.json().then(function (data) {
              console.log(JSON.parse(data.data))
              if (data.code === "0") {
                that.setState({listShow: JSON.parse(data.data).receivablesList[0]}); 
                that.setState({productCategoryList: JSON.parse(data.data).productCategoryList})
                that.setState({orderList: JSON.parse(data.data).orderList})
                that.setState({unitList: JSON.parse(data.data).unitList}) 
                that.setState({customerList: JSON.parse(data.data).customerList}) 
                              
              }
            });
        } else if (res.status === 401) {
            console.log("Oops! You are not authorized.");
        }
    }).then(error=>{
        console.log(JSON.stringify(error));
    });
    
  }
  //本地测试数据
  // componentDidMount() {
  //   const that = this;
  //   const dataSource = [...this.state.listShow];
  //   const formData = new FormData();
  //   formData.append('id', localStorage.getItem('id'));
  //   formData.append('version', 1);
  //   fetch('/receivables/getReceivablesList/v1', {
  //       method: 'post',
  //       mode: 'cors',
  //       body: formData
  //   }).then(function(res) {
  //       if (res.ok) {
  //           res.json().then(function (data) {
  //             // console.log(JSON.parse(data.data))
  //             if (data.code === "0") {
  //               that.setState({listShow: data.data.receivablesList[0]}); 
  //               that.setState({productCategoryList: data.data.productCategoryList})
  //               that.setState({orderList: data.data.orderList})
  //               that.setState({unitList: data.data.unitList}) 
  //               that.setState({customerList: data.data.customerList}) 
                              
  //             }
  //           });
  //       } else if (res.status === 401) {
  //           console.log("Oops! You are not authorized.");
  //       }
  //   }).then(error=>{
  //       console.log(JSON.stringify(error));
  //   });
    
  // }

  //修改保存
  doSave = () => {
    const that = this;
    const { dispatch } = this.props;
    const formData = new FormData();
    formData.append('tenantId', 1);
    formData.append('tokenId', '01');
    formData.append('version', 1);
    formData.append('id', localStorage.getItem('id'));
    formData.append('number', this.state.value1);
    formData.append('orderId', this.state.value2);
    formData.append('productCategoryId', this.state.value3);
    formData.append('customerName', this.state.value4);
    formData.append('productName', this.state.value5);
    formData.append('productQuantity', this.state.value6);
    formData.append('unitId', this.state.value7);
    formData.append('amountReceivable', this.state.value8);
    formData.append('receivedAmount', this.state.value9);
    formData.append('arrearsAmount', this.state.value10);
    formData.append('remark', this.state.value11);
    fetch(URL + '/receivables/updateReceivablesById/v1', {
      method: 'post',
      mode: 'cors',
      body: formData
    }).then(function(res) {
      if (res.ok) {
        res.json().then(function (data) {
          if (data.code === "0") {
            message.success(data.msg,0.3);
            setTimeout(function(){
              dispatch(routerRedux.push('/receipt/list'));
            },500);  
          }
        });
      } else if (res.status === 401) {
        console.log("Oops! You are not authorized.");
      }
    }).then(error=>{
      console.log(JSON.stringify(error));
    });
  }
  //本地测试
  // doSave = () => {
  //   const that = this;
  //   const { dispatch } = this.props;
  //   const formData = new FormData();
  //   formData.append('tenantId', 1);
  //   formData.append('tokenId', '01');
  //   formData.append('version', 1);
  //   formData.append('id', localStorage.getItem('id'));
  //   formData.append('number', this.state.value1);
  //   formData.append('orderId', this.state.value2);
  //   formData.append('productCategoryId', this.state.value3);
  //   formData.append('customerName', this.state.value4);
  //   formData.append('productName', this.state.value5);
  //   formData.append('productQuantity', this.state.value6);
  //   formData.append('unitId', this.state.value7);
  //   formData.append('amountReceivable', this.state.value8);
  //   formData.append('receivedAmount', this.state.value9);
  //   formData.append('arrearsAmount', this.state.value10);
  //   formData.append('remark', this.state.value11);
  //   fetch('/receivables/updateReceivablesByReceivablesId/v1', {
  //     method: 'post',
  //     mode: 'cors',
  //     body: formData
  //   }).then(function(res) {
  //     if (res.ok) {
  //       res.json().then(function (data) {
  //         if (data.code === "0") {
  //           message.success(data.msg);
  //           setTimeout(function(){
  //             dispatch(routerRedux.push('/receipt/list'));
  //           },500);  
  //         }
  //       });
  //     } else if (res.status === 401) {
  //       console.log("Oops! You are not authorized.");
  //     }
  //   }).then(error=>{
  //     console.log(JSON.stringify(error));
  //   });
  // }
  //新增库存编号
  handleChange1 = (e) => {
    this.setState({
      value1: e.target.value,
    });
  }
  //修改订单编号
  onSelect1 = (value) => {
    this.setState({
      value2: value,
    });
  }
  //修改物品类别
  onSelect2 = (value) => {
    this.setState({
      value3: value,
    });
  }
  //修改客户名称
  onSelect4 = (e) => {
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
  
  onSelect3 = (value) => {
    this.setState({
      value7: value,
    });
  }
   
   handleChange8 = (e) => {
    this.setState({
      value8: e.target.value,
    
    });
    
  }
   
   handleChange9 = (e) => {
    this.setState({
      value9: e.target.value,
    
    });
    
  }
   
   handleChange10 = (e) => {
    this.setState({
      value10: e.target.value,
    
    });
    
  }
  
   handleChange11 = (e) => {
    this.setState({
      value11: e.target.value,
    
    });
    
  }

 //返回
 goback=()=>{
  const{dispatch}=this.props;
  dispatch(routerRedux.push('/receipt/list'));
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

    // localStorage.setItem('number',this.state.listShow.number);
    // console.log(localStorage.getItem('number'));




    return (
      <PageHeaderLayout>
      <Breadcrumb className={styles.bread}>
    <Breadcrumb.Item >&nbsp;</Breadcrumb.Item>
    <Breadcrumb.Item href="#/receipt/list">收款列表</Breadcrumb.Item>
    <Breadcrumb.Item>更新收款</Breadcrumb.Item>
  </Breadcrumb>
        <Card bordered={false}>
          <Form
            onSubmit={this.handleSubmit}
            hideRequiredMark
            style={{ marginTop: 8 }}
          >
            <FormItem
              {...formItemLayout}
              label="收款编号"
            >
            {getFieldDecorator('user', { initialValue: this.state.listShow.number })(
              <Input onChange={this.handleChange1} /> )}
     
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="订单编号"
            >
            {getFieldDecorator('user1', { initialValue: this.state.listShow.orderId })(
              <Select className={styles.select} onChange={this.onSelect1} placeholder="请选择" >
                   {
                       this.state.orderList.map(function(item){
                            return (
                            <Option value={item.id} key={item.id}>
                            {item.number}
                            </Option>)
                       })
                   }
                     </Select> )}
             
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="物品类别"
            >
             {getFieldDecorator('user2', { initialValue: this.state.listShow.productCategoryId })(
              <Select className={styles.select} onChange={this.onSelect2} placeholder="请选择" >
                   {
                       this.state.productCategoryList.map(function(item){
                            return (
                            <Option value={item.id} key={item.id}>
                            {item.name}
                            </Option>)
                       })
                   }
                     </Select> )}
             
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="客户名称"
            >
             {getFieldDecorator('user3', { initialValue: this.state.listShow.customerName })(
              <Input onChange={this.onSelect4} disabled />  )}
             
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="物品名称"
            >
             {getFieldDecorator('user4', { initialValue: this.state.listShow.productName })(
              <Input onChange={this.handleChange5} /> )}

              
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="物品数量"
            >
            {getFieldDecorator('user5', { initialValue: this.state.listShow.productQuantity })(
              <Input onChange={this.handleChange6} /> )}
             
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="物品单位"
            >
             {getFieldDecorator('user6', { initialValue: this.state.listShow.unitValue })(
              <Select className={styles.select} onChange={this.onSelect3} placeholder="请选择" >
                   {
                       this.state.unitList.map(function(item){
                            return (
                            <Option value={item.id} key={item.id}>
                            {item.value}
                            </Option>)
                       })
                   }
                     </Select> )}
              
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="应收金额"
            >
            {getFieldDecorator('user7', { initialValue: this.state.listShow.amountReceivable })(
              <Input onChange={this.handleChange8} /> )}
              
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="已收金额"
            >
            {getFieldDecorator('user8', { initialValue: this.state.listShow.receivedAmount })(
              <Input onChange={this.handleChange9} /> )}
              
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="欠款"
            >
            {getFieldDecorator('user9', { initialValue: this.state.listShow.arrearsAmount })(
              <Input onChange={this.handleChange10} /> )}
              
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="备注"
            >
            {getFieldDecorator('user10', { initialValue: this.state.listShow.remark })(
              <Input onChange={this.handleChange11} /> )}
              
            </FormItem>
            <FormItem {...submitFormLayout} style={{ marginTop: 32 }}>
              <Button type="primary" onClick={ this.doSave } style={{marginRight:20}}>
                保存
              </Button>
              <Button type="primary" onClick={this.goback} >
                返回
              </Button>
            </FormItem>
          </Form>
        </Card>
      </PageHeaderLayout>
    );
  }
}

import React, { PureComponent } from 'react';
import { connect } from 'dva';
import {
  Form, Input, DatePicker, Select, Button, Card, InputNumber, Radio, Icon, Tooltip, Calendar, Mention,message
} from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from './style.less';
import URL from '../../utils/api.js';
import { routerRedux } from 'dva/router';

const FormItem = Form.Item;
const { Option } = Select;
const { RangePicker } = DatePicker;
const { TextArea } = Input;
const { toString } = Mention;

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
    productCategoryList:[],
    unitList:[],
    value1:'',
    value2:'',
    value3:'',
    value4:'',
    value5:'',
    value6:'',
    value7:'',
    value8:''
  };

  componentDidMount() 
  {
    if(localStorage.getItem('loginId')===null) {
      const { dispatch } = this.props;
      message.error('请先登录!')
      dispatch(routerRedux.push('/user/login'));
      return;
       }
    const that = this;
    const formData = new FormData();
    formData.append('tenantId', 1);
    formData.append('tokenId', '01');
    formData.append('version', 1);
    fetch( URL + '/stock/getOrderAndStockAndCustomerList/v1', {
        method: 'post',
        mode: 'cors',
        body: formData
    }).then(function(res) {
        if (res.ok) {
            res.json().then(function (data) { 
              console.log(JSON.parse(data.data).productCategoryList);
              if (data.code === "0") {
                  that.setState({productCategoryList: JSON.parse(data.data).productCategoryList})
                  that.setState({orderList: JSON.parse(data.data).orderList})
                  that.setState({unitList: JSON.parse(data.data).unitList})
                  // that.setState({customerList: JSON.parse(data.data).customerList})
              }
            });
        } else if (res.status === 401) {
            console.log("Oops! You are not authorized.");
        }
    }).then(error=>{
        // console.log(JSON.stringify(error));
    });
  }


   //  新增请求
  saveOrder = () => {
    const { dispatch } = this.props;
    const formData = new FormData();   // 创建formData对象保存参数
    formData.append('tenantId', 1);
    formData.append('tokenId', '01');
    formData.append('version', 1);
    formData.append('number', this.state.value1);
    formData.append('orderId', this.state.value2);
    formData.append('productCategoryId', this.state.value3);
    formData.append('productName', this.state.value4);
    formData.append('productQuantity', this.state.value5);
    formData.append('unitId', this.state.value6);
    formData.append('remark', this.state.value7);
    formData.append('deliverTime', this.state.value8);
    fetch(URL + '/deliveritem/addDeliverItem/v1', {
        method: 'post',
        mode: 'cors',
        body: formData
    }).then(function(res) {
        if (res.ok) {
            res.json().then(function (data) {
                // console.log(data);
                message.success(data.msg,0.3);
                setTimeout(function(){
                  dispatch(routerRedux.push('/deliver/list'));
                },500);              

            });
        } else if (res.status === 401) {
            console.log("Oops! You are not authorized.");
        }
    }).then(error=>{
        console.log(JSON.stringify(error));
    });
  }

  //本地测试
  // componentDidMount() {
  //   const that = this;
  //   const formData = new FormData();
  //   formData.append('tenantId', 1);
  //   formData.append('tokenId', '01');
  //   formData.append('version', 1);
  //   fetch( '/deliveritem/getDeliverItemList/v1', {
  //       method: 'post',
  //       mode: 'cors',
  //       body: formData
  //   }).then(function(res) {
  //       if (res.ok) {
  //           res.json().then(function (data) { 
  //             // console.log(JSON.parse(data.data).productCategoryList);
  //             if (data.code === "0") {
  //                 that.setState({productCategoryList: data.data.productCategoryList})
  //                 that.setState({orderList: data.data.orderList})
  //                 that.setState({unitList: data.data.unitList})
  //                 // that.setState({customerList: JSON.parse(data.data).customerList})
  //             }
  //           });
  //       } else if (res.status === 401) {
  //           console.log("Oops! You are not authorized.");
  //       }
  //   }).then(error=>{
  //       // console.log(JSON.stringify(error));
  //   });
  // }


   //  新增请求
  // saveOrder = () => {
  //   const { dispatch } = this.props;
  //   const formData = new FormData();   // 创建formData对象保存参数
  //   formData.append('tenantId', 1);
  //   formData.append('tokenId', '01');
  //   formData.append('version', 1);
  //   formData.append('number', this.state.value1);
  //   formData.append('orderId', this.state.value2);
  //   formData.append('productCategoryId', this.state.value3);
  //   formData.append('productName', this.state.value4);
  //   formData.append('productQuantity', this.state.value5);
  //   formData.append('unitId', this.state.value6);
  //   formData.append('remark', this.state.value7);
  //   formData.append('deliverTime', this.state.value8);
  //   fetch('/deliveritem/addDeliverItem/v1', {
  //       method: 'post',
  //       mode: 'cors',
  //       body: formData
  //   }).then(function(res) {
  //       if (res.ok) {
  //           res.json().then(function (data) {
  //               // console.log(data);
  //               message.success(data.msg);
  //               setTimeout(function(){
  //                 dispatch(routerRedux.push('/deliver/list'));
  //               },500);              

  //           });
  //       } else if (res.status === 401) {
  //           console.log("Oops! You are not authorized.");
  //       }
  //   }).then(error=>{
  //       console.log(JSON.stringify(error));
  //   });
  // }
 

  //新增发货编号
  handleChange1 = (e) => {
    this.setState({
      value1: e.target.value,
    });
  }
  //新增订单编号
  onSelect1 = (value) => {
    this.setState({
      value2: value
    });
  }
  //新增物品类别
  onSelect2 = (value) => {
    this.setState({
      value3: value
    });
  }
  //新增物品名称
  handleChange4 = (e) => {
    this.setState({
      value4: e.target.value,
    });
  }
  //新增发货数量
  handleChange5 = (e) => {
    this.setState({
      value5: e.target.value,
    });
  }
  //新增物品单位
  onSelect3 = (value) => {
    this.setState({
      value6: value
    });
  }
  //新增备注
  handleChange7 = (contentState) => {
    this.setState({
      value7: toString(contentState),
    
    });
    // console.log(editorState);
  }
   //新增发货时间
   handleChange8 = (e) => {
    this.setState({
      value8: e.target.value,
    });
  }
   //返回
 goback=()=>{
  const{dispatch}=this.props;
  dispatch(routerRedux.push('/deliver/list'));
}

  render() {
    const { submitting } = this.props;
    const { getFieldDecorator, getFieldValue } = this.props.form;
    // console.log(this.state.orderList);
    // const orderListOptions = this.state.orderList.map(province => <Option key={province}>{province.number}</Option>);
    

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
        <Card bordered={false}>
          <Form
            onSubmit={this.handleSubmit}
            hideRequiredMark
            style={{ marginTop: 8 }}
          >
            <FormItem
              {...formItemLayout}
              label="发货编号"
            >
                <Input placeholder="请输入" onChange={this.handleChange1} />
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="订单编号"
            >
                <Select className={styles.select} onChange={this.onSelect1}  placeholder="请选择">
                   {
                       this.state.orderList.map(function(item){
                            return (
                            <Option value={item.id} key={item.id}>
                            {item.number}
                            </Option>)
                       })
                   }
                     </Select>
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="物品类别"
            >
               <Select className={styles.select} onChange={this.onSelect2}  placeholder="请选择">
                   {
                       this.state.productCategoryList.map(function(item){
                            return (
                            <Option value={item.id} key={item.id}>
                            {item.name}
                            </Option>)
                       })
                   }
                     </Select>
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="物品名称"
            >
                <Input placeholder="请输入" onChange={this.handleChange4} />
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="发货数量"
            >
                <Input placeholder="请输入" onChange={this.handleChange5} />
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="物品单位"
            >
            <Select className={styles.select} onChange={this.onSelect3}  placeholder="请选择">
                   {
                       this.state.unitList.map(function(item){
                            return (
                            <Option value={item.id} key={item.id}>
                            {item.value}
                            </Option>)
                       })
                   }
                     </Select>
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="发货时间"
            >
                <Input placeholder="请输入" onChange={this.handleChange8} />
            </FormItem>
            <FormItem
              {...formItemLayout}
              label={
                <span>
                  备注
                  <em className={styles.optional}>
                    （选填）
                  </em>
                </span>
              }
            >
                <Mention
                  style={{ width: '100%', height: 100 }}
                  multiLines
                  placeholder="请填写备注"
                  onChange={this.handleChange7}
                />
            </FormItem>
            <FormItem {...submitFormLayout} style={{ marginTop: 32 }}>
              <Button type="primary" onClick={this.saveOrder} style={{marginRight:20}}>
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

import React, { PureComponent } from 'react';
import { connect } from 'dva';
import {
  Form, Input, DatePicker, Select, Button, Card, InputNumber, Radio, Icon, Tooltip, Calendar, Mention,Breadcrumb,message
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
    listShow: '',  // 列表数据
    rawmaterialCategoryList:[],
    unitList:[],
    value1:'',
    value2:'',
    value3:'',
    value4:'',
    value5:'',
    value6:'',

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
    formData.append('tenantId', 1);
    formData.append('tokenId', 1);
    fetch(URL + '/rawmaterial/getRawMaterialList/v1', {
      method: 'post',
      mode: 'cors',
      body: formData
    }).then(function(res) {
      if (res.ok) {
        res.json().then(function (data) {
          if (data.code === "0") {
            that.setState({listShow: JSON.parse(data.data).rawmaterialList[0]});
            that.setState({rawmaterialCategoryList: JSON.parse(data.data).rawmaterialCategoryList})
            that.setState({unitList: JSON.parse(data.data).unitList})
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
  // componentDidMount() {
  //   const that = this;
  //   const dataSource = [...this.state.listShow];
  //   const formData = new FormData();
  //   formData.append('id', localStorage.getItem('id'));
  //   formData.append('version', 1);
  //   formData.append('tenantId', 1);
  //   formData.append('tokenId', 1);
  //   fetch('/rawmaterial/getRawMaterialList/v1', {
  //     method: 'post',
  //     mode: 'cors',
  //     body: formData
  //   }).then(function(res) {
  //     if (res.ok) {
  //       res.json().then(function (data) {
  //         if (data.code === "0") {
  //           that.setState({listShow: data.data.rawmaterialList[0]});
  //           that.setState({rawmaterialCategoryList: data.data.rawmaterialCategoryList})
  //           that.setState({unitList: data.data.unitList})
  //         }
  //       });
  //     } else if (res.status === 401) {
  //       console.log("Oops! You are not authorized.");
  //     }
  //   }).then(error=>{
  //     console.log(JSON.stringify(error));
  //   });
  // }




  //  新增请求
  saveOrder = () => {
    const { dispatch } = this.props;
    const formData = new FormData();   // 创建formData对象保存参数
    formData.append('tenantId', 1);
    formData.append('tokenId', '01');
    formData.append('version', 1);
    formData.append('id', localStorage.getItem('id'));
    formData.append('number', this.state.value1);
    formData.append('productCategoryId', this.state.value2);
    formData.append('name', this.state.value3);
    formData.append('quantity', this.state.value4);
    formData.append('unitId', this.state.value5);
    formData.append('remark', this.state.value6); 
    fetch(URL + '/rawmaterial/updateRawMaterialById/v1', {
      method: 'post',
      mode: 'cors',
      body: formData
    }).then(function(res) {
      if (res.ok) {
        res.json().then(function (data) {
          message.success(data.msg,0.3);
          setTimeout(function(){
            dispatch(routerRedux.push('/set/material'));
          },500)
        });
      } else if (res.status === 401) {
        console.log("Oops! You are not authorized.");
      }
    }).then(error=>{
      console.log(JSON.stringify(error));
    });
  }
//本地测试数据
// saveOrder = () => {
//   const { dispatch } = this.props;
//   const formData = new FormData();   // 创建formData对象保存参数
//   formData.append('tenantId', 1);
//   formData.append('tokenId', '01');
//   formData.append('version', 1);
//   formData.append('id', localStorage.getItem('id'));
//   formData.append('number', this.state.value1);
//   formData.append('productCategoryId', this.state.value2);
//   formData.append('name', this.state.value3);
//   formData.append('quantity', this.state.value4);
//   formData.append('unitId', this.state.value5);
//   formData.append('remark', this.state.value6); 
//   fetch('/rawmaterial/updateRawMaterialById/v1', {
//     method: 'post',
//     mode: 'cors',
//     body: formData
//   }).then(function(res) {
//     if (res.ok) {
//       res.json().then(function (data) {
//         message.success(data.msg);
//         setTimeout(function(){
//           dispatch(routerRedux.push('/set/material'));
//         },500)
//       });
//     } else if (res.status === 401) {
//       console.log("Oops! You are not authorized.");
//     }
//   }).then(error=>{
//     console.log(JSON.stringify(error));
//   });
// }


  handleChange1 = (e) => {
    this.setState({
      value1: e.target.value,
    });
  }
  
  handleChange2 = (value) => {
    this.setState({
      value2: value,
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
  
  handleChange5 = (value) => {
    this.setState({
      value5: value,
    });
  }
  
  handleChange6 = (e) => {
    this.setState({
      value6:  e.target.value,
    });
  }
  //返回
 goback=()=>{
  const{dispatch}=this.props;
  dispatch(routerRedux.push('/set/material'));
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
    <Breadcrumb.Item href="#/set/material">原材料管理</Breadcrumb.Item>
    <Breadcrumb.Item>更新原材料</Breadcrumb.Item>
  </Breadcrumb>
        <Card bordered={false}>
          <Form
            onSubmit={this.handleSubmit}
            hideRequiredMark
            style={{ marginTop: 8 }}
          >
            <FormItem
              {...formItemLayout}
              label="原材料编号"
            >
              {getFieldDecorator('user', { initialValue: this.state.listShow.number })(
              <Input onChange={this.handleChange1} /> )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="类别"
            >
              {getFieldDecorator('user1', { initialValue: this.state.listShow.rawMaterialCategoryName })(
              <Select className={styles.select} onChange={this.handleChange2} placeholder="请选择" >
                   {
                       this.state.rawmaterialCategoryList.map(function(item){
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
              label="原材料名称"
            >
               {getFieldDecorator('user2', { initialValue: this.state.listShow.name })(
              <Input onChange={this.handleChange3} /> )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="数量"
            >
             {getFieldDecorator('user3', { initialValue: this.state.listShow.quantity })(
              <Input onChange={this.handleChange4} /> )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="单位"
            >
              {getFieldDecorator('user4', { initialValue: this.state.listShow.unitValue })(
              <Select className={styles.select} onChange={this.handleChange5}  placeholder="请选择">
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
              label={
                <span>
                  备注
                  <em className={styles.optional}>
                    （选填）
                  </em>
                </span>
              }
            >
               {getFieldDecorator('user5', { initialValue: this.state.listShow.remark })(
              <Input onChange={this.handleChange6} /> )}
            </FormItem>
            <FormItem {...submitFormLayout} style={{ marginTop: 32 }}>
              <Button type="primary" onClick={ this.saveOrder } style={{marginRight:20}}>
                修改
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

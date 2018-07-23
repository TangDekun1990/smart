import React, { PureComponent } from 'react';
import { connect } from 'dva';
import {
  Form, Input, DatePicker, Select, Button, Card, InputNumber, Radio, Icon, Tooltip, Calendar, Mention,Breadcrumb,message
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
  state = {
     listShow: '',
     value1:'',
     value2:'',
     value3:'',
     designcategoryList:[]
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
    formData.append('id', localStorage.getItem('updataId'));
    formData.append('tokenId', argument.tokenId);
    formData.append('tenantId', argument.tokenId);
    formData.append('version', argument.tokenId);
    formData.append('active', 1);
    fetch(URL + '/design/getDesignList/v1', {
      method: 'post',
      mode: 'cors',
      body: formData
    }).then(function(res) {
      if (res.ok) {
        res.json().then(function (data) {
          // console.log(JSON.parse(data.data).designcategoryList)
          if (data.code === '0') {
            that.setState({listShow: JSON.parse(data.data).designList[0]});
            that.setState({designcategoryList:JSON.parse(data.data).designcategoryList})
          }
        });
      } else if (res.status === 401) {
        console.log("Oops! You are not authorized.");
      }
    }).then(error=>{
      console.log(JSON.stringify(error));
    });
  }
  

    //修改
  updateCustomer = () => {
    const that = this;
    const formData = new FormData();
    const { dispatch } = this.props;
    formData.append('id', localStorage.getItem('updataId'));
    formData.append('tokenId', argument.tokenId);
    formData.append('tenantId', argument.tokenId);
    formData.append('version', argument.tokenId);
    formData.append('number', this.state.value1?this.state.value1:this.state.listShow.number);
    formData.append('active', 1);
    formData.append('categoryId', this.state.value2?this.state.value2:this.state.listShow.categoryId);
    formData.append('name', this.state.value3?this.state.value3:this.state.listShow.name);
    fetch(URL + '/design/updateDesignById/v1', {
        method: 'post',
        mode: 'cors',
        body: formData
    }).then(function(res) {
        if (res.ok) {
            res.json().then(function (data) {
                if(data.code === '0') {
                   message.success(data.msg,0.3);
                   setTimeout(function(){
                     dispatch(routerRedux.push('/design/list'));
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
//本地测试数据



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

 //返回
 goback=()=>{
   const{dispatch}=this.props;
   dispatch(routerRedux.push('/design/list'));
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
        <Breadcrumb.Item href="#/design/list">花样列表</Breadcrumb.Item>
        <Breadcrumb.Item>更新花样</Breadcrumb.Item>
     </Breadcrumb>
        <Card bordered={false}>
          <Form
            onSubmit={this.handleSubmit}
            hideRequiredMark
            style={{ marginTop: 8 }}
          >
            <FormItem
              {...formItemLayout}
              label="花样编号"
            >
            {getFieldDecorator('user1', { initialValue: this.state.listShow.number })(
              <Input  onChange={this.handleChange1} readOnly />
               )}

            </FormItem>
            <FormItem
              {...formItemLayout}
              label="花样类别"
            >
             {getFieldDecorator('user2', { initialValue: this.state.listShow.designCategoryName })(
              <Select className={styles.select} onChange={this.handleChange2} placeholder="请选择" >
                   {
                       this.state.designcategoryList.map(function(item){
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
              label="花样名称"
            >
                 {getFieldDecorator('user3', { initialValue: this.state.listShow.name })(
              <Input  onChange={this.handleChange3} /> )}
            </FormItem>
            <FormItem
                {...formItemLayout}
                label="花样圈数"
              >
              {getFieldDecorator('user4', { initialValue: this.state.listShow.roundNumber })(
              <Input  onChange={this.handleChange4} disabled /> )}

              </FormItem>


            <FormItem {...submitFormLayout} style={{ marginTop: 32 }}>
            <div style={{textAlign:'center'}}>
              <Button type="primary" onClick={this.updateCustomer} style={{marginRight:8}} >
                保存
              </Button>
              <Button  onClick={this.goback} >
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

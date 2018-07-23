import React, { PureComponent } from 'react';
import { connect } from 'dva';
import {
  Form, Input, DatePicker, Select, Button, Card, InputNumber, Radio, Icon, Tooltip, Calendar, Mention,Breadcrumb,message
} from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from './style.less';
import { routerRedux } from 'dva/router';
import URL from '../../utils/api.js'
import Common from '../../utils/version.js'

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
    value1:'',
    value2:'',
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


  //新增类别名称
  handleChange1 = (e) => {
    this.setState({
      value1: e.target.value,
    });
  }

//新增备注
  handleChange2 = (value) => {

    this.setState({
      value2: toString(value)
    });
  }
  //返回
  goback=()=>{
    const { dispatch } = this.props;
    dispatch(routerRedux.push('/design/set'));
  }

  render() {
    const { submitting } = this.props;
    const { getFieldDecorator, getFieldValue, validateFields } = this.props.form;
    const saveCustomer = () => {
      validateFields((err, values) => {
        if (!err) {
          const { dispatch } = this.props;
          const formData = new FormData();
          formData.append('tenantId', 1);
          formData.append('tokenId', '01');
          formData.append('version', 1);
          formData.append('name', this.state.value1);
          formData.append('remark', this.state.value2);
          fetch(URL+'/designcategory/addDesignCategory/v1', {
              method: 'post',
              mode: 'cors',
              body: formData
          }).then(function(res) {
              if (res.ok) {
                  res.json().then(function (data) {
                      if(data.code === '0') {
                        message.success(data.msg,0.3);
                        setTimeout(function(){
                          dispatch(routerRedux.push('/design/set'));
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
      });
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
    const children = [];
    for (let i = 10; i < 36; i++) {
      children.push(<Option key={i.toString(36) + i}>{i.toString(36) + i}</Option>);
    }

    return (
      <PageHeaderLayout>
       <Breadcrumb className={styles.bread}>
        <Breadcrumb.Item >&nbsp;</Breadcrumb.Item>
        <Breadcrumb.Item href="#/design/set">花样类别</Breadcrumb.Item>
        {/* <Breadcrumb.Item href="#/setting/designSet">花样列表</Breadcrumb.Item> */}
        <Breadcrumb.Item>新增类别</Breadcrumb.Item>
     </Breadcrumb>
        <Card bordered={false}>
          <Form
            onSubmit={this.handleSubmit}
            hideRequiredMark
            style={{ marginTop: 8 }}
          >
          <FormItem
              {...formItemLayout}
              label="花样类别名称"
            >
             {getFieldDecorator('leibie', {
              rules: [{ required: true, message: '请输入花样类别名称' },{ max: 50, message: '您输入的字符过长' }],
            })(
              <Input placeholder="请输入" onChange={this.handleChange1} maxLength={51} />
            )}
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
                  onChange={this.handleChange2}
                />
            </FormItem>
            <FormItem {...submitFormLayout} style={{ marginTop: 32 }}>
            <div style={{textAlign:'center'}}>
              <Button type="primary" onClick={ saveCustomer } style={{ marginRight: 8 }}>
                保存
              </Button> <Button  onClick={this.goback} >
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

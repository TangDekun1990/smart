import React from 'react';
import { connect } from 'dva';
import { Form, Input, Button, Select, Divider, InputNumber, message } from 'antd';
import { routerRedux } from 'dva/router';
import styles from './style.less';
import URL from '../../../utils/api';
import argument from '../../../utils/argument';
const { Option } = Select;

const formItemLayout = {
  labelCol: {
    span: 5,
  },
  wrapperCol: {
    span: 19,
  },
};

@Form.create()
class Step1 extends React.PureComponent {
  state = {

    listShow: [],
    ordernumber:''

  }

  componentDidMount() {
    if(localStorage.getItem('loginId') === '') {
      const { dispatch } = this.props;
      message.error('您还未登录,请重新登录!');
      setTimeout(function() {
      dispatch(routerRedux.push('/user/login'));
      }, 500)
      return;
      }
    document.addEventListener("keydown", this.handleEnterKey);
    const that = this;
    const formData = new FormData();
    formData.append('tokenId', argument.tokenId);
    formData.append('tenantId', argument.tenantId);
    formData.append('version', argument.version);
    formData.append('active', 1);
    fetch(URL + '/customer/getCustomerList/v1', {
        method: 'post',
        mode: 'cors',
        body: formData
    }).then(function(res) {
        if (res.ok) {
            res.json().then(function (data) {
                if (data.code === '0') {
                    that.setState({listShow: JSON.parse(data.data).customerList})
                }
            });
        } else if (res.status === 401) {
            //console.log("Oops! You are not authorized.");
        }
    }).then(error=>{
        //console.log(JSON.stringify(error));
    });
  }

  //订单编号
  handChang1=(e)=>{
    this.setState({
      ordernumber:e.target.value
    })
    const that = this;
    const formData = new FormData();
    formData.append('tokenId', argument.tokenId);
    formData.append('tenantId', argument.tenantId);
    formData.append('version', argument.version);
    formData.append('active', 1);
    formData.append('orderNumber', e.target.value );
    fetch(URL + '/order/checkOrderNo/v1', {
        method: 'post',
        mode: 'cors',
        body: formData
    }).then(function(res) {
        if (res.ok) {
            res.json().then(function (data) {
                if (data.code === '0') {
                  sessionStorage.setItem('orderNumber',that.state.ordernumber);
                }else{
                  message.error(data.msg);
                  setTimeout(function(){
                    that.props.form.setFieldsValue({
                      orderNumber:''
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
    // 
  }
 //订单名称
 handChang2=(e)=>{
  sessionStorage.setItem('orderName',e.target.value);
}
 //客户名称
 handChang3=(value)=>{
  sessionStorage.setItem('orderCustomer',value);
}
//发货地址
handChange4=(e)=>{
  sessionStorage.setItem('address',e.target.value);
}
//  //联系人
//  handChang4=(e)=>{
//   sessionStorage.setItem('orderPerson',e.target.value);
// }
//  //电话
//  handChang5=(e)=>{
//   sessionStorage.setItem('orderPhone',e.target.value);
// }

addcustomer=()=>{
  const { dispatch } = this.props;
    dispatch(routerRedux.push('/setting/addCustomer'));
}

  render() {
  
    const { form, dispatch, data } = this.props;
    const { getFieldDecorator, validateFields } = form;
    const onValidateForm = () => {
      validateFields((err, values) => {
        if (!err) {
          dispatch({
            type: 'form/saveStepFormData',
            payload: values,
          });
          dispatch(routerRedux.push('/order/new/machine'));
        }
      });
    };

    return (
      <div>
        <Form layout="horizontal"  style={{marginTop:40, marginLeft:'auto', marginRight:'auto', marginBottom: 0, maxWidth:500}}  hideRequiredMark>
          <Form.Item
            {...formItemLayout}
            
            label="订单编号"
          >
            {getFieldDecorator('orderNumber', {
              initialValue: data.orderNumber,
              rules: [{ required: true, message: '请输入订单编号' }],
            })(
              <Input style={{ width: 'calc(100% - 100px)' }} maxLength={30}  onBlur={this.handChang1} placeholder="请输入订单编号" />
            )}
          </Form.Item>
          <Form.Item
            {...formItemLayout}
            label="订单名称"
          >
            <Input.Group compact>
              {getFieldDecorator('orderName', {
                initialValue:data.orderName,
                rules: [
                  { required: true, message: '请输入订单名称' },
                ],
              })(
                <Input style={{ width: 'calc(100% - 100px)' }} onChange={this.handChang2} maxLength={30} placeholder="请输入订单名称" />
              )}
            </Input.Group>
          </Form.Item>
          <Form.Item
            {...formItemLayout}
            label="客户名称"
          >
            {getFieldDecorator('customer', {
              
              initialValue:data.customer?data.customer:'请选择', 
              rules: [{ required: true, message: '请选择客户名称' }],
            })(
              <Select className={styles.select} style={{ width: 'calc(100% - 100px)' }} onChange={this.handChang3}  placeholder="请选择">
                   {
                       this.state.listShow.map(function(item){
                            return (
                            <Option value={item.id} key={item.id}>
                            {item.name}
                            </Option>)
                       })
                   }
                     </Select>

            )}

            <Button  onClick={this.addcustomer} style={{marginLeft:8}}>
              新增客户
            </Button>
          </Form.Item>
          <Form.Item
          {...formItemLayout}
          className={styles.stepFormText}
          label="发货地址"
        >

         {getFieldDecorator('address', {
              initialValue: data.address,
              rules: [{ required: true, message: '请填写发货地址' }],
            })(
            
          <Input  style={{ width: 'calc(100% - 100px)' }} onChange={this.handChange4} maxLength={60} placeholder='请填写发货地址' />
        )}
        </Form.Item>
          {/* <Form.Item
            {...formItemLayout}
            label="联系电话"
          >
            {getFieldDecorator('phone', {
              initialValue: '',
              rules: [
                { required: true, message: '输入联系电话' },
                { pattern: /^(\d+)((?:\.\d+)?)$/, message: '请输入合法数字' },
              ],
            })(
              <Input style={{ width: 'calc(100% - 100px)' }} onChange={this.handChang5} placeholder="输入联系电话" />
            )}
          </Form.Item> */}
          <Form.Item
            wrapperCol={{
              xs: { span: 24, offset: 0 },
              sm: { span: formItemLayout.wrapperCol.span, offset: formItemLayout.labelCol.span },
            }}
            label=""
          > 
          </Form.Item>
        </Form>
        <div style={{textAlign:'center'}}> <Button type="primary" onClick={onValidateForm}>
              下一步
            </Button></div>
      </div>
    );
  }
}

export default connect(({ form }) => ({
  data: form.step,
}))(Step1);

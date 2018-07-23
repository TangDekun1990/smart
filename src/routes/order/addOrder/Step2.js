import React from 'react';
import { connect } from 'dva';
import { Form, Input, Button, Alert, Divider, DatePicker, Radio } from 'antd';
import { routerRedux } from 'dva/router';
import { digitUppercase } from '../../../utils/utils';
import styles from './style.less';
import time from '../../../utils/time';
import moment from 'moment';
const RadioGroup = Radio.Group;

const { TextArea } = Input;
const dateFormat = 'YYYY-MM-DD';
const monthFormat = 'YYYY/MM';
const formItemLayout = {
  labelCol: {
    span: 5,
  },
  wrapperCol: {
    span: 19,
  },
};

@Form.create()
class Step2 extends React.PureComponent {

  state={
    value:1
  }

  componentDidMount(){
    if(localStorage.getItem('loginId') === '') {
      const { dispatch } = this.props;
      message.error('您还未登录,请重新登录!');
      setTimeout(function() {
      dispatch(routerRedux.push('/user/login'));
      }, 500)
      return;
      }

    sessionStorage.setItem('orderTime',time.today);
    sessionStorage.setItem('deliverTime',time.monthday);

  }
 //下单日期
 handChange1=(data,dataString)=>{
  sessionStorage.setItem('orderTime',dataString);
}
   
  

 //发货日期
 handChange2=(data,dataString)=>{
  sessionStorage.setItem('deliverTime',dataString);
}

//备注
handChange4=(e)=>{
  if(e.target.value){
    sessionStorage.setItem('remark',e.target.value);
  }else{
    sessionStorage.setItem('remark','无');
  }
 
}

  render() {
    const { form, data, dispatch, submitting } = this.props;
    const { getFieldDecorator, validateFields } = form;
    const onPrev = () => {
      dispatch(routerRedux.push('/order/new/info'));
    };
    const onValidateForm = () => {
      validateFields((err, values) => {
        if (!err) {
          dispatch({
            type: 'form/saveStepFormData',
            payload: values,
          });
          dispatch(routerRedux.push('/order/new/result'));
        }
      });
    };
    return (
      <Form layout="horizontal" style={{marginTop:40, marginLeft:'auto', marginRight:'auto', marginBottom: 0, maxWidth:500}}>
        <Form.Item
          {...formItemLayout}
          className={styles.stepFormText}
          label="下单日期"
        >
         {getFieldDecorator('time',{initialValue:moment(time.today, dateFormat)})(
          <DatePicker allowClear={false} readOnly  onChange={this.handChange1} format={dateFormat} />
         )}
        </Form.Item>
        
        <Form.Item
          {...formItemLayout}
          className={styles.stepFormText}
          label="交货日期"
        >
        {getFieldDecorator('deliverTime', {
          initialValue:moment(time.monthday, dateFormat),//sessionStorage.getItem('deliverTime')?moment(sessionStorage.getItem('deliverTime'), dateFormat):''
          rules: [
                  { required: true, message: '请输入交货日期' },
                ],  
            })(
          <DatePicker onChange={this.handChange2}  allowClear={false} format={dateFormat}/>
        )}
        </Form.Item>
      
        
        <Form.Item
          {...formItemLayout}
          label="备注"
          required={false}
        >
          {getFieldDecorator('remark', {
            initialValue: data.remark,
          })(
            <TextArea   rows={4} onChange={this.handChange4} style={{ width: '100%',resize:'none' }}  />
          )}
        </Form.Item>
        
        <div style={{textAlign:'center'}}>
          
          <Button style={{ marginRight: 8 }} onClick={onPrev} >
            上一步
          </Button>
          <Button type="primary"  onClick={onValidateForm} loading={submitting}>
            下一步
          </Button>
          </div>
        
      </Form>
    );
  }
}

export default connect(({ form, loading }) => ({
  submitting: loading.effects['form/submitStepForm'],
  data: form.step,
}))(Step2);

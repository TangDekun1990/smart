import React from 'react';
import { connect } from 'dva';
import { Form, Input, Button, Select, Divider, Row, Col, Card, Icon, Dropdown, Menu, InputNumber, DatePicker, Modal, message, Badge, Table } from 'antd';
import { routerRedux } from 'dva/router';
import { digitUppercase } from '../../../utils/utils';
import styles from './style.less';
import argument from '../../../utils/argument';
import URL from '../../../utils/api';

const { Option } = Select;
const { TextArea } = Input;
const formItemLayout = {
  labelCol: {
    span: 5,
  },
  wrapperCol: {
    span: 19,
  },
};
const FormItem = Form.Item;


@Form.create()
class Step2 extends React.PureComponent {
  state = {
    rowSelection: [],
    listShow:[]
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

    const { dispatch } = this.props;
    dispatch({
      type: 'rule/fetch',
    });
  }

  // 提交
  submit = () => {
    const that = this;
    const formData = new FormData();
    const { dispatch } = this.props;
    formData.append('tokenId', argument.tokenId);
    formData.append('tenantId', argument.tenantId);
    formData.append('version', argument.version);
    formData.append('active', 1);
    formData.append('orderId', sessionStorage.getItem('id'));
    if (sessionStorage.getItem('orderDesignId') === 'null') {
      message.error('请选择有花样的订单进行下发!')
      return;
    } else {
      formData.append('orderDesignId', sessionStorage.getItem('orderDesignId'));
    }
    if(sessionStorage.getItem('key') === '1') {
      formData.append('selectedMachinesArray', sessionStorage.getItem('machineId'));
    } else {
      formData.append('groupIdArray', sessionStorage.getItem('machineGroup'));
    }
    fetch( URL + '/productionInstruction/addProductionInstruction/v1', {
      method: 'post',
      mode: 'cors',
      body: formData
    }).then(function(res) {
      if (res.ok) {
        res.json().then(function (data) {
          if (data.code === '0') {
            message.success(data.msg);
            setTimeout(function() {
              dispatch(routerRedux.push('/ProductionControl/new/result'));
            },300);
          } else {
            message.error(data.msg);
          }
        });
      } else if (res.status === 401) {
        console.log("Oops! You are not authorized.");
      }
    }).then(error=>{
      //console.log(JSON.stringify(error));
    });
  }

  render() {
    const { form, data, dispatch, submitting } = this.props;
    const { getFieldDecorator, validateFields } = form;
    const onPrev = () => {
      sessionStorage.setItem('machineNumber', '');
      sessionStorage.setItem('machineName', '');
      dispatch(routerRedux.push('/ProductionControl/new/machine'));
    };
    // const onValidateForm = (e) => {
    //   e.preventDefault();
    //   validateFields((err, values) => {
    //     if (!err) {
    //       dispatch({
    //         type: 'form/submitStepForm',
    //         payload: {
    //           ...data,
    //           ...values,
    //         },
    //       });
    //     }
    //   });
    // };
    if(sessionStorage.getItem('designName')==='null') {
      sessionStorage.setItem('designName', '')
    }
    return (
      <div className={styles.stepForm}>
        <div className={styles.container}>
          <div className={styles.line}>
             <span className={styles.span1}>订单编号 :</span>
             <span className={styles.span2}><span className={styles.input}>{sessionStorage.getItem('number')}</span></span>
          </div>
          <div className={styles.line}>
             <span className={styles.span1}>订单名称 :</span>
             <span className={styles.span2}><span className={styles.input}>{sessionStorage.getItem('name')}</span></span>
          </div>
          <div className={styles.line}>
             <span className={styles.span1}>花样名称 :</span>
             <span className={styles.span2}><span className={styles.input}>{sessionStorage.getItem('designName')}</span></span>
          </div>
          <div className={styles.line}>
             <span className={styles.span1}>下发机器/组别数 :</span>
             <span className={styles.span2}><span className={styles.input}>{sessionStorage.getItem('machineNumber')}</span></span>
          </div>
        </div>
        {/*<div className={styles.line1}>
            <span className={styles.text}>下发机器/组别列表 :</span> <TextArea className={styles.TextArea} value={sessionStorage.getItem('machineName')} readOnly/>
        </div> */}
        <div style={{ marginTop: 20, textAlign: 'center' }}>
          <Button onClick={onPrev}>
            上一步
          </Button>
          <Button type="primary" style={{ marginLeft: 8 }} onClick={this.submit}>
            提交
          </Button>
        </div>
      </div>
    );
  }
}

export default connect(({ form, loading }) => ({
  submitting: loading.effects['form/submitStepForm'],
  data: form.step,
}))(Step2);

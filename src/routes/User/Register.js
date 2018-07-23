import React, { Component } from 'react';
import { connect } from 'dva';
import { routerRedux, Link } from 'dva/router';
import { Form, Input, Button, Select, Row, Col, Popover, Progress } from 'antd';
import Login from '../../components/Login';
import URL from '../../utils/api.js'
import styles from './Register.less';

const FormItem = Form.Item;
const { Option } = Select;
const InputGroup = Input.Group;

//const { Tab, UserName, Password, Mobile, Captcha, Submit } = Login;

const passwordStatusMap = {
  ok: <div className={styles.success}>强度：强</div>,
  pass: <div className={styles.warning}>强度：中</div>,
  poor: <div className={styles.error}>强度：太短</div>,
};

const passwordProgressMap = {
  ok: 'success',
  pass: 'normal',
  poor: 'exception',
};

@connect(({ register, loading }) => ({
  register,
  submitting: loading.effects['register/submit'],
}))
@Form.create()
export default class Register extends Component {
  state = {
    count: 0,
    confirmDirty: false,
    visible: false,
    help: '',
    prefix: '86',
    value: '',
    passwordValue: '',
    cPasswordValue: '',
  };

  // 用户名
  handleChange = (e) => {
    this.setState({
      value: e.target.value,
    });
  }
  // 密码
  inputChange = (e) => {
    this.setState({
      passwordValue: e.target.value,
    });
  }
  // 重复密码
  handleInput = (e) => {
    this.setState({
      cPasswordValue: e.target.value,
    });
  }

  // 注册用户
  doRegister = () => {
    const that = this;
    const formData = new FormData();
    formData.append('name', this.state.value);
    formData.append('password', this.state.passwordValue);
    formData.append('cPassword', this.state.cPasswordValue);
    formData.append('version', 1);
    const { dispatch } = this.props;
    if(this.state.value === '' ) {
      alert('请输入用户名!');
      return;
    }
    if(this.state.passwordValue === '' ) {
      alert('请输入密码!');
      return;
    }
    if(this.state.cPasswordValue === '' ) {
      alert('请输入密码!');
      return;
    }
    if(this.state.passwordValue !== this.state.cPasswordValue ) {
      alert('两次密码输入不一致,请重新输入!');
      return;
    }
    fetch(URL + '/user/register/1', {
        method: 'post',
        mode: 'cors',
        body: formData,
    }).then(function(res) {
        if (res.ok) {
            res.json().then(function (data) {
            	alert(data.msg);
            	if(data.code === '0') {
            		setTimeout(function() {
	                  dispatch(routerRedux.push('/user/login'));
	                },800)
            	} else {
            		return;
            	}
                that.setState({
                  value: '',
                  passwordValue: '',
                  cPasswordValue: '',
                });
            });
        } else if (res.status === 401) {
            console.log("Oops! You are not authorized.");
        }
    }).then(error=>{
        //console.log(JSON.stringify(error));
    });
  }


  render() {
    const { form, submitting } = this.props;

    return (
      <div className={styles.main}>
        <h3 style={{textAlign: 'center', color: '#1890ff'}}>注册</h3>
        <Form>
           <Input className={styles.input1} placeholder="用户名" onChange={this.handleChange} />
           <Input className={styles.input} type="password" placeholder="密码" onChange={this.inputChange} />
           <Input className={styles.input2} type="password" placeholder="重复密码" onChange={this.handleInput} />
          <FormItem>
            <Button
              size="large"
              loading={submitting}
              className={styles.submit}
              type="primary"
              onClick={this.doRegister}
            >
              注册
            </Button>
            <Link className={styles.login} to="/user/login">
              使用已有账户登录
            </Link>
          </FormItem>
        </Form>
      </div>
    );
  }
}

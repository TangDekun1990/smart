import React, { Component } from 'react';
import { connect } from 'dva';
import { routerRedux, Link } from 'dva/router';
import { Checkbox, Alert, Icon, Input, Button, message} from 'antd';
import Login from '../../components/Login';
import URL from '../../utils/api.js'
import styles from './Login.less';
// import Cookies from 'js-cookie';
import RenderAuthorized from '../../components/Authorized';

const { Tab, UserName, Password, Mobile, Captcha, Submit } = Login;
//const Authorized = RenderAuthorized();

@connect(({ login, loading }) => ({
  login,
  submitting: loading.effects['login/login'],
}))


export default class LoginPage extends Component {
  state = {
    type: 'account',
    autoLogin: false,
    value: '',
    passwordValue: '',
    userName: '',
    password: ''
  }

  componentDidMount() {
    document.addEventListener("keydown", this.handleEnterKey);  // 监听键盘事件

    // const that = this;
    // const { dispatch } = this.props;
    // const formData = new FormData();
    // console.log(Cookies.get('userName'))
    // console.log(Cookies.get('password'))
    // formData.append('name',  Cookies.get('userName'));
    // formData.append('password',  Cookies.get('password'));
    // formData.append('version', 1);
    // fetch(URL + 'user/login/1', {
    //     method: 'post',
    //     mode: 'cors',
    //     body: formData,
    // }).then(function(res) {
    //     if (res.ok) {
    //         res.json().then(function (data) {
    //             if(data.code === '4') {
    //                 setTimeout(function() {
    //                   dispatch(routerRedux.push('/password/read'));
    //                 },800)
    //                 that.setState({
    //                   userName: Cookies.get('userName'),
    //                   password: Cookies.get('password'),
    //                   autoLogin: true
    //                 })
    //             }
    //
    //         });
    //     } else if (res.status === 401) {
    //         console.log("Oops! You are not authorized.");
    //     }
    // }).then(error=>{
    //     console.log(JSON.stringify(error));
    // });
  }

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

 // 登录的键盘事件
 handleEnterKey = (e) => {
  if(e.keyCode === 13){
    {this.doLogin()};
  }
}

  // 登录
  doLogin = () => {
    const that = this;
    const formData = new FormData();
    const {dispatch}=this.props;
    formData.append('version', 1);
    formData.append('tokenId', '01');
    formData.append('tenantId', 1);
    formData.append('active', 1);
    formData.append('loginId', this.state.value);
    formData.append('password', this.state.passwordValue);
    if (this.state.value === '') {
      message.error('请输入用户名!');
      return;
    }
    if (this.state.passwordValue === '') {
      message.error('请输入密码!');
      return;
    }
    fetch(URL + '/userRole/login/v1', {
      method: 'post',
      mode: 'cors',
      body: formData,
    }).then(function (res) {
      if (res.ok) {
        res.json().then(function (data) {
          if (data.code === '0') {
            localStorage.setItem('loginId', JSON.parse(data.data).user.loginId);
            localStorage.setItem('loginName', JSON.parse(data.data).user.loginName);
            //localStorage.setItem('permissonCode', JSON.parse(data.data).userRole.permissonCode);
            setTimeout(function () {
              dispatch(routerRedux.push('/report/monitor'));
            }, 100)
          } else {
            alert(data.msg);
            return;
          }
        });
      } else if (res.status === 401) {
        console.log("Oops! You are not authorized.");
      }
    }).then(error => {
      //console.log(JSON.stringify(error));
    });
  }


//自动登录
  changeAutoLogin = (e) => {
    // Cookies.set('userName', this.state.value);
    // Cookies.set('password', this.state.passwordValue);
    this.setState({
      autoLogin: e.target.checked,
    });
    // console.log(Cookies.get('userName'))
  }


  renderMessage = (content) => {
    return (
      <Alert style={{ marginBottom: 24 }} message={content} type="error" showIcon />
    );
  }

  render() {
    const { login, submitting } = this.props;
    const { type } = this.state;
    return (
      <div className={styles.main}>
        <Login
          defaultActiveKey={type}
          onTabChange={this.onTabChange}
          onSubmit={this.handleSubmit}
        >
            <h3 style={{textAlign: 'center', color: '#1890ff'}}>用户登录</h3>
            <Input className={styles.input1} type="text" onChange={this.handleChange} placeholder='请输入用户名' />
            <Input className={styles.input} type="password" onChange={this.inputChange} placeholder='请输入密码' />

          <div>
            {/*<Checkbox checked={this.state.autoLogin} onChange={this.changeAutoLogin}>自动登录</Checkbox>
            <a style={{ float: 'right' }} href="">忘记密码</a>*/}
            {/* <Link className={styles.register} style={{ float: 'right' }} to="/user/register">注册账户</Link> */}
          </div>
          <div style={{ marginTop: 20 }}>
            <Button type='primary' style={{ width: "100%", height: 40 }} onClick={this.doLogin} onKeyDown={this.handleEnterKey}>登  录</Button>
          </div>
        </Login>
      </div>
    );
  }
}

import React from 'react';
import { connect } from 'dva';
import { Button, Row, Col } from 'antd';
import { routerRedux } from 'dva/router';
import Result from '../../../components/Result';
import styles from './style.less';

class Step3 extends React.PureComponent {
  componentDidMount() {
    if(localStorage.getItem('loginId') === '') {
      const { dispatch } = this.props;
      message.error('您还未登录,请重新登录!');
      setTimeout(function() {
        dispatch(routerRedux.push('/user/login'));
      }, 500)
      return;
    }
  }
  
  render() {
    const { dispatch, data } = this.props;
    const onFinish = () => {
      dispatch(routerRedux.push('/ProductionControl/new'));
    };
    const check = () => {
      dispatch(routerRedux.push('/ProductionControl/list'));
    }
    const information = (
      <div className={styles.information}>
        <Row>
          <Col span={8} className={styles.label}>付款账户：</Col>
          <Col span={16}>{data.payAccount}</Col>
        </Row>
        <Row>
          <Col span={8} className={styles.label}>收款账户：</Col>
          <Col span={16}>{data.receiverAccount}</Col>
        </Row>
        <Row>
          <Col span={8} className={styles.label}>收款人姓名：</Col>
          <Col span={16}>{data.receiverName}</Col>
        </Row>
        <Row>
          <Col span={8} className={styles.label}>转账金额：</Col>
          <Col span={16}><span className={styles.money}>{data.amount}</span> 元</Col>
        </Row>
      </div>
    );
    const actions = (
      <div>
        <Button type="primary" onClick={onFinish}>
          再次新增
        </Button>
        <Button onClick={check}>
          查看列表
        </Button>
      </div>
    );
    return (
      <Result
        type="success"
        title="新增生产指令成功"
        actions={actions}
        className={styles.result}
      />
    );
  }
}

export default connect(({ form }) => ({
  data: form.step,
}))(Step3);

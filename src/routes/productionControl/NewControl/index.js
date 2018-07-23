import React, { PureComponent } from 'react';
import { Route, Redirect, Switch } from 'dva/router';
import { Card, Steps } from 'antd';
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import { getRoutes } from '../../../utils/utils';
import styles from './style.less';

const { Step } = Steps;

export default class StepForm extends PureComponent {
  getCurrentStep() {
    const { location } = this.props;
    const { pathname } = location;
    const pathList = pathname.split('/');
    switch (pathList[pathList.length - 1]) {
      case 'info': return 0;
      case 'machine': return 1;
      case 'check': return 2;
      case 'result': return 3;
      default: return 0;
    }
  }
  render() {
    const { match, routerData } = this.props;
    return (
      <PageHeaderLayout content="">
        <Card bordered={false}>
          <div>
            <Steps current={this.getCurrentStep()} className={styles.steps}>
              <Step title="选择订单" />
              <Step title="选择机器" />
              <Step title="核对下发信息" />
              <Step title="新增完成" />
            </Steps>
            <Switch>
              {
                getRoutes(match.path, routerData).map(item => (
                  <Route
                    key={item.key}
                    path={item.path}
                    component={item.component}
                    exact={item.exact}
                  />
                ))
              }
              <Redirect exact from="/ProductionControl/new" to="/ProductionControl/new/info" />
            </Switch>
          </div>
        </Card>
      </PageHeaderLayout>
    );
  }
}

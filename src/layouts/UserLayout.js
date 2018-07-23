import React from 'react';
import { Link, Redirect, Switch, Route } from 'dva/router';
import DocumentTitle from 'react-document-title';
import { Icon } from 'antd';
import GlobalFooter from '../components/GlobalFooter';
import styles from './UserLayout.less';
import logo from '../assets/logo-blue.png';
import { getRoutes } from '../utils/utils';

const links = [{
  key: 'help',
  title: '帮助',
  href: '',
}, {
  key: 'privacy',
  title: '隐私',
  href: '',
}, {
  key: 'terms',
  title: '条款',
  href: '',
}];

const copyright = <div>Copyright <Icon type="copyright" /> 2018 蚂蚁金服体验技术部出品</div>;

class UserLayout extends React.PureComponent {
  getPageTitle() {
    const { routerData, location } = this.props;
    const { pathname } = location;
    let title = '大豪DHNET智能工厂';
    if (routerData[pathname] && routerData[pathname].name) {
      title = `${routerData[pathname].name} - 大豪DHNET智能工厂`;
    }
    return title;
  }
  render() {
    const { routerData, match } = this.props;
    return (
      <DocumentTitle title={this.getPageTitle()}>
        <div className={styles.container}>
          <div className={styles.content}>
            <div className={styles.top}>
              <div className={styles.header}>
                <span>
                  <img alt="logo" className={styles.logo} src={logo} />
                  <span className={styles.title}>DH-NET 网络智能工厂系统</span>
                </span>
              </div>
              <div className={styles.desc}></div>
            </div>
            <Switch>
              {getRoutes(match.path, routerData).map(item =>
                (
                  <Route
                    key={item.key}
                    path={item.path}
                    component={item.component}
                    exact={item.exact}
                  />
                )
              )}
              <Redirect exact from="/user" to="/user/login" />
            </Switch>
          </div>
          <GlobalFooter  copyright={copyright} />
        </div>
      </DocumentTitle>
    );
  }
}

export default UserLayout;

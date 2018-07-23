import React, { PureComponent } from 'react';
import { Layout, Menu, Icon, Spin, Tag, Dropdown, Avatar, Divider, Button } from 'antd';
import moment from 'moment';
import { connect } from 'dva';
import { routerRedux, Link } from 'dva/router';
import groupBy from 'lodash/groupBy';
import Debounce from 'lodash-decorators/debounce';
import NoticeIcon from '../NoticeIcon';
import HeaderSearch from '../HeaderSearch';
import styles from './index.less';
import img from '../../assets/avator.png';

const { Header } = Layout;
@connect(({ login, loading }) => ({
  login,
  submitting: loading.effects['login/login'],
}))

export default class GlobalHeader extends PureComponent {
  componentWillUnmount() {
    this.triggerResizeEvent.cancel();
  }

  getNoticeData() {
    const { notices = [] } = this.props;
    if (notices.length === 0) {
      return {};
    }
    const newNotices = notices.map((notice) => {
      const newNotice = { ...notice };
      if (newNotice.datetime) {
        newNotice.datetime = moment(notice.datetime).fromNow();
      }
      // transform id to item key
      if (newNotice.id) {
        newNotice.key = newNotice.id;
      }
      if (newNotice.extra && newNotice.status) {
        const color = ({
          todo: '',
          processing: 'blue',
          urgent: 'red',
          doing: 'gold',
        })[newNotice.status];
        newNotice.extra = <Tag color={color} style={{ marginRight: 0 }}>{newNotice.extra}</Tag>;
      }
      return newNotice;
    });
    return groupBy(newNotices, 'type');
  }
  toggle = () => {
    const { collapsed, onCollapse } = this.props;
    onCollapse(!collapsed);
    this.triggerResizeEvent();
  }
  @Debounce(600)
  triggerResizeEvent() { // eslint-disable-line
    const event = document.createEvent('HTMLEvents');
    event.initEvent('resize', true, false);
    window.dispatchEvent(event);
  }
  render() {
    const {
      currentUser, collapsed, fetchingNotices, isMobile, logo,
      onNoticeVisibleChange, onMenuClick, onNoticeClear, dispatch
    } = this.props;
    const logout = () => {
      dispatch(routerRedux.push('/user/login'));
      localStorage.setItem('loginId', '');
    }

    const menu = (
      <Menu className={styles.menu} selectedKeys={[]} onClick={onMenuClick}>
           <Menu.Item>
              <span style={{display: 'inline-block', width: 100}} onClick={ logout }>
                  <Icon type="logout" />退出登录
              </span>
           </Menu.Item>
      </Menu>
    );
    const noticeData = this.getNoticeData();
    return (
      <Header className={styles.header}

               style={{background:'#fff', position:'relative',  boxShadow:'0 1 4 rgba(0, 21, 41, .08)',  paddingTop:0,paddingRight:12,paddingBottom:0,paddingLeft:0}}>
        {isMobile && (
          [
            (
              <Link to="/" className={styles.logo} key="logo">
                <img src={logo} alt="logo" width="32" />
              </Link>
            ),
            <Divider type="vertical" key="line" />,
          ]
        )}

        <Icon
          className={styles.trigger}
          type={collapsed ? 'menu-unfold' : 'menu-fold'}
          onClick={this.toggle}
        />

        {/* <span style={{width: '82%', display:"inline-block", textAlign: 'right'}}>
            <Button icon='retweet'>使用旧版</Button>
        </span> */}

        <div className={styles.right}>
            <Dropdown overlay={menu}>
              <span className={`${styles.action} ${styles.account}`}>
                <span> <img src={img} style={{ marginTop: '-3px'}} /> </span>
                <span className={styles.name}>{localStorage.getItem('loginName')}</span>
              </span>
            </Dropdown>
        </div>
      </Header>
    );
  }
}

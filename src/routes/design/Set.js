import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { Row, Col, Card, Form, Input, Select, Icon, Button, Dropdown, Menu,Breadcrumb, InputNumber, DatePicker, Modal, message, Badge, Divider, Table, Popconfirm } from 'antd';
import StandardTable from '../../components/StandardTable';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import URL from '../../utils/api';
import { routerRedux } from 'dva/router';

import styles from './TableList.less';

const FormItem = Form.Item;
const { Option } = Select;
const getValue = obj => Object.keys(obj).map(key => obj[key]).join(',');
const statusMap = ['default', 'processing', 'success', 'error'];
const status = ['关闭', '运行中', '已上线', '异常'];



@connect(({ rule, loading }) => ({
  rule,
  loading: loading.models.rule,
}))
@Form.create()


export default class TableList extends PureComponent {
  state = {
    modalVisible: false,
    expandForm: false,
    selectedRows: [],
    formValues: {},
    listShow: [],  // 列表数据
    value5:'',
    value1:'',
    value2:'',
    value3:'',
    value4:'',
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
    const that = this;
    const formData = new FormData();
    formData.append('tokenId', '01');
    formData.append('tenantId', 1);
    formData.append('version', 1);
    formData.append('active', 1);
    fetch(URL + '/designcategory/getDesignCategoryList/v1', {
        method: 'post',
        mode: 'cors',
        body: formData
    }).then(function(res) {
        if (res.ok) {
            res.json().then(function (data) {
                if (data.code === "0") {
                  // console.log(JSON.parse(data.data).productCategoryList);
                    that.setState({listShow: JSON.parse(data.data).designcategoryList});
                }
            });
        } else if (res.status === 401) {
            console.log("Oops! You are not authorized.");
        }
    }).then(error=>{
        console.log(JSON.stringify(error));
    });
  }
//本地测试
// componentDidMount() {
//   const that = this;
//   const formData = new FormData();
//   formData.append('tokenId', '01');
//   formData.append('tenantId', 1);
//   formData.append('version', 1);
//   formData.append('active', 1);
//   fetch('/design/getDesignList/v1', {
//       method: 'post',
//       mode: 'cors',
//       body: formData
//   }).then(function(res) {
//       if (res.ok) {
//           res.json().then(function (data) {
//               if (data.code === "0") {

//                   that.setState({listShow: data.data.designCategoryList});

//               }
//           });
//       } else if (res.status === 401) {
//           console.log("Oops! You are not authorized.");
//       }
//   }).then(error=>{
//       console.log(JSON.stringify(error));
//   });
// }


  //  删除
  remove = (id) => {
    const that = this;
    const dataSource = [...this.state.listShow];
    const formData = new FormData();
    formData.append('tokenId', '01');
    formData.append('tenantId', 1);
    formData.append('id', id );
    formData.append('version', 1);
    fetch( URL + '/designcategory/deleteDesignCategoryById/v1', {
        method: 'post',
        mode: 'cors',
        body: formData
    }).then(function(res) {
        if (res.ok) {
            res.json().then(function (data) {
              that.setState({listShow: dataSource.filter(item => item.id !== id)});
            });
        } else if (res.status === 401) {
            console.log("Oops! You are not authorized.");
        }
    }).then(error=>{
        console.log(JSON.stringify(error));
    });
  }
//本地测试删除
// remove = (id) => {
//   const that = this;
//   const dataSource = [...this.state.listShow];
//   const formData = new FormData();
//   formData.append('tokenId', '01');
//   formData.append('tenantId', 1);
//   formData.append('id', id );
//   formData.append('version', 1);
//   fetch('/design/getDesignList/v1', {
//       method: 'post',
//       mode: 'cors',
//       body: formData
//   }).then(function(res) {
//       if (res.ok) {
//           res.json().then(function (data) {
//             // console.log(data);
//             that.setState({listShow: dataSource.filter(item => item.id !== id)});
//           });
//       } else if (res.status === 401) {
//           console.log("Oops! You are not authorized.");
//       }
//   }).then(error=>{
//       console.log(JSON.stringify(error));
//   });
// }


  toggleForm = () => {
    this.setState({
      expandForm: !this.state.expandForm,
    });
  }

  handleMenuClick = (e) => {
    const { dispatch } = this.props;
    const { selectedRows } = this.state;

    if (!selectedRows) return;

    switch (e.key) {
      case 'remove':
        dispatch({
          type: 'rule/remove',
          payload: {
            no: selectedRows.map(row => row.no).join(','),
          },
          callback: () => {
            this.setState({
              selectedRows: [],
            });
          },
        });
        break;
      default:
        break;
    }
  }

  handleSelectRows = (rows) => {
    this.setState({
      selectedRows: rows,
    });
  }


  handleModalVisible = (flag) => {
    this.setState({
      modalVisible: !!flag,
    });
  }
//新增
handleAdd=()=>{
   const { dispatch } = this.props;
    dispatch(routerRedux.push('/design/addDesignSet'));
}


  //返回
  goback=()=>{
    const { dispatch } = this.props;
    dispatch(routerRedux.push('/setting/addDesign'));
  }
  //更新操作
  doUpdate = (id) => {
     localStorage.setItem('checkId',id);
    const { dispatch } = this.props;
    dispatch(routerRedux.push('/design/updateDesignSet'));
  };

  render() {
    //const { rule: { data }, loading } = this.props;
    const { selectedRows, modalVisible } = this.state;
    //const { listShow } = this.state;
    const { dispatch } = this.props;
    const menu = (
      <Menu onClick={this.handleMenuClick} selectedKeys={[]}>
        <Menu.Item key="remove">删除</Menu.Item>
        <Menu.Item key="approval">批量审批</Menu.Item>
      </Menu>
    );

    const columns = [
       {
        title: '序号',
        dataIndex: 'index',
        key: 'index',
       },
       {
        title: '花样类别名称',
        dataIndex: 'name',
        key: 'name',
          },

          {
            title: '备注',
            dataIndex: 'remark',
            key: 'remark',
          },
        {
        title: '编辑',
        key: 'hello',
        render: (record) => (
          <Fragment>
            <a onClick={() => this.doUpdate(record.id)}>修改</a>
            <Divider type="vertical" />
            {/* <Popconfirm title="确定删除吗？"   okText="是" cancelText="否">
              <a href="#">删除</a>
            </Popconfirm> */}
            <Popconfirm title="是否要删除此类别？" onConfirm={() => this.remove(record.id)}>
                        <a>删除</a>
                      </Popconfirm>
          </Fragment>
        ),
      },
    ];
    return (
      <PageHeaderLayout>
       <Breadcrumb className={styles.bread}>
        {/* <Breadcrumb.Item >&nbsp;</Breadcrumb.Item>
        <Breadcrumb.Item href="#/setting/design">花样列表</Breadcrumb.Item>
        <Breadcrumb.Item>花样类别</Breadcrumb.Item> */}
     </Breadcrumb>

        <Card bordered={false}>
        <Button type="primary" style={{float:'right'}} onClick={this.handleAdd}>新增花样类别</Button>
        {/* <Button type="primary" onClick={this.goback} style={{float:'right'}}>
                返回
              </Button> */}
          <div className={styles.tableList}>

            <div style={{  height: 60 }}></div>

            <Table
              dataSource={ this.state.listShow }
              columns={columns}
              rowKey={record => record.id}
              bordered={true}
              onKey={this.remove}
              onKey={this.doUpdate}
              // onChange={this.handleStandardTableChange}
            />
          </div>
        </Card>
      </PageHeaderLayout>
    );
  }
}

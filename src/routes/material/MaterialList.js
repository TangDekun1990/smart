import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { Row, Col, Card, Form, Input, Select, Icon, Button, Dropdown, Menu, InputNumber, DatePicker, Modal, message, Badge, Divider, Table, Popconfirm } from 'antd';
import StandardTable from '../../components/StandardTable';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import { routerRedux } from 'dva/router';
import URL from '../../utils/api';

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
    statusList: [], // 状态里表数据
    rawmaterialCategoryList:[],
    value1:'',
    value2:'',
    value3:''
  };
  componentDidMount() {
    if(localStorage.getItem('loginId')===null) {
      const { dispatch } = this.props;
      message.error('请先登录!')
      dispatch(routerRedux.push('/user/login'));
      return;
       }
    document.addEventListener("keydown", this.handleEnterKey);
    const that = this;
    const formData = new FormData();
    formData.append('tokenId', '01');
    formData.append('tenantId', 1);
    formData.append('version', 1);
    formData.append('active', 1);
    fetch(URL +　'/rawmaterial/getRawMaterialList/v1', {
      method: 'post',
      mode: 'cors',
      body: formData
    }).then(function(res) {
      if (res.ok) {
        res.json().then(function (data) {
          if (data.code === "0") {
            that.setState({listShow: JSON.parse(data.data).rawmaterialList});
            that.setState({rawmaterialCategoryList: JSON.parse(data.data).rawmaterialCategoryList});
          }
        });
      } else if (res.status === 401) {
        console.log("Oops! You are not authorized.");
      }
    }).then(error=>{
      console.log(JSON.stringify(error));
    });
  }
 //本地数据测试
//  componentDidMount() {
//   const that = this;
//   const formData = new FormData();
//   formData.append('tokenId', '01');
//   formData.append('tenantId', 1);
//   formData.append('version', 1);
//   formData.append('active', 1);
//   fetch('/rawmaterial/getRawMaterialList/v1', {
//     method: 'post',
//     mode: 'cors',
//     body: formData
//   }).then(function(res) {
//     if (res.ok) {
//       res.json().then(function (data) {
//         if (data.code === "0") {
//           that.setState({listShow: data.data.rawmaterialList});
//           that.setState({rawmaterialCategoryList: data.data.rawmaterialCategoryList});
//         }
//       });
//     } else if (res.status === 401) {
//       console.log("Oops! You are not authorized.");
//     }
//   }).then(error=>{
//     console.log(JSON.stringify(error));
//   });
// }

  // 查询按钮事件
  doQuery = () => {
    const that = this;
    const formData = new FormData();
    formData.append('rawMaterialCategoryId', this.state.value1);
    formData.append('name', this.state.value2);
    formData.append('number', this.state.value3);
    formData.append('tokenId', '01');
    formData.append('tenantId', 1);
    formData.append('version', 1);
    formData.append('active', 1);
    fetch(URL + '/rawmaterial/getRawMaterialList/v1', {
      method: 'post',
      mode: 'cors',
      body: formData
    }).then(function(res) {
      if (res.ok) {
        res.json().then(function (data) {
          console.log(JSON.parse(data.data).rawmaterialList);
          that.setState({listShow: JSON.parse(data.data).rawmaterialList});
        });
      } else if (res.status === 401) {
        // console.log("Oops! You are not authorized.");
      }
    }).then(error=>{
      // console.log(JSON.stringify(error));
    });
  }
  //  类别
  handleChange1 = (value) => {
    this.setState({
      value1: value,
    });
  }
  // 选择物品名
  handleChange2 = (e) => {
    this.setState({
      value2: e.target.value,
    });
  }
  // 库存编号
  handleChange3 = (e) => {
    this.setState({
      value3: e.target.value,
    });
  }


//删除列表

remove = (id) => {
  const that = this;
  const dataSource = [...this.state.listShow];
  const formData = new FormData();
  formData.append('tokenId', '01');
  formData.append('tenantId', 1);
  formData.append('id', id );
  formData.append('version', 1);
  fetch( URL + '/rawmaterial/deleteRawMaterialById/v1', {
      method: 'post',
      mode: 'cors',
      body: formData
  }).then(function(res) {
      if (res.ok) {
          res.json().then(function (data) {
            console.log(data);
            that.setState({listShow: dataSource.filter(item => item.id !== id)});
          });
      } else if (res.status === 401) {
          // console.log("Oops! You are not authorized.");
      }
  }).then(error=>{
      // console.log(JSON.stringify(error));
  });
}
//本地测试数据
// remove = (id) => {
//   const that = this;
//   const dataSource = [...this.state.listShow];
//   const formData = new FormData();
//   formData.append('tokenId', '01');
//   formData.append('tenantId', 1);
//   formData.append('id', id );
//   formData.append('version', 1);
//   fetch( '/rawmaterial/deleteRawMaterialById/v1', {
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
//           // console.log("Oops! You are not authorized.");
//       }
//   }).then(error=>{
//       // console.log(JSON.stringify(error));
//   });
// }
  


  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    const { dispatch } = this.props;
    const { formValues } = this.state;

    const filters = Object.keys(filtersArg).reduce((obj, key) => {
      const newObj = { ...obj };
      newObj[key] = getValue(filtersArg[key]);
      return newObj;
    }, {});

    const params = {
      currentPage: pagination.current,
      pageSize: pagination.pageSize,
      ...formValues,
      ...filters,
    };
    if (sorter.field) {
      params.sorter = `${sorter.field}_${sorter.order}`;
    }

    dispatch({
      type: 'rule/fetch',
      payload: params,
    });
  }
//重置
  handleFormReset = () => {
    const { form } = this.props;
    form.resetFields();
    this.setState({
      value1:'',
      value2:'',
      value3:'',
    });
    this.componentDidMount();
  }

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

  handleSearch = (e) => {
    e.preventDefault();

    const { dispatch, form } = this.props;

    form.validateFields((err, fieldsValue) => {
      if (err) return;

      const values = {
        ...fieldsValue,
        updatedAt: fieldsValue.updatedAt && fieldsValue.updatedAt.valueOf(),
      };

      this.setState({
        formValues: values,
      });

      dispatch({
        type: 'rule/fetch',
        payload: values,
      });
    });
  }

  handleModalVisible = (flag) => {
    this.setState({
      modalVisible: !!flag,
    });
  }

  handleAdd = (fields) => {
    this.props.dispatch({
      type: 'rule/add',
      payload: {
        description: fields.desc,
      },
    });

    message.success('添加成功');
    this.setState({
      modalVisible: false,
    });
  }
// 键盘回车查询
handleEnterKey = (e) => {
  if(e.keyCode === 13){
      this.doQuery();
  }
}
  renderSimpleForm() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="类别">
              {getFieldDecorator('no')(
                <Select className={styles.select} onChange={this.handleChange1}  placeholder="请选择">
                   {
                       this.state.rawmaterialCategoryList.map(function(item){
                            return (
                            <Option value={item.id} key={item.id}>
                            {item.name}
                            </Option>)
                       })
                   }
                     </Select>
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="原材料名称">
              {getFieldDecorator('no1')(
                   <Input placeholder="请输入" onChange={this.handleChange2} />
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <Button type="primary"  onClick={this.doQuery} onKeyDown={this.handleEnterKey}>查询</Button>
            <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>重置</Button>
            <a style={{ marginLeft: 8 }} onClick={this.toggleForm}>
               展开 <Icon type="down" />
            </a>
          </Col>
         </Row>
      </Form>
    );
  }
 
  renderAdvancedForm() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem 
            label="类别">
              {getFieldDecorator('no')(
                <Select className={styles.select} onChange={this.handleChange1}  placeholder="请选择">
                   {
                       this.state.rawmaterialCategoryList.map(function(item){
                            return (
                            <Option value={item.id} key={item.id}>
                            {item.name}
                            </Option>)
                       })
                   }
                     </Select>
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="原材料名称">
              {getFieldDecorator('no1')(
                 <Input placeholder="请输入" onChange={this.handleChange2} />
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="原材料编号">
              {getFieldDecorator('no2')(
                   <Input placeholder="请输入" onChange={this.handleChange3} />
              )}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <Button type="primary"  onClick={this.doQuery} onKeyDown={this.handleEnterKey}>查询</Button>
            <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>重置</Button>
            <a style={{ marginLeft: 8 }} onClick={this.toggleForm}>
              收起 <Icon type="up" />
            </a>
          </Col>
        </Row>
      </Form>
    );
  }
  renderForm() {
    return this.state.expandForm ? this.renderAdvancedForm() : this.renderSimpleForm();
  }
//更新列别
doUpdate = (id) => {
  localStorage.setItem('id',id);
  const { dispatch } = this.props;
  dispatch(routerRedux.push('/set/updateMaterial'));
};

  render() {
    //const { rule: { data }, loading } = this.props;
    const { selectedRows, modalVisible } = this.state;
    const { dispatch } = this.props;
    const addMaterial = () => {
      dispatch(routerRedux.push('/set/addMaterial'));
    };
    const menu = (
      <Menu onClick={this.handleMenuClick} selectedKeys={[]}>
        <Menu.Item key="remove">删除</Menu.Item>
        <Menu.Item key="approval">批量审批</Menu.Item>
      </Menu>
    );
    const columns = [
      {
        title: '原材料编号',
        dataIndex: 'number',
        key: 'number',
      },
      {
        title: '类别',
        dataIndex: 'rawMaterialCategoryName',
        key: 'rawMaterialCategoryName',
      },
      {
        title: '原材料名称',
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: '数量',
        dataIndex: 'quantity',
        key: 'quantity',
      },
      {
        title: '单位',
        dataIndex: 'unitValue',
        key: 'unitValue',
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
            <Popconfirm title="是否要删除此行？" onConfirm={() => this.remove(record.id)}>
                        <a>删除</a>
                      </Popconfirm>
          </Fragment>
        ),
      },
    ];
    const parentMethods = {
      handleAdd: this.handleAdd,
      handleModalVisible: this.handleModalVisible,
    };

    return (
      <PageHeaderLayout>
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>
              {this.renderForm()}
            </div>
            <div style={{  height: 30 }}></div>
            <div style={{ textAlign: 'right', marginBottom: 10, marginRight: 100 }}>
              <Button type="primary" onClick={ addMaterial } >新增原材料</Button>
            </div>
            <Table
              dataSource={ this.state.listShow }
              columns={columns}
              rowKey={record => record.id}
              rowSelection={this.state.selectedRows}
              onKey={this.remove}
              onKey={this.doUpdate}
            />
          </div>
        </Card>
      </PageHeaderLayout>
    );
  }
}

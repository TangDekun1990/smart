import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { Row, Col, Card, Form, List, DatePicker, Input, Select, Icon, Button, Dropdown, Menu, InputNumber, Modal, message, Badge, Divider, Table, Popconfirm, Pagination } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import URL from '../../utils/api';
import argument from '../../utils/argument';
import ww from '../../assets/logo-blue.png';
import { routerRedux } from 'dva/router';
import styles from './CardList.less';

const { RangePicker, MonthPicker } = DatePicker;
const FormItem = Form.Item;
const { Option } = Select;
const getValue = obj => Object.keys(obj).map(key => obj[key]).join(',');
const statusMap = ['default', 'processing', 'success', 'error'];
const status = ['关闭', '运行中', '已上线', '异常'];

@connect(({ list, loading }) => ({
  list,
  loading: loading.models.list,
}))

@Form.create()
export default class CardList extends PureComponent {
  state = {
    modalVisible: false,
    expandForm: false,
    selectedRows: [],
    formValues: {},
    listShow: [],
    value1:'',
    value2:'',
    value3:'',
    value4:'',
    value5:'',
    value6:'',
    current:1,
    designcategoryList:[],
    dataCount: '',
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
    document.addEventListener("keydown", this.handleEnterKey);
    const that = this;
    const formData = new FormData();
    formData.append('tokenId', argument.tokenId);
    formData.append('tenantId', argument.tokenId);
    formData.append('version', argument.tokenId);
    formData.append('active', 1);
    fetch(URL + '/design/getDesignList/v1', {
        method: 'post',
        mode: 'cors',
        body: formData
    }).then(function(res) {
        if (res.ok) {
            res.json().then(function (data) {
                if (data.code === '0') {
                    that.setState({
                      listShow: JSON.parse(data.data).designList,
                      designcategoryList: JSON.parse(data.data).designcategoryList,
                      dataCount: JSON.parse(data.data).dataCount
                    });
                 }
            });
        } else if (res.status === 401) {
            console.log("Oops! You are not authorized.");
        }
    }).then(error=>{
        // console.log(JSON.stringify(error));
    });
  }
  // 查询按钮事件
  doQuery = () => {
      const that = this;
      const formData = new FormData();
      formData.append('categoryId', this.state.value1);
      formData.append('name', this.state.value2);
      formData.append('startDate', this.state.value3);
      formData.append('endDate', this.state.value4);
      formData.append('minRound', this.state.value5);
      formData.append('maxRound', this.state.value6);
      formData.append('tokenId', argument.tokenId);
      formData.append('tenantId', argument.tokenId);
      formData.append('version', argument.tokenId);
      formData.append('active', 1);
      fetch( URL + '/design/getDesignList/v1', {
          method: 'post',
          mode: 'cors',
          body: formData
      }).then(function(res) {
          if (res.ok) {
              res.json().then(function (data) {
                  if (data.code === '0') {
                    that.setState({
                      listShow: JSON.parse(data.data).designList,
                      dataCount: JSON.parse(data.data).dataCount
                    });
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

 //选择花样类别
 handleChange1 = (value) => {
  console.log(value);
  this.setState({
    value1:value,
  });
}

 //选择花样名称
 handleChange2 = (e) => {
  this.setState({
    value2:e.target.value,
  });
}

 //选择时间
 handleChange3=(date,dateString)=>{

  this.setState({
    value3:dateString[0],
    value4:dateString[1]
  });
 }
 //选择圈数
 handleChange5 = (e) => {
  this.setState({
    value5:e.target.value,
  });
}
handleChange6 = (e) => {
  this.setState({
    value6:e.target.value,
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
    value4:'',
    value5:'',
    value6:'',
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
          <FormItem label="花样类别">
            {getFieldDecorator('no1')(
              <Select  onChange={this.handleChange1} style={{width:'1030%'}} placeholder="请选择">
                 <Option value="">全部</Option>
                 {
                     this.state.designcategoryList.map(function(item){
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
          <FormItem label="花样名称">
            {getFieldDecorator('no2',{

            rules: [{ max: 30, message: '您输入的字符过长' }],
          })(
              <Input placeholder="请输入" style={{width:'150%'}} maxLength="31" onChange={this.handleChange2}/>
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
      <Row gutter={{ md: 8, lg: 24, xl: 48 }} style={{marginBottom:30}}>
        <Col md={8} sm={24}>
          <FormItem label="花样类别">
          {getFieldDecorator('no1')(
            <Select className={styles.select} onChange={this.handleChange1} style={{width:'1030%'}} placeholder="请选择">
                  <Option value="">全部</Option>
                 {
                     this.state.designcategoryList.map(function(item){
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
          <FormItem label="花样名称">
            {getFieldDecorator('no2',{

            rules: [{ max: 30, message: '您输入的字符过长' }],
          })(
              <Input placeholder="请输入" style={{width:'150%'}} onChange={this.handleChange2} maxLength="31"/>
            )}
          </FormItem>
        </Col>
        <Col md={8} sm={24}>
        <Button type="primary"  onClick={this.doQuery} onKeyDown={this.handleEnterKey}>查询</Button>
          <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>重置</Button>
          <a style={{ marginLeft: 8 }} onClick={this.toggleForm}>
            收起 <Icon type="up" />
          </a>
        </Col>
        </Row>
      <Row gutter={{ md: 8, lg: 24, xl: 48 }} >
        <Col md={8} sm={24} style={{width:500}}>
            <FormItem label="更新时间">
               {getFieldDecorator('no4')(
                  <RangePicker style={{width:'78%'}} onChange={this.handleChange3}/>
               )}
            </FormItem>
        </Col>
        {/* <Col md={8} sm={24}>
          <FormItem label="圈数范围">
            {getFieldDecorator('no3')(
              <Input.Group compact={true}>
              <Input placeholder="请输入" onChange={this.handleChange5} style={{width:115,borderRightWidth:1,borderRadius:4}}/>
              <span style={{marginTop:6,marginLeft:4,marginRight:4}}>到</span>
              <Input placeholder="请输入" onChange={this.handleChange6} style={{width:115,borderLeftWidth:1,borderRadius:4}}/>
              </Input.Group>
            )}
          </FormItem>
        </Col>*/}
      </Row>
    </Form>
  );
}

  renderForm() {
    return this.state.expandForm ? this.renderAdvancedForm() : this.renderSimpleForm();
  }

  //删除花样
  remove = (id) => {
    const that = this;
    const dataSource = [...this.state.listShow];
    const formData = new FormData();
    formData.append('tokenId', argument.tokenId);
    formData.append('tenantId', argument.tokenId);
    formData.append('version', argument.tokenId);
    formData.append('id', id);
    fetch(URL+'/design/deleteDesignById/v1', {
      method: 'post',
      mode: 'cors',
      body: formData
    }).then(function(res) {
      if (res.ok) {
        res.json().then(function (data) {
          that.setState({listShow: dataSource.filter(item => item.id !== id)});
        });
      } else if (res.status === 401) {
        // console.log("Oops! You are not authorized.");
      }
    }).then(error=>{
      // console.log(JSON.stringify(error));
    });
  };

 //更新操作
 doUpdate = (id) => {
  localStorage.setItem('updataId', id);
  const { dispatch } = this.props;
  dispatch(routerRedux.push('/design/updateDesign'));
};


//新增
addDesign = () => {
      const { dispatch } = this.props;
      dispatch(routerRedux.push('/design/addDesign'));
    };

// 点击翻页
changePage = (page, pageSize) => {
  const that = this;
  const formData = new FormData();
  formData.append('tokenId', argument.tokenId);
  formData.append('tenantId', argument.tokenId);
  formData.append('version', argument.tokenId);
  formData.append('categoryId', this.state.value1);
  formData.append('name', this.state.value2);
  formData.append('startDate', this.state.value3);
  formData.append('endDate', this.state.value4);
  formData.append('minRound', this.state.value5);
  formData.append('maxRound', this.state.value6);
  formData.append('active', 1);
  formData.append('rowSize', pageSize);
  formData.append('currentPage', page);
  fetch(URL + '/design/getDesignList/v1', {
      method: 'post',
      mode: 'cors',
      body: formData
  }).then(function(res) {
      if (res.ok) {
          res.json().then(function (data) {
              if (data.code === '0') {
                  that.setState({
                    listShow: JSON.parse(data.data).designList
                  });
              } else {
                message.error(data.msg);
              }
          });
      } else if (res.status === 401) {
          console.log("Oops! You are not authorized.");
      }
  }).then(error=>{
      // console.log(JSON.stringify(error));
  });
}


render() {
    const { selectedRows, modalVisible } = this.state;
    const { list: { list }, loading,p } = this.props;
    const menu = (
      <Menu onClick={this.handleMenuClick} selectedKeys={[]}>
        <Menu.Item key="remove">删除</Menu.Item>
        <Menu.Item key="approval">批量审批</Menu.Item>
      </Menu>
    );

    const parentMethods = {
      handleAdd: this.handleAdd,
      handleModalVisible: this.handleModalVisible,
    };

    const columns = [
      {
        title: '花样编号',
        dataIndex: 'number',
        key: 'number',
        align: 'center',
      },
      {
        title: '花样名称',
        dataIndex: 'name',
        key: 'name',
        align: 'center',
      },
      {
        title: '花样类别',
        dataIndex: 'designCategoryName',
        key: 'designCategoryName',
        align: 'center',
      },
      {
        title: '更新时间',
        dataIndex: 'updateTime',
        key: 'updateTime',
        align: 'center',
      },
      {
        title: '编辑',
        key: 'hello',
        align: 'center',
        render: (record) => (
          <Fragment>
            <a onClick={() => this.doUpdate(record.id)}>修改</a>
            <Divider type="vertical" />
            <Popconfirm title="是否要删除该花样？" onConfirm={() => this.remove(record.id)}>
                        <a>删除</a>
                      </Popconfirm>
          </Fragment>
        ),
      },
    ];


  return (
      <PageHeaderLayout>
       <div style={{backgroundColor: '#fff',padding:30}}>
       <div className={styles.tableListForm}>
              {this.renderForm()}
            </div>
            <div className={styles.cardList} style={{marginTop:20}}>
           <div style={{ textAlign: 'right', marginBottom: 10 ,marginTop: 30}}>
              <Button type="primary" onClick={this.addDesign }>添加花样到本地服务器</Button>
           </div>
           <Table
             dataSource={ this.state.listShow }
             columns={columns}
             rowKey={record => record.id}
             onKey={this.remove}
             onKey={this.doUpdate}
             pagination={false}
           />
           <div className={styles.changePage}>
              <Pagination size="small" total={parseInt(this.state.dataCount)} onChange={this.changePage} showQuickJumper />
           </div>
       </div>

       </div>

      </PageHeaderLayout>
    );
  }
}

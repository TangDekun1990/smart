import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { Row, Col, Card, Form,List, Input, Select, Icon, Button,Pagination, Dropdown, Menu, InputNumber, DatePicker, Modal, message, Badge, Divider, Table, Popconfirm, Option } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import URL from '../../utils/api';
import { routerRedux } from 'dva/router';
import styles from './CardList.less';
import argument from '../../utils/argument';


const FormItem = Form.Item;
//const { Option } = Select;
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
    listShow: [],  // 列表数据
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
    let arr=[];
    let worker='';
    const that = this;
    const formData = new FormData();
    formData.append('tokenId', argument.tokenId);
    formData.append('tenantId', argument.tenantId);
    formData.append('version', argument.version);
    formData.append('active', 1);
    fetch( URL +  '/userShift/getUserShiftList/v1', {
        method: 'post',
        mode: 'cors',
        body:formData,
    }).then(function(res) {
        if (res.ok) {
            res.json().then(function (data) {             
                if (data.code === '0') {                              
                   JSON.parse(data.data).userShiftList.map(function(item){                                         
                        let array=[];
                        for(var i=0;i<item.userList.length;i++){                             
                                array.push(item.userList[i].name);
                                item.worker=array.join('、');                                
                        }                 
                        arr.push(item);   
                        // //console.log(arr)                                                                                                         
                    })
                    that.setState({listShow: arr}) 
                }
            });
        } else if (res.status === 401) {
            // //console.log("Oops! You are not authorized.");
        }
    }).then(error=>{
        // //console.log(JSON.stringify(error));
    });
  }

  // componentDidMount() {
  //   const that = this;
  //   const formData = new FormData();
  //   formData.append('tokenId', '01');
  //   formData.append('tenantId', 1);
  //   formData.append('version', 1);
  //   formData.append('active', 1);
  //   fetch('/userShift/getUserShiftList/v1', {
  //       method: 'post',
  //       mode: 'cors',
  //       // body: formData
  //   }).then(function(res) {
  //       if (res.ok) {
  //           res.json().then(function (data) {
  //               if (data.code === '0') {
  //                   //console.log(data.data.userShiftList)
  //                   that.setState({listShow: data.data.userShiftList})
  //               }
  //           });
  //       } else if (res.status === 401) {
  //           //console.log("Oops! You are not authorized.");
  //       }
  //   }).then(error=>{
  //       //console.log(JSON.stringify(error));
  //   });
  // }
 //删除操作
 remove = (id) => {
  const that = this;
  const dataSource = [...this.state.listShow];
  const formData = new FormData();
  formData.append('tokenId', '01');
  formData.append('tenantId', 1);
  formData.append('id', id );
  formData.append('version', 1);
  fetch( URL+'/userShift/deleteUserShiftById/v1', {
      method: 'post',
      mode: 'cors',
      body: formData
  }).then(function(res) {
      if (res.ok) {
          res.json().then(function (data) {
            // //console.log(data);
            that.setState({listShow: dataSource.filter(item => item.id !== id)});
          });
      } else if (res.status === 401) {
          //console.log("Oops! You are not authorized.");
      }
  }).then(error=>{
      //console.log(JSON.stringify(error));
  });
}

  state = {
    modalVisible: false,
    expandForm: false,
    selectedRows: [],
    formValues: {},
    listShow: [],  // 列表数据
    statusList: []  // 状态里表数据
  };
 
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

 
 
  //调整
  doUpdate = (id) => {
    // //console.log(id);
    sessionStorage.setItem('checkId', id);
    const { dispatch } = this.props;
    dispatch(routerRedux.push('/setting/updateUsershift'));
  };
  //新增
  addUsershift=()=>{
    const { dispatch } = this.props;
    dispatch(routerRedux.push('/setting/addUsershift'));
  }



  render() {
    const { selectedRows, modalVisible } = this.state;
    const { list: { list }, loading } = this.props;
    const parentMethods = {
      handleAdd: this.handleAdd,
      handleModalVisible: this.handleModalVisible,
    };
    const pagination = {
      pageSize: 1,
      current: 1,
      total: list.length,
      // onChange: (() => {}),
    };

    return (
      <PageHeaderLayout>
       <div style={{backgroundColor: '#fff',padding:30,}}>
     
            <div className={styles.cardList} style={{marginTop:20}}>
           
            <div style={{ textAlign: 'right', marginBottom: 10 }}>
            <Button type="primary" onClick={this.addUsershift}>新增班次</Button>
            </div>
          <List
            rowKey="id"
            loading={loading}
            grid={{ gutter: 0, column: 3 }}
            dataSource={[...this.state.listShow]}
            renderItem={item =>(
                <List.Item key={item.id}  style={{height:320}}>
                  <Card               
                   className={styles.card}
                   bordered={false}
                   style={{height:320}}
                 >
                    <Card.Meta
                      title={item.name} style={{textAlign :"left"}}
                    />


                     <p>工作时间: <span>{item.startWorkTime}</span> 到 <span>{item.endWorkTime}</span> </p>
                     <p>员工列表:</p>
                     <div style={{border:'1px solid #ccc',width:200,height:180,position:"absolute",top:85,left:90,paddingLeft:10,paddingRight:5,borderRadius:'5px'}} >{item.worker}</div>

                     <Button type="primary" style={{marginTop:160,marginLeft:90,}} onClick={()=>this.doUpdate(item.id)}>调整</Button>
                     <Popconfirm title="确定要删除此班次？" onConfirm={() => this.remove(item.id)}>
                            <Button  style={{marginTop:160,marginLeft:8,}}>删除</Button>
                     </Popconfirm>
                  </Card>
                </List.Item> 
              )
            }
          >
          </List>
        </div>
       </div>
       
      </PageHeaderLayout>
    );
  }
}

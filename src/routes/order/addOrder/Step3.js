import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { Row, Col, Card, Form, List, DatePicker,Pagination, Radio,Input, Select, Icon, Button, Dropdown, Menu, InputNumber, Modal, message, Badge, Divider, Table, Popconfirm, Checkbox } from 'antd';
import { routerRedux } from 'dva/router';
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import StandardTable from '../../../components/StandardTable';
import URL from '../../../utils/api';
import Result from '../../../components/Result';
import styles from './style.less';
import moment from 'moment';
import time from '../../../utils/time';
import argument from '../../../utils/argument'
const dateFormat = 'YYYY/MM/DD';
const monthFormat = 'YYYY/MM';
const CheckboxGroup = Checkbox.Group;
const RadioGroup = Radio.Group;
const { RangePicker, MonthPicker } = DatePicker;
const FormItem = Form.Item;
const { Option } = Select;
let count=1;
let num=0;
let num1=2;
let uuid = 0;
let sum=0;
let k=0;
const formItemLayout = {
  labelCol: {
    span: 5,
  },
  wrapperCol: {
    span: 19,
  },
};
@connect(({ list, loading }) => ({
  list,
  loading: loading.models.list,
}))
@Form.create()




class Step3 extends React.PureComponent {

  state = {
    visible: false,
    confirmLoading: false,
    name:'',
    modalVisible: false,
    expandForm: false,
    dataCount: '',
    formValues: {},
    listShow: [],  
    current:1,
    designcategoryList:[],
    count:1,
    va1:'',
    va2:'',
    array:'',
    designId:'',
    sum1:'',
    value1:'',
    value2:'',
    vv:'',
    row:'',
    selectedRowKeys:'',
    node:'',
    add1:'',
    orderBy: '' ,
    sort: '',
    rowSize: '',
    currentPage: '',
  };
  componentDidMount(){
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
    formData.append('tenantId', argument.tenantId);
    formData.append('version', argument.version);
    formData.append('active', 1);
    fetch(URL + '/design/getDesignList/v1', {
        method: 'post',
        mode: 'cors',
        body: formData
    }).then(function(res) {
        if (res.ok) {
            res.json().then(function (data) {
                if (data.code === '0') {
                    that.setState({listShow: JSON.parse(data.data).designList});                              
                    that.setState({designcategoryList:JSON.parse(data.data).designcategoryList})
                    
                    that.setState({dataCount: JSON.parse(data.data).dataCount});   
                }
            });
        } else if (res.status === 401) {
            //console.log("Oops! You are not authorized.");
        }
    }).then(error=>{
        // //console.log(JSON.stringify(error));
    });
  
  }
 
  //选择
  handChange1=(e)=>{
    this.setState({
      va1:e.target.value
    })
  }
  
  handChange2=()=>{
    var add=0;
    var nodelist=document.querySelectorAll('.ant-input-number-input')
    this.setState({
      node:nodelist
    })
     for(var i=0;i<nodelist.length;i++){
       if(nodelist[i].value){
        add+=parseInt(nodelist[i].value) ;
       }
         
     }
      this.setState({
        add1:add
      })
     this.props.form.setFieldsValue({
      all:(add-0)
    })
   
  }
 //分页
  changePage = (page, pageSize) => {
    const that = this;
    const formData = new FormData();
    formData.append('tokenId', argument.tokenId);
    formData.append('tenantId', argument.tenantId);
    formData.append('version', argument.version);
    formData.append('active', 1);
    formData.append('rowSize', pageSize);
    formData.append('currentPage', page);
    formData.append('orderBy', this.state.orderBy);
  formData.append('sort', this.state.sort);
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
                      rowSize: pageSize,
                      currentPage: page,
                    });
                } else {
                  message.error(data.msg);
                }
            });
        } else if (res.status === 401) {
            //console.log("Oops! You are not authorized.");
        }
    }).then(error=>{
        // //console.log(JSON.stringify(error));
    });
  }
  //排序
  onChange = (pagination, filters, sorter) => {
    const that = this;
    const formData = new FormData();
    formData.append('tokenId', argument.tokenId);
    formData.append('tenantId', argument.tenantId);
    formData.append('version', argument.version);
    formData.append('active', 1);
    formData.append('orderBy', sorter.columnKey);
    formData.append('sort', sorter.order);
    formData.append('rowSize', this.state.rowSize);
    formData.append('currentPage', this.state.currentPage);
    fetch(URL + '/design/getDesignList/v1', {
        method: 'post',
        mode: 'cors',
        body: formData
    }).then(function(res) {
        if (res.ok) {
            res.json().then(function (data) {
                if (data.code === "0") {
                    that.setState({
                      listShow: JSON.parse(data.data).designList,
                      dataCount: JSON.parse(data.data).dataCount,
                      orderBy: sorter.columnKey,
                      sort: sorter.order,
                    });
                }
            });
        } else if (res.status === 401) {
            // //console.log("Oops! You are not authorized.");
        }
    }).then(error=>{
        // //console.log(JSON.stringify(error));
    });
  }

//模态框开始
showModal = () => {
  this.setState({
    visible: true,
  });
}
handleOk = () => {
  
  this.setState({
    selectedRowKeys:'',
    confirmLoading: true,
    visible: false,
  });
  setTimeout(() => {
    this.setState({
      visible: false,
      confirmLoading: false,
    });
  }, 2000);
}
handleCancel = () => {
  this.setState({
    visible: false,
  });
}
//模态框结束
  renderAdvancedForm() {
  const { getFieldDecorator } = this.props.form;
  return (
    <Form onSubmit={this.handleSearch} layout="inline"  style={{paddingLeft:10}}>
      <Row >
        <Col md={8} sm={24}>
          <FormItem label="花样类别">
          {getFieldDecorator('n1')(
            <Select className={styles.select} style={{width:90}} onChange={this.handleChange3}  placeholder="请选择">
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
            {getFieldDecorator('n2')(
              <Input placeholder="请输入" style={{width:90}} onChange={this.handleChange4} />
            )}
          </FormItem>
        </Col>
        <Col md={6} sm={24}>
        <Button type="primary"  onClick={this.doQuery1} onKeyDown={this.handleEnterKey}>查询</Button>
          <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>重置</Button>
        </Col>     
        </Row>
            <Row>
               <Col md={3} sm={24} style={{float:'right',marginTop:10}}>
            <Button key="submit" type="primary" onClick={this.handleOk}>
              确定
            </Button>
                 </Col>
          </Row>
    </Form>
  );
}
 //选择花样类别
 handleChange3 = (value) => {
  this.setState({
    value1:value,
  });
}
 //选择花样名称
 handleChange4 = (e) => {
  this.setState({
    value2:e.target.value,
  });
}
handleFormReset = () => {
  const { form } = this.props;
  form.resetFields();
  this.setState({
    value1:'',
    value2:'',
  });
  this.componentDidMount();
}
doQuery1 = () => {
  const that = this;
  const formData = new FormData();
  formData.append('categoryId', this.state.value1);
  formData.append('name', this.state.value2);
  formData.append('tokenId', argument.tokenId);
  formData.append('tenantId', argument.tenantId);
  formData.append('version', argument.version);
  formData.append('active', 1);
  fetch( URL + '/design/getDesignList/v1', {
      method: 'post',
      mode: 'cors',
      body: formData
  }).then(function(res) {
      if (res.ok) {
          res.json().then(function (data) {
                  that.setState({listShow: JSON.parse(data.data).designList});
                  that.setState({dataCount: JSON.parse(data.data).dataCount});
          });
      } else if (res.status === 401) {
          //console.log("Oops! You are not authorized.");
      }
  }).then(error=>{
      ////console.log(JSON.stringify(error));
  });
}




//点击新增表单开始
//表单删除
remove = (k) => { 
  
  const { form } = this.props;
  const keys = form.getFieldValue('keys');
  // if (keys.length === 0) {
  //  k=0;
  // }
  form.setFieldsValue({
    keys: keys.filter(key => key !== k),



  });
  
   let newnode=[];
   let add1=0;
   newnode=document.querySelectorAll('.ant-input-number-input')
   console.log(newnode)
   for(var i=0;i<newnode.length-1;i++){
    if(newnode[i].value){
     add1+=parseInt(newnode[i].value) ;
    }
      
  }
    
  this.props.form.setFieldsValue({
    all:(add1-0)
  })
  
}

add = () => {
  const { form } = this.props;
  // can use data-binding to get
  const keys = form.getFieldValue('keys');
  const nextKeys = keys.concat(uuid);
  uuid++;
  // can use data-binding to set
  // important! notify form to detect changes
  form.setFieldsValue({
    keys: nextKeys,
  });
}
//提交表单
handleSubmit = (e) => {

  e.preventDefault();
  const that=this;
  this.props.form.validateFields((err, values) => {
  //  console.log(values)
    let iarr=[];//收集提交表单时的花样名
    for(var i in values ){
      if(i.indexOf('no')>0||i.indexOf('no')==0){
        iarr.push(values[i]);
      }
    }
    let idarr=[];//收集花样名对应的id
     iarr.map(function(item){
       that.state.listShow.map(function(item1){
         //console.log(item1)
         if(item==item1.name){
           idarr.push(item1.id)
           
         }
       })

     })
     let array=[];
     let sum3=0;
     let numarr=[];
   if(values.names){
  values.names.map(function(item){
    
    if(item!=undefined&&item!='empty'){
      sum3+=parseInt(item);
      that.setState({
        sum1:sum3
      })
    }
  })
}
  if(values.names){

    values.names.unshift(this.state.va1)
    values.names.map(function(item){
      if(item!='empty'&&item!='undefined'){
        numarr.push(item)
      }
    })
    
    for(var i=0;i<numarr.length;i++)  {
        
        array.push({designId:idarr[i],designNumber:numarr[i]});
      
    }

  }else{
    array.push({designId:idarr[0],designNumber:this.state.va1});
  }
  

  let array1=[];
  array.map(function(item){
    if(item.designId != undefined && item.designNumber != undefined){
      array1.push(item);
    }
  })
 
//判断发货日期是否为空
  let str11='';
   if(sessionStorage.getItem('deliverTime')=='null'){
    str11='';
   }else if(sessionStorage.getItem('deliverTime')==null){
    str11='';
    
   }else{
    str11=sessionStorage.getItem('deliverTime');
   }
  const { dispatch } = this.props;
  const formData = new FormData();
  formData.append('tokenId', argument.tokenId);
  formData.append('tenantId', argument.tenantId);
  formData.append('version', argument.version);
  formData.append('active', 1);
  formData.append('number', sessionStorage.getItem('orderNumber'));//订单编号
  formData.append('name', sessionStorage.getItem('orderName'));//订单名称
  formData.append('customerId', sessionStorage.getItem('orderCustomer'));//客户名称
  formData.append('contactPerson', sessionStorage.getItem('orderPerson'));//联系人
  formData.append('phone', sessionStorage.getItem('orderPhone'));//电话
  formData.append('orderTime', sessionStorage.getItem('orderTime'));//下单日期
  formData.append('deliveryTime', str11);//发货日期
  formData.append('deliveryAddress', sessionStorage.getItem('address'));//发货地址
  formData.append('remark', sessionStorage.getItem('remark')?sessionStorage.getItem('remark'):'无');//备注
  formData.append('totalNumber',  (this.state.va1-0)+sum3  ) ;//总数量(this.state.va1-0)+sum3 
  formData.append('orderDetailList',JSON.stringify(array1))
  fetch(URL　+　'/order/addOrder/v1', {
      method: 'post',
      mode: 'cors',
      body: formData
  }).then(function(res) {
      if (res.ok) {
          res.json().then(function (data) {
              if(data.code === '0') {
                message.success(data.msg,0.3);
                setTimeout(function(){
                  dispatch(routerRedux.push('/order/list'));
                  sessionStorage.setItem('deliverTime','');
                  sessionStorage.setItem('remark','');

                },500);
              }else{
                message.error(data.msg,0.3);
              }
          });
      } else if (res.status === 401) {
          //console.log("Oops! You are not authorized.");
      }
  }).then(error=>{
      //console.log(JSON.stringify(error));
  })
  });
}
//点击新增表单结束

  render() {
    let num1=2;
    let k=0;
    const { getFieldDecorator, getFieldValue } = this.props.form;
    const { form, data, dispatch, submitting } = this.props;
    const { visible, confirmLoading, ModalText } = this.state;
    const onPrev = () => {
      dispatch(routerRedux.push('/order/new/machine'));
    };

    const focus1=(e)=>{ 
      
      this.showModal();
      this.setState({
        vv:e.target.id
      })
    }




    const columns = [
      {
        title: '花样编号',
        dataIndex: 'number',
        key: 'number',
        sorter:  (a, b) => {},
        width: 150,
      },
      {
        title: '花样类别',
        dataIndex: 'designCategoryName',
        key: 'designCategoryName',
        width: 150,
      },
      {
        title: '花样名称',
        dataIndex: 'name',
        key: 'name',
        width: 200,
      },
      // {
      //   title: '花样圈数',
      //   dataIndex: 'roundNumber',
      //   key: 'roundNumber',
      //   width: 150,
      // },
     
      ]

//新增表单
    getFieldDecorator('keys', { initialValue: [] });
    const keys = getFieldValue('keys');
    const formItems = keys.map((k, index) => {
      
      return (
        <Row>
         <Col md={7} sm={24} >
        <FormItem
          // {...(index === 0 ? formItemLayout : formItemLayoutWithOutLabel)}
          label={ `花     样${num1++}`}
          required={false}
          key={k}

        >

          {getFieldDecorator(`no${k+2}`, {
            validateTrigger: ['onChange', 'onBlur'],
            
          })(
            <Input placeholder="点击选择花样"   onClick={focus1} style={{ width: '94%', marginRight: 8 }} readOnly />
          )}
        </FormItem>
        </Col>
        <Col md={6} sm={24}>
        <FormItem
          // {...(index === 0 ? formItemLayout : formItemLayoutWithOutLabel)}
          label={'花样件数'}
          required={false}
          key={k}
          style={{ width: 270, marginRight:8 }}
        >

          {getFieldDecorator(`names[${k}]`, {
            validateTrigger: ['onChange', 'onBlur'],
            
          })(
            <InputNumber type="number" addonAfter="双" onChange={this.handChange2} style={{ width: '75%', marginRight:5 }} min={0}  />
            
          )}
            <Icon
              className="dynamic-delete-button"
              type="minus-circle-o"
              onClick={() =>this.remove(k)}
            />
          {/* ) : null} */}
        </FormItem>
        </Col>
        </Row>
      );
    });

    const information = (
      <Form layout="inline" className="form" >
        <div className={styles.information}  >
          <Row  style={{ marginBottom:0,paddingLeft:17}} >
           
            <Col md={7} sm={24} style={{ opacity:0,height:39}}>
              <FormItem label="创建时间" >
                {getFieldDecorator('time',{initialValue:moment(time.today, dateFormat)})(
                  <DatePicker  style={{width: '100%'}} format={dateFormat}  />
                )}
              </FormItem>
            </Col>
            <Col md={6} sm={24} style={{ height:39}}>
              <FormItem label="总数量">
                {getFieldDecorator('all',{initialValue:(this.state.va1-0)})(
                  <Input style={{width: '75%', border:'none',}} readOnly />
                )}
              </FormItem>
            </Col>
          </Row>
          <Row  >
            <Col md={7} sm={24}>
              <FormItem label="花&nbsp;&nbsp;样1">
                 {getFieldDecorator('no1' )(
                  <Input style={{width: '100%'}}  onClick={focus1} placeholder='点击选择花样' readOnly/>
                  
                 )} 
                 
              </FormItem>
            </Col>
            {/* <Col md={3} sm={24}> */}
              {/* <Button type="primary" onClick={this.showModal} style={{marginTop:2}} >选择花样</Button> */}
            {/* </Col> */}
            <Col md={6} sm={24} >
              <FormItem label="花样件数" style={{ width: 285, marginRight:8 }} >
                {getFieldDecorator('number')(
                  <InputNumber type="number" addonAfter="双" onBlur={this.handChange1} style={{ width: '82%', marginRight:8 }} min={0}  />
                )}
              </FormItem>
            </Col>
            <Col md={8} sm={24}>
            {/* //原生事件采用addIput */}
              <Button type="primary" icon="plus" onClick={this.add} /> 
            </Col>
          </Row>         
          {formItems}
         
        </div>
      </Form>
    );
    const actions = (

      <Form
      layout="inline"
      style={{textAlign:'center',marginTop:30}}
      onSubmit={this.handleSubmit}
      >
        <div>
        <Button style={{ marginRight:8 }} onClick={onPrev} >
            上一步
          </Button>
        <Button type="primary" htmlType="submit"  >
         保存
        </Button>

      </div>
</Form>  
    );

    const that=this;
    const rowSelection = {
      type:'radio',
      onChange(selectedRowKeys,selectedRows) {      
         let id= that.state.vv
        //  //console.log(that.state.vv)
          that.state.listShow.map(function(item){
            if(selectedRowKeys[0]==item.id){
         if(id=='no1'){
    that.props.form.setFieldsValue(
     {
     no1:item.name,
      }
     ) 
     }else if(id=='no2') {
      that.props.form.setFieldsValue(
    {
    no2:item.name,
     }
   ) 
      }else if(id=='no3') {
    that.props.form.setFieldsValue(
   {
      no3:item.name,
     }
       ) 
   }else if(id=='no4') {
   that.props.form.setFieldsValue(
     {
      no4:item.name,
      }
     ) 
    }else if(id=='no5') {
     that.props.form.setFieldsValue(
    {
    no5:item.name,
        }
       ) 
     }else if(id=='no6') {
     that.props.form.setFieldsValue(
       {
    no6:item.name,
     }
    ) 
      }else if(id=='no7') {
    that.props.form.setFieldsValue(
   {
     no7:item.name,
   }
     ) 
    }else if(id=='no8') {
    that.props.form.setFieldsValue(
     {
  no8:item.name,
   }
     ) 
    }
      else if(id=='no9') {
     that.props.form.setFieldsValue(
     {
        no9:item.name,
           }
         ) 
              }
       else if(id=='no10') {
             that.props.form.setFieldsValue(
             {
               no10:item.name,
     }
            ) 
        }
           else if(id=='no11') {
           that.props.form.setFieldsValue(
            {
              no11:item.name,
          }
               ) 
               }
                else if(id=='no12') {
           that.props.form.setFieldsValue(
                       {
                no12:item.name,
            }
         ) 
               }
          else if(id=='no13') {
          that.props.form.setFieldsValue(
         {
             no14:item.name,
        }
      ) 
          }
       else if(id=='no15') {
         that.props.form.setFieldsValue(
            {
       no15:item.name,
         }
           ) 
      }
            else if(id=='no16') {
                that.props.form.setFieldsValue(
             {
              no16:item.name,
        }
        ) 
           }
           else if(id=='no17') {
           that.props.form.setFieldsValue(
            {
        no17:item.name,
       }
             ) 
            }
     else if(id=='no18') {
           that.props.form.setFieldsValue(
      {
            no18:item.name,
     } 
       ) 
       }
       else if(id=='no19') {
        that.props.form.setFieldsValue(
   {
         no19:item.name,
  }
    ) 
    }
    else if(id=='no20') {
      that.props.form.setFieldsValue(
      {
       no20:item.name,
       }
        ) 
       }
       else if(id=='no21') {
        that.props.form.setFieldsValue(
        {
         no21:item.name,
         }
          ) 
         }
         else if(id=='no22') {
          that.props.form.setFieldsValue(
          {
           no22:item.name,
           }
            ) 
           }
           else if(id=='no23') {
            that.props.form.setFieldsValue(
            {
             no23:item.name,
             }
              ) 
             }
             else if(id=='no24') {
              that.props.form.setFieldsValue(
              {
               no24:item.name,
               }
                ) 
               }
               else if(id=='no25') {
                that.props.form.setFieldsValue(
                {
                 no25:item.name,
                 }
                  ) 
                 }
                 else if(id=='no26') {
                  that.props.form.setFieldsValue(
                  {
                   no26:item.name,
                   }
                    ) 
                   }
                   else if(id=='no27') {
                    that.props.form.setFieldsValue(
                    {
                     no27:item.name,
                     }
                      ) 
                     }
                     else if(id=='no28') {
                      that.props.form.setFieldsValue(
                      {
                       no28:item.name,
                       }
                        ) 
                       }
                       else if(id=='no29') {
                        that.props.form.setFieldsValue(
                        {
                         no29:item.name,
                         }
                          ) 
                         }
                         else if(id=='no30') {
                          that.props.form.setFieldsValue(
                          {
                           no30:item.name,
                           }
                            ) 
                           }
                           else if(id=='no31') {
                            that.props.form.setFieldsValue(
                            {
                             no31:item.name,
                             }
                              ) 
                             }
                             else if(id=='no32') {
                              that.props.form.setFieldsValue(
                              {
                               no32:item.name,
                               }
                                ) 
                               }
                               else if(id=='no33') {
                                that.props.form.setFieldsValue(
                                {
                                 no33:item.name,
                                 }
                                  ) 
                                 }
                                 else if(id=='no34') {
                                  that.props.form.setFieldsValue(
                                  {
                                   no34:item.name,
                                   }
                                    ) 
                                   }
                                   else if(id=='no35') {
                                    that.props.form.setFieldsValue(
                                    {
                                     no35:item.name,
                                     }
                                      ) 
                                     }
                                     else if(id=='no36') {
                                      that.props.form.setFieldsValue(
                                      {
                                       no36:item.name,
                                       }
                                        ) 
                                       }
                                       else if(id=='no37') {
                                        that.props.form.setFieldsValue(
                                        {
                                         no37:item.name,
                                         }
                                          ) 
                                         }
                
            }          
          })        
      }
    };
    return (
     
      <div style={{backgroundColor: '#fff',padding:30}}>
          <Result
        extra={information}
        actions={actions}
        className={styles.result}
      />
        <Modal title="花样列表"
          visible={visible}
          confirmLoading={confirmLoading}
          onCancel={this.handleCancel}
          footer={false}
          destroyOnClose={true}                  
        >
         {this.renderAdvancedForm()}
         
         <Card bordered={false}>
          <div className={styles.tableList}>
            <Table
              bordered={true}
              dataSource={ this.state.listShow }
              columns={columns}
              rowKey={record => record.id}       
              rowSelection={rowSelection}
              pagination={false}
              scroll={{ y: 400 }}
              onChange={this.onChange}
            />
          </div>
          <div className={styles.changePage}>
             <Pagination size="small" total={parseInt(this.state.dataCount)} onChange={this.changePage}  showQuickJumper />
         </div>
        </Card>        
        </Modal>
       </div> 
    );
  }
}

export default connect(({ form }) => ({
  data: form.step,
}))(Step3);




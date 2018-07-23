import React, { PureComponent } from 'react';
import { connect } from 'dva';
import {
  Form, Input, DatePicker, Select,Pagination, Button,Modal,Table,Card, InputNumber,List, Radio, Icon, Tooltip, Calendar, message,Breadcrumb,
  Row, Col
} from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import { routerRedux } from 'dva/router';
import styles from './TableList.less';
import URL from '../../utils/api.js';
import argument from '../../utils/argument';
import time from '../../utils/time';
import moment from 'moment';
import { isNull } from 'util';
const dateFormat = 'YYYY-MM-DD';
const monthFormat = 'YYYY/MM';
const FormItem = Form.Item;
const { Option } = Select;
const { RangePicker } = DatePicker;
const { TextArea } = Input;
let num=1;
let num1=1
let count=1;
let count1=1;
let arr1=[];
let k=0;
let uuid = 0;
@connect(({ loading }) => ({
  submitting: loading.effects['form/submitRegularForm'],
}))
@Form.create()

export default class OrderCheck extends PureComponent {

  state = {
    statusList: [],
    customerList: [],
    listShow: '',
    listShow1: '',
    listShow2: '',
    disabled: true,
    input: '',
    input1: '',
    input2: '',
    input3: '',
    input4: '',
    input5: '',
    input6: '',
    input7: '',
    input8: '',
    input9: '',
    input10: '',
    input11: '',
    m:'',//初始化时已有花样数量
    orderBy: '' ,
    sort: '',
    rowSize: '',
    currentPage: '',


    dlist:'',
    visible: false,
    confirmLoading: false,
    name:'',
    modalVisible: false,
    expandForm: false,
    dataCount: '',
    formValues: {},
    current:1,
    designcategoryList:[],
    va1:'',
    va2:'',
    array:'',
    designId:'',
    sum:'',
    value1:'',
    value2:'',
    even:'',
    values:'',
    arr:''

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
    let k=0;
    const that = this;
    const formData = new FormData();
    formData.append('version', argument.version);
    formData.append('tenantId', argument.tenantId);
    formData.append('tokenId', argument.tokenId);
    formData.append('active', 1);
    formData.append('id', sessionStorage.getItem('updateId'));
    fetch(URL + '/order/getOrderById/v1', {
        method: 'post',
        mode: 'cors',
        body: formData
    }).then(function(res) {
        if (res.ok) {
            res.json().then(function (data) {
              if (data.code === "0") {
                  that.setState({listShow: JSON.parse(data.data).order});
                  that.setState({listShow1: JSON.parse(data.data).orderDetailList});
                  that.setState({
                    m:JSON.parse(data.data).orderDetailList.length
                  })
                  that.setState({customerList: JSON.parse(data.data).customerList});
                  JSON.parse(data.data).customerList.map(function(item){
                    if(that.state.listShow.customerName==item.name){
                      that.setState({
                        input6: item.id
                      });
                    }
                  })
              } else {
                 message.error(data.code);
              }
            });
        } else if (res.status === 401) {
        }
    }).then(error=>{
        ////console.log(JSON.stringify(error));
    });
  }

  input = (e) => {
    this.setState({
      input: e.target.value
    });
  }
  input1 = (e) => {
    this.setState({
      input1: e.targent.value
    });
  }
  input2 = (e) => {
    this.setState({
      input2: e.target.value
    });
  }
  input3 = (e) => {
    this.setState({
      input3: e.target.value
    });
  }
  input4=(data,dataString)=>{
    this.setState({
      input4: dataString
    });
  }
  input5=(data,dataString)=>{
    this.setState({
      input5: dataString
    });
  }
  input6 = (value) => {
    this.setState({
      input6: value 
   }) 
  }
  input7 = (value) => {
    this.setState({
      input7: value
    });
  }
  input8 = (e) => {
    this.setState({
      input8: e.target.value
    });
  }
  input9 = (e) => {
    this.setState({
      input9: e.target.value
    });
  }
  input10 = (e) => {
    this.setState({
      input10: e.target.value
    });
  }
  input11 = (e) => {
    this.setState({
      input11: e.target.value
    });
  }
  renderAdvancedForm() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form onSubmit={this.handleSearch} layout="inline" style={{paddingLeft:10}}>
        <Row >
          <Col md={8} sm={24}>
            <FormItem label="花样类别">
            {getFieldDecorator('n1')(
              <Select className={styles.select} style={{width:90}} onChange={this.handleChange1}  placeholder="请选择">
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
                <Input placeholder="请输入" style={{width:90}} onChange={this.handleChange2} />
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
//花样查询
 // 查询按钮事件
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
                  that.setState({listShow2: JSON.parse(data.data).designList});
                  that.setState({dataCount: JSON.parse(data.data).dataCount});
          });
      } else if (res.status === 401) {
          // //console.log("Oops! You are not authorized.");
      }
  }).then(error=>{
      ////console.log(JSON.stringify(error));
  });
}


//查询开始
 //选择花样类别
 handleChange1 = (value) => {
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
//查询结束


//模态框花样列表重置
handleFormReset = () => {
  const { form } = this.props;
  form.resetFields();
  this.setState({
    value1:'',
    value2:'',
  });
  this.focus1();
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
                      listShow2: JSON.parse(data.data).designList,
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


//提交操作
handleSubmit = (e) => {
  e.preventDefault();
  const that=this;

  this.props.form.validateFields((err, values) => {
    if (!err) {

  this.props.form.validateFieldsAndScroll((err, values) => {
      
        let iarr=[];//收集提交表单时的花样名
        let numarr3=[];//收集原有件数
        for(var i in values ){
          if(i.indexOf('nu')>0||i.indexOf('nu')==0){
            iarr.push(values[i]);
          }
        }
        for(var i in values ){
          if(i.indexOf('co')>0||i.indexOf('co')==0){
            numarr3.push(values[i]);
          }
        }
        
        let lastarr = values.names?numarr3.concat(values.names):numarr3;
        
    
        let idarr1=[];//收集花样名对应的id
         iarr.map(function(item){     
          that.state.listShow2.map(function(item1){
            if(item==item1.name){
              idarr1.push(item1.id)          
            }
          })      
         })
        let array=[];//最终发送的数组
        let sum1=0;//花样件数之和
        let array1=[];//被删除之后的花样id数组
        let array2=[];//被删除之后的花样件数数组
        let idarr=[];//新增和原有的id数组
        let numarr=[];//新增和原有的件数数组
        let numarr1=[];//不含空值
      if(that.state.dlist){
        that.state.dlist.map(function(item){
          array1.push(item.designId);
          array2.push(item.designNumber);  
      })
      }else{
        that.state.listShow1.map(function(item){
          array1.push(item.designId);
          array2.push(item.designNumber);  
      })
      }
      if(idarr1){
          idarr=idarr1.concat(array1);
        }else{
          idarr=array1;
        }
       
         if(that.state.arr){
          numarr=that.state.arr.concat(array2);
         }else{
          numarr=array2;
         }   

         

         lastarr.map(function(item){
          if(item!='empty'&&item!='undefined'){
            numarr1.push(item)
          }
        })
      //  console.log(values.names);
      //  console.log(lastarr)


        for(var i=0;i<numarr1.length;i++)  {
          if(numarr1[i]!='empty'&&numarr1[i]!='undefined'){
            sum1+=parseInt(numarr1[i]);
            // console.log(sum1)
            that.setState({
              sum:sum1
            }) 
          } 
          array.push({designId:idarr[i],designNumber:numarr1[i]}); 
      }


    

      let sendarray=[];
       array.map(function(item){
         let arr3=Object.keys(item);
         if(arr3.length==2&&item.designId!=undefined&&item.designNumber!=undefined){
           sendarray.push(item);
         }
       })
    

        // console.log(numarr1)
        const { dispatch } = that.props;
        const formData = new FormData();
        formData.append('version', argument.version);
        formData.append('tenantId', argument.tenantId);
        formData.append('tokenId', argument.tokenId);
        formData.append('active', 1);
        formData.append('number', that.state.listShow.number);             //订单编号
        formData.append('orderTime',  that.state.listShow.orderTime);          //下单日期
        formData.append('totalNumber', sum1);        //总件数
        formData.append('name', values.input3?values.input3:'');              //订单名称
        if(values.input4==null||values.input4==''){
          formData.append('deliveryTime','');
          
        }else{
          formData.append('deliveryTime',that.state.input4?that.state.input4:that.state.listShow.deliveryTime);  
              //交货日期
        }
    
        // formData.append('deliveryTime',that.state.input4?that.state.input4:that.state.listShow.deliveryTime);   
        formData.append('createTime', that.state.input5);        //创建日期
        formData.append('customerId', that.state.input6); //客户名称
        formData.append('orderStatusId', that.state.input7?that.state.input7:that.state.listShow.orderStatusId);     //订单状态
        formData.append('contactPerson', that.state.input8);      //联系人
        formData.append('deliveryAddress', values.input9?values.input9:'');    //发货地址
        formData.append('phone', values.input10?values.input10:'');             //电话
        formData.append('remark', values.input11?values.input11:'');            //备注
        formData.append('id', sessionStorage.getItem('updateId'));
        formData.append('orderDetailList',JSON.stringify(sendarray))
        fetch( URL + '/order/updateOrderById/v1', {
          method: 'post',
          mode: 'cors',
          body: formData
        }).then(function(res) {
          if (res.ok) {
            res.json().then(function (data) {
              if (data.code === "0") {
                message.success(data.msg);
                setTimeout(function(){
                  dispatch(routerRedux.push('/order/list'));
                },500);
              } else {
                message.error(data.msg);
              }
            });
          } else if (res.status === 401) {
            //console.log("Oops! You are not authorized.");
          }
        }).then(error=>{
           ////console.log(JSON.stringify(error));
        });
  });
}
})
}
//模态框开始
showModal = (e) => {
  //console.log(e)
  this.setState({
    visible: true,
  });
}
handleOk = () => {
  this.setState({
    visible: false,
    confirmLoading: true,
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


//点击新增表单开始
remove = (k) => {
  this.setState({
    m:this.state.m
  })
 if(this.state.m==this.state.listShow1.length){
  this.setState({
    m:this.state.listShow1.length
  })
 }
  
  const { form } = this.props;
  // can use data-binding to get
  const keys = form.getFieldValue('keys');
  // We need at least one passenger
  // if (keys.length === 0) {
  //   return;
  // }

  // can use data-binding to set
  form.setFieldsValue({
    keys: keys.filter(key => key !== k),
  });
}

add = () => {
  // this.state.m++;
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

//点击新增表单结束

  remove1=(id)=>{
    this.state.m--;
    const that = this;
    const dataSource = [...this.state.listShow1];
    const formData = new FormData();
    formData.append('tokenId', argument.tokenId);
    formData.append('tenantId', argument.tenantId);
    formData.append('version', argument.version);
    formData.append('active', 1);
    formData.append('id', sessionStorage.getItem('updateId'));
    fetch( URL + '/order/getOrderById/v1', {
    //fetch('/order/deleteOrderById/v1', {
        method: 'post',
        mode: 'cors',
        body: formData
    }).then(function(res) {
        if (res.ok) {
            res.json().then(function (data) {
              if(data.code === '0') {
                that.setState({listShow1: dataSource.filter(item => item.id !== id)});
                that.setState({dlist:that.state.listShow1});
                that.setState({
                  m:that.state.listShow1.length
                })


              } else {
                message.error(data.msg);
              }
            });
        } else if (res.status === 401) {
            //console.log("Oops! You are not authorized.");
        }
    }).then(error=>{
        ////console.log(JSON.stringify(error));
    });
  }



  //修改件数
  handChange2=(e)=>{
    arr1.push(e.target.value)
    
    // sum = eval(arr1.join("+"));
    this.setState({
      arr:arr1,
      // sum1:sum
    })
 }

  render() {
    let k=0;
    let num=1;
    let num1=1;
    let count=1;
    let count1=1;
    const { submitting } = this.props;
    const { getFieldDecorator, getFieldValue } = this.props.form;
    const { dispatch } = this.props;
    const { visible, confirmLoading, ModalText } = this.state;
    const goBack = () => {
      dispatch(routerRedux.push('/order/list'));
    };
    const focus1=(e)=>{ 
      
      this.showModal();
      this.setState({
        vv:e.target.id
      })
      const that=this;
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
                  that.setState({listShow2: JSON.parse(data.data).designList});                              
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




    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 7 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 12 },
        md: { span: 10 },
      },
    };
    const columns = [
      {
        title: '花样编号',
        dataIndex: 'number',
        key: 'number',
        sorter: (a, b) => a.number - b.number,
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
    const submitFormLayout = {
      wrapperCol: {
        xs: { span: 24, offset: 0 },
        sm: { span: 10, offset: 7 },
      },
    };

    //选择花样
    const that=this;
    // const nodelist=document.querySelectorAll('.design');
    const rowSelection = {
      type:'radio',
      onChange(selectedRowKeys,selectedRows) {

        let id= that.state.vv
        //  //console.log(that.state.vv)

     
          that.state.listShow2.map(function(item){
            if(selectedRowKeys[0]==item.id){
              if(id=='nu1'){
              that.props.form.setFieldsValue(
                {
                  nu1:item.name,
                }
              ) 
            }else if(id=='nu2') {
              that.props.form.setFieldsValue(
                {
                  nu2:item.name,
                }
              ) 
              }
           else if(id=='nu3') {
              that.props.form.setFieldsValue(
               {
                 nu3:item.name,
                }
              ) 
          }
          else if(id=='nu4') {
           that.props.form.setFieldsValue(
            {
            nu4:item.name,
            }
            ) 
          }
          else if(id=='nu5') {
           that.props.form.setFieldsValue(
             {
             nu5:item.name,
              }
            ) 
           }  
         else if(id=='nu6') {
             that.props.form.setFieldsValue(
         {
            nu6:item.name,
            }
            ) 
        }else if(id=='nu7') {
          that.props.form.setFieldsValue(
       {
         nu7:item.name,
     }
      ) 
          }else if(id=='nu8') {
          that.props.form.setFieldsValue(
        {
            nu8:item.name,
           }
             ) 
        }else if(id=='nu9') {
           that.props.form.setFieldsValue(
         {
          nu9:item.name,
          }
        ) 
         }else if(id=='nu10') {
           that.props.form.setFieldsValue(
          {
        nu10:item.name,
             }
           ) 
        }else if(id=='nu11') {
         that.props.form.setFieldsValue(
         {
          nu11:item.name,
          }
         ) 
    }
    else if(id=='nu12') {
      that.props.form.setFieldsValue(
      {
       nu12:item.name,
       }
      ) 
 }
 else if(id=='nu13') {
  that.props.form.setFieldsValue(
  {
   nu13:item.name,
   }
  ) 
}
else if(id=='nu14') {
  that.props.form.setFieldsValue(
  {
   nu14:item.name,
   }
  ) 
}
else if(id=='nu15') {
  that.props.form.setFieldsValue(
  {
   nu15:item.name,
   }
  ) 
}
else if(id=='nu16') {
  that.props.form.setFieldsValue(
  {
   nu16:item.name,
   }
  ) 
}
else if(id=='nu17') {
  that.props.form.setFieldsValue(
  {
   nu17:item.name,
   }
  ) 
}
else if(id=='nu18') {
  that.props.form.setFieldsValue(
  {
   nu18:item.name,
   }
  ) 
}
else if(id=='nu19') {
  that.props.form.setFieldsValue(
  {
   nu19:item.name,
   }
  ) 
}
else if(id=='nu20') {
  that.props.form.setFieldsValue(
  {
   nu20:item.name,
   }
  ) 
}
else if(id=='nu21') {
  that.props.form.setFieldsValue(
  {
   nu21:item.name,
   }
  ) 
}
else if(id=='nu22') {
  that.props.form.setFieldsValue(
  {
   nu22:item.name,
   }
  ) 
}
else if(id=='nu23') {
  that.props.form.setFieldsValue(
  {
   nu23:item.name,
   }
  ) 
}
else if(id=='nu24') {
  that.props.form.setFieldsValue(
  {
   nu24:item.name,
   }
  ) 
}
else if(id=='nu25') {
  that.props.form.setFieldsValue(
  {
   nu25:item.name,
   }
  ) 
}
else if(id=='nu26') {
  that.props.form.setFieldsValue(
  {
   nu26:item.name,
   }
  ) 
}
else if(id=='nu27') {
  that.props.form.setFieldsValue(
  {
   nu27:item.name,
   }
  ) 
}
else if(id=='nu28') {
  that.props.form.setFieldsValue(
  {
   nu28:item.name,
   }
  ) 
}
else if(id=='nu29') {
  that.props.form.setFieldsValue(
  {
   nu29:item.name,
   }
  ) 
}
else if(id=='nu30') {
  that.props.form.setFieldsValue(
  {
   nu30:item.name,
   }
  ) 
}
 }          
    })  
      }
    };
    getFieldDecorator('keys', { initialValue: [] });
    const keys = getFieldValue('keys');
    const formItems = keys.map((k, index) => {
 
      return (
        <Row>
         <Col md={8} sm={24}>
        <FormItem
          // {...(index === 0 ? formItemLayout : formItemLayoutWithOutLabel)}
          label={ `新增花样${num1++}`}
          required={false}
          key={k}
          style={{marginTop:10}}
        >

          {getFieldDecorator(`nu${k+1}`, {
            validateTrigger: ['onChange', 'onBlur'],
          
            
            
          })(
            <Input placeholder="点击选择花样"  onClick={focus1} readOnly style={{ width: '95%', marginRight: 8 }} />
          )}
        </FormItem>
        </Col>
        <Col md={8} sm={24} style={{paddingLeft:20}}>
        <FormItem
          // {...(index === 0 ? formItemLayout : formItemLayoutWithOutLabel)}
          label={'花样件数'}
          required={false}
          key={k}
          style={{marginTop:10,paddingLeft:14,width:300}}
        >

          {getFieldDecorator(`names[${k}]`, {
            validateTrigger: ['onChange', 'onBlur'],
            rules: [
                  { required: true, message: '请输入花样件数' },
                ]
            
          })(
            <Input placeholder="" addonAfter="双" onBlur={this.handChange2} style={{ width: 139, marginRight:8 }} />
          )}
          <a>
            <Icon
              className="dynamic-delete-button"
              type="minus-circle-o"
              // disabled={keys.length === 1}
              onClick={() => this.remove(k)}
              style={{  marginLeft:20 }}
            />
            </a>
          {/* ) : null} */}
        </FormItem>
        </Col>
        </Row>
      );
    });


    return (
      <PageHeaderLayout>
      <Breadcrumb className={styles.bread}>
    <Breadcrumb.Item >&nbsp;</Breadcrumb.Item>
    
    <Breadcrumb.Item href="#/order/list">订单列表</Breadcrumb.Item>
    <Breadcrumb.Item>订单修改</Breadcrumb.Item>
  </Breadcrumb>
        <div style={{backgroundColor:'#fff',marginTop:-18}}  >
        <div  style={{float:"left",fontSize:16,   marginTop:30,marginLeft:30}}>订单信息</div><br></br>
          <Form
            // onSubmit={this.handleSubmit}
            hideRequiredMark
            layout="inline"
            style={{backgroundColor:'#fff',padding:50,paddingLeft:100}}
          >
            <div>
            
              <Row gutter={{ md: 8, lg: 24, xl: 48 }} style={{marginBottom:20}}>
              <Col md={8} sm={24}>
                      <FormItem label="订单编号">
                         {getFieldDecorator('input', { initialValue: this.state.listShow.number })(
                            <Input maxLength='30' disabled/>
                          )}
                      </FormItem>
                    </Col>
                    <Col md={8} sm={24}>
                      <FormItem label="下单日期">
                        {getFieldDecorator('input1', {initialValue: this.state.listShow.orderTime})(
                           <Input maxLength="30" onChange={this.input1} disabled />
                         )}
                      </FormItem>
                    </Col>
                    <Col md={8} sm={24}>
                      <FormItem label="总&nbsp;&nbsp;件&nbsp;&nbsp;数">
                         {getFieldDecorator('input2', { initialValue:this.state.sum?this.state.sum:this.state.listShow.totalNumber })(
                           <Input maxLength='30' onChange={this.input2} disabled />
                         )}
                      </FormItem>
                    </Col>
                  </Row>
                  <Row gutter={{ md: 8, lg: 24, xl: 48 }} style={{marginBottom:20}}>
                    <Col md={8} sm={24}>
                      <FormItem label="订单名称">
                         {getFieldDecorator('input3', { initialValue: this.state.listShow.name })(
                           <Input maxLength='30' onChange={this.input3} />
                         )}
                      </FormItem>
                    </Col>
                    <Col md={8} sm={24}>
                      <FormItem label="交货日期">
                         {getFieldDecorator('input4', { rules: [
                  { required: true, message: '请输入交货日期' },
                ],initialValue:(this.state.listShow.deliveryTime=='2000-01-01'||this.state.listShow.deliveryTime==null)?'':moment(this.state.listShow.deliveryTime, dateFormat)})(
                          <DatePicker allowClear={false} readOnly onChange={this.input4} format={dateFormat} />
                         )}
                      </FormItem>
                    </Col>
                    <Col md={8} sm={24}>
                      <FormItem label="创建时间">
                      {getFieldDecorator('time',{initialValue:moment(time.today, dateFormat)})(
                          <DatePicker  onChange={this.input5} disabled format={dateFormat} />
                         )}
                      </FormItem>
                    </Col>
                  </Row>
                  <Row gutter={{ md: 8, lg: 24, xl: 48 }} style={{marginBottom:20}}>
                    <Col md={8} sm={24}>
                      <FormItem label="客户名称">
                          {getFieldDecorator('input6', { initialValue: this.state.listShow.customerName })(

                              <Select onChange={this.input6} style={{width:160}}>
                                  {
                                      this.state.customerList.map(function (item) {
                                          return (
                                              <Option value={item.id} key={item}>
                                                 {item.name}
                                              </Option>
                                          )
                                      })
                                  }
                              </Select>
                          )}
                      </FormItem>
                    </Col>
                    <Col md={8} sm={24}>
                      <FormItem label="订单状态">
                          {getFieldDecorator('input7', { initialValue: this.state.listShow.orderStatusName})(
                              <Select onChange={this.input7} style={{width:160}}  disabled={this.state.listShow.orderStatusName=='已超额'||this.state.listShow.orderStatusName=='生产中'||this.state.listShow.orderStatusName=='已完成'?true:false}    >
                                   <Option value='1'>待排产</Option>
                                   <Option value='0'>不能排产</Option>
                              </Select>
                          )}
                      </FormItem>
                    </Col>
                  </Row>
                  <Row gutter={{ md: 8, lg: 24, xl: 48 }} style={{marginBottom:20}}>
                    {/* <Col md={8} sm={24}>
                      <FormItem label="联&nbsp;&nbsp;系&nbsp;&nbsp;人">
                          {getFieldDecorator('input8', { initialValue: this.state.listShow.contactPerson })(
                              <Input maxLength='30' onChange={this.input8} />
                          )}
                      </FormItem>
                    </Col> */}
                    <Col md={8} sm={24}>
                      <FormItem label="发货地址">
                          {getFieldDecorator('input9', { initialValue: this.state.listShow.deliveryAddress })(
                              <Input maxLength='60' onChange={this.input9} />
                          )}
                      </FormItem>
                    </Col>
                    <Col md={8} sm={24}>
                      <FormItem label="备&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;注">
                          {getFieldDecorator('input11', { initialValue: this.state.listShow.remark })(
                              <Input maxLength='50' onChange={this.input11} />
                          )}
                      </FormItem>
                    </Col>
                  </Row>
                  <Row gutter={{ md: 8, lg: 24, xl: 48 }} style={{marginBottom:20}}>
                    <Col md={8} sm={24}>
                      <FormItem label="联系电话">
                          {getFieldDecorator('input10', { initialValue: this.state.listShow.customerPhone })(
                              <Input maxLength='30' onChange={this.input10} />
                          )}
                      </FormItem>
                    </Col>
                   
              </Row>
            </div>
            <div>
            </div>       
          </Form>
          <div  style={{float:"left",fontSize:16,   marginTop:-30,marginLeft:30}}>订单花样信息</div><br></br>
           {
           this.state.listShow.orderStatusName=='待排产'||this.state.listShow.orderStatusName=='不能排产'||this.state.listShow.orderStatusName=='已取消'?<Button type="primary" style={{ float:"left",marginTop:-30,marginLeft:'58%'}} icon="plus" onClick={this.add}  /> :
           <Button type="primary" style={{ float:"left",marginTop:-30,marginLeft:'58%'}} icon="plus" onClick={this.add} disabled /> 
                      }

          
          <List
           rowKey="id"
           itemLayout="vertical"
           dataSource={[...this.state.listShow1]}
           style={{padding:10}}         
           renderItem={item =>(
               <List.Item key={item.id} style={{height:50}}>  

                    <Form
                    layout="inline"
                    style={{backgroundColor:'#fff',paddingLeft:100}}
                    onSubmit={this.handleSubmit}
                    >
                    <Row gutter={{ md: 8, lg: 24, xl: 48 }} style={{marginBottom:20}}>
                    <Col md={8} sm={24}>
                   
                      <FormItem                   
                      label={
                        `花样${num++}`
                        }>
                      {getFieldDecorator(`no${count++}`, { initialValue: item.designName })(
                      <Input className='design' disabled  />    

                       )}

                      </FormItem>                
                   </Col>
                   <Col md={8} sm={24}>
                   <FormItem label="花样件数">
                   {getFieldDecorator(`co${count1++}`, { initialValue: item.designNumber })(
                      <Input  addonAfter="双"  onBlur={this.handChange2} disabled   style={{ width: 140, marginRight:8 }} />  
                   )}
                      </FormItem> 
                      {
                        this.state.listShow.orderStatusName=='待排产'||this.state.listShow.orderStatusName=='不能排产'||this.state.listShow.orderStatusName=='已取消'?<a> <Icon
                        className="dynamic-delete-button"
                         type="minus-circle-o"
                        style={{marginTop:13}}
                     // disabled={keys.length === 1}
                     onClick={() => this.remove1(item.id)}
                      /></a>: <Icon
                        className="dynamic-delete-button"
                         type="minus-circle-o"
                        style={{marginTop:13}}
                        disabled={true}                   
                      />
                      }                                         
                      </Col>           
                      </Row>   
                      
                      </Form>       
               </List.Item>               
             )
           }
         >   <Form
                    layout="inline"
                    style={{backgroundColor:'#fff',paddingLeft:74}}
                    onSubmit={this.handleSubmit}
                    >
              {formItems}
             </Form>
             
             <Form
                    layout="inline"
                    style={{textAlign:'center',marginTop:30}}
                    onSubmit={this.handleSubmit}
                    >
                  <Button type="primary" htmlType="submit"  style={{marginRight:8}}>
                       保存
                      </Button>
                <Button  onClick={ goBack }>
                返回
              </Button>
           </Form>
         </List>    
        </div>

           <Modal title="花样列表"
          visible={visible}       
          confirmLoading={confirmLoading}
          onCancel={this.handleCancel}
          footer={null}
          style={{width:800}}
          footer={false}
          destroyOnClose={true}  
        >
        {this.renderAdvancedForm()}
         <Card bordered={false}>
          <div className={styles.tableList}>
            <Table
              bordered={true}
              dataSource={ this.state.listShow2 }
              columns={columns}
              rowKey={record => record.id}       
              rowSelection={rowSelection}
              pagination={false}
              scroll={{ y: 400 }}
            />
          </div>
          <div className={styles.changePage}>
             <Pagination size="small" total={parseInt(this.state.dataCount)} onChange={this.changePage}  showQuickJumper />
         </div>
        </Card> 
          
        </Modal>
      </PageHeaderLayout>
      
    );
  }
}

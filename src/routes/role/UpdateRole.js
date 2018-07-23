import React, { PureComponent } from 'react';
import { connect } from 'dva';
import {
  Form, Input, DatePicker, Select, Button, Card, InputNumber, Radio, Icon, Tooltip, Calendar, Mention, Tree, Row, Col,Breadcrumb
} from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from './style.less';
import { routerRedux } from 'dva/router';
import URL from '../../utils/api.js'

const FormItem = Form.Item;
const { Option } = Select;
const { RangePicker } = DatePicker;
const { TextArea } = Input;
const TreeNode = Tree.TreeNode;
const { toString } = Mention;

@connect(({ loading }) => ({
  submitting: loading.effects['form/submitRegularForm'],
}))
@Form.create()
export default class BasicForms extends PureComponent {
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        this.props.dispatch({
          type: 'form/submitRegularForm',
          payload: values,
        });
      }
    });
  };
  
  state = {
     listShow: '',
     roleList:'',
     value1:'',
     value2:'',
     value3:'',
     value4:'',
     value5:'',
     value6:'',
     userRoleListList:[],
     checkedKeys: [] ,         // 选中复选框的树节点
     selectedKeys: [],
     authorityTree:[],
  };

  componentDidMount() {
    let arr=[];
    const that = this;
    const dataSource = [...this.state.listShow];
    const formData = new FormData();
    formData.append('id', localStorage.getItem('id'));
    formData.append('version', 1);
    formData.append('tenantId', 1);
    formData.append('tokenId', 1);
    formData.append('active',1);
    fetch(URL + '/userRole/getUserRoleList/v1', {
      method: 'post',
      mode: 'cors',
      body: formData
    }).then(function(res) {
      if (res.ok) {
        res.json().then(function (data) {
          if (data.code === '0') {        
            arr.push(JSON.parse(data.data).authorityTree);
            that.setState({listShow: JSON.parse(data.data).userRoleList[0]});
            that.setState({userRoleListList: JSON.parse(data.data).userRoleListList});
            that.setState({authorityTree: arr});
            
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
//   const arr=[];
//   const that = this;
//   const dataSource = [...this.state.listShow];
//   const formData = new FormData();
//   formData.append('id', localStorage.getItem('id'));
//   formData.append('version', 1);
//   formData.append('tenantId', 1);
//   formData.append('tokenId', 1);
//   fetch( '/userRole/getUserRoleList/v1', {
//     method: 'post',
//     mode: 'cors',
//     body: formData
//   }).then(function(res) {
//     if (res.ok) {
//       res.json().then(function (data) {
//         if (data.code === '0') {
//           // console.log(arr)
           
//           arr.push(data.data.authorityTree);
      
//           // console.log(arr);
//           that.setState({listShow: data.data.userRoleList[0]});
//           that.setState({userRoleListList: data.data.userRoleListList});
//           that.setState({authorityTree: data.data.authorityTree});
//           that.setState({array:arr});
//         }
//       });
//     } else if (res.status === 401) {
//       console.log("Oops! You are not authorized.");
//     }
//   }).then(error=>{
//     console.log(JSON.stringify(error));
//   });
// }





   //  修改用户权限
  updateRole = () => {
    const that = this;
    const formData = new FormData();
    const { dispatch } = this.props;
    formData.append('tenantId', 1);
    formData.append('tokenId', '01');
    formData.append('version', 1);
    formData.append('id', localStorage.getItem('id'));
    formData.append('loginName', this.state.value1);
    formData.append('loginId', this.state.value2);
    formData.append('roleListId', this.state.value3);
    formData.append('remark', this.state.value4);
    formData.append('permissonCodeName', this.state.value5);
    fetch(URL + '/userRole/updateUserRoleById/v1', {
        method: 'post',
        mode: 'cors',
        body: formData
    }).then(function(res) {
        if (res.ok) {
            res.json().then(function (data) {
                if(data.code === '0') {
                   alert(data.msg);
                   setTimeout(function(){
                     dispatch(routerRedux.push('/setting/role'));
                   },500);
                }
            });
        } else if (res.status === 401) {
            console.log("Oops! You are not authorized.");
        }
    }).then(error=>{
        console.log(JSON.stringify(error));
    });
  }



  handleChange1 = (e) => {
    this.setState({
      value1: e.target.value,
    });
  }
 
  handleChange2 = (e) => {
    this.setState({
      value2: e.target.value,
    });
  }
  
  handleChange3 = (value) => {
    this.setState({
      value3: value,
    });
  }
  
  handleChange4 = (e) => {
    this.setState({
      value4: e.target.value,
    });
  }
  
  handleChange5 = (e) => {
    this.setState({
      value5: e.target.value
    });
  }
  onExpand = (expandedKeys) => {
    this.setState({
      expandedKeys,
      autoExpandParent: false,
    });
  }
  onCheck = (checkedKeys) => {
    const dataArray = checkedKeys.checked;
    this.setState({checkedKeys: dataArray});
  }
  onCheck = (checkedKeys) => {
    this.setState({checkedKeys: checkedKeys});
    console.log(this.state.checkedKeys);
  }

  renderTreeNodes = (data) => {
      // console.log(data)
      return data.map((item) => {
        if (item.child) {
          return (
            <TreeNode title='权限选择' key={item.code} dataRef={item}>
              {this.renderTreeNodes(item.child)}
            </TreeNode>
          );
        }
        return <TreeNode title={item.name} key={item.code} dataRef={item}/>;
      });
    }
 //返回
 goback=()=>{
  const{dispatch}=this.props;
  dispatch(routerRedux.push('/setting/role'));
}
  render() {
    const { submitting } = this.props;
    const { getFieldDecorator, getFieldValue } = this.props.form;
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
    const submitFormLayout = {
      wrapperCol: {
        xs: { span: 24, offset: 0 },
        sm: { span: 10, offset: 7 },
      },
    };
    const children = [];
    for (let i = 10; i < 36; i++) {
      children.push(<Option key={i.toString(36) + i}>{i.toString(36) + i}</Option>);
    }

    
    return (
      <PageHeaderLayout>
       <Breadcrumb className={styles.bread}>
    <Breadcrumb.Item >&nbsp;</Breadcrumb.Item>
    <Breadcrumb.Item href="#/setting/role">用户权限</Breadcrumb.Item>
    <Breadcrumb.Item>更新权限</Breadcrumb.Item>
  </Breadcrumb>
        <Card bordered={false}>
          <Form
            onSubmit={this.handleSubmit}
            hideRequiredMark
            style={{ marginTop: 0 }}
          >
          <Row gutter={{ md: 8, lg: 24, xl: 48 }} style={{ marginLeft:250 }}>
          <Col md={8} sm={24}>
            <FormItem
              {...formItemLayout}
              label="姓名"
            >
            {getFieldDecorator('user1', { initialValue: this.state.listShow.loginName })(
              <Input  onChange={this.handleChange1} /> )}
                
            </FormItem>
            </Col>
            <Col md={8} sm={24}>
            <FormItem
              {...formItemLayout}
              label="登录账号"
            >
             {getFieldDecorator('user2', { initialValue: this.state.listShow.loginId })(
              <Input  onChange={this.handleChange2} /> )}
                
            </FormItem>
            </Col>
            </Row>
            
            <FormItem
              {...formItemLayout}
              label="角色选择"
            >
                {getFieldDecorator('user3', { initialValue: this.state.listShow.userRoleName })(
              <Select className={styles.select} onChange={this.handleChange3} >
                   {
                       this.state.userRoleListList.map(function(item){
                            return (
                            <Option value={item.id} key={item.id}>
                            {item.roleName}
                            </Option>)
                       })
                   }
                     </Select> )}
            </FormItem>
           
            <FormItem
                {...formItemLayout}
                label="备注"
              >
              {getFieldDecorator('user4', { initialValue: this.state.listShow.remark})(
              <Input  onChange={this.handleChange4} /> )}
                  
              </FormItem>
            
              <FormItem
              {...formItemLayout}
              label="权限管理"
            >
             {/* {getFieldDecorator('user5', { initialValue: this.state.listShow.permissonCodeName })( */}
              <div className="treeWrap">
                 {/* <div className="treeTitle">管理权限</div> */}
                 <div className="treeMap">
                    <Tree
                        checkable
                        checkStrictly
                        onExpand={this.onExpand}
                        expandedKeys={this.state.expandedKeys}
                        onCheck={this.onCheck}
                        checkedKeys={this.state.checkedKeys}
                        onSelect={this.onSelect}
                        selectedKeys={this.state.selectedKeys}
                    >
                        {this.renderTreeNodes(this.state.authorityTree)}
                    </Tree>
                 </div>
            </div>
             {/* )} */}
                
            </FormItem>
          </Form>



          
          {/* <Row gutter={{ md: 8, lg: 24, xl: 48 }} style={{ marginLeft:-40}} >
          <Col md={3} sm={6}>
            <Tree className="myCls"  
                  multiple checkable 
                 defaultExpandAll='true' 
        // checkedKeys={this.state.checkedKeys}
                  onSelect={this.onSelect}
        // selectedKeys={this.state.selectedKeys}
                  onCheck={this.onCheck}
            > 
          <TreeNode title="数据分析" key="1">
            <TreeNode title={<span style={{ color: '#08c',fontSize:12 }}>实时监控</span>} key="1-1" />
            <TreeNode title={<span style={{ color: '#08c',fontSize:12 }}>产量统计</span>} key="1-2" />
            <TreeNode title={<span style={{ color: '#08c',fontSize:12 }}>故障统计</span>} key="1-3" />
            <TreeNode title={<span style={{ color: '#08c',fontSize:12 }}>质量统计</span>} key="1-4" />
        </TreeNode>
         </Tree>
          </Col>
          <Col md={3} sm={6}>
         <Tree className="myCls"  multiple checkable 
        defaultExpandAll='true' 
           > 
          <TreeNode title="订单管理" key="2">
            <TreeNode title={<span style={{ color: '#08c',fontSize:12 }}>订单列表</span>} key="2-1" />
            <TreeNode title={<span style={{ color: '#08c',fontSize:12 }}>新增订单</span>} key="2-2" />
            <TreeNode title={<span style={{ color: '#08c',fontSize:12 }}>预警配置</span>} key="2-3" />
           </TreeNode>
          </Tree>
          </Col>
          <Col md={3} sm={6}>
         <Tree className="myCls"  multiple checkable 
        defaultExpandAll='true' 
           > 
          <TreeNode title="排产管理" key="3">
            <TreeNode title={<span style={{ color: '#08c',fontSize:12 }}>智能排产</span>} key="3-1" />
            <TreeNode title={<span style={{ color: '#08c',fontSize:12 }}>手动调整</span>} key="3-2" />
            <TreeNode title={<span style={{ color: '#08c',fontSize:12 }}>预警配置</span>} key="3-3" />
           </TreeNode>
          </Tree>
          </Col>
          <Col md={3} sm={6}>
         <Tree className="myCls"  multiple checkable 
        defaultExpandAll='true' 
           > 
          <TreeNode title="生产指令" key="4">
            <TreeNode title={<span style={{ color: '#08c',fontSize:12 }}>生产指令列表</span>} key="4-1" />
            <TreeNode title={<span style={{ color: '#08c',fontSize:12 }}>新增生产指令</span>} key="4-2" />
            <TreeNode title={<span style={{ color: '#08c',fontSize:12 }}>预警配置</span>} key="4-3" />
           </TreeNode>
          </Tree>
          </Col>
          <Col md={3} sm={6}>
         <Tree className="myCls"  multiple checkable 
        defaultExpandAll='true' 
           > 
          <TreeNode title="库存管理" key="5">
            <TreeNode title={<span style={{ color: '#08c',fontSize:12 }}>库存列表</span>} key="5-1" />
            <TreeNode title={<span style={{ color: '#08c',fontSize:12 }}>新增库存</span>} key="5-2" />
           </TreeNode>
          </Tree>
          </Col>
          <Col md={3} sm={6}>
         <Tree className="myCls"  multiple checkable 
        defaultExpandAll='true' 
           > 
          <TreeNode title="发货管理" key="6">
            <TreeNode title={<span style={{ color: '#08c',fontSize:12 }}>发货列表</span>} key="6-1" />
            <TreeNode title={<span style={{ color: '#08c',fontSize:12 }}>新增发货</span>} key="6-2" />
           </TreeNode>
          </Tree>
          </Col>
          <Col md={3} sm={6}>
         <Tree className="myCls"  multiple checkable 
        defaultExpandAll='true' 
           > 
          <TreeNode title="收款管理" key="7">
            <TreeNode title={<span style={{ color: '#08c',fontSize:12 }}>收款列表</span>} key="7-1" />
            <TreeNode title={<span style={{ color: '#08c',fontSize:12 }}>新增收款</span>} key="7-2" />
           </TreeNode>
          </Tree>
          </Col>
          <Col md={2} sm={6}>
         <Tree className="myCls"  multiple checkable 
        defaultExpandAll='true' 
       
           > 
          <TreeNode title="系统配置" key="8">
            <TreeNode title={<span style={{ color: '#08c',fontSize:12 }}>客户管理</span>} key="8-1" />
            <TreeNode title={<span style={{ color: '#08c',fontSize:12 }}>机器管理</span>} key="8-2" />
            <TreeNode title={<span style={{ color: '#08c',fontSize:12 }}>花样管理</span>} key="8-3" />
            <TreeNode title={<span style={{ color: '#08c' ,fontSize:12}}>原材料管理</span>} key="8-4" />
            <TreeNode title={<span style={{ color: '#08c',fontSize:12 }}>用户权限</span>} key="8-5" />
            <TreeNode title={<span style={{ color: '#08c',fontSize:12 }}>员工管理</span>} key="8-6" />
            <TreeNode title={<span style={{ color: '#08c',fontSize:12 }}>班次管理</span>} key="8-7" />
           </TreeNode>
          </Tree>
          </Col>
          
      </Row> */}
    
      <FormItem {...submitFormLayout} style={{marginLeft: 300,height: 0 }}>
              <Button type="primary" onClick={this.updateRole} style={{marginRight:20}}>
                保存
              </Button>
              <Button type="primary" onClick={this.goback} >
                返回
              </Button>
            </FormItem>
        </Card>
      
            
      
      </PageHeaderLayout>
    );
  }
}

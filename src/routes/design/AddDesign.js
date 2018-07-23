import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { routerRedux, Link } from 'dva/router';
import { Form, Input, DatePicker, Select, Button, Upload, message, Icon,Breadcrumb } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from './style.less';
import URL from '../../utils/api.js';
import RenderAuthorized from '../../components/Authorized';
import argument from '../../utils/argument';
const FormItem = Form.Item;
const { Option } = Select;
const { RangePicker } = DatePicker;
const { TextArea } = Input;

@connect(({ loading }) => ({
  submitting: loading.effects['form/submitRegularForm'],
}))
@Form.create()

export default class BasicForms extends PureComponent {

  state = {
    data: '',
    value1: '',
    fileName: '',
    fileList: [],
    uploading: false,
    designcategoryList:[],
    default:''

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
    formData.append('tokenId', argument.tokenId);
    formData.append('tenantId', argument.tokenId);
    formData.append('version', argument.tokenId);
    formData.append('active', 1);
    fetch(URL+'/designcategory/getDesignCategoryList/v1', {
        method: 'post',
        mode: 'cors',
        body: formData
    }).then(function(res) {
        if (res.ok) {
            res.json().then(function (data) {
                if (data.code === "0") {
                    that.setState({designcategoryList: JSON.parse(data.data).designcategoryList,default:JSON.parse(data.data).designcategoryList[0]?JSON.parse(data.data).designcategoryList[0]:{name:'无类别'}});
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

  // 上传文件
  handleUpload = () => {
    const { dispatch } = this.props;
    const that = this;
    const { fileList } = this.state;
    const formData = new FormData();
    formData.append('tokenId', argument.tokenId);
    formData.append('tenantId', argument.tokenId);
    formData.append('version', argument.tokenId);
    formData.append('active', 1);
    formData.append('categoryId',this.state.value1?this.state.value1:this.state.default.id);
    this.setState({
      uploading: true,
    });
    fileList.forEach((file) => {
      formData.append('fileList', file);
      const a = file.name;
      const b = a.lastIndexOf('.');
      const C = a.substring(b+1, a.length).toUpperCase();
      // if( C === 'PAS' || C === 'HLY' || C === 'CAT') {
      // } else {
      //   message.error('请上传正确格式的文件!');
      //   return;
      // }
      if( C !== 'PAS' ) {
        message.error('请上传正确格式的文件!');
        that.setState({
          fileList: [],
          uploading: false,
        })
        return;
      }
      if ((file.size)/1024/1024 > 100) {
        message.error('文件过大,请重新上传!');
        that.setState({
          fileList: [],
          uploading: false,
        })
        return;
      }
    });

    fetch(URL + '/design/addDesign/v1', {
        method: 'post',
        mode: 'cors',
        body: formData
    }).then(function(res) {
        if (res.ok) {
            res.json().then(function (data) {
              if(data.code === '0') {
                that.setState({
                  fileList: [],
                  uploading: false,
                });
                message.success(data.msg,0.3);
                setTimeout(function(){
                  dispatch(routerRedux.push('/design/list'));
                },500);
              } else {
                message.error(data.msg);
                that.setState({
                  fileList: [],
                  uploading: false,
                });
              }
            });
        } else if (res.status === 401) {
            console.log("Oops! You are not authorized.");
        }
    }).then(error=>{
      //  console.log(JSON.stringify(error));
    });



    // reqwest({
    //   url: '//jsonplaceholder.typicode.com/posts/',
    //   method: 'post',
    //   processData: false,
    //   data: formData,
    //   success: () => {
    //     this.setState({
    //       fileList: [],
    //       uploading: false,
    //     });
    //     message.success('upload successfully.');
    //   },
    //   error: () => {
    //     this.setState({
    //       uploading: false,
    //     });
    //     message.error('upload failed.');
    //   },
    // });
  }

//设置花样类别
  setting=()=>{

    const { dispatch } = this.props;
      dispatch(routerRedux.push('/design/set'));
  }
  //返回操作
  goback=()=>{
    const { dispatch } = this.props;
      dispatch(routerRedux.push('/design/list'));
  }
 //清除文件列表
 remove=(file)=>{
  this.setState(({ fileList }) => {
    const newFileList = [];
    return {
      fileList: newFileList,
    };
  });
 }
 //选择花样类别

 onSelect1 = (value) => {
  this.setState({
    value1: value,
  });
}

  render() {
    const { getFieldDecorator, getFieldValue } = this.props.form;
    const that = this;
    const formItemLayout = {
      labelCol: {
        xs: { span: 10},
        sm: { span: 10},
      },
      wrapperCol: {
        xs: { span: 2 },
        sm: { span: 2 },
        md: { span: 2 },
      },
    };
    const { uploading } = this.state;
    const props = {
      // action: '//jsonplaceholder.typicode.com/posts/',
      multiple: true,
      headers: {
        'X-Requested-With': null
      },
      onRemove: (file) => {
        this.setState(({ fileList }) => {
          const index = fileList.indexOf(file);
          const newFileList = fileList.slice();
          newFileList.splice(index, 1);
          return {
            fileList: newFileList,
          };
        });
      },
      beforeUpload: (file) => {
        this.setState(({ fileList }) => ({
          fileList: [...fileList, file],
        }));
        return false;
      },
      fileList: this.state.fileList,
    };



    return (
      <PageHeaderLayout>
       <Breadcrumb className={styles.bread}>
        <Breadcrumb.Item >&nbsp;</Breadcrumb.Item>
        <Breadcrumb.Item href="#/setting/design">花样列表</Breadcrumb.Item>
        <Breadcrumb.Item>添加花样</Breadcrumb.Item>
     </Breadcrumb>
      <div style={{backgroundColor:'#fff',height:'100%',padding:20 }}>
        <Button type="default" style={{float:"left"}}>花样文件列表</Button><br></br>
        <div style={{ textAlign: 'right', marginBottom: 10 ,marginTop: 30,position:'relative'}}>
        <Button type="primary" style={{float:"left",marginLeft:150}} onClick={this.remove}>清除所有文件</Button>

           <Button type="primary" style={{marginRight:30}} onClick={this.setting}>设置花样类别</Button>
           <Button
          className="upload-demo-start"
          type="primary"
          onClick={this.handleUpload}
          disabled={this.state.fileList.length === 0}
          loading={uploading}
        >
          {uploading ? '正在上传' : '开始上传' }
        </Button>
        <Button type="default" style={{marginLeft:10}} onClick={this.goback}>返回</Button>
        <Form
           layout="horizontal"
           style={{position:"absolute",right:350,top:-3}}
           >
           <FormItem
              {...formItemLayout}
              label="花样类别"
            >
            {getFieldDecorator('no1',{ initialValue:this.state.default.name })(
                <Select className={styles.select} style={{ width: 120 }} onChange={this.onSelect1}  placeholder="请选择" >
                {
                       this.state.designcategoryList.map(function(item){
                            return (
                            <Option value={item.id} key={item.id}>
                            {item.name}
                            </Option>)
                       })
                   }
                     </Select>   )}
            </FormItem>
            </Form>
            <div style={{width:200}} ><Upload {...props} ><Button type="primary" style={{position:'absolute',left:0,top:0}}><Icon type="upload" />添加花样文件</Button></Upload>
             </div>

           </div>
          </div>

        {/* <div style={{ height: '10px' }}></div> */}
        {/* <TextArea rows={8} style={{ width: '100%', resize: 'none' }} readOnly   /> */}
      </PageHeaderLayout>
    );
  }
}

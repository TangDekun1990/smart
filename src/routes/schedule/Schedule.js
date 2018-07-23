import React, { PureComponent } from 'react';
import { Table, Button, Input, message, Popconfirm, Divider, Form, Mention, Progress } from 'antd';
import styles from './style.less';
import PageHeaderLayout from '../../layouts/PageHeaderLayout'
const FormItem = Form.Item;

const listShow = [];
const { TextArea } = Input;
import argument from '../../utils/argument';
import URL from '../../utils/api';

const EditableCell = ({ editable, value, onChange }) => (

  <div>
    {editable
      ? <Input style={{ width: 70 }} value={value} onChange={e => onChange(e.target.value)} />
      : value
    }
  </div>
);

export default class Schedule extends PureComponent {

  state = {
    listShow: '',
  };


  componentDidMount() {
    const that = this;
    const formData = new FormData();
    formData.append('version', argument.version);
    formData.append('tenantId', argument.tenantId);
    formData.append('tokenId', argument.tokenId);
    formData.append('active', 1);
    fetch(URL + '/scheduling/getSchedulingList/v1', {
    // fetch('/planProduct/getPlanProductList/v1', {
      method: 'post',
      mode: 'cors',
      body: formData,
    }).then(function(res) {
      if (res.ok) {
        res.json().then(function (data) {
          if (data.code === "0") {
            var arr = [];
            for(var i = 0; i < data.data.planProductList.length; i ++ ) {
              arr.push(data.data.planProductList[i].updateMachineNumber)
            }
            that.setState({
              //listShow: data.data.planProductList,
              listShow: JSON.parse(data.data).schedulingList,
            });
          }
        });
      } else if (res.status === 401) {
        console.log("Oops! You are not authorized.");
      }
    }).then(error=>{
      //console.log(JSON.stringify(error));
    });
  }
  // 加机器事件(改变得值放到textArea中)
  add = (record) => {
    var data = record.updateMachineNumber += 1;
    var arr = this.state.listShow;
    for(var i = 0; i < arr.length; i ++) {
      if(record.id === arr[i].id) {
        arr[i].updateMachineNumber = data;
        console.log(arr[i].updateMachineNumber)
        this.setState({
          listShow: arr
        })
      }
    }
  }
  // 减机器事件(改变得值放到textArea中)
  minus = (record) => {
    var data = record.updateMachineNumber -= 10;
    var arr = this.state.listShow;
    for(var i = 0; i < arr.length; i ++) {
      if(record.id === arr[i].id) {
        arr[i].updateMachineNumber = data;
        console.log(arr[i].updateMachineNumber)
        if (arr[i].updateMachineNumber <= 0) {
          message.error('已没有机器可以选择!');
          return;
        }
        this.setState({
          listShow: arr
        })
      }
    }
  }

  // 保存并发送的按钮
  send = () => {
    return;
    const that = this;
    const formData = new FormData();
    formData.append('version', argument.version);
    formData.append('tenantId', argument.tenantId);
    formData.append('tokenId', argument.tokenId);
    formData.append('active', 1);
    fetch(URL + '/scheduling/getSchedulingList/v1', {
      method: 'post',
      mode: 'cors',
      body: formData,
    }).then(function(res) {
      if (res.ok) {
        res.json().then(function (data) {
          console.log(data);
          // if (data.code === "0") {
          //   var arr = [];
          //   for(var i = 0; i < data.data.planProductList.length; i ++ ) {
          //     arr.push(data.data.planProductList[i].updateMachineNumber)
          //   }
          //   that.setState({
          //     listShow: data.data.planProductList,
          //     data: arr
          //   });
          // }
        });
      } else if (res.status === 401) {
        console.log("Oops! You are not authorized.");
      }
    }).then(error=>{
      //console.log(JSON.stringify(error));
    });
  }

  constructor(props) {
    super(props);
    this.columns = [{
      title: '花样名',
      dataIndex: 'designName',
      key: 'designName',
      align: 'center',
    }, {
      title: '完成率',
      dataIndex: 'finishedRate',
      key: 'finishedRate',
      align: 'center',
    }, {
      title: '工作机器数',
      dataIndex: 'machineNumber',
      key: 'machineNumber',
      align: 'center',
    },{
      title: '',
      render: (record) => <Button type="primary" icon="plus" onClick={() => this.add(record)}/>,
      align: 'center',
    },{
      title: '调整后机器数',
      dataIndex: 'updateMachineNumber',
      align: 'center',
    },{
      title: '',
      render: (record) => <Button type="primary" icon="minus" onClick={() => this.minus(record)} />,
      align: 'center',
    },{
      title: '调整后预计完成时间',
      dataIndex: 'updatFinishedTime',
      key: 'updatFinishedTime',
      align: 'center',
    },{
      title: '预计完成时间',
      dataIndex: 'finishedTime',
      key: 'finishedTime',
      align: 'center',
    },{
      title: '交货时间',
      dataIndex: 'deliveryTime',
      key: 'deliveryTime',
      align: 'center',
    },
    // {
    //   title: '操作',
    //   dataIndex: 'operation',
    //   render: (text, record) => {
    //     const { editable } = record;
    //     return (
    //       <div className="editable-row-operations">
    //         {
    //           editable ?
    //             <span>
    //               <a onClick={() => this.save(record.id)}>保存</a>
    //               <Divider type="vertical" />
    //               <Popconfirm title="确定取消吗?" onConfirm={() => this.cancel(record.id)}>
    //                 <a>取消</a>
    //               </Popconfirm>
    //             </span>
    //             : <a onClick={() => this.edit(record.id)}>编辑</a>
    //         }
    //       </div>
    //     );
    //   },
    // }
  ];
    this.state = { listShow };
    this.cacheData = listShow.map(item => ({ ...item }));

    this.state = {
      listShow: props.value,
      loading: false,
    };
  }

  renderColumns(text, record, column) {
    return (
      <EditableCell
        editable={record.editable}
        value={text}
        onChange={value => this.handleChange(value, record.id, column)}
      />
    );
  }
  handleChange(value, id, column) {
    const newData = [...this.state.listShow];
    const target = newData.filter(item => id === item.id)[0];
    if (target) {
      target[column] = value;
      this.setState({ listShow: newData });
    }
  }
  edit(id) {
    const newData = [...this.state.listShow];
    const target = newData.filter(item => id === item.id)[0];
    if (target) {
      target.editable = true;
      this.setState({ listShow: newData });
    }
  }
  save(id) {
    const newData = [...this.state.listShow];
    const target = newData.filter(item => id === item.id)[0];
    if (target) {
      delete target.editable;
      this.setState({ data: newData });
      this.cacheData = newData.map(item => ({ ...item }));
    }
  }
  cancel(id) {
    const newData = [...this.state.listShow];
    const target = newData.filter(item => id === item.id)[0];
    if (target) {
      Object.assign(target, this.cacheData.filter(item => id === item.id)[0]);
      delete target.editable;
      this.setState({ listShow: newData });
    }
  }



  componentWillReceiveProps(nextProps) {
    if ('value' in nextProps) {
      this.setState({
        data: nextProps.value,
      });
    }
  }
  getRowByKey(key, newData) {
    return (newData || this.state.data).filter(item => item.key === key)[0];
  }
  index = 0;
  cacheOriginData = {};
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        this.props.dispatch({
          type: 'form/submit',
          payload: values,
        });
      }
    });
  }
  toggleEditable=(e, key) => {
    e.preventDefault();
    const newData = this.state.data.map(item => ({ ...item }));
    const target = this.getRowByKey(key, newData);
    if (target) {
      // 进入编辑状态时保存原始数据
      if (!target.editable) {
        this.cacheOriginData[key] = { ...target };
      }
      target.editable = !target.editable;
      this.setState({ data: newData });
    }
  }
  remove(key) {
    const newData = this.state.data.filter(item => item.key !== key);
    this.setState({ data: newData });
    this.props.onChange(newData);
  }
  newMember = () => {
    const newData = this.state.data.map(item => ({ ...item }));
    newData.push({
      key: `NEW_TEMP_ID_${this.index}`,
      workId: '',
      name: '',
      department: '',
      editable: true,
      isNew: true,
    });
    this.index += 1;
    this.setState({ data: newData });
  }
  handleKeyPress(e, key) {
    if (e.key === 'Enter') {
      this.saveRow(e, key);
    }
  }
  handleFieldChange(e, fieldName, key) {
    const newData = this.state.data.map(item => ({ ...item }));
    const target = this.getRowByKey(key, newData);
    if (target) {
      target[fieldName] = e.target.value;
      this.setState({ data: newData });
    }
  }
  saveRow(e, key) {
    e.persist();
    this.setState({
      loading: true,
    });
    // save field when blur input
    setTimeout(() => {
      if (document.activeElement.tagName === 'INPUT' &&
          document.activeElement !== e.target) {
        return;
      }
      if (this.clickedCancel) {
        this.clickedCancel = false;
        return;
      }
      const target = this.getRowByKey(key) || {};
      if (!target.workId || !target.name || !target.department) {
        message.error('请填写完整成员信息。');
        e.target.focus();
        this.setState({
          loading: false,
        });
        return;
      }
      delete target.isNew;
      this.toggleEditable(e, key);
      this.props.onChange(this.state.data);
      this.setState({
        loading: false,
      });
    }, 500);
  }

  render() {
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
    return (
      <PageHeaderLayout>
          <div>
            <div>
               <span>订单号:</span> <span>D1367892</span>
               <span style={{ marginLeft: '20px' }}>订单名称:</span> <span>Nike袜业</span>
            </div>
            <Table
              columns={this.columns}
              dataSource={this.state.listShow}
              rowKey={record => record.id}
              onkey={this.add}
              onkey={this.minus}
              pagination={false}
              style={{marginTop: '20px'}}
            />
            <div  className={styles.message}>
               改车信息
            </div>
            <div className={ styles.div }>
              <TextArea
                style={{ width: '65%', height: 100, resize: 'none' }}
                readOnly
              />
              <Button type="primary" style={{ marginLeft: '10%' }} onClick={this.send} >
                保存并发送
              </Button>
            </div>
          </div>
      </PageHeaderLayout>
    );
  }
}

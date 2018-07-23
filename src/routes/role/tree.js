import React from 'react';
import { Button,Tree } from 'antd';
// import '../../style/userManage.css';
// import '../../style/reset.css';
import 'antd/dist/antd.css';
import URL from '../../utils/api.js';
// import tokenId from '../../utils/tokenId.js';
// if (tokenId !== "" && tokenId !== undefined) {
//   localStorage.tokenId = tokenId;
// }

const TreeNode = Tree.TreeNode;
const treeData = [{
  title: '0-0',
  key: '0-0',
  children: [{
    title: '0-0-0',
    key: '0-0-0',
    children: [
      { title: '0-0-0-0', key: '0-0-0-0' },
      { title: '0-0-0-1', key: '0-0-0-1' },
      { title: '0-0-0-2', key: '0-0-0-2' },
    ],
  }, {
    title: '0-0-1',
    key: '0-0-1',
    children: [
      { title: '0-0-1-0', key: '0-0-1-0' },
      { title: '0-0-1-1', key: '0-0-1-1' },
      { title: '0-0-1-2', key: '0-0-1-2' },
    ],
  }, {
    title: '0-0-2',
    key: '0-0-2',
  }],
}, {
  title: '0-1',
  key: '0-1',
  children: [
    { title: '0-1-0-0', key: '0-1-0-0' },
    { title: '0-1-0-1', key: '0-1-0-1' },
    { title: '0-1-0-2', key: '0-1-0-2' },
  ],
}, {
  title: '0-2',
  key: '0-2',
}];


class LimitManage extends React.Component {
    // 搭建构造函数   *fetch*  （初始化fetch组件，定义需要用到的东西）
    constructor(props) {
        super(props);
        this.state = {
            levelList: [],
            permissionList: [],
            tenantList: [],
            expandedKeys: ["00", "02", "03", "05", "06", "19", "01", "18", "07", "04", "10", "15"], //  展开指定的树节点
            checkedKeys: [] ,         // 选中复选框的树节点
            selectedKeys: []         // 设置选中的树节点
         };
    }

    // 页面刷新加载下拉框的选项
   componentDidMount() {
        const that = this;
        const formData = new FormData();   // 创建formData对象保存参数
        //页面家在显示列表请求数据(表格） *fetch*请求
        console.log(localStorage.tokenId)
        formData.append('tokenId', localStorage.tokenId);
        fetch( '/role/getRoleList', {
            method: 'post',
            //涉及到跨域的问题前端加上这个属性，后台也需要设置 *zyh*
            mode: 'cors',
            body: formData
        }).then(function(res) {
            if (res.ok) {
                res.json().then(function (data) {
                    if (data.code === "2") {
                        // 存数据(赋值)
                        that.setState({levelList: JSON.parse(data.data).roleList});
                        that.setState({permissionList: JSON.parse(data.data).permissionList});
                        const dataArray = JSON.parse(data.data).roleList[0].popeCode;
                        const dataJson = dataArray.split(';');
                        that.setState({checkedKeys: dataJson});
                        that.setState({tenantList: JSON.parse(data.data).tenantList});
                    }
                    const ip = data.data;
                    /*if (data.code === 5) {
                        document.location.href = ip;
                    }*/
                });
            } else if (res.status === 401) {
                console.log("Oops! You are not authorized.");
            }
        }).then(error=>{
            console.log(JSON.stringify(error));
        });
    };

    //  选择权限显示该权限下的管理范围
    changeLevel = () => {

        // select默认属性selectIndex (获取下标)
        const selectTag = document.getElementById("selectLevel")
        const index = selectTag.selectedIndex;
        const that = this;
        const formData = new FormData();   // 创建formData对象保存参数
        formData.append('tokenId', localStorage.tokenId);
        fetch(  '/role/getRoleList', {
            method: 'post',
            //涉及到跨域的问题前端加上这个属性，后台也需要设置 *zyh*
            mode: 'cors',
            body: formData
        }).then(function(res) {
            if (res.ok) {
                res.json().then(function (data) {
                    if (data.code === "2") {
                        // 存数据(赋值)
                        //debugger;
                        that.setState({levelList: JSON.parse(data.data).roleList});
                        const dataArray = JSON.parse(data.data).roleList[index].popeCode;
                        if (dataArray === '' || dataArray === undefined ) {
                            that.setState({checkedKeys: []});
                            return;
                        }
                        const dataJson = dataArray.split(';');
                        that.setState({checkedKeys: dataJson});
                        if (dataArray === '') {
                            return;
                        }
                    }
                    const ip = data.data;
                    if (data.code === 5) {
                        document.location.href = ip;
                    }
                });
            } else if (res.status === 401) {
                console.log("Oops! You are not authorized.");
            }
        }).then(error=>{
            console.log(JSON.stringify(error));
        });
    }

    // 添加角色按钮事件
    addRole = () => {
       const addRoleModel = document.getElementById("addRoleModel");
       addRoleModel.style.display = 'block';
    }
    // 点击返回消失添加角色框
    returnButton = () => {
        const addRoleModel = document.getElementById("addRoleModel");
        const addRoleInput = document.getElementById('addRoleInput');
        addRoleModel.style.display = 'none';
        addRoleInput.value = '';
    }

    // 新增角色添加数据
    saveRole = () => {
        const addRoleInput = document.getElementById('addRoleInput').value;
        const tenantId = document.getElementById("rentSelect").value;
        const formData = new FormData();
        formData.append('name', addRoleInput);
        formData.append('tenantId', tenantId);
        console.log(localStorage.tokenId)
        formData.append('tokenId', localStorage.tokenId);
        if(addRoleInput === "") {
            alert("请输入角色名称");
            return;
        }
        if(addRoleInput !== "") {
            if(window.confirm("确定新增"+ '<'+addRoleInput +'>'+"角色吗？")){

            }else{
                 return;
            }
        }
        fetch(  '/role/saveRole', {
            method: 'post',
            //涉及到跨域的问题前端加上这个属性，后台也需要设置 *zyh*
            mode: 'cors',
            body: formData
        }).then(function(res) {
            if (res.ok) {
                res.json().then(function (data) {
                    if (data.code === "2") {
                        alert("新增角色成功");
                    }
                    if (data.code === "-1") {
                        alert("系统发生异常!");
                    }
                    const ip = data.data;
                    /*if (data.code === 5) {
                        document.location.href = ip;
                    }*/
                });
            } else if (res.status === 401) {
                console.log("Oops! You are not authorized.");
            }
        }).then(error=>{
            console.log(JSON.stringify(error));
        });
        window.location.href="LimitManage";
    }

    // 删除角色删除数据
    delRole = ( ) => {
        if(window.confirm("确定删除该角色吗？")){

            } else {
                return;
        }
        const selectId = document.getElementById("selectLevel").value;
        const formData = new FormData();
        formData.append('id', selectId);
        formData.append('tokenId', localStorage.tokenId);
        fetch( '/role/deleteRoleById', {
            method: 'post',
            //涉及到跨域的问题前端加上这个属性，后台也需要设置 *zyh*
            mode: 'cors',
            body: formData
        }).then(function(res) {
            if (res.ok) {
                res.json().then(function (data) {
                    if (data.code === "2") {
                        alert("删除角色成功");
                    }
                    if (data.code === "-1") {
                        alert("系统发生异常!");
                    }

                    const ip = data.data;
                    if (data.code === 5) {
                        document.location.href = ip;
                    }
                });
            } else if (res.status === 401) {
                console.log("Oops! You are not authorized.");
            }
        }).then(error=>{
            console.log(JSON.stringify(error));
        });
        window.location.href="LimitManage";
    }

    // 保存权限的数据
    savaLevel = () => {
        //const that = this;
        const selectId = document.getElementById("selectLevel").value;
        if(window.confirm("确定保存该权限吗？")){
                //alert("保存权限成功");
            } else {
                 return;
        }
        const formData = new FormData();   // 创建formData对象保存参数
        formData.append('id', selectId);
        const str = this.state.checkedKeys.join(';');
        formData.append('popeCode', str);
        formData.append('tokenId', localStorage.tokenId);
        //页面家在显示列表请求数据(表格） *fetch*请求
        fetch(  '/role/updateRoleById', {
            method: 'post',
            //涉及到跨域的问题前端加上这个属性，后台也需要设置 *zyh*
            mode: 'cors',
            body: formData
        }).then(function(res) {
            if (res.ok) {
                res.json().then(function (data) {
                    if (data.code === "2") {
                        // 存数据(赋值)
                        //that.setState({levelList: JSON.parse(data.data).roleList});
                        alert("保存权限成功！");
                    }
                    if (data.code === "-1") {
                        alert("系统发生异常！");
                        return;
                    }
                    const ip = data.data;
                    if (data.code === 5) {
                        document.location.href = ip;
                    }
                });
            } else if (res.status === 401) {
                console.log("Oops! You are not authorized.");
            }
        }).then(error=>{
            console.log(JSON.stringify(error));
        });

        window.location.href="LimitManage";
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
  onSelect = (selectedKeys, info) => {
    this.setState({ selectedKeys });
  }
  renderTreeNodes = (data) => {
    //console.log(data)
    return data.map((item) => {
      if (item.childPopedom !== undefined) {
        return (
          <TreeNode title={item.name} key={item.code} dataRef={item}>
            {this.renderTreeNodes(item.childPopedom)}
          </TreeNode>
        );
      }
      //  问题难点{...}
      return <TreeNode title={item.name} key={item.code} dataRef={item}/>;
    });
  }

  render() {
    return (
        <div className="content">
            <div className="nav">
                <span className="navStyle"></span>
                <span className="textL">
                    操作人员列表
                </span>
            </div>
            <hr className="pageHr"/>
            <div className="userLevelWrap">
                <span className="userLevelWrapLeft">
                      <span className="textWrap">角色权限 :</span>
                      <span className="textInput">
                            <select id="selectLevel" onChange={this.changeLevel}>
                                {
                                    this.state.levelList.map(function(name){
                                         return (
                                            <option key={name.id} value={name.id}>
                                                {name.name}
                                            </option>
                                         )
                                    })
                                }
                            </select>
                      </span>
                </span>
                <span className="userLevelRight">
                      <Button type="primary" className="selectButton" onClick={this.addRole}>添加角色</Button>
                      <Button type="primary" className="selectButton" onClick={this.delRole}>删除角色</Button>
                      <Button type="primary" className="selectButton" onClick={this.savaLevel}>保存权限</Button>
                      <div id="addRoleModel">
                           <span className="addRoleModelLeft">
                                <span className="addTextWrap">角色名 :</span>
                                <span className="textInput">
                                    <input type="text" id="addRoleInput"/>
                                </span>
                           </span>
                          <span className="rent">
                              <span className="addTextWrap">选择租户 :</span>
                              <select  id="rentSelect">
                                    {
                                        this.state.tenantList.map(function(name){
                                            return (
                                                <option key={name.tenant_id} value={name.tenant_id}>
                                                    {name.name}
                                                </option>
                                            )
                                        })
                                    }
                              </select>
                          </span>
                           <span className="addRoleModelRight">
                                <Button type="primary" className="selectButton" onClick={this.saveRole}>新增</Button>
                                <Button type="primary" className="selectButton" onClick={this.returnButton}>返回</Button>
                           </span>
                      </div>
                </span>
            </div>
            <div className="treeWrap">
                 <div className="treeTitle">管理权限</div>
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
                        {this.renderTreeNodes(this.state.permissionList)}
                    </Tree>
                 </div>
            </div>
        </div>
    );
  }
}
export default LimitManage;

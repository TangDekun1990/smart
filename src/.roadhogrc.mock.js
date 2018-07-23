import mockjs from 'mockjs';
import { getRule, postRule } from './mock/rule';
import { getActivities, getNotice, getFakeList } from './mock/api';
import { getFakeChartData } from './mock/chart';
import { imgMap } from './mock/utils';
import { getProfileBasicData } from './mock/profile';
import { getProfileAdvancedData } from './mock/profile';
import { getNotices } from './mock/notices';
import { format, delay } from 'roadhog-api-doc';

// 是否禁用代理
const noProxy = process.env.NO_PROXY === 'false';

// 代码中会兼容本地 service mock 以及部署站点的静态数据
const proxy = {
  // 支持值为 Object 和 Array
  'GET /api/currentUser': {
    $desc: "获取当前用户接口",
    $params: {
      pageSize: {
        desc: '分页',
        exp: 2,
      },
    },
    $body: {
      name: 'Serati Ma',
      avatar: 'https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png',
      userid: '00000001',
      notifyCount: 12,
    },
  },
  // GET POST 可省略
  'GET /api/users': [{
    key: '1',
    name: 'John Brown',
    age: 32,
    address: 'New York No. 1 Lake Park',
  }, {
    key: '2',
    name: 'Jim Green',
    age: 42,
    address: 'London No. 1 Lake Park',
  }, {
    key: '3',
    name: 'Joe Black',
    age: 32,
    address: 'Sidney No. 1 Lake Park',
  }],

// Taakey: 大豪网络-测试数据 begin...

// 订单列表
'/order/getOrderList/1': {
  code: '0',
  msg: '查询订单列表成功',
	data: {
			orderList:[
				{active:1,createTime:'2018-02-26',customerId:'6',customerName:'小黄车ofo',customerPhone:'15678941234',id:'2',name:'大豪袜袜5555',number:188,deliveryTime:'2019-02-26',tenantId:'0',totalNumber:1},
				{active:1,createTime:'2018-02-26',customerId:'6',customerName:'小黄车ofo',customerPhone:'15678941234',id:'3',name:'大豪袜袜5555',number:1,orderTime:'2018-02-26',tenantId:'1',totalNumber:100000},
				{active:1,createTime:'2018-02-26',customerId:'6',customerName:'小黄车ofo',customerPhone:'15678941234',deliveryTime:'2018-02-26',id:'4',name:'大豪袜袜5555',number:2,orderTime:'2018-02-26',tenantId:'1',totalNumber:100000},
				{active:1,createTime:'2018-02-26',customerId:'6',customerName:'小黄车ofo',customerPhone:'15678941234',deliveryTime:'2018-02-26',id:'5',name:'大豪明德',number:2,orderTime:'2018-02-26',tenantId:'1',totalNumber:100000}
			]}
	},

//订单详情
'/order/getOrderById/1':{
  code: '0',
  msg: '查询订单详情成功',
	data: {order:{
	active:1,createTime:'2018-02-26',customerId:'6',customerName:'小黄车ofo',customerPhone:'15678941234',id:'2',name:'大豪袜袜5555',number:188,orderTime:'2018-02-26',tenantId:'0',totalNumber:1
	}}
	},
	
//新增订单
'/order/addOrder/1':{
  code: '0',
	msg: '新增订单成功'
	},

	//更新订单
'/order/upadteOrderById/1':{
  code: '0',
	msg: '更新订单成功'
	},
	
//删除订单
'/order/deleteOrderById/1':{
  code: '0',
  msg: '删除订单成功',
	},

//订单监控列表
'/order/getOrderMonitorListByList/1':{
  code: '0',
  msg: '查询订单监控列表成功', 
	data: {List:[{
		id:'1',orderNumber:'订单编号1',orderName:'订单名称1',orderFinishedPercent:'1%',OrderExpectedCompletionTime:'2018-04-01 00:00:00',designList:[{id:'1',name:'花样名1',finishedPercent:'1%',expectedCompletionTime:'2018-04-0100:00:00'},{id:'2',name:'花样名4',finishedPercent:'1%',expectedCompletionTime:'2018-04-01 00:00:00'}]},
		{
		id:'2',orderNumber:'订单编号2',orderName:'订单名称2',orderFinishedPercent:'1%',OrderExpectedCompletionTime:'2018-04-01 00:00:00',designList:[{id:'1',name:'花样名2',finishedPercent:'1%',expectedCompletionTime:'2018-04-0100:00:00'},{id:'2',name:'花样名4',finishedPercent:'1%',expectedCompCompletionTime:'2018-04-01 00:00:00'}]},
		{
		id:'3',orderNumber:'订单编号3',orderName:'订单名称3',orderFinishedPercent:'1%',OrderExpectedCompletionTime:'2018-04-01 00:00:00',designList:[{id:'1',name:'花样名3',finishedPercent:'1%',expectedCompletionTime:'2018-04-0100:00:00'},{id:'2',name:'花样名4',finishedPercent:'1%',expectedCompCompletionTime:'2018-04-01 00:00:00'}]},
]}
},

//订单预警列表
'/orderalert/getOrderAlertList/1':{
  code: '0',
  msg: '查询订单预警列表成功',
	data: {orderAlertList:[{
	id:'1',orderId:'1',orderNumber:'订单编号1',number:1000,workerName:'张三',workerPhone:'123456789879'},
	{id:'2',orderId:'1',orderNumber:'订单编号2',number:2000,workerName:'李四',workerPhone:'123456789879'},
	]}
	},

//新增订单预警
'/orderalert/addOrderAlert/1': {
  code: '0',
  msg: '新增预警成功'
},

	//更新订单预警
'/orderalert/upadteOrderAlertById/1': {
  code: '0',
  msg: '更新预警成功'
},
	
//删除订单预警
'/orderalert/deleteOrderAlertById/1': {
  code: '0',
  msg: '删除预警成功'
	},

//订单状态预警列表
'/orderstatus/getOrderStatusList/1':{
  code: '0',
  msg: '查询订单状态列表成功', 
	data: {orderStatusList:[
		{id:'1',name:'未生产'},
		{id:'2',name:'已生产'},
		{id:'3',name:'已完成'}
	]}
},

//新增订单状态
'/orderstatus/addOrderStatus/1':{
  code: '0',
  msg: '新增状态成功'
},

//更新订单状态
'/orderstatus/upadteOrderStatusById/1':{
  code: '0',
  msg: '更新状态成功'
},
	
//删除订单状态
'/orderstatus/deleteOrderStatusById/1':{
  code: '0',
  msg: '删除状态成功'
},

//四、库存管理
//1.库存列表查询
'/stock/getStockList/1':{
  code: '0',
  msg: '查询库存列表成功',
  data: {
    stockList:[{
    id: '1',
    number: '1001',
    orderId: '1',
    orderNumber: '201802271014',
    productCategoryId: '1',
    productCategoryName: '水溶',
    productName: '桃园三结义',
    product_quanttity: '200',
    unitValue: '版',
    remark: '无'
    },{
    id: '2',
    number: '1002',
    orderId: '2',
    orderNumber: '201802271057',
    productCategoryId: '2',
    productCategoryName: '本白',
    productName: '千里走单骑',
    product_quanttity: '200',
    unitValue: '版',
    remark: '无'
    }],
    productCategoryList:[{
    id: '1',
    name: '水溶'
    },{
    id: '2',
    name: '本白'
    }],
    orderList:[{
    id: '1',
    number: '201802271014'
    },{
    id: '2',
    number: '201802271057'
    }]
}},

//2.库存详情查询
'/stock/getStockByStockId/1':{
code: '0',
msg: '库存详情查询成功',
data: [{
	id: '1',
	number: '201802271120',
	orderNumber: '201802271057',
	productCategoryName:'本白',
	productName: '桃园三结义',
	product_quanttity: '200',
	unitValue: '版',
	remark: '无'
	},{
	id: '2',
	number: '201802271146',
	orderNumber: '201802271057',
	productCategoryName:'水溶',
	productName: '千里走单骑',
	product_quanttity: '200',
	unitValue: '版',
	remark: '无'
	}]
},

//3.新增库存
'/stock/addStock/1':{
  code: '0',
  msg: '新增库存成功'
},

//4.更新库存
'/stock/updateStockByStockId/1':{
  code: '0',
  msg:'更新库存成功'	
},

//5.删除库存
'/stock/deleteStockByStockId/1':{
  code: '0',
  msg:'新增库存成功'
},

//6.订单、库存分类、客户列表查询
'/stock/getOrderAndStockAndCustomerList/1':{
  code: '0',
  msg: '订单、库存分类、客户列表查询',
  data: {
    productCategoryList: [{
      id: '1',
      name: '水溶',
    },{
      id: '2',
      name: '本白'
    }],
    orderList: [{
      id: '1',
      number: '201802271332'
    },{
      id: '2',
      number: '201802271333'
    }],
    customerList: [{
      id: '1',
      name: '张三'
    },{
      id: '李四',
      name: '王五'
    }]
    }
},

//五、发货管理
//1.发货列表查询
'/deliveritem/getDeliverItemList/1':{
code: '1',
msg: '发货列表查询成功',
data:{
	stockList:[{
		id: '1',
		number: '201802271351',
		orderNumber: '201802271332',
		productCategoryName: '水溶',
		productName: '孔雀东南飞',
		product_quanttity: '200',
		unitValue: '版',
		deliverTime: '2018年2月30日',
		remark: '无'
	},{
		id: '2',
		number: '201802271352',
		orderNumber: '201802271332',
		productCategoryName: '本白',
		productName: '千里走单骑',
		product_quanttity: '200',
		unitValue: '版',
		deliverTime: '2018年2月30日',
		remark: '无'
	}],
	productCategoryList:[{
		id: '1',
		name: '本白'
	},{
		id: '2',
		name: '水溶'
	}],
	orderList:[{
		id: '1',
		number: '201802271355'
	},{
		id: '2',
		number: '201802271355'
	}]
}
},


//2.库存详情查询
'/deliveritem/getDeliverItemByDeliverItemId/1':{
	code: '1',
	msg: '库存详情查询成功',
	data: [{
		id:'1',
		number: '201802271400',
		orderNumber:'201802271355',
		productCategoryName: '水溶',
		productName: '空城计',
		product_quanttity: '200',
		unitValue: '版',
		deliverTime:'2018年2月30日',
		remark: '无'
	},{
		id:'2',
		number: '201802271403',
		orderNumber:'201802271350',
		productCategoryName: '水溶',
		productName: '空城计',
		product_quanttity: '200',
		unitValue: '版',
		deliverTime:'2018年2月30日',
		remark: '无'
	}]
},

//3.新增发货
'/deliveritem/addDeliverItem/1':{
	code: '1',
	msg: '新增发货成功'
},

//4.更新发货
'/deliveritem/updateDeliverItemByDeliverItemId/1':{
	code: '1',
	msg: '更新发货成功'
},

//5.删除发货
'/deliveritem/deleteDeliverItemByDeliverItemId/1':{
	code: '1',
	msg: '删除发货成功'
},

//六、收款管理
//1.收款列表查询
'/receivables/getReceivablesList/1':{
	code: '1',
	msg: '收款列表查询成功',
	data: {
		receivablesList: [{
			id:'1',
			number: '201802271416',
			orderNumber:'201802083124',
			customerName: 'H&M',
			productCategoryName: '水溶',
			productName: '草船借箭',
			product_quanttity: '200',
			unitValue: '版',
			amountReceivable:'5000',
			receivedAmount:'5000',
			arrears_amount:'0',
			remark: '无'
		},{
			id:'2',
			number: '201802271423',
			orderNumber:'201802083215',
			customerName: 'Unico',
			productCategoryName: '本白',
			productName: '借刀杀人',
			product_quanttity: '200',
			unitValue: '版',
			amountReceivable:'3000',
			receivedAmount:'1000',
			arrears_amount:'2000',
			remark: '无'
		}],
		productCategoryList: [{
			id: '1',
			name: '本白'
		},{
			id: '2',
			name: '水溶'
		}],
		orderList: [{
			id: '1',
			number: '201802083215'
		},{
			id: '2',
			number: '201802083241'
		}],
		customerList: [{
			id: '1',
			name: 'Nike'
		},{
			id: '1',
			name: 'Addidas'
		}]
	}
},

//2.收款详情查询
'/receivables/getReceivablesByReceivablesId/1':{
	code: '1',
	msg: '收款详情查询成功',
	data: [{
		number: '1',
		orderNumber:'201802271455',
		customerName: 'Nike',
		productCategoryName: '本白',
		productName: '草船借箭',
		product_quanttity: '2000',
		unitValue: '版',
		amountReceivable:'2000',
		receivedAmount:'500',
		arrears_amount:'1500',
		remark: '无',
	},{
		number: '2',
		orderNumber:'201802271458',
		customerName: 'Addidas',
		productCategoryName: '水溶',
		productName: '草船借箭',
		product_quanttity: '2000',
		unitValue: '版',
		amountReceivable:'2000',
		receivedAmount:'500',
		arrears_amount:'1500',
		remark: '无',
	}]
},

//3.新增收款
'/receivables/addReceivables/1':{
	code: '0',
	msg: '新增收款成功',
},

//4.更新收款
'/ receivables/updateReceivablesByReceivablesId/1':{
	code: '0',
	msg: '更新收款成功',
},

//5.删除收款
'/receivables/deleteReceivablesByReceivablesId/1':{
	code: '0',
	msg: '删除收款成功',
},


//八、客户管理
//1.客户列表查询
'/customer/getCustomerList/1':{
	code: '0',
	msg:'客户列表查询成功',
	data:[{
		id:'1',
		number: '0215',
		name:'Addidas',
		phone:'1326093057',
		companyName:'Addidas',
		deliveryAddress: '北京市朝阳区光华路9号世贸商业中心世贸天阶南街L131',
		remark: '无'
	},{
		id:'2',
		number: '0216',
		name:'Nike',
		phone:'1326093057',
		companyName:'Addidas',
		deliveryAddress: '北京朝阳区朝阳北路101号3F-40号',
		remark: '无'
	}]
},

//2.客户详情查询
'/customer/getCustomerByCustomerId/1':{
	code: '0',
	msg:'客户详情查询成功',
	data:{
		id:'1',
		number: '0215',
		name:'Addidas',
		phone:'1326093057',
		companyName:'Addidas',
		deliveryAddress: '北京市朝阳区光华路9号世贸商业中心世贸天阶南街L131',
		remark: '无'
	}
},

//3.新增客户查询
'/customer/addCustomer/1':{
	code: '0',
	msg: '新增客户查询成功'
},

//4.更新客户
'/customer/updateCustomerByCustomerId/1':{
	code: '0',
	msg: '更新客户查询成功'
},

//5.删除客户
'/customer/deleteCustomerByCustomerId/1':{
	code: '0',
	msg: '删除客户查询成功'
},

//九、机器管理
//1.机器列表查询
'/machine/getMachineList/1':{
	code: '0',
	msg: '机器列表查询成功',
	data: [{
		id:'1',
		name:'1号机',
		machineMac: '00-01-6C-06-A6-29',
		model:'X6',
		ip:'192.168.8.86',
		workshop:'一车间',
		system_number:'current_system',
		speed:'1200',
		designCategoryName:'水溶',
		designName:'生意兴隆.dst',
		machineEventValue:'运行中'
	},{
		id:'2',
		name:'2号机',
		machineMac: '00-01-6C-06-A6-30',
		model:'X6',
		ip:'192.168.8.86',
		workshop: '二车间',
		system_number:'current_system',
		speed: '800',
		designCategoryName:'本白',
		designName: '生意兴隆.dst',
		machineEventValue:'停机'
	}]
},

//2.更新机器
'/machine/updateMachineByMachineId/1':{
	code: '0',
	msg: '更新机器成功'
},

//3.删除机器
'/machine/deleteMachineByMachineId/1':{
	code: '0',
	msg: '删除机器成功'
},

//4.机器故障列表查询
'/machineEvent/getMachineFaultList/1':{
	code: '0',
	msg: '机器故障列表查询成功',
	data:[{
		id:'1',
		machineMac: '00-01-6C-06-A6-29',
		name:'1号机器',
		machineMac: '00-01-6C-06-A6-29',
		model:'X6',
		ip:'192.168.6.88',
		workshop:'一车间',
		faultType:'1',
		faultNumber:'2',
		updateTime:'2018年2月27日'
	},{
		id: '2',
		machineMac: '00-01-6C-06-A6-29',
		name:'1号机器',
		machineMac: '00-01-6C-06-A6-29',
		model:'X6',
		ip: '192.168.6.88',
		workshop:'一车间',
		faultType:'2',
		faultNumber:'1',
		updateTime:'2018年2月27日'
	}]
},

//5.机器故障详情查询
'/machineEvent/getMachineFaultDetail/1':{
	code: '0',
	msg: '机器故障详情查询成功',
	data: {
		id: '1',
		name: '1号机器',
		machineMac: '00-01-6C-06-A6-29',
		model: 'X6',
		ip: '192.168.8.68',
		workshop: '一车间',
		faultType: '2',
		createTime: '2018年2月27日'
	}
},

//6.机器预警列表查询
'/machineEvent/getMachineAlertList/1':{
	code: '0',
	msg: '机器预警列表查询成功',
	data: [{
		id: '1',
		alertType: '2',
		alertCondition: '5',
		workerName: 'Amanda',
		workerPhone: '132-7890-1234'
	},{
		id: '2',
		alertType: '1',
		alertCondition: '5',
		workerName: 'Bella',
		workerPhone: '132-1234-5678'
	}]
},

//7.新增机器预警
'/machineEvent/getMachineAlertList/1':{
	code: '0',
	msg: '新增机器预警成功'
},

//8.修改机器预警
'/machineEvent/getMachineAlertList/1':{
	code: '0',
	msg: '修改机器预警成功'
},

//9.删除机器预警
'/machineEvent/getMachineAlertList/1':{
	code: '0',
	msg: '删除机器预警成功'
},

//十一、员工管理
//1.员工列表查询
'/worker/getWorkerList/1':{
	code: '0',
	msg: '员工列表查询成功',
	data:[{
		id:'1',
		number: '1001',
		name:'张三',
		phone: '158-1234-5678',
		gender: '男',
		'线别/组别': '一组',
		remark:'无'
	},{
		id:'2',
		number: '1002',
		name: '李四',
		phone: '158-8765-4321',
		gender: '女',
		'线别/组别': '二组',
		remark:'无'
	}]
},

//2.新增员工
'/worker/addWorker/1':{
	code: '0',
	msg: '新增员工成功'
},

//3.更新员工
'/worker/updateWorkerByWorkerId/1':{
	code: '0',
	msg: '更新员工成功'
},

//4.删除员工
'/worker/deleteWorkerByWorkerId/1':{
	code: '0',
	msg: '删除员工成功'
},

// Taakey: 大豪网络-测试数据 end...

  'GET /api/project/notice': getNotice,
  'GET /api/activities': getActivities,
  'GET /api/rule': getRule,
  'POST /api/rule': {
    $params: {
      pageSize: {
        desc: '分页',
        exp: 2,
      },
    },
    $body: postRule,
  },
  'POST /api/forms': (req, res) => {
    res.send({ message: 'Ok' });
  },
  'GET /api/tags': mockjs.mock({
    'list|100': [{ name: '@city', 'value|1-100': 150, 'type|0-2': 1 }]
  }),
  'GET /api/fake_list': getFakeList,
  'GET /api/fake_chart_data': getFakeChartData,
  'GET /api/profile/basic': getProfileBasicData,
  'GET /api/profile/advanced': getProfileAdvancedData,
  'POST /api/login/account': (req, res) => {
    const { password, userName, type } = req.body;
    if(password === '888888' && userName === 'admin'){
      res.send({
        status: 'ok',
        type,
        currentAuthority: 'admin'
      });
      return ;
    }
    if(password === '123456' && userName === 'user'){
      res.send({
        status: 'ok',
        type,
        currentAuthority: 'user'
      });
      return ;
    }
    res.send({
      status: 'error',
      type,
      currentAuthority: 'guest'
    });
  },
  'POST /api/register': (req, res) => {
    res.send({ status: 'ok', currentAuthority: 'user' });
  },
  'GET /api/notices': getNotices,
  'GET /api/500': (req, res) => {
    res.status(500).send({
      "timestamp": 1513932555104,
      "status": 500,
      "error": "error",
      "message": "error",
      "path": "/base/category/list"
    });
  },
  'GET /api/404': (req, res) => {
    res.status(404).send({
      "timestamp": 1513932643431,
      "status": 404,
      "error": "Not Found",
      "message": "No message available",
      "path": "/base/category/list/2121212"
    });
  },
  'GET /api/403': (req, res) => {
    res.status(403).send({
      "timestamp": 1513932555104,
      "status": 403,
      "error": "Unauthorized",
      "message": "Unauthorized",
      "path": "/base/category/list"
    });
  },
  'GET /api/401': (req, res) => {
    res.status(401).send({
      "timestamp": 1513932555104,
      "status": 401,
      "error": "Unauthorized",
      "message": "Unauthorized",
      "path": "/base/category/list"
    });
  },
};

export default noProxy ? {} : delay(proxy, 1000);

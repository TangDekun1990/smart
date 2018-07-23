import { createElement } from 'react';
import dynamic from 'dva/dynamic';
import pathToRegexp from 'path-to-regexp';
import { getMenuData } from './menu';

let routerDataCache;

const modelNotExisted = (app, model) => (
  // eslint-disable-next-line
  !app._models.some(({ namespace }) => {
    return namespace === model.substring(model.lastIndexOf('/') + 1);
  })
);

// wrapper of dynamic
const dynamicWrapper = (app, models, component) => {
  // () => require('module')
  // transformed by babel-plugin-dynamic-import-node-sync
  if (component.toString().indexOf('.then(') < 0) {
    models.forEach((model) => {
      if (modelNotExisted(app, model)) {
        // eslint-disable-next-line
        app.model(require(`../models/${model}`).default);
      }
    });
    return (props) => {
      if (!routerDataCache) {
        routerDataCache = getRouterData(app);
      }
      return createElement(component().default, {
        ...props,
        routerData: routerDataCache,
      });
    };
  }
  // () => import('module')
  return dynamic({
    app,
    models: () => models.filter(
      model => modelNotExisted(app, model)).map(m => import(`../models/${m}.js`)
    ),
    // add routerData prop
    component: () => {
      if (!routerDataCache) {
        routerDataCache = getRouterData(app);
      }
      return component().then((raw) => {
        const Component = raw.default || raw;
        return props => createElement(Component, {
          ...props,
          routerData: routerDataCache,
        });
      });
    },
  });
};

function getFlatMenuData(menus) {
  let keys = {};
  menus.forEach((item) => {
    if (item.children) {
      keys[item.path] = { ...item };
      keys = { ...keys, ...getFlatMenuData(item.children) };
    } else {
      keys[item.path] = { ...item };
    }
  });
  return keys;
}

export const getRouterData = (app) => {
  const routerConfig = {
    '/': {
      component: dynamicWrapper(app, ['user', 'login'], () => import('../layouts/BasicLayout')),
    },
     '/report/monitor': {     // 定义报表分析的路由 zyh
      component: dynamicWrapper(app, ['chart'], () => import('../routes/statement/DataMonitor')),
      },
      '/report/details': {  
       component: dynamicWrapper(app, ['chart'], () => import('../routes/statement/OrderDetails')),
       },
      '/report/statistics': {
      component: dynamicWrapper(app, ['chart'], () => import('../routes/statement/Output')),
      },
      '/report/report-group': {
      component: dynamicWrapper(app, ['chart'], () => import('../routes/statement/ReportGroup')),
      },
      '/report/report-worker': {
      component: dynamicWrapper(app, ['chart'], () => import('../routes/statement/ReportWorker')),
      },
      '/report/report-machine': {
      component: dynamicWrapper(app, ['chart'], () => import('../routes/statement/ReportMachine')),
      },
      '/report/breakdown': {
      component: dynamicWrapper(app, ['monitor'], () => import('../routes/statement/Breakdown')),
      },
      '/report/analysis': {
      component: dynamicWrapper(app, ['project', 'activities', 'chart'], () => import('../routes/statement/Analysis')),
      },
      // '/report/report4': {
      //   component: dynamicWrapper(app, ['project', 'activities', 'chart'], () => import('../routes/statement/Workplace')),
      // },
      '/order/list': { // 定义订单管理的路由 zyh
      component: dynamicWrapper(app, ['rule'], () => import('../routes/order/OrderList')),
      },
      '/order/new': {
      component: dynamicWrapper(app, ['form'], () => import('../routes/order/addOrder')),
      },
      '/order/new/info': {
      component: dynamicWrapper(app, ['form'], () => import('../routes/order/addOrder/Step1')),
      },
      '/order/new/machine': {
      component: dynamicWrapper(app, ['form'], () => import('../routes/order/addOrder/Step2')),
      },
      '/order/new/result': {
      component: dynamicWrapper(app, ['form'], () => import('../routes/order/addOrder/Step3')),
      },
      '/order/alert': {
      component: dynamicWrapper(app, ['form'], () => import('../routes/order/Warning')),
      },
      '/order/newWarn': {
      component: dynamicWrapper(app, ['form'], () => import('../routes/order/AddWarn')),
      },
      '/order/check': {
      component: dynamicWrapper(app, ['form'], () => import('../routes/order/OrderCheck')),
      },
      '/order/update': {
      component: dynamicWrapper(app, ['form'], () => import('../routes/order/OrderUpdate')),
      },
      '/order/updateWarn': {
      component: dynamicWrapper(app, ['form'], () => import('../routes/order/UpdateWarn')),
      },
      '/schedule/list': { // 定义排产管理路由zyh
      component: dynamicWrapper(app, ['form'], () => import('../routes/schedule/Schedule')),
      },
      '/schedule/new': {
      component: dynamicWrapper(app, ['form'], () => import('../routes/schedule/NewSchedule')),
      },
      '/schedule/alert': {
      component: dynamicWrapper(app, ['rule'], () => import('../routes/schedule/Warning')),
      },
      '/schedule/newWarn': {
      component: dynamicWrapper(app, ['form'], () => import('../routes/schedule/AddWarn')),
      },
      '/schedule/updateWarn': {
      component: dynamicWrapper(app, ['form'], () => import('../routes/schedule/UpdateWarn')),
      },
      '/ProductionControl/list': { // 定义下发生产指令路由zyh
      component: dynamicWrapper(app, ['list'], () => import('../routes/productionControl/ProductionList')),
      },
      '/ProductionControl/details': {
      component: dynamicWrapper(app, ['list'], () => import('../routes/productionControl/Details')),
      },
      '/ProductionControl/new': {
      component: dynamicWrapper(app, ['form'], () => import('../routes/productionControl/NewControl')),
      },
      '/ProductionControl/new/info': {
      component: dynamicWrapper(app, ['form'], () => import('../routes/productionControl/NewControl/Step1')),
      },
      '/ProductionControl/new/machine': {
      component: dynamicWrapper(app, ['form'], () => import('../routes/productionControl/NewControl/Step2')),
      },
      '/ProductionControl/new/check': {
      component: dynamicWrapper(app, ['form'], () => import('../routes/productionControl/NewControl/Step30')),
      },
      '/ProductionControl/new/result': {
      component: dynamicWrapper(app, ['form'], () => import('../routes/productionControl/NewControl/Step3')),
      },
      // '/ProductionControl/new': {
      //   component: dynamicWrapper(app, ['list'], () => import('../routes/List/CardList')),
      // },
      '/ProductionControl/alert': {
      component: dynamicWrapper(app, ['list'], () => import('../routes/productionControl/Warning')),
      },
      '/ProductionControl/newWarn': {
      component: dynamicWrapper(app, ['list'], () => import('../routes/productionControl/AddWarn')),
      },
      '/ProductionControl/updateWarn': {
      component: dynamicWrapper(app, ['list'], () => import('../routes/productionControl/UpdateWarn')),
      },
 //机器管理
 '/machines/sortList': {
  component: dynamicWrapper(app, ['profile'], () => import('../routes/machines/SortList')),
},
'/machines/machineList': {
  component: dynamicWrapper(app, ['profile'], () => import('../routes/machines/MachineList')),
},
'/machines/updateMachine': {
  component: dynamicWrapper(app, [], () => import('../routes/machines/UpdateMachine')),
},


//花样管理
'/design/list': {
  component: dynamicWrapper(app, ['list'], () => import('../routes/design/DesignList')),
},
'/design/updateDesign': {
  component: dynamicWrapper(app, ['list'], () => import('../routes/design/UpdateDesign')),
},
'/design/addDesign': {
  component: dynamicWrapper(app, ['list'], () => import('../routes/design/AddDesign')),
},
'/design/set':{
  component: dynamicWrapper(app, ['list'], () => import('../routes/design/Set')),
},
'/design/updateDesignSet':{
  component: dynamicWrapper(app, ['list'], () => import('../routes/design/UpdateDesignSet')),
},
'/design/addDesignSet':{
  component: dynamicWrapper(app, ['list'], () => import('../routes/design/AddDesignSet')),
},
      // 定义库存管理路由
      '/stocks/list': {
        component: dynamicWrapper(app, ['profile'], () => import('../routes/stocks/StocksList')),
      },
      '/stocks/new': {
        component: dynamicWrapper(app, ['profile'], () => import('../routes/stocks/AddStocks')),
      },
      '/stocks/alert': {
        component: dynamicWrapper(app, [], () => import('../routes/stocks/Warning')),
      },
      '/stocks/update': {
        component: dynamicWrapper(app, ['form'], () => import('../routes/stocks/UpdateStocks')),
      },
      '/stocks/alert': {
        component: dynamicWrapper(app, ['form'], () => import('../routes/stocks/Warning')),
        },
      '/stocks/newWarn': {
        component: dynamicWrapper(app, ['form'], () => import('../routes/stocks/AddWarn')),
        },
      '/stocks/updateWarn': {
        component: dynamicWrapper(app, ['form'], () => import('../routes/stocks/UpdateWarn')),
          },

    // 定义发货管理路由
    '/deliver/list': {
      component: dynamicWrapper(app, [], () => import('../routes/deliver/DeliverList')),
    },
    '/deliver/new': {
      component: dynamicWrapper(app, [], () => import('../routes/deliver/AddDeliver')),
    },
    '/deliver/update': {
      component: dynamicWrapper(app, [], () => import('../routes/deliver/UpdateDeliver')),
    },
    '/deliver/alert': {
      component: dynamicWrapper(app, [], () => import('../routes/deliver/Warning')),
    },
    '/deliver/alert': {
      component: dynamicWrapper(app, ['form'], () => import('../routes/deliver/Warning')),
      },
    '/deliver/newWarn': {
      component: dynamicWrapper(app, ['form'], () => import('../routes/deliver/AddWarn')),
      },
    '/deliver/updateWarn': {
      component: dynamicWrapper(app, ['form'], () => import('../routes/deliver/UpdateWarn')),
        },
    //定义收款管理路由
    '/receipt/list': {
      component: dynamicWrapper(app, [], () => import('../routes/receipt/ReceiptList')),
    },
    '/receipt/new': {
      component: dynamicWrapper(app, [], () => import('../routes/receipt/AddReceipt')),
    },
    '/receipt/update': {
      component: dynamicWrapper(app, [], () => import('../routes/receipt/UpdateReceipt')),
    },
    '/receipt/alert': {
      component: dynamicWrapper(app, [], () => import('../routes/receipt/Warning')),
    },
    '/receipt/newWarn': {
      component: dynamicWrapper(app, ['form'], () => import('../routes/receipt/AddWarn')),
      },
    '/receipt/updateWarn': {
      component: dynamicWrapper(app, ['form'], () => import('../routes/receipt/UpdateWarn')),
        },
    // 系统设置路由
    //客户管理
    '/setting/customer': {
      component: dynamicWrapper(app, [], () => import('../routes/customer/CustomerList')),
    },
    '/setting/addCustomer': {
      component: dynamicWrapper(app, [], () => import('../routes/customer/AddCustomer')),
    },
    '/setting/updateCustomer': {
      component: dynamicWrapper(app, [], () => import('../routes/customer/UpdateCustomer')),
    },
     //员工管理
    '/setting/worker': {
      component: dynamicWrapper(app, [], () => import('../routes/worker/WorkerList')),
    },
    '/setting/addWorker': {
      component: dynamicWrapper(app, [], () => import('../routes/worker/AddWorker')),
    },
    '/setting/updateWorker': {
      component: dynamicWrapper(app, [], () => import('../routes/worker/UpdateWorker')),
    },
      //角色管理
    '/set/role': {
      component: dynamicWrapper(app, [], () => import('../routes/role/RoleList')),
    },
    '/set/addRole': {
      component: dynamicWrapper(app, [], () => import('../routes/role/AddRole')),
    },
    '/set/updateRole': {
      component: dynamicWrapper(app, [], () => import('../routes/role/UpdateRole')),
    },
    '/set/tree': {
      component: dynamicWrapper(app, [], () => import('../routes/role/tree')),
    },
     //原材料管理
     '/set/material': {
      component: dynamicWrapper(app, [], () => import('../routes/material/MaterialList')),
    },
    '/set/addMaterial': {
      component: dynamicWrapper(app, [], () => import('../routes/material/AddMaterial')),
    },
    '/set/updateMaterial': {
      component: dynamicWrapper(app, [], () => import('../routes/material/UpdateMaterial')),
    },
     //班次管理
     '/setting/usershift': {
      component: dynamicWrapper(app, ['error'], () => import('../routes/usershift/UsershiftList')),
    },
    '/setting/updateUsershift': {
      component: dynamicWrapper(app, ['error'], () => import('../routes/usershift/UpdateUsershift')),
    },
    '/setting/addUsershift': {
      component: dynamicWrapper(app, ['error'], () => import('../routes/usershift/AddUsershift')),
    },



    // 登录,注册路由
    '/user': { // 登录
      component: dynamicWrapper(app, [], () => import('../layouts/UserLayout')),
    },
    '/user/login': {
      component: dynamicWrapper(app, ['login'], () => import('../routes/User/Login')),
    },
    '/user/register': {
      component: dynamicWrapper(app, ['register'], () => import('../routes/User/Register')),
    },
    '/user/register-result': {
      component: dynamicWrapper(app, [], () => import('../routes/User/RegisterResult')),
    },
  };
  // Get name from ./menu.js or just set it in the router data.
  const menuData = getFlatMenuData(getMenuData());

  // Route configuration data
  // eg. {name,authority ...routerConfig }
  const routerData = {};
  // The route matches the menu
  Object.keys(routerConfig).forEach((path) => {
    // Regular match item name
    // eg.  router /user/:id === /user/chen
    const pathRegexp = pathToRegexp(path);
    const menuKey = Object.keys(menuData).find(key => pathRegexp.test(`/${key}`));
    let menuItem = {};
    // If menuKey is not empty
    if (menuKey) {
      menuItem = menuData[menuKey];
    }
    let router = routerConfig[path];
    // If you need to configure complex parameter routing,
    // https://github.com/ant-design/ant-design-pro-site/blob/master/docs/router-and-nav.md#%E5%B8%A6%E5%8F%82%E6%95%B0%E7%9A%84%E8%B7%AF%E7%94%B1%E8%8F%9C%E5%8D%95
    // eg . /list/:type/user/info/:id
    router = {
      ...router,
      name: router.name || menuItem.name,
      authority: router.authority || menuItem.authority,
    };
    routerData[path] = router;
  });
  return routerData;
};

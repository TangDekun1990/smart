import { isUrl } from '../utils/utils';
// import './common.less';
const menuData = [
  {
    name: '数据分析',
    // icon:  <i class="icon anticon icon-dashboard"> </i>,   
    icon: 'dashboard',     
    path: 'report',
    children: [{
      name: '实时监控',
      path: 'monitor',
    }, {
      name: '总产量统计',
      path: 'statistics',
    },
    {
      name: '机器产量统计',
      path: 'report-machine',
    },
    // {
    //   name: '(暂停)组别产量统计',
    //   path: 'report-group',
    // },
    // //   {
    // // name: '(暂停)挡车工产量统计',
    // // path: 'report-worker',
    // // }
    // // ,
    // {
    //   name: '(暂停)故障统计',
    //   path: 'breakdown',
    // },
    // {
    //   name: '(暂停)质量分析',
    //   path: 'analysis',
    // }
  ],
  }, {
    name: '订单管理',
    // icon:  <i class="icon anticon icon-solution1"> </i>,  
    icon: 'solution',
    path: 'order',
    children: [{
      name: '订单列表',
      path: 'list',
    }, {
      name: '新增订单',
      path: 'new',
    },
    //  {
    // name: '预警配置',
    // path: 'alert',
    // }
    ],
  },

  {
    name: '生产指令',
    // icon:  <i class="icon anticon icon-flag"> </i>,  
    icon: 'flag',
    path: 'ProductionControl',
    children: [{
      name: '指令列表',
      path: 'list',
    }, {
      name: '新增指令',
      path: 'new',
    },
    // {
    // name: '预警配置',
    // path: 'alert',
    // }
    ],
  },
  {
    name: '机器管理',
    // icon:  <i class="icon anticon icon-database"> </i>, 
    icon: 'database',
    path: 'machines',
    children: [{
      name: '分组列表',
      path: 'sortList',
    }, {
      name: '机器列表',
      path: 'machineList',
    },
      //  {
      //   name: '预警配置',
      //   path: 'alert',
      // }
    ],
  },
  {
    name: '花样管理',
    // icon:  <i class="icon anticon icon-picture"> </i>, 
    icon: 'picture',
    path: 'design',
    children: [{
      name: '花样列表',
      path: 'list',
    }, {
      name: '花样类别',
      path: 'set',
    },

    ],
  },

// 改版，新增人员管理：客户管理，员工管理，班次管理三项


  {
    name: '人员管理',
    // icon:  <i class="icon anticon icon-team"> </i>, 
    icon: 'team',
    path: 'setting',
    children: [{
      name: '客户管理',
      path: 'customer',
    },
      {
        name: '员工管理',
        path: 'worker',
      },
      {
        name: '班次管理',
        path: 'usershift',
      }],
  }
// Taakey: 原始系统的模块代码 begin...
  ,

  // {
  //   name: '系统配置',
  //   icon: 'setting',
  //   path: 'set',
  //   children: [
  //     {
  //       name: '原材料管理',
  //       path: 'material',
  //     },
  //     {
  //       name: '用户权限',
  //       path: 'role',
  //     },
  //   ],
  // },
  // {
  //   name: '排产管理',
  //   icon: 'schedule',
  //   path: 'schedule',
  //   children: [{
  //     name: '智能排产',
  //     path: 'list',
  //     // },
  //     /* {
  //     name: '新增排产(后续功能)',
  //     path: 'new',
  //     }, */
  //     // {
  //     // name: '预警配置',
  //     // path: 'alert',
  //   }]
  // },
  // {
  //   name: '库存管理',
  //   icon: 'save',
  //   path: 'stocks',
  //   children: [{
  //     name: '库存列表',
  //     path: 'list',
  //   }, {
  //     name: '新增库存',
  //     path: 'new',
  //   },
  //     // {
  //     //   name: '预警配置',
  //     //   path: 'alert',
  //     // }
  //   ],
  // },
  // {
  //   name: '发货管理',
  //   icon: 'rocket',
  //   path: 'deliver',
  //   children: [{
  //     name: '发货列表',
  //     path: 'list',
  //   }, {
  //     name: '新增发货',
  //     path: 'new',
  //   },
  //     // {
  //     //   name: '预警配置',
  //     //   path: 'alert',
  //     // }
  //   ],
  // },

  // {
  //   name: '收款管理',
  //   icon: 'red-envelope',
  //   path: 'receipt',
  //   children: [{
  //     name: '款项列表',
  //     path: 'list',
  //   }, {
  //     name: '新增收款',
  //     path: 'new',
  //   },
  //     //  {
  //     //   name: '预警配置',
  //     //   path: 'alert',
  //     // }
  //   ],
  // },


];

function formatter(data, parentPath = '', parentAuthority) {
  return data.map((item) => {
    let {path} = item;
    if (!isUrl(path)) {
      path = parentPath + item.path;
    }
    const result = {
      ...item,
      path,
      authority: item.authority || parentAuthority,
    };
    if (item.children) {
      result.children = formatter(item.children, `${parentPath}${item.path}/`, item.authority);
    }
    return result;
  });
}

export const getMenuData = () => formatter(menuData);

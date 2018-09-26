import Vue from 'vue'
import Router from 'vue-router'
const _import = require('./_import_' + process.env.NODE_ENV)
// in development-env not use lazy-loading, because lazy-loading too many pages will cause webpack hot update too slow. so only in production use lazy-loading;
// detail: https://panjiachen.github.io/vue-element-admin-site/#/lazy-loading

Vue.use(Router)

/* Layout */
import Layout from '../views/layout/Layout'

/**
* hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
* redirect: noredirect           if `redirect:noredirect` will no redirct in the breadcrumb
* name:'router-name'             the name is used by <keep-alive> (must set!!!)
* meta : {
    title: 'title'               the name show in submenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar,
  }
**/
export const constantRouterMap = [
  { path: '/login', name: '登录', component: _import('login/index'), hidden: true },
  { path: '/404', name: '404', component: _import('404'), hidden: true },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    hidden: true,
    children: [
      { path: 'dashboard', component: _import('dashboard/index'), name: '首页', meta: { title: '首页', icon: 'dashboard', noCache: true }},
      { path: 'upload', component: _import('admin/user/info'), name: '修改信息', meta: { title: '修改信息', icon: '', noCache: true }}]
  },
  {
    menuId: 1,
    path: '/admin',
    component: Layout,
    name: '员工管理1',
    hidden: true,
    redirect: '/admin/user',
    // icon: 'table',
    meta: {
      title: '员工管理',
      icon: 'user_mg'
    },
    children: [
      {
        path: 'user-detail/:id?/:state?',
        component: _import('admin/user/detail'),
        name: '员工详情页',
        meta: { title: '员工详情', icon: '', noCache: true },
        hidden: true
      }
    ]
  },
  {
    menuId: 59,
    path: '/client',
    component: Layout,
    name: '客户管理1',
    hidden: true,
    redirect: '/client/potential',
    // icon: 'table',
    meta: {
      title: '客户管理',
      icon: 'client'
    },
    children: [
      {
        path: 'detail/:id/:isView',
        component: _import('client/customer/detail'),
        name: '编辑客户详情页',
        meta: { title: '编辑客户详情', icon: '', noCache: true },
        hidden: true
      },
      {
        path: 'readDetail/:id/:isView',
        component: _import('client/customer/readOnlyDetail'),
        name: '客户详情页',
        meta: { title: '查看客户详情', icon: '', noCache: true },
        hidden: true
      },
      {
        path: 'realnameDetail/:id',
        component: _import('client/realname/detail'),
        name: '实名认证审核详情页',
        meta: { title: '实名认证审核信息', icon: '', noCache: true },
        hidden: true
      },
      {
        path: 'investorDetail/:id/:type/:isView',
        component: _import('client/investor/detail'),
        name: '投资者审核详情页',
        meta: { title: '投资者审核信息', icon: '', noCache: true },
        hidden: true
      },
      { path: 'customerLabel/list/:clientLabelId',
        component: _import('client/customerLabel/list'),
        name: '客户标签列表',
        meta: { title: '客户标签设置', icon: 'label' }
      }
    ]
  },
  {
    menuId: 48,
    path: '/product',
    component: Layout,
    name: '产品管理1',
    hidden: true,
    redirect: '/product/productList',
    // icon: 'table',
    meta: {
      title: '产品管理',
      icon: 'product_mg'
    },
    children: [
      {
        path: 'productDetail/:id',
        component: _import('product/product/detail'),
        name: '产品详情页',
        meta: { title: '产品详情', icon: '', noCache: true },
        hidden: true
      },
      {
        path: 'productDetail',
        component: _import('product/product/detail'),
        name: '产品新建页',
        meta: { title: '产品详情', icon: '', noCache: true },
        hidden: true
      }
    ]
  },
  {
    menuId: 92,
    path: '/transcMag',
    component: Layout,
    name: '交易管理1',
    redirect: '/transcMag/transc',
    hidden: true,
    // icon: 'table',
    meta: {
      title: '交易管理',
      icon: 'product_mg'
    },
    children: [
      {
        path: 'transc/detail/:appointmentId/:orderStatus/:status',
        component: _import('transcMag/transaction/detail'),
        name: '订单详情',
        meta: { title: '订单详情', icon: '', noCache: true },
        hidden: true
      }
    ]
  },
  {
    menuId: 282,
    path: '/achievement',
    component: Layout,
    name: '业绩/佣金管理1',
    hidden: true,
    redirect: '/achievement/perform',
    meta: {
      title: '业绩/佣金管理',
      icon: 'product_mg'
    },
    children: [
      {
        path: 'importExcel',
        component: _import('achievement/performanceIndicator/importExcel'),
        name: '业绩指标导入',
        meta: { title: '业绩指标导入', icon: '', noCache: true },
        hidden: true
      },
      {
        path: 'importBalancedExcel',
        component: _import('achievement/balanced/importExcel'),
        name: '平衡计分卡导入',
        meta: { title: '平衡计分卡导入', icon: '', noCache: true },
        hidden: true
      },
      {
        path: 'importListExcel',
        component: _import('achievement/commissionList/importExcel'),
        name: '佣金列表导入',
        meta: { title: '佣金列表导入', icon: '', noCache: true },
        hidden: true
      },
      {
        path: 'importSaleSupportExcel',
        component: _import('achievement/saleSupport/importExcel'),
        name: '销售支持列表导入',
        meta: { title: '销售支持列表导入', icon: '', noCache: true },
        hidden: true
      }
    ]
  },
  {
    menuId: 4,
    path: '/setting',
    component: Layout,
    name: '设置管理1',
    redirect: '/setting/currency',
    hidden: true,
    // icon: 'table',
    meta: {
      title: '设置管理',
      icon: 'setting'
    },
    children:[
      {
        path: 'currency/detail/:name/:id',
        component: _import('admin/setting/detail'),
        name: '币种详情',
        meta: { title: '币种详情', icon: '', noCache: true },
        hidden: true
      }
    ]
  },
  {
    menuId: 280,
    path: '/market',
    component: Layout,
    name: '市场活动管理详情',
    redirect: '/market/eventsList',
    hidden: true,
    children:[
      {
        path: 'eventsList/add',
        component: _import('market/eventsList/detail'),
        name: '市场活动添加',
        meta: { title: '市场活动添加', icon: '', noCache: true },
        hidden: true
      },
      {
        path: 'eventsList/view',
        component: _import('market/eventsList/detail'),
        name: '市场活动查看',
        meta: { title: '市场活动查看', icon: '', noCache: true },
        hidden: true
      },
      {
        path: 'eventsList/edit',
        component: _import('market/eventsList/detail'),
        name: '市场活动编辑',
        meta: { title: '市场活动编辑', icon: '', noCache: true },
        hidden: true
      }
    ]
  }
]

export default new Router({
  // mode: 'history', // 后端支持可开
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})

export const asyncRouterMap = [
  {
    menuId: 1,
    path: '/admin',
    component: Layout,
    name: '员工管理',
    hidden: false,
    redirect: '/admin/user',
    // icon: 'table',
    meta: {
      title: '员工管理',
      icon: 'user_mg'
    },
    children: [
      { menuId: 5, path: 'user', component: _import('admin/user/index'), name: '用户管理', meta: { title: '用户管理', icon: 'user2' }},
      { menuId: 7, path: 'role', component: _import('admin/role/index'), name: '角色管理', meta: { title: '角色管理', icon: 'role' }},
      { menuId: 43, path: 'posi', component: _import('admin/posi/index'), name: '职位管理', meta: { title: '职位管理', icon: 'position' }},
      { menuId: 299, path: 'rank', component: _import('admin/rank/index'), name: '职级管理', meta: { title: '职级管理', icon: 'position' }},
      { menuId: 10, path: 'dept', component: _import('admin/dept/index'), name: '部门管理', meta: { title: '部门管理', icon: 'dept' }},
      { menuId: 11, path: 'subsidiary', component: _import('admin/subsidiary/index'), name: '子公司管理', meta: { title: '子公司管理', icon: 'dept' }},
      { menuId: 2, path: 'uploadUser', component: _import('admin/user/uploadExcel'), name: '用户批量导入', meta: { title: '用户批量导入', icon: 'upload' }}
    ]
  },
  {
    menuId: 59,
    path: '/client',
    component: Layout,
    name: '客户管理',
    hidden: false,
    redirect: '/client/potential',
    // icon: 'table',
    meta: {
      title: '客户管理',
      icon: 'client'
    },
    children: [
      { menuId: 60, path: 'potential', component: _import('client/potential/index'), name: '潜客列表', meta: { title: '潜客列表', icon: 'potential' }},
      { menuId: 61, path: 'customer', component: _import('client/customer/index'), name: '客户列表', meta: { title: '客户列表', icon: 'customer' }},
      { menuId: 68, path: 'realname', component: _import('client/realname/index'), name: '实名认证审核', meta: { title: '实名认证审核', icon: 'realname' }},
      { menuId: 74, path: 'investor', component: _import('client/investor/index'), name: '普通投资者审核', meta: { title: '普通投资者审核', icon: 'investor' }},
      { menuId: 78, path: 'professionalInvestor', component: _import('client/professionalInvestor/index'), name: '专业投资者审核', meta: { title: '专业投资者审核', icon: 'professionalInvestor' }},
      { menuId: 82, path: 'allocated', component: _import('client/allocated/index'), name: '待分配客户', meta: { title: '待分配客户', icon: 'allocated' }},
      { menuId: 70, path: 'certFile', component: _import('client/certFile/index'), name: '认证资料管理', meta: { title: '认证资料管理', icon: 'certFile' }},
      { menuId: 324, path: 'customerLabel', component: _import('client/customerLabel/index'), name: '客户标签设置', meta: { title: '客户标签设置', icon: 'label' }},
      { menuId: 25, path: 'customerBatch', component: _import('client/batch/index'), name: '客户导入', meta: { title: '客户导入', icon: 'upload' }},
      { menuId: 347, path: 'customerBuyPdBatch', component: _import('client/pdbatch/index'), name: '已购买导入', meta: { title: '已购买导入', icon: 'upload' }},
    ]
  },
  {
    menuId: 48,
    path: '/product',
    component: Layout,
    name: '产品管理',
    hidden: false,
    redirect: '/product/productList',
    // icon: 'table',
    meta: {
      title: '产品管理',
      icon: 'product_mg'
    },
    children: [
      { menuId: 133, path: 'productList', component: _import('product/product/list'), name: '产品列表', meta: { title: '产品列表', icon: 'product' }},
      { menuId: 50, path: 'detail', component: _import('product/product/detail'), name: '产品新增', meta: { title: '产品新增', icon: 'createpro' }},
      { menuId: 138, path: 'building', component: _import('product/buildingProduct/index'), name: '在建列表', meta: { title: '在建列表', icon: 'product' }},
      { menuId: 135, path: 'preheating', component: _import('product/preheatingProduct/index'), name: '预热列表', meta: { title: '预热列表', icon: 'preheating' }},
      { menuId: 136, path: 'collecting', component: _import('product/collecting/index'), name: '募集中列表', meta: { title: '募集中列表', icon: 'collecting' }},
      { menuId: 137, path: 'shutDown', component: _import('product/shutDown/index'), name: '已关账列表', meta: { title: '已关账列表', icon: 'close' }},
      { menuId: 138, path: 'established', component: _import('product/established/index'), name: '已成立列表', meta: { title: '已成立列表', icon: 'establish' }},
      { menuId: 139, path: 'cashing', component: _import('product/cashing/index'), name: '兑付中列表', meta: { title: '兑付中列表', icon: 'shutDown' }},
      { menuId: 140, path: 'payCompletion', component: _import('product/payCompletion/index'), name: '兑付完成列表', meta: { title: '兑付完成列表', icon: 'shutDown' }},
      { menuId: 144, path: 'material', component: _import('product/materialManagement/index'), name: '材料管理', meta: { title: '材料管理', icon: 'file' }},
      { menuId: 348, path: 'productBatch', component: _import('product/batch/index'), name: '批量导入', meta: { title: '批量导入', icon: 'product' }},
      { menuId: 49, path: 'productType', component: _import('product/type'), name: '产品类型', meta: { title: '产品类型', icon: 'productType' }},
    ]
  },
  {
    menuId: 92,
    path: '/transcMag',
    component: Layout,
    name: '交易管理',
    hidden: false,
    redirect: '/transcMag/transc',
    // icon: 'table',
    meta: {
      title: '交易管理',
      icon: 'product_mg'
    },
    children: [
      { menuId: 93, path: 'transc', component: _import('transcMag/transaction/index'), name: '交易列表', meta: { title: '交易列表', icon: 'product' }},
      { menuId: 94, path: 'appoint', component: _import('transcMag/appointment/index'), name: '预约列表', meta: { title: '预约列表', icon: 'product' }},
      { menuId: 95, path: 'payment', component: _import('transcMag/payment/index'), name: '打款列表', meta: { title: '打款列表', icon: 'product' }},
      { menuId: 96, path: 'refund', component: _import('transcMag/refund/index'), name: '退款列表', meta: { title: '退款列表', icon: 'productType' }},
      { menuId: 97, path: 'contract', component: _import('transcMag/contract/index'), name: '合同管理', meta: { title: '合同管理', icon: 'productType' }},
      { menuId: 128, path: 'result', component: _import('transcMag/result/index'), name: '审核原因管理', meta: { title: '审核原因管理', icon: 'productType' }},
    ]
  },
  {
    menuId: 282,
    path: '/achievement',
    component: Layout,
    name: '业绩/佣金管理',
    hidden: false,
    redirect: '/achievement/perform',
    // icon: 'table',
    meta: {
      title: '业绩/佣金管理',
      icon: 'pf'
    },
    children: [
      { menuId: 314, path: 'perform', component: _import('achievement/performanceIndicator/index'), name: '业绩指标列表', meta: { title: '业绩指标列表', icon: 'pfIndi' }},
      { menuId: 287, path: 'balanced', component: _import('achievement/balanced/index'), name: '平衡计分卡', meta: { title: '平衡计分卡', icon: 'pfBn' }},
      { menuId: 48, path: 'commissionList', component: _import('achievement/commissionList/index'), name: '佣金列表', meta: { title: '佣金列表', icon: 'pfCm' }},
      { menuId: 48, path: 'commCalc', component: _import('achievement/commissionCalc/index'), name: '佣金计算模版', meta: { title: '佣金计算模版', icon: 'pfCmcalc' }},
      { menuId: 283, path: 'probation', component: _import('achievement/performanceIndicator/probation'), name: '试用期业绩标准', meta: { title: '试用期业绩标准', icon: 'pfBn' }},
      { menuId: 291, path: 'saleSupport', component: _import('achievement/saleSupport/index'), name: '销售支持', meta: { title: '销售支持', icon: 'pfSale' }}
    ]
  },
  {
    menuId: 280,
    path: '/market',
    component: Layout,
    name: '市场活动管理',
    hidden: false,
    redirect: '/market/eventsList',
    // icon: 'table',
    meta: {
      title: '市场活动管理',
      icon: 'market'
    },
    children: [
      { menuId: 314, path: 'eventsList', component: _import('market/eventsList/index'), name: '市场活动列表', meta: { title: '市场活动列表', icon: 'eventsList' }},
      { menuId: 314, path: 'customerPool', component: _import('market/customerPool/index'), name: '市场部客户池', meta: { title: '市场部客户池', icon: 'customerPool' }},
      { menuId: 314, path: 'setting', component: _import('market/setting/index'), name: '活动相关设置', meta: { title: '活动相关设置', icon: 'activitySetting' }}
    ]
  },
  {
    menuId: 4,
    path: '/setting',
    component: Layout,
    name: '设置管理',
    redirect: '/setting/currency',
    hidden: false,
    // icon: 'table',
    meta: {
      title: '设置管理',
      icon: 'setting'
    },
    children: [
      { menuId: 38, path: 'currency', component: _import('admin/setting/currency'), name: '币种管理', meta: { title: '币种管理', icon: 'currency' }},
      { menuId: 349, path: 'asset', component: _import('admin/asset/index'), name: '资产规模设置', meta: { title: '资产规模设置', icon: 'currency' }},
      { menuId: 332, path: 'cooling', component: _import('admin/cooling/index'), name: '冷静期时间', meta: { title: '冷静期时间', icon: 'currency' }},
      { menuId: 9, path: 'dict', component: _import('admin/dict/index'), name: '字典管理', meta: { title: '字典管理', icon: 'dict' }},
      { menuId: 8, path: 'log', component: _import('admin/log/index'), name: '日志管理', meta: { title: '日志管理', icon: 'log' }},
      { menuId: 330, path: 'complaint', component: _import('admin/complaint/index'), name: '投诉电话', meta: { title: '投诉电话', icon: 'log' }},
      { menuId: 6, path: 'menu', component: _import('admin/menu/index'), name: '菜单管理', meta: { title: '菜单管理', icon: 'tree' }}
    ]
  },
  {
    menuId: 2,
    path: '/monitor',
    component: Layout,
    name: '系统监控',
    redirect: '/monitor/service',
    hidden: false,
    // icon: 'table',
    meta: {
      title: '系统监控',
      icon: 'monitor'
    },
    children: [
      { menuId: 11, path: 'service', component: _import('admin/monitor/service'), name: '服务状态', meta: { title: '服务状态', icon: 'service' }},
      { menuId: 12, path: 'zipkin', component: _import('admin/monitor/zipkin'), name: 'zipkin监控', meta: { title: 'zipkin监控', icon: 'zipkin' }},
      { menuId: 13, path: 'pinpoint', component: _import('admin/monitor/pinpoint'), name: 'pinpoint监控', meta: { title: 'pinpoint监控', icon: 'pinpoint' }},
      { menuId: 14, path: 'cache', component: _import('admin/monitor/cache'), name: '缓存状态', meta: { title: '缓存状态', icon: 'cache' }},
      { menuId: 15, path: 'elk', component: _import('admin/monitor/elk'), name: 'ELK状态', meta: { title: 'ELK状态', icon: 'elk' }},
      { menuId: 16, path: 'swagger', component: _import('admin/monitor/swagger'), name: '接口文档', meta: { title: '接口文档', icon: 'swagger' }},
      { menuId: 17, path: 'daemon', component: _import('admin/monitor/daemon'), name: '任务监控', meta: { title: '任务监控', icon: 'daemon' }},
      { menuId: 17, path: 'app', component: _import('admin/monitor/app'), name: 'app监控', meta: { title: 'app监控', icon: 'daemon' }}
    ]
  }
]

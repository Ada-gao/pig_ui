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
    menuId: 19,
    path: '/client',
    component: Layout,
    name: '客户管理',
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
      }
    ]
  },
  {
    menuId: 3,
    path: '/product',
    component: Layout,
    name: '产品管理',
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
        component: _import('product/detail'),
        name: '产品详情页',
        meta: { title: '产品详情', icon: '', noCache: true },
        hidden: true
      },
      { 
        path: 'productDetail',
        component: _import('product/detail'),
        name: '产品新建页',
        meta: { title: '产品详情', icon: '', noCache: true },
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
      { menuId: 10, path: 'dept', component: _import('admin/dept/index'), name: '部门管理', meta: { title: '部门管理', icon: 'dept' }},
      { menuId: 2, path: 'uploadUser', component: _import('admin/user/uploadExcel'), name: '用户批量导入', meta: { title: '用户批量导入', icon: 'upload' }}
    ]
  },
  {
    menuId: 19,
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
      { menuId: 19, path: 'potential', component: _import('client/potential/index'), name: '潜客列表', meta: { title: '潜客列表', icon: 'potential' }},
      { menuId: 20, path: 'customer', component: _import('client/customer/index'), name: '客户列表', meta: { title: '客户列表', icon: 'customer' }},
      { menuId: 25, path: 'realname', component: _import('client/realname/index'), name: '实名认证审核', meta: { title: '实名认证审核', icon: 'realname' }},
      { menuId: 22, path: 'investor', component: _import('client/investor/index'), name: '普通投资者审核', meta: { title: '普通投资者审核', icon: 'investor' }},
      { menuId: 22, path: 'professionalInvestor', component: _import('client/professionalInvestor/index'), name: '专业投资者审核', meta: { title: '专业投资者审核', icon: 'professionalInvestor' }},
      { menuId: 23, path: 'allocated', component: _import('client/allocated/index'), name: '待分配客户', meta: { title: '待分配客户', icon: 'allocated' }},
      { menuId: 24, path: 'certFile', component: _import('client/certFile/index'), name: '认证资料管理', meta: { title: '认证资料管理', icon: 'certFile' }},
      // { menuId: 22, path: 'detail/:id', component: _import('client/customer/detail'), name: '客户详情', meta: { title: '客户详情', icon: 'user' }},
      // { menuId: 20, path: 'potential', component: _import('client/potential/index'), name: '实名认证审核', meta: { title: '实名认证审核', icon: 'user' }},
      // { menuId: 20, path: 'potential', component: _import('client/potential/index'), name: '普通投资者审核', meta: { title: '普通投资者审核', icon: 'user' }},
      // { menuId: 20, path: 'potential', component: _import('client/potential/index'), name: '专业投资者审核', meta: { title: '专业投资者审核', icon: 'user' }},
      // { menuId: 18, path: 'potential', component: _import('client/potential/index'), name: '待分配顾问', meta: { title: '待分配顾问', icon: 'user' }},
      // { menuId: 18, path: 'potential', component: _import('client/potential/index'), name: '客户异动分配', meta: { title: '客户异动分配', icon: 'user' }},
      // { menuId: 18, path: 'potential', component: _import('client/potential/index'), name: '认证资料管理', meta: { title: '认证资料管理', icon: 'user' }}
    ]
  },
  {
    menuId: 3,
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
      { menuId: 48, path: 'productList', component: _import('product/list'), name: '产品列表', meta: { title: '产品列表', icon: 'product' }},
      { menuId: 49, path: 'productType', component: _import('product/type'), name: '产品类型', meta: { title: '产品类型', icon: 'productType' }},
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
      { menuId: 9, path: 'dict', component: _import('admin/dict/index'), name: '字典管理', meta: { title: '字典管理', icon: 'dict' }},
      { menuId: 8, path: 'log', component: _import('admin/log/index'), name: '日志管理', meta: { title: '日志管理', icon: 'log' }},
      { menuId: 6, path: 'menu', component: _import('admin/menu/index'), name: '菜单管理', meta: { title: '菜单管理', icon: 'tree' }},
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


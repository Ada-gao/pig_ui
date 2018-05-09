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
    name: '系统管理',
    hidden: false,
    redirect: '/admin/user',
    // icon: 'table',
    meta: {
      title: '系统管理',
      icon: 'table'
    },
    children: [
      { menuId: 2, path: 'user', component: _import('admin/user/index'), name: '用户管理', meta: { title: '用户管理', icon: 'user' }},
      { menuId: 3, path: 'menu', component: _import('admin/menu/index'), name: '菜单管理', meta: { title: '菜单管理', icon: 'tree' }},
      { menuId: 4, path: 'role', component: _import('admin/role/index'), name: '角色管理', meta: { title: '角色管理', icon: 'role' }},
      { menuId: 81, path: 'posi', component: _import('admin/posi/index'), name: '职位管理', meta: { title: '职位管理', icon: 'log' }},
      { menuId: 5, path: 'dept', component: _import('admin/dept/index'), name: '部门管理', meta: { title: '部门管理', icon: 'dept' }},
      { menuId: 6, path: 'dict', component: _import('admin/dict/index'), name: '字典管理', meta: { title: '字典管理', icon: 'dict' }},
      { menuId: 7, path: 'log', component: _import('admin/log/index'), name: '日志管理', meta: { title: '日志管理', icon: 'log' }},
    ]
  },
  {
    menuId: 83,
    path: '/admin',
    component: Layout,
    name: '产品管理',
    hidden: false,
    redirect: '/admin/product',
    // icon: 'table',
    meta: {
      title: '产品管理',
      icon: 'table'
    },
    children: [
      { menuId: 831, path: 'product/list', component: _import('admin/product/list'), name: '产品管理', meta: { title: '产品管理', icon: 'user' }},
      // { menuId: 832, path: 'product/add/0', component: _import('admin/product/add'), name: '产品新增', meta: { title: '产品新增', icon: 'user' }},
      // { menuId: 833, path: 'product/add/1', component: _import('admin/product/add'), name: '产品修改', meta: { title: '产品修改', icon: 'user' }},
      { menuId: 80, path: 'product/type', component: _import('admin/product/type'), name: '产品类型', meta: { title: '产品类型', icon: 'user' }},
    ]
  },
  {
    menuId: 8,
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
      { menuId: 9, path: 'service', component: _import('admin/monitor/service'), name: '服务状态', meta: { title: '服务状态', icon: 'service' }},
      { menuId: 10, path: 'zipkin', component: _import('admin/monitor/zipkin'), name: 'zipkin监控', meta: { title: 'zipkin监控', icon: 'zipkin' }},
      { menuId: 11, path: 'pinpoint', component: _import('admin/monitor/pinpoint'), name: 'pinpoint监控', meta: { title: 'pinpoint监控', icon: 'pinpoint' }},
      { menuId: 12, path: 'cache', component: _import('admin/monitor/cache'), name: '缓存状态', meta: { title: '缓存状态', icon: 'cache' }},
      { menuId: 13, path: 'elk', component: _import('admin/monitor/elk'), name: 'ELK状态', meta: { title: 'ELK状态', icon: 'elk' }},
      { menuId: 14, path: 'swagger', component: _import('admin/monitor/swagger'), name: '接口文档', meta: { title: '接口文档', icon: 'swagger' }},
      { menuId: 15, path: 'daemon', component: _import('admin/monitor/daemon'), name: '任务监控', meta: { title: '任务监控', icon: 'daemon' }}
    ]
  },
  {
    menuId: 8,
    path: '/setting',
    component: Layout,
    name: '设置管理',
    redirect: '/setting/currency',
    hidden: false,
    // icon: 'table',
    meta: {
      title: '设置管理',
      icon: 'table'
    },
    children: [
      { menuId: 9, path: 'currency', component: _import('admin/setting/currency'), name: '币种管理', meta: { title: '币种管理', icon: 'service' }},
    ]
  }
  // {
  //   menuId: 19,
  //   path: '/admin',
  //   component: Layout,
  //   name: '客户列表',
  //   hidden: false,
  //   redirect: '/admin/user',
  //   // icon: 'table',
  //   meta: {
  //     title: '客户列表',
  //     icon: 'table'
  //   },
  //   children: [
  //     { menuId: 17, path: 'user', component: _import('admin/user/index'), name: '新增客户', meta: { title: '新增客户', icon: 'user' }},
  //     { menuId: 18, path: 'user', component: _import('admin/user/index'), name: '待分配咨询顾问', meta: { title: '待分配咨询顾问', icon: 'user' }},
  //     { menuId: 19, path: 'user', component: _import('admin/user/index'), name: '潜客列表', meta: { title: '潜客列表', icon: 'user' }},
  //     { menuId: 20, path: 'user', component: _import('admin/user/index'), name: '认证审核', meta: { title: '认证审核', icon: 'user' }},
  //   ]
  // }
]


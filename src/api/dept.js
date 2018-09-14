import request from '@/utils/request'

export function fetchTree(query) {
  return request({
    url: '/admin/dept/tree',
    method: 'get',
    params: query
  })
}

export function addObj(obj) {
  return request({
    url: '/admin/dept/',
    method: 'post',
    data: obj
  })
}

export function getObj(id) {
  return request({
    url: '/admin/dept/' + id,
    method: 'get'
  })
}

export function delObj(id) {
  return request({
    url: '/admin/dept/' + id,
    method: 'delete'
  })
}

export function putObj(obj) {
  return request({
    url: '/admin/dept/',
    method: 'put',
    data: obj
  })
}
//获取一级部门及子公司列表
export function getDeptRoots() {
  return request({
    url: '/admin/dept/roots',
    method: 'get'
  })
}
//更新一级部门及子公司列表
export function editDeptRoots(data) {
  return request({
    url: '/admin/dept/roots',
    method: 'post',
    data
  })
}
//获取指定部门的同级部门及其子部门
export function getBelongsDept(deptId) {
  return request({
    url: '/admin/dept/' + deptId + '/tree',
    method: 'get'
  })
}

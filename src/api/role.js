import request from '@/utils/request'

export function roleList() {
  return request({
    url: '/admin/role/roleList',
    method: 'get'
  })
}

export function fetchList(query) {
  return request({
    url: '/admin/role/rolePage',
    method: 'get',
    params: query
  })
}

export function deptRoleList(deptId) {
  return request({
    url: '/admin/role/roleList/' + deptId,
    method: 'get'
  })
}

export function getObj(id) {
  return request({
    url: '/admin/role/' + id,
    method: 'get'
  })
}

export function addObj(obj) {
  return request({
    url: '/admin/role/',
    method: 'post',
    data: obj
  })
}

export function putObj(obj) {
  return request({
    url: '/admin/role/',
    method: 'put',
    data: obj
  })
}

export function delObj(id) {
  return request({
    url: '/admin/role/' + id,
    method: 'delete'
  })
}

export function permissionUpd(roleId, menuIds) {
  return request({
    url: '/admin/role/roleMenuUpd',
    method: 'put',
    params: {
      roleId: roleId,
      menuIds: menuIds
    }
  })
}

export function fetchRoleTree(roleName) {
  return request({
    url: '/admin/menu/roleTree/' + roleName,
    method: 'get'
  })
}

export function fetchDeptTree(query) {
  return request({
    url: '/admin/dept/tree',
    method: 'get',
    params: query
  })
}

// 获取直属变更列表
export function getDirectChangeList(listQuery) {
  return request({
    url: '/admin/directlyAffiliatedChange/user/' + listQuery.userId + '?orderByField=create_time&isAsc=false&page=' + listQuery.page + '&limit=' + listQuery.limit,
    method: 'get'
  })
}
// 根据id查询直属变更列表
export function seeDirectChangeList(id) {
  return request({
    url: '/admin/directlyAffiliatedChange/'+id,
    method: 'get'
  })
}
// 新增/修改直属变更
export function addDirectChangeList(query) {
  return request({
    url: '/admin/directlyAffiliatedChange/',
    method: 'post',
    data: query
  })
}
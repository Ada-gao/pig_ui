import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/admin/user/userPage',
    method: 'get',
    params: query
  })
}

/**
 * 查询理财里列表（不分页）
 */
export function getPlannerList(query) {
  return request({
    url: '/admin/user/financialPlanners',
    method: 'get',
    params: query
  })
}

/**
 * 新增用户
 */
export function addObj(obj) {
  return request({
    url: '/admin/user/',
    method: 'post',
    data: obj
  })
}

export function getObj(id) {
  return request({
    url: '/admin/user/' + id,
    method: 'get'
  })
}

export function delObj(id) {
  return request({
    url: '/admin/user/' + id,
    method: 'delete'
  })
}

export function putObj(obj) {
  return request({
    url: '/admin/user',
    method: 'put',
    data: obj
  })
}


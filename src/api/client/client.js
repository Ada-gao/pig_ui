import request from '@/utils/request'

/**
 * 查询客户列表
 */
export function fetchList(query) {
  return request({
    url: '/client/client/',
    method: 'get',
    params: query
  })
}

/**
 * 新增用户
 */
export function addObj(obj) {
  return request({
    url: '/client/client/',
    method: 'post',
    data: obj
  })
}

/**
 * 查询客户详情
 */
export function getObj(clientId) {
  return request({
    url: '/client/client/' + clientId,
    method: 'get'
  })
}

export function delObj(id) {
  return request({
    url: '/client/client/' + id,
    method: 'delete'
  })
}

export function putObj(obj) {
  return request({
    url: '/client/client',
    method: 'put',
    data: obj
  })
}


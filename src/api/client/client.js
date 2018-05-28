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
 * 查询客户风险等级
 */
export function getClientStatus(clientId) {
  return request({
    url: '/client/client/status/' + clientId,
    method: 'get'
  })
}

/**
 * 查询客户备注
 */
export function getClientRemark(clientId) {
  return request({
    url: '/client/' + clientId + '/remark',
    method: 'get'
  })
}

/**
 * 查询客户理财师异动
 */
export function getClientPlanner(clientId) {
  return request({
    url: '/client/' + clientId + '/planner' ,
    method: 'get'
  })
}

/**
 * 查询客户银行卡信息
 */
export function getClientBankcard(clientId) {
  return request({
    url: '/client/bankcard/' + clientId ,
    method: 'get'
  })
}

/**
 * 查询客户已购买产品
 */
export function getClientProducts(clientId) {
  return request({
    url: '/client/' + clientId + '/products',
    method: 'get'
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
    method: 'get',
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


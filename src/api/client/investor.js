import request from '@/utils/request'

/**
 * 查询实名认证审核列表
 */
export function fetchList(query) {
  return request({
    url: '/client/client/',
    method: 'get',
    params: query
  })
}

/**
 * 查询实名认证审核详情
 * type: 1
 */
export function getObj(clientId, type) {
  return request({
    url: '/client/client/' + clientId,
    method: 'get',
    params: {
      type: type
    }
  })
}

/**
 * 查询客户银行卡信息
 */
export function getClientBankcard(clientId, type) {
  return request({
    url: '/client/bankcard/' + clientId ,
    method: 'get',
    params: {
      type: type
    }
  })
}

/**
 * 查询客户状态
 */
export function getClientStatus(clientId, type) {
  return request({
    url: '/client/client/status/' + clientId,
    method: 'get',
    params: {
      type: type
    }
  })
}

/**
 * 实名认证审核
 */
export function putObj(clientId, query) {
  return request({
    url: '/client/' + clientId + '/realname',
    method: 'put',
    data: query
  })
}


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
 * 查询投资者认证资料
 */
export function getCertInfo(clientId, type) {
  return request({
    url: '/client/' + clientId + '/certInfo',
    method: 'get',
    params: {
      type: type
    }
  })
}

/**
 * 查询用户审核历史
 */
export function getCertHistory(clientId, type) {
  return request({
    url: '/client/' + clientId + '/certHistory',
    method: 'get',
    params: {
      type: type
    }
  })
}

/**
 * 投资者认证审核
 */
export function putObj(clientId, query) {
  return request({
    url: '/client/' + clientId + '/investor',
    method: 'put',
    data: query
  })
}


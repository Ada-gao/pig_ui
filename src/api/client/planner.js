import request from '@/utils/request'

/**
 * 投资者认证审核
 */
export function putPlanner(clientId, query) {
  return request({
    url: '/client/' + clientId + '/planner',
    method: 'put',
    data: query
  })
}

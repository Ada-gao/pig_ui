import request from '@/utils/request'
/**
 * 分配理财师
 */
export function putPlanner(clientId, query) {
  return request({
    url: '/client/' + clientId + '/planner',
    method: 'put',
    data: query
  })
}
/**
 * 分配理财师
 */
export function batchPutPlanner(obj ,query) {
  return request({
    url: '/client/planner',
    method: 'put',
    params: obj,
    data: query
  })
}

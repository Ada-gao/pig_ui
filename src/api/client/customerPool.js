import request from '@/utils/request'

/**
 * 获取客户池列表
 */
export function getClientPoolList(query) {
  return request({
    url: '/client/client/pool',
    method: 'get',
     params: query
  })
}
/**
 * 批量分配部门
 */
export function allocationDepartment(params,data) {
  return request({
    url: '/client/client/dept',
    method: 'put',
    params,
    data
  })
}
/**
 * 批量分配理财师
 */
export function allocationPlanners(query) {
  return request({
    url: '/client/planner',
    method: 'put',
    data: query
  })
}

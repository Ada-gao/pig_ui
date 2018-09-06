import request from '@/utils/request'
/**
 * 查询活动信息列表(带分页查询)
 */
export function getActiveList(params) {
  return request({
    url: '/activity/activity',
    method: 'get',
    params
  })
}
/**
 * 新增活动信息
 */
export function addActivity(data) {
  return request({
    url: '/activity/activity',
    method: 'post',
    data
  })
}
/**
 * 查询活动报名签到信息(带分页查询)
 */
export function getActivityClient(params) {
  return request({
    url: '/activity/activityClient',
    method: 'get',
    params
  })
}
/**
 * 查询签到账户
 */
export function getSigninaccount(params) {
  return request({
    url: '/activityClient/signinaccount/',
    method: 'get',
    params
  })
}
/**
 * 查询签单记录
 */
export function getContract(params) {
  return request({
    url: '/activityClient/contract',
    method: 'get',
    params
  })
}

/**
 * 批量导出活动签到数据
 */
export function exportPf(params) {
  return request({
    url: '/activityClient/export/',
    method: 'get',
    params,
    responseType: 'blob'
  })
}
/**
 * 导出签单记录
 */
export function exportcontract(params) {
  return request({
    url: '/activityClient/exportcontract',
    method: 'get',
    params,
    responseType: 'blob'
  })
}
/**
 * 导出签单记录
 */
export function getOperationLog(params) {
  return request({
    url: '/activity/operationLog',
    method: 'get',
    params
  })
}
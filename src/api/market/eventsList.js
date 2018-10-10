import request from '@/utils/request'
// 查询活动信息(带分页查询)
export function getActivityList(obj) {
  return request({
    url: '/activity/activity',
    method: 'get',
    params: obj
  })
}
// 删除活动信息
export function deleteActivity(id) {
  return request({
    url: `/activity/activity/${id}`,
    method: 'delete'
  })
}
// 新增(编辑)活动信息
export function addActivity(data,method) {
  return request({
    url: '/activity/activity',
    method,
    data
  })
}
// 新增(编辑)活动海报
export function activityPoster(data) {
  return request({
    url: '/activity/activity/poster',
    method:'put',
    data
  })
}
// 通过id查询活动信息
export function editActivity(id) {
  return request({
    url: `/activity/activity/${id}`,
    method: 'get'
  })
}
// 查询活动报名签到信息(带分页查询)
export function getActivityClient(obj) {
  return request({
    url: '/activity/activityClient',
    method: 'get',
    params: obj
  })
}
// 查询签到账户
export function getSigninaccount(obj) {
  return request({
    url: '/activity/activityClient/signinaccount/',
    method: 'get',
    params: obj
  })
}
// 查询签单记录
export function getContract(params) {
  return request({
    url: '/activity/activityClient/contract',
    method: 'get',
    params
  })
}

/**
 * 批量导出活动签到数据
 */
export function exportPf(params) {
  return request({
    url: '/activity/activityClient/export/',
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
    url: '/activity/activityClient/exportcontract',
    method: 'get',
    params,
    responseType: 'blob'
  })
}
/**
 * 发布活动信息
 */
export function releaseEvent(activityId ) {
  return request({
    url: `/activity/activity/release/${activityId}`,
    method: 'put',
  })
}
/**
 * 新增签到账户
 */
export function addSigninaccount(params) {
  return request({
    url: '/activity/activityClient/signinaccount/',
    method: 'put',
    params
  })
}
/**
 * 删除签到账户
 */
export function deleteSigninaccount(id) {
  return request({
    url: `/activity/activityClient/signinaccount/${id}`,
    method: 'DELETE',
  })
}
/**
 * 查询活动操作日志（分页）
 */
export function getOperationLog(params) {
  return request({
    url: '/activity/operationLog',
    method: 'get',
    params
  })
}
/**
 * 取得直属子公司
 */
export function getCompany() {
  return request({
    url: '/admin/dept/getCompany/',
    method: 'get'
  })
}

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
// 新增活动信息
export function addActivity(obj) {
  return request({
    url: '/activity/activity',
    method: 'post',
    data: obj
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
export function getContract(obj) {
  return request({
    url: '/activityClient/contract',
    method: 'get',
    params: obj
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
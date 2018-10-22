import request from '@/utils/request'

/**
 * 获取版本列表
 */
export function getVersionPage(query) {
  return request({
    url: '/admin/appVersion/',
    method: 'get',
    params: query
  })
}

/**
 * 新增版本信息
 */
export function createVersion(obj) {
  return request({
    url: '/admin/appVersion/',
    method: 'post',
    data: obj
  })
}
/**
 * 查看版本信息详情
 */
export function getVersion(id) {
  return request({
    url: '/admin/appVersion/' + id,
    method: 'get'
  })
}
/**
 * 修改版本信息
 */
export function updateVersion(id, obj) {
  return request({
    url: '/admin/appVersion/' + id,
    method: 'put',
    data: obj
  })
}

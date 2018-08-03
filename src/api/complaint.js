import request from '@/utils/request'

/**
 * 查询可维护电话
 * @param code
 */
export function getComplaintMb(code) {
  return request({
    url: '/admin/parameter/' + code,
    method: 'get'
  })
}

/**
 * 更新可维护电话
 * @param code
 */
export function putComplaintMb(code, data) {
  return request({
    url: '/admin/parameter/' + code,
    method: 'put',
    data
  })
}

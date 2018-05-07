import request from '@/utils/request'

/**
 * 查询全部职位
 */
export function getAllPositon() {
  return request({
    url: '/admin/positions/list',
    method: 'get'
  })
}

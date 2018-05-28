import request from '@/utils/request'

/**
 * 查询认证资料列表
 */
export function fetchList(type) {
  return request({
    url: '/client/certFile/' + type,
    method: 'get'
  })
}

/**
 * 新增资料
 */
export function addObj(type) {
  return request({
    url: '/client/certFile/' + type,
    method: 'post'
  })
}

/**
 * 获取认证资料
 */
// export function getObj(clientId) {
//   return request({
//     url: '/client/client/' + clientId,
//     method: 'get',
//   })
// }

/**
 * 删除资料
 */
export function delObj(id) {
  return request({
    url: '/client/certFile/' + id,
    method: 'delete'
  })
}


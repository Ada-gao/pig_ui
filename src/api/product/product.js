import request from '@/utils/request'

/**
 * 查询产品
 */
export function fetchList(query) {
  return request({
    url: '/product/products/',
    method: 'get',
    params: query
  })
}

/**
 * 新增产品
 */
export function addObj(obj) {
  return request({
    url: '/product/products/',
    method: 'post',
    data: obj
  })
}

/**
 * 精确查询
 */
export function getObj(id) {
  return request({
    url: '/product/products/' + id,
    method: 'get'
  })
}

/**
 * 删除产品（无）
 */
export function delObj(id) {
  return request({
    url: '/product/products/' + id,
    method: 'delete'
  })
}

/**
 * 修改产品
 */
export function putObj(obj) {
  return request({
    url: '/product/products/' + obj.productId,
    method: 'put',
    data: obj
  })
}

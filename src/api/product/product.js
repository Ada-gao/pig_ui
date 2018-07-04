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
 * 查询产品操作指南
 */
export function fetchOperation(productId) {
  return request({
    url: '/product/products/' + productId + '/operation',
    method: 'get'
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
 * 新增产品操作指南
 */
export function addOperationObj(obj) {
  return request({
    url: '/product/products/' + obj.productId + '/operation',
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

/**
 * 修改材料
 */
export function putFileObj(obj) {
  return request({
    url: '/product/products/' + obj.productId + '/' + obj.fileType,
    method: 'put',
    data: obj
  })
}

/**
 * 删除上传客户材料
 */
export function delCustFile(productClientFileId) {
  return request({
    url: '/product/products/clientFile/' + productClientFileId ,
    method: 'delete'
  })
}

/**
 * 查找上传客户材料
 */
export function getCustFile(productId) {
  return request({
    url: '/product/products/' + productId + '/clientFile',
    method: 'get'
  })
}

/**
 * 新增上传客户材料
 */
export function addCustFile(obj) {
  return request({
    url: '/product/products/clientFile',
    method: 'post',
    data: obj
  })
}

/**
 * 修改上传客户材料
 */
export function updCustFile(productClientFileId, obj) {
  return request({
    url: '/product/products/clientFile/' + productClientFileId,
    method: 'put',
    data: obj
  })
}

/**
 * 修改产品状态
 */
export function updProductType(productId, obj) {
  return request({
    url: '/product/products/' + productId + '/status',
    method: 'put',
    data: obj
  })
}

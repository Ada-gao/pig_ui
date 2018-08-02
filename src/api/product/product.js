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
 * 删除产品
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
export function putObj(id, obj) {
  return request({
    url: '/product/products/' + id,
    method: 'put',
    data: obj
  })
}

/**
 * 修改材料
 */
export function putFileObj(obj) {
  return request({
    url: '/product/products/' + obj.id + '/' + obj.fileType,
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
 * 新增交易所需材料
 */
export function postTranscFile(obj) {
  return request({
    url: '/product/products/transaction',
    method: 'post',
    data: obj
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

/**
 * 预热转募集
 */
export function updToCollect(productId, obj) {
  return request({
    url: '/product/products/' + productId + '/collecting',
    method: 'put',
    data: obj
  })
}

/**
 * 募集/产品分期查询
 */
export function getProductStage(productId, type) {
  return request({
    url: '/product/products/' + productId + '/stage/' + type,
    method: 'get'
  })
}

/**
 * 募集/产品分期-产品信息编辑
 */
export function updProductStage(obj) {
  return request({
    url: '/product/products/stage',
    method: 'post',
    data: obj
  })
}

/**
 * 产品交易简报
 */
export function getBriefReport(id) {
  return request({
    url: '/product/products/' + id + '/transactionStatistic',
    method: 'get'
  })
}

/**
 * 打款交易信息查询
 */
export function getAppointList(productId, type, query) {
  return request({
    url: '/product/products/' + productId + '/appointTransaction/' + type,
    method: 'get',
    params: query
  })
}

/**
 * 打款交易信息导出
 */
export function batchExportProduct(productId, type) {
  return request({
    url: '/product/products/' + productId + '/export/' + type,
    method: 'get',
    responseType: 'blob'
  })
}

/**
 * 修改预约暂停状态
 */
export function updProductPause(productId, obj) {
  return request({
    url: '/product/products/' + productId + '/pause',
    method: 'put',
    data: obj
  })
}

/**
 * 修改显示状态
 */
export function updProductDisplay(productId, obj) {
  return request({
    url: '/product/products/' + productId + '/display',
    method: 'put',
    data: obj
  })
}

/**
 * 产品统计
 */
export function getProudctStatistics() {
  return request({
    url: '/product/products/statistics',
    method: 'get'
  })
}

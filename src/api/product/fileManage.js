import request from '@/utils/request'

/**
 * 查找产品上传客户材料
 */
export function getClientFile(query) {
  return request({
    url: '/product/productClientFileManage/',
    method: 'get',
    params: query
  })
}

/**
 * 新增产品上传客户材料
 */
export function addClientFile(obj) {
  return request({
    url: '/product/productClientFileManage/',
    method: 'post',
    data: obj
  })
}

/**
 * 修改产品上传客户材料
 */
export function updClientFile(id, obj) {
  return request({
    url: '/product/productClientFileManage/' + id,
    method: 'put',
    data: obj
  })
}

/**
 * 删除产品上传客户材料
 */
export function delClientFile(id, obj) {
  return request({
    url: '/product/productClientFileManage/' + id,
    method: 'delete',
    data: obj
  })
}

/**
 * 查找交易所需材料
 */
export function getTranscFile(query) {
  return request({
    url: '/product/productTransactionFileManage/',
    method: 'get',
    params: query
  })
}

/**
 * 新增交易所需材料
 */
export function addTranscFile(obj) {
  return request({
    url: '/product/productTransactionFileManage/',
    method: 'post',
    data: obj
  })
}

/**
 * 修改交易所需材料
 */
export function updTranscFile(id, obj) {
  return request({
    url: '/product/productTransactionFileManage/' + id,
    method: 'put',
    data: obj
  })
}

/**
 * 删除交易所需材料
 */
export function delTranscFile(id, obj) {
  return request({
    url: '/product/productTransactionFileManage/' + id,
    method: 'delete',
    data: obj
  })
}

/**
 * 产品批量导入
 * @param file
 */
export function importPd(file) {
  return request({
    url: '/product/products/import',
    method: 'post',
    data: file,
    headers: {
      'Content-Type': 'application/json'
    }
  })
}

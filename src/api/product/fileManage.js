import request from '@/utils/request'

/**
 * 查找上传客户材料
 */
export function getClientFile(query) {
  return request({
    url: '/product/productClientFileManage/',
    method: 'get',
    params: query
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

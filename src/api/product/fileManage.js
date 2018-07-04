import request from '@/utils/request'

/**
 * 查找上传客户材料
 */
export function getClientFile() {
  return request({
    url: '/product/productClientFileManage/',
    method: 'get'
  })
}

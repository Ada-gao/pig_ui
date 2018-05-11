import request from '@/utils/request'

export function getToken() {
  return request({
    url: '/zuul/admin/user/upload',
    method: 'post'
  })
}

export function getFiles(obj) {
  return request({
    url: '/product/products/' + obj.productId + '/' + obj.fileType + '/list',
    method: 'get'
  })
}

export function delFiles(obj) {
  return request({
    url: '/product/products/' + obj.productFileId + '/' + obj.fileType ,
    method: 'delete'
  })
}

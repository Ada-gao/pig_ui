import request from '@/utils/request'

export function uploadExcel(file) {
  return request({
    url: '/admin/user/uploadExcel',
    method: 'post',
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    data: file
  })
}

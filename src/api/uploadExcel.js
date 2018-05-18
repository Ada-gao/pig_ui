import request from '@/utils/request'

/**
 * 查询全部职位
 */
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

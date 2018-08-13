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
/*模板导入 josn类型 
 */
export function uploadExcelJson(file) {
  return request({
    url: '/admin/user/uploadExcel',
    method: 'post',
    headers: {
      'Content-Type': 'application/json'
    },
    data: file
  })
}
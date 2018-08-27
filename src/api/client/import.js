import request from '@/utils/request'
/**
 * 客户导入
 * @param file
 */
export function importPd(file) {
  return request({
    url: '/client/client/uploadExcel',
    method: 'post',
    data: file,
    headers: {
      'Content-Type': 'application/json'
    }
  })
}
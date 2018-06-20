import request from '@/utils/request'

/**
 * 获取客户历史交易记录
 */
export function fetchRecords(query) {
  return request({
    url: '/product/appointment/dealHistory',
    method: 'get',
    params: query
  })
}

/**
 * 获取操作日志
 */
export function fetchLog(appointmentId, query) {
  return request({
    url: '/product/appointmentAuditHistory/' + appointmentId + '/operationHistory',
    method: 'get',
    params: query
  })
}

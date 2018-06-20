import request from '@/utils/request'

/**
 * 获取交易列表
 */
export function fetchTranscList(query) {
  return request({
    url: '/product/appointment/',
    method: 'get',
    params: query
  })
}

/**
 * 获取预约列表
 */
export function fetchAppointList(query) {
  return request({
    url: '/product/appointment/appoints',
    method: 'get',
    params: query
  })
}

/**
 * 获取打款列表
 */
export function fetchPayList(query) {
  return request({
    url: '/product/appointment/remits',
    method: 'get',
    params: query
  })
}
/**
 * 获取合同列表
 */
export function fetchContractList(query) {
  return request({
    url: '/product/appointment/contract',
    method: 'get',
    params: query
  })
}

/**
 * 获取退款列表
 */
export function fetchRefundList(query) {
  return request({
    url: '/product/appointment/refunds',
    method: 'get',
    params: query
  })
}

/**
 * 精确查询预约详情
 */
export function getObj(appointmentId) {
  return request({
    url: '/product/appointment/' + appointmentId,
    method: 'get'
  })
}

/**
 * 获取打款材料
 */
export function getFileObj(appointmentId) {
  return request({
    url: '/product/appointmentPicture/' + appointmentId,
    method: 'get'
  })
}

/**
 * 获取退款申请书
 */
export function getRefundFile(appointmentId) {
  return request({
    url: '/product/appointmentRefundPicture/' + appointmentId,
    method: 'get'
  })
}

/**
 * 审核详情
 */
export function putObj(appointmentId, obj) {
  return request({
    url: '/product/appointment/' + appointmentId + '/audit',
    method: 'put',
    data: obj
  })
}

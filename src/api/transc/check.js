import request from '@/utils/request'

/**
 * 审核预约详情
 */
export function putApt(appointmentId, obj) {
  return request({
    url: '/product/appointment/' + appointmentId + '/audit',
    method: 'put',
    data: obj
  })
}

/**
 * 审核打款详情
 */
export function putPay(appointmentId, obj) {
  return request({
    url: '/product/appointment/' + appointmentId + '/remitAudit',
    method: 'put',
    data: obj
  })
}

/**
 * 审核合同详情
 */
export function putCtra(appointmentId, obj) {
  return request({
    url: '/product/appointment/' + appointmentId + '/contractAudit',
    method: 'put',
    data: obj
  })
}

/**
 * 审核退款详情
 */
export function putRefund(appointmentId, obj) {
  return request({
    url: '/product/appointment/' + appointmentId + '/refundAudit',
    method: 'put',
    data: obj
  })
}

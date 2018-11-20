import request from '@/utils/request'
/**
 * 查询银行卡名称信息(带分页查询)
 * @param params
 */
export function getBankName(params) {
  return request({
    url: '/client/bankName/',
    method: 'get',
    params
  })
}
/**
 * 新增银行卡名称
 * @param data
 */
export function addBankName(data) {
  return request({
    url: '/client/bankName/',
    method: 'post',
    data
  })
}

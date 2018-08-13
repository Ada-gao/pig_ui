import request from '@/utils/request'
/*

查询币种信息(带分页查询)
 */
export function fetchCurrency(query) {
  return request({
    url: '/admin/currency/',
    method: 'get',
    params: query
  })
}
/*

查询全部币种(不带分页)
 */
export function getObjList(query) {
  return request({
    url: '/admin/currency/list',
    method: 'get',
    params: query
  })
}
/*

新增币种
 */
export function addObj(obj) {
  return request({
    url: '/admin/currency/',
    method: 'post',
    data: obj
  })
}
/*

根据id查询币种信息
 */
export function getObj(id) {
  return request({
    url: '/admin/currency/' + id,
    method: 'get'
  })
}
/*

删除币种
 */
export function delObj(id) {
  return request({
    url: '/admin/currency/' + id,
    method: 'delete'
  })
}
/*

修改币种信息
 */
export function putObj(obj) {
  return request({
    url: '/admin/currency/' + obj.currencyId,
    method: 'put',
    data: obj
  })
}

/*

根据币种id查询汇率信息
 */
export function getExchangeRateRnformation(id) {
  return request({
    url: `/admin/exchangeRate/currency/${id}`,
    method: 'get',
  })
}

/*

修改币种信息
 */
export function addExchangeRate(obj) {
  return request({
    url: '/admin/exchangeRate',
    method: 'post',
    data: obj
  })
}

import request from '@/utils/request'

/**
 * 查询佣金计算模板
 */
export function fetchList(query) {
  return request({
    url: '/performance/template/',
    method: 'get',
    params: query
  })
}

/**
 * 查询佣金模版的所有字段
 */
export function getFeildsList() {
  return request({
    url: '/performance/commissionCalculation/fields',
    method: 'get'
  })
}

/**
 * 新增佣金计算模版
 */
export function addObj(obj) {
  return request({
    url: '/performance/template/',
    method: 'post',
    data: obj
  })
}

/**
 * 查询佣金计算模版详情
 */
export function getObj(templateId) {
  return request({
    url: '/performance/template/' + templateId,
    method: 'get',
  })
}

/**
 * 编辑佣金计算模版
 */
export function putObj(templateId, query) {
  return request({
    url: '/performance/template/' + templateId,
    method: 'put',
    data: query
  })
}

/**
 * 删除佣金计算模版
 */
export function delObj(templateId) {
  return request({
    url: '/performance/template/' + templateId,
    method: 'delete'
  })
}

/**
 * 导出模版
 */
export function exportTemplate(templateId, query) {
  return request({
    url: '/performance/template/export/' + templateId,
    method: 'get',
    params: query,
    responseType: 'blob'
  })
}

/**
 * Created by liulong on 2018/7/23.
 */
import request from '@/utils/request'
/**
 * 获取全部职位
 */
export function getAllPositon() {
  return request({
    url: '/admin/positions/list',
    method: 'get'
  })
}
/**
 * 获取所有部门
 */
export function getAllDeparts() {
  return request({
    url: '/admin/dept/tree',
    method: 'get'
  })
}
/**
 * 根据职位id获取职级
 */
export function getAllRank(query) {
  return request({
    url: '/admin/rank/list',
    method: 'get',
    params: query
  })
}

/**
 * 获取平衡计分卡列表
 * @param query
*/
export function getBalancedList(query) {
  return request({
    url: '/performance/balancedScoreCard',
    method: 'get',
    params: query
  })
}

/**
 * id获取平衡计分卡
*/
export function getBalancedId(id) {
  return request({
    url: `/performance/balancedScoreCard/${id}`,
    method: 'get'
  })
}

/**
 * 修改平衡计分卡
*/
export function editBalanced(obj) {
  return request({
    url: '/performance/balancedScoreCard',
    method: 'post',
    data: obj
  })
}

/**
 *平衡计分卡导入
*/
export function balancedImport(file) {
  return request({
    url: '/performance/balancedScoreCard/import',
    method: 'post',
    headers: {
      'Content-Type': 'application/json'
    },
    data: file
  })
}

/**
/**
 * 平衡计分卡导出
*/
export function balancedExport(query) {
  return request({
    url: '/performance/balancedScoreCard/export',
    method: 'get',
    params: query,
    responseType: 'blob'
  })
}

/**
 * 获取查询佣金列表
 * @param query
*/
export function getCommissionList(query) {
  return request({
    url: '/performance/commissions',
    method: 'get',
    params: query
  })
}

/**
/**
 * 佣金列表导出
*/
export function commissionListExport(query) {
  return request({
    url: '/performance/commissions/export',
    method: 'get',
    params: query,
    responseType: 'blob'
  })
}

/**
 * 佣金列表导入
*/
export function commissionListImport(file) {
  return request({
    url: '/performance/commissions/import',
    method: 'post',
    headers: {
      'Content-Type': 'application/json'
    },
    data: file
  })
}

/**
 * 获取试用期业绩列表所有数据
 */
export function getPbtList() {
  return request({
    url: '/performance/probationNorm/list',
    method: 'get'
  })
}
/**
 * 编辑试用期业绩item
 * @param id item.id
 */
export function editPbtItem(id) {
  return request({
    url: `/performance/probationNorm/${id}`,
    method: 'get'
  })
}
/**
 * 新增或修改试用期业绩item
 * @param obj
 */
export function postPbtItem(obj) {
  return request({
    url: '/performance/probationNorm',
    method: 'post',
    data: obj
  })
}
/**
 * 删除试用期业绩item
 * @param id item.id
 */
export function delPbtItem(id) {
  return request({
    url: `/performance/probationNorm/${id}`,
    method: 'delete'
  })
}

/**
 * 销售支持导入
*/
export function salesSupportListImport(file) {
  return request({
    url: '/performance/salesSupport/import',
    method: 'post',
    headers: {
      'Content-Type': 'application/json'
    },
    data: file
  })
}

/**
 * 查询产品信息(带分页查询)
 * @param
 */
export function getSalesSupportList(query) {
  return request({
    url: `/performance/salesSupport`,
    method: 'get',
    params: query
  })
}
/**
 * 根据id查询销售支持
 * @param
 */
export function getSalesSupport(id) {
  return request({
    url: `/performance/salesSupport/${id}`,
    method: 'get'
  })
}
/**
 * 添加销售支持
 * @param
 */
export function addSalesSupport(param) {
  return request({
    url: `/performance/salesSupport`,
    method: 'post',
    data: param
  })
}
/**
 * 修改销售支持
 * @param
 */
export function updateSalesSupport(param) {
  return request({
    url: `/performance/salesSupport`,
    method: 'post',
    data: param
  })
}
/**
 * 删除试用期业绩标准
 * @param
 */
export function deleteSalesSupport(id) {
  return request({
    url: `/performance/salesSupport/${id}`,
    method: 'delete'
  })
}
/**
 * 查询业绩指标列表
 */
export function getPfList(params) {
  return request({
    url: '/performance/performanceIndicator/',
    method: 'get',
    params
  })
}
/**
 * 新增业绩指标
 */
export function addPfItem(obj) {
  return request({
    url: '/performance/performanceIndicator/',
    method: 'post',
    data: obj,
    headers: {
      'Content-Type': 'application/json'
    }
  })
}
/**
 * 根据id查询业绩指标
 * @param id
 */
export function editPfItem(id) {
  return request({
    url: `/performance/performanceIndicator/${id}`,
    method: 'get'
  })
}
/**
 * 修改业绩指标
 * @param id
 * @param data
 */
export function putPfItem(id, data) {
  return request({
    url: `/performance/performanceIndicator/${id}`,
    method: 'put',
    data
  })
}
/**
 * 删除业绩指标
 * @param id
 */
export function delPfItem(id) {
  return request({
    url: `/performance/performanceIndicator/${id}`,
    method: 'delete'
  })
}
/**
 * 业绩指标导入
 */
export function importPf(file) {
  return request({
    url: '/performance/performanceIndicator/import',
    method: 'post',
    data: file,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}
/**
 * 业绩指标导出
 */
export function exportPf(params) {
  return request({
    url: '/performance/performanceIndicator/import',
    method: 'get',
    params
    // responseType: 'blob'
  })
}

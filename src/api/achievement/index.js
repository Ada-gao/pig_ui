/**
 * Created by liulong on 2018/7/23.
 */
import request from '@/utils/request'
/**
 * 获取业绩指标列表
 * @param query
 */
export function getPerformList(query) {
  return request({
    url: '/performance/user/userPage',
    method: 'get',
    params: query
  })
}
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
 * 获取职级
 */
export function getAllRank() {
  return request({
    url: '/admin/rank',
    method: 'get'
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
 * 编辑试用期业绩item
 * @param id item.id
 */
export function putPbtItem(id) {
  return request({
    url: `/performance/probationNorm/${id}`,
    method: 'put'
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

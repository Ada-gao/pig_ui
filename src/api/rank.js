import request from '@/utils/request'

/**
 * 获取职级列表
 */
export function getRankList(query) {
  return request({
    url: '/admin/rank/',
    method: 'get',
    params: query
  })
}

/**
 * 新增职级
 */
export function addRank(obj) {
  return request({
    url: '/admin/rank/',
    method: 'post',
    data: obj
  })
}

/**
 * 根据id获取职级信息
 */
export function getRankById(params) {
  return request({
    url: '/admin/rank/list',
    method: 'get',
    params
  })
}

/**
 * 删除职级
 */
export function delRankById(id) {
  return request({
    url: '/admin/rank/' + id,
    method: 'delete'
  })
}

/**
 * 修改职级
 */
export function putRankById(obj) {
  return request({
    url: '/admin/rank/' + obj.rankId,
    method: 'put',
    data: obj
  })
}

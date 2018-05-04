import request from '@/utils/request'

/**
 * 分页查询
 */
export function fetchPosition(query) {
  return request({
    url: '/admin/positions/',
    method: 'get',
    params: query
  })
}

/**
 * 新增职位
 */
export function addObj(obj) {
  return request({
    url: '/admin/positions/',
    method: 'post',
    data: obj
  })
}

/**
 * 精确查询
 */
export function getObj(id) {
  return request({
    url: '/admin/positions/' + id,
    method: 'get'
  })
}

/**
 * 删除职位
 */
export function delObj(id) {
  return request({
    url: '/admin/positions/' + id,
    method: 'delete'
  })
}

/**
 * 修改职位
 */
export function putObj(obj) {
  return request({
    url: '/admin/positions/' + obj.positionId,
    method: 'put',
    data: {
      name: obj.positionName
    }
  })
}

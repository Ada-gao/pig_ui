import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/client/client/',
    method: 'get',
    params: query
  })
}

/**
 * 新增用户
 */
export function addObj(obj) {
  return request({
    url: '/client/potential/',
    method: 'post',
    data: obj
  })
}

export function getObj(id) {
  return request({
    url: '/client/potential/' + id,
    method: 'get'
  })
}

export function delObj(id) {
  return request({
    url: '/client/potential/' + id,
    method: 'delete'
  })
}

export function putObj(obj) {
  return request({
    url: '/client/potential',
    method: 'put',
    data: obj
  })
}


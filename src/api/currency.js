import request from '@/utils/request'

export function fetchCurrency(query) {
  return request({
    url: '/admin/currency',
    method: 'get',
    params: query
  })
}

export function addObj(obj) {
  return request({
    url: '/admin/currency/',
    method: 'post',
    data: obj
  })
}

export function getObj(id) {
  return request({
    url: '/admin/currency/' + id,
    method: 'get'
  })
}

export function delObj(id) {
  return request({
    url: '/admin/currency/' + id,
    method: 'delete'
  })
}

export function putObj(obj) {
  return request({
    url: '/admin/currency/',
    method: 'put',
    data: obj
  })
}

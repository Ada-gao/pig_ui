import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/admin/sysAuth/',
    method: 'get',
    params: query
  })
}

export function delObj(id) {
  return request({
    url: '/admin/sysAuth/' + id,
    method: 'delete'
  })
}

export function addObj(obj) {
  return request({
    url: '/admin/sysAuth/',
    method: 'post',
    data: obj
  })
}

export function putObj(id, obj) {
  return request({
    url: '/admin/sysAuth/' + id,
    method: 'put',
    data: obj
  })
}

export function freObj(id, obj) {
  return request({
    url: '/admin/sysAuth/' + id + '/secret',
    method: 'put',
    data: obj
  })
}

import request from '@/utils/request'

// 客户标签列表

/**
 * 获取客户标签列表
 */
export function getClientList() {
  return request({
    url: '/client/clientLabel/',
    method: 'get'
  })
}
/**
 * 新增或修改客户标签
 */
export function clientLabel(obj,method) {
	console.log(obj)
  return request({
    url: '/client/clientLabel/',
    method:'post',
    data: obj
  })
}

/**
 * 删除客户标签
 */
export function deleteClientLabel(id) {
  return request({
    url: '/client/clientLabel/'+id,
    method: 'delete'
  })
}
/**
 * 根据id查询客户标签
 */
export function seeClientLabel(id) {
  return request({
    url: '/client/clientLabel/'+id,
    method: 'get'
  })
}

/**
 * 修改客户标签
 */
export function editClientLabel(obj,id) {
  return request({
    url: '/client/clientLabel/'+id,
    method: 'put',
    data: obj
  })
}

// 客户aum标签

/**
 * 获得全部客户aum标签
 */
export function fetchList() {
  return request({
    url: '/client/clientAumLabel/list',
    method: 'get'
  })
}

/**
 * 新增或修改客户aum标签
 */
export function clientAumLabel(obj) {
  return request({
    url: '/client/clientAumLabel',
    method: 'post',
    data: obj
  })
}

/**
 * 根据id查询客户aum标签信息
 */
export function editClientAumLabel(id) {
  return request({
    url: '/client/clientAumLabel/'+id,
    method: 'get'
  })
}

/**
 * 删除客户aum标签
 */
export function deleteClientAumLabel(id) {
  return request({
    url: '/client/clientAumLabel/'+id,
    method: 'delete'
  })
}




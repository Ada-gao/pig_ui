import request from '@/utils/request'

/**
 * 查询产品类型
 */
export function fetchList() {
  return request({
    url: '/product/productType/list',
    method: 'get'
  })
}

/**
 * 新增产品类型
 */
export function addObj(obj) {
  return request({
    url: '/product/productType/',
    method: 'post',
    data: obj
  })
}

/**
 * 精确查询（）
 */
export function getObj(id) {
  return request({
    url: '/product/productType/' + id,
    method: 'get'
  })
}

/**
 * 删除材料类型（无）
 */
export function delObj(id) {
  return request({
    url: '/product/productType/' + id,
    method: 'delete'
  })
}

/**
 * 修改材料类型
 */
export function putObj(obj) {
  return request({
    url: '/product/productType/' + obj.productTypeId,
    method: 'put',
    data: {
      name: obj.name,
      algorithmIndex: obj.algorithmIndex
    }
  })
}

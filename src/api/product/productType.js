import request from '@/utils/request'

/**
 * 查询产品收益类型
 */
export function fetchProductTypeList() {
  return request({
    url: '/product/productType/list',
    method: 'get'
  })
}

/**
 * 查询产品结构类型
 */
export function fetchProductMixType() {
  return request({
    url: '/product/productMixType/list',
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

/**
 * 获取产品收益类型
 */
export function getProductTypeList() {
  return request({
    url: '/product/productType/',
    method: 'get'
  })
}

/**
 * 查询产品结构类型
 */
export function getProductMixList() {
  return request({
    url: '/product/productMixType',
    method: 'get'
  })
}

/**
 * 根据id获取对应的产品结构信息
 * @param id
 */
export function getProductMixById(id) {
  return request({
    url: '/product/productMixType/' + id,
    method: 'get'
  })
}

/**
 * 新增或修改产品结构类型
 * @param data
 */
export function postProductMix(data) {
  return request({
    url: '/product/productMixType',
    method: 'post',
    data
  })
}

import request from '@/utils/request'
// 取得子公司列表
export function getSubcompany(obj) {
  return request({
    url: '/admin/dept/subcompany',
    method: 'get',
    params: obj
  })
}
// 取得子公司列表
export function getSysSelectValueList(type) {
  return request({
    url: `/admin/sysSelectValue/list/${type}`,
    method: 'get'
  })
}
// 新增子公司logo
export function getLogo(obj) {
  return request({
    url: '/admin/dept/subcompany',
    method: 'post',
    data: obj
  })
}
// 新增活动类型
export function addType(obj) {
  return request({
    url: 'admin/sysSelectValue',
    method: 'post',
    data: obj
  })
}

// 编辑活动类型
export function editType(data) {
  return request({
    url: 'admin/sysSelectValue',
    method: 'put',
    data
  })
}
// 删除活动
export function deleteType(id) {
  return request({
    url: `admin/sysSelectValue/${id}`,
    method: 'delete'
  })
}
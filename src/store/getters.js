const getters = {
  sidebar: state => state.app.sidebar,
  visitedViews: state => state.app.visitedViews,
  cachedViews: state => state.tagsView.cachedViews,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  name: state => state.user.name,
  introduction: state => state.user.introduction,
  status: state => state.user.status,
  roles: state => state.user.roles,
  permissions: state => state.user.permissions,
  setting: state => state.user.setting,
  permission_routers: state => state.permission.routers,
  addRouters: state => state.permission.addRouters,
  idType: state => state.dictionary.idType,
  marriageStatus: state => state.dictionary.marriageStatus,
  productStatus: state => state.dictionary.productStatus,
  certificationStatus: state => state.dictionary.certificationStatus,
  certificationType: state => state.dictionary.certificationType,
  genderType: state => state.dictionary.genderType,
  educationType: state => state.dictionary.educationType,
  productRiskLevel: state => state.dictionary.productRiskLevel
}
export default getters

import { fetchList } from '@/api/dict'

const dictionary = {
  state: {
    idTypeOptions: [],
    marriageStatusOptions: [],
    productStatus: [],
    certificationStatus: [],
    certificationType: [],
    genderType: [],
    educationType: [],
    productRiskLevel: [],
    // delFlag: [], 暂时废弃
    nationality: [],
    riskLevel: [],
    realnameStatus: [],
    clientClass: [],
    status: [],
    clientType: [],
    clientFrom: []
  },

  mutations: {
    SET_ID_TYPE: (state, idType) => {
      state.idTypeOptions = idType
    },
    SET_MARRIAGE_STATUS: (state, marriageStatus) => {
      state.marriageStatusOptions = marriageStatus
    },
    SET_PRODUCT_STATUS: (state, productStatus) => {
      state.productStatus = productStatus
    },
    SET_CERTIFICATION_STATUS: (state, certificationStatus) => {
      state.certificationStatus = certificationStatus
    },
    SET_CERTIFICATION_TYPE: (state, certificationType) => {
      state.certificationType = certificationType
    },
    SET_GENDER_TYPE: (state, genderType) => {
      state.genderType = genderType
    },
    SET_EDUCATION_TYPE: (state, educationType) => {
      state.educationType = educationType
    },
    SET_PRODUCT_RISK_LEVEL: (state, productRiskLevel) => {
      state.productRiskLevel = productRiskLevel
    },
    // SET_DEL_FLAG: (state, delFlag) => {
    //   state.delFlag = delFlag
    // },
    SET_NATIONALITY: (state, nationality) => {
      state.nationality = nationality
    },
    SET_RISK_LEVEL: (state, riskLevel) => {
      state.riskLevel = riskLevel
    },
    SET_REALNAME_STATUS: (state, realnameStatus) => {
      state.realnameStatus = realnameStatus
    },
    SET_CLIENT_CLASS: (state, clientClass) => {
      state.clientClass = clientClass
    },
    SET_STATUS: (state, status) => {
      state.status = status
    },
    SET_CLIENT_TYPE: (state, clientType) => {
      state.clientType = clientType
    },
    SET_CLIENT_FROM: (state, clientFrom) => {
      state.clientFrom = clientFrom
    }
  },

  actions: {
    // 字典接口
    FetchList({ commit }, params) {
      // const username = userInfo.username.trim()
      return new Promise((resolve, reject) => {
        fetchList(params).then(response => {
          const data = response.data.records
          let idTypeList = []
          let marriageStatusList = []
          let productStatusList = []
          let certificationStatusList = []
          let certificationTypeList = []
          let genderTypeList = []
          let educationTypeList = []
          let productRiskLevelList = []
          // let delFlagList = []
          let nationalityList = []
          let riskLevelList = []
          let realnameStatusList = []
          let clientClassList = []
          let statusList = []
          let clientTypeList = []
          let clientFromList = []
          
          for(let i = 0; i < data.length; i++) {
            if(data[i].type === 'id_type') {
              idTypeList.push(data[i])

            } else if(data[i].type === 'marriage_status') {
              marriageStatusList.push(data[i])

            } else if(data[i].type === 'product_status') {
              productStatusList.push(data[i])

            } else if(data[i].type === 'certification_status') {
              certificationStatusList.push(data[i])

            } else if(data[i].type === 'certification_type') {
              certificationTypeList.push(data[i])

            } else if(data[i].type === 'gender_type') {
              genderTypeList.push(data[i])

            } else if(data[i].type === 'education_type') {
              educationTypeList.push(data[i])

            } else if(data[i].type === 'product_risk_level') {
              productRiskLevelList.push(data[i])

            // } else if(data[i].type === 'del_flag') {
            //   delFlagList.push(data[i])

            } else if(data[i].type === 'nationality') {
              nationalityList.push(data[i])

            } else if(data[i].type === 'risk_level') {
              riskLevelList.push(data[i])

            } else if(data[i].type === 'realname_status') {
              realnameStatusList.push(data[i])

            } else if(data[i].type === 'client_class') {
              clientClassList.push(data[i])

            } else if(data[i].type === 'status') {
              statusList.push(data[i])

            } else if(data[i].type === 'client_type') {
              clientTypeList.push(data[i])
              
            } else if(data[i].type === 'client_from') {
              clientFromList.push(data[i])
            }
          }
          commit('SET_ID_TYPE', idTypeList)
          commit('SET_MARRIAGE_STATUS', marriageStatusList)
          commit('SET_PRODUCT_STATUS', productStatusList)
          commit('SET_CERTIFICATION_STATUS', certificationStatusList)
          commit('SET_CERTIFICATION_TYPE', certificationTypeList)
          commit('SET_GENDER_TYPE', genderTypeList)
          commit('SET_EDUCATION_TYPE', educationTypeList)
          commit('SET_PRODUCT_RISK_LEVEL', productRiskLevelList)
          // commit('SET_DEL_FLAG', delFlagList)
          commit('SET_NATIONALITY', nationalityList)
          commit('SET_RISK_LEVEL', riskLevelList)
          commit('SET_REALNAME_STATUS', realnameStatusList)
          commit('SET_CLIENT_CLASS', clientClassList)
          commit('SET_STATUS', statusList)
          commit('SET_CLIENT_TYPE', clientTypeList)
          commit('SET_CLIENT_FROM', clientFromList)
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    }
  }
}

export default dictionary

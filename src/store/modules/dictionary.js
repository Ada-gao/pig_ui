import { fetchList } from '@/api/dict'

const dictionary = {
  state: {
    idType: [],
    marriageStatus: [],
    productStatus: [],
    certificationStatus: [],
    certificationType: [],
    genderType: [],
    educationType: []
  },

  mutations: {
    SET_ID_TYPE: (state, idType) => {
      state.idType = idType
    },
    SET_MARRIAGE_STATUS: (state, marriageStatus) => {
      state.marriageStatus = marriageStatus
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
            }
          }
          console.log(educationTypeList)
          commit('SET_ID_TYPE', idTypeList)
          commit('SET_MARRIAGE_STATUS', marriageStatusList)
          commit('SET_PRODUCT_STATUS', productStatusList)
          commit('SET_CERTIFICATION_STATUS', certificationStatusList)
          commit('SET_CERTIFICATION_TYPE', certificationTypeList)
          commit('SET_GENDER_TYPE', genderTypeList)
          commit('SET_EDUCATION_TYPE', educationTypeList)
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    }
  }
}

export default dictionary

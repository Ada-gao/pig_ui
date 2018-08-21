import { getList } from '@/api/dict'

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
    clientFrom: [],
    authStatus: [],
    appointmentStatus: [],
    appointStatus: [], // 从appointmentStatus中分离数据
    paymentStatus: [], // 从appointmentStatus中分离数据
    contractStatus: [], // 从appointmentStatus中分离数据
    transcStatus: [],
    refundStatus: [],
    expressType: [],
    investHorizonUnit: [],
    interestPayment: [],
    buyingCrowds: [],
    dimissionReason: [],
    lockStatus: [],
    preserveExpired: [],
    maskCode: [],
    dataScope: []
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
    },
    SET_AUTH_STATUS: (state, authStatus) => {
      state.authStatus = authStatus
    },
    SET_APPOINTMENT_STATUS: (state, appointmentStatus) => {
      state.appointmentStatus = appointmentStatus
    },
    SET_APPOINT_STATUS: (state, appointStatus) => {
      state.appointStatus = appointStatus
    },
    SET_PAYMENT_STATUS: (state, paymentStatus) => {
      state.paymentStatus = paymentStatus
    },
    SET_CONTRACT_STATUS: (state, contractStatus) => {
      state.contractStatus = contractStatus
    },
    SET_TRANSC_STATUS: (state, transcStatus) => {
      state.transcStatus = transcStatus
    },
    SET_REFUND_STATUS: (state, refundStatus) => {
      state.refundStatus = refundStatus
    },
    SET_EXPRESS_TYPE: (state, expressType) => {
      state.expressType = expressType
    },
    SET_INVESTMENT_HORIZON_UNIT: (state, investHorizonUnit) => {
      state.investHorizonUnit = investHorizonUnit
    },
    SET_INTEREST_PAYMENT: (state, interestPayment) => {
      state.interestPayment = interestPayment
    },
    SET_BUYING_CROWDS: (state, buyingCrowds) => {
      state.buyingCrowds = buyingCrowds
    },
    SET_DIMISSION_REASON: (state, dimissionReason) => {
      state.dimissionReason = dimissionReason
    },
    SET_LOCK_STATUS: (state, lockStatus) => {
      state.lockStatus = lockStatus
    },
    SET_PRESERVE_EXPIRED: (state, preserveExpired) => {
      state.preserveExpired = preserveExpired
    },
    SET_MASK_CODE: (state, maskCode) => {
      state.maskCode = maskCode
    },
    SET_DATA_SCOPE: (state, dataScope) => {
      state.dataScope = dataScope
    }
  },

  actions: {
    // 字典接口
    FetchList({ commit }) {
      // const username = userInfo.username.trim()
      return new Promise((resolve, reject) => {
        getList().then(response => {
          const data = response.data
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
          let authStatusList = []
          let appointmentStatusList = []
          let appointList = []
          let paymentList = []
          let contractList = []
          let transcStatusList = []
          let refundStatusList = []
          let expressTypeList = []
          let investHorizonUnitList = []
          let interestPaymentList = []
          let buyingCrowdsList = []
          let dimissionReasonList = []
          let lockStatusList = []
          let preserveExpiredList = []
          let maskCodeList = []
          let dataScopeList = []
          
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

            } else if(data[i].type === 'auth_status') {
              authStatusList.push(data[i])

            } else if(data[i].type === 'appointment_status') {
              appointmentStatusList.push(data[i])

            } else if(data[i].type === 'transc_status') {
              transcStatusList.push(data[i])

            } else if(data[i].type === 'refund_status') {
              refundStatusList.push(data[i])

            } else if(data[i].type === 'express_type') {
              expressTypeList.push(data[i])

            } else if(data[i].type === 'investment_horizon_unit') {
              investHorizonUnitList.push(data[i])

            } else if(data[i].type === 'interest_payment') {
              interestPaymentList.push(data[i])

            } else if(data[i].type === 'buying_crowds') {
              buyingCrowdsList.push(data[i])

            } else if(data[i].type === 'dimission_reason') {
              dimissionReasonList.push(data[i])

            } else if(data[i].type === 'lock') {
              lockStatusList.push(data[i])

            } else if(data[i].type === 'preserve_expired') {
              preserveExpiredList.push(data[i])

            } else if(data[i].type === 'mask_code') {
              maskCodeList.push(data[i])

            } else if(data[i].type === 'data_scope') {
              dataScopeList.push(data[i])
            }
          }

          appointmentStatusList.forEach(item => {
            if(item.value.indexOf('100') !== -1) {
              appointList.push(item)
            } else if(item.value.indexOf('200') !== -1) {
              paymentList.push(item)
            } else if(item.value.indexOf('300') !== -1) {
              contractList.push(item)
            }
          })

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
          commit('SET_AUTH_STATUS', authStatusList)
          commit('SET_APPOINTMENT_STATUS', appointmentStatusList)
          commit('SET_APPOINT_STATUS', appointList)
          commit('SET_PAYMENT_STATUS', paymentList)
          commit('SET_CONTRACT_STATUS', contractList)
          commit('SET_TRANSC_STATUS', transcStatusList)
          commit('SET_REFUND_STATUS', refundStatusList)
          commit('SET_EXPRESS_TYPE', expressTypeList)
          commit('SET_INVESTMENT_HORIZON_UNIT', investHorizonUnitList)
          commit('SET_INTEREST_PAYMENT', interestPaymentList)
          commit('SET_BUYING_CROWDS', buyingCrowdsList)
          commit('SET_DIMISSION_REASON', dimissionReasonList)
          commit('SET_LOCK_STATUS', lockStatusList)
          commit('SET_PRESERVE_EXPIRED', preserveExpiredList)
          commit('SET_MASK_CODE', maskCodeList)
          commit('SET_DATA_SCOPE', dataScopeList)
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    }
  }
}

export default dictionary

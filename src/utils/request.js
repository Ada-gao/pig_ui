import axios from 'axios'
import { Message } from 'element-ui'
import store from '../store'
import { getToken } from '@/utils/auth'
import interceptorsMsg from '@/api/interceptor'
import router from '../router'

// 创建axios实例
const service = axios.create({
  // baseURL: process.env.BASE_API, // api的base_url
  timeout: 30000 // 请求超时时间
})

// request拦截器
service.interceptors.request.use(config => {
  if (config.url !== '/auth/authentication/removeToken' && config.url !== '/auth/oauth/token') {
    if (store.getters.token) {
      config.headers['Authorization'] = 'Bearer ' + getToken() // 让每个请求携带token--['X-Token']为自定义key 请根据实际情况自行修改
    }
  }
  return config
}, error => {
  // Do something with request error
  Promise.reject(error)
})

// respone拦截器
service.interceptors.response.use(
  response => {
    const res = response.data
    if (res.code === 1) {
      message(res.msg, 'error')
      return Promise.reject(res)
    }
    return response
  },
  error => {
    const res = error.response
    const defaultMsg = '服务器正在开小差，请稍后再试！'
    res.data.codeMsg = interceptorsMsg.errMessage(res.config.url, res.data.code)
    // console.log(res.data)

    if(res.status === 400) {
      if(res.data) {
        if(res.data.codeMsg.code === '999999') {
          return
        } else if(res.data.codeMsg.code === '888888') {
          return message(res.data.msg || defaultMsg, 'error') // 后台自定义错误信息返回
          
        } else if(res.data.codeMsg.code === '777777') {
          if(res.data.code) {
            return message(res.data.msg || defaultMsg, 'error')
          }
          return message(res.data.error_description || defaultMsg, 'error') // 后台自定义错误信息返回
        } else {
          message(res.data.codeMsg.errMsg || defaultMsg, 'error')
        }
      }
    } else if(res.status.toString().indexOf('401') !== -1) {
      message('登陆时间过期，请重新登陆', 'error')
      store.dispatch('FedLogOut')
      router.replace({
        path: '/login',
        query: {redirect: router.fullPath}
      })
      console.log('router.fullPath: ' + router.fullPath)
    } else if(res.status === 403) {
      message('管理权限不足，请联系管理员')
    } else if(res.status === 500) {
      message(res.data.msg || defaultMsg, 'error')
    } else if(res.status.toString().indexOf('504') !== -1 || res.status === 404) {
      message('服务器被吃了⊙﹏⊙∥', 'error')
      router.replace({
        path: '/404',
        query: {redirect: router.fullPath}
      })
    }
    return Promise.reject(error)
  }
)

export function message(text, type) {
  Message({
    message: text,
    type: type,
    duration: 5 * 1000
  })
}

export default service

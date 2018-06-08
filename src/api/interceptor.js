// import { Message } from 'element-ui'

export default {
  errMessage(url, code) {
    const urlMap = {
      '/client/bankcard': {
        // 702: '该用户没有填写银行卡信息'
      },
      '/admin/user/uploadExcel': {
        1: '上传的 Excel 格式有误，请按照模板上传'
      },
      '/auth/oauth/token': {
        888: '用户名或密码不存在' // 接口无返回code
      }
    }
    for(let key in urlMap) {
      url = url.indexOf(key) > -1 ? key : url
    }
    if(url === '/auth/oauth/token') {
      console.log(url)
      return { 'code': '777777', errMsg: '登录接口'}
    }
    let codeMsgMap = urlMap[url]
    if(codeMsgMap === undefined) {
      console.log('请在interceptor内定义 ' + url + ' 的ErrorMsg信息')
      return { 'code': '888888', errMsg: '找不到地方，要祭天了'}
    }
    let errorMsg = codeMsgMap[code]
    if(errorMsg) {
      return { 'code': code, errMsg: errorMsg }
    } else {
      return { 'code': '999999', errMsg: '哟呵，服务器正忙，请稍后重试'}
    }
  },
  // _mergeMessage(code, systemMsg) {
  //   if(systemMsg === undefined) systemMsg = ''
  //   let message = '服务器正忙，请稍后重试'
  //   return message
  // }
}
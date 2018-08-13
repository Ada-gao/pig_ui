var merge = require('webpack-merge')
var prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  // BASE_API: '"https://easy-mock.com/mock/5950a2419adc231f356a6636/vue-admin"'
  // BASE_API: '"http://127.0.0.1:9999"'
  BASE_API: '"http://10.9.60.141:9999"' // 服务器
  // BASE_API: '"http://10.9.70.62:9999"' // 赵旭东
  // BASE_API: '"http://10.9.70.231:9999"' // 朱轶博
  // BASE_API: '"http://76394fce.ngrok.io"' // 外网
  // BASE_API: '"http://10.9.70.61:9999"' // 孙威
  // BASE_API: '"http://10.9.60.24:9999"' // 孙威
})

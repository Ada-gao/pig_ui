var merge = require('webpack-merge')
var prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  // BASE_API: "http://127.0.0.1:9999"
  BASE_API: "http://10.9.61.7:9999" // 服务器
  // BASE_API: "http://10.9.70.62:9999" // 赵旭东
  // BASE_API: "https://gateway.suxianginvestment.com/"
  // BASE_API: "http://10.9.70.205:9999" // 宋晓梦
  // BASE_API: "http://10.9.70.232:9999" // 卫剑飞
})

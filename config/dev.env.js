var merge = require('webpack-merge')
var prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  // BASE_API: "http://127.0.0.1:9999"
  // BASE_API: "http://10.9.60.141:9999" // 服务器
  // BASE_API: "http://10.9.70.62:9999" // 赵旭东
   //BASE_API: "http://10.9.70.231:9999" // 朱轶博
   BASE_API: "http://10.9.70.235:9999" // 本地开发机
  // BASE_API: "http://10.9.70.215:9999" // 崔胡斌
  // BASE_API: "http://10.9.70.232:9999" // 卫剑飞
})

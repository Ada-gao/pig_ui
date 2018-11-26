import { isvalidMobile } from './validate'

export function validMobile (rule, value, callback) {
  if (!value) {
    callback(new Error('请输入电话号码'))
  } else if (!isvalidMobile(value)) {
    callback(new Error('请输入正确的11位手机号'))
  } else {
    callback()
  }
}
export function validID (rule, value, callback) {
  if (!value) {
    callback(new Error('请输入身份证号码'))
  } else if (!isvalidID(value)) {
    callback(new Error('请输入正确的身份证号码'))
  } else {
    callback()
  }
}
// export function Validate (Vue, options) {
//   const validMobile = (rule, value, callback) => {
//     if (!value) {
//       callback(new Error('请输入电话号码'))
//     } else if (!isvalidMobile(value)) {
//       callback(new Error('请输入正确的11位手机号'))
//     } else {
//       callback()
//     }
//   }
//   Vue.prototype.validate_rules = function(item) {
//     let rules = []
//     if(item.required) {
//        rules.push({ required: true, message: '该输入项为必填项!', trigger: 'blur' });
//     }
//     if(item.maxLength) {
//        rules.push({ min:1,max:item.maxLength, message: '最多输入'+item.maxLength+'个字符!', trigger: 'blur' })
//     }
//     if(item.min&&item.max) {       
//        rules.push({ min:item.min,max:item.max, message: '字符长度在'+item.min+'至'+item.max+'之间!', trigger: 'blur' })
//     }
//     if(item.type) {
//       let type = item.type
//       switch(type) {
//         case 'mobile':
//           rules.push({ validator: validMobile, trigger: 'blur, change' })
//           break
//       }
//     }
//   }
// }
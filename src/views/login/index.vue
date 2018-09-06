<template>
  <div class="login-container">
    <!--忘记密码-->
    <el-form autoComplete="on"
             :model="loginForm1"
             :rules="loginRules1"
             ref="loginForm1"
             label-position="left"
             label-width="0px"
             v-show="pwdStep === 2"
             class="card-box login-form">
      <div class="fg-tit">找回密码</div>
      <div class="fg-cont">
        <el-steps :active="activeStep" align-center>
          <el-step title="身份验证"></el-step>
          <el-step title="重置登录密码"></el-step>
          <el-step title="操作成功"></el-step>
        </el-steps>
        <div class="step" v-if="activeStep === 0">
          <el-form-item prop="mobile">
            <el-input name="mobile"
                      type="text"
                      v-model="loginForm1.mobile"
                      autoComplete="on"
                      placeholder="请输入手机号或邮箱"/>
          </el-form-item>
          <el-form-item prop="smsCode">
            <el-col :span="12">
              <el-input name="smsCode"
                        type="text"
                        v-model="loginForm1.smsCode"
                        autoComplete="on"
                        placeholder="请输入验证码"/>
            </el-col>
            <el-col :span="12"
                    align="right"
                    class="certText">
              <a @click="getMobileCode1">{{text}}</a>
            </el-col>
          </el-form-item>

          <el-form-item>
            <el-button type="primary"
                       class="btn_light"
                       style="width:100%;"
                       :loading="loading"
                       @click.native.prevent="handleNext('loginForm1')">
              下一步
            </el-button>
          </el-form-item>
          <div class="forget_pw" @click="handleReturn">返回登录</div>
        </div>

        <div class="step" v-else-if="activeStep === 1">
          <el-form-item prop="newPW">
            <el-input type="text"
                      autoComplete="on"
                      placeholder="请输入新密码"
                      v-model="loginForm1.newPW"></el-input>
          </el-form-item>
          <el-form-item prop="newPW1">
            <el-input type="text"
                      autoComplete="on"
                      placeholder="请确认新密码"
                      v-model="loginForm1.newPW1"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary"
                       class="btn_light"
                       style="width:100%;"
                       :loading="loading"
                       @click.native.prevent="handleConfirm('loginForm1')">
              确定
            </el-button>
          </el-form-item>
          <div class="forget_pw" @click="handleReturn">返回登录</div>
        </div>

        <div class="step" v-else>
          <div class="fg-success">
            <i class="el-icon-circle-check-outline"></i>
            <span>设置成功！请妥善保存您的密码！</span>
          </div>
          <el-form-item>
            <el-button type="primary"
                       class="btn_light"
                       style="width:100%;"
                       :loading="loading"
                       @click.native="handleReturn">
              返回登录页
            </el-button>
          </el-form-item>
        </div>

      </div>
    </el-form>

    <el-form autoComplete="on"
             :model="loginForm"
             :rules="loginRules"
             ref="loginForm"
             label-position="left"
             label-width="0px"
             v-show="pwdStep === 1"
             class="card-box login-form">
      <h3 class="title">智投CRM系统登录</h3>
      <el-tabs v-model="activeName">
        <el-tab-pane label="账号/邮箱登录" name="first">
          <el-form-item prop="username">
            <span class="svg-container svg-container_login">
              <svg-icon icon-class="user"/>
            </span>
            <el-input name="username" type="text" v-model="loginForm.username" autoComplete="on" placeholder="用户名或邮箱"/>
          </el-form-item>
          <el-form-item prop="password">
            <span class="svg-container svg-container_login">
              <svg-icon icon-class="password"></svg-icon>
            </span>
              <el-input name="password" :type="pwdType" v-model="loginForm.password"
                        autoComplete="on"
                      placeholder="密码"></el-input>
            <span class="show-pwd" @click="showPwd">
              <svg-icon v-if="pwdType === 'password'" icon-class="eye"/>
              <svg-icon v-else icon-class="eyeShow"/>
            </span>
            <!-- <a class="forget-psd" @click="pwdStep=2">忘记密码</a> -->
          </el-form-item>

          <input name="randomStr" type="hidden" v-model="loginForm.randomStr"/>
          <el-form-item prop="code">
            <el-col :span="2">
              <span class="svg-container svg-container_login">
                <svg-icon icon-class="code"/>
              </span>
            </el-col>
            <el-col :span="11">
              <el-input name="code" type="text" v-model="loginForm.code" @keyup.enter.native="handleLogin"
                autoComplete="on" placeholder="验证码"/>
            </el-col>
            <el-col :span="10" align="right">
              <img :src="src" style="padding-bottom: 1px;vertical-align: -webkit-baseline-middle;" @click="refreshCode"/>
            </el-col>
          </el-form-item>

          <el-form-item>
            <el-button type="primary" class="btn_light" style="width:100%;" :loading="loading" @click.native.prevent="handleLogin">
              登录
            </el-button>
          </el-form-item>
          <div class="forget_pw" @click="handleForget">忘记密码</div>
        </el-tab-pane>
        <el-tab-pane label="短信登录" name="second">
          <el-form-item prop="mobile">
            <span class="svg-container svg-container_login">
              <svg-icon icon-class="mobile"/>
            </span>
            <el-input name="mobile" type="text" v-model="loginForm.mobile" autoComplete="on" placeholder="手机号"/>
          </el-form-item>
          <el-form-item>
            <el-col :span="2">
              <span class="svg-container svg-container_login">
                <svg-icon icon-class="numCode"/>
              </span>
            </el-col>
            <el-col :span="11">
              <el-input name="smsCode" type="text" v-model="loginForm.smsCode" autoComplete="on" placeholder="验证码"/>
            </el-col>
            <el-col :span="10" align="right">
              <a class="certText" @click="getMobileCode">{{text}}</a>
            </el-col>
          </el-form-item>

          <el-form-item>
            <el-button type="primary" class="btn_light" style="width:100%;" :loading="loading" @click.native.prevent="handleMobileLogin">
              登录
            </el-button>
          </el-form-item>
        </el-tab-pane>
        <!-- <el-tab-pane label="邮箱登录" name="three">
          <el-row>
            <el-col :span="8">
              <el-card :body-style="{ padding: '0px' }">
                <svg-icon icon-class="qq"></svg-icon>
                <div style="padding: 14px;">
                  <a href="http://dsb.frps.shop/social/qq">QQ登录</a>
                </div>
              </el-card>
            </el-col>
          </el-row>
        </el-tab-pane> -->
      </el-tabs>
    </el-form>
    <!-- <el-form autoComplete="on" :model="loginForm" :rules="loginRules" ref="loginForm" label-position="left"
             label-width="0px"
             v-show="pwdStep===2"
             class="card-box login-form">
      <h3 class="title">智投CRM系统登录</h3>
      <el-tabs v-model="activeName">
        <el-tab-pane label="用户验证" name="first">
          <el-form-item prop="username">
            <span class="svg-container svg-container_login">
              <svg-icon icon-class="user"/>
            </span>
            <el-input name="username" type="text" v-model="loginForm.username" autoComplete="on" placeholder="账号"/>
          </el-form-item>

          <input name="randomStr" type="hidden" v-model="loginForm.randomStr"/>
          <el-form-item>
            <el-col :span="2">
          <span class="svg-container">
            <svg-icon icon-class="code"/>
          </span>
            </el-col>
            <el-col :span="11">
              <el-input name="code" type="text" v-model="loginForm.code" autoComplete="on" placeholder="验证码"/>
            </el-col>
            <el-col :span="10" align="right">
              <img :src="src" style="padding-bottom: 1px" @click="refreshCode"/>
            </el-col>
          </el-form-item>

          <el-form-item style="border: none; text-align: center; background-color: transparent;">
            <el-button type="primary" :loading="loading" @click.native.prevent="pwdStep=3">
              下一步
            </el-button>
            <el-button @click="pwdStep=1">返回登陆框</el-button>
          </el-form-item>
        </el-tab-pane>
      </el-tabs>
    </el-form>
    <el-form autoComplete="on" :model="loginForm" :rules="loginRules" ref="loginForm" label-position="left"
             label-width="0px"
             v-show="pwdStep===3"
             class="card-box login-form">
      <h3 class="title">智投CRM系统登录</h3>
      <el-tabs v-model="activeName">
        <el-tab-pane label="重置密码" name="first">

          <el-form-item prop="password">
            <span class="svg-container">
              <svg-icon icon-class="password"></svg-icon>
            </span>
              <el-input name="password" :type="pwdType" @keyup.enter.native="handleLogin" v-model="loginForm.password"
                        autoComplete="on"
                      placeholder="新密码"></el-input>
            <span class="show-pwd" @click="showPwd"><svg-icon icon-class="eye"/></span>
          </el-form-item>
          <el-form-item prop="password">
            <span class="svg-container">
              <svg-icon icon-class="password"></svg-icon>
            </span>
              <el-input name="password" :type="pwdType" @keyup.enter.native="handleLogin" v-model="loginForm.password"
                        autoComplete="on"
                      placeholder="再次输入新密码"></el-input>
            <span class="show-pwd" @click="showPwd"><svg-icon icon-class="eye"/></span>
          </el-form-item>

          <input name="randomStr" type="hidden" v-model="loginForm.randomStr"/>

          <el-form-item>
            <el-button type="primary" style="width:100%;" :loading="loading" @click.native.prevent="pwdStep=1">
              确定
            </el-button>
          </el-form-item>
        </el-tab-pane>
      </el-tabs>
    </el-form> -->
  </div>
</template>

<script>
  // import { isvalidUsername } from '@/utils/validate'
  import request from '@/utils/request'
  import ElRow from 'element-ui/packages/row/src/row'
  // import { sendVcode } from '@/api/login'

  export default {
    components: { ElRow },
    name: 'login',
    data() {
      const validatePass = (rule, value, callback) => {
        if (!value || value.length < 6) {
          callback(new Error('密码不能小于6位'))
        } else {
          callback()
        }
      }
      return {
        activeStep: 0,
        time: 60,
        timeFlag: false,
        activeName: 'first',
        src: '',
        loginForm: {
          username: null,
          password: null,
          code: '',
          randomStr: Math.ceil(Math.random() * 100000) + '_' + Date.now(),
          mobile: null,
          smsCode: ''
        },
        loginForm1: {},
        loginRules1: {
          mobile: [
            {
              required: true,
              message: '请输入手机号或邮箱',
              trigger: 'blur'
            }
          ],
          smsCode: [
            {
              required: true,
              message: '请输入验证码',
              trigger: 'change, blur'
            }
          ],
          newPW: [
            {
              required: true,
              message: '请输入密码',
              trigger: 'blur'
            }
          ],
          newPW1: [
            {
              required: true,
              message: '请确认密码',
              trigger: 'blur'
            }
          ],
        },
        loginRules: {
          username: [{required: true, message: '请输入用户名或手机号', trigger: 'blur'}],
          password: [{required: true, trigger: 'blur', validator: validatePass}],
          code: [{required: true, message: '请输入验证码', trigger: 'change, blur'}],
        },
        loading: false,
        pwdType: 'password',
        pwdStep: 1,
        verifyTmer: null
      }
    },
    methods: {
      returnToLogin() {

      },
      refreshCode: function () {
        this.loginForm.randomStr = Math.ceil(Math.random() * 100000) + Date.now()
        this.src = '/admin/code/' + this.loginForm.randomStr
      },
      showPwd() {
        if (this.pwdType === 'password') {
          this.pwdType = ''
        } else {
          this.pwdType = 'password'
        }
      },
      handleLogin() {
        this.$refs.loginForm.validate(valid => {
          if (valid) {
            this.loading = true
            this.$store.dispatch('Login', this.loginForm).then(() => {
              this.loading = false
              this.$router.push({path: '/'})
              if (this.loginForm.password == '123456') {
                this.$message.success('请尽快重置密码')
              }
            }).catch(() => {
              this.loading = false
              this.refreshCode()
            })
          } else {
            console.log('想搞事情？？')
            return false
          }
        })
      },
      resetTemp() {
        this.loginForm1 = {
          mobile: undefined,
          smsCode: undefined,
          newPW: undefined,
          newPW1: undefined
        }
      },
      handleReturn() {
        this.resetTemp()
        this.time = 60
        this.pwdStep = 1
        clearInterval(this.verifyTimer)
        this.verifyTimer = null
        this.timeFlag = false
      },
      handleNext(formName) {
        this.$refs[formName].validate(valid => {
          if (valid) {
            request({
              url: '/admin/password/verify',
              method: 'post',
              params: {
                number: this.loginForm1.mobile,
                code: this.loginForm1.smsCode
              },
              data: {
                number: this.loginForm1.mobile,
                code: this.loginForm1.smsCode
              }
            }).then(res => {
              if (res.status === 200) {
                this.activeStep = 1
              } else {
                this.$message.error(res.data.msg)
              }
            }).catch(() => {
            })
          }
        })
      },
      handleConfirm(formName) {
        this.$refs[formName].validate(valid => {
          if (valid) {
            request({
              url: '/admin/password/reset',
              method: 'post',
              params: {
                number: this.loginForm1.mobile,
                password: this.loginForm1.newPW,
                confirmPassword: this.loginForm1.newPW1
              },
              data: {
                number: this.loginForm1.mobile,
                password: this.loginForm1.newPW,
                confirmPassword: this.loginForm1.newPW1
              }
            }).then(res => {
              if (res.status === 200) {
                this.activeStep = 2
              } else {
                this.$message.error(res.data.msg)
              }
            }).catch(() => {
            })
          }
        })
      },
      handleForget() {
        this.pwdStep = 2
        this.activeStep = 0
      },
      handleMobileLogin() {
        if(!this.loginForm.mobile) {
          this.$message.error('请输入手机号')
          return false
        }
        if(!this.loginForm.smsCode) {
          this.$message.error('请输入验证码')
          return false
        }
        if (!this.loginForm.smsCode || this.loginForm.smsCode.length !== 4) {
          this.$message.error('验证码不合法')
          return false
        }
        this.loading = true
        this.$store.dispatch('MobileLogin', this.loginForm).then(() => {
          this.loading = false
          this.$router.push({path: '/'})
        }).catch(() => {
          this.loading = false
        })
      },
      getMobileCode1: function () {
        const pattern = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/
        if (!this.loginForm1.mobile) {
          this.$message.error('请输入手机号码或邮箱')
        } else if (this.loginForm1.mobile.split('.').length > 1) {
          if (!pattern.test(this.loginForm1.mobile)) {
            this.$message.error('邮箱格式不正确')
          } else {
            console.log(this.loginForm1.mobile)
            request({
              url: '/admin/password/code',
              params: {
                number: this.loginForm1.mobile
              },
              method: 'get'
            }).then(response => {
              // console.log(response)
              if (response.data.data) {
                this.definiteTimer()
                this.$message.success('验证码发送成功')
              } else {
                this.$message.error(response.data.msg)
              }
            })
          }
          // this.$message.error('手机号格式不正确')
        } else {
          if (!(/^1[34578]\d{9}$/.test(this.loginForm1.mobile))) {
            this.$message.error('手机号格式不正确')
          } else {
            console.log(this.loginForm1.mobile)
            request({
              url: '/admin/password/code',
              params: {
                number: this.loginForm1.mobile
              },
              method: 'get'
            }).then(response => {
              // console.log(response)
              if (response.data.data) {
                this.definiteTimer()
                this.$message.success('验证码发送成功')
              } else {
                this.$message.error(response.data.msg)
              }
            })
          }
        }
      },
      getMobileCode: function () {
        if (!this.loginForm.mobile) {
          this.$message.error('请输入手机号码')
        } else if (!(/^1[34578]\d{9}$/.test(this.loginForm.mobile))) {
          this.$message.error('手机号格式不正确')
        } else {
          request({
            url: '/admin/smsCode/' + this.loginForm.mobile,
            method: 'get'
          }).then(response => {
            // console.log(response)
            if (response.data.data) {
              this.timer()
              this.$message.success('验证码发送成功')
            } else {
              this.$message.error(response.data.msg)
            }
          })
        }
      },
      timer: function () {
        if (this.time > 0) {
          this.timeFlag = true
          this.time--
          setTimeout(this.timer, 1000)
        } else {
          this.timeFlag = false
          this.time = 60
        }
      },
      definiteTimer() {
        if (this.time > 0) {
          this.timeFlag = true
          this.verifyTimer = setInterval(() => {
            --this.time
          }, 1000)
        } else {
          this.timeFlag = false
          this.time = 60
          setInterval(this.verifyTimer)
          this.verifyTimer = null
        }
      }
    },
    computed: {
      text: function () {
        if (this.timeFlag === false) {
          return '获取验证码'
        } else {
          return this.time > 0 ? this.time + 's' : '重新获取'
        }
      }
    },
    created() {
      this.src = '/admin/code/' + this.loginForm.randomStr
      var params = this.$route.query
      var access_token = params.access_token
      var refresh_token = params.refresh_token
      // console.log(access_token)
      // console.log(refresh_token)
      if (access_token !== undefined && refresh_token !== undefined) {
        console.log('执行到1')
        this.$store.dispatch('SocialLogin', params).then(() => {
          console.log('执行到2')
          this.loading = false
          this.$router.push({path: '/'})
        }).catch(() => {
          this.loading = false
        })
      }
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss">
  @import "src/styles/mixin.scss";

  $bg: '/static/img/banner.jpg';
  // $bg: #2d3a4b;
  $dark_gray: #889aa4;
  $light_gray: #00C1DF;

  .login-container {
    @include relative;
    height: 100vh;
    .el-tabs__item {
      color: #707070;
    }
    .el-tabs__item.is-active {
      color: $light_gray;
    }
    .el-tabs__active-bar {
      background-color: $light_gray;
    }
    background-image: url('/static/img/banner.jpg');
    background-size: cover;
    // background-color: $bg;
    input:-webkit-autofill {
      // -webkit-box-shadow: 0 0 0px 1000px transparent inset !important;
      box-shadow: 0 0 0 400px #fff inset;
      -webkit-text-fill-color: #000 !important;
    }
    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: #000;
      height: 47px;
    }
    .el-input {
      display: inline-block;
      height: 47px;
      width: 85%;
    }
    .tips {
      font-size: 14px;
      color: #fff;
      margin-bottom: 10px;
    }
    .svg-container {
      padding: 6px 5px 6px 15px;
      color: $dark_gray;
      vertical-align: middle;
      width: 30px;
      display: inline-block;
      &_login {
        font-size: 20px;
      }
    }
    .title {
      font-size: 26px;
      font-weight: 400;
      color: $light_gray;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }
    .login-form {
      position: absolute;
      left: 0;
      right: 0;
      width: 400px;
      padding: 35px 35px 15px 35px;
      margin: 120px auto;
      background-color: rgba(255, 255, 255, 0.9);
      .el-steps {
        margin-bottom: 25px;
      }
      .el-step__title {
        font-size: 14px;
      }
    }
    .el-form-item {
      // border: 1px solid rgba(255, 255, 255, 0.1);
      background: #fff;
      border-radius: 5px;
      color: #454545;
    }
    .show-pwd {
      position: absolute;
      right: 10px;
      top: 7px;
      font-size: 16px;
      color: $dark_gray;
      cursor: pointer;
      user-select: none;
    }
    .thirdparty-button {
      position: absolute;
      right: 35px;
      bottom: 28px;
    }
    .forget-psd {
      position: absolute;
      right: -70px;
      bottom: 0;
      color: #fff;
    }
    .el-tabs__content {
      overflow: visible;
    }
  }

  .image {
    width: 100%;
    display: block;
  }
  .btn_light {
    background-color: $light_gray;
  }
  .btn_light:hover {
    background-color: $light_gray;
  }
  .el-button--primary {
    background-color: $light_gray;
    border-color: $light_gray;
    outline: none;
  }
  .el-button--primary:focus {
    background-color: $light_gray;
    border-color: $light_gray;
    outline: none;
  }
  .el-button--primary:hover {
    background-color: #0299CC;
    border-color: #0299CC;
    outline: none;
  }
  .certText {
    padding-right: 10px;
    a {
      display: inline-block;
      vertical-align: -webkit-baseline-middle;
      color: $light_gray;
    }
  }
  .forget_pw {
    margin-bottom: 5px;
    text-align: right;
    font-family: PingFangSC-Regular;
    font-size: 14px;
    color: #707070;
    cursor: pointer;
  }
  .fg-tit {
    text-align: center;
    font-family: PingFangSC-Regular;
    font-size: 14px;
    color: #9B9B9B;
    margin-bottom: 20px;
  }
  .fg-success {
    margin: 60px 0;
    text-align: center;
    i {
      color: #13CE66;
      font-size: 40px;
    }
    i, span {
      vertical-align: middle;
    }
    span {
      font-family: PingFangSC-Regular;
      font-size: 14px;
      color: #262626;
      letter-spacing: 0;
    }
  }
</style>

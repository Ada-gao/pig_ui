<template>
  <div class="app-container calendar-list-container">

    <h3 v-if="type_is_update==1">修改产品</h3>
    <h3 v-else>实名认证审核</h3>
    <el-form v-if="!nextToUpdate" :model="form" :rules="rules" ref="form" label-width="120px">
      <div class="split-line"></div>
      <h5>客户信息</h5>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-form-item label="姓名：" prop="name">
            <span>{{form.name}}</span>
            <!-- <el-input v-model="form.name" placeholder="" readonly></el-input> -->
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="手机号：" prop="mobile">
            <span>{{form.mobile}}</span>
            <!-- <el-input v-model="form.mobile" placeholder="" readonly></el-input> -->
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="性别：" prop="gender">
            <span>{{form.gender|turnText(genderType)}}</span>
            <!-- <el-input v-model="form.gender" placeholder="" readonly></el-input> -->
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="国籍：" prop="nationality">
            <span>{{form.nationality|turnText(nationality)}}</span>
            <!-- <el-input v-model="form.nationality" placeholder="" readonly></el-input> -->
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="常住地区：" prop="city">
            <span>{{form.city}}</span>
            <!-- <el-input v-model="form.city" placeholder="" readonly></el-input> -->
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="录入时间：" prop="createTime">
            <span>{{form.createTime|parseTime('{y}-{m}-{d}')}}</span>
            <!-- <el-input v-model="form.city" placeholder="" readonly></el-input> -->
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="邮箱：" prop="email">
            <span>{{form.email}}</span>
            <!-- <el-input v-model="form.email" placeholder="" readonly></el-input> -->
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="微信：" prop="wechat">
            <span>{{form.wechat}}</span>
            <!-- <el-input v-model="form.wechat" placeholder="" readonly></el-input> -->
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="客户编号：" prop="clientNo">
            <span>{{form.clientNo}}</span>
            <!-- <el-input v-model="form.wechat" placeholder="" readonly></el-input> -->
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="理财师：" prop="userName">
            <span>{{form.userName}}</span>
            <!-- <el-input v-model="form.userName" placeholder="" readonly></el-input> -->
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="部门：" prop="userDeptName">
            <span>{{form.userDeptName}}</span>
            <!-- <el-input v-model="form.userDeptName" placeholder="" readonly></el-input> -->
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="客户来源：" prop="clientFrom">
            <span>{{form.clientFrom|turnText(clientFrom)}}</span>
            <!-- <el-input v-model="form.userDeptName" placeholder="" readonly></el-input> clientFrom-->
          </el-form-item>
        </el-col>
        <!-- <el-col :span="8">
          <el-form-item label="管理资产规模" prop="assetAmount">
            <el-input v-model="form.assetAmount" placeholder="请输入资产规模" readonly></el-input>
          </el-form-item>
        </el-col> -->
      </el-row>

      <div class="split-line"></div>

      <h5>认证和身份信息</h5>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-form-item label="实名认证状态：" prop="username">
            <span>{{clientStatus.realnameStatus}}</span>
            <!-- <el-input v-model="clientStatus.realnameStatus" placeholder="" readonly></el-input> -->
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="投资者类型：" prop="clientType">
            <span>{{clientStatus.clientType||'--'}}</span>
            <!-- <el-input v-model="clientStatus.clientType" placeholder="" readonly></el-input> -->
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="认证时间：" prop="clientType">
            <span>{{clientStatus.clientType||'--'}}</span>
            <!-- <el-input v-model="clientStatus.clientType" placeholder="" readonly></el-input> -->
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="证件类型：" prop="idType">
            <span>{{clientStatus.idType}}</span>
            <!-- <el-input v-model="clientStatus.idType" placeholder="" readonly></el-input> -->
          </el-form-item>
        </el-col>
        <el-col :span="8" v-if="idType">
          <el-form-item label="证件号码：" prop="idNo">
            <span>{{clientStatus.idNo}}</span>
            <!-- <el-input v-model="clientStatus.idNo" placeholder="" readonly></el-input> -->
          </el-form-item>
        </el-col>
        <el-col :span="8" v-if="idType">
          <el-form-item label="出生日期：" prop="date">
            <span>{{clientStatus.birthday}}</span>
            <!-- <el-input v-model="clientStatus.birthday" placeholder="" readonly></el-input> -->
          </el-form-item>
        </el-col>
        <el-col :span="8" v-if="idType">
          <el-form-item label="地址：" prop="address">
            <span>{{clientStatus.address}}</span>
            <!-- <el-input v-model="clientStatus.address" placeholder="" readonly></el-input> -->
          </el-form-item>
        </el-col>
        <el-col :span="8" v-if="idType">
          <el-form-item label="证件有效期：" prop="date">
            <span>{{clientStatus.idStartDate}} 至 {{clientStatus.idExpiration}}</span>
            <!-- <el-input v-model="clientStatus.idExpiration" placeholder="" readonly></el-input> -->
          </el-form-item>
        </el-col>

      </el-row>
      <el-row :span="22" v-if="idType" :gutter="20">
          <el-form-item label="证件照片：" prop="address">
            <el-col :span="4">
              <!--<el-card>-->
                <img :src="clientStatus.idFrontUrl"
                     ref="cardImg"
                     alt=""
                     @click="previewImg1"
                     style="height: 100px; width: 160px">
              <!--</el-card>-->
            </el-col>
            <el-col :span="4">
              <!--<el-card>-->
                <img :src="clientStatus.idBackUrl"
                     alt=""
                     @click="previewImg1"
                     style="height: 100px; width: 160px">
              <!--</el-card>-->
            </el-col>
          </el-form-item>
        </el-row>

      <div class="split-line"></div>

      <h5>客户银行卡信息</h5>
      <el-table :data="bankcardList" element-loading-text="给我一点时间" border fit
        highlight-current-row style="width: 100%"
        v-if="realnameStatus">
        <el-table-column align="center" label="开户银行">
          <template slot-scope="scope">
            <span>{{scope.row.bankName}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="银行卡号">
          <template slot-scope="scope">
            <span>{{scope.row.cardNo}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="银行卡图片">
          <template slot-scope="scope">
            <img :src="scope.row.cardFrontUrl" alt="" style="width: 50px;" @click="previewImg(scope.row.cardFrontUrl)">
          </template>
        </el-table-column>
      </el-table>

      <div class="split-line"></div>
      <el-row style="margin-top: 20px">
        <el-col :span="8">
          <el-form-item label="人群划分：">
            <el-select class="filter-item" v-model="form.crowds" placeholder="请选择">
              <el-option v-for="item in buyingCrowds" :key="item.value" :label="item.label" :value="item.value">
                <span style="float: left">{{ item.label }}</span>
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <!-- <el-col :span="22">
          <el-form-item label="备注" prop="bankName">
            <el-input
              type="textarea"
              :rows="2"
              placeholder="请输入内容"
              v-model="failReason">
          </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="22">
          <el-form-item>
            <span v-show="tip" class="warn_tip">请输入备注</span>
          </el-form-item>
        </el-col> -->
      </el-row>
    </el-form>

    <div v-if="!nextToUpdate" slot="footer" class="dialog-footer" style="text-align: center;">
      <el-button class="search_btn" @click="submitResult('2')">通 过</el-button>
      <el-button class="add_btn" v-if="dialogStatus=='create'" @click="submitResult('3')">不通过</el-button>
      <!-- <el-button v-else type="primary" @click="update('form')">修 改</el-button> -->
    </div>

    <!-- 预览图片 -->
    <el-dialog :visible.sync="dialogImgVisible" @close="handleClose">
      <div style="width:400px;height:400px;margin:0 auto">
        <img style="width:100%;height:100%;display: inline-block;"
             :src="dialogImageUrl"
             :class="'rotate_' + rotateCnt * 90"
             alt="">
      </div>
      <el-button type="primary"
                 @click="handleRotate"
                 style="display: block;margin:65px auto 0">顺时针翻转90度</el-button>
    </el-dialog>

    <el-dialog :visible.sync="dialogImgVisible1" class="swiper-dialog rotate-dialog">
      <!--<img width="100%" :src="dialogImageUrl" alt="">-->
      <el-carousel arrow="always"
                   indicator-position="none"
                   style="width:100%;text-align:center"
                   @change="carouselChange"
                   :autoplay="false">
        <el-carousel-item v-for="(item, index) in idcardImgs"
                          :key="item">
          <img :src="item"
               alt=""
               :class="'rotate_' + rotateCnt * 90"
               style="width:80%;height:100%">
        </el-carousel-item>
      </el-carousel>
      <el-button type="primary"
                 @click="handleRotate"
                 style="display: block;margin:0 auto">顺时针翻转90度</el-button>
    </el-dialog>

  </div>
</template>

<script>
  import { getObj, getClientStatus, getClientBankcard, putObj } from '@/api/client/realname'
  // import { getClientStatus, getClientBankcard } from '@/api/client/client'
  import { deptRoleList, fetchDeptTree } from '@/api/role'
  import waves from '@/directive/waves/index.js' // 水波纹指令
  import { transformText, transformText1, parseTime } from '@/utils'
  import { mapGetters } from 'vuex'
  import ElRadioGroup from 'element-ui/packages/radio/src/radio-group'
  import ElOption from "element-ui/packages/select/src/option"

  export default {
    components: {
      ElOption,
      ElRadioGroup },
    name: 'table_user',
    directives: {
      waves
    },
    data() {
      return {
        treeDeptData: [],
        checkedKeys: [],
        defaultProps: {
          children: 'children',
          label: 'name'
        },
        listLoading: true,
        listQuery: {
          page: 1,
          limit: 20
        },
        role: undefined,
        form: {},
        rules: {
          username: [
            {
              required: false,
              message: '请输入账户',
              trigger: 'blur'
            },
            {
              min: 3,
              max: 20,
              message: '长度在 3 到 20 个字符',
              trigger: 'blur'
            }
          ],
          password: [
            {
              required: false,
              message: '请输入密码',
              trigger: 'blur'
            },
            {
              min: 5,
              max: 20,
              message: '长度在 5 到 20 个字符',
              trigger: 'blur'
            }
          ],
          deptId: [
            {
              required: false,
              message: '请选择部门',
              trigger: 'blur'
            }
          ],
          role: [
            {
              required: false,
              message: '请选择角色',
              trigger: 'blur'
            }
          ]
        },
        statusOptions: ['0', '1'],
        rolesOptions: [],
        nextToUpdate: false,
        dialogDeptVisible: false,
        userAdd: false,
        userUpd: false,
        userDel: false,
        dialogStatus: 'create',
        textMap: {
          update: '编辑员工',
          create: '新增员工'
        },
        isDisabled: {
          0: false,
          1: true
        },
        sex: '',
        edu: '',
        IDsType: '',
        entryDate: '',
        maritalStatus: '',
        fileList: [],
        fileList1: [],
        fileList2: [],
        fileList3: [],
        indexList: [],
        type_is_update: '',
        productStus: '',
        clientStatus: {
          riskLevel: ''
        },
        remarkList: [],
        plannerList: [],
        bankcardList: [],
        productList: [],
        realnameStatus: '',
        idType: true,
        isClientType: '',
        failReason: '',
        tip: false,
        dialogImgVisible: false,
        dialogImgVisible1: false,
        dialogImageUrl: '',
        idcardImgs: [],
        bankcardImgs: [],
        rotateCnt: 0 // 旋转图片的次数
      }
    },
    computed: {
      ...mapGetters([
        'permissions',
        'productStatus',
        'genderType',
        'certificationStatus',
        'clientType',
        'idTypeOptions',
        'nationality',
        'buyingCrowds',
        'clientFrom'
      ])
    },
    filters: {
      statusFilter(status) {
        const statusMap = {
          0: '正常',
          1: '离职',
          9: '异常'
        }
        return statusMap[status]
      },
      turnText(val, list) {
        return transformText1(val, list)
      },
      parseTime (time) {
        if(!time) return
        let date = new Date(time)
        return parseTime(date)
      }
    },
    created() {
      this.getList()
      this.sys_user_add = this.permissions['sys_user_add']
      this.sys_user_upd = this.permissions['sys_user_upd']
      this.sys_user_del = this.permissions['sys_user_del']
      this.type_is_update = this.$route.path.substr(-1)
    },
    mounted() {
      // this.imgWidth = this.$refs.cardImg.width
    },
    methods: {
      getList() {
        const id = this.$route.params.id
        getClientStatus(id, '1').then(response => {
          this.clientStatus = JSON.parse(JSON.stringify(response.data))
          this.clientStatus.idFrontUrl += '!160x100'
          this.clientStatus.idBackUrl += '!160x100'
          this.idcardImgs.push(response.data.idFrontUrl, response.data.idBackUrl)
          // console.log(this.idcardImgs)
          this.realnameStatus = this.clientStatus.realnameStatus != 0 ? true : false // 认证状态判断
          this.isClientType = this.clientStatus.clientType == 0 ? true : false// 投资者类型判断
          // this.idType = this.clientStatus.idType == 0 ? true : false // 证件类型判断(0: 身份证)

          this.clientStatus.realnameStatus = transformText(this.certificationStatus, this.clientStatus.realnameStatus)
          this.clientStatus.clientType = transformText(this.clientType, this.clientStatus.clientType)
          this.clientStatus.idType = transformText(this.idTypeOptions, this.clientStatus.idType)
        })

        getObj(id, '1').then(response => {
          this.form = response.data
          // this.form.gender = transformText(this.genderType, this.form.gender)
          // this.form.nationality = transformText(this.nationality, this.form.nationality)
          if(this.realnameStatus) {
            getClientBankcard(id, '1').then(response => {
              if (response.status === 200) {
                this.bankcardList = JSON.parse(JSON.stringify(response.data))
                this.bankcardList.map(item => {
                  item.cardFrontUrl += '!160x100'
                })
              }
            }).catch(() => {
              this.bankcardList = []
            })
          }
        })
      },
      // handleDept() {
      //   // console.log('产品状态')
      // },
      submitResult(result) { //
        // if(result == 3 && !this.failReason) {
        //   this.tip = true
        //   return
        // }
        this.tip = false
        let params = {
          // failId: this.form.clientId,
          failReason: this.failReason,
          result: result,
          crowds: this.form.crowds
        }
        putObj(this.form.clientId, params).then(response => {
          if(response.status == 200) {
            this.$notify({
              title: '成功',
              message: '审核完成',
              type: 'success',
              duration: 2000
            })
            this.$router.push({path: '/client/realname'})
          }
        })
        // this.nextToUpdate = true
        // const set = this.$refs
        // this.form.role = this.role
        // set[formName].validate(valid => {
        //   if (valid) {
        //     addObj(this.form)
        //       .then(() => {
        //         this.nextToUpdate = true
        //         this.getList()
        //         this.$notify({
        //           title: '成功',
        //           message: '创建成功',
        //           type: 'success',
        //           duration: 2000
        //         })
        //       })
        //   } else {
        //     return false
        //   }
        // })
      },
      cancel(formName) {
        this.dialogFormVisible = false
        this.$refs[formName].resetFields()
      },
      update(formName) {
        const set = this.$refs
        this.form.role = this.role
        set[formName].validate(valid => {
          if (valid) {
            this.dialogFormVisible = false
            this.form.password = undefined
            putObj(this.form).then(() => {
              this.nextToUpdate = true
              this.getList()
              this.$notify({
                title: '成功',
                message: '修改成功',
                type: 'success',
                duration: 2000
              })
            })
          } else {
            return false
          }
        })
      },
      resetTemp() {
        this.form = {
          id: undefined,
          username: '',
          password: '',
          role: undefined
        }
      },
      previewImg(url) {
        this.dialogImgVisible = true
        this.dialogImageUrl = url.split('!160x100')[0]
      },
      previewImg1() {
        this.dialogImgVisible1 = true
      },
      carouselChange(value) {
        this.rotateCnt = 0
      },
      handleClose() {
        this.rotateCnt = 0
      },
      handleRotate() {
        this.rotateCnt === 3 ? this.rotateCnt = 0 : ++this.rotateCnt
      }
    }
    // mounted() {
    //   console.log(this.$route.params)
    //   this.type_is_update = this.$route.params
    // }
  }
</script>

<style lang="scss" scoped>
@import "src/styles/mixin.scss";
.el-select,
.el-date-editor {
  width: 100%;
}
.upfile-group {
  .btn-padding {
    @include padding;
  }
}
</style>


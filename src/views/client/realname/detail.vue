<template>
  <div class="app-container calendar-list-container">

    <h3 v-if="type_is_update==1">修改产品</h3>
    <h3 v-else>实名认证审核</h3>
    <el-form v-if="!nextToUpdate" :model="form" :rules="rules" ref="form" label-width="100px">
      <div style="border-bottom: 1px solid #ccc"></div>
      <h5>客户信息</h5>
      <el-row :gutter="20">
        <el-col :span="11">
          <el-form-item label="姓名" prop="name">
            <el-input v-model="form.name" placeholder="" readonly></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="手机号" prop="mobile">
            <el-input v-model="form.mobile" placeholder="" readonly></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="性别" prop="gender">
            <el-input v-model="form.gender" placeholder="" readonly></el-input>
            <!-- <el-select class="filter-item" v-model="form.gender" placeholder="请选择">
              <el-option v-for="item in genderType" :key="item.value" :value="item.value" :label="item.label">
                <span style="float: left">{{ item.label }}</span>
              </el-option>
            </el-select> -->
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="国籍" prop="nationality">
            <el-input v-model="form.nationality" placeholder="" readonly></el-input>
            <!-- <el-select class="filter-item" v-model="form.nationality" placeholder="请选择">
              <el-option v-for="item in nationality" :key="item.value" :value="item.value" :label="item.label">
                <span style="float: left">{{ item.label }}</span>
              </el-option>
            </el-select> -->
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="常住地区" prop="city">
            <el-input v-model="form.city" placeholder="" readonly></el-input>
            <!-- <el-cascader
              size="large"
              :options="options"
              :props="defaultProps2"
              v-model="form.city"
              @change="handleChange">
            </el-cascader> -->
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="form.email" placeholder="" readonly></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="微信" prop="wechat">
            <el-input v-model="form.wechat" placeholder="" readonly></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="理财师" prop="userName">
            <el-input v-model="form.userName" placeholder="" readonly></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="部门" prop="deptName">
            <el-input v-model="form.userDeptName" placeholder="" readonly></el-input>
          </el-form-item>
        </el-col>
        <!-- <el-col :span="11">
          <el-form-item label="管理资产规模" prop="assetAmount">
            <el-input v-model="form.assetAmount" placeholder="请输入资产规模" readonly></el-input>
          </el-form-item>
        </el-col> -->
      </el-row>

      <div style="border-bottom: 1px solid #ccc"></div>
      
      <h5>客户状态</h5>
      <el-row :gutter="20">
        <el-col :span="11">
          <el-form-item label="实名认证状态" prop="username">
            <el-input v-model="clientStatus.realnameStatus" placeholder="" readonly></el-input>
            <!-- <el-select class="filter-item" v-model="clientStatus.realnameStatus" placeholder="请选择">
              <el-option v-for="item in certificationStatus" :key="item.value" :value="item.value" :label="item.label">
                <span style="float: left">{{ item.label }}</span>
              </el-option>
            </el-select> -->
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="投资者身份" prop="clientType">
            <el-input v-model="clientStatus.clientType" placeholder="" readonly></el-input>
            <!-- <el-select class="filter-item" v-model="clientStatus.clientType" placeholder="请选择">
              <el-option v-for="item in clientType" :key="item.value" :value="item.value" :label="item.label">
                <span style="float: left">{{ item.label }}</span>
              </el-option>
            </el-select> -->
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="证件类型" prop="idType">
            <el-input v-model="clientStatus.idType" placeholder="请输入手机号" readonly></el-input>
            <!-- <el-select class="filter-item" v-model="clientStatus.idType" placeholder="请选择">
              <el-option v-for="item in idTypeOptions" :key="item.value" :value="item.value" :label="item.label">
                <span style="float: left">{{ item.label }}</span>
              </el-option>
            </el-select> -->
          </el-form-item>
        </el-col>
        <el-col :span="11" v-if="idType">
          <el-form-item label="证件号码" prop="idNo">
            <el-input v-model="clientStatus.idNo" placeholder="" readonly></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="11" v-if="idType">
          <el-form-item label="出生日期" prop="date">
            <el-input v-model="clientStatus.birthday" placeholder="" readonly></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="11" v-if="idType">
          <el-form-item label="证件有效期" prop="date">
            <el-input v-model="clientStatus.idExpiration" placeholder="" readonly></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="11" v-if="idType">
          <el-form-item label="地址" prop="address">
            <el-input v-model="clientStatus.address" placeholder="" readonly></el-input>
          </el-form-item>
        </el-col>
        
      </el-row>
      <el-row :span="22" v-if="idType" :gutter="20">
          <el-form-item label="身份证截图" prop="address">
            <el-col :span="5">
              <el-card>
                <img :src="clientStatus.idFrontUrl" alt="" style="max-height: 100px; width: 100%">
              </el-card>
            </el-col>
            <el-col :span="5">
              <el-card>
                <img :src="clientStatus.idBackUrl" alt="" style="max-height: 100px; width: 100%">
              </el-card>
            </el-col>
          </el-form-item>
        </el-row>

      <div style="border-bottom: 1px solid #ccc"></div>
      
      <h5>客户银行卡信息</h5>
      <el-row>
        <el-col :span="11">
          <el-form-item label="开户银行" prop="bankName">
            <el-input v-model="bankcardList.bankName" placeholder="" readonly></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="银行卡号" prop="cardNo">
            <el-input v-model="bankcardList.cardNo" placeholder="" readonly></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="22">
          <el-form-item label="银行卡截图" prop="cardPic">
            <el-col :span="8">
              <el-card>
                <img :src="bankcardList.cardFrontUrl" alt="" style="max-height: 100px;">
              </el-card>
            </el-col>
          </el-form-item>
        </el-col>
      </el-row>

      <div style="border-bottom: 1px solid #ccc"></div>
      <el-row style="margin-top: 20px">
        <el-col :span="22">
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
        </el-col>
      </el-row>
    </el-form>

    <div v-if="!nextToUpdate" slot="footer" class="dialog-footer" style="text-align: center;">
      <el-button class="search_btn" @click="submitResult('2')">通 过</el-button>
      <el-button class="add_btn" v-if="dialogStatus=='create'" @click="submitResult('3')">不通过</el-button>
      <!-- <el-button v-else type="primary" @click="update('form')">修 改</el-button> -->
    </div>

  </div>
</template>

<script>
  import { fetchList, getObj, getClientStatus, getClientBankcard, putObj } from '@/api/client/realname'
  // import { getClientStatus, getClientBankcard } from '@/api/client/client'
  import { deptRoleList, fetchDeptTree } from '@/api/role'
  import waves from '@/directive/waves/index.js' // 水波纹指令
  // import { parseTime } from '@/utils'
  import { transformText } from '@/utils'
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
        idType: '',
        isClientType: '',
        failReason: '',
        tip: false
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
        'nationality'
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
      }
    },
    created() {
      this.getList()
      this.sys_user_add = this.permissions['sys_user_add']
      this.sys_user_upd = this.permissions['sys_user_upd']
      this.sys_user_del = this.permissions['sys_user_del']
      this.type_is_update = this.$route.path.substr(-1)
    },
    methods: {
      getList() {
        let id = this.$route.params.id
        let obj = {
          clientId: id,
          type: 1
        }
        getClientStatus(id, '1').then(response => {
          this.clientStatus = response.data
          this.realnameStatus = this.clientStatus.realnameStatus != 0 ? true : false // 认证状态判断
          this.isClientType = this.clientStatus.clientType == 0 ? true : false// 投资者类型判断
          this.idType = this.clientStatus.idType == 0 ? true : false // 证件类型判断(0: 身份证)

          this.clientStatus.realnameStatus = transformText(this.certificationStatus, this.clientStatus.realnameStatus)
          this.clientStatus.clientType = transformText(this.clientType, this.clientStatus.clientType)
          this.clientStatus.idType = transformText(this.idTypeOptions, this.clientStatus.idType)
        })

        getObj(id, '1').then(response => {
          this.form = response.data

          this.form.gender = transformText(this.genderType, this.form.gender)
          this.form.nationality = transformText(this.nationality, this.form.nationality)
          if(this.realnameStatus) {
            getClientBankcard(id, '1').then(response => {
              this.bankcardList = response.data
            })
          }
        })
        
      },
      handleDept() {
        console.log('产品状态')
      },
      submitResult(result) { // 
        if(result == 3 & !this.failReason) {
          this.tip = true
          return
        }
        this.tip = false
        let params = {
          // failId: this.form.clientId,
          failReason: this.failReason,
          result: result
        }
        putObj(this.form.clientId, params).then(response => {
          console.log(response.code)
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


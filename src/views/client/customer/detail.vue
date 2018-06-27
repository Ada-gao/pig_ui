<template>
  <div class="app-container calendar-list-container">

    <h3 v-if="!isReadonly">编辑客户信息</h3>
    <h3 v-else>客户详情</h3>
    <el-form :model="form" :rules="rules" ref="form" label-width="100px">
      <div style="border-bottom: 1px solid #ccc"></div>
      <h5>客户信息</h5>
      <el-row :gutter="20">
        <el-col :span="11">
          <el-form-item label="姓名" prop="name">
            <el-input v-model="form.name" placeholder="请输入姓名" :readonly="isReadonly"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="手机号" prop="mobile">
            <el-input v-model="form.mobile" placeholder="请输入手机号" :readonly="isReadonly"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="性别" prop="gender">
            <!-- <el-input v-if="isReadonly" v-model="form.gender" placeholder="" :readonly="isReadonly"></el-input> -->
            <el-select class="filter-item" v-model="form.gender" placeholder="请选择" @change="changeGender">
              <el-option v-for="item in genderType" :key="item.value" :value="item.value" :label="item.label">
                <span style="float: left">{{ item.label }}</span>
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="国籍" prop="nationality">
            <!-- <el-input v-if="isReadonly" v-model="form.nationality" placeholder="" :readonly="isReadonly"></el-input> -->
            <el-select class="filter-item" v-model="form.nationality" placeholder="请选择" @change="changeNation">
              <el-option v-for="item in nationality" :key="item.value" :value="item.value" :label="item.label">
                <span style="float: left">{{ item.label }}</span>
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="11" v-show="showCity">
          <el-form-item label="常住地区" prop="city">
            <!-- <el-input v-if="isReadonly" v-model="form.city" placeholder="" :readonly="isReadonly"></el-input> -->
            <el-cascader
              size="large"
              style="width: 100%"
              :options="options"
              :props="defaultProps2"
              v-model="city">
            </el-cascader>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="form.email" placeholder="请输入邮箱" :readonly="isReadonly"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="微信" prop="wechat">
            <el-input v-model="form.wechat" placeholder="" :readonly="isReadonly"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="理财师" prop="userName">
            <el-input v-model="form.userName" placeholder="请输入理财师" readonly></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="部门" prop="deptName">
            <el-input v-model="form.userDeptName" placeholder="请选择部门" readonly></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="11" v-show="form.clientClass">
          <el-form-item label="管理资产规模" prop="assetAmount">
            <el-input v-model="form.assetAmount" placeholder="请输入资产规模" readonly></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <div v-if="!isReadonly" slot="footer" class="dialog-footer" style="text-align: center">
      <el-button @click="cancel('form')">取 消</el-button>
      <!-- <el-button v-if="dialogStatus=='create'" type="primary" @click="create('form')">确 定</el-button> -->
      <el-button type="primary" @click="update('form')">修 改</el-button>
    </div>

  </div>
</template>

<script>
  import { getObj, putObj } from '@/api/client/client'
  import { deptRoleList, fetchDeptTree } from '@/api/role'
  import waves from '@/directive/waves/index.js' // 水波纹指令
  // import { parseTime } from '@/utils'
  import { transformText } from '@/utils'
  import { mapGetters } from 'vuex'
  import ElRadioGroup from 'element-ui/packages/radio/src/radio-group'
  import ElOption from "element-ui/packages/select/src/option"
  import { provinceAndCityData } from 'element-china-area-data' // 省市区数据

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
        rolesOptions: [],
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
        rules: {
          name: [
            {required: true, trigger: 'blur'}
          ],
          mobile: [
            {required: true, trigger: 'blur'}
          ],
          // city: [
          //   {required: true, trigger: 'blur'}
          // ],
          nationality: [
            {required: true, trigger: 'blur'}
          ],
          marriageStatus: [
            {required: true, trigger: 'blur'}
          ],
          positionId: [
            {required: true, trigger: 'blur'}
          ],
          email: [
            {required: true, trigger: 'blur'}
          ]
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
        // realnameStatus: '',
        // idType: '',
        // isCertificationType: '',
        defaultProps2: {
          value: 'label'
        },
        options: provinceAndCityData,
        showCity: false,
        city: [],
        isReadonly: false,
        backClientClass: 0, // 0:潜客，1:客户
        gender: '',
        nationalityNum: ''
      }
    },
    computed: {
      ...mapGetters([
        'permissions',
        // 'productStatus',
        'genderType',
        // 'certificationStatus',
        // 'certificationType',
        // 'idTypeOptions',
        'nationality'
      ])
    },
    created() {
      this.getList()
      this.sys_user_add = this.permissions['sys_user_add']
      this.sys_user_upd = this.permissions['sys_user_upd']
      this.sys_user_del = this.permissions['sys_user_del']
      this.type_is_update = this.$route.path.substr(-1)

      if(this.$route.params.isView == 0) {
        // 查看
        this.isReadonly = true
      } else {
        // 编辑
        this.isReadonly = false
      }
    },
    methods: {
      getList() {
        let id = this.$route.params.id
        let type = 2
        
        getObj(id, type).then(response => {
          this.form = response.data
          // this.city = response.data.city
          this.backClientClass = this.form.clientClass

          if(this.form.city) {
            this.showCity = true
          }

          let arr = []
          arr.push(this.form.city)
          this.city = arr

          // this.realnameStatus = this.form.realnameStatus == 2 ? true : false // 认证状态判断
          // this.idType = this.form.idType == 0 ? true : false // 证件类型判断
          // this.isCertificationType = this.form.certificationType == 0 ? true : false// 投资者类型判断
          this.gender = this.form.gender
          this.nationalityNum = this.form.nationality
          this.form.gender = transformText(this.genderType, this.form.gender)
          // this.form.realnameStatus = transformText(this.certificationStatus, this.form.realnameStatus)
          // this.form.certificationType = transformText(this.certificationType, this.form.certificationType)
          // this.form.idType = transformText(this.idTypeOptions, this.form.idType)
          this.form.nationality = transformText(this.nationality, this.form.nationality)
          
        })
      },
      handleDept() {
        console.log('产品状态')
      },
      cancel(formName) {
        this.dialogFormVisible = false
        window.history.back()
      },
      update(formName) {
        const set = this.$refs
        this.form.role = this.role
        this.form.gender = this.gender
        this.form.nationality = this.nationalityNum

        if(this.form.nationality == 1) {
          this.form.city = ''
        } else if(this.form.nationality == 0 & !this.city) {
          return null
        } else {
          if(this.city.length === 1 || this.city[1] === '市辖区') {
            this.form.city = this.city[0]
          } else {
            this.form.city = this.city[1]
          }
        }

        set[formName].validate(valid => {
          if (valid) {
            this.dialogFormVisible = false
            console.log(this.form)
            putObj(this.form.clientId, this.form).then((response) => {
              if(!response || response.status !== 200) return
              // this.getList()
              this.$notify({
                title: '成功',
                message: '修改成功',
                type: 'success',
                duration: 2000
              })
              if(this.backClientClass) {
                this.$router.push({path: '/client/customer'})
              } else {
                this.$router.push({path: '/client/potential'})
              }
            })
          } else {
            return false
          }
        })
      },
      changeNation(val) {
        console.log(val)
        this.nationalityNum = val
        if(val == 0) {
          this.showCity = true
        } else {
          this.showCity = false
        }
      },
      changeGender(val) {
        this.gender = val
      }
    }
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


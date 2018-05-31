<template>
  <div class="app-container calendar-list-container">

    <h3 v-if="type_is_update==1">修改产品</h3>
    <h3 v-else>客户详情</h3>
    <el-form :model="form" :rules="rules" ref="form" label-width="100px">
      <div style="border-bottom: 1px solid #ccc"></div>
      <h5>客户信息</h5>
      <el-row :gutter="20">
        <el-col :span="11">
          <el-form-item label="姓名" prop="name">
            <el-input v-model="form.name" placeholder="请输入姓名"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="手机号" prop="mobile">
            <el-input v-model="form.mobile" placeholder="请输入手机号"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="性别" prop="gender">
            <el-select class="filter-item" v-model="form.gender" placeholder="请选择">
              <el-option v-for="item in genderType" :key="item.value" :value="item.value" :label="item.label">
                <span style="float: left">{{ item.label }}</span>
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="国籍" prop="nationality">
            <el-select class="filter-item" v-model="form.nationality" placeholder="请选择">
              <el-option v-for="item in nationality" :key="item.value" :value="item.value" :label="item.label">
                <span style="float: left">{{ item.label }}</span>
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="常住地区" prop="city">
            <el-input v-model="form.city" placeholder="请选择地区"></el-input>
            <!-- <el-cascader
              size="large"
              :options="options"
              :props="defaultProps2"
              v-model="form.city">
            </el-cascader> -->
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="form.email" placeholder="请输入邮箱"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="微信" prop="wechat">
            <el-input v-model="form.wechat" placeholder="请输入微信"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="理财师" prop="userName">
            <el-input v-model="form.userName" placeholder="请输入理财师" readonly></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="部门" prop="deptName">
            <el-input v-model="form.deptName" placeholder="请选择部门" readonly></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="11" v-show="form.clientClass">
          <el-form-item label="管理资产规模" prop="assetAmount">
            <el-input v-model="form.assetAmount" placeholder="请输入资产规模" readonly></el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <div style="border-bottom: 1px solid #ccc"></div>
      
      <h5>客户状态</h5>
      <el-row :gutter="20">
        <el-col :span="11">
          <el-form-item label="实名认证状态" prop="username">
            <el-select class="filter-item" v-model="form.realnameStatus" placeholder="请选择">
              <el-option v-for="item in certificationStatus" :key="item.value" :value="item.value" :label="item.label">
                <span style="float: left">{{ item.label }}</span>
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="11" v-if="realnameStatus">
          <el-form-item label="投资者身份" prop="certificationType">
            <el-select class="filter-item" v-model="form.certificationType" placeholder="请选择">
              <el-option v-for="item in certificationType" :key="item.value" :value="item.value" :label="item.label">
                <span style="float: left">{{ item.label }}</span>
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="11" v-if="realnameStatus">
          <el-form-item label="证件类型" prop="idType">
            <el-select class="filter-item" v-model="form.idType" placeholder="请选择">
              <el-option v-for="item in idTypeOptions" :key="item.value" :value="item.value" :label="item.label">
                <span style="float: left">{{ item.label }}</span>
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="11" v-if="realnameStatus & idType">
          <el-form-item label="证件号码" prop="idNo">
            <el-input v-model="form.idNo" placeholder="请输入证件号码" readonly></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="11" v-if="realnameStatus & idType">
          <el-form-item label="出生日期" prop="date">
            <el-date-picker
              v-model="clientStatus.birthday"
              type="birthday"
              placeholder="选择日期">
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="11" v-if="realnameStatus & idType">
          <el-form-item label="证件有效期" prop="date">
            <!-- idStartDate -->
            <el-date-picker
              v-model="clientStatus.idExpiration"
              type="date"
              placeholder="选择日期">
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="11" v-if="realnameStatus & idType">
          <el-form-item label="地址" prop="address">
            <el-input v-model="form.address" placeholder="请输入地址" readonly></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="11" v-if="isCertificationType & realnameStatus & idType">
          <el-form-item label="风险测评" prop="riskLevel">
            <el-input v-model="clientStatus.riskLevel" placeholder="请输入风险测评" readonly></el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <div style="border-bottom: 1px solid #ccc"></div>
      
      <h5 v-if="realnameStatus">客户银行卡信息</h5>
      <el-row v-if="realnameStatus">
        <el-col :span="11">
          <el-form-item label="开户银行" prop="bankName">
            <el-input v-model="bankcardList.bankName" placeholder="请输入开户银行" readonly></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="银行卡号" prop="cardNo">
            <el-input v-model="bankcardList.cardNo" placeholder="请输入银行卡号" readonly></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="22">
          <el-form-item label="银行卡截图" prop="cardPic">
            <el-col :span="5">
              <el-card>
                <img style="width: 100%" :src="bankcardList.cardFrontUrl" alt="">
              </el-card>
            </el-col>
            <!-- <el-card>
              <img :src="bankcardList.cardFrontUrl" alt="">
            </el-card> -->
          </el-form-item>
        </el-col>
        <!-- <el-col :span="8">
          
        </el-col>
        <el-col :span="8">
          <el-card>
            <img :src="bankcardList.cardBackUrl" alt="">
          </el-card>
        </el-col> -->
      </el-row>

      <div style="border-bottom: 1px solid #ccc"></div>
      
      <h5 v-if="realnameStatus">客户已购买产品</h5>
      <el-table :data="productList" element-loading-text="给我一点时间" border fit
        highlight-current-row style="width: 100%" v-if="realnameStatus">
        <el-table-column align="center" label="产品名称">
          <template slot-scope="scope">
            <span>{{scope.row.productName}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="产品分类">
          <template slot-scope="scope">
            <span>{{scope.row.productTypeName}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="产品期限">
          <template slot-scope="scope">
            <span>{{scope.row.tradeDate}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="风险等级">
          <template slot-scope="scope">
            <span>{{scope.row.productRiskLevel}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="募集规模">
          <template slot-scope="scope">
            <span>{{scope.row.amount}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="年化收益率">
          <template slot-scope="scope">
            <span>{{scope.row.remark}}</span>
          </template>
        </el-table-column>
      </el-table>

      <div style="border-bottom: 1px solid #ccc"></div>
      
      <h5>客户备注</h5>
      <el-table :data="remarkList" element-loading-text="给我一点时间" border fit
        highlight-current-row style="width: 100%">
        <el-table-column align="center" label="备注信息">
          <template slot-scope="scope">
            <span>{{scope.row.remark}}</span>
          </template>
        </el-table-column>
      </el-table>
      

      <div style="border-bottom: 1px solid #ccc"></div>
      
      <h5>客户理财师变动列表</h5>
      <el-table :data="plannerList" element-loading-text="给我一点时间" border fit
        highlight-current-row style="width: 100%">

        <el-table-column align="center" label="时间">
          <template slot-scope="scope">
            <span>{{scope.row.createTime}}</span>
          </template>
        </el-table-column>

        <el-table-column align="center" label="状态">
          <template slot-scope="scope">
            <span>{{scope.row.changeReason}}</span>
          </template>
        </el-table-column>

        <el-table-column align="center" label="理财师">
          <template slot-scope="scope">
            <span>{{scope.row.plannerName}}</span>
          </template>
        </el-table-column>

      </el-table>

      <!-- <div style="border-bottom: 1px solid #ccc"></div> -->
      
      <!-- <h5>客户已购买产品列表</h5> -->
    </el-form>

    <!-- <div v-if="!nextToUpdate" slot="footer" class="dialog-footer" style="text-align: right;">
      <el-button @click="cancel('form')">取 消</el-button>
      <el-button v-if="dialogStatus=='create'" type="primary" @click="create('form')">确 定</el-button>
      <el-button v-else type="primary" @click="update('form')">修 改</el-button>
    </div> -->

  </div>
</template>

<script>
  import { 
    fetchList, getObj, addObj, putObj, delObj, getClientStatus, getClientRemark, getClientPlanner, getClientBankcard, getClientProducts
  } from '@/api/client/client'
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
        isCertificationType: '',
        defaultProps2: {
          value: 'label'
        },
        options: provinceAndCityData,
      }
    },
    computed: {
      ...mapGetters([
        'permissions',
        'productStatus',
        'genderType',
        'certificationStatus',
        'certificationType',
        'idTypeOptions',
        'nationality'
      ])
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
        
        getObj(id).then(response => {
          this.form = response.data

          this.realnameStatus = this.form.realnameStatus == 2 ? true : false // 认证状态判断
          this.idType = this.form.idType == 0 ? true : false // 证件类型判断
          this.isCertificationType = this.form.certificationType == 0 ? true : false// 投资者类型判断

          this.form.gender = transformText(this.genderType, this.form.gender)
          this.form.realnameStatus = transformText(this.certificationStatus, this.form.realnameStatus)
          this.form.certificationType = transformText(this.certificationType, this.form.certificationType)
          this.form.idType = transformText(this.idTypeOptions, this.form.idType)
          this.form.nationality = transformText(this.nationality, this.form.nationality)
          if(this.realnameStatus) {
            getClientBankcard(id).then(response => {
              this.bankcardList = response.data
            })
          }
          if(this.realnameStatus == 2) {
            getClientStatus(id).then(response => {
              this.clientStatus = response.data
            })
          }
        })
        getClientRemark(id).then(response => {
          this.remarkList = response.data
        })
        getClientPlanner(id).then(response => {
          this.plannerList = response.data
        })
       
        getClientProducts(id).then(response => {
          this.productList = response.data
        })
      },
      handleDept() {
        console.log('产品状态')
      },
      create(formName) { // 产品新增
        this.nextToUpdate = true
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
      handleRemove(file, fileList) {
        console.log(file, fileList);
      },
      handlePreview(file) {
        console.log(file);
      },
      handleExceed(files, fileList) {
        this.$message.warning(`当前限制选择 3 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
      },
      // beforeRemove(file, fileList) {
      //   return this.$confirm(`确定移除 ${ file.name }？`);
      // },
      beforeUpload(file) { // 限制上传文档类型
        console.log(file)
        const isFile = file.type === 'application/pdf'
        if (!isFile) {
          this.$message.error('只能上传pdf文档')
        }
        return isFile
      },
      handleChange1(file, fileList) { // 上传材料，列表展示
        this.fileList1 = fileList.slice(-3)
      },
      handleSelectionChange1(selection, row) { // 选中材料
        let uid = row.uid
        this.indexList.push(uid)
      },
      delfiles1() { // 删除材料
        this.indexList.forEach(id => {
          this.fileList1.forEach((item, index) => {
            if(item.uid === id) {
              this.fileList1.splice(index, 1)
            }
          })
        })
      },
      handleChange2(file, fileList) { // 上传材料，列表展示
        this.fileList2 = fileList.slice(-3)
      },
      handleSelectionChange2(selection, row) { // 选中材料
        let uid = row.uid
        this.indexList.push(uid)
      },
      delfiles2() { // 删除材料
        this.indexList.forEach(id => {
          this.fileList2.forEach((item, index) => {
            if(item.uid === id) {
              this.fileList2.splice(index, 1)
            }
          })
        })
      },
      handleChange3(file, fileList) { // 上传材料，列表展示
        this.fileList3 = fileList.slice(-3)
      },
      handleSelectionChange3(selection, row) { // 选中材料
        let uid = row.uid
        this.indexList.push(uid)
      },
      delfiles3() { // 删除材料
        this.indexList.forEach(id => {
          this.fileList3.forEach((item, index) => {
            if(item.uid === id) {
              this.fileList3.splice(index, 1)
            }
          })
        })
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


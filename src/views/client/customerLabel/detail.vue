<template>
  <div class="app-container calendar-list-container">

    <h3>客户详情</h3>
    <el-form :model="form" ref="form" label-width="120px">
      <div class="split-line"></div>
      <h5>客户信息</h5>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-form-item label="姓名：" prop="name">
            <span>{{form.name}}</span>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="手机号：" prop="mobile">
            <span>{{form.mobile}}</span>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="性别：" prop="gender">
            <span>{{form.gender|turnText1(genderType)}}</span>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="国籍：" prop="nationality">
            <span>{{form.nationality|turnText1(nationality)}}</span>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="常住地区：" prop="city">
            <span>{{form.city}}</span>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="录入时间：" prop="createTime">
            <span>{{form.createTime|parseTime('{y}-{m}-{d}')}}</span>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="邮箱：" prop="email">
            <span>{{form.email}}</span>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="微信：" prop="wechat">
            <span>{{form.wechat}}</span>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="客户编号：" prop="clientNo">
            <span>{{form.clientNo}}</span>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="理财师：" prop="userName">
            <span>{{form.userName}}</span>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="部门：" prop="userDeptName">
            <span>{{form.userDeptName}}</span>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="客户来源：" prop="clientFrom">
            <span>{{form.clientFrom|turnText1(clientFrom)}}</span>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="客户级别：" prop="clientGrade">
            <span>{{form.clientGrade}}</span>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="资产管理规模：" prop="assetAmount">
            <span>{{form.assetAmount||0}}万</span>
          </el-form-item>
        </el-col>
      </el-row>

      <div class="split-line"></div>

      <h5>客户标签</h5>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-form-item label="客户标签：" prop="username">
            <span>{{form.realnameStatus|turnText1(certificationStatus)}}</span>
          </el-form-item>
        </el-col>
      </el-row>
      <div class="split-line"></div>

      <h5>客户状态</h5>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-form-item label="实名认证状态：" prop="username">
            <span>{{form.realnameStatus|turnText1(certificationStatus)}}</span>
          </el-form-item>
        </el-col>
        <el-col :span="8" v-if="realnameStatus">
          <el-form-item label="投资者类型：" prop="clientType">
            <span>{{clientStatus.clientType|turnText1(clientType)}}</span>
          </el-form-item>
        </el-col>
        <el-col :span="8" v-if="realnameStatus">
          <el-form-item label="认证时间：" prop="clientType">
            <span>{{clientStatus.certificationDate|parseTime('{y}-{m}-{d}')||'--'}}</span>
          </el-form-item>
        </el-col>
        <el-col :span="8" v-if="realnameStatus">
          <el-form-item label="证件类型：" prop="idType">
            <span>{{clientStatus.idType|turnText1(idTypeOptions)}}</span>
          </el-form-item>
        </el-col>
        <el-col :span="8" v-if="realnameStatus && idType">
          <el-form-item label="证件号码：" prop="idNo">
            <span>{{clientStatus.idNo}}</span>
          </el-form-item>
        </el-col>
        <el-col :span="8" v-if="realnameStatus && idType">
          <el-form-item label="出生日期：" prop="date">
            <span>{{clientStatus.birthday}}</span>
          </el-form-item>
        </el-col>
        <el-col :span="8" v-if="realnameStatus && idType">
          <el-form-item label="地址：" prop="address">
            <span>{{clientStatus.address}}</span>
          </el-form-item>
        </el-col>
        <el-col :span="8" v-if="realnameStatus && idType">
          <el-form-item label="证件有效期：" prop="date">
            <span>{{clientStatus.idStartDate}} 至 {{clientStatus.idExpiration}}</span>
          </el-form-item>
        </el-col>
        <el-col :span="8" v-if="realnameStatus && idType">
          <el-form-item label="人群划分：" prop="crowds">
            <span>{{clientStatus.crowds|turnText1(buyingCrowds)}}</span>
          </el-form-item>
        </el-col>
        <el-col :span="8" v-if="isClientType && realnameStatus && idType">
          <el-form-item label="风险测评：" prop="riskLevel">
            <span>{{clientStatus.riskLevel}}</span>
          </el-form-item>
        </el-col>
        <el-col :span="8" v-if="isClientType && realnameStatus && idType" style="white-space: nowrap">
          <el-form-item label="风险评估表填写时间：" prop="riskLevel">
            <span style="padding-left: 20px;">{{clientStatus.riskAuditTime|parseTime('{y}-{m}-{d}')||'--'}}</span>
          </el-form-item>
        </el-col>
      </el-row>

    </el-form>
  </div>
</template>

<script>
  import { getObj } from '@/api/client/client'
  import waves from '@/directive/waves/index.js' // 水波纹指令
  import { transformText, parseTime, transformText1 } from '@/utils'
  import { mapGetters } from 'vuex'

  export default {
    components: {},
    name: 'table_user',
    directives: {
      waves
    },
    data() {
      return {
        role: undefined,
        form: {},
        sex: '',
        edu: '',
        IDsType: '',
        entryDate: '',
        maritalStatus: '',
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
        isClientType: false,
        defaultProps2: {
          value: 'label'
        },
        options: provinceAndCityData,
      }
    },
    filters: {
      turnText (val, list) {
        return transformText1(val, list)
      },
      parseTime (time) {
        if(!time) return
        let date = new Date(time)
        return parseTime(date)
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
        'clientFrom',
        'buyingCrowds'
      ])
    },
    created() {
      this.getList()
      this.sys_user_add = this.permissions['sys_user_add']
      this.sys_user_upd = this.permissions['sys_user_upd']
      this.sys_user_del = this.permissions['sys_user_del']
    },
    methods: {
      getList() {
        let id = this.$route.params.id

        getObj(id).then(response => {
          this.form = response.data

          this.realnameStatus = this.form.realnameStatus == 2 ? true : false // 认证状态判断
          // this.idType = this.form.idType == 0 ? true : false // 证件类型判断
          this.isClientType = this.form.clientType == 0 ? true : false// 投资者类型判断
          if(this.form.realnameStatus == 2) {
            getClientStatus(id).then(response => {
              this.clientStatus = response.data
            })
          }

        })
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
.app-container {
  border-color: #fff;
}
</style>


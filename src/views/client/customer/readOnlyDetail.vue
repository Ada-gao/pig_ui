<template>
  <div class="app-container calendar-list-container">

    <!-- <h3 v-if="type_is_update==1">修改产品</h3> -->
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
            <span>{{form.gender|turnText(genderType)}}</span>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="国籍：" prop="nationality">
            <span>{{form.nationality|turnText(nationality)}}</span>
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
            <span>{{form.clientFrom|turnText(clientFrom)}}</span>
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

      <div v-if="!isCLientLabel" class="split-line"></div>
      <h5 v-if="!isCLientLabel">客户标签</h5>
      <el-row v-if="!isCLientLabel" :gutter="20">
        <el-col :span="8">
          <el-form-item label="客户标签：" prop="username">
            <span v-for="item in clientLabelList">{{item.labelName}}</span>
          </el-form-item>
        </el-col>
      </el-row>
      
      <div class="split-line"></div>

      <h5>客户状态</h5>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-form-item label="实名认证状态：" prop="username">
            <span>{{form.realnameStatus|turnText(certificationStatus)}}</span>
          </el-form-item>
        </el-col>
        <el-col :span="8" v-if="realnameStatus">
          <el-form-item label="投资者类型：" prop="clientType">
            <span>{{clientStatus.clientType|turnText(clientType)}}</span>
          </el-form-item>
        </el-col>
        <el-col :span="8" v-if="realnameStatus">
          <el-form-item label="认证时间：" prop="clientType">
            <span>{{clientStatus.certificationDate|parseTime('{y}-{m}-{d}')||'--'}}</span>
          </el-form-item>
        </el-col>
        <el-col :span="8" v-if="realnameStatus">
          <el-form-item label="证件类型：" prop="idType">
            <span>{{clientStatus.idType|turnText(idTypeOptions)}}</span>
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
            <span>{{clientStatus.crowds|turnText(buyingCrowds)}}</span>
          </el-form-item>
        </el-col>
        <el-col :span="8" v-if="isClientType && realnameStatus && idType">
          <el-form-item label="风险测评：" prop="riskLevel">
            <span>{{clientStatus.riskLevel}}</span>
          </el-form-item>
        </el-col>
        <el-col :span="8" v-if="isClientType && realnameStatus && idType" style="white-space: nowrap">
          <el-form-item label="风险评估表填写时间：" prop="riskLevel">
            <span style="padding-left: 20px;">{{clientStatus.riskAuditTime}}</span>
          </el-form-item>
        </el-col>
      </el-row>


      <div v-if="realnameStatus&&isCLientLabel" class="split-line"></div>
      <h5 v-if="realnameStatus&&isCLientLabel">客户银行卡信息</h5>
      <el-table :data="bankcardList" element-loading-text="给我一点时间" border fit
        highlight-current-row style="width: 100%"
        v-if="realnameStatus&&isCLientLabel">
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
            <img :src="scope.row.cardFrontUrl" alt="" style="width: 50px;">
          </template>
        </el-table-column>
      </el-table>

      <div v-if="form.clientClass&&isCLientLabel" class="split-line"></div>

      <h5 v-if="form.clientClass&&isCLientLabel">客户已购买产品</h5>
      <el-table :data="productList" element-loading-text="给我一点时间" border fit
        highlight-current-row style="width: 100%" v-if="form.clientClass&&isCLientLabel">
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
            <span>{{scope.row.tradeDate|parseTime('{y}-{m}-{d}')}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="风险等级">
          <template slot-scope="scope">
            <span>{{scope.row.productRiskLevel}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="募集规模（万）">
          <template slot-scope="scope">
            <span>{{scope.row.amount}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="购买金额（万）">
          <template slot-scope="scope">
            <span>{{scope.row.amount}}</span>
          </template>
        </el-table-column>
         <el-table-column align="center" label="起息日">
          <template slot-scope="scope">
            <span>{{scope.row.valueDate|parseTime('{y}-{m}-{d}')}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="收益对标基准">
          <template slot-scope="scope">
            <span>{{scope.row.productRiskLevel}}</span>
          </template>
        </el-table-column>
      </el-table>

      <div class="split-line"></div>

      <h5 v-if="isCLientLabel">客户备注</h5>
      <el-table :data="remarkList" element-loading-text="给我一点时间" border fit
        highlight-current-row style="width: 100%" v-if="isCLientLabel">
        <el-table-column align="center" label="备注信息">
          <template slot-scope="scope">
            <span>{{scope.row.remark}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="时间">
          <template slot-scope="scope">
            <span>{{scope.row.createTime|parseTime('{y}-{m}-{d}')}}</span>
          </template>
        </el-table-column>
      </el-table>

      <div v-if="isCLientLabel" class="split-line"></div>

      <h5 v-if="isCLientLabel">客户理财师变动列表</h5>
      <el-table :data="plannerList" element-loading-text="给我一点时间" border fit
        highlight-current-row style="width: 100%" v-if="isCLientLabel">

        <el-table-column align="center" label="时间">
          <template slot-scope="scope">
            <span>{{scope.row.createTime|parseTime('{y}-{m}-{d}')}}</span>
          </template>
        </el-table-column>

        <el-table-column align="center" label="原因">
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
    </el-form>
  </div>
</template>

<script>
  import {
    fetchList, getObj, addObj, delObj, getClientStatus, getClientRemark, getClientPlanner, getClientBankcard, getClientProducts
  } from '@/api/client/client'
  import { getClientLabel } from '@/api/client/customerLabel'
  import { deptRoleList, fetchDeptTree } from '@/api/role'
  import waves from '@/directive/waves/index.js' // 水波纹指令
  import { transformText, parseTime, transformText1 } from '@/utils'
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
        listLoading: true,
        listQuery: {
          page: 1,
          limit: 20
        },
        role: undefined,
        form: {},
        textMap: {
          update: '编辑员工',
          create: '新增员工'
        },
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
        fromPath: '',
        isCLientLabel: true,
        clientLabelList: []
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
      // this.type_is_update = this.$route.path.substr(-1)
      this.fromPath = localStorage.getItem('activeUrl')
      this.isCLientLabel = this.fromPath === '/client/customerLabel' ? false : true // 判断只展示标签设置查询所需客户信息
    },
    methods: {
      getList() {
        let id = this.$route.params.id

        getObj(id).then(response => {
          this.form = response.data

          this.realnameStatus = this.form.realnameStatus == 2 ? true : false // 认证状态判断
          // this.idType = this.form.idType == 0 ? true : false // 证件类型判断
          this.isClientType = this.form.clientType == 0 ? true : false// 投资者类型判断
          if(this.realnameStatus) {
            getClientBankcard(id).then(response => {
              this.bankcardList = response.data || []
            })
          }
          if(this.form.realnameStatus == 2) {
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
          this.productList.map(ele => {
            // ele.valueDate = ele.valueDate ? parseTime(ele.valueDate, '{y}-{m}-{d}') : ''
          })
        })
        if (!this.isCLientLabel) return
        getClientLabel(id).then(res => {
          console.log(res.data)
          this.clientLabelList = res.data
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


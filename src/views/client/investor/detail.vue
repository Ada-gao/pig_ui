<template>
  <div class="app-container calendar-list-container pro-detail-radio">
    <el-radio-group v-model="step" @change="handleChangeStep" style="margin-bottom: 30px;">
      <el-radio-button label="1">客户审核信息</el-radio-button>
      <el-radio-button style="border-radius: 0" label="2">客户信息</el-radio-button>
    </el-radio-group>
    <!-- <h3 v-if="type_is_update==1"></h3>
    <h3 v-else>审核信息</h3> -->
    <el-form v-show="step==='1'" :model="form" ref="form" label-width="100px">
      <div class="split-line"></div>

      <div class="general-investor">
        <h5 v-if="investorType == 0">风险测评问卷审核</h5>
        <h5 v-else>上传资料审核</h5>
        <el-table :data="certInfo" v-loading="listLoading" element-loading-text="给我一点时间" border fit
                highlight-current-row style="width: 100%">
          <el-table-column align="center" label="风险评级" v-if="investorType == 0">
            <template slot-scope="scope">
              </el-select>
              <el-select v-model="scope.row.riskLevel" @change="handleChange" style="width: 50%">
                <el-option v-for="item in customerRiskLevel" :key="item.value" :label="item.label" :value="item.value">
                  <span style="float: left">{{ item.label }}</span>
                </el-option>
              </el-select>
              <div class="warn_msg" style="text-align: center;" v-show="selectMsg">
                <svg-icon icon-class="warn"></svg-icon> 风险评级为必选</div>
            </template>
          </el-table-column>
          <el-table-column align="center" label="认证原因" v-else>
            <template slot-scope="scope">
              <span>{{scope.row.applyReason}}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="风险测评问卷（图片）">
            <template slot-scope="scope">
              <div v-for="item in scope.row.urls" :data="scope.row.urls" style="display: inline-block; margin-right: 10px">
                <a href="#"><img :src="item" alt="" style="width: 50px"></a>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!-- <div class="professional-investor" v-else>
        <el-table :data="certInfo" v-loading="listLoading" element-loading-text="给我一点时间" border fit
                highlight-current-row style="width: 100%">
          <el-table-column label="（图片）">
            <template slot-scope="scope">
              <div v-for="item in scope.row.urls" :data="scope.row.urls" style="display: inline-block; margin-right: 10px">
                <a href="#"><img :src="item" alt="" style="width: 50px"></a>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div> -->
      <div class="split-line" style="margin-top: 20px"></div>
      <h5>过往客户审核日志</h5>
      <el-table :data="list" v-loading="listLoading" element-loading-text="给我一点时间" border fit
                highlight-current-row style="width: 100%">

        <el-table-column align="center" label="提交时间">
          <template slot-scope="scope">
            <span>{{scope.row.commitDate|parseTime('{y}-{m}-{d}')}}</span>
          </template>
        </el-table-column>
        
        <el-table-column align="center" label="认证客户">
          <template slot-scope="scope">
            <span>{{scope.row.clientName}}</span>
          </template>
        </el-table-column>

        <el-table-column align="center" label="投资者类型">
          <template slot-scope="scope">
            <span>{{scope.row.certificationType|turnText(certificationType)}}</span>
          </template>
        </el-table-column>
        
        <el-table-column align="center" label="审核人">
          <template slot-scope="scope">
            <span>{{scope.row.auditName}}</span>
          </template>
        </el-table-column>
        
        <el-table-column align="center" label="审核时间">
          <template slot-scope="scope">
            <span>{{scope.row.auditDate|parseTime('{y}-{m}-{d}')}}</span>
          </template>
        </el-table-column>
        
        <el-table-column align="center" label="审核结果">
          <template slot-scope="scope">
            <span>{{scope.row.auditResult|turnText(certificationStatus)}}</span>
          </template>
        </el-table-column>
      </el-table>
      <!-- <div v-if="isView == 1">
        <div class="split-line" style="margin-top: 20px"></div>
        <el-row style="margin-top: 20px">
          <el-col :span="22">
            <el-form-item label="备注" prop="bankName">
              <el-input
                type="textarea"
                :rows="2"
                placeholder="请输入内容"
                v-model="failReason">
              </el-input>
              <div class="warn_msg" v-show="tip"><svg-icon icon-class="warn"></svg-icon> 请输入备注</div>
            </el-form-item>
          </el-col>
        </el-row>
      </div> -->
    </el-form>

    <div v-show="isView==1&&step==='1'" slot="footer" class="dialog-footer" style="text-align: center; margin-top: 20px">
      <el-button class="search_btn" @click="submitResult('2')">通 过</el-button>
      <el-button class="add_btn" @click="submitResult('3')">不通过</el-button>
    </div>
    <el-form v-show="step==='2'">
      <div class="split-line"></div>
      <h5>客户信息</h5>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-form-item label="姓名：" prop="name">
            <span>{{clientForm.name}}</span>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="手机号：" prop="mobile">
            <span>{{clientForm.mobile}}</span>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="性别：" prop="gender">
            <span>{{clientForm.gender|turnText(genderType)}}</span>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="国籍：" prop="nationality">
            <span>{{clientForm.nationality|turnText(nationality)}}</span>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="常住地区：" prop="city">
            <span>{{clientForm.city}}</span>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="录入时间：" prop="createTime">
            <span>{{clientForm.createTime|parseTime('{y}-{m}-{d}')}}</span>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="邮箱：" prop="email">
            <span>{{clientForm.email}}</span>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="微信：" prop="wechat">
            <span>{{clientForm.wechat}}</span>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="客户编号：" prop="clientNo">
            <span>{{clientForm.clientNo}}</span>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="理财师：" prop="userName">
            <span>{{clientForm.userName}}</span>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="部门：" prop="userDeptName">
            <span>{{clientForm.userDeptName}}</span>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="客户来源：" prop="clientFrom">
            <span>{{clientForm.clientFrom|turnText(clientFrom)}}</span>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="客户级别：" prop="clientGrade">
            <span>{{clientForm.clientGrade}}</span>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="资产管理规模：" prop="assetAmount">
            <span>{{clientForm.assetAmount||0}}万</span>
          </el-form-item>
        </el-col>
      </el-row>

      <div class="split-line"></div>

      <h5>客户状态</h5>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-form-item label="实名认证状态：" prop="username">
            <span>{{clientForm.realnameStatus|turnText(certificationStatus)}}</span>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="投资者类型：" prop="clientType">
            <span>{{clientStatus.clientType|turnText(clientType)}}</span>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="认证时间：" prop="clientType">
            <span>{{clientStatus.certificationDate|parseTime('{y}-{m}-{d}')||'--'}}</span>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="证件类型：" prop="idType">
            <span>{{clientStatus.idType|turnText(idTypeOptions)}}</span>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="证件号码：" prop="idNo">
            <span>{{clientStatus.idNo}}</span>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="出生日期：" prop="date">
            <span>{{clientStatus.birthday}}</span>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="地址：" prop="address">
            <span>{{clientStatus.address}}</span>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="证件有效期：" prop="date">
            <span>{{clientStatus.idStartDate}} 至 {{clientStatus.idExpiration}}</span>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="人群划分：" prop="crowds">
            <span>{{clientStatus.crowds|turnText(buyingCrowds)}}</span>
          </el-form-item>
        </el-col>
        <el-col :span="8" v-if="isClientType">
          <el-form-item label="风险测评：" prop="riskLevel">
            <span>{{clientStatus.riskLevel}}</span>
          </el-form-item>
        </el-col>
        <el-col :span="8" v-if="isClientType" style="white-space: nowrap">
          <el-form-item label="风险评估表填写时间：" prop="riskLevel">
            <span style="padding-left: 20px;">{{clientStatus.riskAuditTime}}</span>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script>
  import { getCertHistory, getCertInfo, putObj } from '@/api/client/investor'
  import { getObj, getClientStatus } from '@/api/client/client'
  import waves from '@/directive/waves/index.js' // 水波纹指令
  import { transformText1, parseTime } from '@/utils'
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
        statusOptions: ['0', '1'],
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
        sex: '',
        edu: '',
        IDsType: '',
        entryDate: '',
        maritalStatus: '',
        indexList: [],
        type_is_update: '',
        productStus: '',
        idType: '',
        isCertificationType: '',
        list: [],
        certInfo: [],
        failReason: '',
        riskLevel: '',
        clientId: '',
        investorType: '',
        isView: '',
        tip: false,
        selectMsg: false,
        step: '1',
        clientForm: {},
        clientStatus: {},
        isClientType: false
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
        'nationality',
        'customerRiskLevel',
        'clientFrom',
        'clientType',
        'buyingCrowds'
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
    methods: {
      getList() {
        this.clientId = this.$route.params.id
        let type = this.$route.params.type
        this.isView = this.$route.params.isView
        this.investorType = this.$route.params.type
        // let params = {
        //   type: '0' // 0: 普通投资者, 1:专业投资者
        // }
        // isView  0:查看， 1:审核
        getCertHistory(this.clientId, type).then(response => {
          this.list = response.data
          this.listLoading = false
        })
        getCertInfo(this.clientId, type).then(response => {
          this.listLoading = false
          this.certInfo = response.data
          // console.log(this.certInfo)
        })
      },
      getClient() {
        getObj(this.clientId).then(res => {
          this.clientForm = res.data
          this.isClientType = this.form.clientType == 0 ? true : false// 投资者类型判断
        })
        getClientStatus(this.clientId).then(response => {
          this.clientStatus = response.data
        })
      },
      handleChangeStep(val) {
        this.step = val
        if(this.step == 2) {
          this.getClient()
        }
        console.log(val)
      },
      submitResult(result) {
        if(this.investorType == 0 && !this.riskLevel) {
          this.selectMsg = true
          return
        }
        this.selectMsg = false
        // if(result == 3 && !this.failReason) {
        //   this.tip = true
        //   return
        // }
        let params = {
          // failId: this.form.clientId,
          // failReason: this.failReason,
          result: result,
          riskLevel: this.riskLevel
        }
        
        putObj(this.clientId, params).then(response => {
          if(response.status == 200) {
            this.$notify({
              title: '成功',
              message: '审核完成',
              type: 'success',
              duration: 2000
            })
            if(this.$route.params.type == 0) {
              this.$router.push({path: '/client/investor'})
            } else {
              this.$router.push({path: '/client/professionalInvestor'})
            }
          }
        })
      },
      handleChange(val) {
        this.riskLevel = val
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


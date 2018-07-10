<template>
  <div class="app-container calendar-list-container">

    <el-tabs v-model="activeName2" type="card" @tab-click="handleClick" class="transc">
      <el-tab-pane label="预约详情" name="first">
        <el-form :model="form" ref="form" label-width="100px">
          <div style="border-bottom: 1px solid #ccc"></div>
          <h5>客户信息</h5>
          <el-row :gutter="20">
            <el-col :span="11">
              <el-form-item label="客户姓名" prop="name">
                <el-input v-model="form.clientName" placeholder="" readonly></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="11">
              <el-form-item label="产品名称" prop="mobile">
                <el-input v-model="form.productName" placeholder="" readonly></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="11">
              <el-form-item label="客户编号" prop="gender">
                <el-input v-model="form.clientNo" placeholder="" readonly></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="11">
              <el-form-item label="部门" prop="deptName">
                <el-input v-model="form.userDeptName" placeholder="" readonly></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="11">
              <el-form-item label="理财师" prop="userName">
                <el-input v-model="form.userName" placeholder="" readonly></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="11" style="white-space: nowrap">
              <el-form-item label="管理资产规模" prop="assetAmount">
                <el-input v-model="form.assetAmount" placeholder="请输入资产规模" readonly></el-input>万
              </el-form-item>
            </el-col>
          </el-row>

          <div style="border-bottom: 1px solid #ccc"></div>

          <h5>预约信息</h5>
          <el-row :gutter="20">
            <el-col :span="11">
              <el-form-item label="预约编号" prop="username">
                <el-input v-model="form.appointmentCode" placeholder="" readonly></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="11" v-if="!statusH">
              <el-form-item label="预约状态" prop="clientType">
                <el-input v-model="form.status" placeholder="" readonly></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="11">
              <el-form-item label="预约时间" prop="idType">
                <el-input v-model="form.appointmentDate" placeholder="请输入手机号" readonly></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="11" style="white-space: nowrap">
              <el-form-item label="预约金额" prop="idNo">
                <el-input v-model="form.appointmentAmount" placeholder="" readonly></el-input>万
              </el-form-item>
            </el-col>
          </el-row>

          <div class="payInfo" v-if="orderStatus != 2 & statusH">
            <div style="border-bottom: 1px solid #ccc"></div>
            <h5>打款信息</h5>
            <el-row>
              <el-col :span="11">
                <el-form-item label="打款状态" prop="bankName">
                  <el-input v-model="form.status" placeholder="" readonly></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="11" style="white-space: nowrap">
                <el-form-item label="打款金额" prop="cardNo">
                  <el-input v-model="form.remitAmount" placeholder="" :readonly="status!=2001"></el-input>万
                </el-form-item>
              </el-col>
              <el-col :span="11" v-if="form.status">
                <el-form-item label="打款时间" prop="cardNo" v-if="status!=2001">
                  <el-input v-model="form.remitDate" placeholder="" :readonly="status!=2001"></el-input>
                </el-form-item>
                <el-form-item label="打款时间" prop="remitDate" v-if="status==2001">
                  <el-date-picker
                    v-model="form.remitDate"
                    type="date"
                    placeholder="选择日期">
                  </el-date-picker>
                </el-form-item>
              </el-col>
            </el-row>
          </div>

          <div class="contraInfo" v-if="orderStatus == 4">
            <div style="border-bottom: 1px solid #ccc"></div>
            <h5>合同信息</h5>
            <el-row>
              <el-col :span="11">
                <el-form-item label="合同编号" prop="bankName">
                  <el-input v-model="form.contractNo" placeholder="" readonly></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="11">
                <el-form-item label="合同状态" prop="cardNo">
                  <el-input v-model="form.status" placeholder="" readonly></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="11">
                <el-form-item label="快递单号" prop="cardNo">
                  <el-input v-model="form.expressNo" placeholder="" readonly></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="11">
                <el-form-item label="快递公司" prop="cardNo">
                  <el-input v-model="form.expressCompany" placeholder="" readonly></el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </div>

          <div class="bankCard" v-if="orderStatus != 2 & statusH">
            <div style="border-bottom: 1px solid #ccc"></div>

            <h5>客户银行卡信息</h5>
            <el-row>
              <el-col :span="11">
                <el-form-item label="银行卡名称" prop="bankName">
                  <el-input v-model="form.bankName" placeholder="" readonly></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="11">
                <el-form-item label="支行名称" prop="cardNo">
                  <el-input v-model="form.bankSubname" placeholder="" readonly></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="11">
                <el-form-item label="打款账号" prop="cardNo">
                  <el-input v-model="form.cardno" placeholder="" readonly></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="14">
                <el-form-item label="银行卡照片" prop="cardNo" class="imgs">
                  <img :src="bankCardUrl" alt="" @click="previewImg(bankCardUrl)">
                </el-form-item>
              </el-col>
            </el-row>
          </div>

          <div class="payVoucher" v-if="orderStatus != 2 & statusH">
            <h5>打款凭证</h5>
            <div style="border-bottom: 1px solid #ccc"></div>
            <div class="imgs">
              <img :src="item.pictureUrl" alt="" @click="previewImg(item.pictureUrl)" v-for="item in remitFiles">
            </div>
          </div>

          <div class="transFile" v-if="orderStatus != 2 & statusH">
            <h5>交易所需材料</h5>
            <div style="border-bottom: 1px solid #ccc"></div>
            <div class="imgs">
              <img :src="item.pictureUrl" alt="" @click="previewImg(item.pictureUrl)" v-for="item in dealFiles">
            </div>
          </div>

          <div class="transFile" v-if="orderStatus == 5 & statusH">
            <h5>退款申请书</h5>
            <div style="border-bottom: 1px solid #ccc"></div>
            <div class="imgs">
              <img :src="item.pictureUrl" alt="" @click="previewImg(item.pictureUrl)" v-for="item in refundFiles">
            </div>
          </div>

          <!-- 预览图片 -->
          <el-dialog :visible.sync="dialogImgVisible">
            <img width="100%" :src="dialogImageUrl" alt="">
          </el-dialog>

        </el-form>
        <!-- 预约审核 -->
        <div v-if="status == '1001' & orderStatus != 1" class="dialog-footer" style="text-align: center;">
          <el-button class="add_btn" @click="submitResult('1003')">通 过</el-button>
          <el-button class="common_btn" @click="rejectResult('1002')">不通过</el-button>
        </div>
        <!-- 打款审核 -->
        <div v-if="(status == '2001' || status == '2002' || status == '2004') & orderStatus != 1" class="dialog-footer" style="text-align: center;">
          <el-button v-show="status == '2001'&!form.refundStatus" class="search_btn" @click="submitResult('2004')">通 过</el-button>
          <el-button v-show="status == '2001'&!form.refundStatus" class="add_btn" @click="rejectResult('2002')">不通过</el-button>
          <el-button v-show="!form.refundStatus" class="add_btn" @click="submitOperat('2003')">关闭订单</el-button>
        </div>
        <!-- 打款-订单关闭 -->
        <div v-if="status == '2003' & form.refundStatus === null & orderStatus != 1" class="dialog-footer" style="text-align: center;">
          <el-button class="search_btn" @click="submitResult('1')">需要退款</el-button>
          <el-button class="add_btn" @click="submitResult('0')">无需退款</el-button>
        </div>
        <!-- 合同审核 -->
        <div v-if="status == '3002' & orderStatus != 1" class="dialog-footer" style="text-align: center;">
          <el-button class="search_btn" @click="submitResult('3004')">通 过</el-button>
          <el-button class="add_btn" @click="rejectResult('3003')">不通过</el-button>
        </div>
        <!-- 退款审核 -->
        <div v-if="form.refundStatus == '2' & orderStatus != 1" class="dialog-footer" style="text-align: center;">
          <el-button class="search_btn" @click="submitResult('4')">通 过</el-button>
          <el-button class="add_btn" @click="rejectResult('3')">不通过</el-button>
        </div>

        <el-dialog
          title="提示"
          :visible.sync="dialogComVisible"
          width="30%">
          <div style="margin-bottom: 30px;">确认执行此操作吗？</div>

          <div class="dialog-footer text-right">
            <el-button @click="dialogComVisible = false">取 消</el-button>
            <el-button type="primary" @click="submitCheck">确 定</el-button>
          </div>
        </el-dialog>

        <el-dialog
          title="审核通过"
          :visible.sync="dialogVisible"
          width="30%">
          <div style="margin-bottom: 30px;">确认审核通过吗？</div>

          <div class="dialog-footer text-right">
            <el-button @click="dialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="submitCheck">确 定</el-button>
          </div>
        </el-dialog>

        <el-dialog
          title="审核不通过"
          :visible.sync="dialogReject"
          width="30%">
          <el-tabs v-model="activeName1" type="card">
            <el-tab-pane label="不通过原因" name="first">
              <span>原因</span>
              <el-select v-model="result.reasonId"
                clearable
                placeholder="请选择"
                @change="changeReason"
                style="margin-bottom: 30px;">
                <el-option
                  v-for="item in options"
                  :key="item.auditFailReasonId"
                  :label="item.failAuditReason"
                  :value="item.auditFailReasonId">
                </el-option>
              </el-select>
              <span v-show="result.status == 3003">寄出方式</span>
              <el-select v-model="result.contractMail"
                v-show="result.status == 3003"
                clearable
                placeholder="请选择"
                style="margin-bottom: 30px;">
                <el-option
                  v-for="item in expressType"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-tab-pane>
            <el-tab-pane label="新增原因" name="second">
              <span>原因</span>
              <el-input v-model="result.auditRemark" style="margin-bottom: 30px;"></el-input>
              <span v-show="form.status == 3003">寄出方式</span>
              <el-select v-model="result.contractMail"
                v-show="form.status == 3003"
                clearable
                placeholder="请选择"
                style="margin-bottom: 30px;">
                <el-option
                  v-for="item in expressType"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-tab-pane>
          </el-tabs>

          <div class="dialog-footer text-right">
            <el-button @click="dialogReject = false">取 消</el-button>
            <el-button type="primary" @click="submitRejectCheck">确 定</el-button>
          </div>
        </el-dialog>

      </el-tab-pane>

      <el-tab-pane label="客户交易记录" name="second">

        <tab-transc-component
          :clientId="clientId"></tab-transc-component>

      </el-tab-pane>
      <el-tab-pane label="操作日志" name="third">

        <tab-log-component></tab-log-component>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
  import { getObj, getFileObj, getRefundFile, getReject } from '@/api/transc/transc'
  import { putApt, putPay, putCtra, putRefund } from '@/api/transc/check'
  import transcTableComponent from 'components/table/transcTable'
  import tabTranscComponent from 'components/transcDetail/tabTranscTable'
  import tabLogComponent from 'components/transcDetail/tabLog'
  import { deptRoleList, fetchDeptTree } from '@/api/role'
  import waves from '@/directive/waves/index.js' // 水波纹指令
  import { transformText, parseTime } from '@/utils'
  import { mapGetters } from 'vuex'
  import ElRadioGroup from 'element-ui/packages/radio/src/radio-group'
  import ElOption from "element-ui/packages/select/src/option"
  import Bus from '@/assets/js/bus'

  export default {
    components: {
      ElOption,
      transcTableComponent,
      tabTranscComponent,
      tabLogComponent
    },
    name: 'table_user',
    directives: {
      waves
    },
    filters: {
      parseTime (time) {
        if(!time) return null
        let date = new Date(time)
        return parseTime(date)
      }
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
        role: undefined,
        form: {},
        statusOptions: ['0', '1'],
        rolesOptions: [],
        nextToUpdate: false,
        dialogDeptVisible: false,
        userAdd: false,
        userUpd: false,
        userDel: false,
        isDisabled: {
          0: false,
          1: true
        },
        type_is_update: '',
        bankcardList: [],
        productStus: '',
        clientStatus: {
          riskLevel: ''
        },
        idType: '',
        isClientType: '',
        failReason: '',
        tip: false,
        activeName2: 'first',
        tableKey: 0,
        list: [],
        total: null,
        records: 1,
        listQuery: {
          page: 1,
          limit: 20
        },
        orderStatus: 1,
        statusH: false,
        dialogVisible: false,
        status: '',
        dealFiles: [],
        remitFiles: [],
        bankCardUrl: '',
        refundFiles: [],
        dialogImgVisible: false,
        dialogComVisible: false,
        dialogImageUrl: '',
        dialogReject: false,
        options: [
          // {
          //   label: '不通过1',
          //   value: '1'
          // },
          // {
          //   label: '不通过2',
          //   value: '2'
          // }
        ],
        rejectReason: '',
        activeName1: 'first',
        result: {
          contractMail: '',
          auditRemark: '',
          status: ''
        },
        clientId: ''
      }
    },
    computed: {
      ...mapGetters([
        'permissions',
        'appointmentStatus',
        'expressType'
      ])
    },
    created() {
      this.sys_user_add = this.permissions['sys_user_add']
      this.sys_user_upd = this.permissions['sys_user_upd']
      this.sys_user_del = this.permissions['sys_user_del']
      this.type_is_update = this.$route.path.substr(-1)
      this.orderStatus = this.$route.params.orderStatus
      console.log(this.orderStatus)
      this.getList()
      // this.status = this.$route.params.status
      // console.log(this.$route.params)
    },
    methods: {
      getList() {
        let id = this.$route.params.appointmentId

        getObj(id).then(response => {
          this.form = response.data
          // console.log(this.form)
          this.status = this.form.status
          this.clientId = this.form.clientId
          this.statusH = this.status.indexOf('100') == -1 ? true : false
          this.form.status = transformText(this.appointmentStatus, this.form.status)
          this.form.appointmentDate = parseTime(this.form.appointmentDate, '{y}-{m}-{d}')
          this.form.remitDate = parseTime(this.form.remitDate, '{y}-{m}-{d}')
          this.form.remitAmount = this.form.appointmentAmount
        })
        // console.log(this.orderStatus)
        if(this.orderStatus != '2') {
          getFileObj(id).then(response => {
            this.bankCardUrl = response.data.cardUrl
            this.dealFiles = response.data.dealFiles
            this.remitFiles = response.data.remitFiles
          })
        }
        if(this.orderStatus == '5') {
          getRefundFile(id).then(response => {
            this.refundFiles = response.data
          })
        }
      },
      handleDept() {
        console.log('产品状态')
      },
      submitResult(sts) {
        this.result.status = sts
        this.dialogVisible = true
        if(sts === '2004') {
          if(!this.form.remitAmount||!this.form.remitDate) {
            let statusText = ''
            if(!this.form.remitAmount) {
              statusText = '打款金额不能为空'
            }
            if(!this.form.remitDate) {
              statusText = '打款时间不能为空'
            }
            this.$notify({
              title: '信息填写有误',
              message: statusText,
              type: 'error',
              duration: 2000
            })
            this.dialogVisible = false
            return 
          }
        }
      },
      rejectResult(sts) {
        this.result.status = sts
        this.dialogReject = true
        let type = 10
        if(this.orderStatus == 2) {
          type = 10
        } else if(this.orderStatus == 3) {
          type = 20
        } else {
          type = 30
        }
        this.getRejectReason(type)
      },
      submitOperat(sts) {
        this.result.status = sts
        this.dialogComVisible = true
      },
      submitRejectCheck() {
        if(this.orderStatus == '4') {
          if (!this.result.contractMail) return false
        }
        if (!this.result.auditRemark) return false
        this.submitCheck()
      },
      submitCheck() {
        let params = {
          auditFailReasonId: this.result.auditFailReasonId,
          auditRemark: this.result.auditRemark,
          contractMail: this.result.contractMail,
          status: this.result.status
        }
        console.log('params:' + params)
        let status = this.result.status
        if(this.orderStatus == 2) { // 预约
          putApt(this.form.appointmentId, params).then(response => {
            if(response.status == 200) {
              this.$notify({
                title: '成功',
                message: '审核完成',
                type: 'success',
                duration: 2000
              })
              this.dialogVisible = false
              this.$router.push({path: '/transcMag/appoint'})
            }
          })

        } else if(this.orderStatus == 3) { // 打款
          params.remitAmount = this.form.remitAmount - 0
          params.remitDate = this.form.remitDate
          
          if(this.status === '2003') { //订单关闭，退款审核
            putRefund(this.form.appointmentId, params).then(response => {
              console.log(response.code)
              if(response.status == 200) {
                this.$notify({
                  title: '成功',
                  message: '审核完成',
                  type: 'success',
                  duration: 2000
                })
                this.dialogVisible = false
                // this.$router.push({path: '/transcMag/payment'})
              }
            })
          } else {
            params.auditRemark = params.contractMail = null
            putPay(this.form.appointmentId, params).then(response => {
              console.log(response.code)
              if(response.status == 200) {
                this.$notify({
                  title: '成功',
                  message: '审核完成',
                  type: 'success',
                  duration: 2000
                })
                this.dialogVisible = false
              }
            })
          }
          this.$router.push({path: '/transcMag/payment'})

        } else if(this.orderStatus == 4) { // 合同
          console.log('合同')
          putCtra(this.form.appointmentId, params).then(response => {
            console.log(response.code)
            if(response.status == 200) {
              this.$notify({
                title: '成功',
                message: '审核完成',
                type: 'success',
                duration: 2000
              })
              this.dialogVisible = false
              this.$router.push({path: '/transcMag/contract'})
            }
          })

        } else { // 退款
          params.remitAmount = this.form.remitAmount
          putRefund(this.form.appointmentId, params).then(response => {
            console.log(response.code)
            if(response.status == 200) {
              this.$notify({
                title: '成功',
                message: '审核完成',
                type: 'success',
                duration: 2000
              })
              this.dialogVisible = false
              this.$router.push({path: '/transcMag/refund'})
            }
          })
        }
      },
      getRejectReason(type) {
        console.log(type)
        getReject({type: type}).then(res => {
          this.options = res.data
        })
      },
      handleClick(tab) {
        console.log(tab)
        if(tab.name == 'second') {
          this.listQuery.clientId = this.form.clientId
          this.listQuery.status = 10
          Bus.$emit('searchRecords', this.listQuery)
        } else if(tab.name == 'third') {
          Bus.$emit('searchLog', this.listQuery)
        }
      },
      handleSizeChange(val) {
        this.listQuery.limit = val
        this.getList()
      },
      handleCurrentChange(val) {
        this.listQuery.page = val
        this.getList()
      },
      previewImg(url) {
        this.dialogImgVisible = true
        this.dialogImageUrl = url
      },
      changeReason(val) {
        this.result.auditRemark = transformText(this.options, val)
        this.result.auditFailReasonId = val
        // console.log(this.result)
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
.tab-title {
  display: inline-block;
  padding: 0 18px;
  &:active {
    color: red;
  }
}
.imgs {
  img {
    width: 250px;
    height: 150px;
    margin-right: 20px;
  }
}
</style>


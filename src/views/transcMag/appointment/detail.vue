<template>
  <div class="app-container calendar-list-container">

    <el-tabs v-model="activeName2" type="card" @tab-click="handleClick">
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
            <el-col :span="11">
              <el-form-item label="预约金额" prop="idNo">
                <el-input v-model="form.appointmentAmount" placeholder="" readonly></el-input>
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
              <el-col :span="11">
                <el-form-item label="打款金额" prop="cardNo">
                  <el-input v-model="form.remitAmount" placeholder="" readonly></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="11" v-if="form.status">
                <el-form-item label="打款（审核通过）时间" prop="cardNo">
                  <el-input v-model="form.remitDate" placeholder="" readonly></el-input>
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
            </el-row>
          </div>

          <div class="payVoucher" v-if="orderStatus != 2 & statusH">
            <h5>打款凭证</h5>
            <div style="border-bottom: 1px solid #ccc"></div>
            <div class="imgs" v-for="item in remitFiles">
              <img :src="item.pictureUrl" alt="" @click="previewImg(item.pictureUrl)">
            </div>
          </div>

          <div class="transFile" v-if="orderStatus != 2 & statusH">
            <h5>交易所需材料</h5>
            <div style="border-bottom: 1px solid #ccc"></div>
            <div class="imgs" v-for="item in dealFiles">
              <img :src="item.pictureUrl" alt="" @click="previewImg(item.pictureUrl)">
            </div>
          </div>

          <div class="transFile" v-if="orderStatus == 5 & statusH">
            <h5>退款申请书</h5>
            <div style="border-bottom: 1px solid #ccc"></div>
            <div class="imgs" v-for="item in dealFiles">
              <img :src="item.pictureUrl" alt="" @click="previewImg(item.pictureUrl)">
            </div>
          </div>

          <!-- 预览图片 -->
          <el-dialog :visible.sync="dialogImgVisible">
            <img width="100%" :src="dialogImageUrl" alt="">
          </el-dialog>

        </el-form>
        <div v-if="status == '1001' & orderStatus != 1" class="dialog-footer" style="text-align: center;">
          <el-button class="add_btn" @click="submitResult('1003')">通 过</el-button>
          <el-button class="common_btn" @click="rejectResult('1002')">不通过</el-button>
        </div>

        <div v-if="(status == '2001' || status == '2002' || status == '2004') & orderStatus != 1" class="dialog-footer" style="text-align: center;">
          <el-button v-show="status == '2001'" class="search_btn" @click="submitResult('2004')">通 过</el-button>
          <el-button v-show="status == '2001'" class="add_btn" @click="rejectResult('2002')">不通过</el-button>
          <el-button class="add_btn" @click="submitResult('2003')">关闭订单</el-button>
        </div>

        <div v-if="status == '2003' & orderStatus != 1" class="dialog-footer" style="text-align: center;">
          <el-button class="search_btn" @click="submitResult('1')">需要退款</el-button>
          <el-button class="add_btn" @click="submitResult('0')">无需退款</el-button>
        </div>

        <div v-if="status == '3002' & orderStatus != 1" class="dialog-footer" style="text-align: center;">
          <el-button class="search_btn" @click="submitResult('3004')">通 过</el-button>
          <el-button class="add_btn" @click="rejectResult('3003')">不通过</el-button>
        </div>

        <div v-if="status == '2' & orderStatus != 1" class="dialog-footer" style="text-align: center;">
          <el-button class="search_btn" @click="submitResult('4')">通 过</el-button>
          <el-button class="add_btn" @click="rejectResult('3')">不通过</el-button>
        </div>

        <el-dialog
          title="审核通过"
          :visible.sync="dialogVisible"
          width="30%">
          <div style="margin-bottom: 30px;">确认审核通过吗？</div>
          
          <span class="dialog-footer">
            <el-button @click="dialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="submitCheck">确 定</el-button>
          </span>
        </el-dialog>

        <el-dialog
          title="审核不通过"
          :visible.sync="dialogReject"
          width="30%">
          <el-tabs v-model="activeName1" type="card">
            <el-tab-pane label="不通过原因" name="first">
              <span>原因</span>
              <el-select v-model="result.auditRemark"
                clearable
                placeholder="请选择"
                style="margin-bottom: 30px;">
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
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
          
          <span class="dialog-footer">
            <el-button @click="dialogReject = false">取 消</el-button>
            <el-button type="primary" @click="submitCheck">确 定</el-button>
          </span>
        </el-dialog>

      </el-tab-pane>

      <el-tab-pane label="客户交易记录" name="second">

        <div class="tabs">
          <div class="tab-title" @click="records=1">历史预约记录</div>
          <div class="tab-title" @click="records=2">历史打款记录</div>
          <div class="tab-title" @click="records=3">交易成功记录</div>
          <div class="tab-item" v-show="records == 1">
            <transc-table-component
              :orderStatus="2"
              :aptCol="true"
              :aptStatusCol="true">
            </transc-table-component>
          </div>
          <div class="tab-item" v-if="records == 2">
            <transc-table-component
              :orderStatus="3"
              :paymentCol="true"
              :payStatusCol="true">
            </transc-table-component>
          </div>
          <div class="tab-item" v-if="records == 3">
            <transc-table-component
              :orderStatus="1"
              :statusCol="true"
              :aptCol="true">
            </transc-table-component>
          </div>
        </div>
      </el-tab-pane>
      <el-tab-pane label="操作日志" name="third">
        <el-table :key='tableKey' :data="list" v-loading="listLoading" element-loading-text="给我一点时间" border fit
              highlight-current-row style="width: 100%">

          <el-table-column align="center" label="序号" type="index" width="50">
            <!-- <template slot-scope="scope">
              <span>{{scope.row.productTypeId}}</span>
            </template> -->
          </el-table-column>

          <el-table-column align="center" label="时间" prop="name">
            <template slot-scope="scope">
              <span>{{scope.row.name}}</span>
            </template>
          </el-table-column>

          <el-table-column align="center" label="操作人" prop="name">
            <template slot-scope="scope">
              <span>{{scope.row.name}}</span>
            </template>
          </el-table-column>

          <el-table-column align="center" label="客户姓名" prop="name">
            <template slot-scope="scope">
              <span>{{scope.row.name}}</span>
            </template>
          </el-table-column>

          <el-table-column align="center" label="产品名称" prop="name">
            <template slot-scope="scope">
              <span>{{scope.row.name}}</span>
            </template>
          </el-table-column>

          <el-table-column align="center" label="结果" prop="name">
            <template slot-scope="scope">
              <span>{{scope.row.name}}</span>
            </template>
          </el-table-column>

        </el-table>
        <div v-show="!listLoading" class="pagination-container">
          <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                        :current-page.sync="listQuery.page"
                        :page-sizes="[10,20,30, 50]" :page-size="listQuery.limit"
                        layout="total, sizes, prev, pager, next, jumper" :total="total">
          </el-pagination>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
  import { getObj, putObj, getFileObj } from '@/api/transc/transc'
  import transcTableComponent from 'components/transcTable'
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
      transcTableComponent
    },
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
        dialogImgVisible: false,
        dialogImageUrl: '',
        dialogReject: false,
        options: [
          {
            label: '不通过1',
            value: '1'
          },
          {
            label: '不通过2',
            value: '2'
          }
        ],
        rejectReason: '',
        activeName1: 'first',
        result: {
          contractMail: '',
          auditRemark: '',
          status: ''
        }
      }
    },
    computed: {
      ...mapGetters([
        'permissions',
        'appointmentStatus',
        'genderType',
        'certificationStatus',
        'clientType',
        'idTypeOptions',
        'nationality',
        'expressType'
      ])
    },
    created() {
      this.getList()
      this.sys_user_add = this.permissions['sys_user_add']
      this.sys_user_upd = this.permissions['sys_user_upd']
      this.sys_user_del = this.permissions['sys_user_del']
      this.type_is_update = this.$route.path.substr(-1)
      this.orderStatus = this.$route.params.orderStatus
      // this.status = this.$route.params.status
      // console.log(this.status)
    },
    methods: {
      getList() {
        let id = this.$route.params.appointmentId

        getObj(id).then(response => {
          this.form = response.data
          this.status = this.form.status
          this.statusH = this.status.indexOf('100') == -1 ? true : false
          this.form.status = transformText(this.appointmentStatus, this.form.status)
        })
        getFileObj(id).then(response => {
          this.dealFiles = response.data.dealFiles
          this.remitFiles = response.data.remitFiles
          // console.log(this.dealFiles)
          // console.log(this.remitFiles)
        })
        
      },
      handleDept() {
        console.log('产品状态')
      },
      submitResult(sts) {
        this.result.status = sts
        this.dialogVisible = true
      },
      rejectResult(sts) {
        this.result.status = sts
        this.dialogReject = true
      },
      submitCheck(sts) {
        let params = {
          // auditFailReasonId: this.failReason,
          auditRemark: this.result.auditRemark,
          contractMail: this.result.contractMail,
          status: this.result.status
        }
        putObj(this.form.appointmentId, params).then(response => {
          console.log(response.code)
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
      handleClick(tab) {
        console.log(tab)
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
  }
}
</style>


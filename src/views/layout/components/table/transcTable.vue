<template>
  <div class="table">

    <el-table :key='tableKey' :data="list" v-loading="listLoading" element-loading-text="给我一点时间" border fit
              highlight-current-row style="width: 100%;">

      <el-table-column align="center" label="预约编号">
        <template slot-scope="scope">
          <span>{{scope.row.appointmentCode}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="快递单号" v-if="contractCol">
        <template slot-scope="scope">
          <span>{{scope.row.expressNo}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="合同编号" v-if="contractCol">
        <template slot-scope="scope">
          <span>{{scope.row.contractNo}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="产品名称" show-overflow-tooltip v-if="productNameCol">
        <template slot-scope="scope">
          <span>{{scope.row.productName}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="客户类型">
        <template slot-scope="scope">
          <span>{{scope.row.clientClass}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="客户编号" v-if="clientNoCol">
        <template slot-scope="scope">
        <span>{{scope.row.clientNo}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="客户姓名">
        <template slot-scope="scope">
        <span>{{scope.row.clientName}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="客户性别" v-if="clientGenderCol">
        <template slot-scope="scope">
        <span>{{scope.row.clientGender}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="国籍（常住地区）" v-if="cityCol">
        <template slot-scope="scope">
        <span>{{scope.row.city}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="手机号" v-if="clientMobileCol">
        <template slot-scope="scope">
        <span>{{scope.row.clientMobile}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="预约金额/万" v-if="aptCol">
        <template slot-scope="scope">
        <span>{{scope.row.appointmentAmount}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="预约时间" v-if="aptCol">
        <template slot-scope="scope">
        <span>{{scope.row.appointmentDate | parseTime('{y}-{m}-{d}')}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="打款金额/万" v-if="paymentCol">
        <template slot-scope="scope">
        <span>{{scope.row.remitAmount}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="理财师姓名">
        <template slot-scope="scope">
        <span>{{scope.row.userName}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="所属部门">
        <template slot-scope="scope">
          <span>{{scope.row.userDeptName}}</span>
        </template>
      </el-table-column>
      
      <el-table-column align="center" label="打款状态" v-if="payStatusCol">
        <template slot-scope="scope">
          <span>{{scope.row.statusText}}</span>
        </template>
      </el-table-column>
      
      <el-table-column align="center" label="退款状态" v-if="refundCol">
        <template slot-scope="scope">
          <span>{{scope.row.refundStatusText}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" class-name="status-col" label="状态" v-if="statusCol">
        <template slot-scope="scope">
          {{scope.row.statusText}}
        </template>
      </el-table-column>

      <el-table-column align="center" class-name="status-col" label="预约状态" v-if="aptStatusCol">
        <template slot-scope="scope">
          {{scope.row.statusText}}
        </template>
      </el-table-column>

      <el-table-column align="center" class-name="status-col" label="合同状态" v-if="contractCol">
        <template slot-scope="scope">
          {{scope.row.statusText}}
        </template>
      </el-table-column>

      <el-table-column align="center" label="操作" v-if="!transcStatus">
        <template slot-scope="scope">
          <a v-if="sys_product_upd & scope.row.status != 3001" size="small" class="common_btn"
                     @click="handleUpdate(scope.row)">查 看
          </a>
          <a v-if="scope.row.status == 3001" size="small" class="common_btn"
                     @click="receiveContract(scope.row)">收到合同
          </a>
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
  </div>
</template>

<script>
  import { fetchTranscList, fetchAppointList, fetchPayList, fetchContractList, fetchRefundList } from '@/api/transc/transc'
  import { getAppointList } from '@/api/product/product'
  import { putCtra } from '@/api/transc/check'
  import { fetchRecords } from '@/api/transc/records'
  import { fetchProductTypeList } from '@/api/product/productType'
  import { deptRoleList, fetchDeptTree } from '@/api/role'
  import { getFiles, delFiles, uploadFiles } from '@/api/qiniu'
  import { fetchCurrency, getObjList } from '@/api/currency'
  import { getToken } from '@/utils/auth'
  import waves from '@/directive/waves/index.js' // 水波纹指令
  import { transformText, parseTime } from '@/utils'
  import { mapGetters } from 'vuex'
  import ElRadioGroup from 'element-ui/packages/radio/src/radio-group'
  import ElOption from "element-ui/packages/select/src/option"
  import { decimals } from '@/utils/validate'
  import Bus from '@/assets/js/bus'

  export default {
    components: {
      ElOption,
      ElRadioGroup
      // transcSearchComponent
    },
    name: 'table_user',
    directives: {
      waves
    },
    props: {
      aptCol: {
        default: false
      },
      aptStatusCol: {
        default: false
      },
      paymentCol: {
        default: false
      },
      payStatusCol: {
        default: false
      },
      refundCol: {
        default: false
      },
      statusCol: {
        default: false
      },
      contractCol: {
        default: false
      },
      productNameCol: { // 产品模块
        default: true
      },
      clientNoCol: {
        default: false
      },
      clientGenderCol: {
        default: false
      },
      cityCol: {
        default: false
      },
      clientMobileCol: {
        default: false
      },
      orderStatus: {
        default: 0
      },
      historyStatus: {
        default: 0
      },
      id: {
        default: 0
      },
      activePath: {
        default: '/transcMag/transc'
      },
      productCollect: {
        default: false
      },
      transcStatus: {
        default: false
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
        list: null,
        total: null,
        listLoading: true,
        listQuery: {
          page: 1,
          limit: 20,
          annualizedReturns: [],
          isFloat: null,
          orderByField: 'create_time',
          isAsc: false
        },
        dialogFormVisible: false,
        dialogDeptVisible: false,
        userAdd: false,
        userUpd: false,
        userDel: false,
        dialogStatus: '',
        tableKey: 0,
        productTypes: [],
        highlight: '',
        isDisabled: true,
        isSpread: false,
        queryId: 0
      }
    },
    computed: {
      ...mapGetters([
        'permissions',
        'appointmentStatus',
        'refundStatus',
        'productRiskLevel',
        'clientClass'
      ])
    },
    created() {
      this.getList()
      // this.getAppointList()
      this.sys_product_add = this.permissions['sys_product_add']
      this.sys_product_upd = this.permissions['sys_product_upd']
    },
    mounted() {
      Bus.$on('searchTransc', listQuery => {
        this.listQuery = listQuery
        this.getList()
      })
      Bus.$on('searchRecords', listQuery => {
        this.listQuery = listQuery
        this.getHistory()
      })
      Bus.$on('queryAppoints', listQuery => {
        // console.log('数据发送过来了')
        this.listQuery = listQuery
        this.getAppointList()
      })
      Bus.$on('appointsList', data => {
        // console.log('表格数据发送过来了')
        this.list = data.records
        this.total = data.total
        this.listLoading = false
        // this.getAppointList()
      })
    },
    methods: {
      getList() {
        this.queryId = 1
        this.listLoading = true
        this.listQuery.isFloat ? this.listQuery.isFloat = 0: this.listQuery.isFloat = null
        let list = null
        console.log(this.listQuery)
        if(this.orderStatus == '1') { // 交易列表
          fetchTranscList(this.listQuery).then(response => {
            this.list = response.data.records
            this.total = response.data.total
            this.listLoading = false
            this.list.forEach(item => {
              item.statusText = transformText(this.appointmentStatus, item.status)
              item.clientClass = transformText(this.clientClass, item.clientClass)
            })
          })
        } else if(this.orderStatus == '2') { // 预约列表
          fetchAppointList(this.listQuery).then(response => {
            this.list = response.data.records
            this.total = response.data.total
            this.listLoading = false
            this.list.forEach(item => {
              item.statusText = transformText(this.appointmentStatus, item.status)
              item.clientClass = transformText(this.clientClass, item.clientClass)
            })
          })

        } else if(this.orderStatus == '3') { // 打款列表
          fetchPayList(this.listQuery).then(response => {
            this.list = response.data.records
            this.total = response.data.total
            this.listLoading = false
            this.list.forEach(item => {
              item.statusText = transformText(this.appointmentStatus, item.status)
              item.clientClass = transformText(this.clientClass, item.clientClass)
            })
          })

        } else if(this.orderStatus == '4') { // 合同列表
          fetchContractList(this.listQuery).then(response => {
            this.list = response.data.records
            this.total = response.data.total
            this.listLoading = false
            this.list.forEach(item => {
              item.statusText = transformText(this.appointmentStatus, item.status)
              item.clientClass = transformText(this.clientClass, item.clientClass)
            })
          })

        } else if(this.orderStatus == '5') { // 退款列表
          fetchRefundList(this.listQuery).then(response => {
            this.list = response.data.records
            this.total = response.data.total
            this.listLoading = false
            this.list.forEach(item => {
              item.statusText = transformText(this.appointmentStatus, item.status)
              item.refundStatusText = transformText(this.refundStatus, item.refundStatus)
              item.clientClass = transformText(this.clientClass, item.clientClass)
            })
          })
        }
      },
      getHistory() {
        this.queryId = 2
        // if(this.historyStatus) {
          // console.log(this.historyStatus)
          fetchRecords(this.listQuery).then(response => {
            this.list = response.data.records
            this.total = response.data.total
            this.listLoading = false
            this.list.forEach(item => {
              item.statusText = transformText(this.appointmentStatus, item.status)
            })
          })
        // }
      },
      getAppointList() { // 产品模块交易人数表
        this.queryId = 3
        let params = {
          page: this.listQuery.page,
          limit: this.listQuery.limit
        }
        let id = this.listQuery.productId
        let type = this.listQuery.type || 0
        // console.log(params)
        if(this.transcStatus) {
          // console.log('执行请求了')
          getAppointList(id, type, params).then(response => {
            this.list = response.data.records
            this.total = response.data.total
            this.listLoading = false
            // console.log(response)
          })
        }
      },
      handleSizeChange(val) {
        this.listQuery.limit = val
        console.log(this.queryId)
        if(this.queryId == 1) {
          console.log('111')
          this.getList()
        } else if(this.queryId === 2) {
          console.log('222')
          this.getHistory()
        } else {
          console.log('333')
          this.getAppointList()
        }
      },
      handleCurrentChange(val) {
        this.listQuery.page = val
        if(this.queryId === 1) {
          this.getList()
        } else if(this.queryId === 2) {
          this.getHistory()
        } else {
          this.getAppointList()
        }
      },
      handleUpdate(row) { // 查看
        this.$router.push({path: '/transcMag/transc/detail/' + row.appointmentId + '/' + this.orderStatus + '/' + row.status})
        Bus.$emit('activeIndex', this.activePath)

      },
      receiveContract(row) {
        this.$confirm('确定收到此合同?', '收到合同', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let status = '3002'
          putCtra(row.appointmentId, {status: status}).then(res => {
            console.log(res)
            this.handleUpdate(row)
          })
        }).catch(() => {
          // this.$message({
          //   type: 'info',
          //   message: '已取消删除'
          // })
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
// .hide {
//   display: none;
// }
</style>


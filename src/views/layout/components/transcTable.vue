
<template>
  <div class="table">

    <el-table :key='tableKey' :data="list" v-loading="listLoading" element-loading-text="给我一点时间" border fit
              highlight-current-row style="width: 100%;">

      <el-table-column align="center" label="预约编号">
        <template slot-scope="scope">
          <span>{{scope.row.appointmentCode}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="产品名称" show-overflow-tooltip>
        <template slot-scope="scope">
          <span>{{scope.row.productName}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="客户类型">
        <template slot-scope="scope">
          <span>{{scope.row.clientClass}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="客户姓名">
        <template slot-scope="scope">
        <span>{{scope.row.productName}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="预约金额" v-if="aptCol">
        <template slot-scope="scope">
        <span>{{scope.row.appointmentAmount}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="预约时间" v-if="aptCol">
        <template slot-scope="scope">
        <span>{{scope.row.appointmentDate | parseTime('{y}-{m}-{d}')}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="打款金额" v-if="paymentCol">
        <template slot-scope="scope">
        <span>{{scope.row.appointmentDate}}</span>
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
          <span>{{scope.row.userDeptName}}</span>
        </template>
      </el-table-column>
      
      <el-table-column align="center" label="退款状态" v-if="refundCol">
        <template slot-scope="scope">
          <span>{{scope.row.userDeptName}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" class-name="status-col" label="状态" v-if="statusCol">
        <template slot-scope="scope">
          {{scope.row.status}}
        </template>
      </el-table-column>

      <el-table-column align="center" class-name="status-col" label="预约状态" v-if="aptStatusCol">
        <template slot-scope="scope">
          {{scope.row.status}}
        </template>
      </el-table-column>

      <el-table-column align="center" class-name="status-col" label="合同状态" v-if="contractCol">
        <template slot-scope="scope">
          {{scope.row.status}}
        </template>
      </el-table-column>

      <el-table-column align="center" label="操作">
        <template slot-scope="scope">
          <a v-if="sys_product_upd" size="small" class="common_btn"
                     @click="handleUpdate(scope.row)">查看
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
  import { fetchList, getObj, addObj, putObj, delObj } from '@/api/transc/appoint'
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
          // name: '',
          productTypeIds: [],
          productStatus: [],
          annualizedReturns: [],
          isFloat: null
        },
        role: undefined,
        form: {
          name: undefined,
          password: undefined,
          // delFlag: undefined,
          deptId: undefined
        },
        statusOptions: ['0', '1'],
        rolesOptions: [],
        dialogFormVisible: false,
        dialogDeptVisible: false,
        userAdd: false,
        userUpd: false,
        userDel: false,
        dialogStatus: '',
        tableKey: 0,
        sex: '',
        edu: '',
        currencyList: [],
        IDsType: '',
        entryDate: '',
        fileList: [],
        productTypes: [],
        productTypesList: [],
        input2: '',
        // nextToUpdate: false,
        fileList: [],
        fileList1: [],
        fileList2: [],
        fileList3: [],
        indexList1: [],
        indexList2: [],
        indexList3: [],
        productStus: '',
        // radio2: null,
        profitTextarea: '',
        highlight: '',
        uploadData: {
          productId: ''
        },
        headers: {
          Authorization: 'Bearer ' + getToken()
        },
        isDisabled: true,
        form: [],
        isSpread: false
      }
    },
    computed: {
      ...mapGetters([
        'permissions',
        'productStatus',
        'productRiskLevel'
      ])
    },
    created() {
      // console.log(this.productStatus)
      this.getList()
      this.sys_product_add = this.permissions['sys_product_add']
      this.sys_product_upd = this.permissions['sys_product_upd']
    },
    mounted() {
      Bus.$on('searchTransc', listQuery => {
        this.listQuery = listQuery
        console.log(this.listQuery)
        // this.getList()
      })
    },
    methods: {
      getList() {
        this.listLoading = true
        
        this.listQuery.isFloat ? this.listQuery.isFloat = 0: this.listQuery.isFloat = null
        fetchList(this.listQuery).then(response => {
          console.log('loadingtofalse')
          this.list = response.data.records
          this.total = response.data.total
          this.listLoading = false
          fetchProductTypeList().then(res => { // 获取产品类型
            this.productTypes = res.data
            this.list.forEach(item => {
              item.productTypeId = transformText(this.productTypes, item.productTypeId)
              item.productStatus = transformText(this.productStatus, item.productStatus)
            })
          })
        })

        getObjList().then(response => {
          this.currencyList = response.data
        })
      },
      handleFilter() {
        this.listQuery.page = 1
        this.getList()
      },
      handleSizeChange(val) {
        this.listQuery.limit = val
        this.getList()
      },
      handleCurrentChange(val) {
        this.listQuery.page = val
        this.getList()
      },
      handleUpdate(row) { // 编辑
        this.$router.push({path: '/product/productDetail/' + row.productId})
        Bus.$emit('activeIndex', '/product/productList')

        // this.nextToUpdate = false
      
      },
      resetTemp() {
        this.form = {
          id: undefined,
          name: '',
          role: undefined
        }
      },
      resetFilter() {
        this.listQuery = {
          name: '',
          // type: [],
          productTypeIds: [],
          annualizedReturns: [],
          productStatus: [],
          isFloat: 0
        }
        this.getList()
      },
      // searchList(data) {
      //   this.listQuery = data
      //   this.getList()
      // }
    }
  }
</script>

<style lang="scss" scoped>
// .hide {
//   display: none;
// }
</style>



<template>
  <div class="app-container calendar-list-container">
    <el-row :gutter="12" class="def-el">
      <el-col :span=spanNum class="first-col">
        <el-card shadow="always">
          <div class="card-box">
            <div class="left-box orange-box">
              <svg-icon icon-class="user"></svg-icon>
              <!--<span class="icon-bg"></span>-->
              <span class="circle"></span>
            </div>
            <div class="right-box">
              <div class="title">今日预约人数</div>
              <div class="btm-box"><span>{{statistic.appointNum}}</span><i>人</i></div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span=spanNum>
        <el-card shadow="always">
          <div class="card-box">
            <div class="left-box orange-box">
              <svg-icon icon-class="money"></svg-icon>
              <!--<span class="icon-bg"></span>-->
              <span class="circle"></span>
            </div>
            <div class="right-box">
              <div class="title">今日预约金额</div>
              <div class="btm-box"><span>{{statistic.appointAmounts}}</span><i>万</i></div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span=spanNum>
        <el-card shadow="always">
          <div class="card-box">
            <div class="left-box green-box">
              <svg-icon icon-class="customer"></svg-icon>
              <!--<span class="icon-bg"></span>-->
              <span class="circle"></span>
            </div>
            <div class="right-box green-right">
              <div class="title">今日打款成功人数</div>
              <div class="btm-box"><span>{{statistic.remitNum}}</span><i>人</i></div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span=spanNum>
        <el-card shadow="always">
          <div class="card-box">
            <div class="left-box green-box">
              <svg-icon icon-class="money"></svg-icon>
              <!--<span class="icon-bg"></span>-->
              <span class="circle"></span>
            </div>
            <div class="right-box green-right">
              <div class="title">今日打款成功金额</div>
              <div class="btm-box"><span>{{statistic.remitAmounts}}</span><i>万</i></div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <transc-search-component></transc-search-component>

    <transc-table-component
      :orderStatus="1"
      :statusCol="true"
      :aptCol="true">
    </transc-table-component>

    <!-- <el-table :key='tableKey' :data="list" v-loading="listLoading" element-loading-text="给我一点时间" border fit
              highlight-current-row style="width: 100%;">

      <el-table-column align="center" label="预约编号">
        <template slot-scope="scope">
          <span>{{scope.row.productCode}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="产品名称">
        <template slot-scope="scope">
          <span>{{scope.row.productName}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="客户类型">
        <template slot-scope="scope">
          <span>{{scope.row.productName}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="客户姓名" show-overflow-tooltip>
        <template slot-scope="scope">
        <span>{{scope.row.productTypeId}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="预约金额" show-overflow-tooltip>
        <template slot-scope="scope">
        <span>{{scope.row.investmentHorizon}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="预约时间" show-overflow-tooltip>
        <template slot-scope="scope">
        <span>{{scope.row.productRiskLevel}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="理财师姓名" show-overflow-tooltip>
        <template slot-scope="scope">
        <span>{{scope.row.collectionAmount}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="所属部门">
        <template slot-scope="scope">
          <span>{{scope.row.minimalAmount}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" class-name="status-col" label="状态">
        <template slot-scope="scope">
          {{scope.row.productStatus}}
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
    </div> -->
  </div>
</template>

<script>
  import transcSearchComponent from 'components/searchBar/transaction'
  import transcTableComponent from 'components/transcTable'
  import { fetchList, getObj, addObj, putObj, delObj } from '@/api/product/product'
  import { fetchProductTypeList } from '@/api/product/productType'
  import { statistics } from '@/api/transc/transc'
  import { deptRoleList, fetchDeptTree } from '@/api/role'
  import { getFiles, delFiles, uploadFiles } from '@/api/qiniu'
  import { fetchCurrency, getObjList } from '@/api/currency'
  import { getToken } from '@/utils/auth'
  import waves from '@/directive/waves/index.js' // 水波纹指令
  import { transformText } from '@/utils'
  import { mapGetters } from 'vuex'
  import ElRadioGroup from 'element-ui/packages/radio/src/radio-group'
  import ElOption from "element-ui/packages/select/src/option"
  import { decimals } from '@/utils/validate'
  import Bus from '@/assets/js/bus'

  const twoDecimals = (rule, value, callback) => {
    if (!value) {
      return null
    } else if (!decimals(value)) {
      callback(new Error('请输入正确的净值数字'))
    } else {
      callback()
    }
  }

  export default {
    components: {
      ElOption,
      ElRadioGroup,
      transcSearchComponent,
      transcTableComponent
    },
    name: 'table_user',
    directives: {
      waves
    },
    data() {
      return {
        spanNum: 6,
        treeDeptData: [],
        checkedKeys: [],
        defaultProps: {
          children: 'children',
          label: 'name'
        },
        list: null,
        total: null,
        listLoading: false,
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
        textMap: {
          update: '编辑产品',
          create: '新增产品'
        },
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
        isSpread: false,
        statistic: {
          appointAmounts: null,
          appointNum: null,
          remitAmounts: null,
          remitNum: null
        }
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
      // this.getList()
      this.getStatistic()
      this.sys_product_add = this.permissions['sys_product_add']
      this.sys_product_upd = this.permissions['sys_product_upd']
    },
    methods: {
      getStatistic() {
        statistics().then(res => {
          this.statistic.appointAmounts = res.data.appointAmounts || 0
          this.statistic.appointNum = res.data.appointNum || 0
          this.statistic.remitAmounts = res.data.remitAmounts || 0
          this.statistic.remitNum = res.data.remitNum || 0
        })
      },
      // getList() {
      //   this.listLoading = true

      //   this.listQuery.isFloat ? this.listQuery.isFloat = 0: this.listQuery.isFloat = null
      //   fetchList(this.listQuery).then(response => {
      //     this.list = response.data.records
      //     this.total = response.data.total
      //     this.listLoading = false
      //     fetchProductTypeList().then(res => { // 获取产品类型
      //       this.productTypes = res.data
      //       this.list.forEach(item => {
      //         item.productTypeId = transformText(this.productTypes, item.productTypeId)
      //         item.productStatus = transformText(this.productStatus, item.productStatus)
      //       })
      //     })
      //   })

      //   getObjList().then(response => {
      //     this.currencyList = response.data
      //   })
      // },
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
      handleCreate() { //新增
        this.$router.push({path: '/product/productDetail'})
        Bus.$emit('activeIndex', '/product/productList')

        // this.resetTemp()
        // this.dialogStatus = 'create'
        // this.dialogFormVisible = true
        // this.nextToUpdate = false
      },
      handleUpdate(row) { // 编辑
        this.$router.push({path: '/product/productDetail/' + row.productId})
        Bus.$emit('activeIndex', '/product/productList')

        // this.nextToUpdate = false

      }
      // resetTemp() {
      //   this.form = {
      //     id: undefined,
      //     name: '',
      //     role: undefined
      //   }
      // },
      // resetFilter() {
      //   this.listQuery = {
      //     name: '',
      //     // type: [],
      //     productTypeIds: [],
      //     annualizedReturns: [],
      //     productStatus: [],
      //     isFloat: 0
      //   }
      //   this.getList()
      // }
      // searchList(data) {
      //   this.listQuery = data
      //   this.getList()
      // }
    }
  }
</script>

<style lang="scss" scoped>
@import "src/styles/mixin.scss";
.el-select,
.el-date-editor {
  width: 100%;
}
.def-el {
  margin-bottom: 24px;
  .el-card__body {
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
    .card-box {
      padding: 10px 0;
      .left-box,
      .right-box {
        display: inline-block;
        height: 100px;
        vertical-align: middle;
        position: relative;
        .circle {
          display: inline-block;
          width: 70px;
          height: 70px;
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          border-radius: 100%;
          border: 3px solid #fff;
        }
      }
      .left-box {
        width: 100px;
        box-shadow: 0 6px 6px 2px rgba(43,125,131,0.05);
        border-radius: 4px;
        .svg-icon {
          position: absolute;
           fill: #fff;
          width: 44px;
          height: 44px;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          z-index: 1;
        }
      }
      .right-box {
        margin-left: 3px;
        .title {
          font-family: PingFangSC-Medium;
          font-size: 14px;
          color: #475669;
          letter-spacing: 0;
          line-height: 20px;
        }
        .btm-box {
          position: absolute;
          bottom: 0;
          font-family: PingFangSC-Semibold;
          font-size: 22px;
          color: #FDCE82;
          letter-spacing: 0;
          line-height: 20px;
          span {
            font-size: 40px;
            vertical-align: text-top;
          }
          i {
            font-style: normal;
          }
        }
      }
      .orange-box {
        background: #FDCE82;
        .circle {
          background-color: #fdce82;
        }
      }
      .green-box {
        background: #30CDAA;
        .circle {
          background-color: #30cdaa;
        }
      }
      .green-right {
        .btm-box {
          color: #30cdaa;
        }
      }
    }
  }
}
.filter-container {
  .query-title {
    white-space: nowrap;
    min-width: 85px;
    padding: 0;
    height: 40px;
    line-height: 40px;
    text-align: center;
    vertical-align: center;
  }
  .el-checkbox-button:hover {
    color: #00C1DF;
  }
  .el-checkbox-button__inner:hover {
    color: #00C1DF;
  }
  .el-checkbox-button__inner:active {
    background-color: #00C1DF;
    color: #fff;
  }
  .el-checkbox-button.is-checked .el-checkbox-button__inner {
    background-color: #00C1DF;
  }
}
.btn-padding {
  @include padding;
}
.query-color {
  @include mainColor;
}
</style>


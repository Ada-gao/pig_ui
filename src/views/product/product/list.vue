
<template>
  <div class="app-container calendar-list-container">
    
    <div class="bref">
      <el-row :gutter="12" class="def-el">
        <el-col :md="10" :lg="6" class="first-col">
          <el-card shadow="always">
            <div class="card-box">
              <div class="left-box orange-box">
                <svg-icon icon-class="appointpeo"></svg-icon>
              </div>
              <div class="right-box">
                <div class="title">在建产品（个）</div>
                <div class="btm-box"><span>{{statistic.building||0}}</span></div>
              </div>
            </div>
          </el-card>
        </el-col>
        <el-col :md="10" :lg="6">
          <el-card shadow="always">
            <div class="card-box">
              <div class="left-box orange-box">
                <svg-icon icon-class="appointmon"></svg-icon>
              </div>
              <div class="right-box">
                <div class="title">预热产品（个）</div>
                <div class="btm-box"><span>{{statistic.preheating||0}}</span></div>
              </div>
            </div>
          </el-card>
        </el-col>
        <el-col :md="10" :lg="6">
          <el-card shadow="always">
            <div class="card-box">
              <div class="left-box green-box">
                <svg-icon icon-class="successpeo"></svg-icon>
              </div>
              <div class="right-box green-right">
                <div class="title">产品募集中（个）</div>
                <div class="btm-box"><span>{{statistic.collecting||0}}</span></div>
              </div>
            </div>
          </el-card>
        </el-col>
        <el-col :md="10" :lg="6">
          <el-card shadow="always">
            <div class="card-box">
              <div class="left-box green-box">
                <svg-icon icon-class="successmon"></svg-icon>
              </div>
              <div class="right-box green-right">
                <div class="title">已成立产品（个）</div>
                <div class="btm-box"><span>{{statistic.established||0}}</span></div>
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>
    <product-search-component
      @searchProduct="getListQuery">
    </product-search-component>

    <product-table-component
      :productQuery="true"
      :productList="data"
      :activeUrl="url"
      @searchProduct="getListPageQuery">
    </product-table-component>

    <!-- <el-table :key='tableKey' :data="list" v-loading="listLoading" element-loading-text="给我一点时间" border fit
              highlight-current-row style="width: 100%;">

      <el-table-column align="center" label="产品编号">
        <template slot-scope="scope">
          <span>{{scope.row.productCode}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="产品名称">
        <template slot-scope="scope">
          <span>{{scope.row.productName}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="产品起息日">
        <template slot-scope="scope">
          <span>{{scope.row.productName}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="产品分类" show-overflow-tooltip>
        <template slot-scope="scope">
        <span>{{scope.row.productTypeId}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="产品期限（年）" show-overflow-tooltip>
        <template slot-scope="scope">
        <span>{{scope.row.investmentHorizon}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="风险等级" show-overflow-tooltip>
        <template slot-scope="scope">
        <span>{{scope.row.productRiskLevel}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="募集规模（万）" show-overflow-tooltip>
        <template slot-scope="scope">
        <span>{{scope.row.collectionAmount}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="起投金额（万）">
        <template slot-scope="scope">
          <span>{{scope.row.minimalAmount}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="产品状态">
        <template slot-scope="scope">
          {{scope.row.productStatus}}
        </template>
      </el-table-column>

      <el-table-column align="center" label="操作" class-name="operate-col">
        <template slot-scope="scope">
          <a v-if="sys_product_upd" size="small" class="common_btn"
                     @click="handleUpdate(scope.row)">查看
          </a>
          <a v-if="sys_product_del&scope.row.productStatus==='在建'" size="small" type="danger_btn"
                     @click="deletes(scope.row)">删除
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
  import productSearchComponent from 'components/searchBar/product'
  import productTableComponent from 'components/table/product'
  import { fetchList, getObj, addObj, putObj, delObj, getProudctStatistics } from '@/api/product/product'
  import { fetchProductTypeList } from '@/api/product/productType'
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
      productSearchComponent,
      productTableComponent
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
          isFloat: null,
          orderByField: 'create_time',
          isAsc: false
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
        productIncome: [
          {
            label: '10%以下',
            value: 1
          },
          {
            label: '10-15%',
            value: 3
          },
          {
            label: '15%以上',
            value: 2
          },
          {
            label: '浮动',
            value: 4
          }
        ],
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
        statistic: {},
        productStatusId: '',
        url: '/product/productList',
        data: {}
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
      this.getStatisc()
      this.sys_product_add = this.permissions['sys_product_add']
      this.sys_product_upd = this.permissions['sys_product_upd']
      this.sys_product_del = this.permissions['sys_product_del']
    },
    methods: {
      getListQuery(data) {
        this.listQuery = data
        this.getList()
      },
      getListPageQuery(data) { // 页数改变
        this.listQuery.page = data.page
        this.listQuery.limit = data.limit
        this.getList()
      },
      getList() {
        // this.listLoading = true
        
        this.listQuery.isFloat ? this.listQuery.isFloat = 0: this.listQuery.isFloat = null
        fetchList(this.listQuery).then(response => {
          this.data = response.data
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
      },
      getStatisc() {
        getProudctStatistics().then(res => {
          this.statistic = res.data
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
      searchList(data) {
        this.listQuery = data
        // this.listQuery.type = 1
        this.getList()
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
.operate-col {
  text-align: left;
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
        height: 80px;
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
        width: 80px;
        box-shadow: 0 6px 6px 2px rgba(43,125,131,0.05);
        border-radius: 4px;
        .svg-icon {
          position: absolute;
           fill: #fff;
          width: 50px;
          height: 50px;
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
</style>


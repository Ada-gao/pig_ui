<template>
  <div class="product-table">

    <el-table :key='tableKey' :data="list" v-loading="listLoading" element-loading-text="给我一点时间" border fit
              highlight-current-row style="width: 100%">

        <el-table-column align="center" label="材料名称">
          <template slot-scope="scope">
            <el-input
              v-show="transcId===scope.row.productClientFileId"
              v-model="scope.row.fileName"
              @keyup.enter.native="$event.target.blur"
              @blur="updateClientFile(scope.row)"></el-input>
            <span v-show="transcId!==scope.row.productClientFileId">{{scope.row.fileName}}</span>
          </template>
        </el-table-column>

        <el-table-column align="center" label="操作" fixed="right">
          <template slot-scope="scope">
            <a size="small" class="common_btn"
                      @click="transcId=scope.row.productClientFileId">编辑
                      <!-- @click="handleRouter(scope.row.clientId)">编辑 -->
            </a>
            <!-- <span class="space_line"> | </span> -->
            <a size="small" class="danger_btn"
                      @click="deleteClient(scope.row.productClientFileId)">删除
            </a>
          </template>
        </el-table-column>

      </el-table>

    <div v-show="!listLoading&total" class="pagination-container">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                     :current-page.sync="listQuery.page"
                     :page-sizes="[10,20,30, 50]" :page-size="listQuery.limit"
                     layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>
  </div>
</template>

<script>
  import { fetchList, getObj, addObj, putObj, delObj } from '@/api/product/product'
  import { fetchProductTypeList } from '@/api/product/productType'
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
      ElRadioGroup
    },
    name: 'table_user',
    directives: {
      waves
    },
    props: {
      productStatusNo: {
        default: ''
      },
      productQuery: {
        default: false
      },
      productList: {
        default: () => {
          return {}
        }
      }
    },
    data() {
      return {
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
          isFloat: null,
          orderByField: 'create_time',
          isAsc: false
        },
        userAdd: false,
        userUpd: false,
        userDel: false,
        dialogStatus: '',
        tableKey: 0,
        transcId: ''
      }
    },
    computed: {
      ...mapGetters([
        'permissions',
        'productStatus',
        'productRiskLevel',
        'investHorizonUnit'
      ])
    },
    created() {
      this.sys_product_add = this.permissions['sys_product_add']
      this.sys_product_upd = this.permissions['sys_product_upd']
      this.sys_product_del = this.permissions['sys_product_del']
    },
    watch: {
      productList(curVal, oldVal) {
        if(curVal) {
          this.transcId = ''
          this.listLoading = false
          if(curVal.constructor == Array) {
            // console.log(curVal)
            this.list = curVal
          } else {
            this.list = curVal.records
            this.total = curVal.total
          }
        }
      }
    },
    methods: {
      handleSizeChange(val) {
        this.listQuery.limit = val
        this.$emit('searchProduct', this.listQuery)
        // this.getList()
      },
      handleCurrentChange(val) {
        this.listQuery.page = val
        this.$emit('searchProduct', this.listQuery)
        // this.getList()
      },
      handleUpdate(row) { // 查看
        this.$router.push({path: '/product/productDetail/' + row.productId})
        Bus.$emit('activeIndex', this.activeUrl)
        localStorage.setItem('activeUrl', this.activeUrl)
      },
      updateClientFile(item) {
        this.$emit('upd-client-file', item)
      },
      deleteClient(id) {
        this.$emit('del-client-file', id)
      },
      resetTemp() {
        this.form = {
          id: undefined,
          name: '',
          // role: undefined
        }
      },
      deletes(id) {
        this.$confirm('此操作将删除该产品, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          delObj(id).then(res => {
            if(res.data.code === 0) {
              const idx = this.list.findIndex((item, index) => {
                return item.productId === id
              })
              this.list.splice(idx, 1)
            }
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
</style>


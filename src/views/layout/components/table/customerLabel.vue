<template>
  <div class="product-table">

    <el-table :key='tableKey' :data="list" v-loading="listLoading" element-loading-text="给我一点时间" border fit
              highlight-current-row style="width: 100%;"
              @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column align="center" label="客户编号" prop="clientNo"></el-table-column>

      <el-table-column align="center" label="客户姓名" prop="name"></el-table-column>

      <el-table-column align="center" label="操作" class-name="operate-col">
        <template slot-scope="scope">
          <a v-if="sys_product_upd" size="small" class="common_btn"
                     @click="handleUpdate(scope.row.clientId)">查看客户信息
          </a>
          <a v-if="sys_product_del" size="small" class="danger_btn"
                     @click="clientLabelHandle(scope.row.clientId, scope.row.clientLabelId)">
                     {{scope.row.clientLabelId && scope.row.delFlag == 0 ? '取消客户标签' : '设置客户标签'}}
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
  import { addClientLabel, delClientLabel } from '@/api/client/customerLabel'
  import { getFiles, delFiles, uploadFiles } from '@/api/qiniu'
  import waves from '@/directive/waves/index.js' // 水波纹指令
  import { mapGetters } from 'vuex'
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
    components: {},
    name: 'table_customerLabel',
    directives: {
      waves
    },
    props: {
      activeUrl: {
        default: '/client/customerLabel'
      },
      productQuery: {
        default: false
      },
      clientLabelList: {
        default: () => {
          return {}
        }
      }
    },
    filters: {
      parseTime (time) {
        if(!time) return
        let date = new Date(time)
        return parseTime(date)
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
          productTypeIds: [],
          productStatus: [],
          annualizedReturns: [],
          isFloat: null,
          orderByField: 'create_time',
          isAsc: false
        },
        // role: undefined,
        form: {
          name: undefined,
          password: undefined,
          // delFlag: undefined,
          deptId: undefined
        },
        userAdd: false,
        userUpd: false,
        userDel: false,
        dialogStatus: '',
        tableKey: 0,
        // currencyList: [],
        productTypes: [],
        clientLabelId: ''
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
      this.clientLabelId = this.$route.params.clientLabelId
    },
    watch: {
      clientLabelList(curVal, oldVal) {
        if(curVal) {
          this.listLoading = false
          this.list = curVal.records
          this.total = curVal.total
        }
      }
    },
    methods: {
      handleSelectionChange(val) {
        let arr = []
        val.forEach(item => {
          arr.push(item.clientId)
        })
        this.$emit('selectClient', arr)
      },
      handleSizeChange(val) {
        this.listQuery.limit = val
        this.$emit('searchList', this.listQuery)
      },
      handleCurrentChange(val) {
        this.listQuery.page = val
        this.$emit('searchList', this.listQuery)
      },
      handleUpdate(id) { // 查看
        this.$router.push({
          path: '/client/readDetail/' + id
        })
        Bus.$emit('activeIndex', this.activeUrl)
        localStorage.setItem('activeUrl', this.activeUrl)
      },
      resetTemp() {
        this.form = {
          id: undefined,
          name: ''
        }
      },
      clientLabelHandle(id, clientLabelId) {
        let text = id ? '取消' : '设置'
        this.$confirm('确定' + text + '客户标签?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          if (clientLabelId) {
            const param = {
              clientIds: [id]
            }
            delClientLabel([id]).then(res => {
              if (res.status !== 200) return
              this.$notify({
                title: '成功',
                message: '取消成功',
                type: 'success',
                duration: 2000
              })
              this.$emit('searchList', this.listQuery)
            })
          } else {
            const param = {
              clientId: [id],
              clientLabelIds: [this.clientLabelId]
            }
            addClientLabel(param).then(res => {
              if (res.status !== 200) return
              this.$notify({
                title: '成功',
                message: '设置成功',
                type: 'success',
                duration: 2000
              })
              this.$emit('searchList', this.listQuery)
            })
          }
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
</style>

<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container" style="text-align: right">
      <el-button v-if="sys_prd_type_add"
                 class="filter-item add_btn"
                 style="margin-bottom: 0;"
                 @click="handleCreate"
                 type="primary"
                 icon="edit">
        <svg-icon icon-class="add"></svg-icon> 新增</el-button>
    </div>

    <el-table :key='tableKey'
              :data="list"
              v-loading="listLoading"
              element-loading-text="给我一点时间"
              border fit
              highlight-current-row
              style="width: 100%">

      <el-table-column align="center" label="业绩标准">
        <template slot-scope="scope">
          <span>试用期业绩标准第{{scope.row.month}}个月：{{scope.row.norm}}%</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="操作">
        <template slot-scope="scope">
          <a v-if="sys_prd_type_upd"
             size="small"
             class="common_btn"
             @click="handleUpdate(scope.row)">编辑
          </a>
          <a v-if="sys_prd_type_upd && scope.row.probationNormId >= list.length-1"
             size="small"
             class="danger_btn"
             @click="deletes(scope.row)">删除
          </a>
        </template>
      </el-table-column>

    </el-table>

    <div v-show="!listLoading" class="pagination-container">
      <el-pagination @size-change="handleSizeChange"
                     @current-change="handleCurrentChange"
                     :current-page.sync="listQuery.page"
                     :page-sizes="[10,20,30, 50]"
                     :page-size="listQuery.limit"
                     layout="total, sizes, prev, pager, next, jumper"
                     :total="total">
      </el-pagination>
    </div>

    <el-dialog :title="textMap[dialogStatus]"
               class="nopb"
               :visible.sync="dialogFormVisible">
      <el-form :model="form"
               :rules="rules"
               ref="form"
               label-width="30%">

        <el-form-item :label="dialogLabel" prop="name">
          <el-input v-model="form.name"></el-input>
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button class="search_btn" @click="cancel('form')">取 消</el-button>
        <el-button class="add_btn" v-if="dialogStatus=='create'" @click="create('form')">确 定</el-button>
        <el-button class="add_btn" v-else @click="update('form')">修 改</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import { getPbtList, editPbtItem, putPbtItem, delPbtItem } from '@/api/achievement'

  export default {
    name: 'table_user',
    data() {
      return {
        list: [],
        total: null,
        listLoading: false,
        listQuery: {
          page: 1,
          limit: 20
        },
        form: {},
        statusOptions: ['0', '1'],
        dialogFormVisible: false,
        dialogStatus: '',
        textMap: {
          update: '编辑试用期业绩标准',
          create: '新增试用期业绩标准'
        },
        tableKey: 0,
        rules: {
          name: [
            { required: true, trigger: 'blur', message: '请输入试用期业绩标准' }
          ]
        }
      }
    },
    computed: {
      ...mapGetters([
        'permissions'
      ]),
      dialogLabel() {
        return `试用期标准第${this.list.length + 1}个月（%）`
      }
    },
    created() {
      this.getList()
      this.sys_prd_type_add = this.permissions['sys_prd_type_add']
      this.sys_prd_type_upd = this.permissions['sys_prd_type_upd']
      this.sys_prd_type_del = this.permissions['sys_prd_type_del']
    },
    methods: {
      getList() {
        this.listLoading = true
        getPbtList().then(response => {
          this.list = response.data
          this.total = response.data.length || 0
          this.listLoading = false
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
      handleCreate() {
        this.resetTemp()
        this.dialogStatus = 'create'
        this.dialogFormVisible = true
      },
      handleUpdate(row) {
        // getObj(row.productTypeId)
        //   .then(response => {
        //     this.form = response.data
        //     this.dialogFormVisible = true
        //     this.dialogStatus = 'update'
        //   })
      },
      create(formName) {
        const set = this.$refs
        set[formName].validate(valid => {
          if (valid) {
            this.list.push({ probationNormId: this.list.length, norm: this.form.name })
            this.dialogFormVisible = false
            // addObj(this.form)
            //   .then(() => {
            //     this.dialogFormVisible = false
            //     this.getList()
            //     this.$notify({
            //       title: '成功',
            //       message: '创建成功',
            //       type: 'success',
            //       duration: 2000
            //     })
            //   })
          } else {
            return false
          }
        })
      },
      cancel(formName) {
        this.dialogFormVisible = false
        this.$refs[formName].resetFields()
      },
      update(formName) {
        const set = this.$refs
        set[formName].validate(valid => {
          if (valid) {
            this.dialogFormVisible = false
            // putObj(this.form).then(() => {
            //   this.dialogFormVisible = false
            //   this.getList()
            //   this.$notify({
            //     title: '成功',
            //     message: '修改成功',
            //     type: 'success',
            //     duration: 2000
            //   })
            // })
          } else {
            return false
          }
        })
      },
      deletes(row) {
        this.$confirm('此操作将永久删除(试用期业绩标准：' + row.norm + '%), 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.list.splice(row.probationNormId, 1)
          // delObj(row.currencyId).then(() => {
          //   this.getList()
          //   this.$notify({
          //     title: '成功',
          //     message: '删除成功',
          //     type: 'success',
          //     duration: 2000
          //   })
          // }).cache(() => {
          //   this.$notify({
          //     title: '失败',
          //     message: '删除失败',
          //     type: 'error',
          //     duration: 2000
          //   })
          // })
        })
      },
      resetTemp() {
        this.form = {
          month: undefined,
          norm: undefined
        }
      }
    }
  }
</script>

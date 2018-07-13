<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container" style="text-align: right">
      <el-tabs v-model="type" type="card" @tab-click="handleClick" class="contract-tabs">
        <el-tab-pane label="预约不通过原因" name="0"></el-tab-pane>
        <el-tab-pane label="打款不通过/订单关闭原因" name="1"></el-tab-pane>
        <el-tab-pane label="合同不通过原因" name="2"></el-tab-pane>
        <el-tab-pane label="退款不通过原因" name="3"></el-tab-pane>
      </el-tabs>
      <el-button v-if="sys_prd_type_add"
                 class="filter-item add_btn"
                 style="margin-left: 10px; float: right"
                 type="primary"
                 @click="handleCreate"
                 icon="edit">
        <svg-icon icon-class="add"></svg-icon>
        新建原因
      </el-button>

    </div>

    <el-table :key='tableKey' :data="list" v-loading="listLoading" element-loading-text="给我一点时间" border fit
              highlight-current-row style="width: 100%">

      <el-table-column align="center" label="序号" type="index" width="50">
        <!-- <template slot-scope="scope">
          <span>{{scope.row.productTypeId}}</span>
        </template> -->
      </el-table-column>

      <el-table-column align="center" label="不通过原因">
        <template slot-scope="scope">
          <span>{{scope.row.failAuditReason}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="操作">
        <template slot-scope="scope">
          <a v-if="sys_prd_type_upd" size="small" class="common_btn"
             @click="handleUpdate(scope.row)">编辑
          </a>
          <a v-if="sys_prd_type_del" size="small" class="danger_btn"
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
    </div>

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form :model="form" :rules="rules" ref="form" label-width="100px">

        <el-form-item label="不通过原因" prop="failAuditReason">
          <el-input v-model="form.failAuditReason"></el-input>
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
  import {searchAppReasons, addReason, delReason, modifyReason, getReason} from '@/api/transc/transc'
  import waves from '@/directive/waves/index.js' // 水波纹指令
  // import { parseTime } from '@/utils'
  import {mapGetters} from 'vuex'
  import ElRadioGroup from 'element-ui/packages/radio/src/radio-group'
  import ElOption from "element-ui/packages/select/src/option"

  export default {
    components: {
      ElOption,
      ElRadioGroup
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
          limit: 20
        },
        form: {
          failAuditReason: undefined,
          failAuditType: undefined,
          auditFailReasonId: undefined
        },
        statusOptions: ['0', '1'],
        dialogFormVisible: false,
        dialogDeptVisible: false,
        userAdd: false,
        userUpd: false,
        userDel: false,
        dialogStatus: '',
        isDisabled: {
          0: false,
          1: true
        },
        textMap: {
          update: '编辑不通过原因',
          create: '新增不通过原因'
        },
        tableKey: 0,
        rules: {
          failAuditReason: [
            {
              required: true,
              trigger: 'blur',
              message: '请输入不通过原因'
            }
          ]
        },
        type: 0,
        fail_audit_type: [10, 20, 30, 40]
      }
    },
    computed: {
      ...mapGetters([
        'permissions'
      ])
    },
    filters: {
      statusFilter(status) {
        const statusMap = {
          0: '有效',
          1: '无效',
          9: '锁定'
        }
        return statusMap[status]
      }
    },
    created() {
      this.getList()
      this.sys_prd_type_add = this.permissions['sys_prd_type_add']
      this.sys_prd_type_upd = this.permissions['sys_prd_type_upd']
      // this.sys_prd_type_del = this.permissions['sys_prd_type_del']
      this.sys_prd_type_del = true
    },
    methods: {
      getList() {
        this.listLoading = true
        this.listQuery.type = this.fail_audit_type[this.type]
        searchAppReasons(this.listQuery).then(res => {
          this.list = res.data.records
          this.total = res.data.total
          this.listLoading = false
        })
      },
      handleClick(tab, event) {
        this.getList()
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
        getReason(row.auditFailReasonId).then(res => {
          this.form = res.data
          this.dialogFormVisible = true
          this.dialogStatus = 'update'
        })
      },
      create(formName) {
        const set = this.$refs
        this.form.failAuditType = this.fail_audit_type[this.type]
        set[formName].validate(valid => {
          if (valid) {
            addReason(this.form)
              .then(res => {
                this.dialogFormVisible = false
                this.getList()
                if (res.code !== 1007) {
                  this.$notify({
                    title: '成功',
                    message: '创建成功',
                    type: 'success',
                    duration: 2000
                  })
                }
              })

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
            modifyReason(this.form).then(() => {
              this.dialogFormVisible = false
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
      deletes(row) {
        this.$confirm('此操作将永久删除该原因(原因名:' + row.failAuditReason + '), 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          delReason(row.auditFailReasonId).then(() => {
            this.getList()
            this.$notify({
              title: '成功',
              message: '删除成功',
              type: 'success',
              duration: 2000
            })
          }).catch(() => {
            this.$notify({
              title: '失败',
              message: '删除失败',
              type: 'error',
              duration: 2000
            })
          })
        })
      },
      resetTemp() {
        this.form = {
          failAuditType: undefined,
          failAuditReason: ''
        }
      }
    }
  }
</script>
<style rel="stylesheet/scss" lang="scss">
  .app-container {
    .filter-container {
      .contract-tabs {
        float: left;
        .el-tabs__header {
          .el-tabs__item.is-active {
            background-color: #0299CC;
            color: #fff;
          }
        }
      }
    }
  }
</style>

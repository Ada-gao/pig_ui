<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" placeholder="职位名称"
                v-model="listQuery.positionName">
      </el-input>
      <el-button class="filter-item" type="primary" v-waves icon="search" @click="handleFilter">搜索</el-button>
      <el-button v-if="sys_user_add" class="filter-item" style="margin-left: 10px;" @click="handleCreate" type="primary" icon="edit">添加</el-button>
    </div>

    <el-table :key='tableKey' :data="list" v-loading="listLoading" element-loading-text="给我一点时间" border fit
              highlight-current-row style="width: 100%">

      <el-table-column align="center" label="序号" type="index">
        <!-- <template slot-scope="scope">
          <span>{{scope.row.positionId}}</span>
        </template> -->
      </el-table-column>

      <el-table-column align="center" label="职位">
        <template slot-scope="scope">
          <span>{{scope.row.positionName}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="操作">
        <template slot-scope="scope">
          <el-button v-if="sys_user_upd" size="small" type="success"
                     @click="handleUpdate(scope.row)">编辑
          </el-button>
          <el-button v-if="sys_user_del" size="small" type="danger"
                     @click="deletes(scope.row)">删除
          </el-button>
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

    <!-- <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogDeptVisible">
      <el-tree
        class="filter-tree"
        :data="treeDeptData"
        :default-checked-keys="checkedKeys"
        check-strictly
        node-key="id"
        highlight-current
        ref="deptTree"
        :props="defaultProps"
        @node-click="getNodeData"
        default-expand-all
      >
      </el-tree>
    </el-dialog> -->

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form :model="form" ref="form" label-width="100px">
        
        <el-form-item label="职位" prop="positionName">
          <el-input v-model="form.positionName" placeholder="请输入职位名称"></el-input>
          <input type="hidden" v-model="form.positionId">
        </el-form-item>
        
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel('form')">取 消</el-button>
        <el-button v-if="dialogStatus=='create'" type="primary" @click="create('form')">确 定</el-button>
        <el-button v-else type="primary" @click="update('form')">修 改</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import { fetchPosition, getObj, addObj, putObj, delObj } from '@/api/posi'
  // import { deptRoleList, fetchDeptTree } from '@/api/role'
  import waves from '@/directive/waves/index.js' // 水波纹指令
  // import { parseTime } from '@/utils'
  import { mapGetters } from 'vuex'
  import ElRadioGroup from 'element-ui/packages/radio/src/radio-group'
  import ElOption from "element-ui/packages/select/src/option"

  export default {
    components: {
      ElOption,
      ElRadioGroup },
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
        role: undefined,
        form: {
          positionName: undefined,
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
          update: '编辑职位',
          create: '新增职位'
        },
        isDisabled: {
          0: false,
          1: true
        },
        tableKey: 0,
        maritalStatus: ''
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
      this.sys_user_add = this.permissions['sys_user_add']
      this.sys_user_upd = this.permissions['sys_user_upd']
      this.sys_user_del = this.permissions['sys_user_del']
    },
    methods: {
      getList() {
        this.listLoading = true
        // this.listQuery.orderByField = '`user`.create_time'
        // this.listQuery.isAsc = false
        fetchPosition(this.listQuery).then(response => {
          this.list = response.data.records
          this.total = response.data.total
          this.listLoading = false
        })
      },
      // getNodeData(data) {
      //   this.dialogDeptVisible = false
      //   this.form.deptId = data.id
      //   this.form.deptName = data.name
      //   deptRoleList(data.id)
      //     .then(response => {
      //       this.rolesOptions = response.data
      //     })
      // },
      // handleDept() {
      //   fetchDeptTree()
      //     .then(response => {
      //       this.treeDeptData = response.data
      //       this.dialogDeptVisible = true
      //     })
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
      handleCreate() {
        this.resetTemp()
        this.dialogStatus = 'create'
        this.dialogFormVisible = true
      },
      handleUpdate(row) {       // 编辑功能
        getObj(row.positionId)
          .then(response => {
            this.form = response.data
            // this.role = row.roleList[0].roleId
            this.dialogFormVisible = true
            this.dialogStatus = 'update'
            // deptRoleList(response.data.deptId)
            //   .then(response => {
            //     this.rolesOptions = response.data
            //   })
          })
      },
      create(formName) {
        const set = this.$refs
        // this.form.role = this.role
        set[formName].validate(valid => {
          if (valid) {
            addObj({name: this.form.positionName})
              .then(() => {
                this.dialogFormVisible = false
                this.getList()
                this.$notify({
                  title: '成功',
                  message: '创建成功',
                  type: 'success',
                  duration: 2000
                })
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
      update(formName) {      // 提交编辑
        const set = this.$refs
        set[formName].validate(valid => {
          if (valid) {
            this.dialogFormVisible = false
            putObj(this.form).then(() => {
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
        this.$confirm('此操作将永久删除该职位( ' + row.positionName + ' ), 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          delObj(row.positionId).then(() => {
            this.getList()
            this.$notify({
              title: '成功',
              message: '删除成功',
              type: 'success',
              duration: 2000
            })
          }).cache(() => {
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
          positionName: '',
        }
      }
    }
  }
</script>

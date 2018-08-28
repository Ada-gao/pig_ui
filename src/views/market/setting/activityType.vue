<template>
  <div class="app-container calendar-list-container">
  

    <div style="text-align: right">
      <el-button v-if="sys_user_add" class="add_btn" @click="handleCreate">
        <svg-icon icon-class="add"></svg-icon> 添加</el-button>
    </div>
  
    <el-table :key='tableKey' :data="list" v-loading="listLoading" element-loading-text="给我一点时间" border fit
              highlight-current-row style="width: 100%">

    

      <el-table-column align="center" label="活动类型">
        <template slot-scope="scope">
        <span>{{scope.row.deptName}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="操作">
        <template slot-scope="scope">
          <a size="small" class="common_btn"
                     @click="handleUpdate(scope.row, 'view')">查看
          </a>
        <a size="small" class="danger_btn">删除</a>
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

      <el-dialog
          title="新增部门logo"
          :visible.sync="dialogVisible"
          width="30%">
          <el-form  ref="newAddClient" label-width="100px" class="demo-ruleForm">

          <el-form-item  label="部门名称">
            <el-input placeholder="签到人部门" style="width:90%;"></el-input>
          </el-form-item>

          <el-form-item label="部门logo">
           
          </el-form-item>
        
        </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button  class="search_btn" @click="cancel('newAddClient')">取 消</el-button>
            <el-button  class="add_btn" @click="clientDetermine('newAddClient')">确 定</el-button>
          </div>
        </el-dialog>
  </div>
</template>

<script>
  import { fetchList, getObj, addObj, putObj, delObj } from '@/api/user'
  import { deptRoleList, fetchDeptTree } from '@/api/role'
  import { getPositionName } from '@/api/posi'
  import { getAllPositon } from '@/api/queryConditions'
  import waves from '@/directive/waves/index.js' // 水波纹指令
  import { parseTime, transformText, transformText1 } from '@/utils'
  import { mapGetters } from 'vuex'
  import ElRadioGroup from 'element-ui/packages/radio/src/radio-group'
  import ElOption from "element-ui/packages/select/src/option"
  import Bus from '@/assets/js/bus'

  export default {
    components: {
      ElOption,
      ElRadioGroup
    },
    filters: {
      turnText (val, list) {
        return transformText1(val, list)
      },
      parseTime (time) {
        if(!time) return
        let date = new Date(time)
        return parseTime(date)
      }
    },
    name: 'activityType',
    directives: {
      waves
    },
    data() {
      return {
        dialogVisible:false,
        step:1,
        list: null,
        total: null,
        listLoading: true,
        listQuery: {
          page: 1,
          limit: 20
        },
        role: undefined,
        form: {
          name: 'rank',
          username: undefined,
          password: undefined,
          status: undefined,
          deptId: undefined
        },
        // statusOptions: ['0', '1', '2'],
        positionsOptions: [],
        // dialogDeptVisible: false,
        userAdd: false,
        userUpd: false,
        userDel: false,
        // dialogStatus: '',
        tableKey: 0,
        // value13: '',
        eduOptions: [],
        // IDType: '',
        // employeeDate: '',
        // maritalStatus: '',
        positionId: '',
        status: '',
        // tableData: [],
        // tableHeader: [],
        entryDate: [],
        // positionName: '',
        // isReadonly: false
      }
    },
    computed: {
      ...mapGetters([
        'permissions',
        'workStatus',
        'lockStatus'
      ])
    },
    created() {
      // this.handlePosition()
      this.getList()
      this.sys_user_add = this.permissions['sys_user_add']
      this.sys_user_upd = this.permissions['sys_user_upd']
      this.sys_user_del = this.permissions['sys_user_del']
    },
    methods: {
      getList() {
        this.listLoading = true
        this.listQuery.orderByField = '`user`.create_time'
        this.listQuery.isAsc = false
        if(this.entryDate.length > 0) {
          this.listQuery.startTime = parseTime(this.entryDate[0], '{y}-{m}-{d}')
          this.listQuery.endTime = parseTime(this.entryDate[1], '{y}-{m}-{d}')
        } else {
          this.listQuery.startTime = ''
          this.listQuery.endTime = ''
        }
        // this.handlePosition()
        fetchList(this.listQuery).then(response => {
          this.list = response.data.records
          // console.log(this.list)
          this.list.map(item => {
            item.roleDesc = item.roleList.length > 0 ? item.roleList[0].roleDesc : ''
          })
          this.total = response.data.total
          this.listLoading = false
          getAllPositon().then(res => {
            this.positionsOptions = res.data
            this.list.forEach(item => {
              item.positionId = transformText(this.positionsOptions, item.positionId)
              item.statusNum = item.status
              // item.status = transformText(this.workStatus, item.status)
            })
          })
        })
      },
      // getNodeData(data) { // 部门查询
      //   // this.dialogDeptVisible = false
      //   this.form.deptId = data.id
      //   this.form.deptName = data.name
      //   deptRoleList(data.id)
      //     .then(response => {
      //       this.rolesOptions = response.data
      //       this.role = this.rolesOptions[0] ? this.rolesOptions[0].roleId : ''
      //     })
      // },
      handlePosition() {
        getAllPositon().then(res => {
          this.positionsOptions = res.data
        })
      },
      // handleDept() {
      //   fetchDeptTree()
      //     .then(response => {
      //       this.treeDeptData = response.data
      //       // this.dialogDeptVisible = true
      //     })
      // },
      // changeDept() {
      //   this.role = ''
      //   this.form.role = ''
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
      handleCreate() { // 新增
        this.resetTemp()
        // this.dialogStatus = 'create'
        this.$router.push('/admin/user-detail')
        Bus.$emit('activeIndex', '/admin/user')
      },
      handleUpdate(row, state) { // 编辑查询（查看）
        this.$router.push('/admin/user-detail/' + row.userId + '/' + state)
        Bus.$emit('activeIndex', '/admin/user')
      },
      deletes(row) {
        this.$confirm('此操作将永久删除该用户(用户名:' + row.username + '), 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          delObj(row.userId).then(() => {
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
          id: undefined,
          username: '',
          password: '',
          role: undefined
        }
      },
      resetFilter() { // 重置搜索条件
        this.listQuery = {
          page: 1,
          limit: 20,
          username: '',
          positionId: '',
          status: ''
        },
        this.entryDate = []
        this.handleFilter()
      }
    }
  }
</script>

<style lang="scss" scoped>
.el-select,
.el-date-editor {
  width: 100%;
}
</style>


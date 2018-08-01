<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <!-- <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" placeholder="用户名"
                v-model="listQuery.username">
      </el-input>
      <el-button class="filter-item" type="primary" v-waves icon="search" @click="handleFilter">搜索</el-button>
      <el-button v-if="sys_user_add" class="filter-item" style="margin-left: 10px;" @click="handleCreate" type="primary" icon="edit">添加</el-button> -->
      <el-form label-position="right" label-width="80px">
        <el-row :gutter="20">
          <el-col :xs="24" :sm="12" :md="12" :lg="8" :xl="8">
            <el-form-item label="搜索">
              <el-input
                placeholder="搜索员工、手机号、工号"
                prefix-icon="el-icon-search"
                v-model="listQuery.searchParams">
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="12" :lg="8" :xl="8">
            <el-form-item label="职位">
              <el-select class="filter-item" v-model="listQuery.positionId" placeholder="请选择" @focus="handlePosition()">
                <el-option v-for="item in positionsOptions" :key="item.positionId" :value="item.positionId" :label="item.positionName">
                  <span style="float: left">{{ item.positionName }}</span>
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="12" :lg="8" :xl="8">
            <el-form-item label="工作状态">
              <el-select class="filter-item" v-model="listQuery.status" placeholder="请选择">
                <el-option v-for="item in workStatus" :key="item.value" :value="item.value" :label="item.label">
                  <span style="float: left">{{ item.label }}</span>
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        <!-- </el-row> -->
        <!-- <el-row :gutter="10"> -->
          <el-col :xs="24" :sm="12" :md="12" :lg="8" :xl="8">
            <el-form-item label="入职时间">
              <el-date-picker
                v-model="entryDate"
                type="daterange"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                :default-time="['00:00:00', '23:59:59']">
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row style="text-align: center;">
          <el-button class="search_btn" @click="handleFilter"><svg-icon icon-class="search"></svg-icon> 查询</el-button>
          <el-button class="search_btn" @click="resetFilter"><svg-icon icon-class="reset"></svg-icon> 重置</el-button>
        </el-row>
      </el-form>
    </div>

    <div style="text-align: right">
      <el-button v-if="sys_user_add" class="add_btn" @click="handleCreate">
        <svg-icon icon-class="add"></svg-icon> 添加</el-button>
    </div>
    <el-table :key='tableKey' :data="list" v-loading="listLoading" element-loading-text="给我一点时间" border fit
              highlight-current-row style="width: 100%">

      <el-table-column align="center" label="序号" type="index" width="50">
      </el-table-column>

      <el-table-column align="center" label="用户名" class-name="left">
        <template slot-scope="scope">
          <span>
            <img v-if="scope.row.avatar" class="user-avatar" style="width: 20px; height: 20px; border-radius: 50%;" :src="scope.row.avatar+'?imageView2/1/w/20/h/20'">
            {{scope.row.username}}
          </span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="所属部门" show-overflow-tooltip>
        <template slot-scope="scope">
        <span>{{scope.row.deptName}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="职位" class-name="toggle">
        <template slot-scope="scope">
          <span>{{scope.row.positionId}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="角色">
        <template slot-scope="scope">
          <span>{{scope.row.roleList[0].roleDesc}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="入职时间">
        <template slot-scope="scope">
          <span>{{scope.row.employeeDate | parseTime('{y}-{m}-{d}')}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" class-name="status-col" label="状态">
        <template slot-scope="scope">
          <!-- <el-tag :class="'leave': scope.row.statusNum == 0,
                          'normal': scope.row.statusNum == 1,
                          'unusual': scope.row.statusNum == 2"
          >{{scope.row.status}}</el-tag> -->
          <el-tag v-if="scope.row.statusNum == 0" class="normal">{{scope.row.status}}</el-tag>
          <el-tag v-if="scope.row.statusNum == 1" class="leave">{{scope.row.status}}</el-tag>
          <el-tag v-if="scope.row.statusNum == 2" class="unusual">{{scope.row.status}}</el-tag>
        </template>
      </el-table-column>

      <el-table-column align="center" label="手机号" show-overflow-tooltip>
        <template slot-scope="scope">
        <span>{{scope.row.mobile}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="工号" show-overflow-tooltip>
        <template slot-scope="scope">
        <span>{{scope.row.empNo}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="直属上级" show-overflow-tooltip>
        <template slot-scope="scope">
        <span>{{scope.row.directSupervisorName}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="操作" fixed="right" width="150">
        <template slot-scope="scope">
          <a size="small" class="common_btn"
                     @click="handleUpdate(scope.row, 'view')">查看
          </a>
          <span class="space_line"> | </span>
          <a v-if="sys_user_upd" size="small" class="common_btn"
                     @click="handleUpdate(scope.row, 'edit')">编辑
          </a>
          <!-- <el-button v-if="sys_user_del" size="small" type="danger"
                     @click="deletes(scope.row)">删除
          </el-button> -->
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

  </div>
</template>

<script>
  import { fetchList, getObj, addObj, putObj, delObj } from '@/api/user'
  import { deptRoleList, fetchDeptTree } from '@/api/role'
  import { getPositionName } from '@/api/posi'
  import { getAllPositon } from '@/api/queryConditions'
  import waves from '@/directive/waves/index.js' // 水波纹指令
  import { parseTime, transformText } from '@/utils'
  import { mapGetters } from 'vuex'
  import ElRadioGroup from 'element-ui/packages/radio/src/radio-group'
  import ElOption from "element-ui/packages/select/src/option"
  import Bus from '@/assets/js/bus'

  export default {
    components: {
      ElOption,
      ElRadioGroup,
    },
    filters: {
      parseTime (time) {
        if(!time) return
        let date = new Date(time)
        return parseTime(date)
      }
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
        role: undefined,
        form: {
          name: 'rank',
          username: undefined,
          password: undefined,
          status: undefined,
          deptId: undefined
        },
        statusOptions: ['0', '1', '2'],
        positionsOptions: [],
        rolesOptions: [],
        dialogFormVisible: false,
        dialogDeptVisible: false,
        dialogFormView: false,
        userAdd: false,
        userUpd: false,
        userDel: false,
        dialogStatus: '',
        tableKey: 0,
        input2: '',
        gender: '',
        value13: '',
        eduOptions: [],
        education: '',
        // IDType: '',
        employeeDate: '',
        maritalStatus: '',
        fileList: [],
        positionId: '',
        status: '',
        tableData: [],
        tableHeader: [],
        entryDate: [],
        // positionName: '',
        isReadonly: false
      }
    },
    computed: {
      ...mapGetters([
        'permissions',
        'educationType',
        'genderType',
        'idTypeOptions',
        'marriageStatusOptions',
        'workStatus'
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
          this.total = response.data.total
          this.listLoading = false
          getAllPositon().then(res => {
            this.positionsOptions = res.data
            this.list.forEach(item => {
              item.positionId = transformText(this.positionsOptions, item.positionId)
              item.statusNum = item.status
              item.status = transformText(this.workStatus, item.status)
            })
          })
        })
      },
      getNodeData(data) { // 部门查询
        this.dialogDeptVisible = false
        this.form.deptId = data.id
        this.form.deptName = data.name
        deptRoleList(data.id)
          .then(response => {
            this.rolesOptions = response.data
            this.role = this.rolesOptions[0] ? this.rolesOptions[0].roleId : ''
          })
      },
      handlePosition() {
        getAllPositon().then(res => {
          this.positionsOptions = res.data
        })
      },
      handleDept() {
        fetchDeptTree()
          .then(response => {
            this.treeDeptData = response.data
            this.dialogDeptVisible = true
          })
      },
      changeDept() {
        this.role = ''
        this.form.role = ''
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
      handleCreate() { // 新增
        this.resetTemp()
        this.dialogStatus = 'create'
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


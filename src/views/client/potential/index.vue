<template>
  <div class="app-container calendar-list-container">
    <search-bar-component @search-list="serachList"
      :searchIdNo="false"
      :searchClientClass="false"
      :searchAmount="false"
      :searchNationality="false"
      :searchCity="false"
      :searchClientType="false"
      >
    </search-bar-component>

    <div style="text-align: right">
      <!-- <el-button v-if="sys_user_add" class="filter-item" style="margin-left: 10px;" @click="handleCreate" type="primary" icon="edit">添加</el-button> -->
      <!-- <upload-excel-component @on-selected-file='selected'></upload-excel-component> -->
    </div>
    <el-table :key='tableKey' :data="list" v-loading="listLoading" element-loading-text="给我一点时间" border fit
              highlight-current-row style="width: 100%">

      <el-table-column align="center" label="客户编号">
        <template slot-scope="scope">
          <span>{{scope.row.clientNo}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="客户姓名">
        <template slot-scope="scope">
          <span>{{scope.row.name}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="实名认证状态">
        <template slot-scope="scope">
          <span>{{scope.row.realnameStatus}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="投资者类型">
        <template slot-scope="scope">
          <span>{{scope.row.clientType}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="手机号">
        <template slot-scope="scope">
          <span>{{scope.row.mobile}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="微信号">
        <template slot-scope="scope">
          <span>{{scope.row.wechat}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="邮箱">
        <template slot-scope="scope">
          <span>{{scope.row.email}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="理财师">
        <template slot-scope="scope">
          <span>{{scope.row.userName}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="部门" show-overflow-tooltip>
        <template slot-scope="scope">
          <span>{{scope.row.userDeptName}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="国籍（常住地区）" show-overflow-tooltip>
        <template slot-scope="scope">
          <span>{{scope.row.nationality}}</span>
          <span>{{scope.row.city}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="操作" fixed="right" width="150">
        <template slot-scope="scope">
          <a v-if="sys_user_upd" size="small" class="common_btn"
                     @click="handleRouter(scope.row.clientId)">查看
          </a>
          <span class="space_line"> | </span>
          <a v-if="sys_user_upd" size="small" class="common_btn"
                     @click="handleUpdate(scope.row.clientId)">编辑
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
  import searchBarComponent from '@/views/layout/components/searchBar'
  import { fetchList, getObj, addObj, putObj, delObj } from '@/api/client/client'
  // import { deptRoleList, fetchDeptTree } from '@/api/role'
  import { getPositionName } from '@/api/posi'
  import { getAllPositon } from '@/api/queryConditions'
  import waves from '@/directive/waves/index.js' // 水波纹指令
  import { parseTime, transformText } from '@/utils'
  import { mapGetters } from 'vuex'
  import ElRadioGroup from 'element-ui/packages/radio/src/radio-group'
  import ElOption from "element-ui/packages/select/src/option"
  import { isvalidMobile, isvalidID } from '@/utils/validate'
  import Bus from '@/assets/js/bus'

  const validMobile = (rule, value, callback) => {
    if (!value) {
      callback(new Error('请输入电话号码'))
    } else if (!isvalidMobile(value)) {
      callback(new Error('请输入正确的11位手机号'))
    } else {
      callback()
    }
  }

  const validID = (rule, value, callback) => {
    if (!value) {
      callback(new Error('请输入身份证号码'))
    } else if (!isvalidID(value)) {
      callback(new Error('请输入正确的身份证号码'))
    } else {
      callback()
    }
  }

  export default {
    components: {
      ElOption,
      ElRadioGroup,
      searchBarComponent
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
          label: 'name',
          value: 'id'
        },
        list: null,
        total: null,
        listLoading: true,
        listQuery: {
          page: 1,
          limit: 20,
          type: 0 // 1：客户，0：潜客
        },
        role: undefined,
        form: {
          name: 'rank',
          username: undefined,
          password: undefined,
          // delFlag: undefined,
          deptId: undefined
        },
        statusOptions: ['0', '1', '2'],
        positionsOptions: [],
        rolesOptions: [],
        dialogFormVisible: false,
        dialogDeptVisible: false,
        userAdd: false,
        userUpd: false,
        userDel: false,
        dialogStatus: '',
        textMap: {
          update: '编辑员工',
          create: '新增员工'
        },
        isDisabled: {
          0: false,
          1: true
        },
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
        // delFlag: '',
        tableData: [],
        tableHeader: [],
        entryDate: [],
        deptId: []
      }
    },
    computed: {
      ...mapGetters([
        'certificationStatus',
        'clientType',
        'permissions',
        'educationType',
        'genderType',
        'idTypeOptions',
        'marriageStatusOptions',
        // 'delFlagOptions',
        'nationality',
        'realnameStatus'
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
        // this.listQuery.orderByField = 'create_time'
        // this.listQuery.isAsc = false
        // this.handlePosition()
        // this.handleDept()
        // if(this.deptId.length) {
        //   this.listQuery.deptId = this.deptId[this.deptId.length - 1]
        // }
        fetchList(this.listQuery).then(response => {
          this.list = response.data.records
          this.total = response.data.total
          this.listLoading = false
          this.list.forEach(item => {
            
            item.realnameStatus = transformText(this.realnameStatus, item.realnameStatus)
            item.positionId = transformText(this.positionsOptions, item.positionId)
            item.clientType = transformText(this.clientType, item.clientType)
            item.nationality = transformText(this.nationality, item.nationality)
          })
        })
      },
      getNodeData(data) { // 部门查询
        this.dialogDeptVisible = false
        this.listQuery.deptId = data.id
        this.listQuery.deptName = data.name
        deptRoleList(data.id)
          .then(response => {
            this.rolesOptions = response.data
          })
      },
      // handlePosition() {
      //   getAllPositon().then(res => {
      //     this.positionsOptions = res.data
      //   })
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
      handleRouter(id) { // 查看跳转详情
        this.$router.push({
          path: '/client/readDetail/' + id + '/0'
        })
        Bus.$emit('activeIndex', '/client/potential')
      },
      handleUpdate(id) { // 编辑跳转详情
        this.$router.push({
          path: '/client/detail/' + id + '/1'
        })
        Bus.$emit('activeIndex', '/client/potential')
      },
      // handleUpdate(row) { // 编辑查询
      //   getObj(row.userId)
      //     .then(response => {
      //       this.form = response.data
      //       this.form.role = row.roleList[0].roleId
      //       this.role = row.roleList[0].roleDesc
      //       this.dialogFormVisible = true
      //       this.dialogStatus = 'update'
      //       getPositionName(this.form.positionId).then(res => {
      //         this.form.positionName = res.data
      //       })
      //       deptRoleList(response.data.deptId)
      //         .then(response => {
      //           this.rolesOptions = response.data
      //         })
      //     })
      // },
      create(formName) {
        const set = this.$refs
        this.form.role = this.role
        // this.form.idType = this.IDType
        // this.form.marriageStatus = this.maritalStatus
        set[formName].validate(valid => {
          if (valid) {
            addObj(this.form)
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
      update(formName) { // 编辑提交
        const set = this.$refs
        // this.form.role = this.role
        set[formName].validate(valid => {
          if (valid) {
            this.dialogFormVisible = false
            this.form.password = undefined
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
      serachList(data) {
        this.listQuery = data
        this.listQuery.type = 0
        this.getList()
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


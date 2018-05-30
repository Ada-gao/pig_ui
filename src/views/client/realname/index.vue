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
              placeholder="搜索客户姓名、编号"
              prefix-icon="el-icon-search"
              v-model="listQuery.keyword">
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="12" :md="12" :lg="8" :xl="8">
          <el-form-item label="搜索">
            <el-input
              placeholder="搜索客户手机号"
              prefix-icon="el-icon-search"
              v-model="listQuery.mobile">
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="12" :md="12" :lg="8" :xl="8">
          <el-form-item label="部门">
            <!-- <input type="hidden" v-model="listQuery.deptId"/>  -->
            <el-cascader
              style="width: 100%"
              :options="treeDeptData"
              :props="defaultProps"
              :show-all-levels="false"
              change-on-select
              v-model="deptId"
            ></el-cascader>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="12" :md="12" :lg="8" :xl="8">
          <el-form-item label="理财师">
            <el-input
              placeholder="搜索理财师邮箱前缀"
              prefix-icon="el-icon-search"
              v-model="listQuery.email">
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="12" :md="12" :lg="8" :xl="8">
          <el-form-item label="搜索">
            <el-input
              placeholder="搜索客户证件号码"
              prefix-icon="el-icon-search"
              v-model="listQuery.idNo">
            </el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row style="text-align: center;">
        <el-button type="info" style="padding: 10px 60px;" @click="handleFilter">查询</el-button>
        <el-button type="info" style="padding: 10px 60px" @click="resetFilter">重置</el-button>
      </el-row>
      </el-form>
    </div>

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
          <el-button v-if="sys_user_upd" size="small" type="success"
                     @click="handleRouter(scope.row.clientId)">查看
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
  </div>
</template>

<script>
  import { fetchList, getObj } from '@/api/client/realname'
  import { deptRoleList, fetchDeptTree } from '@/api/role'
  import { getAllPositon } from '@/api/queryConditions'
  import waves from '@/directive/waves/index.js' // 水波纹指令
  import { parseTime, transformText } from '@/utils'
  import { mapGetters } from 'vuex'
  import ElRadioGroup from 'element-ui/packages/radio/src/radio-group'
  import ElOption from "element-ui/packages/select/src/option"
  import UploadExcelComponent from '@/components/UploadExcel/index.vue'
  import { isvalidMobile, isvalidID } from '@/utils/validate'
  import { provinceAndCityData } from 'element-china-area-data' // 省市区数据
  import Bus from '@/assets/js/bus'

  export default {
    components: {
      ElOption,
      ElRadioGroup,
      UploadExcelComponent
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
        defaultProps2: {
          value: 'label'
        },
        list: null,
        total: null,
        listLoading: true,
        listQuery: {
          page: 1,
          limit: 20,
          realNameStatus: 1 // 待审核
        },
        role: undefined,
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
        options: provinceAndCityData,
        selectedOptions: [],
        deptName: [],
        deptId: []
      }
    },
    computed: {
      ...mapGetters([
        'certificationStatus',
        'certificationType',
        'permissions',
        'genderType',
        // 'delFlagOptions',
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
        this.listQuery.orderByField = 'create_time'
        this.listQuery.isAsc = false
        this.handleDept()
        if(this.deptId.length) {
          this.listQuery.deptId = this.deptId[this.deptId.length - 1]
        }
        fetchList(this.listQuery).then(response => {
          this.list = response.data.records
          this.total = response.data.total
          this.listLoading = false
          this.list.forEach(item => {
            item.nationality = item.nationality == 0 ? '中国' : '其他'
            let obj = {}
            this.genderType.forEach((val, idx) => { // 性别
              let key = val.value
              obj[key] = val.label
            })
            item.gender = obj[item.gender]

            item.realnameStatus = transformText(this.realnameStatus, item.realnameStatus)
          })
        })
      },
      handleDept() {
        fetchDeptTree()
          .then(response => {
            this.treeDeptData = response.data
            this.dialogDeptVisible = true
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
      handleRouter(id) { // 查看跳转详情
        this.$router.push({
          path: '/client/realnameDetail/' + id
        })
        Bus.$emit('activeIndex', '/client/realname')
      },
      handleUpdate(row) { // 编辑查询
        getObj(row.userId)
          .then(response => {
            this.form = response.data
            this.form.role = row.roleList[0].roleId
            this.role = row.roleList[0].roleDesc
            this.dialogFormVisible = true
            this.dialogStatus = 'update'
            
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
          // delFlag: '',
          type: 1
        },
        this.entryDate = []
        this.handleFilter()
      },
      
      // beforeRemove(file, fileList) {
      //   return this.$confirm(`确定移除 ${ file.name }？`);
      // },
      handleChange (value) {
        console.log(value)
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


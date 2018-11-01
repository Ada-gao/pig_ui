<template>
  <div class="app-container calendar-list-container">
    <search-bar-component @search-list="searchList"
      :searchClientClass="false"
      :searchRealNameStatus="false"
      :searchCertificationStatus="false"
      :searchPreserveExpired="true"
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

      <el-table-column align="center" label="客户性别">
        <template slot-scope="scope">
          <span>{{scope.row.gender}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="手机号">
        <template slot-scope="scope">
          <span>{{scope.row.mobile}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="客户邮箱">
        <template slot-scope="scope">
          <span>{{scope.row.email}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="证件类型">
        <template slot-scope="scope">
          <span>{{scope.row.idType }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="证件号码">
        <template slot-scope="scope">
          <span>{{scope.row.idNo}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="微信号">
        <template slot-scope="scope">
          <span>{{scope.row.wechat}}</span>
        </template>
      </el-table-column>

      <!-- <el-table-column align="center" label="实名认证状态">
        <template slot-scope="scope">
          <span>{{scope.row.realnameStatus | certificationStatusFilter}}</span>
        </template>
      </el-table-column> -->

      <el-table-column align="center" label="投资者类型（风险级别）">
        <template slot-scope="scope">
          <span>{{scope.row.clientType}}</span>
          <span v-show="scope.row.riskLevel">（{{scope.row.riskLevel}}）</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="资产管理规模">
        <template slot-scope="scope">
          <span>{{scope.row.assetAmount}}</span>
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

      <el-table-column align="center" label="保护期是否过期" show-overflow-tooltip>
        <template slot-scope="scope">
        <span>{{scope.row.preserveExpired|turnText1(preserveExpired)}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="操作" fixed="right" width="150">
        <template slot-scope="scope">
          <a size="small" class="common_btn"
                     @click="handleRouter(scope.row.clientId)">查看
          </a>
          <span v-if="sys_client_upd" class="space_line"> | </span>
          <a v-if="sys_client_upd" size="small" class="common_btn"
                     @click="handleUpdate(scope.row.clientId)">编辑
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
  </div>
</template>

<script>
  import searchBarComponent from 'components/searchBar'
  import { fetchList, getObj, addObj, putObj, delObj } from '@/api/client/client'
  import { deptRoleList, fetchDeptTree } from '@/api/role'
  import { getAllPositon } from '@/api/queryConditions'
  import waves from '@/directive/waves/index.js' // 水波纹指令
  import { parseTime, transformText } from '@/utils'
  import { mapGetters } from 'vuex'
  import ElRadioGroup from 'element-ui/packages/radio/src/radio-group'
  import ElOption from "element-ui/packages/select/src/option"
  import { isvalidMobile, isvalidID } from '@/utils/validate'
  import { provinceAndCityData } from 'element-china-area-data' // 省市区数据
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
        defaultProps2: {
          value: 'label'
        },
        list: null,
        total: null,
        listLoading: true,
        listQuery: {
          page: 1,
          limit: 20,
          type: 1, // 1：客户，0：潜客
          orderByField: 'create_time',
          isAsc: false
        },
        role: undefined,
        form: {
          name: 'rank',
          username: undefined,
          password: undefined,
          // delFlag: undefined,
          deptId: undefined
        },
        rules: {
          name: [
            {required: true, trigger: 'blur'}
          ],
          username: [
            {required: true, trigger: 'blur', message: '请输入用户名'},
            {min: 3, max: 20, trigger: 'blur', message: '长度在 3 到 20 个字符'}
          ],
          empNo: [
            {required: true, trigger: 'blur'}
          ],
          // date: [
          //   {required: true, trigger: 'blur'}
          // ],
          gender: [
            {required: true, trigger: 'blur'}
          ],
          education: [
            {required: true, trigger: 'blur'}
          ],
          idType: [
            // {required: true, trigger: 'blur'}
          ],
          marriageStatus: [
            {required: true, trigger: 'blur'}
          ],
          idNo: [
            {required: true, trigger: 'blur', validator: validID}
          ],
          deptName: [
            {required: true, trigger: 'blur', message: '请选择部门'}
          ],
          role: [
            {required: true, trigger: 'blur', message: '请选择角色'}
          ],
          positionId: [
            {required: true, trigger: 'blur'}
          ],
          email: [
            {required: true, trigger: 'blur'}
          ],
          // password: [
          //   {
          //     required: true,
          //     message: '请输入密码',
          //     trigger: 'blur'
          //   },
          //   {
          //     min: 5,
          //     max: 20,
          //     message: '长度在 5 到 20 个字符',
          //     trigger: 'blur'
          //   }
          // ],
          mobile: [
            {required: true, trigger: 'blur, change', validator: validMobile}
          ]
        },
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
        'idTypeOptions',
        'preserveExpired',
        'nationality'
      ])
    },
    created() {
      // this.handlePosition()
      this.getList()
      this.sys_client_upd = this.permissions['sys_client_upd']
    },
    methods: {
      getList() {
        this.listLoading = true
        // this.listQuery.orderByField = 'create_time'
        // this.listQuery.isAsc = false
        this.handleDept()
        // if(this.deptId.length) {
        //   this.listQuery.deptId = this.deptId[this.deptId.length - 1]
        // }

        // let amountStart = this.listQuery.amountStart || -1
        // let amountEnd = this.listQuery.amountEnd || -1
        // this.listQuery.amount = [amountStart, amountEnd]

        fetchList(this.listQuery).then(response => {
          this.list = Object.assign([], response.data.records)
          this.total = response.data.total
          this.listLoading = false
          this.list.forEach(item => {
            item.assetAmount = item.assetAmount ? item.assetAmount + '万' : ''
            item.clientType = transformText(this.certificationType, item.clientType)
            item.idType = transformText(this.idTypeOptions, item.idType)
            item.gender = transformText(this.genderType, item.gender)
            item.nationality = transformText(this.nationality, item.nationality)
          })
        })
      },
      // handlePosition() {
      //   getAllPositon().then(res => {
      //     this.positionsOptions = res.data
      //   })
      // },
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
          path: '/client/readDetail/' + id + '/0'
        })
        Bus.$emit('activeIndex', '/client/customer')
      },
      handleUpdate(id) { // 编辑查询
        this.$router.push({
          path: '/client/detail/' + id + '/1'
        })
        Bus.$emit('activeIndex', '/client/customer')
      },
      // handleUpdate(row) { // 编辑查询
      //   getObj(row.userId)
      //     .then(response => {
      //       this.form = response.data
      //       this.form.role = row.roleList[0].roleId
      //       this.role = row.roleList[0].roleDesc
      //       this.dialogFormVisible = true
      //       this.dialogStatus = 'update'

      //     })
      // },
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
      },
      searchList(data) {
        this.listQuery = data
        this.listQuery.type = 1
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


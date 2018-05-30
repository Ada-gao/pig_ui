<template>
  <div class="app-container calendar-list-container">
    <search-bar-component @search-list="serachList"
      :searchClientClass="false"
      :searchAmount="false"
      :searchNationality="false"
      :searchCity="false"
      :searchClientType="false"
      :searchRealNameStatus="false"
      >
    </search-bar-component>

    <!-- <div style="text-align: right">
      <el-button v-if="sys_user_add" class="filter-item" style="margin-left: 10px;" @click="handleCreate" type="primary" icon="edit">添加</el-button>
    </div> -->
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

      <el-table-column align="center" label="客户类型">
        <template slot-scope="scope">
          <span>{{scope.row.clientType}}</span>
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
                     @click="handleRouter(scope.row.clientId, '0')">查看
          </el-button>
          <el-button v-if="sys_user_upd" size="small" type="success"
                     @click="handleRouter(scope.row.clientId, '1')">审核
          </el-button>
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
  import searchBarComponent from '@/views/layout/components/searchBar'
  import { fetchList } from '@/api/client/investor'
  import { deptRoleList, fetchDeptTree } from '@/api/role'
  import { getAllPositon } from '@/api/queryConditions'
  import waves from '@/directive/waves/index.js' // 水波纹指令
  import { parseTime, transformText } from '@/utils'
  import { mapGetters } from 'vuex'
  import ElRadioGroup from 'element-ui/packages/radio/src/radio-group'
  import ElOption from "element-ui/packages/select/src/option"
  import { provinceAndCityData } from 'element-china-area-data' // 省市区数据
  import Bus from '@/assets/js/bus'

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
          // clientType: 0 // 1：专业，0：普通
          certificationType: 1, //0: 普通， 1: 专业投资者
          certificationStatus: 1,
          realNameStatus: 2 // 实名认证
        },
        role: undefined,
        form: {
          name: 'rank',
          username: undefined,
          password: undefined,
          // delFlag: undefined,
          deptId: undefined
        },
        dialogFormVisible: false,
        dialogDeptVisible: false,
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
        'nationality',
        'clientType'
        // 'delFlagOptions'
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
        this.handleDept()
        fetchList(this.listQuery).then(response => {
          this.list = response.data.records
          this.total = response.data.total
          this.listLoading = false
          this.list.forEach(item => {

            item.idType = transformText(this.idTypeOptions, item.idType)
            item.nationality = transformText(this.nationality, item.nationality)
            item.gender = transformText(this.genderType, item.gender)
            item.clientType = transformText(this.clientType, item.clientType)
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
      // handleFilter() {
      //   this.listQuery.page = 1
      //   this.getList()
      // },
      handleSizeChange(val) {
        this.listQuery.limit = val
        this.getList()
      },
      handleCurrentChange(val) {
        this.listQuery.page = val
        this.getList()
      },
      // handleCreate() {
      //   this.resetTemp()
      //   this.dialogStatus = 'create'
      //   this.dialogFormVisible = true
      // },
      handleRouter(id, isView) { // 查看跳转-->详情/审核
        this.$router.push({
          path: '/client/investorDetail/' + id + '/1/' + isView
        })
        Bus.$emit('activeIndex', '/client/professionalInvestor')
      },
      resetTemp() {
        this.form = {
          id: undefined,
          username: '',
          password: '',
          role: undefined
        }
      },
      // resetFilter() { // 重置搜索条件
      //   this.listQuery = {
      //     page: 1,
      //     limit: 20,
      //     // clientType: 0 // 1：专业，0：普通
      //     certificationType: 1, //0: 普通， 1: 专业
      //     certificationStatus: 1,
      //     realNameStatus: 2 // 实名认证
      //   },
      //   this.entryDate = []
      //   this.handleFilter()
      // },
      // beforeRemove(file, fileList) {
      //   return this.$confirm(`确定移除 ${ file.name }？`);
      // },
      serachList(data) {
        this.listQuery = data
        // this.listQuery.type = 0
        this.listQuery.certificationType = 1, //0: 普通， 1: 专业
        this.listQuery.certificationStatus = 1,
        this.listQuery.realNameStatus = 2 // 实名认证
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

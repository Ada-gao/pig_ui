<template>
  <div class="app-container calendar-list-container">
    <!-- <div class="filter-container">
      <el-form label-position="right" label-width="80px">
        <el-row :gutter="20">
          <el-col :sm="12" :lg="8">
            <el-form-item label="搜索">
              <el-input
                placeholder="搜索客户姓名、编号"
                prefix-icon="el-icon-search"
                v-model="listQuery.keyword">
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :sm="12" :lg="8">
            <el-form-item label="搜索">
              <el-input
                placeholder="搜索客户手机号"
                prefix-icon="el-icon-search"
                v-model="listQuery.mobile">
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :sm="12" :lg="8" style="white-space: nowrap">
            <el-form-item label="实名认证状态">
              <el-select class="filter-item" v-model="listQuery.clientType" placeholder="请选择">
                <el-option v-for="item in certificationType" :key="item.value" :value="item.value" :label="item.label">
                  <span style="float: left">{{ item.label }}</span>
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :sm="12" :lg="8">
            <el-form-item label="部门">
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
          <el-col :sm="12" :lg="8">
            <el-form-item label="搜索">
              <el-input
                placeholder="搜索客户证件号码"
                prefix-icon="el-icon-search"
                v-model="listQuery.idNo">
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :sm="12" :lg="8">
            <el-form-item label="客户类型">
              <el-select class="filter-item" v-model="listQuery.type" placeholder="请选择">
                <el-option v-for="item in clientClass" :key="item.value" :value="item.value" :label="item.label">
                  <span style="float: left">{{ item.label }}</span>
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :sm="12" :lg="8" style="white-space: nowrap">
            <el-form-item label="资产规模区间">
              <el-input
                style="width: 48%; margin-right: 2%"
                placeholder="请输入开始数字"
                prefix-icon="el-icon-search"
                v-model="listQuery.amountStart">
              </el-input>-
              <el-input
                style="width: 48%"
                placeholder="请输入结束数字"
                prefix-icon="el-icon-search"
                v-model="listQuery.amountEnd">
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :sm="12" :lg="8">
            <el-form-item label="理财师">
              <el-input
                placeholder="搜索理财师邮箱前缀"
                prefix-icon="el-icon-search"
                v-model="listQuery.email">
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :sm="12" :lg="8">
            <el-form-item label="国籍" style="margin-bottom: 10px;">
              <el-select class="filter-item" v-model="listQuery.nationality" placeholder="请选择">
                <el-option v-for="item in nationality" :key="item.value" :value="item.value" :label="item.label">
                  <span style="float: left">{{ item.label }}</span>
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :sm="12" :lg="8" v-if="listQuery.nationality === 0">
            <el-form-item label="地区">
              <el-cascader
                size="large"
                :options="options"
                :props="defaultProps2"
                v-model="listQuery.city"
                @change="handleChange">
              </el-cascader>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row style="text-align: center;">
          <el-button type="info" style="padding: 10px 60px;" @click="handleFilter">查询</el-button>
          <el-button type="info" style="padding: 10px 60px" @click="resetFilter">重置</el-button>
        </el-row>
      </el-form>
    </div> -->
    <search-bar-component @search-list="serachList"></search-bar-component>

    <div style="text-align: right">
      <!-- <el-button v-if="sys_user_add" class="filter-item" style="margin-left: 10px;" @click="handleCreate" type="primary" icon="edit">添加</el-button> -->
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

      <el-table-column align="center" label="客户类型">
        <template slot-scope="scope">
          <span>{{scope.row.clientClass}}</span>
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

      <el-table-column align="center" label="操作" fixed="right" width="150">
        <template slot-scope="scope">
          <a v-if="sys_user_upd" size="small" class="common_btn"
                     @click="handleRouter(scope.row.clientId)">查看
          </a>
          <span class="space_line"> | </span>
          <a v-if="sys_user_upd" size="small" class="common_btn"
                     @click="handleUpdate(scope.row.clientId)">分配
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

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form :model="modal" label-width="100px">
        <el-row :gutter="20">
          <el-col :span="11">
            <el-form-item label="部门">
              <el-cascader
                style="width: 100%"
                :options="treeDeptData"
                :props="defaultProps"
                :show-all-levels="false"
                @change="changeDept"
                change-on-select
                v-model="modal.deptId"
              ></el-cascader>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="理财师" prop="name" >
              <el-select class="filter-item" v-model="modal.name" placeholder="请选择" @change="changetest">
                <el-option v-for="item in plannerList" :key="item.userId" :label="item.name" :value="item.userId"> </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="22">
            <el-form-item label="备注" prop="reason">
              <el-input type="textarea" v-model="modal.reason"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form> 

      <div slot="footer" class="dialog-footer">
        <el-button class="search_btn" @click="changeCancle()">取 消</el-button>
        <el-button class="add_btn" @click="changePlanner()">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import searchBarComponent from '@/views/layout/components/searchBar'
  import { fetchList, getObj, addObj, putObj, delObj } from '@/api/client/client'
  import { putPlanner } from '@/api/client/planner'
  import { deptRoleList, fetchDeptTree } from '@/api/role'
  import { getAllPositon } from '@/api/queryConditions'
  import { getPlannerList } from '@/api/user'
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
          plannerStatus: 1
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
          create: '新增员工',
          change: '分配理财师'
        },
        isDisabled: {
          0: false,
          1: true
        },
        tableKey: 0,
        input2: '',
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
        deptId: [],
        modal: {},
        plannerList: []
      }
    },
    computed: {
      ...mapGetters([
        'certificationStatus',
        'certificationType',
        'permissions',
        'idTypeOptions',
        // 'delFlagOptions',
        'nationality',
        'clientClass'
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
        this.handleDept()
        // if(this.deptId.length) {
        //   this.listQuery.deptId = this.deptId[this.deptId.length - 1]
        // }

        // let amountStart = this.listQuery.amountStart || -1
        // let amountEnd = this.listQuery.amountEnd || -1
        // this.listQuery.amount = [amountStart, amountEnd]
        
        fetchList(this.listQuery).then(response => {
          this.list = response.data.records
          this.total = response.data.total
          this.listLoading = false
          this.list.forEach(item => {

            item.clientClass = transformText(this.clientClass, item.clientClass)
            item.nationality = transformText(this.nationality, item.nationality)
            item.idType = transformText(this.idTypeOptions, item.idType)
          })
        })
      },
      // handlePosition() {
      //   getAllPositon().then(res => {
      //     this.positionsOptions = res.data
      //   })
      // },
      serachList(data) {
        this.listQuery = data
        this.listQuery.plannerStatus = 1
        this.getList()
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
      handleRouter(id) { // 查看跳转详情
        // this.$router.push({
        //   path: '/client/detail/' + id
        // })
        this.$router.push({
          path: '/client/readDetail/' + id + '/0'
        })
        Bus.$emit('activeIndex', '/client/allocated')
      },
      handleUpdate(id) { // 分配查询
        this.dialogStatus = 'change'
        this.dialogFormVisible = true
        this.modal.clientId = id
        this.getPlannerList()
        // getObj(row.userId)
        //   .then(response => {
        //     this.form = response.data
        //     this.form.role = row.roleList[0].roleId
        //     this.role = row.roleList[0].roleDesc
        //     this.dialogFormVisible = true
        //     this.dialogStatus = 'update'
            
        //   })
      },
      changeDept(val) {
        console.log(val)
        this.modal.name = ''
        this.getPlannerList(val)
      },
      getPlannerList(deptId = '') {
        let params = {
          deptId: deptId[deptId.length-1],
          status: 0
        }
        getPlannerList(params).then(response => {
          this.plannerList = response.data
          console.log(this.plannerList)
        })
      },
      changePlanner() {
        let params = {
          plannerId: this.modal.name,
          reason: this.modal.reason
        }
        putPlanner(this.modal.clientId, params).then(response => {
          if(response.status === 200) {
            this.$notify({
                  title: '成功',
                  message: '分配成功',
                  type: 'success',
                  duration: 2000
                })
            this.dialogFormVisible = false
          }
        })
      },
      changeCancle() {
        this.dialogFormVisible = false
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
          deptId: ''
        },
        this.deptId = []
        this.entryDate = []
        // this.handleFilter()
      },
      
      // beforeRemove(file, fileList) {
      //   return this.$confirm(`确定移除 ${ file.name }？`);
      // },
      handleChange (value) {
        console.log(value)
      },
      changetest(val) {
        this.plannerList = this.plannerList.slice(0)
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


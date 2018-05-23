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
        <el-col :xs="24" :sm="12" :md="12" :lg="8" :xl="8" style="white-space: nowrap">
          <el-form-item label="投资者类型">
            <el-select class="filter-item" v-model="listQuery.clientType" placeholder="请选择">
              <el-option v-for="item in certificationType" :key="item.value" :value="item.value" :label="item.label">
                <span style="float: left">{{ item.label }}</span>
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="12" :md="12" :lg="8" :xl="8" style="white-space: nowrap">
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
        <el-col :xs="24" :sm="12" :md="12" :lg="8" :xl="8">
          <el-form-item label="搜索">
            <el-input
              placeholder="搜索客户证件号码"
              prefix-icon="el-icon-search"
              v-model="listQuery.idNo">
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
              @change="changeDept"
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
          <el-form-item label="国籍">
            <el-select class="filter-item" v-model="listQuery.nationality" placeholder="请选择">
              <el-option v-for="item in nationalityType" :key="item.value" :value="item.value" :label="item.label">
                <span style="float: left">{{ item.label }}</span>
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="12" :md="12" :lg="8" :xl="8" v-if="listQuery.nationality === 0">
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
    </div>

    <div style="text-align: right">
      <el-button v-if="sys_user_add" class="filter-item" style="margin-left: 10px;" @click="handleCreate" type="primary" icon="edit">添加</el-button>
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
          <span>{{scope.row.clientType | certificationTypeFilter}}</span>
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
          <el-button v-if="sys_user_upd" size="small" type="success"
                     @click="handleRouter(scope.row.clientId)">查看
          </el-button>
          <el-button v-if="sys_user_upd" size="small" type="success"
                     @click="handleUpdate(scope.row)">编辑
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
      >
      </el-tree>
    </el-dialog> -->

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form :model="form" :rules="rules" ref="form" label-width="100px">
        
        <el-row :gutter="20">
          <el-col :span="11">
            <el-form-item label="姓名" prop="name">
              <el-input v-model="form.name" placeholder="请输入姓名"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="用户名" prop="username">
              <el-input v-model="form.username" placeholder="请输入用户名"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        
        <el-row :gutter="20">
          <el-col :span="11">
            <el-form-item label="工号" prop="empNo">
              <el-input v-model="form.empNo" placeholder="请输入工号"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="入职日期" prop="date">
              <el-date-picker
                v-model="form.employeeDate"
                type="date"
                placeholder="选择日期">
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        
        <el-row :gutter="20">
          <el-col :span="11">
            <el-form-item label="性别" prop="gender">
              <el-select class="filter-item" v-model="form.gender" placeholder="请选择">
                <el-option v-for="item in genderType" :key="item.value" :value="item.value" :label="item.label">
                  <span style="float: left">{{ item.label }}</span>
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="学历" prop="education">
              <el-select class="filter-item" v-model="form.education" placeholder="请选择">
                <el-option v-for="item in educationType" :key="item.value" :value="item.value" :label="item.label">
                  <span style="float: left">{{ item.label }}</span>
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        
        <el-row :gutter="20">
          <el-col :span="11">
            <el-form-item label="证件类型" prop="idType">
              <el-select class="filter-item" v-model="form.idType" placeholder="请选择">
                <el-option v-for="item in idTypeOptions" :key="item.value" :value="item.value" :label="item.label">
                  <span style="float: left">{{ item.label }}</span>
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="婚姻状况" prop="marriageStatus">
              <el-select class="filter-item" v-model="form.marriageStatus" placeholder="请选择">
                <el-option v-for="item in marriageStatusOptions" :key="item.value" :value="item.value" :label="item.label">
                  <span style="float: left">{{ item.label }}</span>
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        
        <el-row :gutter="20">
          <el-col :span="11">
            <el-form-item label="证件号码" prop="idNo">
              <el-input v-model="form.idNo" :maxlength="18" placeholder="请输入证件号码"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="手机号" prop="mobile">
              <el-input v-model="form.mobile" :maxlength="11" placeholder="请输入手机号码"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        
        <el-row :gutter="20">
          <el-col :span="11">
            <el-form-item label="部门" prop="deptName">
              <!-- deptId -->
              <el-input v-model="form.deptName" placeholder="选择部门" @focus="handleDept()" readonly></el-input>
              <input type="hidden" v-model="form.deptId"/>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="角色" prop="role">
              <!-- role -->
              <el-select class="filter-item" v-model="role" placeholder="请选择">
                <el-option v-for="item in rolesOptions" :key="item.roleId" :label="item.roleDesc" :value="item.roleId" :disabled="isDisabled[item.delFlag]">
                  <span style="float: left">{{ item.roleDesc }}</span>
                  <span style="float: right; color: #8492a6; font-size: 13px">{{ item.roleCode }}</span>
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        
        <el-row :gutter="20">
          <el-col :span="11">
            <el-form-item label="职位" prop="positionId">
              <!-- <el-select class="filter-item" v-model="form.positionName" placeholder="请选择" @focus="handlePosition()"> -->
                <el-option v-for="item in positionsOptions" :key="item.positionId" :label="item.positionName" :value="item.positionId" :disabled="isDisabled[item.delFlag]">
                  <span style="float: left">{{ item.positionName }}</span>
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="邮箱" prop="email">
              <el-input v-model="form.email"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        
        <el-row :gutter="20">
          <el-col :span="11">
            <el-form-item label="简历" prop="resumeUrl">
              <!-- <el-input v-model="form.role"></el-input> -->
              <el-upload
                class="upload-demo"
                action="https://jsonplaceholder.typicode.com/posts/"
                :on-preview="handlePreview"
                :on-remove="handleRemove"
                multiple
                :limit="3"
                :on-exceed="handleExceed"
                :file-list="fileList"
                :show-file-list="true"
                :before-upload="beforeUpload"
                accept="file">
                <el-button size="small" type="primary">上传简历</el-button>
                <!-- <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div> -->
              </el-upload>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="状态" v-if="dialogStatus == 'update' && sys_user_del " prop="delFlag" >
              <el-select class="filter-item" v-model="form.delFlag" placeholder="请选择">
                <el-option v-for="item in statusOptions" :key="item" :label="item | statusFilter" :value="item"> </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="22">
            <el-form-item label="备注" prop="remark">
              <el-input type="textarea" v-model="form.remark"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        
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
  import { fetchList, getObj, addObj, putObj, delObj } from '@/api/client/client'
  import { deptRoleList, fetchDeptTree } from '@/api/role'
  import { getPositionName } from '@/api/posi'
  import { getAllPositon } from '@/api/queryConditions'
  import waves from '@/directive/waves/index.js' // 水波纹指令
  import { parseTime } from '@/utils'
  import { mapGetters } from 'vuex'
  import ElRadioGroup from 'element-ui/packages/radio/src/radio-group'
  import ElOption from "element-ui/packages/select/src/option"
  import UploadExcelComponent from '@/components/UploadExcel/index.vue'
  import { isvalidMobile, isvalidID } from '@/utils/validate'
  import { provinceAndCityData } from 'element-china-area-data' // 省市区数据

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
          type: 1 // 1：客户，0：潜客
        },
        role: undefined,
        form: {
          name: 'rank',
          username: undefined,
          password: undefined,
          delFlag: undefined,
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
        delFlag: '',
        tableData: [],
        tableHeader: [],
        entryDate: [],
        options: provinceAndCityData,
        selectedOptions: [],
        nationalityType: [
          {
            value: 0,
            label: '中国'
          },
          {
            value: 1,
            label: '其他'
          },
        ],
        deptName: [],
        deptId: []
      }
    },
    computed: {
      ...mapGetters([
        'certificationStatus',
        'certificationType',
        'permissions',
        'educationType',
        'genderType',
        'idTypeOptions',
        'marriageStatusOptions',
        'delFlagOptions'
      ])
    },
    filters: {
      statusFilter(status) {
        const statusMap = {
          0: '在职',
          1: '离职',
          2: '异常',
          3: '异常'
        }
        return statusMap[status]
      },
      certificationTypeFilter(status) {
        const statusMap = {
          0: '普通投资者',
          1: '专业投资者'
        }
        if(status === null) {
          return '无'
        } else {
          return statusMap[status]
        }
      },
      certificationStatusFilter(status) {
        const statusMap = {
          0: '未认证',
          1: '离职',
          2: '异常',
          3: '异常'
        }
        return statusMap[status]
      }
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

            let objIdType = {}
            this.idTypeOptions.forEach((val, idx) => { // 证件类型
              let key = val.value
              objIdType[key] = val.label
            })
            item.idType = objIdType[item.idType]
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
          path: '/client/customer/' + id
        })
      },
      handleUpdate(row) { // 编辑查询
        getObj(row.userId)
          .then(response => {
            this.form = response.data
            this.form.role = row.roleList[0].roleId
            this.role = row.roleList[0].roleDesc
            this.dialogFormVisible = true
            this.dialogStatus = 'update'
            getPositionName(this.form.positionId).then(res => {
              this.form.positionName = res.data
            })
            deptRoleList(response.data.deptId)
              .then(response => {
                this.rolesOptions = response.data
              })
          })
      },
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
      resetFilter() { // 重置搜索条件
        this.listQuery = {
          page: 1,
          limit: 20,
          username: '',
          positionId: '',
          delFlag: '',
          type: 1
        },
        this.entryDate = []
        this.handleFilter()
      },
      handleRemove(file, fileList) {
        console.log(file, fileList);
      },
      handlePreview(file) {
        console.log(file);
      },
      handleExceed(files, fileList) {
        this.$message.warning(`当前限制选择 3 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
      },
      // beforeRemove(file, fileList) {
      //   return this.$confirm(`确定移除 ${ file.name }？`);
      // },
      beforeUpload(file) {
        console.log(file)
        const isFile = file.type === 'application/pdf'
        if (!isFile) {
          this.$message.error('只能上传pdf文档')
        }
        return isFile
      },
      selected(data) {
        this.tableData = data.results
        this.tableHeader = data.header
      },
      handleChange (value) {
        console.log(value)
      },
      changeDept(val) {
        // if(val.length > 1) {
        //   this.listQuery.deptId = val[1]
        // }
        // this.listQuery.deptId = val.pop()
        // console.log(this.listQuery.deptId)

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


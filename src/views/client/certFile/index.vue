<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <!-- <el-form label-position="right" label-width="80px">
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
        </el-row>
        <el-row style="text-align: center;">
          <el-button type="info" style="padding: 10px 60px;" @click="handleFilter">查询</el-button>
          <el-button type="info" style="padding: 10px 60px" @click="resetFilter">重置</el-button>
        </el-row>
      </el-form> -->
      <el-tabs v-model="type" type="card" @tab-click="handleClick">
        <el-tab-pane label="普通投资者" name="0"></el-tab-pane>
        <el-tab-pane label="专业投资者" name="1"></el-tab-pane>
      </el-tabs>
    </div>

    <div style="text-align: right">
      <!-- <el-button v-if="sys_user_add" class="filter-item" style="margin-left: 10px;" @click="handleCreate" type="primary" icon="edit">新增资料</el-button> -->
      <el-upload
              class="upload-demo"
              style="display: inline-block;"
              :headers="headers"
              :action="'/zuul/client/certFile/' + type"
              :on-success="handleChange1"
              :show-file-list="false"
              accept=".pdf, .doc">
              <el-button size="small" class="btn-padding" type="primary">新增资料</el-button>
            </el-upload>
    </div>
    <el-table :key='tableKey' :data="list" v-loading="listLoading" element-loading-text="给我一点时间" border fit
              highlight-current-row style="width: 100%">

      <el-table-column align="center" label="资料名称">
        <template slot-scope="scope">
          <span>{{scope.row.name}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="文件大小">
        <template slot-scope="scope">
          <span>{{scope.row.fileSize}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="操作" fixed="right" width="150">
        <template slot-scope="scope">
          <el-button v-if="sys_user_upd" size="small" type="success"
                     @click="handleRouter(scope.row.certFileId)">查看
          </el-button>
          <el-button v-if="sys_user_upd" size="small" type="success"
                     @click="deletes(scope.row.certFileId)">删除
          </el-button>
        </template>
      </el-table-column>

    </el-table>

    <!-- <div v-show="!listLoading" class="pagination-container">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                     :current-page.sync="listQuery.page"
                     :page-sizes="[10,20,30, 50]" :page-size="listQuery.limit"
                     layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div> -->
  </div>
</template>

<script>
  import { fetchList, delObj } from '@/api/client/certFile'
  import { deptRoleList, fetchDeptTree } from '@/api/role'
  import { getAllPositon } from '@/api/queryConditions'
  import waves from '@/directive/waves/index.js' // 水波纹指令
  import { parseTime } from '@/utils'
  import { getToken } from '@/utils/auth'
  import { mapGetters } from 'vuex'
  import ElRadioGroup from 'element-ui/packages/radio/src/radio-group'
  import ElOption from "element-ui/packages/select/src/option"
  import UploadExcelComponent from '@/components/UploadExcel/index.vue'
  import { isvalidMobile, isvalidID } from '@/utils/validate'
  import { provinceAndCityData } from 'element-china-area-data' // 省市区数据

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
        type: 0,
        headers: {
          Authorization: 'Bearer ' + getToken()
        },
      }
    },
    computed: {
      ...mapGetters([
        'certificationStatus',
        'certificationType',
        'permissions',
        'genderType',
        'idTypeOptions',
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
        // this.listQuery.orderByField = 'create_time'
        // this.listQuery.isAsc = false
        
        // let amountStart = this.listQuery.amountStart || -1
        // let amountEnd = this.listQuery.amountEnd || -1
        // this.listQuery.amount = [amountStart, amountEnd]
        console.log(this.type)
        fetchList(this.type).then(response => {
          this.list = response.data
          this.total = response.data.total
          this.listLoading = false
         
        })
      },
      handleClick(tab, event) {
        this.getList()
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
      handleRouter(id) { // 查看跳转详情
        this.$router.push({
          path: '/client/investorDetail/' + id + '/1'
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
      // beforeRemove(file, fileList) {
      //   return this.$confirm(`确定移除 ${ file.name }？`);
      // },
      handleChange1(file, fileList) { // 上传材料，列表展示
        // this.fileList1 = fileList.slice(-3)
        // debugger
        this.getList()
      },
      deletes(id) {
        delObj(id).then(response => {
          if(response.status === 200) {
            this.getList()
            this.$notify({
                title: '成功',
                message: '删除成功',
                type: 'success',
                duration: 2000
              })
          }
        })
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

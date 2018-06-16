<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <el-tabs v-model="type" type="card" @tab-click="handleClick">
        <el-tab-pane label="普通投资者" name="0"></el-tab-pane>
        <el-tab-pane label="专业投资者" name="1"></el-tab-pane>
      </el-tabs>
    </div>

    <div style="text-align: right">
      <el-upload
              class="upload-demo"
              style="display: inline-block;"
              :headers="headers"
              :action="'/zuul/client/certFile/' + type"
              :on-success="handleChange1"
              :show-file-list="false"
              accept=".pdf, .doc">
              <el-button size="small" class="btn-padding add_btn" type="primary">新增资料</el-button>
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
          <a size="small" class="common_btn"
                    :href="scope.row.fileUrl"><a :href="scope.row.fileUrl" target="_blank">查看</a>
          </a>
          <span v-if="ssys_cert_material_del" class="space_line"> | </span>
          <a v-if="ssys_cert_material_del" size="small" class="danger_btn"
                     @click="deletes(scope.row.certFileId)">删除
          </a>
        </template>
      </el-table-column>

    </el-table>

    <el-dialog
      title="提示"
      :visible.sync="dialogVisible"
      width="30%">
      <span>确认删除该认证资料吗？</span>
      <span slot="footer" class="dialog-footer">
        <el-button class="search_btn" @click="dialogVisible = false">取 消</el-button>
        <el-button class="add_btn" @click="todeletes">确 定</el-button>
      </span>
    </el-dialog>
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
        id: '',
        dialogVisible: false
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
      this.ssys_cert_material_del = this.permissions['ssys_cert_material_del']
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
        this.dialogVisible = true
        this.id = id
      },
      todeletes() {
        delObj(this.id).then(response => {
          if(response.status === 200) {
            this.getList()
            this.$notify({
                title: '成功',
                message: '删除成功',
                type: 'success',
                duration: 2000
              })
            this.dialogVisible = false
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

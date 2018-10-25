<template>
  <div class="app-container calendar-list-container">
    <div style="text-align: right" v-if='select_value_add'>
      <el-button v-if="select_value_add" class="add_btn" @click="handleAddActive()">
        <svg-icon icon-class="add"></svg-icon> 新增</el-button>
    </div>
    <el-table :key='tableKey' :data="list" v-loading="listLoading" element-loading-text="给我一点时间" border fit
              highlight-current-row style="width: 100%">
      <el-table-column align="center" label="活动类型">
        <template slot-scope="scope">
          <span>{{scope.row.label}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="操作">
        <template slot-scope="scope">
          <a size="small" class="common_btn" @click="handleUpdate(scope.row)" v-if='select_value_edit'>编辑</a>
          <!-- <a size="small" class="danger_btn" @click='deletes(scope.row)' v-if='select_value_delete'>删除</a> -->
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
          :title="title"
          :visible.sync="dialogVisible"
          :before-close="handleClose"
          width="30%">
          <el-form  ref="newAddClient" :model="dynamicValidateForm" label-width="100px" class="demo-ruleForm">
          <el-form-item  label="活动类型"  prop="typeName"  :rules="[
      { required: true, message: '请输入活动类型', trigger: 'blur' }
    ]">
            <el-input placeholder="输入活动类型名称" style="width:90%;" v-model.trim='dynamicValidateForm.typeName' :maxlength="20"></el-input>
          </el-form-item>
        </el-form>
          <div slot="footer" class="dialog-footer">
              <el-button  class="search_btn" @click="cancel('newAddClient')">取 消</el-button>
              <el-button  class="add_btn" @click="submit('newAddClient')">确 定</el-button>
          </div>
        </el-dialog>
  </div>
</template>

<script>
import {getSysSelectValueList,addType,deleteType,editType} from '@/api/market/setting'
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
        dynamicValidateForm:{
          typeName:this.typeName
        },
        sysSelectValueId:null,
        isEdit:false,
        title:'',
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
      this.select_value_add = this.permissions['select_value_add']
      this.select_value_edit = this.permissions['select_value_edit']
      this.select_value_delete = this.permissions['select_value_delete']
    },
    methods: {
      getList() {
        this.listLoading = true
        getSysSelectValueList('activity_type').then(response => {
          if(response.status == 200){
            this.list = response.data
            this.listLoading = false
          }
        })
      },
      handlePosition() {
        getAllPositon().then(res => {
          this.positionsOptions = res.data
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
      handleAddActive(){  //新增
        this.isEdit = false
        this.dialogVisible = true
        this.dynamicValidateForm.typeName = ''
        this.title= '新增活动类型'
      },
      handleUpdate(row) { // 编辑
        this.isEdit = true
        this.dialogVisible = true
        this.dynamicValidateForm.typeName = row.label
        this.sysSelectValueId = row.sysSelectValueId
        this.title= '编辑活动类型'
      },
      addActiveType(obj){
        addType(obj).then(response=>{
          if(response.status == 200){
            this.getList()
            this.dialogVisible = false
          } 
        })
      },
      edit(data){
        editType(data).then(response=>{
          if(response.status == 200){
            this.getList()
            this.dialogVisible = false
          }
        })
      },
      submit(formName){
          this.$refs[formName].validate((valid) => {
          if (valid) {
            if(this.isEdit){ // 编辑
              let data={
                "label": this.dynamicValidateForm.typeName,
                "sysSelectValueId": this.sysSelectValueId,
                "type": "activity_type",
              }
              this.edit(data)
            }else{ // 编辑新增
              let obj = {
                "label": this.dynamicValidateForm.typeName,
                "type": "activity_type",
              }
              this.addActiveType(obj)
            } 

          } else {
            console.log('error submit!!');
            return false;
          }
        });
      
      },
      deletes(row) {
        this.$confirm('此操作将永久删除该活动类型(活动类型名称:' + row.label + '), 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deleteType(row.sysSelectValueId).then(() => {
            this.getList()
            this.$notify({
              title: '成功',
              message: '删除成功',
              type: 'success',
              duration: 2000
            })
          }).catch(() => {
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
      },
      cancel(formName){
         this.$refs[formName].resetFields()
          this.dialogVisible = false
      },
      handleClose(){
        this.cancel('newAddClient')
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


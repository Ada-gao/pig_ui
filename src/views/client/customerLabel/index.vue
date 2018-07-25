<template>
  <div class="app-container calendar-list-container">
    <div class="main-tab">
      <el-radio-group v-model="step" @change="changeStep" style="margin-bottom: 0;">
        <el-radio-button label="1">客户标签</el-radio-button>
        <el-radio-button label="2">AUM标签</el-radio-button>
      </el-radio-group>
    </div>

    <div class="filter-container" style="text-align: right">
      <el-button
                 class="filter-item add_btn"
                 @click="newAddAum = true"
                 type="primary"
                 icon="edit">
        <svg-icon icon-class="add"></svg-icon> 新增</el-button>
    </div>
    <!-- 客户标签 -->
    <el-table v-if="step == 2" :key='tableKey' :data="list" v-loading="listLoading" element-loading-text="给我一点时间" border fit
              highlight-current-row style="width: 100%">

      <el-table-column align="center" label="标签">
        <template slot-scope="scope">
          <span>{{scope.row.name}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="标签解释">
        <template slot-scope="scope">
          <span>{{scope.row.fileSize}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="操作">
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
    <!-- AUM标签 -->
    <el-table v-if="step == 1" :key='tableKey' :data="aumlist" v-loading="listLoading" element-loading-text="给我一点时间" border fit highlight-current-row style="width: 100%">

      <el-table-column align="center" prop="signingAmount" label="签约金额"></el-table-column>
      <el-table-column align="center" prop="labelName" label="会员等级"></el-table-column>

      <el-table-column align="center" label="操作">
        <template slot-scope="scope">
          <el-button type="text" @click="editAum(scope.row.clientAumLabelId)">编辑</el-button>
          <span class="space_line"> | </span>
          <el-button type="text" class="red" @click="deletes(scope.row.clientAumLabelId)">删除</el-button>
        </template>

      </el-table-column>
    </el-table>
    <!-- 新增对话框 -->
    <el-dialog
      title="新增客户标签"
      :visible.sync="newAddAum">
      <article>
      <span class="red">*</span>
      <label class="mr10">签约金额</label>
         <el-input v-model="newAddParamet.lowLimit" placeholder="请输入金额" style="width:30%;"></el-input>
         <i class="el-icon-minus"></i>
         <el-input v-model="newAddParamet.highLimit" placeholder="请输入金额" style="width:30%;" class="mr10"></el-input>
         <span>万</span>
      </article>

     <article  class="demo-input-size" style="margin-top:20px;">
      <span class="red">*</span>
      <label class="mr10">会员等级</label>
         <el-input v-model="newAddParamet.labelName" placeholder="请输入会员等级" style="width:63%;"></el-input>
      </article>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" @click="aumDetermine">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog
      title="提示"
      :visible.sync="dialogVisible"
      width="30%">
      <span>{{deletesTitle}}</span>
      <span slot="footer" class="dialog-footer">
        <el-button class="search_btn" @click="dialogVisible = false">取 消</el-button>
        <el-button class="add_btn" @click="todeletes">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import { fetchList,clientAumLabel,editClientAumLabel,deleteClientAumLabel} from '@/api/client/customerLabel'
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
        step:1,
        newAddAum:false,
        newAddParamet:{
          highLimit:'',
          lowLimit:'',
          labelName:''
        },
        deletesTitle:'',
        
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
        aumlist: null,
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
      changeStep(){

      },
      // 取消 关闭对话框
      cancel(){
        this.newAddAum = false;
        this.newAddParamet = {};
      },
      // 新增 确定
      aumDetermine(){
        clientAumLabel(this.newAddParamet).then(response =>{
          if(response.status === 200) {
            this.getList()
            this.$notify({
                title: '成功',
                message: '新增成功',
                type: 'success',
                duration: 2000
              })
            this.newAddParamet = {};
            this.newAddAum = false;
          }
          
        })
      },
      // 据id查询客户aum标签信息
      editAum(id){
        editClientAumLabel(id).then(response=>{
          this.newAddAum = true;
          this.newAddParamet =response.data
        })
      },
      // 删除客户aum标签
      deleteAum(id){
        deleteClientAumLabel(id).then(response=>{
          console.log(response)
        })
      },
      //获得全部客户aum标签
      getList() {
        this.listLoading = true
      
        fetchList().then(response => {
        
         response.data.forEach((val,index,taht)=>{
            val.signingAmount = `${val.lowLimit} - ${val.highLimit}万`;
          })
         this.aumlist = response.data;
          this.listLoading = false;
         
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
        this.deletesTitle = '确定要删除吗'
        this.dialogVisible = true
        this.id = id
      },
      todeletes() {
        deleteClientAumLabel(this.id).then(response => {
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
.red{
  color:red;
  &:hover{
    color:#b90707;
  }
}
.mr10{
  margin-right:10px;
}
</style>

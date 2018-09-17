<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <el-form label-position="right" label-width="100px">
        <el-row :gutter="20">
          <el-col :xs="24" :sm="12" :md="12" :lg="8" :xl="8">
            <el-form-item label="搜索">
              <el-input
                placeholder="输入客户姓名、编号"
                prefix-icon="el-icon-search"
                v-model="listQuery.keyword">
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="12" :lg="8" :xl="8">
            <el-form-item label="手机号">
              <el-input
                placeholder="搜索客户手机号"
                prefix-icon="el-icon-search"
                v-model="listQuery.mobile">
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="12" :lg="8" :xl="8">
            <el-form-item label="客户来源">
              <el-select v-model="listQuery.clientFrom" placeholder="请选择客户来源">
                <el-option
                  v-for="item in clientFrom"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>

            </el-form-item>
          </el-col>
        </el-row>
        <el-row style="text-align: center;">
          <el-button class="search_btn" @click="resetFilter"><svg-icon icon-class="reset"></svg-icon> 重置</el-button>
          <el-button class="search_btn" @click="handleFilter"><svg-icon icon-class="search"></svg-icon> 查询</el-button>
        </el-row>
      </el-form>
    </div>

    <div style="text-align: right">
      <el-button v-if="activity_client_user_batch" class="add_btn" @click="distributionPersonal">
        <svg-icon icon-class="personal"></svg-icon>分配到个人</el-button>
        <el-button v-if="activity_client_dept_batch" class="add_btn" @click="distributionDepartment">
        <svg-icon icon-class="department"></svg-icon>分配到部门</el-button>
    </div>
    <el-table :key='tableKey' :data="list" v-loading="listLoading" element-loading-text="给我一点时间" border fit
              highlight-current-row style="width: 100%" @selection-change="handleSelectionChange">

      <el-table-column align="center" type="selection" label="全选" width="50">
      </el-table-column>

      <el-table-column align="center" label="客户编号"  prop="clientNo">
      </el-table-column>

      <el-table-column align="center" label="客户姓名" prop="name">
      </el-table-column>

      <el-table-column align="center" label="证件类型" prop="idType">
      </el-table-column>

      <el-table-column align="center" label="证件号码" prop="idNo">
      </el-table-column>

      <el-table-column align="center" label="客户类型" prop="clientType">
      </el-table-column>

      <el-table-column align="center" label="手机号" prop="mobile">
      </el-table-column>

      <el-table-column align="center" label="邮箱" prop="email">
      </el-table-column>

      <el-table-column align="center" label="客户来源" prop="clientFrom">
      </el-table-column>

      <el-table-column align="center" label="国籍（常住地区）">
        <template slot-scope="scope">
        <span>{{scope.row.nationality}}</span>
        <span>{{scope.row.city}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="操作" fixed="right" width="150">
        <template slot-scope="scope">
           <a v-if="activity_client_query" size="small" class="common_btn"
                     @click="handleRouter(scope.row.clientId)">查看
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
    <!-- 分配到个人弹框 -->
    <el-dialog
      title="分配到个人"
      :visible.sync="dialogPersonal"
      width="30%">
      <el-form :model="personalForm" ref="personalRuleForm" label-width="100px" class="demo-ruleForm">
      <el-form-item  label="姓名" prop="personal"
       :rules="[
           { required: true, message: '请选择姓名', trigger: 'change'}
        ]">
         <el-select v-model="personalForm.personal" placeholder="请选择人员" >
            <el-option
              v-for="item in plannerList"
              :key="item.userId"
              :label="item.name"
              :value="item.userId">
            </el-option>
          </el-select>
      </el-form-item>

    </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button  class="search_btn" @click="cancel('personalRuleForm')">取 消</el-button>
        <el-button  class="add_btn" @click="personalDetermine('personalRuleForm')">确 定</el-button>
      </div>
  </el-dialog>

  <!-- 分配到部门弹框 -->
    <el-dialog
      title="分配到部门"
      :visible.sync="dialogDepartment"
      width="30%">
      <el-form :model="departmentForm" ref="departmentRuleForm" label-width="100px" class="demo-ruleForm">
        <el-form-item  label="部门" prop="department"
           :rules="[
               { required: true, message: '请选择部门', trigger: 'change'}
            ]">
             <el-select v-model="departmentForm.department" placeholder="请选择人员">
                <el-option
                  v-for="item in rootList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
          </el-form-item>

    </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button  class="search_btn" @click="cancel('departmentRuleForm')">取 消</el-button>
        <el-button  class="add_btn" @click="departmentDetermine('departmentRuleForm')">确 定</el-button>
      </div>
    </el-dialog>
    
  </div>
</template>

<script>
  import { getClientPoolList,allocationDepartment,allocationPlanners} from '@/api/client/customerPool'
  import { getPlannerList } from '@/api/user'
  import { getDeptRoots} from '@/api/dept'
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
      idType (val, list) {
        let self
        if(val == 0) self = '身份证'
        if(val == 1) self = '护照'
        if(val == 2) self = '军官证'
        return self
      },
      parseTime (time) {
        if(!time) return
        let date = new Date(time)
        return parseTime(date)
      }
    },
    name: 'customer-pool',
    directives: {
      waves
    },
    data() {
      return {
      dialogDepartment: false,
      dialogPersonal: false,
        list: null,
        total: null,
        listLoading: true,
        listQuery: {
          page: 1,
          limit: 20
        },
        plannerList:[],
        rootList:[],
        tableKey:0,
        personalForm:{
          personal:''
        },
        departmentForm:{
          department:''
        },
        multipleSelection:[]
      }
    },
    computed: {
      ...mapGetters([
        'permissions',
        'nationality',
        'idTypeOptions',
        'certificationType',
        'clientFrom'
      ])
    },
    created() {
      this.getClientPoolList()
      this.activity_client_query = this.permissions['activity_client_query']
      this.activity_client_user_batch = this.permissions['activity_client_user_batch']
      this.activity_client_dept_batch = this.permissions['activity_client_dept_batch']
    },
    methods: {
      getClientPoolList() {
        this.listLoading = true
        getClientPoolList(this.listQuery).then(response => {
          this.list = response.data.records
          this.total = response.data.total
          this.listLoading = false
          this.list.forEach(item => {
            item.clientType = transformText(this.certificationType, item.clientType)
            item.idType = transformText(this.idTypeOptions, item.idType)
            item.nationality = transformText(this.nationality, item.nationality)
            item.clientFrom = transformText(this.clientFrom, item.clientFrom)
          })
      
        })
      },
     
      handleFilter() {
        this.listQuery.page = 1
        this.getClientPoolList()
      },
      handleSizeChange(val) {
        this.listQuery.limit = val
        this.getClientPoolList()
      },
      handleCurrentChange(val) {
        this.listQuery.page = val
        this.getClientPoolList()
      },
       handleRouter(id) { // 查看跳转详情
        this.$router.push({
          path: '/client/readDetail/' + id + '/0'
        })
      },
      resetFilter() { // 重置搜索条件
        this.listQuery = {
          page: 1,
          limit: 20,
          keyword: '',
          mobile: '',
          clientFrom: ''
        },
        this.handleFilter()
      },
      // 分配到部门
      distributionDepartment(){
        if(this.multipleSelection.length>0){
          this.dialogDepartment = true
          this.getDeptRoots()
        }else{
          this.$notify({
            title: '警告',
            message: '清选择至少一条数据',
            type: 'warning'
          });
        }
      },
      // 分配到个人
      distributionPersonal(){
        if(this.multipleSelection.length>0){
        this.dialogPersonal = true
        this.getUserLists()
        }else{
          this.$notify({
            title: '警告',
            message: '清选择至少一条数据',
            type: 'warning'
          });
        }
      },
      //获取理财师列表
      getUserLists() {
        getPlannerList({ status: 0 }).then(res => {
          if (res.status === 200) {
           this.plannerList = res.data
          }
        })
      },
      // 分配到个人 保存
      personalDetermine(formName){
        this.$refs[formName].validate((valid) => {
          if (valid) {
            let PlannerChangeReq = {}
            this.plannerList.forEach(item=>{
              if(item.userId == this.personalForm.personal){
                PlannerChangeReq = {
                  deptId:item.deptId,
                  plannerId:item.userId,
                  reason:'正常更换'
                }
              }
            })
            allocationPlanners({clientIds:this.multipleSelection},PlannerChangeReq).then(res=>{
             if(res.status == 200){
              this.sallocationSuccess('dialogPersonal')
               }
            })
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      // 分配到部门 保存
      departmentDetermine(formName){
        this.$refs[formName].validate((valid) => {
          if (valid) {
            allocationDepartment({clientIds:this.multipleSelection},{deptId:this.departmentForm.department}).then(res=>{
              if(res.status == 200){
                 this.sallocationSuccess('dialogDepartment')
              }
            })
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      // 分配成功的提示
      sallocationSuccess(dialog){
       this.$notify({
              title: '成功',
              message: '分配成功',
              type: 'success'
            });
          this.getClientPoolList()
           this[dialog] = false
           this.multipleSelection = []
      },
        //获取部门列表
      getDeptRoots() {
        getDeptRoots().then(response => {
          if(response.status == 200){
            this.rootList = response.data;
          }
        })
      },
      cancel(formName){
        this.$refs[formName].resetFields();
        this.dialogPersonal = false
        this.dialogDepartment = false
      },
       handleSelectionChange(val) {
        let arr = []
        val.forEach(item=>{
          arr.push(item.clientId)
        })
        this.multipleSelection = arr;
      },
    }
  }
</script>

<style lang="scss" scoped>
.el-select,
.el-date-editor {
  width: 100%;
}
</style>

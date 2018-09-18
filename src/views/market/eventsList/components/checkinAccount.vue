<template>
  <article class="checkin-account">
      <div style="text-align: right">
      <el-button  class="search_btn" @click="handleCreate">
        <svg-icon icon-class="add"></svg-icon> 添加</el-button>
    </div>
      <el-table
      border
      v-loading="listLoading"
      element-loading-text="给我一点时间"
      :data="records"
      style="width: 100%">
      <el-table-column
       align="center"
        prop="signinAccountName"
        label="签到人姓名">
      </el-table-column>
      <el-table-column
       align="center"
        prop="signinAccountCode"
        label="签到人编号">
      </el-table-column>
      <el-table-column
       align="center"
        prop="signinAccountDeptName"
        label="签到人部门">
      </el-table-column>
      <el-table-column
       align="center"
        prop="signinAccountMobile"
        label="签到人手机号">
      </el-table-column>
       <el-table-column
        align="center"
        label="操作">
        <template slot-scope="scope">
         <a class="red" size="small" @click="deleteAccountMobile(scope.row)">删除</a>
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
          title="新增签到"
          :visible.sync="dialogVisible"
          width="30%">
          <el-form :model="SignInPersonForm" :rules="SignInPersonRules" ref="SignInPerson" label-width="100px" class="demo-ruleForm">

          <el-form-item label="签到人姓名" prop="name">
            <!-- <el-input  placeholder="清选择签到人姓名" style="width:90%;"></el-input> -->
            <el-select filterable v-model="SignInPersonForm.name" placeholder="请选择" style="width:90%;" @change="selectChange">
              <el-option v-for="item in activityLeader" :key="item.userId" :label="item.name" :value="item.userId">
              </el-option>
            </el-select>
          </el-form-item>

          <el-form-item  label="签到人部门" prop="dept">
            <el-input disabled style="width:90%;" v-model="SignInPersonForm.dept"></el-input>
          </el-form-item>

          <el-form-item label="签到人编号" prop="empNo">
            <el-input style="width:90%;" disabled v-model="SignInPersonForm.empNo"></el-input>
          </el-form-item>

          <el-form-item label="签到人手机" prop="mobile">
            <el-input style="width:90%;" disabled v-model="SignInPersonForm.mobile"></el-input>
          </el-form-item>

        </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button  class="search_btn" @click="cancel('SignInPerson')">取 消</el-button>
            <el-button  class="add_btn" @click="clientDetermine('SignInPerson')">确 定</el-button>
          </div>
        </el-dialog>
  </article>

</template>

<script>
  import { mapGetters } from 'vuex'
  import {getSigninaccount,addSigninaccount,deleteSigninaccount} from '@/api/market/eventsList'
  import {getDirectSupervisorList} from '@/api/user'
   import {  getObj } from '@/api/dept'
  export default {
    name: 'checkinAccount',
    data() {
      return {
        listLoading:false,
        dialogVisible: false,
        listQuery: {
          page: 1,
          limit: 20,
          activityId:this.$route.params.activityId,
        },
        total:null,
        records:null,
        SignInPersonRules:{
          dept: [
            { required: true, message: '没有签到人部门'},
          ],
          name: [
            { required: true, message: '清选择签到人姓名'},
          ],

          empNo: [
            { required: true, message: '没有签到人编号'},
          ],
          mobile: [
            { required: true, message: '没有签到人手机'},
          ],
        },
        SignInPersonForm:{dept:''},
        activityLeader:[],
        params:{
          activityId:this.$route.params.activityId,
          accountid :''
        }
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
      this.getSigninaccount()
      this.sys_user_add = this.permissions['sys_user_add']
      this.sys_user_upd = this.permissions['sys_user_upd']
      this.sys_user_del = this.permissions['sys_user_del']
    },

    methods: {
      getSigninaccount(){
        getSigninaccount(this.listQuery).then(res=>{
          if(res.status == 200){
            this.records = res.data.records
            this.total = res.data.total
          }
        })
      },
      handleSizeChange(val) {
        this.listQuery.limit = val
        this.getSigninaccount()
      },
      handleCurrentChange(val) {
        this.listQuery.page = val
        this.getSigninaccount()
      },
       // 查询所有用户
    getDirectSupervisorList() {
      getDirectSupervisorList().then(res => {
        if (res.status == 200) {
          this.activityLeader = res.data
        }
      })
    },
    selectChange(userId){
      this.activityLeader.forEach(item=>{

        if(item.userId == userId){
          this.params.accountid = item.userId
            getObj(item.deptId).then(response => {
             this.SignInPersonForm.dept =  response.data.name
            })
          this.SignInPersonForm.empNo =  item.empNo
          this.SignInPersonForm.mobile =  item.mobile
        }
      })
     
    },
      // 添加
      handleCreate(){
        this.dialogVisible = true;
         // 获取 所有用户
       this.getDirectSupervisorList();
      },
      // 取消 关闭对话框
      cancel(formName){
        this.$refs[formName].resetFields();
        this.dialogVisible = false;
      },
      // 保存
      clientDetermine(formName){
         this.$refs[formName].validate((valid) => {
          if (valid) {
            addSigninaccount(this.params).then(res=>{
              if(res.status == 200){
                 this.$notify({
                    title: '成功',
                    message: '添加成功',
                    type: 'success'
                  });
              this.cancel('SignInPerson')

              }
            })
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      // 删除签到账户
      deleteAccountMobile(id){
        this.$confirm('此操作将永久删除该签到记录 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deleteSigninaccount(id.activityMulitSelectId).then(res=>{
            if(res.status == 200){
              this.getSigninaccount()
               this.$notify({
                  title: '成功',
                  message: '删除成功',
                  type: 'success'
                });
            }
          })
         
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
.checkin-account{
  .red{
   color: #FF4949; 
  }
}
</style>

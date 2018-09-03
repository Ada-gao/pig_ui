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
      :data="tableData"
      style="width: 100%">
      <el-table-column
       align="center"
        prop="date"
        label="签到人姓名">
      </el-table-column>
      <el-table-column
       align="center"
        prop="name"
        label="签到人编号">
      </el-table-column>
      <el-table-column
       align="center"
        prop="address"
        label="签到人部门">
      </el-table-column>
      <el-table-column
       align="center"
        prop="address"
        label="签到人手机号">
      </el-table-column>
       <el-table-column
        align="center"
        label="操作">
        <template slot-scope="scope">
         <a class="red" size="small">删除</a>
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
        <el-dialog
          title="新增签到"
          :visible.sync="dialogVisible"
          width="30%">
          <el-form  ref="newAddClient" label-width="100px" class="demo-ruleForm">

          <el-form-item  label="标签名称">
            <el-input placeholder="签到人部门" style="width:90%;"></el-input>
          </el-form-item>

          <el-form-item label="签到人姓名">
            <el-input  placeholder="请输入标签解释" style="width:90%;"></el-input>
          </el-form-item>
             <el-form-item label="签到人编号">
            <el-input  placeholder="请输入标签解释" style="width:90%;"></el-input>
          </el-form-item>
               <el-form-item label="签到人手机">
            <el-input  placeholder="请输入标签解释" style="width:90%;"></el-input>
          </el-form-item>
        </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button  class="search_btn" @click="cancel('newAddClient')">取 消</el-button>
            <el-button  class="add_btn" @click="clientDetermine('newAddClient')">确 定</el-button>
          </div>
        </el-dialog>
  </article>

</template>

<script>
  import { mapGetters } from 'vuex'
  import {getSigninaccount} from '@/api/market/eventsList'
  export default {
    name: 'checkinAccount',
    data() {
      return {
        listLoading:false,
        dialogVisible: false,
        listQuery: {
          page: 1,
          limit: 20,
          activityId :1,
        },
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

        })
      },
      // 添加
      handleCreate(){
        this.dialogVisible = true;
      },
      // 取消 关闭对话框
      cancel(formName){
        this.$refs[formName].resetFields();
      },
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

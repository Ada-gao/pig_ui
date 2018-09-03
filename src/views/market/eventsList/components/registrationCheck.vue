<template>
  <article class="checkin-account">
    <div style="text-align: right;">
      <el-button class="search_btn" @click="handleExport">
        <svg-icon icon-class="export"></svg-icon>批量导出
      </el-button>
    </div>
      <el-table
      border
      v-loading="listLoading"
      element-loading-text="给我一点时间"
      :data="list"
      style="width: 100%">
      <el-table-column
       align="center"
        prop="registrationTime"
        label="报名时间">
      </el-table-column>
      <el-table-column
       align="center"
        prop="clientFrom"
        label="来源">
      </el-table-column>
      <el-table-column
       align="center"
        prop="clientName"
        label="客户姓名">
      </el-table-column>
      <el-table-column
       align="center"
        prop="clientCode"
        label="客户编号">
      </el-table-column>
        <el-table-column
       align="center"
        prop="deptName"
        label="部门">
      </el-table-column>
        <el-table-column
       align="center"
        prop="plannerName"
        label="理财师姓名">
      </el-table-column>
        <el-table-column
       align="center"
        prop="address"
        label="理财师编号">
      </el-table-column>
        <el-table-column
        align="center"
        class-name="status-col" 
        label="签到状态">
          <template slot-scope="scope">
          <el-tag v-if="scope.row.activitySigninStatus == 1" class="leave">{{scope.row.activitySigninStatus|turnText(workStatus)}}</el-tag>
          <el-tag v-if="scope.row.activitySigninStatus == 2" class="normal">{{scope.row.activitySigninStatus|turnText(workStatus)}}</el-tag>
        </template>
      </el-table-column>
         <el-table-column
       align="center"
        prop="singinTime"
        label="签到时间">
      </el-table-column>
    </el-table>
    <div v-show="!listLoading" class="pagination-container">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                     :current-page.sync="listQuery.page"
                     :page-sizes="[10,20,30, 50]" :page-size="listQuery.limit"
                     layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>
    
  </article>

</template>

<script>
  import { mapGetters } from 'vuex'
  import {getActivityClient,exportPf} from '@/api/market/eventsList'
  import { parseTime, transformText, transformText1 } from '@/utils'
  export default {
    name: 'registrationCheck',
    data() {
      return {
        listLoading:false,
        dialogVisible: true,
        listQuery: {
          page: 1,
          limit: 20,
          activityId:1
        },
        total: null,
       list:[]
      }
    },
    filters: {
      turnText (val, list) {
   
        return val == 1?'未签到':'已签到'
      },
      parseTime (time) {
        if(!time) return
        let date = new Date(time)
        return parseTime(date)
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
      this.getActivityClient()
      this.sys_user_add = this.permissions['sys_user_add']
      this.sys_user_upd = this.permissions['sys_user_upd']
      this.sys_user_del = this.permissions['sys_user_del']
    },

    methods: {
      getActivityClient(){
        this.listLoading = true;
        getActivityClient(this.listQuery).then(res=>{
          if(res.status == 200){
            this.total = res.data.total;
            this.list = res.data.records;
            this.listLoading = false;
          }
        })
      },
         // 取消 关闭对话框
      cancel(formName){
        this.$refs[formName].resetFields();
      },
      handleSizeChange(val) {
			  this.listQuery.limit = val
			  this.getActivityClient()
      },
      handleCurrentChange(val) {
        this.listQuery.page = val
        this.getActivityClient()
      },
      // 导出
      handleExport() {
        exportPf(this.listQuery).then(res => {
          if (res.status === 200) {
            console.log(res)
            const fileName = decodeURI(res.headers['content-disposition'].split('=')[1]) // 导出时要decodeURI
            const blob = new Blob([res.data], { type: 'blob' })
            const objectUrl = URL.createObjectURL(blob)
            this.forceDownload(objectUrl, fileName)
          }
        })
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

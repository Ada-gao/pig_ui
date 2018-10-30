<template>
  <article class="checkin-account">
    <el-row type="flex" align="middle" :gutter="10">
         <el-form :model="params" ref="listQuery" label-width="100px" class="demo-dynamic">
            <el-form-item label="签到状态" >
                <el-select v-model="params.signinStatus" placeholder="请选择" @change="signinStatusChange">
                 <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
          </el-form>
        </el-row>
  
    <div style="text-align: right;" v-if="activity_client_export">
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
        label="报名时间">
        <template slot-scope="scope">
          {{scope.row.registrationTime | parseTime('{y}-{m}-{d} {h}:{i}')}}
        </template>
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
        prop="plannerCode"
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
        label="签到时间">
         <template slot-scope="scope">
          {{scope.row.singinTime | parseTime('{y}-{m}-{d} {h}:{i}')}}
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
    
  </article>

</template>

<script>
  import { mapGetters } from 'vuex'
  import {getActivityClient,exportPf} from '@/api/market/eventsList'
  import { transformText, transformText1 } from '@/utils'
  export default {
    name: 'registrationCheck',
    data() {
      return {
        listLoading:false,
        dialogVisible: true,
        listQuery: {
          page: 1,
          limit: 20,
          activityId:this.$route.params.activityId,
          signinStatus:null
        },
        total: null,
       list:[],
       params:{
        activityId:this.$route.params.activityId,
        signinStatus:null
       },
       options:[{
        value: null,
        label: '全部'
        },{
        value: '1',
        label: '未签到'
        },{
          value: '2',
          label: '已签到'
        }]
      }
    },
    filters: {
      turnText (val, list) {
        return val == 1?'未签到':'已签到'
      }
     
    },
    computed: {
      ...mapGetters([
        'permissions',
        'clientFrom',
        'workStatus',
      ])
    },
    created() {
      this.getActivityClient()
      this.activity_client_export = this.permissions['activity_client_export']
      this.sys_user_upd = this.permissions['sys_user_upd']
      this.sys_user_del = this.permissions['sys_user_del']
    },

    methods: {
      // 签到状态变化
      signinStatusChange(val){
        this.listQuery.signinStatus = val
        this.params.signinStatus = val
        this.getActivityClient()
      },
      getActivityClient(){
        this.listLoading = true;
        getActivityClient(this.listQuery).then(res=>{
          if(res.status == 200){
            this.total = res.data.total;
            this.list = res.data.records;
            this.list.forEach(item => {
              item.clientFrom = transformText(this.clientFrom, item.clientFrom)
            })
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
        if(this.list.length<1){
          this.$notify({
            title: '警告',
            message: '暂无数据',
            type: 'warning'
          });
        }else{
          exportPf(this.params).then(res => {
            if (res.status === 200) {
              const fileName = decodeURI(res.headers['content-disposition'].split('=')[1]) // 导出时要decodeURI
              const blob = new Blob([res.data], { type: 'blob' })
              const objectUrl = URL.createObjectURL(blob)
              this.forceDownload(objectUrl, fileName)
            }
          })
        }
      },
        forceDownload (url, name) {
      const link = document.createElement('a')
      link.href = url
      link.download = name
      link.click()
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

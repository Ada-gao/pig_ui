<template>
  <article class="checkin-account">
         <el-row type="flex" align="middle" :gutter="10">
           跟踪时间(月)
          <el-col :span="2"><el-input v-model="listQuery.trackMonth" placeholder="请输入跟踪时间"></el-input></el-col>
          <el-button class="search_btn" ><svg-icon icon-class="search"></svg-icon> 查询</el-button>
        </el-row>
       <div style="text-align: right;">
          <el-button class="search_btn" @click="handleExport">
            <svg-icon icon-class="export"></svg-icon>批量导出
          </el-button>
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
        label="打款时间">
      </el-table-column>
      <el-table-column
       align="center"
        prop="name"
        label="预约编号">
      </el-table-column>
      <el-table-column
       align="center"
        prop="address"
        label="产品编号">
      </el-table-column>
      <el-table-column
       align="center"
        prop="address"
        label="产品名称">
      </el-table-column>
        <el-table-column
       align="center"
        prop="address"
        label="客户姓名">
      </el-table-column>
        <el-table-column
       align="center"
        prop="address"
        label="客户编号">
      </el-table-column>
        <el-table-column
       align="center"
        prop="address"
        label="部门">
      </el-table-column>
        <el-table-column
       align="center"
        prop="address"
        label="理财师姓名">
      </el-table-column>
        <el-table-column
       align="center"
        prop="address"
        label="理财师编号">
      </el-table-column>
        <el-table-column
       align="center"
        prop="address"
        label="打款金额(万）">
      </el-table-column>
    </el-table>
    <!-- <div v-show="!listLoading" class="pagination-container">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                     :current-page.sync="listQuery.page"
                     :page-sizes="[10,20,30, 50]" :page-size="listQuery.limit"
                     layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div> -->
    
  </article>

</template>

<script>
  import { mapGetters } from 'vuex'
  import {getContract,exportcontract} from '@/api/market/eventsList'
  export default {
    name: 'checkinAccount',
    data() {
      return {
        listLoading:false,
        dialogVisible: true,
        listQuery: {
          page: 1,
          limit: 20,
          activityId :1,
          trackMonth : ''
        },
        total: null,

       
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
      this.getContract()
      this.sys_user_add = this.permissions['sys_user_add']
      this.sys_user_upd = this.permissions['sys_user_upd']
      this.sys_user_del = this.permissions['sys_user_del']
    },

    methods: {
      getContract(){
        getContract(this.listQuery).then(res=>{

        })
      },
         // 取消 关闭对话框
      cancel(formName){
        this.$refs[formName].resetFields();
      },
      handleSizeChange(val) {
			  this.listQuery.limit = val
			  this.getList()
      },
      handleCurrentChange(val) {
        this.listQuery.page = val
        this.getList()
      },
       // 导出
      handleExport() {
        exportcontract(this.listQuery).then(res => {
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

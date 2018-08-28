<template>
  <article class="checkin-account">
    <div style="text-align: right;">
      <el-button class="search_btn">
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
        label="报名时间">
      </el-table-column>
      <el-table-column
       align="center"
        prop="name"
        label="来源">
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
        label="签到状态">
      </el-table-column>
         <el-table-column
       align="center"
        prop="address"
        label="签到时间">
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
  export default {
    name: 'checkinAccount',
    data() {
      return {
        listLoading:false,
        dialogVisible: true,
        listQuery: {
          page: 1,
          limit: 20
        },
        total: null,
 tableData: [{
            date: '2016-05-02',
            name: '王小虎',
            address: '上海市普陀区金沙江路 1518 弄'
          }, {
            date: '2016-05-04',
            name: '王小虎',
            address: '上海市普陀区金沙江路 1517 弄'
          }, {
            date: '2016-05-01',
            name: '王小虎',
            address: '上海市普陀区金沙江路 1519 弄'
          }, {
            date: '2016-05-03',
            name: '王小虎',
            address: '上海市普陀区金沙江路 1516 弄'
          }]
       
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
      this.sys_user_add = this.permissions['sys_user_add']
      this.sys_user_upd = this.permissions['sys_user_upd']
      this.sys_user_del = this.permissions['sys_user_del']
    },

    methods: {
      handleCreate(){

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

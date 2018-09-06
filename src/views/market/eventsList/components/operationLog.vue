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
        label="时间">
      </el-table-column>
      <el-table-column
       align="center"
        prop="name"
        label="操作人">
      </el-table-column>
      <el-table-column
       align="center"
        prop="address"
        label="操作内容">
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
  import {getOperationLog} from '@/api/market/eventsList'
  export default {
    name: 'checkinAccount',
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
      this.getOperationLog()
      this.sys_user_add = this.permissions['sys_user_add']
      this.sys_user_upd = this.permissions['sys_user_upd']
      this.sys_user_del = this.permissions['sys_user_del']
    },

    methods: {
      getOperationLog(){
          getOperationLog(this.listQuery).then(res=>{

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

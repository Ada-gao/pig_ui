<template>
  <article class="checkin-account">
         <el-row type="flex" align="middle" :gutter="10">
         <el-form :model="listQuery" ref="listQuery" label-width="120px" class="demo-dynamic">
            <el-form-item
                prop="trackMonth"
                label=" 跟踪时间(月)"
                :rules="[
                  { required: true, message: '请输入跟踪时间', trigger: 'blur' }
                ]"
              >
                <el-col :span="20"><el-input @change="trackMonthChange" v-model="listQuery.trackMonth" placeholder="请输入跟踪时间"></el-input></el-col>
                <el-col :span="4"><el-button class="search_btn" @click="submitForm('listQuery')"><svg-icon icon-class="search"></svg-icon> 查询</el-button></el-col>
              </el-form-item>
          </el-form>
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
      :data="records"
      style="width: 100%">
      <el-table-column
       align="center"
        label="打款时间">
        <template slot-scope="scope">
          {{scope.row.tradeDate | parseTime}}
        </template>
      </el-table-column>
      </el-table-column>
      <el-table-column
       align="center"
        prop="appointmentCode"
        label="预约编号">
      </el-table-column>
      <el-table-column
       align="center"
        prop="productCode"
        label="产品编号">
      </el-table-column>
      <el-table-column
       align="center"
        prop="deptName"
        label="产品名称">
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
        prop="amount"
        label="打款金额(万）">
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
          activityId :this.$route.params.activityId,
          trackMonth : 6
        },
        total: null,
        records:null,
        params:{
        activityId:this.$route.params.activityId,
        trackMonth:6
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
      this.getContract()
      this.sys_user_add = this.permissions['sys_user_add']
      this.sys_user_upd = this.permissions['sys_user_upd']
      this.sys_user_del = this.permissions['sys_user_del']
    },

    methods: {
      // 跟踪时间变化
      trackMonthChange(val){
console.log(val)
      },
      // 获取列表
      getContract(){
        getContract(this.listQuery).then(res=>{
          if(res.status == 200){
            this.params.trackMonth = this.listQuery.trackMonth
            this.records = res.data.records
            this.total = res.data.total
          }
        })
     
      },
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
           this.getContract()
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      handleSizeChange(val) {
			  this.listQuery.limit = val
			  this.getContract()
      },
      handleCurrentChange(val) {
        this.listQuery.page = val
        this.getContract()
      },
       // 导出
      handleExport() {
         if(this.records.length<1){
              this.$notify({
                title: '警告',
                message: '暂无数据',
                type: 'warning'
              });
            }else{
              exportcontract(this.listQuery).then(res => {
                if (res.status === 200) {
                  console.log(res)
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

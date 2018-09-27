<template>
<div class="app-container calendar-list-container">
  <div class="filter-container">
    <el-form label-position="right" label-width="100px">
      <el-row :gutter="20">
        <el-col :xs="24" :sm="12" :md="12" :lg="8" :xl="8">
          <el-form-item label="活动名称">
            <el-input placeholder="请输入活动名称" v-model="listQuery.activityName">
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="12" :md="12" :lg="8" :xl="8">
          <el-form-item label="活动开始时间">
            <el-date-picker v-model="startDate" type="daterange" start-placeholder="开始日期" end-placeholder="结束日期" :default-time="['00:00:00', '23:59:59']">
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="12" :md="12" :lg="8" :xl="8">
          <el-form-item label="活动结束时间">
            <el-date-picker v-model="endDate" type="daterange" start-placeholder="开始日期" end-placeholder="结束日期" :default-time="['00:00:00', '23:59:59']">
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="12" :md="12" :lg="8" :xl="8">
          <el-form-item label="活动状态">
            <!-- <el-checkbox :class="{add_btn:releaseSelection == 1}" @click="changeReleaseSelection(1)">未发布</el-checkbox>
            <el-button :class="{add_btn:releaseSelection == 2}" @click="changeReleaseSelection(2)">已发布</el-button>
            <el-button :class="{add_btn:releaseSelection == 3}" @click="changeReleaseSelection(3)">已结束</el-button> -->
            <el-checkbox-group v-model="activityStatus">
              <el-checkbox-button  v-for="releaseSelection in releaseSelections" :label="releaseSelection" :key="releaseSelection">{{releaseSelection}}</el-checkbox-button>
            </el-checkbox-group>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row style="text-align: center;">
        <el-button class="search_btn" @click="handleFilter">
          <svg-icon icon-class="search"></svg-icon> 查询
        </el-button>
        <el-button class="search_btn" @click="resetFilter">
          <svg-icon icon-class="reset"></svg-icon> 重置
        </el-button>
      </el-row>
    </el-form>
  </div>

  <div style="text-align: right" v-if="activity_add">
    <el-button class="add_btn" @click="handleUpdate('add')">
      <svg-icon icon-class="add"></svg-icon> 新增活动
    </el-button>
  </div>
  <el-table :key='tableKey' :data="activityList" v-loading="listLoading" element-loading-text="给我一点时间" border fit highlight-current-row style="width: 100%">

    <el-table-column align="center" label="活动名称" prop="activityName">
    </el-table-column>

    <el-table-column align="center" label="活动编号" prop="activityCode">
    </el-table-column>

    <el-table-column align="center" label="活动开始时间">
      <template slot-scope="scope">
        <span>{{scope.row.activityStart | parseTime}}</span>
        </template>
    </el-table-column>

    <el-table-column align="center" label="活动结束时间">
      <template slot-scope="scope">
          <span>{{scope.row.activityEnd | parseTime}}</span>
        </template>
    </el-table-column>

    <el-table-column align="center" label="活动负责人" prop="activityPrincipal" show-overflow-tooltip>
    </el-table-column>

    <el-table-column align="center" label="活动部门" prop="activityDept" show-overflow-tooltip>
    </el-table-column>

    <el-table-column align="center" class-name="status-col" label="活动状态">
      <template slot-scope="scope">
          <el-tag v-if="scope.row.activityStatusId == 0" class="normal">{{scope.row.activityStatusId|turnText}}</el-tag>
          <el-tag v-if="scope.row.activityStatusId == 1" class="unusual">{{scope.row.activityStatusId|turnText}}</el-tag>
          <el-tag v-if="scope.row.activityStatusId == 2" class="leave">{{scope.row.activityStatusId|turnText}}</el-tag>
        </template>
    </el-table-column>

    <el-table-column align="center" label="官方活动二维码" >
      <template slot-scope="scope">
        <a @click="modelCode(scope.row)">
        <svg-icon icon-class="qrcode"  ></svg-icon>
        </a>
       
        <a @click="download(scope)">
         下载  
        </a>

        <!-- <download-qrcode >下载</download-qrcode>/ -->
        </template>
    </el-table-column>

    <el-table-column align="center" label="操作" fixed="right" width="150">
      <template slot-scope="scope">
          <a v-if="activity_query" size="small" class="common_btn"
                     @click="handleUpdate('view',scope.row)">查看
          </a>
          <span class="space_line" v-if="activity_edit"> | </span>
          <a v-if="activity_edit" size="small" class="common_btn"
                     @click="handleUpdate('edit',scope.row)">编辑
          </a>
            <a v-if="activity_delete" size="small" class="danger_btn"
                   @click="deletes(scope.row)" >删除
          </a>
        </template>
    </el-table-column>

  </el-table>
 
  <div v-show="!listLoading" class="pagination-container">
    <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="listQuery.page" :page-sizes="[10,20,30, 50]" :page-size="listQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="total">
    </el-pagination>
  </div>

<qrcode v-if="dialogVisible" :activityQrcodeUrl= "activityQrcodeUrl" @dialogVisibleChild = "dialogVisibleChild"></qrcode>
  <div id="qrcode1" ref="qrcode1" v-show="false"></div>
</div>
</template>

<script>
import {getActivityList,deleteActivity} from '@/api/market/eventsList'
import waves from '@/directive/waves/index.js' // 水波纹指令
import {parseTime,transformText, transformText1} from '@/utils'
import { mapGetters} from 'vuex'
import ElRadioGroup from 'element-ui/packages/radio/src/radio-group'
import ElOption from "element-ui/packages/select/src/option"
import Bus from '@/assets/js/bus'
import qrcode from './components/qrcode.vue'
import QRCode from 'qrcodejs2'
export default {
  components: {
    ElOption,
    ElRadioGroup,
    qrcode,
    QRCode
  },
  filters: {
    turnText(val, list) {
      let self
      if(val == 0) self = "未发布"
      if(val == 1) self = "已发布"
      if(val == 2) self = "已结束"
      return self
    },
    parseTime(time) {
      if (!time) return
      let date = new Date(time)
      return parseTime(date)
    }
  },
  name: 'table_user',
  directives: {
    waves
  },
  data() {
    return {
      activityQrcodeUrl:'',
      dialogVisible: false,
      activityList: [],
      total: null,
      listLoading: true,
      releaseSelections:['未发布','已发布','已结束'],
      activityStatus: [],
      listQuery: {
        page: 1,
        limit: 20,
        activityStatus:[]
      },
      role: undefined,
      form: {
        name: 'rank',
        username: undefined,
        password: undefined,
        status: undefined,
        deptId: undefined
      },
      tableKey: 0,
      startDate: [],
      endDate: [],
    }
  },
  computed: {
    ...mapGetters([
      'permissions'
    ])
  },
  created() {
    this.getActivityList()
    this.activity_add = this.permissions['activity_add']
    this.activity_query = this.permissions['activity_query']
    this.activity_edit = this.permissions['activity_edit']
    this.activity_delete = this.permissions['activity_delete']
  },
  mounted(){

},
  methods: {
    //二维码预览
    modelCode(activityQrcodeUrl) {
      this.dialogVisible = true
      this.activityQrcodeUrl = {
          dialogVisible: this.dialogVisible,
          activityQrcodeUrl
      }
         
    },
    dialogVisibleChild(val){
      this.dialogVisible = val
          },
       qrcode (text) {
        let qrcode = new QRCode('qrcode1', {  
            width: 200,  // 设置宽度 
            height: 200, // 设置高度
             text:text
            // text:'http://10.9.70.235:9999'+text
        })  
      },
    download(scope){
      let img = document.getElementById('qrcode1').getElementsByTagName('img')[scope.$index]
      var link = document.createElement("a");
      link.setAttribute("href",img.src);
      link.setAttribute("download",'123.png');
      link.click();
    },
    getActivityList() {
      this.listLoading = true
   
      getActivityList(this.listQuery).then(res => {
       if(res.status == 200){
        this.activityList  = res.data.records
        this.total = res.data.total
        this.listLoading = false
        document.getElementById("qrcode1").innerHTML = "";
        this.activityList.forEach((item,index)=>{
         this.qrcode(item.activityQrcodeUrl)
       })
       }
      })
    },


// 查询
    handleFilter() {
      this.listQuery.page = 1
      this.listQuery.activityStatus = []
      this.activityStatus.forEach(item=>{
        if(item == '已发布') this.listQuery.activityStatus.push(0)
        if(item == '未发布') this.listQuery.activityStatus.push(1)
        if(item == '已结束') this.listQuery.activityStatus.push(2)
      })
      this.listQuery.activityStartFrom = this.startDate && this.startDate[0] 
      this.listQuery.activityStartTo = this.startDate && this.startDate[1] 
      this.listQuery.activityEndFrom = this.endDate && this.endDate[0] 
      this.listQuery.activityEndTo = this.endDate && this.endDate[1] 

      this.getActivityList()
    },
    handleSizeChange(val) {
      this.listQuery.limit = val
      this.getActivityList()
    },
    handleCurrentChange(val) {
      this.listQuery.page = val
      this.getActivityList()
    },
    // 编辑查询（查看）新增 页面跳转
    handleUpdate(state, row) {
      if(state == 'add'){
        this.$router.push(`/market/eventsList/${state}`)
      }else{
        this.$router.push(`/market/eventsList/${state}/${row.activityId}`)
      }
      
    },
    deletes(row) {
      this.$confirm('此操作将永久删除该活动，是否继续？', '提示', {
         confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
      }).then(() => {
        deleteActivity(row.activityId).then(() => {
          this.getActivityList()
          this.$notify({
            title: '成功',
            message: '删除成功',
            type: 'success',
            duration: 2000
          })
        }).catch(() => {
          this.$notify({
            title: '失败',
            message: '删除失败',
            type: 'error',
            duration: 2000
          })
        })
      })
    },
    resetFilter() { // 重置搜索条件
      this.listQuery = {
          page: 1,
          limit: 20,
          activityStatus: [],
          activityStartFrom: '',
          activityStartTo: '',
          activityEndFrom: '',
          activityEndTo: '',
          activityName: null
        },
      this.startDate = []
      this.endDate = []
      this.activityStatus = []
      this.getActivityList()
    }
  }
}
</script>

<style lang="scss" scoped>
.el-date-editor,
.el-select {
    width: 100%;
}
.title-code {
    font-family: PingFangSC-Medium;
    font-size: 20px;
    color: #000000;
    letter-spacing: 0;
}
</style>

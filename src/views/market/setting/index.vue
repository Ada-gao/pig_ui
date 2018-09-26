<template>
  <div class="app-container calendar-list-container">
    <div class="main-tab">
      <el-radio-group v-model="step" style="margin-bottom: 0;">
        <el-radio-button label="1">部门logo设置</el-radio-button>
        <el-radio-button label="2">活动类型设置</el-radio-button>
      </el-radio-group>
    </div>
    <article v-if="step == 1">
    <!-- <div style="text-align: right">
      <el-button v-if="sys_user_add" class="add_btn" @click="handleCreate">
        <svg-icon icon-class="add"></svg-icon> 新增</el-button>
    </div> -->
    <el-table :key='tableKey' :data="list" v-loading="listLoading" element-loading-text="给我一点时间" border fit
               style="width: 100%">
      <el-table-column  align="center" label="部门名称">
        <template slot-scope="scope">
          <span>{{scope.row.name}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="部门LOGO" show-overflow-tooltip>
        <template slot-scope="scope" >
          <span class='img' v-if='scope.row.logo'>
            <img :src="scope.row.logo" alt="">
          </span>
          <span class='img' v-else>
            <svg-icon icon-class="image"></svg-icon>
          </span>
        </template>
      </el-table-column>

      <el-table-column  align="center" label="操作">
        <template slot-scope="scope">
          <el-upload
            class="upload-demo"
            action="/activity/file/upload"
            :show-file-list="false"
            :before-upload='limitImg'
            :on-success="(res)=>{return afterSuccess(res,{deptId:scope.row.deptId})}">
            <el-button size="small" class='choose_button' v-if='subcompany_logo'>选择图片</el-button>
          </el-upload>
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
      <activity-type v-if="step == 2"></activity-type>
  </div>
</template>

<script>
import {getSubcompany,getLogo} from '@/api/market/setting'
  import waves from '@/directive/waves/index.js' // 水波纹指令
  import { parseTime, transformText, transformText1 } from '@/utils'
  import { mapGetters } from 'vuex'
  import ElRadioGroup from 'element-ui/packages/radio/src/radio-group'
  import ElOption from "element-ui/packages/select/src/option"
  import activityType from './activityType.vue'

  export default {
    components: {
      ElOption,
      ElRadioGroup,
      activityType
    },
    name: 'table_user',
    directives: {
      waves
    },
    data() {
      return {
        step:1,
        dialogVisible:false,
        list: null,
        total: null,
        listLoading: true,
        listQuery: {
          page: 1,
          limit: 20
        },
        tableKey: 0,
        dialogImageUrl: '',
      }
    },
    computed: {
      ...mapGetters([
        'permissions',
      ])
    },
    created() {
      this.getList()
      this.subcompany_logo = this.permissions['subcompany_logo']
      // this.sys_user_upd = this.permissions['sys_user_upd']
      // this.sys_user_del = this.permissions['sys_user_del']
    },
    methods: {
      getList() {
        this.listLoading = true
        getSubcompany(this.listQuery).then(response => {
          this.list = response.data.records
          this.total = response.data.total
          this.listLoading = false
          console.log(this.list)
        })
      },
      getCompanyLogo(obj){
        getLogo(obj).then(response=>{
          console.log(response)
          if(response.status ==200){
            getSubcompany(this.listQuery).then(response => {
              this.list = response.data.records
              this.total = response.data.total
            })
          }
        })
      },
      handleSizeChange(val) {
        this.listQuery.limit = val
        this.getList()
      },
      handleCurrentChange(val) {
        this.listQuery.page = val
        this.getList()
      },
      limitImg(file){
        const isJPG = file.type === 'image/png';
        const isLt1M = file.size / 1024 / 1024 < 1;
        if (!isJPG) {
          this.$notify({
            title: '警告',
            message: '上传LOGO图片只能是 png 格式!',
            type: 'warning'
          });
          return false;
        }
        if (!isLt1M) {
          this.$notify({
            title: '警告',
            message: '上传LOGO图片大小不能超过 1MB!',
            type: 'warning'
          });
          return false;
        }
      },
      afterSuccess(file,objs){
        let obj = {
          "deptId": objs.deptId,
          "logo": file.url,
        }
        this.getCompanyLogo(obj)
      },
    }
  }
</script>

<style lang="scss" scoped>
.el-select,
.el-date-editor {
  width: 100%;
}
.add{
  font-size: 10px;
  color: #A1A1A1;
  letter-spacing: 0;
  line-height: 20px;
  display:block;
}
.commonr_btn{
  color:#0299CC;
}
.choose_button{
  color:#0299CC;
  background-color: #ffffff;
  border:none;
}
.el-table__row:hover{
  .choose_button{
    background-color:#f7f8fa;
  }
}
.img{
  display:inline-block;
  width: 93px;
  height:49px;
  line-height: 49px;
  border:none;
  background-color: #F8F8F8;
  img{
    width: 100%;
    height:100%;
  }
  .svg-icon{
    width: 35px;
    height:25px;
    margin: auto;
  }
}
</style>


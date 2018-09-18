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
      <el-table-column align="center" label="部门名称">
        <template slot-scope="scope">
          <span>{{scope.row.name}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="部门LOGO" show-overflow-tooltip>
        <template slot-scope="scope" >
          <span class='img'>
            <img :src="scope.row.logo" alt="">
          </span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="操作">
        <template slot-scope="scope">
          <el-upload
            class="upload-demo"
            action="/activity/file/upload"
            :show-file-list="false"
            :on-success="(res)=>{return afterSuccess(res,{deptId:scope.row.deptId})}">
            <el-button size="small" class='choose_button'>选择图片</el-button>
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

      <!-- <el-dialog
          title="新增部门logo"
          :visible.sync="dialogVisible"
          width="30%">
          <el-form  ref="newAddClient" label-width="100px" class="demo-ruleForm">
          <el-form-item  label="部门名称">
            <template>
              <el-input
                placeholder=""
                v-model="input1"
                :disabled="true">
              </el-input>
          </template>
          </el-form-item>

          <el-form-item label="部门logo">
            <el-upload
              action="/activity/file/upload"
              list-type="picture-card"
              :on-preview="handlePictureCardPreview"
              :on-remove="handleRemove"
              :on-success="afterSuccess">
              <i class="el-icon-plus"></i>
              <span class='add'>点击添加图片</span>
            </el-upload>
            <el-dialog :visible.sync="dialogVisibles">
              <img width="100%" :src="dialogImageUrl" alt="">
            </el-dialog>
          </el-form-item>
        
        </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button  class="search_btn" @click="cancel('newAddClient')">取 消</el-button>
            <el-button  class="add_btn" @click="clientDetermine('newAddClient')">确 定</el-button>
          </div>
        </el-dialog> -->
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
      this.sys_user_add = this.permissions['sys_user_add']
      this.sys_user_upd = this.permissions['sys_user_upd']
      this.sys_user_del = this.permissions['sys_user_del']
    },
    methods: {
      getList() {
        this.listLoading = true
        getSubcompany(this.listQuery).then(response => {
          this.list = response.data.records
          console.log(this.list)
          this.total = response.data.total
          this.listLoading = false
        })
      },
      getCompanyLogo(obj){
        getLogo(obj).then(response=>{
          console.log(response)
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
      afterSuccess(file,objs){
        let obj = {
          "deptId": objs.deptId,
          "logo": file.url,
        }
        this.getCompanyLogo(obj)
      },
      // handleCreate() { // 新增
      //   this.dialogVisible = true
      //   this.resetTemp()
      //   // this.dialogStatus = 'create'
      //   this.$router.push('/admin/user-detail')
      //   Bus.$emit('activeIndex', '/admin/user')
      // },
      // deletes(row) {
      //   this.$confirm('此操作将永久删除该部门(部门名称:' + row.name + '), 是否继续?', '提示', {
      //     confirmButtonText: '确定',
      //     cancelButtonText: '取消',
      //     type: 'warning'
      //   }).then(() => {
      //     delObj(row.name).then(() => {
      //       this.getList()
      //       this.$notify({
      //         title: '成功',
      //         message: '删除成功',
      //         type: 'success',
      //         duration: 2000
      //       })
      //     }).cache(() => {
      //       this.$notify({
      //         title: '失败',
      //         message: '删除失败',
      //         type: 'error',
      //         duration: 2000
      //       })
      //     })
      //   })
      // },
      // handleUpdate(){
      //   this.dialogVisible = true
      // },
     
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
  border-color:#fff;
}
.img{
  display:inline-block;
  width: 93px;
  height:49px;
  border:none;
  img{
    width: 100%;
    height:100%;
  }
}
</style>


<template>
  <div class="app-container calendar-list-container">
    <div class="main-tab">
      <el-radio-group v-model="step" style="margin-bottom: 0;">
        <el-radio-button label="1">部门logo设置</el-radio-button>
        <el-radio-button label="2">活动类型设置</el-radio-button>
      </el-radio-group>
    </div>

    <article v-if="step == 1"> 
      
    <div style="text-align: right">
      <el-button v-if="sys_user_add" class="add_btn" @click="handleCreate">
        <svg-icon icon-class="add"></svg-icon> 添加</el-button>
    </div>
    <el-table :key='tableKey' :data="list" v-loading="listLoading" element-loading-text="给我一点时间" border fit
              highlight-current-row style="width: 100%">


      <el-table-column align="center" label="部门名称">
        <template slot-scope="scope">
        <span>{{scope.row.name}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="部门logo" show-overflow-tooltip>
        <template slot-scope="scope">
        <span>{{scope.row.logo}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="操作">
        <template slot-scope="scope">
          <a size="small" class="common_btn"
                     @click="handleUpdate(scope.row, 'view')">编辑
          </a>
        <a size="small" class="danger_btn">删除</a>
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

      <el-dialog
          title="新增部门logo"
          :visible.sync="dialogVisible"
          width="30%">
          <el-form  ref="newAddClient" label-width="100px" class="demo-ruleForm">

          <el-form-item  label="部门名称">
            <el-input placeholder="签到人部门" style="width:90%;"></el-input>
          </el-form-item>

          <el-form-item label="部门logo">
           
          </el-form-item>
        
        </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button  class="search_btn" @click="cancel('newAddClient')">取 消</el-button>
            <el-button  class="add_btn" @click="clientDetermine('newAddClient')">确 定</el-button>
          </div>
        </el-dialog>
      </article>
      <activity-type v-if="step == 2"></activity-type>
  </div>
</template>

<script>
import {getSubcompany} from '@/api/market/setting'
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
          this.total = response.data.total
          this.listLoading = false
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
      handleCreate() { // 新增
        this.resetTemp()
        // this.dialogStatus = 'create'
        this.$router.push('/admin/user-detail')
        Bus.$emit('activeIndex', '/admin/user')
      },
      deletes(row) {
        this.$confirm('此操作将永久删除该用户(用户名:' + row.username + '), 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          delObj(row.userId).then(() => {
            this.getList()
            this.$notify({
              title: '成功',
              message: '删除成功',
              type: 'success',
              duration: 2000
            })
          }).cache(() => {
            this.$notify({
              title: '失败',
              message: '删除失败',
              type: 'error',
              duration: 2000
            })
          })
        })
      },
 
    }
  }
</script>

<style lang="scss" scoped>
.el-select,
.el-date-editor {
  width: 100%;
}
</style>


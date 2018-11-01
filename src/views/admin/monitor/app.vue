<template>
  <div class="app-container calendar-list-container">
    <!-- <div class="filter-container">
      <el-select v-model="listQuery.type" filterable placeholder="请选择">
        <el-option
          v-for="item in dicts"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
      <el-button class="filter-item search_btn" style="vertical-align: top;" v-waves icon="search" @click="handleFilter">
        <svg-icon icon-class="search"></svg-icon> 搜索</el-button>
    </div> -->

    <div style="text-align: right">
      <el-button v-if="sys_auth_add" class="add_btn" @click="handleCreate">
        <svg-icon icon-class="add"></svg-icon> 添加</el-button>
      <!-- <upload-excel-component @on-selected-file='selected'></upload-excel-component> -->
    </div>
    <el-table :key='tableKey' :data="list" v-loading="listLoading" element-loading-text="给我一点时间" border fit
              highlight-current-row style="width: 100%">

      <el-table-column align="center" label="序号" type="index" width="50">
        <!-- <template slot-scope="scope">
          <span>{{Number(scope.row.id).toFixed()}}</span>
        </template> -->
      </el-table-column>

      <el-table-column label="appId" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.appId}}</span>
        </template>
      </el-table-column>

      <el-table-column label="app密钥" align="center" show-overflow-tooltip>
        <template slot-scope="scope">
          <span>{{ scope.row.appSecret}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="客户端">
        <template slot-scope="scope">
          <span>{{scope.row.client}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="状态">
        <template slot-scope="scope">
          <span>{{scope.row.status|turnText1(authStatus)}}</span>
          <!-- <el-button @click="toogleStatus(scope.row)">{{status_text}}</el-button> -->
        </template>
      </el-table-column>

      <el-table-column align="center" label="操作">
        <template slot-scope="scope">
          <a size="mini" class="common_btn" v-if="sys_auth_del"
                     @click="handleUpdate(scope.row)">编辑
          </a>
          <a size="mini" class="danger_btn" v-if="sys_auth_del"
                     @click="handleFresh(scope.row)">刷新
          </a>
          <a size="mini" class="danger_btn" v-if="sys_auth_del"
                     @click="handleDelete(scope.row)">删除
          </a>
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

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form label-width="100px">
        <el-row :gutter="20">
          <el-col :span="11">
            <el-form-item label="客户端：" prop="name" >
              <span v-if="dialogStatus === 'update'">{{diaData.client}}</span>
              <el-input v-else v-model="diaData.client"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="11" v-show="dialogStatus === 'update'">
            <el-form-item label="状态：" prop="status" >
              <el-select class="filter-item" v-model="diaData.status" placeholder="请选择">
                <el-option v-for="item in authStatus" :key="item.value" :label="item.label" :value="item.value"> </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form> 

      <div slot="footer" class="dialog-footer">
        <el-button class="search_btn" @click="cancleSubmit">取 消</el-button>
        <el-button v-if="dialogStatus === 'create'" class="add_btn" @click="handleSubmit">确 定</el-button>
        <el-button v-else class="add_btn" @click="updateSubmit">修 改</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import { delObj, fetchList, putObj, addObj, freObj } from '@/api/keyt'
  import waves from '@/directive/waves/index.js' // 水波纹指令
  import { mapGetters } from 'vuex'
  import { transformText } from '@/utils'

  export default {
    name: 'table_log',
    directives: {
      waves
    },
    data() {
      return {
        list: null,
        total: null,
        sys_auth_add: false,
        sys_auth_upd: false,
        sys_auth_del: false,
        sys_auth_status_upd: false,
        listLoading: true,
        dicts: [],
        listQuery: {
          page: 1,
          limit: 20,
          type: undefined
        },
        tableKey: 0,
        textMap: {
          update: '编辑密钥',
          create: '新增密钥',
        },
        dialogStatus: '',
        dialogFormVisible: false,
        diaData: {
          status: '0'
        },
        id: '',
      }
    },
    computed: {
      ...mapGetters([
        'permissions',
        'authStatus'
      ])
    },
    created() {
      this.getList()
      this.sys_auth_add = this.permissions['sys_auth_add']
      this.sys_auth_upd = this.permissions['sys_auth_upd']
      this.sys_auth_del = this.permissions['sys_auth_del']
      this.sys_auth_status_upd = this.permissions['sys_auth_status_upd']
    },
    methods: {
      getList() {
        this.listLoading = true
        this.listQuery.orderByField = 'create_time'
        this.listQuery.isAsc = false
        fetchList(this.listQuery).then(response => {
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
      handleUpdate(item) {
        this.dialogStatus = 'update'
        this.dialogFormVisible = true
        this.id = item.appAuthyId
        this.diaData = {
          client: item.client,
          status: String(item.status),
          appAuthyId: item.appAuthyId
        }
        // putObj(item.appAuthyId, this.diaData).then(response => {
        //   console.log(response.data)
        //   this.getList()
        // })
      },
      handleFresh(item) {
        freObj(item.appAuthyId).then(response => {
          if(response.status === 200) {
            this.getList()
            this.$notify({
              title: '成功',
              message: '密钥已刷新',
              type: 'success',
              duration: 2000
            })
          }
        })
      },
      handleDelete(row) {
        delObj(row.appAuthyId)
          .then(response => {
            this.dialogFormVisible = false
            this.getList()
            this.$notify({
              title: '成功',
              message: '删除成功',
              type: 'success',
              duration: 2000
            })
          })
      },
      handleFilter() {
        this.listQuery.page = 1
        this.getList()
      },
      handleCreate() {
        // this.resetTemp()
        this.dialogStatus = 'create'
        this.dialogFormVisible = true
      },
      cancleSubmit() {
        this.dialogFormVisible = false
        this.diaData.client = ''
      },
      handleSubmit() {
        addObj(this.diaData).then(response => {
          if(response.status === 200) {
            this.$notify({
                  title: '成功',
                  message: '密钥配置成功',
                  type: 'success',
                  duration: 2000
                })
            this.dialogFormVisible = false
            this.getList()
          }
        })
      },
      updateSubmit() {
        putObj(this.id, this.diaData).then(response => {
          if(response.status === 200) {
            this.$notify({
                  title: '成功',
                  message: '密钥配置成功',
                  type: 'success',
                  duration: 2000
                })
            this.dialogFormVisible = false
            this.getList()
          }
        })
      },
      // toogleStatus(item) {
      //   let authStatus = item.authStatus === 0 ? 1 : 0
      //   let params = {
      //     authStatus: authStatus
      //   }
      //   putObj(item.appAuthyId, params).then(response => {
      //     console.log(response.data)
      //     this.getList()
      //   })
      // }
    }
  }
</script>

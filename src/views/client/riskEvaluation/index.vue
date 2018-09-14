<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <el-form label-position="right" label-width="100px">
        <el-row :gutter="20">
          <el-col :xs="24" :sm="12" :md="12" :lg="8" :xl="8">
            <el-form-item label="搜索">
              <el-input
                placeholder="搜索客户姓名、编号"
                prefix-icon="el-icon-search"
                v-model="listQuery.name">
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="12" :lg="8" :xl="8">
            <el-form-item label="手机号">
              <el-input
                placeholder="搜索客户手机号"
                prefix-icon="el-icon-search"
                v-model="listQuery.mobile">
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="12" :lg="8" :xl="8">
            <el-form-item label="风险等级">
              <el-select class="filter-item" v-model="listQuery.riskTestGrade" placeholder="请选择风险等级">
                <el-option v-for="item in customerRiskLevel" :key="item.value" :value="item.value" :label="item.label">
                  <span style="float: left">{{ item.value }}</span>
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row style="text-align: center;">
          <el-button class="search_btn" @click="handleFilter"><svg-icon icon-class="search"></svg-icon> 查询</el-button>
          <el-button class="search_btn" @click="resetFilter"><svg-icon icon-class="reset"></svg-icon> 重置</el-button>
        </el-row>
      </el-form>
    </div>
    <el-table :key='tableKey' :data="list" v-loading="listLoading" element-loading-text="给我一点时间" border fit
              highlight-current-row style="width: 100%" @expand-change="ExpandHandle" row-key>
      <el-table-column type="expand">
        <template slot-scope="scope">
          <v-child-table :riskTestId="riskTestId"></v-child-table>
        </template>
      </el-table-column>
      <el-table-column align="center" label="客户编号">
        <template slot-scope="scope">
          <span>
            {{scope.row.clientNo}}
          </span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="客户名称">
        <template slot-scope="scope">
        <span>{{scope.row.name}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="客户手机号" class-name="toggle">
        <template slot-scope="scope">
          <span>{{scope.row.mobile}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="风险等级">
        <template slot-scope="scope">
          <span>{{scope.row.riskTestGrade}}</span>
          <!-- <span>{{scope.row.riskTestGrade|turnText1(customerRiskLevel)}}</span> -->
        </template>
      </el-table-column>
      <!-- <el-table-column align="center" label="操作" fixed="right" width="150">
        <template slot-scope="scope">
          <a size="small" class="common_btn"
                     @click="handleUpdate(scope.row, 'view')">查看
          </a>
        </template>
      </el-table-column> -->

    </el-table>

    <div v-show="!listLoading" class="pagination-container">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                     :current-page.sync="listQuery.page"
                     :page-sizes="[10,20,30, 50]" :page-size="listQuery.limit"
                     layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>
  </div>
</template>

<script>
  import { getRiskEvalList } from '@/api/client/client'
  import waves from '@/directive/waves/index.js' // 水波纹指令
  import { parseTime, transformText } from '@/utils'
  import { mapGetters } from 'vuex'
  import VChildTable from './childTable'

  export default {
    filters: {
      parseTime (time) {
        if(!time) return
        let date = new Date(time)
        return parseTime(date)
      }
    },
    directives: {
      waves
    },
    components: {
      VChildTable
    },
    data() {
      return {
        list: null,
        total: null,
        listLoading: true,
        listQuery: {
          page: 1,
          limit: 20
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
        riskTestId: ''
      }
    },
    computed: {
      ...mapGetters([
        'permissions',
        'customerRiskLevel',
        'lockStatus'
      ])
    },
    created() {
      // this.handlePosition()
      this.getList()
      this.sys_user_add = this.permissions['sys_user_add']
      this.sys_user_upd = this.permissions['sys_user_upd']
      this.sys_user_del = this.permissions['sys_user_del']
    },
    methods: {
      getList() {
        this.listLoading = true
        // this.listQuery.orderByField = '`user`.create_time'
        this.listQuery.isAsc = false
        // this.handlePosition()
        getRiskEvalList(this.listQuery).then(response => {
          this.list = response.data.records
          this.total = response.data.total
          this.listLoading = false
        })
      },
      handleFilter() {
        this.listQuery.page = 1
        this.getList()
      },
      handleSizeChange(val) {
        this.listQuery.limit = val
        this.getList()
      },
      handleCurrentChange(val) {
        this.listQuery.page = val
        this.getList()
      },
      resetTemp() {
        this.form = {
          id: undefined,
          username: '',
          password: '',
          role: undefined
        }
      },
      resetFilter() { // 重置搜索条件
        this.listQuery = {
          page: 1,
          limit: 20,
          username: '',
          positionId: '',
          status: ''
        },
        this.entryDate = []
        this.handleFilter()
      },
      ExpandHandle(row) {
        this.riskTestId = row.riskTestId
      }
    }
  }
</script>

<style lang="scss" scoped>
.el-select,
.el-date-editor {
  width: 100%;
}
</style>


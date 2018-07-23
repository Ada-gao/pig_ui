<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <el-form label-position="right" label-width="80px">
        <el-row :gutter="20">
          <el-col :xs="24" :sm="12" :md="12" :lg="8" :xl="8">
            <el-form-item label="部门">
              <el-select class="filter-item"
                         placeholder="请选择部门"
                         v-model="listQuery.positionsId">
                <el-option v-for="item in departs"
                           :value="item.id"
                           :label="item.name"
                           :key="item.id">
                  <span style="float: left;">{{item.name}}</span>
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="12" :lg="8" :xl="8">
            <el-form-item label="职位">
              <el-select class="filter-item"
                         placeholder="请选择职位"
                         v-model="listQuery.positionsId">
                <el-option v-for="item in positions"
                           :value="item.positionId"
                           :label="item.positionName"
                           :key="item.positionId">
                  <span style="float: left;">{{item.positionName}}</span>
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="12" :lg="8" :xl="8">
            <el-form-item label="职级">
              <el-select class="filter-item"
                         placeholder="请选择职级"
                         v-model="listQuery.positionsId">
                <el-option v-for="item in level"
                           :value="item.positionId"
                           :label="item.positionName"
                           :key="item.positionId">
                  <span style="float: left;">{{item.positionName}}</span>
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row style="text-align: center;">
          <el-button class="search_btn" @click="resetFilter">
            <svg-icon icon-class="reset"></svg-icon>
            重置
          </el-button>
          <el-button class="search_btn" @click="handleFilter">
            <svg-icon icon-class="search"></svg-icon>
            查询
          </el-button>
        </el-row>
      </el-form>
    </div>

    <div style="text-align: right;">
      <el-button class="add_btn" @click="handleCreate">
        <svg-icon icon-class="add"></svg-icon>新增指标
      </el-button>
      <el-button class="add_btn" @click="handleImport">
        <svg-icon icon-class="upload"></svg-icon>批量导入
      </el-button>
      <el-button class="add_btn" @click="handleExport">
        <svg-icon icon-class="upload"></svg-icon>批量导出
      </el-button>
    </div>
    <el-table :data="list"
              elment-loading="给我一点时间"
              border fit
              highlight-current-row
              style="width: 100%"
              v-loading="listLoading">
      <el-table-column align="center" label="周期">
        <template slot-scope="scope">
          <span>{{scope.row.username}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="部门">
        <template slot-scope="scope">
          <span>{{scope.row.deptName}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="职位">
        <template slot-scope="scope">
          <span>{{scope.row.positionId}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="职级">
        <template slot-scope="scope">
          <span>{{scope.row.roleList[0].roleDesc}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="业绩指标" :render-header="tableHeader">
        <template slot-scope="scope">
          <span>
            {{scope.row.roleList[0].roleDesc}}
          </span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" fixed="right" width="150">
        <template slot-scope="scope">
          <a size="small"
             @click="handleUpdate(scope.row, 'edit')"
             class="common_btn">编辑</a>
          <span class="space_line"> | </span>
          <a size="small"
             class="common_btn"
             @click="handleUpdate(scope.row, 'del')">删除</a>
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
  </div>
</template>
<script>
  import {
    getPerformList,
    getAllPositon,
    // getAllRank,
    getAllDeparts
  } from '@/api/achievement'
  export default {
    components: {},
    data() {
      return {
        list: null,
        total: null,
        listLoading: true,
        listQuery: {
          page: 1,
          limit: 20
        },
        departs: [], // 部门
        positions: [], // 职位
        level: [] // 职级
      }
    },
    created() {
      this.getAllSearch()
      this.getList()
    },
    methods: {
      tableHeader(h, { column, $index }) {
        return h('span', [
          h('span', column.label),
          h('i', {
            'class': {
              'el-icon-sort-down': true,
              'ml5': true
            },
            'on': {
              click: this.theadClick
            }
          })
        ])
      },
      theadClick() { // 业绩指标排序事件
        console.log(11111)
      },
      getList() {
        this.listLoading = true
        getPerformList(this.listQuery).then(res => {
          this.list = res.data.records
          this.total = res.data.total
          this.listLoading = false
        })
      },
      getDeparts() { // 获取部门列表
        getAllDeparts().then(res => {
          this.departs = res.data
        })
      },
      getPosition() { // 获取职位列表
        getAllPositon().then(res => {
          this.positions = res.data
        })
      },
      getLevels() { // 获取职级列表
        getAllPositon().then(res => {
          this.level = res.data
        })
      },
      getAllSearch() {
        this.getDeparts()
        this.getPosition()
        this.getLevels()
      },
      handleFilter() { // search
        this.listQuery.page = 1
        this.getList()
      },
      resetFilter() { // reset
        this.listQuery = {
          page: 1,
          limit: 20,
          positionId: ''
        }
        this.handleFilter()
      },
      handleCreate() {},
      handleImport() {},
      handleExport() {},
      handleUpdate(row, state) {
      },
      handleSizeChange(val) {
        this.listQuery.limit = val
        this.getList()
      },
      handleCurrentChange(val) {
        this.listQuery.page = val
        this.getList()
      }
    }
  }
</script>
<style lang="scss" scoped>
  .filter-container {
    .filter-item {
      display: block;
    }
  }
</style>

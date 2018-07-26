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
      <el-button class="search_btn" @click="handleImport">
        <svg-icon icon-class="upload"></svg-icon>批量导入
      </el-button>
      <el-button class="search_btn" @click="handleExport">
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
      <el-table-column align="center"
                       label="业绩指标"
                       :render-header="tableHeader">
        <template slot-scope="scope">
          <span>
            {{scope.row.roleList[0].roleDesc}}
          </span>
        </template>
      </el-table-column>
      <el-table-column align="center"
                       label="操作"
                       fixed="right"
                       width="150">
        <template slot-scope="scope">
          <a size="small"
             @click="handleUpdate(scope.row, 'edit')"
             class="common_btn">编辑</a>
          <!--<span class="space_line"> | </span>-->
          <a size="small"
             class="danger_btn"
             @click="handleUpdate(scope.row, 'del')">删除</a>
        </template>
      </el-table-column>
    </el-table>
    <div v-show="!listLoading" class="pagination-container">
      <el-pagination @size-change="handleSizeChange"
                     @current-change="handleCurrentChange"
                     :current-page.sync="listQuery.page"
                     :page-sizes="[10,20,30, 50]"
                     :page-size="listQuery.limit"
                     layout="total, sizes, prev, pager, next, jumper"
                     :total="total">
      </el-pagination>
    </div>
    <!--新建和编辑业绩指标-->
    <el-dialog :title="textMap[dialogStatus]"
               class="perform_dialog"
               @close="cancel('form')"
               :visible.sync="dialogCreate">
      <el-form :model="form"
               ref="form"
               :rules="rules1"
               label-width="100px">
        <el-row>
          <el-col>
            <el-form-item label="周期" prop="period">
              <el-date-picker
                v-model="form.period"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期">
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col>
            <el-form-item label="部门" prop="id">
              <el-select class="filter-item"
                         placeholder="请选择部门"
                         multiple
                         v-model="form.id">
                <el-option v-for="item in departs"
                           :value="item.id"
                           :label="item.name"
                           :key="item.id">
                  <span style="float: left;">{{item.name}}</span>
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col>
            <el-form-item label="职位" prop="positionId">
              <el-select class="filter-item"
                         placeholder="请选择职位"
                         multiple
                         v-model="form.positionId">
                <el-option v-for="item in positions"
                           :value="item.positionId"
                           :label="item.positionName"
                           :key="item.positionId">
                  <span style="float: left;">{{item.positionName}}</span>
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col>
            <el-form-item label="职级" prop="rank">
              <el-select class="filter-item"
                         placeholder="请选择职级"
                         multiple
                         v-model="form.rank">
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
        <el-row>
          <el-col>
            <el-form-item label="业绩指标" prop="amount">
              <el-input v-model.number="form.amount"
                        class="width95"
                        type="number"
                        placeholder="请输入业绩指标"></el-input>万
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button class="search_btn" @click="cancel('form')">取 消</el-button>
        <el-button class="add_btn" v-if="dialogStatus=='create'" @click="create('form')">确 定</el-button>
        <el-button class="add_btn" v-else @click="update('form')">修 改</el-button>
      </div>
    </el-dialog>
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
        form: {},
        textMap: {
          edit: '编辑业绩指标',
          create: '新建业绩指标'
        },
        dialogStatus: '',
        dialogCreate: false,
        // dialogEdit: false,
        rules1: {
          period: [
            { required: true, message: '请选择周期', trigger: 'blur' }
          ],
          id: [
            { required: true, message: '请选择部门', trigger: 'blur' }
          ],
          positionId: [
            { required: true, message: '请选择职位', trigger: 'blur' }
          ],
          rank: [
            { required: true, message: '请选择职级', trigger: 'blur' }
          ],
          amount: [
            { required: true, message: '请输入业绩指标', trigger: 'blur' }
          ]
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
      handleCreate() {
        this.resetTemp()
        this.dialogStatus = 'create'
        this.dialogCreate = true
      },
      resetTemp() {
        this.form = {
          period: [],
          id: [],
          positionId: [],
          rank: [],
          amount: null
        }
      },
      handleImport() {
        this.$router.push({ path: '/achievement/importExcel' })
      },
      handleExport() {},
      handleUpdate(row, state) {
        this.dialogStatus = 'edit'
        console.log(row)
        if (state === 'edit') {
          this.dialogCreate = true
        } else if (state === 'del') {
          console.log(222)
        }
      },
      handleSizeChange(val) {
        this.listQuery.limit = val
        this.getList()
      },
      handleCurrentChange(val) {
        this.listQuery.page = val
        this.getList()
      },
      cancel(formName) {
        this.dialogCreate = false
        this.$refs[formName].resetFields()
      },
      create(formName) {
        const set = this.$refs
        console.log(this.form)
        set[formName].validate(valid => {
          if (valid) {
            this.dialogCreate = false
          }
        })
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
  .perform_dialog {
    .el-form-item__content {
      width: calc(100% - 100px);
      .el-range-editor.el-input__inner,
      .el-select,
      .width95 {
        width: 95%;
      }
    }
  }
</style>

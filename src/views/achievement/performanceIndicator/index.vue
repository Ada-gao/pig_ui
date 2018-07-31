<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <el-form label-position="right" label-width="80px">
        <el-row :gutter="20">
          <el-col :xs="24" :sm="12" :md="12" :lg="8" :xl="8">
            <!--<el-form-item label="部门">-->
              <!--<el-select class="filter-item"-->
                         <!--placeholder="请选择部门"-->
                         <!--v-model="listQuery.deptId">-->
                <!--<el-option v-for="item in departs"-->
                           <!--:value="item.id"-->
                           <!--:label="item.name"-->
                           <!--:key="item.id">-->
                  <!--<span style="float: left;">{{item.name}}</span>-->
                <!--</el-option>-->
              <!--</el-select>-->
            <!--</el-form-item>-->
            <el-form-item label="部门">
              <el-cascader
                style="width: 100%"
                :options="departs"
                :props="defaultProps"
                :show-all-levels="false"
                change-on-select
                v-model="deptId"
              ></el-cascader>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="12" :lg="8" :xl="8">
            <el-form-item label="职位">
              <el-select class="filter-item"
                         placeholder="请选择职位"
                         @change="handlePosition"
                         v-model="listQuery.positionId">
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
                         v-model="listQuery.rankId">
                <el-option v-for="item in level"
                           :value="item.rankId"
                           :label="item.rankName"
                           :key="item.rankId">
                  <span style="float: left;">{{item.rankName}}</span>
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
      <el-button v-if="sys_prd_type_add"
                 class="add_btn"
                 @click="handleCreate">
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
          <span>{{scope.row.start}}—{{scope.row.end}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="部门">
        <template slot-scope="scope">
          <span>{{scope.row.deptName}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="职位">
        <template slot-scope="scope">
          <span>{{scope.row.positionName}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="职级">
        <template slot-scope="scope">
          <span>{{scope.row.rankName}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center"
                       label="业绩指标"
                       :render-header="tableHeader">
        <template slot-scope="scope">
          <span>
            {{scope.row.performanceIndicator}}
          </span>
        </template>
      </el-table-column>
      <el-table-column align="center"
                       label="操作"
                       fixed="right"
                       width="150">
        <template slot-scope="scope">
          <a size="small"
             v-if="sys_prd_type_upd"
             @click="handleUpdate(scope.row.performanceIndicatorId)"
             class="common_btn">编辑</a>
          <!--<span class="space_line"> | </span>-->
          <a size="small"
             v-if="sys_prd_type_upd"
             class="danger_btn"
             @click="deletes(scope.row.performanceIndicatorId)">删除</a>
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
               @click="cancel('form')"
               @close="close"
               :visible.sync="dialogCreate">
      <el-form :model="form"
               ref="form"
               :rules="rules1"
               label-width="100px">
        <el-row>
          <el-col class="inline-col">
            <el-form-item label="周期" prop="start">
              <el-date-picker
                v-model="form.start"
                placeholder="选择开始时间"
                type="date">
              </el-date-picker>
            </el-form-item>
            <span class="sepa">-</span>
            <el-form-item prop="end" class="inline-item">
              <el-date-picker
                v-model="form.end"
                placeholder="选择结束时间"
                type="date">
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col>
            <el-form-item label="部门" prop="deptId">
              <el-cascader
                style="width: 95%"
                :options="departs"
                :props="defaultProps"
                :show-all-levels="false"
                v-if="dialogStatus === 'edit'"
                @blur="blurhandler"
                change-on-select
                v-model="tempDeptId"
              ></el-cascader>
              <div v-else>
                <el-cascader
                  style="width:95%"
                  :options="departs"
                  :show-all-level="false"
                  change-on-select
                  placeholder=""
                  @blur="blurhandler"
                  :props="defaultProps1"
                  v-model="selectedOptions"
                  @change="addOption"></el-cascader>
                <div class="tags">
                  <el-tag
                    :key="tag"
                    v-for="(tag, index) in form.deptId"
                    closable
                    :disable-transitions="false"
                    @close="handleClose(index)">
                    {{tag}}
                  </el-tag>
                </div>
              </div>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col>
            <el-form-item label="职位" prop="positionId">
              <el-select class="filter-item"
                         placeholder="请选择职位"
                         @change="handlePosition"
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
            <el-form-item label="职级" prop="rankId">
              <el-select class="filter-item"
                         placeholder="请选择职级"
                         :multiple="dialogStatus === 'create'"
                         v-model="form.rankId">
                <el-option v-for="item in level"
                           :value="item.rankId"
                           :label="item.rankName"
                           :key="item.rankId">
                  <span style="float: left;">{{item.rankName}}</span>
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col>
            <el-form-item label="业绩指标" prop="performanceIndicator">
              <el-input v-model.number="form.performanceIndicator"
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
  import { mapGetters } from 'vuex'
  import { parseTime } from '@/utils'
  import {
    getPfList,
    getAllPositon,
    getAllRank,
    getAllDeparts,
    delPfItem,
    editPfItem,
    addPfItem,
    putPfItem,
    exportPf
  } from '@/api/achievement'
  export default {
    components: {},
    data() {
      return {
        list: null,
        total: null,
        listLoading: true,
        defaultProps: {
          children: 'children',
          label: 'name',
          value: 'id'
        },
        defaultProps1: {
          children: 'children',
          label: 'name',
          value: 'name'
        },
        listQuery: {
          page: 1,
          limit: 20
        },
        deptId: [],
        selectedOptions: [],
        tempDeptId: [],
        form: {
          deptId: []
        },
        tempForm: {},
        textMap: {
          edit: '编辑业绩指标',
          create: '新建业绩指标'
        },
        dialogStatus: '',
        dialogCreate: false,
        rules1: {
          start: [
            { required: true, message: '请选择开始时间', trigger: 'blur' }
          ],
          end: [
            { required: true, message: '请选择结束时间', trigger: 'blur' }
          ],
          deptId: [
            { required: true, message: '请选择部门', trigger: 'blur' }
          ],
          positionId: [
            { required: true, message: '请选择职位', trigger: 'blur' }
          ],
          rankId: [
            { required: true, message: '请选择职级', trigger: 'blur' }
          ],
          performanceIndicator: [
            { required: true, message: '请输入业绩指标', trigger: 'blur' }
          ]
        },
        departs: [], // 部门
        positions: [], // 职位
        level: [], // 职级
        curPrevId: '', // 循环前累计拼接的id
        result: [],
        eachIndex: 0
      }
    },
    computed: {
      ...mapGetters([
        'permissions'
      ])
    },
    created() {
      this.getAllSearch()
      this.getList()
      this.sys_prd_type_add = this.permissions['sys_prd_type_add']
      this.sys_prd_type_upd = this.permissions['sys_prd_type_upd']
      this.sys_prd_type_del = this.permissions['sys_prd_type_del']
    },
    methods: {
      blurhandler() {
        console.log(3333333)
      },
      cycleList(list) {
        list.forEach(item => {
          if (item.children && !item.children.length) {
            delete item.children
          }
          if (item.children && item.children.length) {
            this.cycleList(item.children)
          }
        })
      },
      cycleListId(list, prevId = []) {
        list.forEach(item => {
          if (item.children && item.children.length > 0) {
            this.curPrevId = [...prevId, item.id]
            this.cycleListId(item.children, this.curPrevId)
          }
          if (item.children && !item.children.length) {
            this.result[this.eachIndex] = [...prevId, item.id]
            this.eachIndex++
          }
        })
      },
      handleClose(index) {
        console.log(index)
        this.form.deptId.splice(index, 1)
      },
      addOption(value) {
        console.log(value)
        this.selectedOptions = []
        this.form.deptId.push(value[value.length - 1])
      },
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
        // console.log(11111)
      },
      getList() {
        this.listLoading = true
        getPfList(this.listQuery).then(res => {
          this.list = res.data.records
          this.total = res.data.total || 0
          this.listLoading = false
          this.list.map((item, index) => {
            item.start = parseTime(item.start, '{y}-{m}-{d}')
            item.end = parseTime(item.end, '{y}-{m}-{d}')
          })
        })
      },
      getDeparts() { // 获取部门列表
        getAllDeparts().then(res => {
          this.departs = res.data
          this.cycleList(this.departs)
          this.cycleListId(this.departs)
          console.log(this.result)
        })
      },
      getPosition() { // 获取职位列表
        getAllPositon().then(res => {
          this.positions = res.data
        })
      },
      handlePosition(val) {
        if (val) {
          getAllRank({ positionId: val }).then(res => {
            this.level = res.data
          })
        }
      },
      getAllSearch() {
        this.getDeparts()
        this.getPosition()
      },
      handleFilter() { // search
        this.listQuery.page = 1
        if (this.deptId.length) {
          this.listQuery.deptId = this.deptId[this.deptId.length - 1]
        }
        this.getList()
      },
      resetFilter() { // reset
        this.listQuery = {
          page: 1,
          limit: 20,
          positionId: undefined,
          rankId: undefined,
          deptId: undefined
        }
        this.deptId = []
        this.handleFilter()
      },
      handleCreate() {
        this.resetTemp()
        console.log(this.form)
        this.dialogStatus = 'create'
        this.dialogCreate = true
      },
      resetTemp() {
        this.form = {
          deptId: [],
          end: undefined,
          performanceIndicator: undefined,
          positionId: undefined,
          rankId: [],
          start: undefined
        }
      },
      handleImport() {
        this.$router.push({ path: '/achievement/importExcel' })
      },
      handleExport() {
        exportPf().then(res => {
          // const blob = new Blob([res.data], { type: 'blob' })
          // const objectUrl = URL.createObjectURL(blob)
          // this.forceDownload(objectUrl, 'test.xlsx')
        })
      },
      forceDownload(url, name) {
        const link = document.createElement('a')
        link.href = url
        link.download = name
        link.click()
      },
      handleUpdate(id) {
        this.dialogStatus = 'edit'
        this.form = {}
        this.tempDeptId = []
        editPfItem(id).then(res => {
          this.form = res.data
          this.tempDeptId.push(this.form.deptId)
          this.handlePosition(this.form.positionId)
          console.log(this.departs)
          this.cycleListId(this.departs)
          console.log(this.result)
          this.dialogCreate = true
        })
      },
      deletes(id) {
        this.$confirm('此操作将永久删除这条数据, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          delPfItem(id).then(res => {
            if (res.status === 200) {
              this.getList()
              this.$notify({
                title: '成功',
                message: '删除成功',
                type: 'success',
                duration: 2000
              })
            }
          }).catch(() => {
            this.$notify({
              title: '失败',
              message: '删除失败',
              type: 'error',
              duration: 2000
            })
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
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
      cancel(formName) {
        this.dialogCreate = false
        this.form.deptId = []
        this.$refs[formName].resetFields()
      },
      close() {
        if (this.dialogStatus === 'edit') {
          this.form = {}
        }
      },
      create(formName) {
        const set = this.$refs
        this.form.start = parseTime(this.form.start, '{y}-{m}-{d}')
        this.form.end = parseTime(this.form.end, '{y}-{m}-{d}')
        if (Number(new Date(this.form.end)) < Number(new Date(this.form.start))) {
          this.$notify({
            title: '失败',
            message: '结束时间要大于开始时间',
            type: 'error',
            duration: 2000
          })
          return false
        }
        const temp = JSON.parse(JSON.stringify(this.form))
        temp.deptId = temp.deptId[0]
        console.log(temp)
        set[formName].validate(valid => {
          if (valid) {
            addPfItem(temp).then(res => {
              if (res.status === 200) {
                this.dialogCreate = false
                this.getList()
                this.$notify({
                  title: '成功',
                  type: 'success',
                  duration: 2000,
                  message: '创建成功'
                })
              }
              this.form.deptId = []
            }).catch(() => {
              this.dialogCreate = false
              this.form.deptId = []
              this.$notify({
                title: '失败',
                message: '创建失败',
                type: 'error',
                duration: 2000
              })
            })
          } else {
            return false
          }
        })
      },
      update(formName) {
        const set = this.$refs
        console.log(this.form)
        this.form.start = parseTime(this.form.start, '{y}-{m}-{d}')
        this.form.end = parseTime(this.form.end, '{y}-{m}-{d}')
        if (Number(new Date(this.form.end)) < Number(new Date(this.form.start))) {
          this.$notify({
            title: '失败',
            message: '结束时间要大于开始时间',
            type: 'error',
            duration: 2000
          })
          return false
        }
        this.form.deptId = this.tempDeptId[this.tempDeptId.length - 1]
        set[formName].validate(valid => {
          if (valid) {
            putPfItem(this.form.performanceIndicatorId, this.form).then(res => {
              if (res.status === 200) {
                this.dialogCreate = false
                this.getList()
                this.$notify({
                  title: '成功',
                  type: 'success',
                  duration: 2000,
                  message: '创建成功'
                })
              }
              this.form.deptId = []
              this.$refs[formName].resetFields()
            }).catch(() => {
              this.dialogCreate = false
              this.$refs[formName].resetFields()
              this.form.deptId = []
              this.$notify({
                title: '失败',
                message: '创建失败',
                type: 'error',
                duration: 2000
              })
            })
          } else {
            return false
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
  .inline-col {
    .el-form-item {
      display: inline-block;
    }
    .sepa {
      margin: 0 48px;
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
  .tags {
    position: absolute;
    top: 0;
  }
</style>

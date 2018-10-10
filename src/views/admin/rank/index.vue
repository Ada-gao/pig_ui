<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" placeholder="职级名称"
                v-model="listQuery.name">
      </el-input>
      <el-button class="filter-item search_btn" v-waves icon="search" @click="handleFilter"><svg-icon icon-class="search"></svg-icon> 查询</el-button>
      <el-button v-if="sys_position_add" class="filter-item add_btn" style="margin-left: 10px; float: right;" @click="handleCreate" icon="edit">
        <svg-icon icon-class="add"></svg-icon>新增职级</el-button>
    </div>

    <el-table :key='tableKey' :data="list" v-loading="listLoading" element-loading-text="给我一点时间" border fit
              highlight-current-row style="width: 100%">

      <el-table-column align="center" label="职位">
         <template slot-scope="scope">
          <span>{{scope.row.positionName}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="职级名称">
        <template slot-scope="scope">
          <span>{{scope.row.rankName}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="操作">
        <template slot-scope="scope">
          <a v-if="sys_position_edit" size="small" class="common_btn"
             @click="handleUpdate(scope.row)">编辑
          </a>
          <span v-if="sys_position_edit && sys_position_del" class="space_line"> | </span>
          <a v-if="sys_position_del" size="small" class="danger_btn_noline"
             @click="deletes(scope.row)">删除
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

    <el-dialog :title="textMap[dialogStatus]"
               @close="close"
               :visible.sync="dialogFormVisible">
      <el-form :model="form"
               ref="form"
               :rules="rules"
               label-width="100px">
        <el-form-item label="职位"
                      prop="positionId"
                      style="width:95%">
          <el-select class="filter-item"
                     placeholder="请选择职位"
                     style="width:100%"
                     v-model="form.positionId">
            <el-option v-for="item in positions"
                       :value="item.positionId"
                       :label="item.positionName"
                       :key="item.positionId">
              <span style="float: left;">{{item.positionName}}</span>
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="职级" prop="rankName" style="width:95%">
          <el-input v-model.trim="form.rankName" placeholder="请输入职级名称"></el-input>
        </el-form-item>

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
    getRankList,
    addRank,
    delRankById,
    putRankById } from '@/api/rank'
  import { getAllPositon } from '@/api/achievement'
  import waves from '@/directive/waves/index.js' // 水波纹指令
  import { mapGetters } from 'vuex'
  import ElRadioGroup from 'element-ui/packages/radio/src/radio-group'
  import ElOption from "element-ui/packages/select/src/option"
  import { transformText1 } from '@/utils'

  export default {
    components: {
      ElOption,
      ElRadioGroup },
    name: 'table_user',
    directives: {
      waves
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
        rules: {
          positionId: [
            { required: true, trigger: 'blur', message: '请选择职位' }
          ],
          rankName: [
            { required: true, trigger: 'blur', message: '请输入职级名称' }
          ]
        },
        form: {},
        dialogFormVisible: false,
        dialogStatus: '',
        textMap: {
          update: '编辑职级',
          create: '新增职级'
        },
        tableKey: 0,
        positions: [],
        posiFlag: false // 是否已经获取过职位信息，避免重复调接口
      }
    },
    computed: {
      ...mapGetters([
        'permissions'
      ])
    },
    created() {
      this.getList()
      this.sys_position_add = this.permissions['sys_position_add']
      this.sys_position_edit = this.permissions['sys_position_edit']
      this.sys_position_del = this.permissions['sys_position_del']
    },
    methods: {
      getList() {
        this.listLoading = true
        getRankList(this.listQuery).then(response => {
          this.list = response.data.records
          this.total = response.data.total
          this.listLoading = false
        })
      },
      handleFilter() {
        this.listQuery.page = 1
        if (!this.listQuery.name) {
          delete this.listQuery.name
        }
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
      handleCreate() {
        this.dialogStatus = 'create'
        if (!this.posiFlag) {
          this.getPosition()
        }
        this.dialogFormVisible = true
      },
      close() {
        this.resetTemp()
      },
      handleUpdate(row) {
        // this.form = row
        this.form.rankId = row.rankId
        this.form.rankName = row.rankName
        this.form.positionId = row.positionId
        this.form.positionName = row.positionName
        this.dialogFormVisible = true
        this.dialogStatus = 'update'
        if (!this.posiFlag) {
          this.getPosition()
        }
      },
      create(formName) {
        const set = this.$refs
        set[formName].validate(valid => {
          if (valid) {
            this.dialogFormVisible = false
            // this.form.positionId
            this.form.positionName = transformText1(this.form.positionId, this.positions)
            addRank(this.form).then(res => {
              if (res.status === 200) {
                this.getList()
                this.$notify({
                  title: '成功',
                  message: '创建成功',
                  type: 'success',
                  duration: 2000
                })
                this.resetTemp()
                this.$refs[formName].resetFields()
              }
            }).catch(() => {
              this.resetTemp()
              this.$refs[formName].resetFields()
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
      cancel(formName) {
        this.dialogFormVisible = false
        this.resetTemp()
        this.$refs[formName].resetFields()
      },
      update(formName) {
        const set = this.$refs
        set[formName].validate(valid => {
          if (valid) {
            putRankById(this.form).then(res => {
              if (res.status === 200) {
                this.getList()
                this.$notify({
                  title: '成功',
                  message: '修改成功',
                  type: 'success',
                  duration: 2000
                })
                this.dialogFormVisible = false
                this.resetTemp()
                this.$refs[formName].resetFields()
              }
            }).catch(() => {
              // this.resetTemp()
              // this.$refs[formName].resetFields()
              // this.$notify({
              //   title: '失败',
              //   message: '修改失败',
              //   type: 'error',
              //   duration: 2000
              // })
            })
          } else {
            return false
          }
        })
      },
      deletes(row) {
        this.$confirm('此操作将永久删除该职级( ' + row.positionName + ' ), 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          delRankById(row.rankId).then(res => {
            if (res.status === 200) {
              this.getList()
              this.$notify({
                title: '成功',
                message: '删除成功',
                type: 'success',
                duration: 2000
              })
            }
          })
        })
      },
      resetTemp() {
        this.form = {
          rankName: '',
          postionId: undefined,
          positionName: ''
        }
      },
      getPosition() {
        getAllPositon().then(res => {
          this.posiFlag = true
          this.positions = res.data
        })
      }
    }
  }
</script>

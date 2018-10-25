<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <el-form label-position="right" label-width="96px">
        <el-row :gutter="20">
            <el-col :xs="24" :sm="12" :md="12" :lg="8" :xl="8">
                <el-form-item label="预约编号">
                  <el-input class="filter-item"
                            v-model="listQuery.appointmentcode"
                            clearable
                            placeholder="请输入预约编号"></el-input>
                </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12" :md="12" :lg="8" :xl="8">
                <el-form-item label="理财师姓名">
                  <el-input class="filter-item"
                            clearable
                            v-model="listQuery.username"
                            placeholder="请输入理财师姓名"></el-input>
                </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12" :md="12" :lg="8" :xl="8">
                <el-form-item label="理财师工号">
                  <el-input class="filter-item"
                            clearable
                            v-model="listQuery.usercode"
                            placeholder="请输入理财师工号"></el-input>
                </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12" :md="12" :lg="8" :xl="8">
                <el-form-item label="销售支持姓名">
                  <el-input class="filter-item"
                            clearable
                            v-model="listQuery.salesname"
                            placeholder="请输入销售支持姓名"></el-input>
                </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12" :md="12" :lg="8" :xl="8">
                <el-form-item label="销售支持工号">
                  <el-input class="filter-item"
                            clearable
                            v-model="listQuery.salescode"
                            placeholder="请输入销售支持工号"></el-input>
                </el-form-item>
            </el-col>

            <el-col :xs="24" :sm="12" :md="12" :lg="8" :xl="8">
                <el-form-item label="佣金比例">
                  <el-input class="filter-item"
                            clearable
                            v-model="listQuery.commissionrate"
                            placeholder="请输入佣金比例"></el-input>
                </el-form-item>
            </el-col>
        </el-row>
        <el-row style="text-align: center;">
          <el-button class="search_btn" @click="handleFilter">
            <svg-icon icon-class="search"></svg-icon>
            查询
          </el-button>
          <el-button class="search_btn" @click="resetFilter">
            <svg-icon icon-class="reset"></svg-icon>
            重置
          </el-button>
        </el-row>
      </el-form>
    </div>

    <div v-if="sales_support_add"  style="text-align: right;">
      <el-button class="add_btn" @click="handleCreate">
        <svg-icon icon-class="add" style="margin-right: 5px;"></svg-icon>新增销售支持
      </el-button>
      <el-button class="search_btn" @click="handleImport">
        <svg-icon icon-class="upload" style="margin-right: 5px;"></svg-icon>批量导入
      </el-button>
    </div>
    <el-table :data="list"
              elment-loading="给我一点时间"
              border fit
              highlight-current-row
              style="width: 100%"
              v-loading="listLoading">

      <el-table-column align="center" label="预约编号">
        <template slot-scope="scope">
          <span>{{scope.row.appointmentCode}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="理财师姓名">
        <template slot-scope="scope">
          <span>{{scope.row.userName}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="理财师工号">
        <template slot-scope="scope">
          <span>{{scope.row.userCode}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="销售支持姓名">
        <template slot-scope="scope">
          <span>{{scope.row.salesName}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center"
                      label="销售支持工号"
                      :render-header="tableHeader">
        <template slot-scope="scope">
          <span>
            {{scope.row.salesCode}}
          </span>
        </template>
      </el-table-column>

      <el-table-column align="center"
                  label="佣金比例"
                  :render-header="tableHeader">
          <template slot-scope="scope">
              <span>{{scope.row.commissionRate}}</span>
          </template>
      </el-table-column>

      <el-table-column align="center"
                       label="操作"
                       fixed="right"
                       width="150">
        <template slot-scope="scope">
          <a v-if="sales_support_edit" size="small"
             @click="handleUpdate(scope.row, 'edit')"
             class="common_btn">编辑</a>
          <!--<span class="space_line"> | </span>-->
          <a v-if="sales_support_delete" size="small"
             class="danger_btn"
             @click="deletes(scope.row)">删除</a>
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
               @close="close('form')"
               :visible.sync="dialogCreate">
      <el-form :model="form"
               ref="form"
               :rules="rules1"
               label-width="106px">

        <el-row :gutter="20">

          <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
            <el-form-item label="预约编号" prop="appointmentCode">
              <el-input v-if="dialogStatus==='create'" v-model="form.appointmentCode"
                        type="text"
                        placeholder="请输入预约编号" @change="getPlanner(form.appointmentCode)"></el-input>
              <span v-else>{{form.appointmentCode}}</span>
            </el-form-item>
          </el-col>

          <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
            <el-form-item label="佣金比例" prop="commissionRate">
              <el-input v-model.number="form.commissionRate"
                        type="text"
                        placeholder="请输入佣金比例"></el-input>
            </el-form-item>
          </el-col>

          <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
            <el-form-item label="理财师姓名" prop="userName">
              <el-select v-if="dialogStatus==='create'" class="filter-item"
                         value-key="empNo"
                         style="width: 100%;"
                         placeholder="请输入理财师姓名"
                         v-model="user"
                         filterable
                         @change="userNameChange">
                <el-option v-for="(item, index) in financialPlannerList"
                           :value="item"
                           :label="item.name"
                           :key="item.empNo">
                  <span style="float: left;">{{item.name}}</span>
                </el-option>
              </el-select>
              <span v-else>{{form.userName}}</span>
            </el-form-item>
            <!-- <el-form-item label="理财师姓名" prop="userName">
              <el-select v-if="dialogStatus==='create'" class="filter-item"
                         value-key="empNo"
                         style="width: 100%;"
                         placeholder="请输入理财师姓名"
                         v-model="form.userName"
                         filterable
                         @change="userNameChange">
                <el-option v-for="(item, index) in financialPlannerList"
                           :value="item"
                           :label="item.name"
                           :key="item.empNo">
                  <span style="float: left;">{{item.name}}</span>
                </el-option>
              </el-select>
              <span v-else>{{form.userName}}</span>
            </el-form-item> -->
          </el-col>

          <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
            <el-form-item label="理财师工号" prop="userCode">
              <el-input v-if="dialogStatus==='create'" v-model="form.userCode" placeholder="请输入理财师工号"></el-input>
              <span v-else>{{form.userCode}}</span>
            </el-form-item>
          </el-col>

          <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
            <el-form-item label="销售支持姓名" prop="salesLongName">
              <el-select v-if="dialogStatus==='create'"
                         class="filter-item"
                         value-key="userId"
                         filterable
                         style="width:100%;"
                         placeholder="请输入销售支持姓名"
                         v-model="form.salesLongName"
                         @change="salesNameChange">
                <el-option v-for="(item, index) in salesSupportList"
                           :value="item"
                           :label="item.name"
                           :key="item.userId">
                  <span style="float: left;">{{item.name}}</span>
                </el-option>
              </el-select>
              <span v-else>{{form.salesName}}</span>
            </el-form-item>
          </el-col>

          <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
            <el-form-item label="销售支持工号" prop="salesCode">
              <el-input v-if="dialogStatus==='create'" v-model="form.salesCode" placeholder="请输入销售支持工号"></el-input>
              <span v-else>{{form.salesCode}}</span>
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
    getSalesSupportList,
    getSalesSupport,
    addSalesSupport,
    updateSalesSupport,
    deleteSalesSupport

  } from '@/api/achievement'
  import {
    getPlannerList // 查询理财师列表
    // getDirectSupervisorList // 销售支持列表(目前这个方法查询的是所有员工))
  } from '@/api/user'
  import { getPlannerByAptCode } from '@/api/transc/transc'
  import { mapGetters } from 'vuex'
  export default {
    components: {},
    data() {
      const validDateRate = (rule, value, cb) => {
        if (!value) {
          cb('请输入佣金比例')
        }
        if (Number(value) > 1) {
          cb(new Error('佣金比例不能大于1'))
        } else {
          cb()
        }
      }
      return {
        list: null,
        total: null,
        listLoading: true,
        listQuery: {
          page: 1,
          limit: 20,
          orderByField: 'create_time',
          isAsc: false
        },
        form: {},
        userInfo: null,
        salesInfo: null,
        textMap: {
          edit: '编辑销售支持',
          create: '新增销售支持'
        },
        dialogStatus: '',
        dialogCreate: false,
        // dialogEdit: false,
        rules1: {
          appointmentCode: [
            { required: true, message: '请输入订单编号', trigger: 'blur' }
          ],
          commissionRate: [
            { required: true, validator: validDateRate, trigger: 'blur,change' }
          ],
          salesCode: [
            { required: true, message: '请输入销售支持工号', trigger: 'blur' }
          ],
          salesLongName: [
            { required: true, message: '请选择销售支持姓名', trigger: 'blur' }
          ],
          userCode: [
            { required: true, message: '请输入理财师工号', trigger: 'blur' }
          ],
          userName: [
            { required: true, message: '请选择理财师姓名', trigger: 'blur' }
          ]
        },
        financialPlannerList: [], // 所有理财师列表
        salesSupportList: [], // 所有销售支持列表
        user: {
          name: '',
          empNo: ''
        }
      }
    },
    computed: {
      ...mapGetters([
        'permissions'
      ])
    },
    created() {
      this.getList()
      this.getUserLists()
      this.sales_support_add = this.permissions['sales_support_add']
      this.sales_support_edit = this.permissions['sales_support_edit']
      this.sales_support_delete = this.permissions['sales_support_delete']
    },
    methods: {
      userNameChange(newVal) {
        console.log(newVal)
        const item = this.financialPlannerList.find((ite) => {
          return ite.empNo === newVal.empNo
        })
        this.form.userCode = item.empNo
        this.form.userName = item.name
      },
      salesNameChange(newVal) {
        this.salesSupportList = this.salesSupportList.slice(0)
        const item = this.salesSupportList.find((ite) => {
          return ite.empNo === newVal.empNo
        })
        this.form.salesCode = item.empNo
        this.form.salesLongName = item.name
      },
      getUserLists() {
        getPlannerList({ status: 0 }).then(res => {
          if (res.status === 200) {
            this.financialPlannerList = JSON.parse(JSON.stringify(res.data))
            this.financialPlannerList.map(item => {
              item.deptName ? (item.name = item.name + '(' + item.deptName + ')') : item.name
            })
            this.salesSupportList = JSON.parse(JSON.stringify(res.data))
            this.salesSupportList.map(item => {
              item.deptName ? (item.name = item.name + '(' + item.deptName + ')') : item.name
            })
          }
        })
        // getDirectSupervisorList().then(res => {
        //   this.salesSupportList = res.data
        //   this.salesSupportList.map(item => {
        //     item.deptName ? (item.name = item.name + '(' + item.deptName + ')') : item.name
        //   })
        // })
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
        getSalesSupportList(this.listQuery).then(res => {
          this.list = res.data.records
          this.total = res.data.total
          this.listLoading = false
        })
      },
      handleFilter() { // search
        this.listQuery.page = 1
        // 查询时某一项value值为空时，删除对应的key
        for (let k in this.listQuery) {
          if (!this.listQuery[k]) {
            delete this.listQuery[k]
          }
        }
        this.getList()
      },
      resetFilter() { // reset
        this.listQuery = {
          page: 1,
          limit: 20,
          appointmentcode: undefined,
          username: undefined,
          usercode: undefined,
          salesname: undefined,
          salescode: undefined,
          commissionrate: undefined,
          orderByField: 'create_time',
          isAsc: false
        }
        this.getList()
      },
      handleCreate() {
        this.dialogStatus = 'create'
        this.dialogCreate = true
      },
      resetTemp() {
        this.form = {
          appointmentCode: undefined,
          commissionRate: undefined,
          salesCode: undefined,
          salesName: undefined,
          userCode: undefined,
          userName: undefined
        }
      },
      handleImport() {
        this.$router.push({ path: '/achievement/importSaleSupportExcel' })
      },
      handleExport() {},
      handleUpdate(row, state) {
        this.resetTemp()
        this.dialogStatus = 'edit'
        if (state === 'edit') {
          this.dialogCreate = true
          getSalesSupport(row.salesSupportId).then(res => {
            this.form = {
              salesSupportId: res.data.salesSupportId,
              appointmentCode: res.data.appointmentCode,
              commissionRate: res.data.commissionRate,
              salesCode: res.data.salesCode,
              salesName: res.data.salesName,
              userCode: res.data.userCode,
              userName: res.data.userName
            }
            this.userInfo = this.financialPlannerList.find((ite) => {
              return ite.empNo === res.data.userCode
            })
            this.salesInfo = this.salesSupportList.find((ite) => {
              return ite.empNo === res.data.salesCode
            })
          })
        } else if (state === 'del') {
          console.log('删除')
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
      close(formName) {
        this.dialogCreate = false
        this.user = {}
        this.$refs[formName].resetFields()
      },
      cancel(formName) {
        this.close(formName)
      },
      create(formName) {
        const set = this.$refs
        console.log(this.form)
        console.log(set[formName])
        set[formName].validate(valid => {
          console.log(valid)
          if (valid) {
            this.form.salesName = this.form.salesLongName.split('(')[0]
            this.form.userName = this.form.userName.split('(')[0]
            addSalesSupport(this.form).then(res => {
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
              this.resetTemp()
              this.$refs[formName].resetFields()
            }).catch(() => {
              this.dialogCreate = true
              // this.resetTemp()
              // this.$refs[formName].resetFields()
              // this.$notify({
              //   title: '失败',
              //   message: '创建失败',
              //   type: 'error',
              //   duration: 2000
              // })
            })
          } else {
            return false
          }
        })
      },
      update(formName) {
        const set = this.$refs
        this.form.salesName = this.form.salesName.split('(')[0]
        this.form.userName = this.form.userName.split('(')[0]
        set[formName].validate(valid => {
          if (valid) {
            this.dialogCreate = false
            updateSalesSupport(this.form).then(res => {
              if (res.status === 200) {
                this.dialogCreate = false
                this.getList()
                this.$notify({
                  title: '成功',
                  type: 'success',
                  duration: 2000,
                  message: '修改成功'
                })
              }
              this.resetTemp()
              this.$refs[formName].resetFields()
            }).catch(() => {
              this.dialogCreate = false
              this.resetTemp()
              this.$refs[formName].resetFields()
              this.$notify({
                title: '失败',
                message: '修改失败',
                type: 'error',
                duration: 2000
              })
            })
          } else {
            return false
          }
        })
      },
      deletes(row) {
        this.$confirm('确认删除该订单 ( ' + row.appointmentCode + ' ) 吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deleteSalesSupport(row.salesSupportId).then(res => {
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
      getPlanner(code) {
        getPlannerByAptCode(code).then(res => {
          this.user = res.data
          this.form.userCode = res.data.empNo
          this.form.userName = res.data.name
          // this.user.name = res.data.name
          // this.user.empNo = res.data.empNo
          // this.form.userName = [res.data.name]
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

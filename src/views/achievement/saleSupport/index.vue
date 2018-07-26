<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <el-form label-position="right" label-width="96px">
        <el-row :gutter="20">
            <el-col :xs="24" :sm="12" :md="12" :lg="8" :xl="8">
                <el-form-item label="订单编号">
                  <el-input class="filter-item" v-model="appointmentcode" placeholder="请输入订单编号"></el-input>
                </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12" :md="12" :lg="8" :xl="8">
                <el-form-item label="理财师姓名">
                  <el-input class="filter-item" v-model="username" placeholder="请输入理财师姓名"></el-input>
                </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12" :md="12" :lg="8" :xl="8">
                <el-form-item label="理财师编号">
                  <el-input class="filter-item" v-model="usercode" placeholder="请输入理财师编号"></el-input>
                </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12" :md="12" :lg="8" :xl="8">
                <el-form-item label="销售支持姓名">
                  <el-input class="filter-item" v-model="salesname" placeholder="请输入销售支持姓名"></el-input>
                </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12" :md="12" :lg="8" :xl="8">
                <el-form-item label="销售支持编号">
                  <el-input class="filter-item" v-model="salescode" placeholder="请输入销售支持编号"></el-input>
                </el-form-item>
            </el-col>

            <el-col :xs="24" :sm="12" :md="12" :lg="8" :xl="8">
                <el-form-item label="佣金比例">
                  <el-input class="filter-item" v-model="commissionrate" placeholder="请输入佣金比例"></el-input>
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

    <div v-if="sales_support_add"  style="text-align: right;">
      <el-button class="add_btn" @click="handleCreate">
        <svg-icon icon-class="add"></svg-icon>新增销售支持
      </el-button>
    </div>
    <el-table :data="list"
              elment-loading="给我一点时间"
              border fit
              highlight-current-row
              style="width: 100%"
              v-loading="listLoading">

      <el-table-column align="center" label="订单编号">
        <template slot-scope="scope">
          <span>{{scope.row.appointmentCode}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="理财师姓名">
        <template slot-scope="scope">
          <span>{{scope.row.userName}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="理财师编号">
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
                      label="销售支持编号"
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
               label-width="106px">

        <el-row :gutter="20">

          <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
            <el-form-item label="订单编号" prop="appointmentcode">
              <el-input v-model="form.appointmentcode"
                        type="text"
                        placeholder="请输入订单编号"></el-input>
            </el-form-item>
          </el-col>

          <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
            <el-form-item label="佣金比例" prop="commissionrate">
              <el-input v-model.number="form.commissionrate"
                        type="text"
                        placeholder="请输入佣金比例"></el-input>
            </el-form-item>
          </el-col>

          <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
            <el-form-item label="理财师姓名" prop="username">
              <el-select class="filter-item"
                         style="width:100%;"
                         placeholder="请输入理财师姓名"
                         v-model="form.username">
                <el-option v-for="item in usernameList"
                           :value="item.username"
                           :label="item.username"
                           :key="item.positionId">
                  <span style="float: left;">{{item.username}}</span>
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
            <el-form-item label="理财师编号" prop="usercode">
              <el-input v-model="form.usercode" readonly="readonly" placeholder="请输入理财师编号"></el-input>          
            </el-form-item>
          </el-col>

          <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
            <el-form-item label="销售支持姓名" prop="salesname">
              
              <el-select class="filter-item"
                         style="width:100%;"
                         placeholder="请输入销售支持姓名"
                         v-model="form.salesname">
                <el-option v-for="item in salesnameList"
                           :value="item.salesname"
                           :label="item.salesname"
                           :key="item.positionId">
                  <span style="float: left;">{{item.salesname}}</span>
                </el-option>
              </el-select>

            </el-form-item>
          </el-col>

          <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
            <el-form-item label="销售支持编号" prop="amount">
              <el-input v-model="form.parentId" readonly="readonly" placeholder="请输入销售支持编号"></el-input>
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
    getAllDeparts,

    getSalesSupportList,
    getSalesSupport,
    updateSalesSupport,
    deleteSalesSupport

  } from '@/api/achievement'
  import {
    getPlannerList, // 查询理财师列表
    getDirectSupervisorList // 销售支持列表(目前这个方法查询的是所有员工))
  } from '@/api/user'
  import { mapGetters } from 'vuex'
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
        form: {
          salesSupportId: '',
          appointmentCode: '',
          commissionRate: '',
          salesCode: '',
          salesName: '',
          userCode: '',
          userName: ''
        },
        textMap: {
          edit: '编辑销售支持',
          create: '新增销售支持'
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
        level: [], // 职级
        appointmentcode: '', // 订单编号
        username: '', // 理财师姓名
        usercode: '', // 理财师编号
        salesname: '', // 销售支持姓名
        salescode: '', // 销售支持编号
        commissionrate: '', // 佣金比例

        financialPlanner: [], // 所有理财师列表
        salesSupportList: [], // 所有销售支持列表
      }
    },
    	computed: {
      ...mapGetters([
        'permissions',
      ]),
      queryProps: function(){
        return {
          page:this.listQuery.page,
          limit:this.listQuery.limit,
          appointmentcode: this.appointmentcode,
          username: this.username, 
          usercode: this.usercode, 
          salesname: this.salesname, 
          salescode: this.salescode, 
          commissionrate: this.commissionrate,
        }
      }
    },
    created() {
      this.getAllSearch()
      this.getList()
      this.sales_support_add = this.permissions['sales_support_add']
      this.sales_support_edit = this.permissions['sales_support_edit']
      this.sales_support_delete = this.permissions['sales_support_delete']
    },
    methods: {
      getUsers(){
        getPlannerList().then(function(res){
          console.log(res)
        })
        getDirectSupervisorList().then(function(res){
          console.log(res)
        })
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
        console.log(11111)
      },
      getList() {
        this.listLoading = true
        getSalesSupportList(this.listQuery).then(res => {
          this.list = res.data.records
          this.total = res.data.total
          this.listLoading = false
        })
      },
      getListByProps() {
        getSalesSupportList(this.queryProps).then(res => {
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
        this.getListByProps()
      },
      resetFilter() { // reset
        this.listQuery = {
          page: 1,
          limit: 20,
          positionId: ''
        }
        this.appointmentcode = ''
        this.username = ''
        this.usercode = ''
        this.salesname = ''
        this.salescode = ''
        this.commissionrate = ''

        this.getList()
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
      handleImport() {},
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

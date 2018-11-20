<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <el-form label-width="80px">
        <el-form-item label="搜索">
          <el-col :span="6">
            <el-input @keyup.enter.native="handleFilter()"  class="filter-item" placeholder="请输入银行名称"
                      v-model="listQuery.bankName">
            </el-input>
          </el-col>
          <el-col class="line" :span="0.8">&nbsp;</el-col>
          <el-button class="filter-item search_btn" v-waves icon="search" @click="handleFilter"><svg-icon icon-class="search"></svg-icon>查询</el-button>

          <el-button v-if="sys_currency_add" class="filter-item add_btn" style="margin-left: 10px; float: right" @click="handleCreate" type="primary" icon="edit">
            <svg-icon icon-class="add"></svg-icon> 新增银行名称</el-button>
        </el-form-item>
      </el-form>
    </div>

    <el-table :key='tableKey' :data="list" v-loading="listLoading" element-loading-text="给我一点时间" border fit
              highlight-current-row style="width: 100%">
      <el-table-column align="center" label="银行名称">
        <template slot-scope="scope">
          <span>{{scope.row.bankName}}</span>
        </template>
      </el-table-column>
      <!--<el-table-column align="center" label="操作">-->
        <!--<template slot-scope="scope">-->
          <!--<a size="small" class="common_btn"-->
             <!--@click="handleView(scope.row)">查看-->
          <!--</a>-->
          <!--<span v-if="!scope.row.used && sys_currency_upd" class='vertical-line'></span>-->
          <!--<a v-if="!scope.row.used  && sys_currency_upd" size="small" class="common_btn"-->
             <!--@click="handleUpdate(scope.row)">编辑-->
          <!--</a>-->
          <!--<a v-if="!scope.row.used && sys_currency_del" size="small" class="danger_btn"-->
             <!--@click="deletes(scope.row)">删除-->
          <!--</a>-->
        <!--</template>-->
      <!--</el-table-column>-->

    </el-table>
    <div v-show="!listLoading" class="pagination-container">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                     :current-page.sync="listQuery.page"
                     :page-sizes="[10,20,30, 50]" :page-size="listQuery.limit"
                     layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" @close="handleClose('form')">
      <el-form :model="form" ref="form" label-width="100px" :rules="rules">

        <el-form-item label="银行名称" prop="name">
          <el-input v-model="form.bankName"></el-input>
        </el-form-item>
        <!--  <el-form-item label="币种汇率" prop="name">
           <el-input v-model="form.name"></el-input>
         </el-form-item> -->

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
  import { getBankName, addBankName } from '@/api/bankname'
  import waves from '@/directive/waves/index.js' // 水波纹指令
  import { mapGetters } from 'vuex'

  export default {
    name: 'bankname',
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
          limit: 10
        },
        form: {
          bankName: undefined
        },
        dialogFormVisible: false,
        userAdd: false,
        userUpd: false,
        userDel: false,
        dialogStatus: '',
        textMap: {
          update: '编辑银行名称',
          create: '新增银行名称'
        },
        tableKey: 0,
        rules: {
          bankName: [
            { required: true, message: '请输入银行名称' }
          ]
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
      this.sys_currency_add = this.permissions['sys_currency_add']
      this.sys_currency_upd = this.permissions['sys_currency_upd']
      this.sys_currency_del = this.permissions['sys_currency_del']
    },
    methods: {
      getList() {
        this.listLoading = true
        getBankName(this.listQuery).then(response => {
          if (response.status === 200) {
            this.list = response.data.records
            this.total = response.data.total
            this.listLoading = false
          }
        })
      },
      handleFilter() {
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
        this.resetTemp()
        this.dialogStatus = 'create'
        this.dialogFormVisible = true
      },
      create(formName) {
        const set = this.$refs
        set[formName].validate(valid => {
          if (valid) {
            const self = this.list.some(item => {
              return item.bankName === this.form.bankName
            })
            if (self) {
              this.$notify({
                title: '警告',
                message: '银行名称已存在',
                type: 'warning'
              })
              return false
            }
            addBankName(this.form)
              .then(() => {
                this.dialogFormVisible = false
                this.getList()
                this.$notify({
                  title: '成功',
                  message: '创建成功',
                  type: 'success',
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
        this.$refs[formName].resetFields()
      },
      resetTemp() {
        this.form = {
          bankName: ''
        }
      },
      handleClose(formName) {
        this.$refs[formName].resetFields()
      }
    }
  }
</script>
<style lang="scss" scoped>
  .vertical-line {
    width: 1px;
    height: 14px;
    background-color: #8F8F8F;
    display: inline-block;
    content: '';
    margin: 0 5px;
    vertical-align: text-bottom;
  }
</style>

<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
    <el-form label-width="80px">
      <el-form-item label="搜索">
        <el-col :span="6">
          <el-input @keyup.enter.native="handleFilter()"  class="filter-item" placeholder="请输入币种"
                    v-model="listQuery.name">
          </el-input>
        </el-col>
        <el-col class="line" :span="0.8">&nbsp</el-col>
        <el-button class="filter-item search_btn" v-waves icon="search" @click="handleFilter"><svg-icon icon-class="search"></svg-icon>查询</el-button>

        <el-button v-if="sys_currency_add" class="filter-item add_btn" style="margin-left: 10px; float: right" @click="handleCreate" type="primary" icon="edit">
          <svg-icon icon-class="add"></svg-icon> 新增币种</el-button>
        </el-form-item>
      </el-form>
    </div>

    <el-table :key='tableKey' :data="list" v-loading="listLoading" element-loading-text="给我一点时间" border fit
              highlight-current-row style="width: 100%">
      <el-table-column align="center" label="币种名称">
        <template slot-scope="scope">
          <span>{{scope.row.name}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作">
        <template slot-scope="scope">
         <a size="small" class="common_btn"
                     @click="handleView(scope.row)">查看
          </a>
          <span v-if="!scope.row.used" class='vertical-line'></span>
          <a v-if="!scope.row.used" size="small" class="common_btn"
                     @click="handleUpdate(scope.row)">编辑
          </a>
          <a v-if="!scope.row.used" size="small" class="danger_btn"
                     @click="deletes(scope.row)">删除
          </a>
        </template>
      </el-table-column>

    </el-table>


    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form :model="form" ref="form" label-width="100px" :rules="rules">
        
        <el-form-item label="币种名称" prop="name">
          <el-input v-model="form.name"></el-input>
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
  import { fetchCurrency, getObj, addObj, putObj, delObj ,getObjList} from '@/api/currency'
  import waves from '@/directive/waves/index.js' // 水波纹指令
  // import { parseTime } from '@/utils'
  import { mapGetters } from 'vuex'
  import ElRadioGroup from 'element-ui/packages/radio/src/radio-group'
  import ElOption from "element-ui/packages/select/src/option"

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
        treeDeptData: [],
        checkedKeys: [],
        defaultProps: {
          children: 'children',
          label: 'name'
        },
        list: null,
        total: null,
        listLoading: true,
        listQuery: {},
        form: {
          name: undefined,
          currencyId: undefined
        },
        statusOptions: ['0', '1'],
        dialogFormVisible: false,
        dialogDeptVisible: false,
        userAdd: false,
        userUpd: false,
        userDel: false,
        dialogStatus: '',
        isDisabled: {
          0: false,
          1: true
        },
        textMap: {
          update: '编辑币种',
          create: '新增币种'
        },
        tableKey: 0,
        rules: {
          name: [
           { required: true, message: '请输入币种名称' }
          ]
        }
      }
    },
    computed: {
      ...mapGetters([
        'permissions'
      ])
    },
    filters: {
      statusFilter(status) {
        const statusMap = {
          0: '有效',
          1: '无效',
          9: '锁定'
        }
        return statusMap[status]
      }
    },
    created() {
      this.getList()
      this.sys_currency_add = this.permissions['sys_currency_add']
      this.sys_currency_upd = this.permissions['sys_currency_upd']
      this.sys_currency_del = this.permissions['sys_currency_del']
    },
    methods: {
      getList() {
        this.listLoading = true;
        getObjList(this.listQuery).then(response => {
          if(response.status == 200){
            this.list = response.data;
            this.listLoading = false;
          }
         
        })
      },
      // getNodeData(data) {
      //   this.dialogDeptVisible = false
      //   this.form.deptId = data.id
      //   this.form.deptName = data.name
      // },
      handleDept() {
        fetchDeptTree()
          .then(response => {
            this.treeDeptData = response.data
            this.dialogDeptVisible = true
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
      // 查看
      handleView(row){
        this.$router.push({path: `/setting/currency/detail/${row.name}/${row.currencyId}`})
      },
      //编辑
      handleUpdate(row) {
        getObj(row.currencyId)
          .then(response => {
            this.form = response.data
            this.dialogFormVisible = true
            this.dialogStatus = 'update'
          })
      },
      create(formName) {
        const set = this.$refs
        set[formName].validate(valid => {
          if (valid) {
            let self = this.list.some(item=>{
               return item.name == this.form.name
            })
           if(self) return false;
            addObj(this.form)
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
      update(formName) {
        const set = this.$refs
        set[formName].validate(valid => {
          if (valid) {
            this.dialogFormVisible = false
            putObj(this.form).then(() => {
              this.dialogFormVisible = false
              this.getList()
              this.$notify({
                title: '成功',
                message: '修改成功',
                type: 'success',
                duration: 2000
              })
            })
          } else {
            return false
          }
        })
      },
      deletes(row) {
        this.$confirm('此操作将永久删除该用户(用户名:' + row.name + '), 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          delObj(row.currencyId).then(() => {
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
      resetTemp() {
        this.form = {
          id: undefined,
          name: '',
        }
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

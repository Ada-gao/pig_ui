<template>
  <div class="app-container calendar-list-container">
	 <div class="filter-container">
        <el-button v-if="sys_currency_add" class="filter-item add_btn" style="margin-left: 10px; float: right" @click="handleCreate" type="primary" icon="edit">
          <svg-icon icon-class="add"></svg-icon> 新增汇率</el-button>
    </div>
    <el-table :key='tableKey' :data="list" v-loading="listLoading" element-loading-text="给我一点时间" border fit
              highlight-current-row style="width: 100%">
      <el-table-column align="center" label="币种名称">
        <template slot-scope="scope">
          <span>{{scope.row.name}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="汇率时间">
        <template slot-scope="scope">
          <span>{{scope.row.time|parseTime('{y}-{m}-{d}')}}</span>
        </template>
      </el-table-column>
            <el-table-column align="center" label="汇率（对人民币）">
        <template slot-scope="scope">
          <span>{{scope.row.exchangeRate}}</span>
        </template>
      </el-table-column>

    </el-table>

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" @close="cancel('form')">
      <el-form :model="form" ref="form" label-width="100px" :rules="rules">
        <el-form-item label="币种名称" prop="name">
          <el-input v-model="form.name" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="汇率时间" prop="time">
          <el-date-picker type="date" placeholder="选择日期" v-model="form.time" style="width: 100%;"></el-date-picker>
        </el-form-item>
        <el-form-item label="汇率" prop="exchangeRate">
          <el-input v-model="form.exchangeRate"></el-input>
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button class="search_btn" @click="cancel('form')">取 消</el-button>
        <el-button class="add_btn" @click="create('form')">确 定</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
  import {getExchangeRateRnformation,addExchangeRate} from '@/api/currency'
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
      let checkNumber = (rule, value, callback)=>{
        let check = /^[1-9]\d{0,4}(\.\d{1,2})?$|^0\.0[1-9]$|^0\.[1-9][0-9]$/;
        if(!check.test(value)){
         return callback(new Error('请输入正确的汇率格式'));
        }else{
           callback();
        }
      }
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
        listQuery: {
          page: 1,
          limit: 20
        },
        form: {
        },
        name:'',
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
          create: '新增汇率'
        },
        tableKey: 0,
        rules: {
          name: [
           { required: true, message: '请输入币种名称' }
          ],
           time: [
           { required: true, message: '请输入汇率时间' }
          ],
           exchangeRate: [
           { required: true, message: '请输入汇率' },
           { validator: checkNumber, trigger: 'blur' }
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
      // parseTime(time){
      //   if (!time) return false
      // 	let date = new Date(time);
      //   let Y = date.getFullYear() + '-';
      //   let M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
      //   let D = date.getDate() + ' ';
      //   return Y+M+D;
      // }
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
        getExchangeRateRnformation(this.$route.params.id).then(response => {
          this.list = response.data
          this.listLoading = false
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
      handleCreate() {
      	this.form.name = this.$route.params.name
      	this.form.currencyId = this.$route.params.id
        //this.resetTemp()
        this.dialogStatus = 'create'
        this.dialogFormVisible = true
      },
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
            if (this.list.length && this.form.time < this.list[0].time) {
              this.$notify({
                title: '警告',
                message: '汇率时间应大于已有时间',
                type: 'warning'
              })
              return false
            }

            addExchangeRate(this.form)
              .then((res) => {
                if(res.data){
                  this.dialogFormVisible = false
                  this.getList()
                  this.$notify({
                    title: '成功',
                    message: '创建成功',
                    type: 'success',
                    duration: 2000
                  })
                }
              })
          } else {
            return false
          }
        })
      },
      cancel(formName) {
        this.dialogFormVisible = false
        this.$refs[formName].resetFields()
        this.resetTemp()
      },
      resetTemp() {
        this.form = {
          exchangeRate: '',
          time: '',
        }
      },
      conversionTime(timestamp){

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

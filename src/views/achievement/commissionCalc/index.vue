<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container" style="text-align: right">
      <!-- <el-input ="handleFilter" style="width: 200px;" class="filter-item" placeholder="用户名"
                v-model="listQuery.name">
      </el-input>
      <el-button class="filter-item" type="primary" v-waves icon="search" @click="handleFilter">搜索</el-button> -->
      <el-button v-if="template_upd" class="filter-item add_btn" style="margin-bottom: 0;" @click="handleCreate" type="primary" icon="edit">
        <svg-icon icon-class="add"></svg-icon> 新增模版</el-button>
    </div>

    <el-table :key='tableKey' :data="list" v-loading="listLoading" element-loading-text="给我一点时间" border fit
              highlight-current-row style="width: 100%">

      <el-table-column align="center" label="模版名称" prop="fieldsName" width="150">
        <template slot-scope="scope">
          <span>{{scope.row.templateName}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="字段" prop="fieldsKey" show-overflow-tooltip>
        <template slot-scope="scope">
          <span v-for="(item, index) in scope.row.fields">{{item.fieldsName}}<i v-show="index!=scope.row.fields.length-1">、</i></span>

        </template>
      </el-table-column>

      <el-table-column align="center" label="操作" width="150">
        <template slot-scope="scope">
          <a v-if="template_export" size="small" class="common_btn"
                     @click="handleExport(scope.row)">导出
          </a>
          <span class="space_line"> | </span>
          <a v-if="template_upd" size="small" class="common_btn"
                     @click="handleUpdate(scope.row)">编辑
          </a>
          <a v-if="template_del" size="small" class="danger_btn"
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

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form :model="form" :rules="rules" ref="form" label-width="100px">

        <el-form-item label="模板名称" prop="templateName">
          <el-input v-model="form.templateName" :maxlength="40"></el-input>
        </el-form-item>

      </el-form>
      <my-transfer v-model="value1"
        :data="data"
        :render-content="renderFunc"
        :titles="['系统字段', '已选字段']"
        @change="targetChange"
        @updata="updateData"></my-transfer>
      <div slot="footer" class="dialog-footer">
        <el-button class="search_btn" @click="cancel('form')">取 消</el-button>
        <el-button class="add_btn" v-if="dialogStatus=='create'" @click="create('form')">确 定</el-button>
        <el-button class="add_btn" v-else @click="update('form')">修 改</el-button>
      </div>
    </el-dialog>

    <el-dialog title="导出模板" :visible.sync="dialogTempVisible" @close="handleClose">
      <el-form :model="form1" ref="form1" label-width="100px">

        <el-form-item
          label="时间"
          prop="date"
          :rules="{
            required: true, message: '请选择时间', trigger: 'blur'
          }">
          <el-date-picker
            style="width:390px"
            v-model="form1.date"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期">
          </el-date-picker>
        </el-form-item>

        <el-form-item label="模版名称">
          <span>{{form1.templateName}}</span>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button class="search_btn" @click="dialogTempVisible=false">取 消</el-button>
        <el-button class="add_btn" @click="handleExportTemp()">确 定</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
  import MyTransfer from '@/components/MyTransfer'
  import { fetchList, addObj, putObj, getObj, getFeildsList, delObj, exportTemplate } from '@/api/achievement/commission'
  import waves from '@/directive/waves/index.js' // 水波纹指令
  import { parseTime } from '@/utils'
  import { mapGetters } from 'vuex'


  export default {
    components: {
      MyTransfer
    },
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
          limit: 20,
          // orderByField: 'create_time',
          // isAsc: false
        },
        form: {
          fields: [],
          fieldsName: ''
        },
        form1: {},
        statusOptions: ['0', '1'],
        dialogFormVisible: false,
        dialogTempVisible: false,
        userAdd: false,
        userUpd: false,
        userDel: false,
        dialogStatus: '',
        isDisabled: {
          0: false,
          1: true
        },
        textMap: {
          update: '编辑佣金计算模板',
          create: '新增佣金计算模板'
        },
        tableKey: 0,
        rules: {
          templateName: [
            {required: true, trigger: 'blur', message: '请输入40位以内的模板名称'}
          ]
        },
        value1: [],
        data: [],
        renderFunc(createElement, option) {
          return createElement(
            'span', option.fieldsName
          )
        },
        template_export: '',
        template_upd: '',
        template_del: ''
      }
    },
    computed: {
      ...mapGetters([
        'permissions'
      ])
    },
    created() {
      this.getList()
      this.template_export = this.permissions['template_export']
      this.template_upd = this.permissions['template_upd']
      this.template_del = this.permissions['template_del']
    },
    methods: {
      getList() {
        this.listLoading = true
        fetchList(this.listQuery).then(response => {
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
      handleCreate() {
        this.resetTemp()
        this.dialogStatus = 'create'
        this.dialogFormVisible = true
        getFeildsList().then(res => {
          this.data = res.data
        })
      },
      handleChange() { // 右侧列表值对应转换
        let temp = []
        this.value1.forEach((item, index) => {
          let i = this.data.find(it => it.fieldsKey === item)
          temp.push(i)
        })
        if(temp.some(item => item === undefined)) {
          this.form.fields = this.value1
        } else {
          this.form.fields = temp
        }
      },
      handleUpdate(row) { // 编辑：查询
        getObj(row.templateId)
          .then(response => {
            this.form = response.data
            this.value1 = []
            this.form.fields.forEach(item => {
              this.value1.push(item.fieldsKey)
            })
            this.dialogStatus = 'update'
            getFeildsList().then(res => {
              this.data = res.data
              this.dialogFormVisible = true
            })
          })
      },
      handleExport(row) {
        this.dialogTempVisible = true
        this.form1 = row
      },
      handleExportTemp() { // 确认导出文件
        this.$refs.form1.validate(valid => {
          if(valid) {
            const date = this.form1.date
            date[0] = parseTime(date[0], '{y}-{m}-{d}')
            date[1] = parseTime(date[1], '{y}-{m}-{d}')
            console.log(this.$refs.form1)
            exportTemplate(this.form1.templateId, {
              date: date
            }).then(res => {
              let fileName = decodeURI(res.headers['content-disposition'].split('=')[1]) // 导出时要decodeURI
              let objectUrl = URL.createObjectURL(new Blob([res.data]))
              this.forceDownload(objectUrl, fileName)
              this.dialogTempVisible = false
              this.form1.date = []
            })
          } else {
            return false
          }
        })
      },
      forceDownload(blob, filename) {
        const a = document.createElement('a')
        a.download = filename
        a.href = blob
        a.click()
      },
      create(formName) {
        this.handleChange()
        const set = this.$refs
        set[formName].validate(valid => {
          if (valid) {
            if(!this.form.fields.length) {
              this.$notify({
                title: '提示',
                message: '请至少选择一个字段',
                type: 'danger',
                duration: 2000
              })
              return
            }
            addObj(this.form)
              .then((res) => {
                if(res.status === 200) {
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
      },
      update(formName) {
        this.handleChange()
        const set = this.$refs
        set[formName].validate(valid => {
          if (valid) {
            if(!this.form.fields.length) {
              this.$notify({
                title: '提示',
                message: '请至少选择一个字段',
                type: 'failed',
                duration: 2000
              })
              return
            }
            this.dialogFormVisible = false
            putObj(this.form.templateId, this.form).then(() => {
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
        this.$confirm('确认删除该模版 ( ' + row.templateName + ' ) 吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          delObj(row.templateId).then(() => {
            this.getList()
            this.$notify({
              title: '成功',
              message: '删除成功',
              type: 'success',
              duration: 2000
            })
          })
        })
      },
      resetTemp() {
        this.form = {
          templateName: '',
          fields: [],
        }
        this.value1 = []
      },
      targetChange(value) {
        console.log(value)
      },
      updateData(data) { // 将组件内部的变化值传送到外面(确保拖拽的顺序)
        this.value1 = data
      },
      handleClose() {
        this.form1.date = []
        this.dialogTempVisible = false
      }
    }
  }
</script>

<template>
  <div class="app-container calendar-list-container">
    <!--<div class="filter-container" style="text-align:right;">-->
      <el-table :key="tableKey"
                v-loading="listLoading"
                element-loading-text="给我一点时间"
                border
                fit
                highlight-current-row
                style="width:100%"
                :data="list">
        <el-table-column label="冷静期时间（小时）" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.value}}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <a v-if="sys_prd_type_upd"
               size="small"
               @click="handleUpdate(scope.row)"
               class="common_btn">
              编辑
            </a>
          </template>
        </el-table-column>
      </el-table>

      <el-dialog title="编辑" :visible.sync="dialogFormVisible">
        <el-form :model="form" :rules="rules" ref="form" label-width="150px">

          <el-form-item label="冷静期时间" prop="value">
            <el-input v-model="form.value" style="width:90%"></el-input>小时
          </el-form-item>

        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button class="search_btn" @click="cancel('form')">取 消</el-button>
          <el-button class="add_btn" @click="update('form')">修 改</el-button>
        </div>
      </el-dialog>

    <!--</div>-->
  </div>
</template>
<script>
  import { mapGetters } from 'vuex'
  import { getComplaintMb, putComplaintMb } from '@/api/complaint'
  export default {
    data() {
      return {
        listLoading: true,
        list: null,
        dialogFormVisible: false,
        tableKey: 0,
        form: {},
        rules: {
          value: [
            {
              required: true,
              trigger: 'blur',
              message: '请输入冷静期时间'
            }
          ]
        }
      }
    },
    computed: {
      ...mapGetters([
        'permissions'
      ])
    },
    mounted() {
      this.sys_prd_type_upd = this.permissions['sys_prd_type_upd']
      this.getList()
    },
    methods: {
      getList() {
        this.listLoading = true
        this.list = null
        getComplaintMb('COOLING_OFF_PERIOD ').then(res => {
          if (res.status === 200) {
            this.listLoading = false
            this.list = [res.data]
          }
        })
      },
      cancel(formName) {
        this.dialogFormVisible = false
        this.$refs[formName].resetFields()
      },
      handleUpdate(row) {
        console.log(row)
        this.form = JSON.parse(JSON.stringify(row))
        console.log(this.form)
        this.dialogFormVisible = true
      },
      update(formName) {
        const set = this.$refs
        set[formName].validate(valid => {
          if (valid) {
            this.dialogFormVisible = false
            putComplaintMb('COOLING_OFF_PERIOD', this.form).then(res => {
              if (res.status === 200) {
                this.dialogFormVisible = false
                this.getList()
                this.$notify({
                  title: '成功',
                  message: '修改成功',
                  type: 'success',
                  duration: 2000
                })
              }
            }).catch(() => {
              this.dialogFormVisible = false
              this.getList()
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
      }
    }
  }
</script>

<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" placeholder="用户名"
                v-model="listQuery.username">
      </el-input>
      <el-button class="filter-item" type="primary" v-waves icon="search" @click="handleFilter">搜索</el-button>
      <el-button v-if="sys_user_add" class="filter-item" style="margin-left: 10px;" @click="handleCreate" type="primary" icon="edit">添加</el-button>
      <el-row :gutter="20">
        <el-col :xs="24" :sm="12" :md="12" :lg="8" :xl="8">
          <div class="grid-content bg-purple">
            搜索
            <el-input
              placeholder="搜索员工、手机号、工号"
              suffix-icon="el-icon-date"
              v-model="input2">
            </el-input>
          </div>
        </el-col>
        <el-col :xs="24" :sm="12" :md="12" :lg="8" :xl="8">
          <div class="grid-content bg-purple-light">
            职位
            <el-select class="filter-item" v-model="positionId" placeholder="请选择">
              <el-option v-for="item in sexOptions" :key="item.value" :value="item.value" :label="item.label">
                <span style="float: left">{{ item.label }}</span>
              </el-option>
            </el-select>
          </div>
        </el-col>
        <el-col :xs="24" :sm="12" :md="12" :lg="8" :xl="8">
          <div class="grid-content bg-purple">
            工作状态
            <el-select class="filter-item" v-model="delFlag" placeholder="请选择">
              <el-option v-for="item in sexOptions" :key="item.value" :value="item.value" :label="item.label">
                <span style="float: left">{{ item.label }}</span>
              </el-option>
            </el-select>
          </div>
        </el-col>
      <!-- </el-row> -->
      <!-- <el-row :gutter="10"> -->
        <el-col :xs="24" :sm="12" :md="12" :lg="8" :xl="8">
          <div class="grid-content bg-purple-light">
            入职时间
            <el-date-picker
              v-model="value13"
              type="daterange"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              :default-time="['00:00:00', '23:59:59']">
            </el-date-picker>
          </div>
        </el-col>
        <el-col :xs="24" :sm="12" :md="12" :lg="8" :xl="8">
          <div class="grid-content bg-purple-light">
            角色
            <el-select class="filter-item" v-model="role" placeholder="请选择">
              <el-option v-for="item in sexOptions" :key="item.value" :value="item.value" :label="item.label">
                <span style="float: left">{{ item.label }}</span>
              </el-option>
            </el-select>
          </div>
        </el-col>
      </el-row>
    </div>

    <el-table :key='tableKey' :data="list" v-loading="listLoading" element-loading-text="给我一点时间" border fit
              highlight-current-row style="width: 100%">

      <el-table-column align="center" label="序号">
        <template slot-scope="scope">
          <span>{{scope.row.userId}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="用户名">
        <template slot-scope="scope">
          <span>
            <img v-if="scope.row.avatar" class="user-avatar" style="width: 20px; height: 20px; border-radius: 50%;" :src="scope.row.avatar+'?imageView2/1/w/20/h/20'">
            {{scope.row.username}}
          </span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="所属部门" show-overflow-tooltip>
        <template slot-scope="scope">
        <span>{{scope.row.deptName}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="职位">
        <template slot-scope="scope">
          <span>{{scope.row.roleList[0].roleDesc}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="入职时间">
        <template slot-scope="scope">
          <span>{{scope.row.createTime | parseTime('{y}-{m}-{d} {h}:{i}')}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" class-name="status-col" label="状态">
        <template slot-scope="scope">
          <el-tag>{{scope.row.delFlag | statusFilter}}</el-tag>
        </template>
      </el-table-column>

      <el-table-column align="center" label="手机号" show-overflow-tooltip>
        <template slot-scope="scope">
        <span>{{scope.row.deptName}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="工号" show-overflow-tooltip>
        <template slot-scope="scope">
        <span>{{scope.row.empNo}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="操作" fixed="right">
        <template slot-scope="scope">
          <el-button v-if="sys_user_upd" size="small" type="success"
                     @click="handleUpdate(scope.row)">编辑
          </el-button>
          <el-button v-if="sys_user_del" size="small" type="danger"
                     @click="deletes(scope.row)">删除
          </el-button>
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

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogDeptVisible">
      <el-tree
        class="filter-tree"
        :data="treeDeptData"
        :default-checked-keys="checkedKeys"
        check-strictly
        node-key="id"
        highlight-current
        ref="deptTree"
        :props="defaultProps"
        @node-click="getNodeData"
        default-expand-all
      >
      </el-tree>
    </el-dialog>

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form :model="form" :rules="rules" ref="form" label-width="100px">
        
        <el-row :gutter="20">
          <el-col :span="11">
            <el-form-item label="姓名" prop="name">
              <el-input v-model="form.name" placeholder="请输入姓名"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="用户名" prop="username">
              <el-input v-model="form.username" placeholder="请输入用户名"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        
        <el-row :gutter="20">
          <el-col :span="11">
            <el-form-item label="工号" prop="empNo">
              <el-input v-model="form.empNo" placeholder="请输入工号"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="入职日期" prop="date">
              <el-date-picker
                v-model="employeeDate"
                type="date"
                placeholder="选择日期">
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        
        <el-row :gutter="20">
          <el-col :span="11">
            <el-form-item label="性别" prop="gender">
              <el-select class="filter-item" v-model="gender" placeholder="请选择">
                <el-option v-for="item in sexOptions" :key="item.value" :value="item.value" :label="item.label">
                  <span style="float: left">{{ item.label }}</span>
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="学历" prop="education">
              <el-select class="filter-item" v-model="education" placeholder="请选择">
                <el-option v-for="item in eduOptions" :key="item.value" :value="item.value" :label="item.label">
                  <span style="float: left">{{ item.label }}</span>
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        
        <el-row :gutter="20">
          <el-col :span="11">
            <el-form-item label="证件类型" prop="idType">
              <el-select class="filter-item" v-model="idType" placeholder="请选择">
                <el-option v-for="item in idTypeOptions" :key="item.value" :value="item.value" :label="item.label">
                  <span style="float: left">{{ item.label }}</span>
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="婚姻状况" prop="maritalStatus">
              <el-select class="filter-item" v-model="maritalStatus" placeholder="请选择">
                <el-option v-for="item in maritalStatusOptions" :key="item.value" :value="item.value" :label="item.label">
                  <span style="float: left">{{ item.label }}</span>
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        
        <el-row :gutter="20">
          <el-col :span="11">
            <el-form-item label="证件号码" prop="idNo">
              <el-input v-model="form.idNo" placeholder="请输入证件号码"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="手机号" prop="mobile">
              <el-input v-model="form.mobile"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        
        <el-row :gutter="20">
          <el-col :span="11">
            <el-form-item label="职位" prop="username">
              <!-- positionId -->
              <el-select class="filter-item" v-model="role" placeholder="请选择" @focus="handlePosition()">
                <el-option v-for="item in positionsOptions" :key="item.positionId" :label="item.positionName" :value="item.positionId" :disabled="isDisabled[item.delFlag]">
                  <span style="float: left">{{ item.positionName }}</span>
                  <!-- <span style="float: right; color: #8492a6; font-size: 13px">{{ item.roleCode }}</span> -->
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="角色" prop="role">
              <!-- role -->
              <el-select class="filter-item" v-model="role" placeholder="请选择">
                <el-option v-for="item in rolesOptions" :key="item.roleId" :label="item.roleDesc" :value="item.roleId" :disabled="isDisabled[item.delFlag]">
                  <span style="float: left">{{ item.roleDesc }}</span>
                  <span style="float: right; color: #8492a6; font-size: 13px">{{ item.roleCode }}</span>
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        
        <el-row :gutter="20">
          <el-col :span="11">
            <el-form-item label="部门" prop="deptName">
              <!-- deptId -->
              <el-input v-model="form.deptName" placeholder="选择部门" @focus="handleDept()" readonly></el-input>
              <input type="hidden" v-model="form.deptId"/>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="邮箱" prop="email">
              <el-input v-model="form.email"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        
        <el-row :gutter="20">
          <el-col :span="11">
            <el-form-item label="简历" prop="resumeUrl">
              <!-- <el-input v-model="form.role"></el-input> -->
              <el-upload
                class="upload-demo"
                action="https://jsonplaceholder.typicode.com/posts/"
                :on-preview="handlePreview"
                :on-remove="handleRemove"
                multiple
                :limit="3"
                :on-exceed="handleExceed"
                :file-list="fileList"
                :show-file-list="true"
                :before-upload="beforeUpload"
                accept="file">
                <el-button size="small" type="primary">上传简历</el-button>
                <!-- <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div> -->
              </el-upload>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="状态" v-if="dialogStatus == 'update' && sys_user_del " prop="delFlag" >
              <el-select class="filter-item" v-model="form.delFlag" placeholder="请选择">
                <el-option v-for="item in statusOptions" :key="item" :label="item | statusFilter" :value="item"> </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="22">
            <el-form-item label="备注" prop="remark">
              <el-input type="textarea" v-model="form.remark"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel('form')">取 消</el-button>
        <el-button v-if="dialogStatus=='create'" type="primary" @click="create('form')">确 定</el-button>
        <el-button v-else type="primary" @click="update('form')">修 改</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import { fetchList, getObj, addObj, putObj, delObj } from '@/api/user'
  import { deptRoleList, fetchDeptTree } from '@/api/role'
  import { getAllPositon } from '@/api/queryConditions'
  import waves from '@/directive/waves/index.js' // 水波纹指令
  // import { parseTime } from '@/utils'
  import { mapGetters } from 'vuex'
  import ElRadioGroup from 'element-ui/packages/radio/src/radio-group'
  import ElOption from "element-ui/packages/select/src/option"

  export default {
    components: {
      ElOption,
      ElRadioGroup 
    },
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
        listQuery: {
          page: 1,
          limit: 20
        },
        role: undefined,
        form: {
          name: 'rank',
          username: undefined,
          password: undefined,
          delFlag: undefined,
          deptId: undefined,
          empNo: 111081
        },
        rules: {
          username: [
            {
              required: true,
              message: '请输入账户',
              trigger: 'blur'
            },
            {
              min: 3,
              max: 20,
              message: '长度在 3 到 20 个字符',
              trigger: 'blur'
            }
          ],
          password: [
            {
              required: true,
              message: '请输入密码',
              trigger: 'blur'
            },
            {
              min: 5,
              max: 20,
              message: '长度在 5 到 20 个字符',
              trigger: 'blur'
            }
          ],
          deptId: [
            {
              required: true,
              message: '请选择部门',
              trigger: 'blur'
            }
          ],
          role: [
            {
              required: true,
              message: '请选择角色',
              trigger: 'blur'
            }
          ]
        },
        statusOptions: ['0', '1'],
        positionsOptions: [],
        rolesOptions: [],
        dialogFormVisible: false,
        dialogDeptVisible: false,
        userAdd: false,
        userUpd: false,
        userDel: false,
        dialogStatus: '',
        textMap: {
          update: '编辑员工',
          create: '新增员工'
        },
        isDisabled: {
          0: false,
          1: true
        },
        tableKey: 0,
        sexOptions: [
          {
            label: '男',
            value: 1
          }, {
            label: '女',
            value: 2
          }
        ],
        input2: '',
        gender: '',
        value13: '',
        eduOptions: [
          {
            label: '博士',
            value: 1
          }, {
            label: '硕士',
            value: 2
          }, {
            label: '本科',
            value: 3
          }, {
            label: '大专',
            value: 4
          }, {
            label: '高中',
            value: 5
          }, {
            label: '初中',
            value: 6
          }, {
            label: '小学',
            value: 7
          }
        ],
        education: '',
        idTypeOptions: [
          {
            label: '二代居民身份证',
            value: 1
          }, {
            label: '护照',
            value: 2
          }, {
            label: '军官证',
            value: 3
          }
        ],
        idType: '',
        employeeDate: '',
        maritalStatusOptions: [
          {
            label: '已婚',
            value: 1
          }, {
            label: '未婚',
            value: 2
          }, {
            label: '保密',
            value: 3
          }
        ],
        maritalStatus: '',
        fileList: [],
        positionId: '',
        delFlag: ''
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
          0: '在职',
          1: '离职',
          9: '锁定'
        }
        return statusMap[status]
      }
    },
    created() {
      // this.handlePosition()
      this.getList()
      this.sys_user_add = this.permissions['sys_user_add']
      this.sys_user_upd = this.permissions['sys_user_upd']
      this.sys_user_del = this.permissions['sys_user_del']
    },
    methods: {
      getList() {
        this.listLoading = true
        this.listQuery.orderByField = '`user`.create_time'
        this.listQuery.isAsc = false
        fetchList(this.listQuery).then(response => {
          this.list = response.data.records
          this.total = response.data.total
          this.listLoading = false
        })
      },
      getNodeData(data) {
        this.dialogDeptVisible = false
        this.form.deptId = data.id
        this.form.deptName = data.name
        deptRoleList(data.id)
          .then(response => {
            this.rolesOptions = response.data
          })
      },
      handlePosition() {
        getAllPositon().then(res => {
          this.positionsOptions = res.data
          console.log(res.data)
        })
      },
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
        this.resetTemp()
        this.dialogStatus = 'create'
        this.dialogFormVisible = true
      },
      handleUpdate(row) {
        getObj(row.userId)
          .then(response => {
            this.form = response.data
            this.form.name = 'jas',
            this.form.empNo = '11108',
            this.form.idNo = '11111111111111111111',
            this.form.mobile = '156235656565',
            this.form.email = '12@234234.com',
            this.role = row.roleList[0].roleId
            this.dialogFormVisible = true
            this.dialogStatus = 'update'
            deptRoleList(response.data.deptId)
              .then(response => {
                this.rolesOptions = response.data
              })
          })
      },
      create(formName) {
        const set = this.$refs
        this.form.role = this.role
        set[formName].validate(valid => {
          if (valid) {
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
        this.form.role = this.role
        set[formName].validate(valid => {
          if (valid) {
            this.dialogFormVisible = false
            this.form.password = undefined
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
        this.$confirm('此操作将永久删除该用户(用户名:' + row.username + '), 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          delObj(row.userId).then(() => {
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
          username: '',
          password: '',
          role: undefined
        }
      },
      handleRemove(file, fileList) {
        console.log(file, fileList);
      },
      handlePreview(file) {
        console.log(file);
      },
      handleExceed(files, fileList) {
        this.$message.warning(`当前限制选择 3 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
      },
      // beforeRemove(file, fileList) {
      //   return this.$confirm(`确定移除 ${ file.name }？`);
      // },
      beforeUpload(file) {
        console.log(file)
        const isFile = file.type === 'application/pdf'
        if (!isFile) {
          this.$message.error('只能上传pdf文档')
        }
        return isFile
      }
    }
  }
</script>

<style lang="scss" scoped>
.el-select,
.el-date-editor {
  width: 100%;
}
</style>


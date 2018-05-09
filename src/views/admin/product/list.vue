
<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <!-- <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" placeholder="用户名"
                v-model="listQuery.username">
      </el-input>
      <el-button class="filter-item" type="primary" v-waves icon="search" @click="handleFilter">搜索</el-button>
      <el-button v-if="sys_user_add" class="filter-item" style="margin-left: 10px;" @click="handleCreate" type="primary" icon="edit">添加</el-button> -->
      <el-row :gutter="20">
        <el-col :lg="2" class="query-title">产品名称</el-col>
        <el-col :md="12" :lg="6">
          <el-input
            placeholder="请输入产品名称"
            v-model="input2">
          </el-input>
        </el-col>
      </el-row>

      <el-row style="margin-top: 20px;">
        <el-col :lg="2" class="query-title">产品分类</el-col>
        <el-col :lg="20">
          <el-checkbox-group v-model="checkboxGroup1">
            <el-checkbox-button v-for="type in productTypes" :label="type" :key="type">{{type}}</el-checkbox-button>
          </el-checkbox-group>
        </el-col>
      </el-row>

      <el-row style="margin-top: 20px;">
        <el-col :lg="2" class="query-title">产品状态</el-col>
        <el-col :lg="21">
          <el-checkbox-group v-model="checkboxGroup2">
            <el-checkbox-button v-for="status in productStatus" :label="status" :key="status">{{status}}</el-checkbox-button>
          </el-checkbox-group>
        </el-col>
      </el-row>

      <el-row style="margin-top: 20px;">
        <el-col :lg="2" class="query-title">年化收益</el-col>
        <el-col :lg="20">
          <el-checkbox-group v-model="checkboxGroup3">
            <el-checkbox-button v-for="income in productIncome" :label="income" :key="income">{{income}}</el-checkbox-button>
          </el-checkbox-group>
        </el-col>
      </el-row>
      
      <el-row style="margin-top: 20px; text-align: center;">
        <el-button class="btn-padding">筛选</el-button>
        <el-button class="btn-padding">重置</el-button>
      </el-row>
    </div>

    <div style="text-align: right">
      <el-button v-if="sys_user_add" class="filter-item" style="margin-left: 10px;" @click="handleCreate" type="primary" icon="edit">添加</el-button>
    </div>
    <el-table :key='tableKey' :data="list" v-loading="listLoading" element-loading-text="给我一点时间" border fit
              highlight-current-row style="width: 100%;">

      <el-table-column align="center" label="产品ID">
        <template slot-scope="scope">
          <span>{{scope.row.userId}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="产品名称">
        <template slot-scope="scope">
          <span>
            <img v-if="scope.row.avatar" class="user-avatar" style="width: 20px; height: 20px; border-radius: 50%;" :src="scope.row.avatar+'?imageView2/1/w/20/h/20'">
            {{scope.row.username}}
          </span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="产品分类" show-overflow-tooltip>
        <template slot-scope="scope">
        <span>{{scope.row.deptName}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="产品期限" show-overflow-tooltip>
        <template slot-scope="scope">
        <span>{{scope.row.deptName}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="风险等级" show-overflow-tooltip>
        <template slot-scope="scope">
        <span>{{scope.row.deptName}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="募集规模" show-overflow-tooltip>
        <template slot-scope="scope">
        <span>{{scope.row.deptName}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="起投金额">
        <template slot-scope="scope">
          <span>{{scope.row.deptName}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="年化收益率">
        <template slot-scope="scope">
          <span>{{scope.row.roleList[0].roleDesc}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" class-name="status-col" label="产品状态">
        <template slot-scope="scope">
          <el-tag>{{scope.row.delFlag | statusFilter}}</el-tag>
        </template>
      </el-table-column>

      <el-table-column align="center" label="操作">
        <template slot-scope="scope">
          <el-button v-if="sys_user_upd" size="small" type="success"
                     @click="handleUpdate(scope.row)">编辑
          </el-button>
          <!-- <el-button v-if="sys_user_del" size="small" type="danger"
                     @click="deletes(scope.row)">删除
          </el-button> -->
          <!-- <el-button v-if="sys_user_del" size="small" type=""
                     @click="upper(scope.row)">产品上架
          </el-button> -->
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
      <el-form v-if="!nextToUpdate" :model="form" :rules="rules" ref="form" label-width="100px">
        <el-row :gutter="20">
          <el-col :span="11">
            <el-form-item label="产品名称" prop="username">
              <el-input v-model="form.username" placeholder="请输入产品名称"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="产品类型" prop="edu">
              <el-select class="filter-item" v-model="edu" placeholder="请选择">
                <el-option v-for="item in eduOptions" :key="item.value" :value="item.value" :label="item.label">
                  <span style="float: left">{{ item.label }}</span>
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        
        <el-row :gutter="20">
          <el-col :span="11">
            <el-form-item label="起投金额" prop="username">
              <el-input v-model="form.username" placeholder="请输入起投金额"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="年化收益率" prop="date">
              <el-date-picker
                v-model="entryDate"
                type="date"
                placeholder="选择日期">
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
          
        <el-row :gutter="20">
          <el-col :span="11">
            <el-form-item label="投资期限" prop="username">
              <el-select class="filter-item" v-model="sex" placeholder="请选择">
                <el-option v-for="item in sexOptions" :key="item.value" :value="item.value" :label="item.label">
                  <span style="float: left">{{ item.label }}</span>
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="基金管理人" prop="edu">
              <el-select class="filter-item" v-model="edu" placeholder="请选择">
                <el-option v-for="item in eduOptions" :key="item.value" :value="item.value" :label="item.label">
                  <span style="float: left">{{ item.label }}</span>
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        
        <el-row :gutter="20">
          <el-col :span="11">
            <el-form-item label="募集币种" prop="IDsType">
              <el-select class="filter-item" v-model="IDsType" placeholder="请选择">
                <el-option v-for="item in IDsTypeOptions" :key="item.value" :value="item.value" :label="item.label">
                  <span style="float: left">{{ item.label }}</span>
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="发行额度" prop="maritalStatus">
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
            <el-form-item label="投资门槛" prop="username">
              <el-input v-model="form.username" placeholder="请输入姓名"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="最低追加金额" prop="role">
              <el-input v-model="form.role"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        
        <el-row :gutter="20">
          <el-col :span="11">
            <el-form-item label="收益分配方式" prop="">
              <el-select class="filter-item" v-model="role" placeholder="请选择">
                <el-option v-for="item in rolesOptions" :key="item.roleId" :label="item.roleDesc" :value="item.roleId" :disabled="isDisabled[item.delFlag]">
                  <span style="float: left">{{ item.roleDesc }}</span>
                  <span style="float: right; color: #8492a6; font-size: 13px">{{ item.roleCode }}</span>
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="风险评级" prop="role">
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
            <el-form-item label="产品状态" prop="deptName">
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
        
        <el-row>
          <el-col :span="22">
            <el-form-item label="备注" prop="role">
              <el-input type="textarea" v-model="form.role"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        
        <el-form-item label="状态" v-if="dialogStatus == 'update' && sys_user_del " prop="delFlag" >
          <el-select class="filter-item" v-model="form.delFlag" placeholder="请选择">
            <el-option v-for="item in statusOptions" :key="item" :label="item | statusFilter" :value="item"> </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div v-if="!nextToUpdate" slot="footer" class="dialog-footer">
        <el-button @click="cancel('form')">取 消</el-button>
        <el-button type="primary" @click="create('form')">下一步</el-button>
      </div>
      <div v-if="nextToUpdate" slot="footer" class="dialog-footer">
        <el-button @click="cancel('form')">上一步</el-button>
        <el-button v-if="dialogStatus=='create'" type="primary" @click="create('form')">确 定</el-button>
        <el-button v-else type="primary" @click="update('form')">修 改</el-button>
      </div>
      <div class="upfile-group" v-if="nextToUpdate">
        <div class="trade-item">
          <h3>交易所需材料</h3>
          <el-table
            :data="fileList1"
            @select="handleSelectionChange1"
            border
            style="width: 100%">
            <el-table-column
              type="selection"
              width="180">
            </el-table-column>
            <el-table-column
              prop="name"
              label="材料名称"
              width="180">
            </el-table-column>
            <el-table-column
              prop="size"
              label="大小/k"
              width="180">
            </el-table-column>
            <el-table-column
              prop="uid"
              label="附件">
            </el-table-column>
          </el-table>
          <el-row style="text-align: right;">
            <el-upload
              class="upload-demo"
              style="display: inline-block;"
              action="https://jsonplaceholder.typicode.com/posts/"
              :on-change="handleChange1"
              :show-file-list="false">
              <el-button size="small" class="btn-padding" type="primary">追加材料</el-button>
            </el-upload>
            <el-button type="info" class="btn-padding" @click="delfiles1">删除材料</el-button>
          </el-row>
        </div>

        <div class="trade-item">
          <h3>产品说明所需材料</h3>
          <el-table
            :data="fileList2"
            @select="handleSelectionChange2"
            border
            style="width: 100%">
            <el-table-column
              type="selection"
              width="180">
            </el-table-column>
            <el-table-column
              prop="name"
              label="材料名称"
              width="180">
            </el-table-column>
            <el-table-column
              prop="size"
              label="大小/k"
              width="180">
            </el-table-column>
            <el-table-column
              prop="uid"
              label="附件">
            </el-table-column>
          </el-table>
          <el-row style="text-align: right;">
            <el-upload
              class="upload-demo"
              style="display: inline-block;"
              action="https://jsonplaceholder.typicode.com/posts/"
              :on-change="handleChange2"
              :show-file-list="false">
              <el-button size="small" class="btn-padding" type="primary">追加材料</el-button>
            </el-upload>
            <el-button type="info" class="btn-padding" @click="delfiles2">删除材料</el-button>
          </el-row>
        </div>

        <div class="trade-item">
          <h3>产品公告</h3>
          <el-table
            :data="fileList3"
            @select="handleSelectionChange3"
            border
            style="width: 100%">
            <el-table-column
              type="selection"
              width="180">
            </el-table-column>
            <el-table-column
              prop="name"
              label="材料名称"
              width="180">
            </el-table-column>
            <el-table-column
              prop="size"
              label="大小/k"
              width="180">
            </el-table-column>
            <el-table-column
              prop="uid"
              label="附件">
            </el-table-column>
          </el-table>
          <el-row style="text-align: right;">
            <el-upload
              class="upload-demo"
              style="display: inline-block;"
              action="https://jsonplaceholder.typicode.com/posts/"
              :on-change="handleChange3"
              :show-file-list="false">
              <el-button size="small" class="btn-padding" type="primary">追加材料</el-button>
            </el-upload>
            <el-button type="info" class="btn-padding" @click="delfiles3">删除材料</el-button>
          </el-row>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import { fetchList, getObj, addObj, putObj, delObj } from '@/api/user'
  import { deptRoleList, fetchDeptTree } from '@/api/role'
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
        listQuery: {
          page: 1,
          limit: 20
        },
        role: undefined,
        form: {
          username: undefined,
          password: undefined,
          delFlag: undefined,
          deptId: undefined
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
        rolesOptions: [],
        dialogFormVisible: false,
        dialogDeptVisible: false,
        userAdd: false,
        userUpd: false,
        userDel: false,
        dialogStatus: '',
        textMap: {
          update: '编辑产品',
          create: '新增产品'
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
        sex: '',
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
        edu: '',
        IDsTypeOptions: [
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
        IDsType: '',
        entryDate: '',
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
        productTypes: ['不限', '理财', '另类投资', '固收', '二级市场'],
        checkboxGroup1: [''],
        checkboxGroup2: [''],
        checkboxGroup3: [''],
        productStatus: ['不限', '在建', '预热', '开始募集', '募集结束', '存续期', '产品下架'],
        productIncome: ['不限', '10%以下', '10-15%', '15%以上', '浮动'],
        input2: '',
        nextToUpdate: false,
        fileList: [],
        fileList1: [],
        fileList2: [],
        fileList3: [],
        indexList: [],
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
        this.nextToUpdate = false
      },
      handleUpdate(row) {
        this.nextToUpdate = false
        getObj(row.userId)
          .then(response => {
            this.form = response.data
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
        this.nextToUpdate = true
        const set = this.$refs
        this.form.role = this.role
        set[formName].validate(valid => {
          if (valid) {
            addObj(this.form)
              .then(() => {
                this.nextToUpdate = true
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
            this.dialogFormVisible = true
            this.form.password = undefined
            putObj(this.form).then(() => {
              this.nextToUpdate = true
              this.getList()
              // this.$notify({
              //   title: '成功',
              //   message: '修改成功',
              //   type: 'success',
              //   duration: 2000
              // })
            })
          } else {
            return false
          }
        })
      },
      // deletes(row) {
      //   this.$confirm('此操作将永久删除该用户(用户名:' + row.username + '), 是否继续?', '提示', {
      //     confirmButtonText: '确定',
      //     cancelButtonText: '取消',
      //     type: 'warning'
      //   }).then(() => {
      //     delObj(row.userId).then(() => {
      //       this.getList()
      //       this.$notify({
      //         title: '成功',
      //         message: '删除成功',
      //         type: 'success',
      //         duration: 2000
      //       })
      //     }).cache(() => {
      //       this.$notify({
      //         title: '失败',
      //         message: '删除失败',
      //         type: 'error',
      //         duration: 2000
      //       })
      //     })
      //   })
      // },
      // upper(row) {
      //   this.$confirm('确定要上架此产品吗<span>产品上架后，内容不可修改，如需修改可点击产品下架</span>', '提示', {
      //     confirmButtonText: '确定',
      //     cancelButtonText: '取消',
      //     type: 'warning'
      //   }).then(() => {
      //     delObj(row.userId).then(() => {
      //       this.getList()
      //       this.$notify({
      //         title: '成功',
      //         message: '删除成功',
      //         type: 'success',
      //         duration: 2000
      //       })
      //     }).cache(() => {
      //       this.$notify({
      //         title: '失败',
      //         message: '删除失败',
      //         type: 'error',
      //         duration: 2000
      //       })
      //     })
      //   })
      // },
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
      beforeUpload(file) { // 限制上传文档类型
        console.log(file)
        const isFile = file.type === 'application/pdf'
        if (!isFile) {
          this.$message.error('只能上传pdf文档')
        }
        return isFile
      },
      handleChange1(file, fileList) { // 上传材料，列表展示
        this.fileList1 = fileList.slice(-3)
      },
      handleSelectionChange1(selection, row) { // 选中材料
        let uid = row.uid
        this.indexList.push(uid)
      },
      delfiles1() { // 删除材料
        this.indexList.forEach(id => {
          this.fileList1.forEach((item, index) => {
            if(item.uid === id) {
              this.fileList1.splice(index, 1)
            }
          })
        })
      },
      handleChange2(file, fileList) { // 上传材料，列表展示
        this.fileList2 = fileList.slice(-3)
      },
      handleSelectionChange2(selection, row) { // 选中材料
        let uid = row.uid
        this.indexList.push(uid)
      },
      delfiles2() { // 删除材料
        this.indexList.forEach(id => {
          this.fileList2.forEach((item, index) => {
            if(item.uid === id) {
              this.fileList2.splice(index, 1)
            }
          })
        })
      },
      handleChange3(file, fileList) { // 上传材料，列表展示
        this.fileList3 = fileList.slice(-3)
      },
      handleSelectionChange3(selection, row) { // 选中材料
        let uid = row.uid
        this.indexList.push(uid)
      },
      delfiles3() { // 删除材料
        this.indexList.forEach(id => {
          this.fileList3.forEach((item, index) => {
            if(item.uid === id) {
              this.fileList3.splice(index, 1)
            }
          })
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
@import "src/styles/mixin.scss";
.el-select,
.el-date-editor {
  width: 100%;
}
.filter-container {
  .query-title {
    white-space: nowrap;
    min-width: 85px;
    padding: 0;
    height: 40px;
    line-height: 40px;
    text-align: center;
    vertical-align: center;
  }
}
.btn-padding {
  @include padding;
}
</style>


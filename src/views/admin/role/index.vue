<template>
  <div class="app-container calendar-list-container">
    <div style=" text-align: right;">
      <el-button v-if="sys_role_add" class="filter-item add_btn" style="margin-left: 10px;" @click="handleCreate">
        <svg-icon icon-class="add"></svg-icon> 添加</el-button>
    </div>
    <el-table :key='tableKey' :data="list" v-loading="listLoading" element-loading-text="给我一点时间" border fit
              highlight-current-row style="width: 100%">

      <el-table-column align="center" label="序号" type="index" width="50">
        <!-- <template slot-scope="scope">
          <span>{{scope.row.roleId}}</span>
        </template> -->
      </el-table-column>

      <el-table-column align="center" label="角色名称">
        <template slot-scope="scope">
          <span>{{scope.row.roleName}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="角色标识">
        <template slot-scope="scope">
          <span>{{scope.row.roleCode}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="角色描述">
        <template slot-scope="scope">
          <span>{{scope.row.roleDesc }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="所属部门">
        <template slot-scope="scope">
          <span>{{scope.row.deptName }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="创建时间">
        <template slot-scope="scope">
          <span>{{scope.row.createTime | parseTime('{y}-{m}-{d} {h}:{i}')}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="操作" width="220">
        <template slot-scope="scope">
          <a v-if="sys_role_upd" size="mini" class="common_btn"
                     @click="handleUpdate(scope.row)">编辑
          </a>
          <a v-if="sys_role_del" size="mini" class="danger_btn"
                     @click="handleDelete(scope.row)">删除
          </a>
          <span class="space_line"> | </span>
          <span v-if="sys_role_upd" class="svg-container">
            <svg-icon icon-class="authority"/>
          </span>
          <a v-if="sys_role_upd" size="mini" class="info_btn" plain
                     @click="handlePermission(scope.row)">权限
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
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" @close="closeDialogHandle">
      <el-form :model="form" :rules="rules" ref="form" label-width="100px">
        <el-input type="hidden" v-model="form.roleDeptId"></el-input>
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="form.roleName" placeholder="角色名称"></el-input>
        </el-form-item>
        <el-form-item label="角色标识" prop="roleCode">
          <el-input v-model="form.roleCode" placeholder="角色标识"></el-input>
        </el-form-item>
        <el-form-item label="描述" prop="roleDesc">
          <el-input v-model="form.roleDesc" placeholder="描述"></el-input>
        </el-form-item>
        <el-form-item label="所属部门" prop="roleDeptIds">
          <dept v-model="form.roleDeptIds" @change="deptIdChangeHandle"></dept>
        </el-form-item>
        <el-form-item label="掩码显示" prop="maskCode">
          <el-checkbox-group v-model="form.maskCode">
            <el-checkbox v-for="item in maskCode" :label="item.value" :key="item.value">{{item.label}}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="数据权限" prop="dataScope">
          <el-radio-group v-model="form.dataScope" @change="scopeChangeHandle">
            <el-radio
              style="display: inline-block"
              v-for="item in dataScope" :label="item.value" :key="item.value">{{item.label}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item v-show="dialogDeptVisible">
            <!-- check-strictly: 父子不关联 -->
          <el-tree
            class="filter-tree"
            :data="treeDeptData"
            :default-checked-keys="checkedKeys1"
            show-checkbox
            node-key="id"
            highlight-current
            ref="deptTree"
            @node-click="getNodeData"
            :props="defaultProps"
            :filter-node-method="filterNode"
          >
          </el-tree>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button class="search_btn" @click="cancel('form')">取 消</el-button>
        <el-button class="add_btn" v-if="dialogStatus=='create'" @click="create('form')">确 定</el-button>
        <el-button class="add_btn" v-else @click="update('form')">修 改</el-button>
      </div>
    </el-dialog>

    <!-- <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogDeptVisible">
      <el-tree
        class="filter-tree"
        :data="treeDeptData"
        :default-checked-keys="checkedKeys"
        check-strictly
        node-key="id"
        highlight-current
        ref="deptTree"
        @node-click="getNodeData"
        :props="defaultProps"
        :filter-node-method="filterNode"
        default-expand-all
      >
      </el-tree>
    </el-dialog> -->

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogPermissionVisible">
        <!-- default-expand-all:默认展开所有 -->
      <el-tree
        class="filter-tree"
        :data="treeData"
        :default-checked-keys="checkedKeys"
        node-key="id"
        highlight-current
        :props="defaultProps"
        show-checkbox
        ref="menuTree"
        :filter-node-method="filterNode"
      >
      </el-tree>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="updatePermession(roleId, roleCode)">更 新</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import { fetchList, getObj, addObj, putObj, delObj, permissionUpd, fetchRoleTree } from '@/api/role'
  import { fetchTree } from '@/api/menu'
  import { getBelongsDept } from '@/api/dept'
  import waves from '@/directive/waves/index.js' // 水波纹指令
  import { mapGetters } from 'vuex'
  import Dept from 'components/dept'

  export default {
    name: 'table_role',
    directives: {
      waves
    },
    components: {
      Dept
    },
    data() {
      return {
        treeData: [],
        treeDeptData: [],
        checkedKeysAll: [],
        checkedKeys: [],
        checkedKeysAll1: [],
        checkedKeys1: [],
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
          maskCode: [],
          roleName: undefined,
          roleCode: undefined,
          roleDesc: undefined,
          deptName: undefined,
          roleDeptId: undefined,
          dataScope: '',
          roleDeptIds: []
        },
        roleId: undefined,
        roleCode: undefined,
        rules: {
          roleName: [
            { required: true, message: '角色名称', trigger: 'blur' },
            { min: 3, max: 40, message: '长度在 3 到 20 个字符', trigger: 'blur' }
          ],
          roleCode: [
            { required: true, message: '角色标识', trigger: 'blur' },
            { min: 3, max: 40, message: '长度在 3 到 20 个字符', trigger: 'blur' }
          ],
          roleDesc: [
            { required: true, message: '角色标识', trigger: 'blur' },
            { min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur' }
          ],
          dataScope: [
            { required: true, message: '请选择数据', trigger: 'blur' }
          ],
          roleDeptIds: [
            { required: true, message: '请选择所属部门', trigger: 'blur' }
          ]
        },
        statusOptions: ['0', '1'],
        rolesOptions: undefined,
        dialogFormVisible: false,
        dialogDeptVisible: false,
        dialogPermissionVisible: false,
        dialogStatus: '',
        textMap: {
          update: '编辑',
          create: '创建',
          permission: '分配权限',
        },
        tableKey: 0,
        tempVal: undefined,
        eachIndex: 0,
        result: [],
        childrenIdList: []
      }
    },
    computed: {
      ...mapGetters([
        'permissions',
        'maskCode',
        'dataScope'
      ])
    },
    created() {
      this.getList()
      this.sys_role_add = this.permissions['sys_role_add']
      this.sys_role_upd = this.permissions['sys_role_upd']
      this.sys_role_del = this.permissions['sys_role_del']
    },
    watch: {
      tempVal(newVal, oldVal) {
        if (newVal !== oldVal && this.form.dataScope - 0 === 3) {
          this.handleDept(newVal[newVal.length - 1])
        }
      }
    },
    methods: {
      getList() {
        this.listLoading = true
        fetchList(this.listQuery).then(res => {
          this.list = res.data.records
          this.total = res.data.total
          this.listLoading = false
        })
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
        getObj(row.roleId)
          .then(res => {
            this.form = res.data
            this.checkedKeysAll1 = this.form.deptIds? this.form.deptIds.split(',').map(Number) : []
            const listStr = this.form.maskCode
            let arr = []
            if (listStr) {
              arr.push(listStr)
              this.form.maskCode = listStr.length > 1 ? listStr.split(',') : arr
            } else {
              this.form.maskCode = []
            }
            if (this.form.dataScope === '3') {
              // this.dialogDeptVisible = true
              this.handleDept(row.roleDeptId)
            }
            this.form.deptName = row.deptName
            this.form.roleDeptIds = [row.roleDeptId]
            // this.form.roleDeptId = row.roleDeptId
            // let roleDeptIds = []
            // roleDeptIds.push(this.form.roleDeptId)
            // this.form.roleDeptIds = roleDeptIds
            // console.log(this.form.roleDeptIds)
            this.dialogFormVisible = true
            this.dialogStatus = 'update'
          })
      },
      handlePermission(row) {
        fetchRoleTree(row.roleCode).then(res => {
          this.checkedKeysAll = res.data
          this.dialogPermissionVisible = true
        })
        fetchTree()
            .then(res => {
              this.treeData = res.data
              this.dialogStatus = 'permission'
              // this.dialogPermissionVisible = true
              this.roleId = row.roleId
              this.roleCode = row.roleCode
              this.result = this.cycleListId(this.treeData)
              this.result.forEach((item, index) => { // 所有子级id
                this.childrenIdList.push(item[item.length - 1])
              })
              this.childrenIdList = Array.from(new Set(this.childrenIdList)) // 去重
              let arr = []
              this.checkedKeysAll.map(checked => {
                this.childrenIdList.map(childrenId => {
                  if (checked == childrenId) {
                    arr.push(checked)
                  }
                })
              })
              this.checkedKeys = arr
            })
      },
      filterChildren(treeData, checkedList) {
        checkedList.forEach(item => {
          treeData.find(tree => tree.id === item && tree.children.length)
        })
      },
      filterNode(value, data) {
        if (!value) return true
        return data.label.indexOf(value) !== -1
      },
      getNodeData(data) {
        // this.dialogDeptVisible = false
        // this.form.roleDeptId = data.id
        // this.form.deptName = data.name
        console.log(data)
      },
      handleDelete(row) {
        this.$confirm('此操作将永久删除该角色( ' + row.roleDesc + ' ), 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          delObj(row.roleId).then(res => {
            if (res.status === 200) {
              this.dialogFormVisible = false
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
      create(formName) {
        const set = this.$refs
        set[formName].validate(valid => {
          if (valid) {
            const len = this.form.roleDeptIds
            if(len && len.length) {
              this.form.roleDeptId = len[len.length - 1]
            }
            if(this.form.maskCode) {
              this.form.maskCode = this.form.maskCode.join(',')
            }
            let menuIds = this.$refs.deptTree.getCheckedKeys()
            let menuIds1 = this.$refs.deptTree.getHalfCheckedKeys()
            this.form.deptIds = [...menuIds, ...menuIds1].join()
            addObj(this.form)
              .then((res) => {
                if (res.status !== 200) return
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
            if(this.form.maskCode) {
              this.form.maskCode = this.form.maskCode.join(',')
            }
            this.form.roleDeptId = this.form.roleDeptIds[this.form.roleDeptIds.length - 1]
            let menuIds = this.$refs.deptTree.getCheckedKeys()
            let menuIds1 = this.$refs.deptTree.getHalfCheckedKeys()
            this.form.deptIds = [...menuIds, ...menuIds1].join()
            // this.dialogFormVisible = false
            putObj(this.form).then((res) => {
              if (res.status !== 200) return
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
      updatePermession(roleId, roleCode) {
        let menuIds = this.$refs.menuTree.getCheckedKeys()
        let menuIds1 = this.$refs.menuTree.getHalfCheckedKeys()
        permissionUpd(roleId, [...menuIds, ...menuIds1])
          .then(() => {
            this.dialogPermissionVisible = false
            // fetchTree()
            //   .then(res => {
            //     this.treeData = res.data
            //   })
            // fetchRoleTree(roleCode).then(res => {
            //   this.checkedKeys = res.data
            // })
            this.$notify({
              title: '成功',
              message: '修改成功',
              type: 'success',
              duration: 2000
            })
          })
      },
      resetTemp() {
        this.form = {
          id: undefined,
          roleName: undefined,
          roleCode: undefined,
          roleDesc: undefined,
          maskCode: [],
          dataScope: ''
        }
      },
      handleDept(roleDeptId) { // 获取自定义部门
        this.dialogDeptVisible = true
        getBelongsDept(roleDeptId)
          .then(res => {
            this.treeDeptData = res.data
            let tempList = []
            tempList = this.cycleListId(this.treeDeptData)
            tempList.forEach((item, index) => { // 所有子级id
              this.childrenIdList.push(item[item.length - 1])
            })
            this.childrenIdList = Array.from(new Set(this.childrenIdList)) // 去重
            let arr = []
            this.checkedKeysAll1.map(checked => {
              this.childrenIdList.map(childrenId => {
                if (checked == childrenId) {
                  arr.push(checked)
                }
              })
            })
            this.checkedKeys1 = arr
          })
      },
      scopeChangeHandle(val) {
        // 自定义部门
        if (val - 0 === 3 && this.form.roleDeptIds) {
          // this.dialogDeptVisible = true
          this.handleDept(this.form.roleDeptIds[this.form.roleDeptIds.length - 1])
        } else {
          this.dialogDeptVisible = false
          this.checkedKeys1 = []
        }
      },
      deptIdChangeHandle(val) {
        this.tempVal = val
      },
      closeDialogHandle() { // dialog 关闭清除表单数据
        this.$refs['form'].resetFields()
        this.treeDeptData = []
      },
      cycleListId(list, prevId = []) {
        list.forEach(item => {
          if (item.children && item.children.length > 0) {
            this.cycleListId(item.children, [...prevId, item.id])
          }
          if (item.children && !item.children.length) {
            this.result[this.eachIndex] = [...prevId, item.id]
            this.eachIndex++
          }
        })
        return this.result
      }
    }
  }
</script>

<template>
  <div>
    <div style="text-align: right">
      <el-button v-if="sys_user_add" class="add_btn" @click="handleCreate">
        <svg-icon icon-class="add"></svg-icon> 添加</el-button>
    </div>
    <el-table :key='tableKey' :data="list" v-loading="listLoading" element-loading-text="给我一点时间" border fit
              highlight-current-row style="width: 100%">

      <el-table-column align="center" label="序号" type="index" width="50">
      </el-table-column>

      <el-table-column align="center" label="用户名" class-name="left">
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

      <el-table-column align="center" label="职位" class-name="toggle">
        <template slot-scope="scope">
          <span>{{scope.row.positionId}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="角色">
        <template slot-scope="scope">
          <span>{{scope.row.roleList[0].roleDesc}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="入职时间">
        <template slot-scope="scope">
          <span>{{scope.row.employeeDate | parseTime('{y}-{m}-{d}')}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" class-name="status-col" label="状态">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.statusNum == 0" class="normal">{{scope.row.status}}</el-tag>
          <el-tag v-if="scope.row.statusNum == 1" class="leave">{{scope.row.status}}</el-tag>
          <el-tag v-if="scope.row.statusNum == 2" class="unusual">{{scope.row.status}}</el-tag>
        </template>
      </el-table-column>

      <el-table-column align="center" label="手机号" show-overflow-tooltip>
        <template slot-scope="scope">
        <span>{{scope.row.mobile}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="工号" show-overflow-tooltip>
        <template slot-scope="scope">
        <span>{{scope.row.empNo}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="直属上级" show-overflow-tooltip>
        <template slot-scope="scope">
        <span>{{scope.row.directSupervisorName}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="操作" fixed="right" width="150">
        <template slot-scope="scope">
          <a size="small" class="common_btn"
                     @click="handleUpdate(scope.row, 'view')">查看
          </a>
          <span class="space_line"> | </span>
          <a v-if="sys_user_upd" size="small" class="common_btn"
                     @click="handleUpdate(scope.row, 'edit')">编辑
          </a>
          <!-- <el-button v-if="sys_user_del" size="small" type="danger"
                     @click="deletes(scope.row)">删除
          </el-button> -->
        </template>
      </el-table-column>

    </el-table>

    <div v-show="!listLoading&list" class="pagination-container">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                     :current-page.sync="listQuery.page"
                     :page-sizes="[10,20,30, 50]" :page-size="listQuery.limit"
                     layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>
    <!-- 直属变更编辑/新增 -->
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form :model="form" :rules="rules" ref="form" label-width="120px">
        <el-row>
          <el-col :span="11">
            <el-form-item label="所在城市" prop="city">
              <el-cascader
                size="large"
                style="width: 100%"
                :options="options"
                :props="defaultProps2"
                v-model="form.city">
              </el-cascader>
              <!-- <el-select class="filter-item" v-model="form.role" placeholder="请选择">
                <el-option v-for="item in provinceAndCityData" :key="item.roleId" :label="item.roleDesc" :value="item.roleId">
                  <span style="float: left">{{ item.roleDesc }}</span>
                </el-option>
              </el-select> -->
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="物理职场" prop="username">
              <el-input v-model="form.username" placeholder="请输入用户名"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="直属上级" prop="name">
              <el-select class="filter-item" v-model="form.role" placeholder="请选择">
                <el-option v-for="item in rolesOptions" :key="item.roleId" :label="item.roleDesc" :value="item.roleId">
                  <span style="float: left">{{ item.roleDesc }}</span>
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="合伙人" prop="username">
              <el-select class="filter-item" v-model="form.role" placeholder="请选择">
                <el-option v-for="item in rolesOptions" :key="item.roleId" :label="item.roleDesc" :value="item.roleId">
                  <span style="float: left">{{ item.roleDesc }}</span>
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="区域总" prop="name">
              <el-select class="filter-item" v-model="form.role" placeholder="请选择">
                <el-option v-for="item in rolesOptions" :key="item.roleId" :label="item.roleDesc" :value="item.roleId">
                  <span style="float: left">{{ item.roleDesc }}</span>
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="区域副总" prop="username">
              <el-select class="filter-item" v-model="form.role" placeholder="请选择">
                <el-option v-for="item in rolesOptions" :key="item.roleId" :label="item.roleDesc" :value="item.roleId">
                  <span style="float: left">{{ item.roleDesc }}</span>
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="城市总" prop="name">
              <el-select class="filter-item" v-model="form.role" placeholder="请选择">
                <el-option v-for="item in rolesOptions" :key="item.roleId" :label="item.roleDesc" :value="item.roleId">
                  <span style="float: left">{{ item.roleDesc }}</span>
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="城市副总" prop="username">
              <el-select class="filter-item" v-model="form.role" placeholder="请选择">
                <el-option v-for="item in rolesOptions" :key="item.roleId" :label="item.roleDesc" :value="item.roleId">
                  <span style="float: left">{{ item.roleDesc }}</span>
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="团队经理" prop="name">
              <el-select class="filter-item" v-model="form.role" placeholder="请选择">
                <el-option v-for="item in rolesOptions" :key="item.roleId" :label="item.roleDesc" :value="item.roleId">
                  <span style="float: left">{{ item.roleDesc }}</span>
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="公司" prop="username">
              <el-select class="filter-item" v-model="form.role" placeholder="请选择">
                <el-option v-for="item in rolesOptions" :key="item.roleId" :label="item.roleDesc" :value="item.roleId">
                  <span style="float: left">{{ item.roleDesc }}</span>
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="区域" prop="name">
              <el-input v-model="form.name" placeholder="请选择城市"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="部门" prop="username">
              <el-select class="filter-item" v-model="form.role" placeholder="请选择">
                <el-option v-for="item in rolesOptions" :key="item.roleId" :label="item.roleDesc" :value="item.roleId">
                  <span style="float: left">{{ item.roleDesc }}</span>
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="职位" prop="name">
              <el-select class="filter-item" v-model="form.role" placeholder="请选择">
                <el-option v-for="item in rolesOptions" :key="item.roleId" :label="item.roleDesc" :value="item.roleId">
                  <span style="float: left">{{ item.roleDesc }}</span>
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="职级" prop="username">
              <el-select class="filter-item" v-model="form.role" placeholder="请选择">
                <el-option v-for="item in rolesOptions" :key="item.roleId" :label="item.roleDesc" :value="item.roleId">
                  <span style="float: left">{{ item.roleDesc }}</span>
                </el-option>
              </el-select>
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
  import { fetchList, getObj, addObj, putObj, delObj, getDirectSupervisorList } from '@/api/user'
  import { deptRoleList, fetchDeptTree } from '@/api/role'
  import { getPositionName } from '@/api/posi'
  import { getAllPositon } from '@/api/queryConditions'
  import waves from '@/directive/waves/index.js' // 水波纹指令
  import { parseTime } from '@/utils'
  import { mapGetters } from 'vuex'
  import { provinceAndCityData } from 'element-china-area-data' // 省市区数据

  export default {
    filters: {
      parseTime (time) {
        if(!time) return
        let date = new Date(time)
        return parseTime(date)
      }
    },
    data() {
      return {
        listLoading: false,
        tableKey: 0,
        list: [],
        listQuery: {
          page: 1,
          limit: 20
        },
        total: null,
        textMap: {
          update: '编辑直属变更',
          create: '新增直属变更'
        },
        rolesOptions: [],
        dialogStatus: '',
        dialogFormVisible: false,
        form: {},
        rules: {
          name: [
            {required: true, trigger: 'blur', message: '请选择'}
          ],
          city: [
            {required: true, trigger: 'blur', message: '请选择'}
          ],
        },
        defaultProps2: {
          value: 'label'
        },
        options: provinceAndCityData
      }
    },
    computed: {
      ...mapGetters([
        'permissions'
      ])
    },
    created() {
      // this.handlePosition()
      this.sys_user_add = this.permissions['sys_user_add']
      this.sys_user_upd = this.permissions['sys_user_upd']
      this.sys_user_del = this.permissions['sys_user_del']
    },
    mounted() {
      this.id = this.$route.params.id
      this.state = this.$route.params.state
    },
    methods: {
      handleUpdate() {
        console.log(val)
      },
      handleSizeChange(val) {
        this.listQuery.limit = val
      },
      handleCurrentChange(val) {
        this.listQuery.page = val
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
            // addObj(this.form)
            //   .then((res) => {
            //     if (res.status === 200) {
            //       this.dialogFormVisible = false
            //       // this.getList()
            //       this.$notify({
            //         title: '成功',
            //         message: '创建成功',
            //         type: 'success',
            //         duration: 2000
            //       })
            //     }
            //   })
          } else {
            return false
          }
        })
      },
      update() {
        console.log('编辑')
      },
      cancel(formName) {
        console.log(this.$refs[formName])
        this.dialogFormVisible = false
        this.$refs[formName].resetFields()
      },
      resetTemp() {
        this.form = {
          id: undefined,
          username: '',
          password: '',
          role: undefined
        }
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


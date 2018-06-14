<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <!-- <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" placeholder="用户名"
                v-model="listQuery.username">
      </el-input>
      <el-button class="filter-item" type="primary" v-waves icon="search" @click="handleFilter">搜索</el-button>
      <el-button v-if="sys_user_add" class="filter-item" style="margin-left: 10px;" @click="handleCreate" type="primary" icon="edit">添加</el-button> -->
      <el-form label-position="right" label-width="80px">
        <el-row :gutter="20">
          <el-col :xs="24" :sm="12" :md="12" :lg="8" :xl="8">
            <el-form-item label="搜索">
              <el-input
                placeholder="搜索员工、手机号、工号"
                prefix-icon="el-icon-search"
                v-model="listQuery.searchParams">
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="12" :lg="8" :xl="8">
            <el-form-item label="职位">
              <el-select class="filter-item" v-model="listQuery.positionId" placeholder="请选择" @focus="handlePosition()">
                <el-option v-for="item in positionsOptions" :key="item.positionId" :value="item.positionId" :label="item.positionName">
                  <span style="float: left">{{ item.positionName }}</span>
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="12" :lg="8" :xl="8">
            <el-form-item label="工作状态">
              <el-select class="filter-item" v-model="listQuery.status" placeholder="请选择">
                <el-option v-for="item in workStatus" :key="item.value" :value="item.value" :label="item.label">
                  <span style="float: left">{{ item.label }}</span>
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        <!-- </el-row> -->
        <!-- <el-row :gutter="10"> -->
          <el-col :xs="24" :sm="12" :md="12" :lg="8" :xl="8">
            <el-form-item label="入职时间">
              <el-date-picker
                v-model="entryDate"
                type="daterange"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                :default-time="['00:00:00', '23:59:59']">
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row style="text-align: center;">
          <el-button class="search_btn" @click="handleFilter"><svg-icon icon-class="search"></svg-icon> 查询</el-button>
          <el-button class="search_btn" @click="resetFilter"><svg-icon icon-class="reset"></svg-icon> 重置</el-button>
        </el-row>
      </el-form>
    </div>

    <div style="text-align: right">
      <el-button v-if="sys_user_add" class="add_btn" @click="handleCreate">
        <svg-icon icon-class="add"></svg-icon> 添加</el-button>
    </div>
    <el-table :key='tableKey' :data="list" v-loading="listLoading" element-loading-text="给我一点时间" border fit
              highlight-current-row style="width: 100%">

      <el-table-column align="center" label="序号" type="index" width="50">
        <!-- <template slot-scope="scope"> -->
          <!-- <span>{{scope.row.userId}}</span> -->
        <!-- </template> -->
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
          <!-- <el-tag :class="'leave': scope.row.statusNum == 0,
                          'normal': scope.row.statusNum == 1,
                          'unusual': scope.row.statusNum == 2"
          >{{scope.row.status}}</el-tag> -->
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
                     @click="handleUpdate(scope.row, 'update')">编辑
          </a>
          <!-- <el-button v-if="sys_user_del" size="small" type="danger"
                     @click="deletes(scope.row)">删除
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

    <!-- 新增 -->
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form :model="form" ref="form" label-width="100px">
        
        <el-row :gutter="20">
          <el-col :span="11">
            <el-form-item label="姓名" prop="name">
              <el-input v-model="form.name" placeholder="请输入姓名" @change="getPYCode"></el-input>
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
            <el-form-item label="入职日期" prop="employeeDate">
              <el-date-picker
                v-model="form.employeeDate"
                type="date"
                placeholder="选择日期">
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        
        <el-row :gutter="20">
          <el-col :span="11">
            <el-form-item label="性别" prop="gender">
              <el-select class="filter-item" v-model="form.gender" placeholder="请选择">
                <el-option v-for="item in genderType" :key="item.value" :value="item.value" :label="item.label">
                  <span style="float: left">{{ item.label }}</span>
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="学历" prop="education">
              <el-select class="filter-item" v-model="form.education" placeholder="请选择">
                <el-option v-for="item in educationType" :key="item.value" :value="item.value" :label="item.label">
                  <span style="float: left">{{ item.label }}</span>
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        
        <el-row :gutter="20">
          <el-col :span="11">
            <el-form-item label="证件类型" prop="idType">
              <el-select class="filter-item" v-model="form.idType" placeholder="请选择">
                <el-option v-for="item in idTypeOptions" :key="item.value" :value="item.value" :label="item.label">
                  <span style="float: left">{{ item.label }}</span>
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="婚姻状况" prop="marriageStatus">
              <el-select class="filter-item" v-model="form.marriageStatus" placeholder="请选择">
                <el-option v-for="item in marriageStatusOptions" :key="item.value" :value="item.value" :label="item.label">
                  <span style="float: left">{{ item.label }}</span>
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        
        <el-row :gutter="20">
          <el-col :span="11">
            <el-form-item label="证件号码" prop="idNo">
              <el-input v-model="form.idNo" :maxlength="18" placeholder="请输入证件号码"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="手机号" prop="mobile">
              <el-input v-model="form.mobile" :maxlength="11" placeholder="请输入手机号码"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        
        <el-row :gutter="20">
          <el-col :span="11">
            <el-form-item label="部门" prop="deptName">
              <!-- deptId -->
              <el-input v-model="form.deptName" placeholder="选择部门" 
                @focus="handleDept"
                @change="changeDept"
                readonly></el-input>
              <input type="hidden" v-model="form.deptId"/>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="角色" prop="role">
              <!-- role -->
              <el-select class="filter-item" v-model="role" placeholder="请选择">
                <el-option v-for="item in rolesOptions" :key="item.roleId" :label="item.roleDesc" :value="item.roleId">
                  <span style="float: left">{{ item.roleDesc }}</span>
                  <span style="float: right; color: #8492a6; font-size: 13px">{{ item.roleCode }}</span>
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        
        <el-row :gutter="20">
          <el-col :span="11">
            <el-form-item label="职位" prop="positionId">
              <!-- positionId -->
              <el-select class="filter-item" v-model="form.positionId" placeholder="请选择" @focus="handlePosition" @change="handleChange">
                <el-option v-for="item in positionsOptions" :key="item.positionId" :label="item.positionName" :value="item.positionId">
                  <span style="float: left">{{ item.positionName }}</span>
                </el-option>
              </el-select>
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
            <el-form-item label="直属上级" prop="directSupervisorId">
              <el-select class="filter-item" v-model="form.directSupervisorId" placeholder="请选择" @focus="getDirectSupervisorList">
                <el-option v-for="item in directSupervisor" :key="item.userId" :label="item.name" :value="item.userId">
                  <span style="float: left">{{ item.name }}</span>
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="状态" v-if="dialogStatus == 'update' " prop="status" >
              <el-select class="filter-item" v-model="form.status" placeholder="请选择">
                <el-option v-for="item in workStatus" :key="item.value" :label="item.label" :value="item.value"> </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="简历" prop="resumeUrl">
              <!-- <el-input v-model="form.role"></el-input> -->
              <el-upload
                class="upload-demo"
                action="/zuul/admin/user/upload"
                :on-preview="handlePreview"
                :on-remove="handleRemove"
                :headers="headers"
                multiple
                :limit="1"
                :on-exceed="handleExceed"
                :on-success="handleSuccess"
                :file-list="fileList"
                :show-file-list="true"
                :before-upload="beforeUpload"
                accept=".pdf, .doc">
                <el-button size="small" class="add_btn">上传简历</el-button>
              </el-upload>
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
        <el-button class="search_btn" @click="cancel('form')">取 消</el-button>
        <el-button class="add_btn" v-if="dialogStatus=='create'" @click="create('form')">确 定</el-button>
        <el-button class="add_btn" v-else @click="update('form')">修 改</el-button>
      </div>
    </el-dialog>

    <!-- 查看 -->
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormView">
      <el-form :model="form" :rules="rules" ref="form1" label-width="100px">
        
        <el-row :gutter="20">
          <el-col :span="11">
            <el-form-item label="姓名" prop="name">
              <el-input v-model="form.name" placeholder="" @change="getPYCode" :readonly="isReadonly"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="用户名" prop="username">
              <el-input v-model="form.username" placeholder="" :readonly="isReadonly"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        
        <el-row :gutter="20">
          <el-col :span="11">
            <el-form-item label="工号" prop="empNo">
              <el-input v-model="form.empNo" placeholder="" :readonly="isReadonly"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="入职日期" prop="date">
              <el-input v-model="form.employeeDate" placeholder="" :readonly="isReadonly"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        
        <el-row :gutter="20">
          <el-col :span="11">
            <el-form-item label="性别" prop="gender">
              <el-input v-model="form.gender" placeholder="" :readonly="isReadonly"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="学历" prop="education">
              <el-input v-model="form.education" placeholder="" :readonly="isReadonly"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        
        <el-row :gutter="20">
          <el-col :span="11">
            <el-form-item label="证件类型" prop="idType">
              <el-input v-model="form.idType" placeholder="" :readonly="isReadonly"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="婚姻状况" prop="marriageStatus">
              <el-input v-model="form.marriageStatus" placeholder="" :readonly="isReadonly"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        
        <el-row :gutter="20">
          <el-col :span="11">
            <el-form-item label="证件号码" prop="idNo">
              <el-input v-model="form.idNo" :maxlength="18" placeholder="" :readonly="isReadonly"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="手机号" prop="mobile">
              <el-input v-model="form.mobile" :maxlength="11" placeholder="" :readonly="isReadonly"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        
        <el-row :gutter="20">
          <el-col :span="11">
            <el-form-item label="部门" prop="deptName">
              <el-input v-model="form.deptName" placeholder="" :readonly="isReadonly"></el-input>
              <input type="hidden" v-model="form.deptId"/>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="角色" prop="role">
              <el-input v-model="role" placeholder="" :readonly="isReadonly"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        
        <el-row :gutter="20">
          <el-col :span="11">
            <el-form-item label="职位" prop="positionId">
              <!-- positionId -->
              <el-input v-model="form.positionId" placeholder="" :readonly="isReadonly"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="邮箱" prop="email">
              <el-input v-model="form.email" :readonly="isReadonly"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        
        <el-row :gutter="20">
          <el-col :span="11">
            <el-form-item label="直属上级" prop="directSupervisorName">
              <el-input v-model="form.directSupervisorName" placeholder="" :readonly="isReadonly"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="状态" v-if="dialogStatus == 'update' " prop="status" >
              <el-input v-model="form.status" placeholder="" :readonly="isReadonly"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="简历" prop="resumeUrl">
              <a target="_blank" :href="form.resumeUrl" style="white-space: nowrap">{{form.resumeName}}</a>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="22">
            <el-form-item label="备注" prop="remark">
              <el-input type="textarea" v-model="form.remark" :readonly="isReadonly"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        
      </el-form>
    </el-dialog>

  </div>
</template>

<script>
  import { fetchList, getObj, addObj, putObj, delObj, getDirectSupervisorList } from '@/api/user'
  import { deptRoleList, fetchDeptTree } from '@/api/role'
  import { getPositionName } from '@/api/posi'
  import { getAllPositon } from '@/api/queryConditions'
  import waves from '@/directive/waves/index.js' // 水波纹指令
  import { parseTime, transformText } from '@/utils'
  import { mapGetters } from 'vuex'
  import ElRadioGroup from 'element-ui/packages/radio/src/radio-group'
  import ElOption from "element-ui/packages/select/src/option"
  import UploadExcelComponent from '@/components/UploadExcel/index.vue'
  import { isvalidMobile, isvalidID } from '@/utils/validate'
  import { getPYData } from '@/assets/data'
  import { getToken } from '@/utils/auth'

  const validMobile = (rule, value, callback) => {
    if (!value) {
      callback(new Error('请输入电话号码'))
    } else if (!isvalidMobile(value)) {
      callback(new Error('请输入正确的11位手机号'))
    } else {
      callback()
    }
  }

  const validID = (rule, value, callback) => {
    if (!value) {
      callback(new Error('请输入身份证号码'))
    } else if (!isvalidID(value)) {
      callback(new Error('请输入正确的身份证号码'))
    } else {
      callback()
    }
  }

  export default {
    components: {
      ElOption,
      ElRadioGroup,
      UploadExcelComponent
    },
    filters: {
      parseTime (time) {
        if(!time) return
        let date = new Date(time)
        return parseTime(date)
      }
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
          status: undefined,
          deptId: undefined
        },
        rules: {
          name: [
            {required: true, trigger: 'blur', message: '请输入姓名'}
          ],
          username: [
            {required: true, trigger: 'blur', message: '请输入用户名'},
            {min: 3, max: 20, trigger: 'blur', message: '长度在 3 到 20 个字符'}
          ],
          empNo: [
            {required: true, trigger: 'blur', message: '请输入工号'}
          ],
          employeeDate: [
            {required: true, trigger: 'blur', message: '请选择入职日期'}
          ],
          gender: [
            {required: true, trigger: 'blur', message: '请选择性别'}
          ],
          education: [
            {required: true, trigger: 'blur', message: '请选择学历'}
          ],
          idType: [
            {required: true, trigger: 'blur', message: '请输入证件类型'}
          ],
          marriageStatus: [
            {required: false, trigger: 'blur', message: '请选择婚姻状况'}
          ],
          idNo: [
            {required: true, trigger: 'blur', validator: validID}
          ],
          deptName: [
            {required: true, trigger: 'change', message: '请选择部门'}
          ],
          role: [
            {required: true, trigger: 'blur', message: '请选择角色'}
          ],
          positionName: [
            {required: true, trigger: 'change', message: '请选择职位'}
          ],
          email: [
            {required: true, trigger: 'blur', message: '请输入邮箱'}
          ],
          mobile: [
            {required: true, trigger: 'change', validator: validMobile}
          ]
        },
        statusOptions: ['0', '1', '2'],
        positionsOptions: [],
        rolesOptions: [],
        dialogFormVisible: false,
        dialogDeptVisible: false,
        dialogFormView: false,
        userAdd: false,
        userUpd: false,
        userDel: false,
        dialogStatus: '',
        textMap: {
          view: '查看员工',
          update: '编辑员工',
          create: '新增员工'
        },
        isDisabled: {
          0: false,
          1: true
        },
        tableKey: 0,
        input2: '',
        gender: '',
        value13: '',
        eduOptions: [],
        education: '',
        // IDType: '',
        employeeDate: '',
        maritalStatus: '',
        fileList: [],
        positionId: '',
        status: '',
        tableData: [],
        tableHeader: [],
        entryDate: [],
        // positionName: '',
        PYCode: '',
        headers: {
          Authorization: 'Bearer ' + getToken()
        },
        isReadonly: false,
        directSupervisor: []
      }
    },
    computed: {
      ...mapGetters([
        'permissions',
        'educationType',
        'genderType',
        'idTypeOptions',
        'marriageStatusOptions',
        'workStatus'
      ])
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
        if(this.entryDate.length > 0) {
          this.listQuery.startTime = parseTime(this.entryDate[0], '{y}-{m}-{d}') 
          this.listQuery.endTime = parseTime(this.entryDate[1], '{y}-{m}-{d}')
        } else {
          this.listQuery.startTime = ''
          this.listQuery.endTime = ''
        } 
        // this.handlePosition()
        fetchList(this.listQuery).then(response => {
          this.list = response.data.records
          this.total = response.data.total
          this.listLoading = false
          getAllPositon().then(res => {
            this.positionsOptions = res.data
            this.list.forEach(item => {
              item.positionId = transformText(this.positionsOptions, item.positionId)
              item.statusNum = item.status
              item.status = transformText(this.workStatus, item.status)
            })
          })
        })
      },
      getNodeData(data) { // 部门查询
        this.dialogDeptVisible = false
        this.form.deptId = data.id
        this.form.deptName = data.name
        deptRoleList(data.id)
          .then(response => {
            this.rolesOptions = response.data
            this.role = this.rolesOptions[0] ? this.rolesOptions[0].roleId : ''
          })
      },
      getDirectSupervisorList() { // 直属上级查询
        // this.dialogDeptVisible = false
        // this.form.deptId = data.id
        // this.form.deptName = data.name
        getDirectSupervisorList()
          .then(response => {
            this.directSupervisor = response.data
            // this.role = this.rolesOptions[0] ? this.rolesOptions[0].roleId : ''
          })
      },
      handlePosition() {
        getAllPositon().then(res => {
          this.positionsOptions = res.data
        })
      },
      handleDept() {
        fetchDeptTree()
          .then(response => {
            this.treeDeptData = response.data
            this.dialogDeptVisible = true
          })
      },
      changeDept() {
        this.role = ''
        this.form.role = ''
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
        this.PYCode = getPYData() // 获取拼音数据
      },
      handleUpdate(row, state) { // 编辑查询（查看）
        getObj(row.userId)
          .then(response => {
            this.form = response.data
            this.form.role = row.roleList[0].roleId
            this.role = row.roleList[0].roleDesc
            // console.log(state)
            if(state === 'view') {
              this.dialogFormView = true
              this.dialogFormVisible = false
              this.dialogStatus = 'view'
              this.isReadonly = true
              this.form.gender = transformText(this.genderType, this.form.gender)
              this.form.education = transformText(this.educationType, this.form.education)
              this.form.idType = transformText(this.idTypeOptions, this.form.idType)
              this.form.positionId = transformText(this.positionsOptions, this.form.positionId)
              this.form.marriageStatus = transformText(this.marriageStatusOptions, this.form.marriageStatus)
            } else {
              this.dialogFormView = false
              this.dialogFormVisible = true
              this.dialogStatus = 'update'
              this.form.directSupervisorId = this.form.directSupervisorName
            }
            let obj = {
              name: this.form.resumeName,
              url: this.form.resumeUrl
            }
            if(!obj.name) {
              this.fileList = []
            } else {
              this.fileList.push(obj)
              this.fileList.length = 1
              // console.log(this.fileList[0])
            }
            deptRoleList(response.data.deptId)
              .then(response => {
                this.rolesOptions = response.data
              })
          })
      },
      create(formName) {
        const set = this.$refs
        this.form.role = this.role
        // this.form.positionId = this.form.positionName
        // this.form.idType = this.IDType
        // this.form.marriageStatus = this.maritalStatus
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
        console.log(this.$refs[formName])
        this.dialogFormVisible = false
        this.$refs[formName].resetFields()
      },
      update(formName) { // 编辑提交
        const set = this.$refs
        // this.form.role = this.role
        set[formName].validate(valid => {
          if (valid) {
            // this.form.positionId = this.form.positionName
            console.log(this.fileList)
            if(this.fileList.length) {
              this.form.resumeName = this.fileList[0].name
              // this.form.resumeName = this.fileList[0].response.fileName
              this.form.resumeUrl =  this.fileList[0].url || this.fileList[0].response.fileUrl
            } else {
              this.form.resumeName = ''
              this.form.resumeUrl =''
              this.fileList = []
            }
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
      resetFilter() { // 重置搜索条件
        this.listQuery = {
          page: 1,
          limit: 20,
          username: '',
          positionId: '',
          status: ''
        },
        this.entryDate = []
        this.handleFilter()
      },
      handleRemove(file, fileList) {
        this.fileList = []
        console.log(file, fileList)
      },
      handlePreview(file) {
        // console.log(file)
      },
      handleExceed(files, fileList) {
        this.$message.warning(`当前限制选择 1 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`)
      },
      handleSuccess(files, fileList) {
        this.fileList.push(fileList)
        // console.log(files)
        console.log(this.fileList)
      },
      // beforeRemove(file, fileList) {
      //   return this.$confirm(`确定移除 ${ file.name }？`)
      // },
      beforeUpload(file) {
        const isFile = file.type === 'application/pdf'
        if (!isFile) {
          this.$message.error('只能上传pdf文档')
        }
        return isFile
      },
      selected(data) {
        this.tableData = data.results
        this.tableHeader = data.header
      },
      handleChange(val) {
        this.form.positionId = val
        console.log(val)
      },
      covertPY(l1) { // 汉字转拼音
        let l2 = l1.length
        let I1 = ""
        let reg = new RegExp('[a-zA-Z0-9\- ]')
        for (let i = 0; i < l2; i++) {
            let val = l1.substr(i, 1)
            let name = this.arraySearch(val, this.PYCode)
            if (reg.test(val)) {
                I1 += val
            } else if (name !== false) {
                I1 += name
            }
         }
         I1 = I1.replace(/ /g, '-')
         while (I1.indexOf('--') > 0) {
             I1 = I1.replace('--', '-')
         }
         return I1
      },
      arraySearch(l1, l2) { // 搜索对象
        for (var name in l2) {
          if (l2[name].indexOf(l1) != -1) {
              return name
              break
          }
        }
        return false
      },
      getPYCode(val) {
        this.form.username = this.covertPY(val)
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


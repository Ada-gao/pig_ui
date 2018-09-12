<template>
  <div class="app-container calendar-list-container pro-detail-radio">
    <el-radio-group v-model="step" style="margin-bottom: 30px;">
      <el-radio-button label="1">员工基本信息</el-radio-button>
      <el-radio-button style="border-radius: 0" label="2">直属变更</el-radio-button>
    </el-radio-group>
    <!-- 新增/编辑 -->
    <div v-if="state!=='view'&&step==='1'">
      <el-form :model="form" :rules="rules" ref="form" label-width="120px">
        <el-row :gutter="40">
          <el-col :span="10">
            <el-form-item label="姓名" prop="name">
              <el-input v-model="form.name" placeholder="请输入姓名" @change="getPYCode"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="用户名" prop="username">
              <el-input v-model="form.username" placeholder="请输入用户名"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="部门" prop="deptIds">
              <!-- <my-cascader v-model="form.deptIds" @change="changeDept"></my-cascader> -->
              <dept v-model="form.deptIds" @change="changeDept"></dept>
              <!-- <el-cascader
                style="width: 100%"
                :options="treeDeptData"
                :props="defaultProps"
                :show-all-levels="false"
                change-on-select
                v-model="form.deptIds"
                @change="changeDept"
              ></el-cascader> -->
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="工号" prop="empNo">
              <el-input v-model="form.empNo" placeholder="请输入工号"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="角色" prop="role">
              <el-select class="filter-item" v-model="form.role" @change="handleChageRole" placeholder="请选择">
                <el-option v-for="item in rolesOptions" :key="item.roleId" :label="item.roleDesc" :value="item.roleId">
                  <span style="float: left">{{ item.roleDesc }}</span>
                  <span style="float: right; color: #8492a6; font-size: 13px">{{ item.roleCode }}</span>
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="性别" prop="gender">
              <el-select class="filter-item" v-model="form.gender" placeholder="请选择">
                <el-option v-for="item in genderType" :key="item.value" :value="item.value" :label="item.label">
                  <span style="float: left">{{ item.label }}</span>
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="入职日期" prop="employeeDate">
              <el-date-picker
                v-model="form.employeeDate"
                type="date"
                placeholder="选择日期"
               >
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="证件类型" prop="idType">
              <el-select class="filter-item" v-model="form.idType" @change="validHandle(form.idNo, form.idType)" placeholder="请选择">
                <el-option v-for="item in idTypeOptions" :key="item.value" :value="item.value" :label="item.label">
                  <span style="float: left">{{ item.label }}</span>
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="试用期到期日" prop="probationExpirationDate">
              <el-date-picker
                v-model="form.probationExpirationDate"
                type="date"
                placeholder="选择日期"
               >
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="证件号码" prop="idNo">
              <el-input
                v-model="form.idNo"
                @change="validHandle(form.idNo, form.idType)"
                @blur="validHandle(form.idNo, form.idType)"
                placeholder="请输入证件号码"></el-input>
              <div class="el-form-item__error" v-show="errorMsg.length">{{errorMsg}}</div>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="转正时间" prop="officialDate">
              <el-date-picker
                v-model="form.officialDate"
                type="date"
                placeholder="选择日期"
               >
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="手机号" prop="mobile">
              <el-input v-model="form.mobile" :maxlength="11" placeholder="请输入手机号码"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="状态" prop="status">
              <el-select class="filter-item" v-model="form.status" placeholder="请选择">
                <el-option v-for="item in workStatus" :key="item.value" :label="item.label" :value="item.value"> </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="邮箱" prop="email">
              <el-input v-model="form.email"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="10" v-show="form.status=='1'">
            <el-form-item label="离职原因" prop="dimissionReason">
              <!-- <el-input v-model="form.dimissionReason"></el-input> -->
              <el-select class="filter-item" v-model="form.dimissionReason" clearable placeholder="请选择">
                <el-option v-for="item in dimissionReason" :key="item.value" :value="item.value" :label="item.label">
                  <span style="float: left">{{ item.label }}</span>
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="学历" prop="education">
              <el-select class="filter-item" v-model="form.education" placeholder="请选择">
                <el-option v-for="item in educationType" :key="item.value" :value="item.value" :label="item.label">
                  <span style="float: left">{{ item.label }}</span>
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="10" v-show="form.status=='1'">
            <el-form-item label="离职时间" prop="employeeDate">
              <el-date-picker
                v-model="form.employeeDate"
                type="date"
                placeholder="选择日期"
               >
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="婚姻状况" prop="marriageStatus">
              <el-select class="filter-item" v-model="form.marriageStatus" clearable placeholder="请选择">
                <el-option v-for="item in marriageStatusOptions" :key="item.value" :value="item.value" :label="item.label">
                  <span style="float: left">{{ item.label }}</span>
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="职位" prop="positionId">
              <el-select class="filter-item" v-model="form.positionId" placeholder="请选择" @focus="handlePosition" @change="handleChange">
                <el-option v-for="item in positionsOptions" :key="item.positionId" :label="item.positionName" :value="item.positionId">
                  <span style="float: left">{{ item.positionName }}</span>
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="是否营销岗" prop="isMarketing">
              <el-radio-group v-model="form.isMarketing">
                <el-radio :label="1" style="display: inline-block">是</el-radio>
                <el-radio :label="0" style="display: inline-block">否</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="客户锁定状态" prop="lock">
              <el-radio-group v-model="form.lock">
                <el-radio :label="1" style="display: inline-block">锁定</el-radio>
                <el-radio :label="0" style="display: inline-block">正常</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        <!-- </el-row>
        <el-row :gutter="20"> -->
          <!-- <el-col :span="10">
            <el-form-item label="部门" prop="deptName">
              <el-input v-model="form.deptName" placeholder="选择部门"
                @focus="handleDept"
                @change="changeDept"
                readonly></el-input>
              <input type="hidden" v-model="form.deptId"/>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="职位" prop="positionId">
              <el-select class="filter-item" v-model="form.positionId" placeholder="请选择" @focus="handlePosition" @change="handleChange">
                <el-option v-for="item in positionsOptions" :key="item.positionId" :label="item.positionName" :value="item.positionId">
                  <span style="float: left">{{ item.positionName }}</span>
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="直属上级" prop="directSupervisorId">
              <el-select class="filter-item" v-model="form.directSupervisorId" placeholder="请选择" @focus="getDirectSupervisorList">
                <el-option v-for="item in directSupervisor" :key="item.userId" :label="item.name" :value="item.userId">
                  <span style="float: left">{{ item.name }}</span>
                </el-option>
              </el-select>
            </el-form-item>
          </el-col> -->

          <el-col :span="10">
            <el-form-item label="简历" prop="resumeUrl">
              <el-upload
                class="upload-demo"
                action="/zuul/admin/user/upload"
                :on-remove="handleRemove"
                :headers="headers"
                multiple
                :limit="1"
                :on-exceed="handleExceed"
                :on-success="handleSuccess"
                :file-list="fileList"
                :show-file-list="true"
                :before-upload="beforeUpload"
                accept=".pdf">
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
    </div>
    <!-- 查看 -->
    <el-form v-if="state==='view'&&step==='1'" :model="form" ref="form1" label-width="120px">
      <el-row :gutter="20">
          <el-col :span="10">
            <el-form-item label="姓名：" prop="name">
              {{form.name}}
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="用户名：" prop="username">
              {{form.username}}
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="部门：" prop="deptName">
              {{form.deptName}}
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="工号：" prop="empNo">
              {{form.empNo}}
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="角色：">
              {{form.roleName}}
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="性别：" prop="gender">
              {{form.gender|turnText1(genderType)}}
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="入职日期：" prop="date">
              {{form.employeeDate|parseTime('{y}-{m}-{d}')}}
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="证件类型：" prop="idType">
              {{form.idType|turnText1(idTypeOptions)}}
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="试用期到期日：" prop="probationExpirationDate">
              {{form.probationExpirationDate|parseTime('{y}-{m}-{d}')}}
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="证件号码：" prop="idNo">
              {{form.idNo}}
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="转正时间：" prop="officialDate">
              {{form.officialDate|parseTime('{y}-{m}-{d}')}}
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="手机号：" prop="mobile">
              {{form.mobile}}
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="状态：" prop="status">
              {{form.status|turnText1(workStatus)}}
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="邮箱：" prop="email">
              {{form.email}}
            </el-form-item>
          </el-col>
          <el-col :span="10" v-show="form.status=='1'">
            <el-form-item label="离职原因：" prop="dimissionReason">
              {{form.dimissionReason|turnText1(dimissionReason)}}
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="学历：" prop="education">
              {{form.education|turnText1(educationType)}}
            </el-form-item>
          </el-col>
          <el-col :span="10" v-show="form.status=='1'">
            <el-form-item label="离职时间：" prop="employeeDate">
              {{form.employeeDate|parseTime('{y}-{m}-{d}')}}
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="婚姻状况：" prop="marriageStatus">
              {{form.marriageStatus|turnText1(marriageStatusOptions)}}
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="职位：">
              {{form.positionId|turnText1(positionsOptions)}}
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="是否营销岗：" prop="isMarketing">
              {{form.isMarketing==1?'是':'否'}}
              <!-- <el-radio-group v-model="form.isMarketing">
                <el-radio :label="1" style="display: inline-block">是</el-radio>
                <el-radio :label="0" style="display: inline-block">否</el-radio>
              </el-radio-group> -->
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="账户锁定状态：" prop="lock">
              {{form.lock|turnText1(lockStatus)}}
              <!-- <el-radio-group v-model="form.lock">
                <el-radio :label="1" style="display: inline-block">锁定</el-radio>
                <el-radio :label="0" style="display: inline-block">正常</el-radio>
              </el-radio-group> -->
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="简历：" prop="resumeUrl">
              <a target="_blank" :href="form.resumeUrl" style="white-space: nowrap">{{form.resumeName}}</a>
            </el-form-item>
          </el-col>
      </el-row>
      <el-row>
        <el-col :span="22">
          <el-form-item label="备注：" prop="remark">
            {{form.remark}}
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <!-- 直属变更 -->
    <direct-change v-if="step==='2'" :propUserId="userId"></direct-change>
  </div>
</template>

<script>
  import { fetchList, getObj, addObj, putObj, delObj } from '@/api/user'
  import { deptRoleList, fetchDeptTree } from '@/api/role'
  import { getPositionName } from '@/api/posi'
  import { getAllPositon } from '@/api/queryConditions'
  import waves from '@/directive/waves/index.js' // 水波纹指令
  import { parseTime, transformText, transformText1, eachChildren } from '@/utils'
  import { mapGetters } from 'vuex'
  import ElRadioGroup from 'element-ui/packages/radio/src/radio-group'
  import ElOption from "element-ui/packages/select/src/option"
  import { isvalidMobile, isvalidID } from '@/utils/validate'
  import { getPYData } from '@/assets/data'
  import { getToken } from '@/utils/auth'
  import DirectChange from './directChange.vue'
  import Dept from 'components/dept'
  // import MyCascader from '@/components/MyCascader'

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
      // console.log(this.form.idType)
      callback(new Error('请输入证件号码'))
    } else if (!isvalidID(value)) {
      callback(new Error('请输入正确的证件号码'))
    } else {
      callback()
    }
  }

  export default {
    components: {
      ElOption,
      ElRadioGroup,
      DirectChange,
      // MyCascader
      Dept
    },
    name: 'table_user',
    directives: {
      waves
    },
    watch: {
      step(oldVal, newVal) {
        if (newVal == 2){
          this.initialization()
        }
      }
    },
    data() {
      return {
        // treeDeptData: [],
        checkedKeys: [],
        defaultProps: {
          children: 'children',
          label: 'name',
          value: 'id'
        },
        list: null,
        // listLoading: true,
        role: undefined,
        form: {
          name: '',
          // username: undefined,
          // password: undefined,
          // status: undefined,
          deptIds: [],
          roleList: [],
        },
        deptIds: [],
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
          gender: [
            {required: false, trigger: 'change', message: '请选择性别'}
          ],
          education: [
            {required: false, trigger: 'change', message: '请选择学历'}
          ],
          idType: [
            {required: false, trigger: 'change', message: '请选择证件类型'}
          ],
          marriageStatus: [
            {required: false, trigger: 'change', message: '请选择婚姻状况'}
          ],
          // idNo: [
          //   {required: false, trigger: 'blur', validator: validID}
          // ],
          employeeDate: [
            {required: true, trigger: 'change', message: '请选择入职日期'}
          ],
          role: [
            {required: true, trigger: 'change', message: '请选择角色'}
          ],
          positionName: [
            {required: true, trigger: 'change', message: '请选择职位'}
          ],
          email: [
            {required: false, trigger: 'blur', message: '请输入邮箱'}
          ],
          mobile: [
            {required: true, trigger: 'blur', validator: validMobile}
          ],
          isMarketing: [
            { required: true, trigger: 'change', message: '请选择是否是营销岗' }
          ],
          status: [
            { required: true, trigger: 'change', message: '请选择状态' }
          ],
          deptIds: [
            { required: true, trigger: 'blur', message: '请选择部门' }
          ]
        },
        // statusOptions: ['0', '1', '2'],
        positionsOptions: [],
        rolesOptions: [],
        userAdd: false,
        userUpd: false,
        userDel: false,
        dialogStatus: '',
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
        directSupervisor: [],
        step: '1',
        id: '',
        state: '',
        result: [],
        tempDeptIds: [],
        eachIndex: 0,
        curPrevId: '',
        userId: '',
        errorMsg: ''
      }
    },
    watch:{
      step(oldVal,newVal){
        if(newVal == 2){
          this.initialization();
        }
      }
    },
    computed: {
      ...mapGetters([
        'permissions',
        'educationType',
        'genderType',
        'idTypeOptions',
        'marriageStatusOptions',
        'workStatus',
        'dimissionReason',
        'lockStatus'
      ])
    },
    filters: {
      parseTime (time) {
        if(!time) return
        let date = new Date(time)
        return parseTime(date)
      }
    },
    created() {
      this.handlePosition()
      this.sys_user_add = this.permissions['sys_user_add']
      this.sys_user_upd = this.permissions['sys_user_upd']
      this.sys_user_del = this.permissions['sys_user_del']
      this.handleCreate()
      // this.handleDept()
    },
    mounted() {
      this.initialization()
    },
    methods: {
      // 员工基本信息初始化
      initialization() {
        this.id = this.$route.params.id
        this.state = this.$route.params.state
        if (this.id) {
          this.getList()
        } else {
          this.dialogStatus = 'create'
          this.state = this.dialogStatus
        }
      },
      getList() { // 编辑查询（查看）
        getObj(this.id)
          .then(response => {
            this.form = response.data
            this.form.isMarketing = this.form.isMarketing - 0
            this.form.lock = this.form.lock - 0
            if(this.form.roleList.length) {
              this.form.role = this.form.roleList[0].roleId
              this.form.roleName = this.form.roleList[0].roleDesc
            } else {
              this.form.role = ''
            }
            this.deptIds.push(this.form.deptId)
            this.form.deptIds = this.deptIds
            if(this.state === 'view') {
              this.dialogStatus = 'view'
              // this.form.positionId = transformText(this.positionsOptions, this.form.positionId)
            } else {
              this.dialogStatus = 'update'
              // this.form.directSupervisorId = this.form.directSupervisorId
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
            }
            this.getNodeData(response.data.deptId)
          })
      },
      getNodeData(id) { // 部门查询角色
        // this.form.deptId = data.id
        // this.form.deptName = data.name
        deptRoleList(id)
          .then(response => {
            this.rolesOptions = response.data
            // this.form.role = this.rolesOptions[0] ? this.rolesOptions[0].roleId : ''
          })
      },
      // getDirectSupervisorList() { // 直属上级查询
      //   // this.form.deptId = data.id
      //   // this.form.deptName = data.name
      //   getDirectSupervisorList()
      //     .then(response => {
      //       this.directSupervisor = response.data
      //       // this.role = this.rolesOptions[0] ? this.rolesOptions[0].roleId : ''
      //     })
      // },
      validHandle(val, type) {
        if (!val) {
          this.errorMsg = ''
          return false
        }
        if (type == '0') {
          // 身份证
          let reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/
          if (reg.test(val) === false) {
            this.errorMsg = '请输入正确的身份证号码'
            return false
          } else {
            this.errorMsg = ''
            return true
          }
        } else if (type == '1') {
          // 护照
          let reg = /^1[45][0-9]{7}|([P|p|S|s]\d{7})|([S|s|G|g]\d{8})|([Gg|Tt|Ss|Ll|Qq|Dd|Aa|Ff]\d{8})|([H|h|M|m]\d{8，10})$/
          if (reg.test(val) === false) {
            this.errorMsg = '请输入正确的护照号码'
            return false
          } else {
            this.errorMsg = ''
            return true
          }
        } else if (type == '2') {
          // 军官证
          let reg = /[\u4e00-\u9fa5](字第){1}(\d{4,8})(号?)$/
          if (reg.test(val) === false) {
            this.errorMsg = '请输入正确的军官证号码'
            return false
          } else {
            this.errorMsg = ''
            return true
          }
        } else if (type == '3') {
          // 台胞证
          let reg = /[A-Z][0-9]{9}/
          if (reg.test(val) === false) {
            this.errorMsg = '请输入正确的台胞证号码'
            return false
          } else {
            this.errorMsg = ''
            return true
          }
        } else if (type == '4') {
          // 港澳通行证
          let reg = /^[a-zA-Z0-9]{5,21}$/
          if (reg.test(val) === false) {
            this.errorMsg = '请输入正确的港澳通行证号码'
            return false
          } else {
            this.errorMsg = ''
            return true
          }
        } else if (type == '5') {
          // 其他
          // let reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/
          // if (reg.test(val) === false) {
          //   this.errorMsg = '请输入正确的证件号码'
          //   return false
          // } else {
          //   this.errorMsg = ''
          //   return true
          // }
        }
        this.errorMsg = ''
      },
      handlePosition() {
        getAllPositon().then(res => {
          this.positionsOptions = res.data
        })
      },
      handleChageRole(val) {
        this.rolesOptions = this.rolesOptions.slice(0)
      },
      changeDept(val) {
        this.form.role = ''
        this.getNodeData(val[val.length - 1])
        // this.role = ''
      },
      handleCreate() {
        this.resetTemp()
        // this.dialogStatus = 'create'
        this.PYCode = getPYData() // 获取拼音数据
      },
      create(formName) {
        const set = this.$refs
        // this.form.role = this.role
        // this.form.positionId = this.form.positionName
        // this.form.idType = this.IDType
        set[formName].validate(valid => {
          if (valid) {
            this.form.deptId = this.form.deptIds[this.form.deptIds.length - 1]
            addObj(this.form)
              .then((res) => {
                if (res.status === 200) {
                  // this.getList()
                  this.$notify({
                    title: '成功',
                    message: '创建成功',
                    type: 'success',
                    duration: 2000
                  })
                  this.step = '2'
                  this.userId = res.data.data
                }
              })
          } else {
            return false
          }
        })
      },
      cancel(formName) {
        this.$refs[formName].resetFields()
        this.$router.push('/admin/user')
      },
      update(formName) { // 编辑提交
        const set = this.$refs
        if(isNaN(this.form.role - 0)) {
          this.form.role = this.form.roleList[0].roleId
        }
        set[formName].validate(valid => {
          if (valid) {
            // this.form.positionId = this.form.positionName
            if(this.fileList.length) {
              this.form.resumeName = this.fileList[0].name
              // this.form.resumeName = this.fileList[0].response.fileName
              this.form.resumeUrl =  this.fileList[0].url || this.fileList[0].response.fileUrl
            } else {
              this.form.resumeName = ''
              this.form.resumeUrl =''
              this.fileList = []
            }
            this.form.deptId = this.form.deptIds[this.form.deptIds.length - 1]
            putObj(this.form).then(() => {
              // this.getList()
              this.$notify({
                title: '成功',
                message: '修改成功',
                type: 'success',
                duration: 2000
              })
              this.step = '2'
            })
          } else {
            return false
          }
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
        this.fileList = []
        // console.log(file, fileList)
      },
      handleExceed(files, fileList) {
        this.$message.warning(`当前限制选择 1 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`)
      },
      handleSuccess(files, fileList) {
        this.fileList.push(fileList)
        this.form.resumeName = fileList.response.fileName
        this.form.resumeUrl = fileList.response.fileUrl
      },
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
      },
      getPYCode(val) {
        this.form.username = this.covertPY(val)
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

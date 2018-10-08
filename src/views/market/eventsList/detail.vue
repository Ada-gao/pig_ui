<template>
<div class="app-container calendar-list-container">
  <nav class="filter-container">
    <el-button-group>
      <el-button :class="{add_btn:labelButton=='eventDetails'}" @click="changeButton('eventDetails')">活动详情</el-button>
      <el-button v-if="!(url == 'add') && activity_poster_edit" :class="{add_btn:labelButton=='eventPoster'}" @click="changeButton('eventPoster')">活动海报</el-button>
      <el-button v-if="!(url == 'add') && activityStatusId == 1 && activity_client_query" :class="{add_btn:labelButton=='registrationCheck'}" @click="changeButton('registrationCheck')">报名/签到</el-button>
      <el-button v-if="!(url == 'add') && activity_signin_account_query" :class="{add_btn:labelButton=='checkinAccount'}" @click="changeButton('checkinAccount')">签到帐号</el-button>
      <el-button v-if="!(url == 'add') && activityStatusId == 1 && activity_contract_query" :class="{add_btn:labelButton=='signingRecord'}" @click="changeButton('signingRecord')">签单记录</el-button>
      <el-button v-if="!(url == 'add') && activity_log_query" :class="{add_btn:labelButton=='operationLog'}" @click="changeButton('operationLog')">操作日志</el-button>
    </el-button-group>
  </nav>
  <!-- 活动海报 eventPoster-->
  <event-poster v-if=" labelButton =='eventPoster' " :form="childrenForm"></event-poster>
  <!-- 报名/签到 registrationCheck -->
  <registration-check v-if=" labelButton =='registrationCheck' "></registration-check>
  <!-- 签到账号 checkinAccount -->
  <checkin-account v-if=" labelButton =='checkinAccount' "></checkin-account>
  <!--  签单记录 signingRecord-->
  <signing-record v-if=" labelButton =='signingRecord' "></signing-record>
  <!-- 操作日志 operationLog-->
  <operation-log v-if=" labelButton =='operationLog' "></operation-log>

  <!-- 活动详情 eventDetails-->
  <el-form v-if="labelButton == 'eventDetails' " :model="form" :rules="rules" ref="ruleForm" label-width="110px" style="width: 90%" class="events-detail">
    <!-- 活动基本信息 -->
    <article>
      <p class="title">活动基本信息</p>
       <el-row v-if="!(url == 'add') " type="flex" class="row-bg" justify="space-between">
        <el-col :span="11">
          <el-form-item label="活动编号">
            <span v-if="url == 'view'">{{form.activityCode}}</span>
            <el-input v-else v-model="form.activityCode" disabled></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row type="flex" class="row-bg" justify="space-between">
        <el-col :span="11">
          <el-form-item label="活动名称" prop="activityName">
            <span v-if="url == 'view'">{{form.activityName}}</span>
            <el-input v-else v-model="form.activityName"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="活动类型" prop="activityType">
            <span v-if="url == 'view'">{{form.activityType}}</span>
            <el-select v-else v-model="form.activityType"  placeholder="请选择"  style="width: 100%;">
              <el-option v-for="item in activityTypeList" :key="item.value"  :label="item.label"  :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row type="flex" class="row-bg" justify="space-between">
        <el-col :span="11">
          <el-form-item label="活动负责人" prop="activityPrincipalList">
            <span v-if="url == 'view'" v-for="(item,index) in form.activityPrincipalList" :key="item.vid">
            {{item.val}}<span v-if="index != form.activityPrincipalList.length-1">|</span></span>
            <el-select v-if="url != 'view'" v-model="form.activityPrincipalList" multiple placeholder="请选择" style="width: 100%;">
              <el-option v-for="item in activityLeader" :key="item.userId" :label="item.name" :value="item.userId">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="活动人数(人)" prop="activityActivitiesNumber">
            <span v-if="url == 'view'">{{form.activityActivitiesNumber}}</span>
            <el-input v-else v-model="form.activityActivitiesNumber"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row type="flex" class="row-bg" justify="space-between">
        <el-col :span="11">
          <el-form-item label="活动时间" prop="activityData">
          <span v-if="url == 'view'">{{form.activityData[0] | parseTime}} - {{form.activityData[1] | parseTime}}</span>
            <el-date-picker v-else style="width:100%" v-model="form.activityData" type="datetimerange" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期">
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="报名时间" prop="registrationData">
            <span v-if="url == 'view'">{{form.registrationData[0] | parseTime}} - {{form.registrationData[1] | parseTime}}</span>
            <el-date-picker v-else style="width:100%" v-model="form.registrationData" type="datetimerange" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期">
            </el-date-picker>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row type="flex" class="row-bg" justify="space-between">
        <el-col :span="11">
          <el-form-item label="活动地址" prop="activitySite">
            <span v-if="url == 'view'">{{form.activitySite}}</span>
            <el-input v-else v-model="form.activitySite"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="主办部门" prop="activityDeptList">
          <span v-if="url == 'view'" v-for="(item,index) in form.activityDeptList" :key="item.id" :value="item.id">
              {{item.val}}
              <span v-if="index != form.activityDeptList.length-1">|</span></span>
            <el-select  v-if="url != 'view'"  v-model="form.activityDeptList" multiple placeholder="请选择" style="width: 100%;">
              <el-option v-for="item in rootList" :key="item.id" :label="item.name" :value="item.id">
              </el-option>
            </el-select>
              
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="活动简介">
            <span v-if="url == 'view'">{{form.activityIntroduction}}</span>
            <el-input v-else v-model="form.activityIntroduction" type="textarea" :rows="4" placeholder="请输入内容">
            </el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <!-- <el-row type="flex" justify="end">
          <el-button class="search_btn"><svg-icon icon-class="add"></svg-icon>新增属性</el-button>
        </el-row> -->
    </article>
    <!-- 活动可见范围（员工） -->
    <article style="margin-top:40px">
      <p class="title">活动可见范围（员工）</p>
      <el-form-item>
        <el-radio-group v-model="form.activityRangeType" v-if="url != 'view'">
          <el-radio :label="'0'">全部可见</el-radio>
          <el-radio :label="'1'">部分可见</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="参与部门" v-if="form.activityRangeType == 1 || url == 'view'">
        <el-row v-if="url == 'view'">
          <el-col v-if="form.activityRangeType == 0">全部可见</el-col>
          <el-col> 
            <span style="padding: 0 6px" class="c-select-list" v-for="(item,index) in activityRangeDeptListLabel" :key="index">{{item}}</span>
          </el-col>
        </el-row>
        <el-row type="flex" justify="space-between" v-else>
          <el-col class="c-select">
            <span class="c-select-list" v-for="(item,index) in activityRangeDeptListLabel" :key="index">{{item}}</span>
          </el-col>
          <el-button class="search_btn" style="height:40px;" @click="selectDepartment('activityRangeDeptList')">选择部门</el-button>
        </el-row>
      </el-form-item>
      <el-form-item label="参与职位" v-if="form.activityRangeType == 1 || url == 'view'">
        <el-row v-if="url == 'view'">
          <el-col v-if="form.activityRangeType == 0">全部可见</el-col>
          <el-col> 
            <span style="padding: 0 6px" class="c-select-list" v-for="(item,index) in activityRangePositionListLabel" :key="index">{{item}}</span>
          </el-col>
        </el-row>
        <el-row type="flex" justify="space-between" v-else>
          <el-col class="c-select">
            <span class="c-select-list" v-for="(item,index) in activityRangePositionListLabel" :key="index">{{item}}</span>
          </el-col>
          <el-button class="search_btn" style="height:40px;" @click="selectDepartment('activityRangePositionList')">选择职位</el-button>
        </el-row>
      </el-form-item>
    </article>
    <!--  活动可见范围（客户）-->
    <article style="margin-top:40px">
      <p class="title">活动可见范围（客户）</p>
      <el-form-item>
        <el-radio-group v-model="form.activityClientLabelType"  v-if="url != 'view'">
          <el-radio :label="'0'">全部可见</el-radio>
          <el-radio :label="'1'">部分可见</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="客户标签" v-if="form.activityClientLabelType == 1 || url == 'view'">
       <el-row v-if="url == 'view'">
          <el-col v-if="form.activityRangeType == 0">全部可见</el-col>
          <el-col> 
             <span style="padding: 0 6px" class="c-select-list" v-for="(item,index) in activityClientLabelListLabel" :key="index">{{item}}</span>
          </el-col>
        </el-row>
        <el-row type="flex" justify="space-between" v-else>
          <el-col class="c-select">
            <span class="c-select-list" v-for="(item,index) in activityClientLabelListLabel" :key="index">{{item}}</span>
          </el-col>
          <el-button class="search_btn" style="height:40px;" @click="selectDepartment('activityClientLabelList')">选择标签</el-button>
        </el-row>
      </el-form-item>
    </article>
    <!--  活动分享渠道-->
    <article style="margin-top:40px">
      <p class="title">活动分享渠道</p>
      <el-form-item>
        <el-row  v-if="url == 'view'">
          <el-col :span="2" v-for="item in form.activityShare" :key="item">{{item | activityShare}}</el-col>
        </el-row>
        <el-checkbox-group v-model="form.activityShare" v-else>
          <el-checkbox label="0">微信好友</el-checkbox>
          <el-checkbox label="1">微信朋友圈</el-checkbox>
          <el-checkbox label="2">QQ好友</el-checkbox>
        </el-checkbox-group>
      </el-form-item>
    </article>
    <!--  C端展示图-->
    <article class="image-display" style="margin-top:40px">
      <p class="title">C端展示图</p>
      <el-form-item>
        <el-upload
          :limit="9"
          :on-exceed="handleExceed"
         action="/activity/file/upload"
         list-type="picture-card"
         :file-list="fileList"
          :before-upload="beforeAvatarUpload"
          :on-success="handlePictureSuccess"
          :on-preview="handlePictureCardPreview" 
          :on-error="upfileError"
          :on-remove="handleRemove">
          <svg-icon icon-class="add" class="common_btn"></svg-icon>
          <p class="img-title">点击添加图片</p>
          <p class="img-text">jpg/png文件，尺寸750x1334px</p>
          <p class="img-text">小于1M，最多9张</p>
        </el-upload>
        <el-dialog :visible.sync="dialogVisible">
          <img width="100%" :src="dialogImageUrl" alt="">
        </el-dialog>
      </el-form-item>
    </article>

     <div style="text-align: center;" v-if="url != 'view'">
      <!-- <el-button class="search_btn">上一步</el-button> -->
      <el-button v-if="url == 'edit' && activity_release" class="add_btn" @click="releaseEvent">发布活动</el-button>
      <el-button class="add_btn" @click="save('ruleForm')">保 存</el-button>
      <el-button class="search_btn" @click="cancelSava">取 消</el-button>
      <!-- <router-link class="el-button search_btn el-button--default" to="/market/eventsList" >取 消</router-link> -->
    </div>
  </el-form>

  <!-- 参与部门对话框 -->
  <el-dialog title="提示" :visible.sync="dialogDepartment" width="30%">
    <article class="table-event">
      <div class="thead">所有部门</div>
      <div class="tbody">
        <el-tree show-checkbox :node-key="nodeKey"  :data="treeDepartmentData" ref="activityRangeDeptList" :props="defaultProps"></el-tree>
      </div>
    </article>
    <div slot="footer" class="dialog-footer">
      <el-button class="search_btn" @click="cancel">取 消</el-button>
      <el-button class="add_btn" @click="update">确 定</el-button>
    </div>
  </el-dialog>
  <!-- 参与职位对话框 -->
  <el-dialog title="提示" :visible.sync="dialogPosition" width="30%">
    <article class="table-event">
      <div class="thead">所有职位</div>
      <div class="tbody">
        <el-tree show-checkbox :node-key="nodeKey" :data="treePositionData" ref="activityRangePositionList" :props="defaultProps"></el-tree>
      </div>
    </article>
    <div slot="footer" class="dialog-footer">
      <el-button class="search_btn" @click="cancel">取 消</el-button>
      <el-button class="add_btn" @click="update">确 定</el-button>
    </div>
  </el-dialog>
  <!-- 客户标签对话框 -->
  <el-dialog title="提示" :visible.sync="dialogCustomerLabel" width="30%">
    <article class="table-event">
      <div class="thead">所有标签</div>
      <div class="tbody">
        <el-tree show-checkbox :node-key="nodeKey" :data="treeCustomerLabelData" ref="activityClientLabelList" :props="defaultProps"></el-tree>
      </div>
    </article>
    <div slot="footer" class="dialog-footer">
      <el-button class="search_btn" @click="cancel">取 消</el-button>
      <el-button class="add_btn" @click="update">确 定</el-button>
    </div>
  </el-dialog>

</div>
</template>
<script>
import {mapGetters,mapState} from 'vuex'
import {getDirectSupervisorList} from '@/api/user'
import {getDeptRoots} from '@/api/dept'
import { getAllPositon} from '@/api/queryConditions'
import {getAllDeparts} from '@/api/achievement/index'
import {getClientList} from '@/api/client/customerLabel'
import {addActivity,editActivity,releaseEvent} from '@/api/market/eventsList'
import {getSysSelectValueList} from '@/api/market/setting'
import eventPoster from './components/eventPoster.vue'
import registrationCheck from './components/registrationCheck.vue'
import checkinAccount from './components/checkinAccount.vue'
import signingRecord from './components/signingRecord.vue'
import operationLog from './components/operationLog.vue'
export default {
  name: 'eventsDetail',
  components: {
    eventPoster,
    registrationCheck,
    checkinAccount,
    signingRecord,
    operationLog
  },
  data() {
     var validatePass = (rule, value, callback) => {
        let reg = /^[0-9]+.?[0-9]*$/;
        if(!reg.test(value)){
         callback(new Error('活动人数必须为数字值'));
        }else{
           callback()
        }

      };
    return {
      fileList: [],
      rules: {
        activityName: [{
          required: true,
          message: '请输入活动名称'
        }],
        activityType: [{
          required: true,
          message: '请输入活动类型',
        }],
        activityPrincipalList: [{
          required: true,
          message: '请选择活动负责人'
        }],
        activityActivitiesNumber: [{
          required: true,
          message: '请输入活动人数'
        },
        { validator: validatePass}],
        activityData: [{
          required: true,
          message: '请选择活动时间'
        }],
        registrationData: [{
          required: true,
          message: '请选择报名时间'
        }],
        activitySite: [{
          required: true,
          message: '请输入活动地址'
        }],
        activityDeptList: [{
          required: true,
          message: '请选择主办部门'
        }]
      },
      selectIdentification: '',
      form: null,
      childrenForm:null,
      shuttleList: [],
      activityLeader: [],
      activityTypeList:[],
      jobList: [],
      rootList: [],
      dialogDepartment: false,
      dialogPosition: false,
      dialogCustomerLabel: false,
      treeDepartmentData: [],
      treePositionData: [],
      treeCustomerLabelData: [],
      labelButton: 'eventDetails',
      activityRangeDeptListLabel: [],
      activityRangeDeptList:[],
      activityRangePositionListLabel: [],
      activityClientLabelListLabel: [],
      nodeKey: '',
      defaultProps: {
        children: 'children',
        label: '',
        id: ''
      },
      dialogImageUrl: '',
      dialogVisible: false,
      url : this.$route.path.split('/')[3],
      activityId:this.$route.params.activityId,
      activityStatusId:''
    }
  },
  computed: {
    ...mapGetters([
      'permissions'
    ]),
    activityRangeType(){
      return  this.form && this.form.activityRangeType 
    }
  },
  watch: {
 activityRangeType(val){
        
         if(val == 0){
            this.getAllDeparts()
         }
         else{
          // console.log(this.form.activityRangeDeptList)
          // if(!this.form.activityRangeDeptList){
          //    this.activityRangeDeptListLabel = []
          //  } else{

          //  }
         
         }
    }
  },
  created() {
      // 获取活动类型列表
    this.getSysSelectValueList()
    if(this.url != 'add')  this.editActivity()
    // 初始化 form
    this.initialization();
    // 获取 所有用户
    this.getDirectSupervisorList();
  

    // 获取一级部门及子公司列表
    this.getDeptRoots();
    this.activity_poster_edit = this.permissions['activity_poster_edit']//市场活动海报编辑
    this.activity_signin_account_query = this.permissions['activity_signin_account_query'] //查询签到账号
    this.activity_client_query = this.permissions['activity_client_query']//活动客户查询
    this.activity_contract_query = this.permissions['activity_contract_query']//查询签单记录
    this.activity_log_query = this.permissions['activity_log_query']//查询活动操作日志
    this.activity_release = this.permissions['activity_release']//市场活动发布
  },
  mounted() {
  // 获取所有的部门
    this.getAllDeparts()
    // 查询全部职位
    this.getAllPositon()
    //获取客户标签列表
    this.getClientList()
  },

  filters:{
    activityShare(val){
      let self;
      if(val === '0') self = '微信好友'
      if(val === '1') self = '微信朋友圈'
      if(val === '2') self = 'QQ好友'
      return self

    }
  },
  methods: {
    // handleCheckChange(data, checked, indeterminate) {
    //   if(checked){
    //     if(data.children.length>0){
    //       data.children.forEach(item=>{
    //          this.form['activityRangeDeptList'].push(item.id);
    //           this['activityRangeDeptList' + 'Label'].push(item.name);
    //         if(item.children.length>0){
    //           item.children.forEach(item=>{
    //              this.form['activityRangeDeptList'].push(item.id);
    //           this['activityRangeDeptList' + 'Label'].push(item.name);
    //           })
    //         }
    //       })
    //     }
    //   }
        
    //   },

    // 表单数据初始化
    initialization() {
      this.form = {
        activityName: '', //活动名称
        activityType: '', //活动类型
        activityPrincipalList: '', //活动负责人
        activityActivitiesNumber: '', //活动人数
        activityData: [], //活动时间
        registrationData: [], //报名时间
        activitySite: '', //活动地址
        activityDeptList: '', //主办部门
        activityRangeType: '0', //活动可见范围（员工）
        activityRangeDeptList: [], //参与部门(可见部门)
        activityRangePositionList: [], //参与职位(可见职位)
        activityClientLabelType: '0', //活动可见范围（客户）
        activityClientLabelList: [], //客户标签(可见客户标签)
        activityShare: [], //活动分享渠道
        activityForeendPictureList: [], //C端展示图
        activityStatusId:0,
        activityRangeDeptSelfList:[]
      }
    },
    //我为数组添加键值id
    arrayId(arr){
      let array = []
      arr.forEach(item=>{
        array.push({"vid":item.vid || item})
      })

      return array
    }, 
    //保存提交
    save(formName) {
     
      this.$refs[formName].validate((valid) => {
        if (valid) {
           const newObj = {}
           let method
          Object.assign(newObj,this.form)
          newObj.activityPrincipalList = this.arrayId(newObj.activityPrincipalList)
           newObj.activityDeptList = this.arrayId(newObj.activityDeptList)
          newObj.activityRangeDeptList = this.arrayId(newObj.activityRangeDeptList)
          newObj.activityRangePositionList = this.arrayId(newObj.activityRangePositionList)
          newObj.activityClientLabelList = this.arrayId(newObj.activityClientLabelList)
          newObj.activityShare = newObj.activityShare.join('|')
          newObj.activityStart = newObj.activityData[0]
          newObj.activityEnd = newObj.activityData[1]
          newObj.registrationStart = newObj.registrationData[0]
          newObj.registrationEnd = newObj.registrationData[1]
          if(this.form.activityClientLabelType == 0){
             newObj.activityClientLabelList = []
          }
          if(this.form.activityRangeType == 0){
            newObj.activityRangeDeptList = this.activityRangeDeptList
            newObj.activityRangePositionList = []

          }else{
            if(this.form.activityRangeDeptList.length<1){
               this.$notify({
                title: '警告',
                message: '参与部门不能为空',
                type: 'warning'
              });
               return false
            }
          }
          // newObj.activityRangeDeptSelfList = this.activityRangeDeptSelfList
          if(this.url == 'add'){
            method = "post"
          }else{
            method = "put"
            newObj.activityId = this.activityId
          }
          const loading = this.$loading()
          addActivity(newObj,method).then(res => {
           if(res.status ==200){
            this.$notify({
              title: '成功',
              message: '保存成功',
              type: 'success'
            });
             loading.close()
            this.$router.push(`/market/eventsList/edit/${res.data.data}`)
           }
         
          })
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    // 通过id查询活动信息
    editActivity(){
      editActivity(this.activityId).then(res=>{
        if(res.status == 200){
          //  Object.assign(this.childrenForm ,res.data)
           this.childrenForm = JSON.parse(JSON.stringify(res.data));
          this.form = this.editProcess(res.data)
          this.activityStatusId = this.form.activityStatusId
          if(this.url == 'view'){
            document.querySelectorAll('.events-detail .image-display .el-upload--picture-card')[0].style.display="none"
            this.$nextTick(()=>{
                document.querySelectorAll('.el-upload-list__item-delete')[0].style.display="none"
            })
             
            }
       
        }
      })
    },
    // 通过id查询活动信息 转成可现实的数据
    editProcess(data){
          // 活动负责人
         const activityPrincipalList = []
         // 主办部门
         const activityDeptList = []
         const activityRangeDeptList = []
         const activityRangePositionList = []
         const activityClientLabelList = []
          this.fileList = []
          data.activityData = [data.activityStart,data.activityEnd]
          data.registrationData = [data.registrationStart,data.registrationEnd]
          data.activityShare = data.activityShare.split('|')
       
          // 在编辑的状态下
          if(this.url == 'edit'){
            data.activityPrincipalList.forEach(item=>{
              activityPrincipalList.push(item.vid)
            })
            data.activityDeptList.forEach(item=>{
              activityDeptList.push(item.vid)
            })
            data.activityPrincipalList = activityPrincipalList
            data.activityDeptList = activityDeptList
          }else if(this.url == 'view'){// 在查看的状态下
            this.activityTypeList.forEach(item=>{
              if(item.value == data.activityType){
                data.activityType = item.label
              }
            })
          }

          // 可见范围 参与部门
          data.activityRangeDeptList.forEach(item=>{
            this.activityRangeDeptListLabel.push(item.val)
            activityRangeDeptList.push(item.vid);
          })
          data['activityRangeDeptList'] = activityRangeDeptList

          // 可见范围 参与职位
          data.activityRangePositionList.forEach(item=>{
            this.activityRangePositionListLabel.push(item.val)
            activityRangePositionList.push(item.vid);
          })
          data['activityRangePositionList'] = activityRangePositionList

           // 活动可见范围 客户标签
          data.activityClientLabelList.forEach(item=>{
            this.activityClientLabelListLabel.push(item.val)
            activityClientLabelList.push(item.vid);
          })
          data['activityClientLabelList'] = activityClientLabelList

          // C端展示图
          data.activityForeendPictureList.forEach(item=>{
            this.fileList.push({url:item.val})
          })
          if(data.activityRangeType == 0){
            data.activityRangeDeptList = []
            this.activityRangeDeptListLabel = []

          }
          return data
    },
    // 获取活动类型列表
      getSysSelectValueList() {
        getSysSelectValueList('activity_type').then(response => {
          if(response.status == 200){
            this.activityTypeList = response.data
          }
        })
      },
    // 查询所有用户
    getDirectSupervisorList() {
      getDirectSupervisorList().then(res => {
        if (res.status == 200) {
          this.activityLeader = res.data
        }
      })
    },
    //获取一级部门及子公司列表
    getDeptRoots() {
      getDeptRoots().then(response => {
        if (response.status == 200) {
          this.rootList = response.data;
        }
      })
    },
    getAllDepartsList(data){

      this.activityRangeDeptList = []
      this.form.activityRangeDeptSelfList = []

      data.forEach(item=>{
        this.activityRangeDeptList.push({vid:item.id})
        if(item.children.length>0){
          this.activityRangeDeptList.push({vid:item.id})
          if(item.length>0){
            this.activityRangeDeptList.push({vid:item.id})
          }
        }
      })
    },
    // 获取所有  部门
    getAllDeparts(select) {
      getAllDeparts().then(res => {
        if (res.status == 200) {
          this.treeDepartmentData = res.data;
          this.getAllDepartsList(res.data)
        }
      })
    },
    // 查询全部职位
    getAllPositon(select) {
      getAllPositon().then(res => {
        if (res.status == 200) {
          this.treePositionData = res.data;
          // this.$nextTick(() => {
          //   this.$refs[select].setCheckedKeys(this.form[select])
          // })

        }
      })
    },
    //获取客户标签列表
    getClientList(select) {
      getClientList().then(res => {
        if (res.status == 200) {
          this.treeCustomerLabelData = res.data;
          // this.$nextTick(() => {
          //   this.$refs[select].setCheckedKeys(this.form[select])
          // })
        }
      })
    },
    changeButton(state) {
      this.labelButton = state
      if(state == 'eventDetails') this.editActivity()
    },
    // 选择 部门 职位 客户标签  对话框
    selectDepartment(select) {
      this.selectIdentification = select;
      if (this.selectIdentification == 'activityRangeDeptList') {
        this.dialogDepartment = true;
        // this.getAllDeparts(select); //  获取所有  部门
        this.defaultProps = {
          children: 'children',
          label: 'name',
          id: 'id'
        }
      }
      if (this.selectIdentification == 'activityRangePositionList') {
          this.dialogPosition = true;
        // this.getAllPositon(select); // 查询全部职位
        this.defaultProps = {
          label: 'positionName',
          id: 'positionId'
        }
      }
      if (this.selectIdentification == 'activityClientLabelList') {
          this.dialogCustomerLabel = true;
        // this.getClientList(select); //获取客户标签列表
        this.defaultProps = {
          label: 'labelName',
          id: 'clientLabelId'
        }
      }
      this.nodeKey = this.defaultProps.id;
          this.$nextTick(() => {
            this.$refs[select].setCheckedKeys(this.form[select])
          })

      //  this.selectIdentification && (this.dialogFormVisible = true);
    },
    cancel() {
      this.dialogDepartment = false;
      this.dialogPosition = false;
      this.dialogCustomerLabel = false;
    },
    // 穿梭列表添加
    update() {
      let obj = null;
      let select = this.selectIdentification;
      let checkedNodes = this.$refs[select].getCheckedNodes();
      let parentIdArr = []
      let DepartmentId = []
      let activityRangeDeptSelfList = []
      this.form[select] = []
      this[select + 'Label'] = []
      this.form.activityRangeDeptSelfList = []
      if (select == 'activityRangeDeptList') obj = {
        id: 'id',
        label: 'name'
      }
      if (select == 'activityRangePositionList') obj = {
        id: 'positionId',
        label: 'positionName'
      }
      if (select == 'activityClientLabelList') obj = {
        id: 'clientLabelId',
        label: 'labelName'
      }
      checkedNodes.forEach(item => {
        this.form[select].push(item[obj.id]);
        this[select + 'Label'].push(item[obj.label]);
        parentIdArr.push(item.parentId)
      })
      if(select == 'activityRangeDeptList'){
      //获取所有部门的id 
      this.treeDepartmentData.forEach(item=>{
        DepartmentId.push(item)
        if(item.children){
          item.children.forEach(item=>{
            DepartmentId.push(item)
          })
        }
       })
      // 数组去重
      parentIdArr = Array.from(new Set(parentIdArr));
      parentIdArr.forEach(parentId=>{
        DepartmentId.forEach(item=>{
          if(parentId == item.id){
            activityRangeDeptSelfList.push(item.id)
            DepartmentId.forEach(itemChild=>{
              if(item.parentId == itemChild.id){
                 activityRangeDeptSelfList.push(itemChild.id)
              }
            })
          }
        })
      })

       activityRangeDeptSelfList = Array.from(new Set(activityRangeDeptSelfList))
       
       this.form[select].forEach(item=>{
        activityRangeDeptSelfList.forEach((item1,index)=>{
          if(item == item1){
            activityRangeDeptSelfList.splice(index,1)
          }
        })
       })
     activityRangeDeptSelfList.forEach(item=>{
        this.form.activityRangeDeptSelfList.push({vid:item})
     })
     }
      this.$refs[select].setCheckedKeys([]);
      // 关掉弹框
      this.cancel()
    },
    // 文件上传成功时的钩子
    handlePictureSuccess(file, fileList) {
      this.form.activityForeendPictureList.push({val:file.url})
    },
    // 文件列表移除文件时的钩子
    handleRemove(file, fileList) {
      let url = file.name ? file.response.url : file.url
      this.form.activityForeendPictureList.forEach((item,index)=>{
        if(item.val == url) this.form.activityForeendPictureList.splice(index, 1);
      })
    },
    // 点击文件列表中已上传的文件时的钩子
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    // 文件上传失败时的钩子
    upfileError(file, fileList) {
      console.log(file)
      console.log(fileList)
    },
    // 文件超出个数限制时的钩子
    handleExceed(files, fileList){
        this.$notify({
          title: '警告',
          message: `当前限制选择 9 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`,
          type: 'warning'
        });
    },
    // 上传文件之前的钩子
    beforeAvatarUpload(file, json) {
      const isJPG = file.type === 'image/jpeg' || file.type === 'image/png';
      const isLt2M = file.size / 1024 / 1024 < 1;
    
      if (!isJPG) {
        this.$notify({
          title: '警告',
          message: '上传头像图片只能是 jpg/png 格式!',
          type: 'warning'
        });
        return false;
      }
      if (!isLt2M) {
        this.$notify({
          title: '警告',
          message: '上传头像图片大小不能超过 1MB!',
          type: 'warning'
        });
        return false;
      }
      const isSize = new Promise(function(resolve, reject) {
        let width = 750;
        let height = 1334;
        let _URL = window.URL || window.webkitURL;
        let img = new Image();
        img.onload = function() {
          let valid = (img.width == width) && (img.height == height);
          valid ? resolve() : reject();
        }
        img.src = _URL.createObjectURL(file);
      }).then(() => {
        return file;
      }, () => {
        this.$notify({
          title: '警告',
          message: '上传头像图片必须是750*1334',
          type: 'warning'
        });
        return Promise.reject();
      });
      return isJPG && isLt2M && isSize;

    },
    // 取消保存
    cancelSava(){
      this.$confirm('确认取消后不保存数据！', '取消提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
         this.$router.push('/market/eventsList')
        })
      
    },
    // 发布活动
    releaseEvent(){
         if(this.activityStatusId == 0){
      releaseEvent(this.activityId).then(res=>{
        if(res.status == 200){
          this.$confirm('确认发布活动后，活动将在app端展示！', '发布活动', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              this.$notify({
                title: '成功',
                message: '发布成功',
                type: 'success'
              });
            })
        }
      })
    }else{
       this.$notify({
          title: '警告',
          message: '该活动已经发布',
          type: 'warning'
        });
    }
    },
  }
}
</script>

<style lang="scss" scoped>
.title {
    font-family: PingFangSC-Medium;
    font-size: 16px;
    color: #2F2F2F;
    letter-spacing: 0;
    border-bottom: 1px solid #E9E9E9;
    padding-bottom: 10px;
}

.image-display {
    .add-img-btn {}
}
.c-select {
    padding: 0 16px;
    background: #FFFFFF;
    border: 1px solid #C8C8C8;
    border-radius: 2px;
    margin-right: 10px;
    .c-select-list {
        padding: 2px 6px;
        margin: 0 6px;
        background: rgba(0,193,223,0.10);
        border: 1px solid rgba(32,160,255,0.20);
        border-radius: 4px;
        font-family: PingFangSC-Regular;
        color: #0299CC;
        letter-spacing: 0;
        line-height: 14px;
        display: inline-block;
    }
}
.table-event {
    border-collapse: collapse;
    background: #FFFFFF;
    border: 1px solid #C8C8C8;
    border-radius: 2px;
    width: 100%;
    text-align: left;
    .thead {
        background: #F7F8FA;
        border-bottom: 1px solid #C8C8C8;
        font-family: PingFangSC-Medium;
        font-size: 13px;
        color: #475669;
        letter-spacing: 0;
        font-weight: inherit;
        padding: 6px;
    }
    .tbody {
        padding: 6px;
        height: 400px;
        overflow: auto;
    }
}
</style>

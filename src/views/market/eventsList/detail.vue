<template>
  <div class="app-container calendar-list-container">
    <nav class="filter-container">
      <el-button-group>
        <el-button :class="{add_btn:labelButton=='eventDetails'}" @click="changeButton('eventDetails')">活动详情</el-button>
        <el-button :class="{add_btn:labelButton=='eventPoster'}" @click="changeButton('eventPoster')">活动海报</el-button>
        <el-button :class="{add_btn:labelButton=='registrationCheck'}" @click="changeButton('registrationCheck')">报名/签到</el-button>
        <el-button :class="{add_btn:labelButton=='checkinAccount'}" @click="changeButton('checkinAccount')">签到帐号</el-button>
        <el-button :class="{add_btn:labelButton=='signingRecord'}" @click="changeButton('signingRecord')">签单记录</el-button>
        <el-button :class="{add_btn:labelButton=='operationLog'}" @click="changeButton('operationLog')">操作日志</el-button>
      </el-button-group>
    </nav>
     <!-- 活动海报 eventPoster-->
    <event-poster v-if= " labelButton =='eventPoster' "></event-poster>
    <!-- 报名/签到 registrationCheck -->
    <registration-check v-if= " labelButton =='registrationCheck' "></registration-check>
    <!-- 签到账号 checkinAccount -->
    <checkin-account v-if= " labelButton =='checkinAccount' "></checkin-account>
    <!--  签单记录 signingRecord-->
    <signing-record v-if= " labelButton =='eventDetails' "></signing-record>
    <!-- 操作日志 operationLog-->
    <operation-log v-if= " labelButton =='operationLog' "></operation-log>
    <!-- 活动详情 eventDetails-->
    <el-form v-if="labelButton == 'eventDetails1' " :model="form" :rules="rules" ref="ruleForm" label-width="110px" style="width: 90%" class="events-detail">
      <!-- 活动基本信息 -->
      <article>
        <p class="title">活动基本信息</p>
        <el-row type="flex" class="row-bg" justify="space-between">
          <el-col :span="11">
            <el-form-item label="活动名称" prop="activityName">
              <el-input  v-model="form.activityName"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="11">
             <el-form-item label="活动类型" prop="activityType">
               <el-select  v-model="form.activityType" placeholder="请选择" style="width: 100%;">
                 <el-option
                   v-for="item in activityType"
                   :key="item.value"
                   :label="item.label"
                   :value="item.value">
                 </el-option>
               </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row type="flex" class="row-bg" justify="space-between">
          <el-col :span="11">
            <el-form-item label="活动负责人" prop="activityPrincipalList">
              <el-select  v-model="form.activityPrincipalList" multiple placeholder="请选择" style="width: 100%;">
                <el-option
                  v-for="item in activityLeader"
                  :key="item.userId"
                  :label="item.name"
                  :value="item.userId">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="11">
             <el-form-item label="活动人数(人)" prop="activityActivitiesNumber">
              <el-input  v-model="form.activityActivitiesNumber"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row type="flex" class="row-bg" justify="space-between">
          <el-col :span="11">
            <el-form-item label="活动时间" prop="activityData">
              <el-date-picker
                style="width:100%"
                 v-model="form.activityData"
                 type="daterange"
                 range-separator="-"
                 start-placeholder="开始日期"
                 end-placeholder="结束日期">
               </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="11">
             <el-form-item label="报名时间" prop="registrationData">
               <el-date-picker
               style="width:100%"
                v-model="form.registrationData"
                type="daterange"
                range-separator="-"
                start-placeholder="开始日期"
                end-placeholder="结束日期">
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row type="flex" class="row-bg" justify="space-between">
          <el-col :span="11">
            <el-form-item label="活动地址" prop="activitySite">
              <el-input  v-model="form.activitySite"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="11">
             <el-form-item label="主办部门" prop="activityDept">
               <el-select v-model="form.activityDept" multiple placeholder="请选择" style="width: 100%;">
                 <el-option
                   v-for="item in rootList"
                   :key="item.id"
                   :label="item.name"
                   :value="item.id">
                 </el-option>
               </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row >
          <el-col :span="24">
            <el-form-item label="活动简介" >
              <el-input
               v-model="form.activityIntroduction"
                type="textarea"
                :rows="4"
                placeholder="请输入内容">
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <!-- <el-row type="flex" justify="end">
          <el-button class="search_btn"><svg-icon icon-class="add"></svg-icon>新增属性</el-button>
        </el-row> -->
      </article>
      <!-- 活动可见范围（员工） -->
      <article  style="margin-top:40px">
        <p class="title">活动可见范围（员工）</p>
        <el-form-item>
           <el-radio-group v-model="form.activityRangeType">
            <el-radio :label="0">全部可见</el-radio>
            <el-radio :label="1">部分可见</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="参与部门" v-if="form.activityRangeType == 1">
        <el-row  type="flex" justify="space-between">
          <el-col class="c-select">
            <span class="c-select-list" v-for="item in activityRangeDeptListLabel" >{{item}}</span>
          </el-col>
            <el-button class="search_btn" style="height:40px;" @click="selectDepartment('activityRangeDeptList')"></svg-icon>选择部门</el-button>
          </el-row>
        </el-form-item>
        <el-form-item label="参与职位" v-if="form.activityRangeType == 1">
        <el-row  type="flex" justify="space-between">
          <el-col class="c-select">
            <span class="c-select-list" v-for="item in activityRangePositionListLabel" >{{item}}</span>
          </el-col>
            <el-button class="search_btn" style="height:40px;" @click="selectDepartment('activityRangePositionList')"></svg-icon>选择职位</el-button>
          </el-row>
        </el-form-item>
      </article>
      <!--  活动可见范围（客户）-->
      <article  style="margin-top:40px">
        <p class="title">活动可见范围（客户）</p>
          <el-form-item>
            <el-radio-group v-model="form.activityClientLabelType">
            <el-radio :label="0">全部可见</el-radio>
            <el-radio :label="1">部分可见</el-radio>
          </el-radio-group>
          </el-form-item>
          <el-form-item label="客户标签" v-if="form.activityClientLabelType == 1">
          <el-row  type="flex" justify="space-between">
            <el-col class="c-select">
              <span class="c-select-list" v-for="item in activityClientLabelListLabel" >{{item}}</span>
            </el-col>
              <el-button class="search_btn" style="height:40px;" @click="selectDepartment('activityClientLabelList')"></svg-icon>选择标签</el-button>
            </el-row>
          </el-form-item>
      </article>
      <!--  活动分享渠道-->
      <article  style="margin-top:40px">
        <p class="title">活动分享渠道</p>
          <el-form-item>
            <el-checkbox-group v-model="form.activityShare">
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
                    action="/activity/file/upload"
                    list-type="picture-card"
                    :on-preview="handlePictureCardPreview"
                    :on-error = "upfileError"
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
    
        <div  style="text-align: center;">
          <el-button class="search_btn">上一步</el-button>
          <el-button class="add_btn" >发布活动</el-button>
          <el-button class="add_btn" @click="save('ruleForm')">保 存</el-button>
          <el-button class="search_btn">取 消</el-button>
        </div>
      
    </el-form>
    <!-- 参与部门对话框 -->
    <el-dialog
      title="提示"
      :visible.sync="dialogDepartment"
      width="30%">
        <article class="table-event">
          <div class="thead">所有部门</div>
          <div   class="tbody">
            <el-tree
                   show-checkbox
                   :node-key="nodeKey"
                   :data="treeDepartmentData"
                   ref="activityRangeDeptList"
                  :props="defaultProps"
                  ></el-tree>
          </div>
        </article>
      <div slot="footer" class="dialog-footer">
        <el-button class="search_btn" @click="cancel">取 消</el-button>
        <el-button class="add_btn"  @click="update">确 定</el-button>
      </div>
    </el-dialog>
       <!-- 参与职位对话框 -->
    <el-dialog
      title="提示"
      :visible.sync="dialogPosition"
      width="30%">
        <article class="table-event">
          <div class="thead">所有部门</div>
          <div   class="tbody">
            <el-tree
                   show-checkbox
                   :node-key="nodeKey"
                   :data="treePositionData"
                   ref="activityRangePositionList"
                  :props="defaultProps"
                  ></el-tree>
          </div>
        </article>
      <div slot="footer" class="dialog-footer">
        <el-button class="search_btn" @click="cancel">取 消</el-button>
        <el-button class="add_btn"  @click="update">确 定</el-button>
      </div>
    </el-dialog>
      <!-- 客户标签对话框 -->
    <el-dialog
      title="提示"
      :visible.sync="dialogCustomerLabel"
      width="30%">
        <article class="table-event">
          <div class="thead">所有部门</div>
          <div   class="tbody">
            <el-tree
                   show-checkbox
                   :node-key="nodeKey"
                   :data="treeCustomerLabelData"
                   ref="activityClientLabelList"
                  :props="defaultProps"
                  ></el-tree>
          </div>
        </article>
      <div slot="footer" class="dialog-footer">
        <el-button class="search_btn" @click="cancel">取 消</el-button>
        <el-button class="add_btn"  @click="update">确 定</el-button>
      </div>
    </el-dialog>

  </div>
</template>
<script>
  import { mapGetters,mapState } from 'vuex'
  import {getDirectSupervisorList } from '@/api/user'
  import { getDeptRoots} from '@/api/dept'
  import { getAllPositon } from '@/api/queryConditions'
   import {getAllDeparts} from '@/api/achievement/index'
  import {getClientList} from '@/api/client/customerLabel'
  import {addActivity} from '@/api/market/eventsList'
  import eventPoster  from './components/eventPoster.vue'
  import registrationCheck  from './components/registrationCheck.vue'
  import checkinAccount  from './components/checkinAccount.vue'
  import signingRecord  from './components/signingRecord.vue'
  import operationLog  from './components/operationLog.vue'
  export default {
    name: 'eventsDetail',
    components:{
      eventPoster,
      registrationCheck,
      checkinAccount,
      signingRecord,
      operationLog
    },
    data() {
      return {
        rules:{
            activityName:[ { required: true, message: '请输入活动名称'}],
            activityType:[ { required: true, message: '请输入活动类型', }],
            activityPrincipalList:[ { required: true, message: '请选择活动负责人'}],
            activityActivitiesNumber:[ { required: true, message: '请输入活动人数'}],
            activityData:[ { required: true, message: '请选择活动时间'}],
            registrationData:[ { required: true, message: '请选择报名时间'}],
            activitySite:[ { required: true, message: '请输入活动地址'}],
            activityDept:[ { required: true, message: '请选择主办部门'}]
        },
        selectIdentification:'',
        form:null,
        shuttleList:[],
        activityLeader:[],
        jobList:[],
        rootList:[],
        dialogDepartment:false,
        dialogPosition:false,
        dialogCustomerLabel:false,
        treeDepartmentData:[],
        treePositionData:[],
        treeCustomerLabelData:[],
        labelButton:'eventDetails',
        activityRangeDeptListLabel:[],
        activityRangePositionListLabel:[],
        activityClientLabelListLabel:[],
        nodeKey:'',
        defaultProps: {
          children: 'children',
          label: '',
          id:''
        },
        dialogImageUrl: '',
        dialogVisible: false
      }
    },
    computed: {
      ...mapGetters([
        'permissions',
        'activityType'
      ])
    },
    created() {
      // 初始化 form
      this.initialization();

      // 获取 所有用户
      this.getDirectSupervisorList();

      // 获取一级部门及子公司列表
      this.getDeptRoots();
      this.sys_user_add = this.permissions['sys_user_add']
      this.sys_user_upd = this.permissions['sys_user_upd']
      this.sys_user_del = this.permissions['sys_user_del']
    },
    mounted(){
     
    },
    watch:{
      
        treeCustomerLabelData(){

        }
    },
    methods: {
      // 表单数据初始化
      initialization(){
        this.form = {
          activityName:'',//活动名称
          activityType:'',//活动类型
          activityPrincipalList:'',//活动负责人
          activityActivitiesNumber:'',//活动人数
          activityData:[],//活动时间
          registrationData:[],//报名时间
          activitySite:'',//活动地址
          activityDept:'',//主办部门
          activityRangeType:0,//活动可见范围（员工）
          activityRangeDeptList:[],//参与部门(可见部门)
          activityRangePositionList:[],//参与职位(可见职位)
          activityClientLabelType:0,//活动可见范围（客户）
          activityClientLabelList:[],//客户标签(可见客户标签)
          activityShare:[],//活动分享渠道
          activityForeendPictureList:'',//C端展示图
        }  
      },
      //保存提交 
      save(formName){
        this.$refs[formName].validate((valid) => {
          if (valid) {
            console.log(this.form)
            addActivity(this.form).then(res=>{
              console.log(res)
            })
          } else {
            console.log('error submit!!');
            return false;
          }
        });  
      },
       // 查询所有用户
      getDirectSupervisorList(){
        getDirectSupervisorList().then(res => {
          if(res.status == 200){
            this.activityLeader = res.data
          }
        })
      },
       //获取一级部门及子公司列表
      getDeptRoots() {
        getDeptRoots().then(response => {
          if(response.status == 200){
            this.rootList = response.data;
          }
        })
      },
        // 获取所有  部门
      getAllDeparts(select){
        getAllDeparts().then(res => {
          if(res.status == 200){
            this.treeDepartmentData = res.data;
            this.dialogDepartment = true;
            this.$nextTick(()=>{
              this.$refs[select].setCheckedKeys(this.form[select])
            })
            
          }
        })
      },
      // 查询全部职位
      getAllPositon(select){
        getAllPositon().then(res => {
          if(res.status == 200){
            console.log(this.$refs.treePosition)
            this.treePositionData = res.data;
            this.dialogPosition = true;
             this.$nextTick(()=>{
              this.$refs[select].setCheckedKeys(this.form[select])
            })
            
          }
        })
      },
      //获取客户标签列表
      getClientList(select) {
        getClientList().then(res => {
          if(res.status == 200){
            this.treeCustomerLabelData = res.data;
            this.dialogCustomerLabel = true;
            this.$nextTick(()=>{
               this.$refs[select].setCheckedKeys(this.form[select])
            })
          }
        })
      },
      changeButton(state){
        this.labelButton = state
      },
      // 选择 部门 职位 客户标签  对话框
      selectDepartment(select){
        this.selectIdentification = select;
          if(this.selectIdentification == 'activityRangeDeptList'){
            this.getAllDeparts(select); //  获取所有  部门
            this.defaultProps ={
              children: 'children',
              label: 'name',
              id:'id'
            }
          }
          if(this.selectIdentification == 'activityRangePositionList'){
            this.getAllPositon(select);// 查询全部职位
            this.defaultProps ={
              label: 'positionName',
              id:'positionId'
            }
          } 
          if(this.selectIdentification == 'activityClientLabelList'){
             this.getClientList(select);//获取客户标签列表
            this.defaultProps ={
              label: 'labelName',
              id:'clientLabelId'
            }
          }
          this.nodeKey = this.defaultProps.id;
         
           
          //  this.selectIdentification && (this.dialogFormVisible = true);
      },
      cancel() {
        this.dialogDepartment = false;
        this.dialogPosition = false;
        this.dialogCustomerLabel = false;
      },
      // 穿梭列表添加
      update(){
        let obj = null;
        let select = this.selectIdentification;
        let  checkedNodes = this.$refs[select].getCheckedNodes();

        if(select == 'activityRangeDeptList') obj = {id:'id',label: 'name'}
        if(select == 'activityRangePositionList') obj = {id:'positionId', label: 'positionName'}
        if(select == 'activityClientLabelList') obj = {id:'clientLabelId',label: 'labelName'}
         
        checkedNodes.forEach(item=>{
          this.form[select].push(item[obj.id]);
          this[select+'Label'].push(item[obj.label]);
        })
        this.$refs[select].setCheckedKeys([]);
        this.cancel()
      },
         handleRemove(file, fileList) {
        console.log(file, fileList);
      },
      handlePictureCardPreview(file) {
        this.dialogImageUrl = file.url;
        this.dialogVisible = true;
      },
      upfileError(file, fileList){
        console.log(file)
        console.log(fileList)
      }
    }
  }
</script>

<style lang="scss" scoped>
.title{
  font-family: PingFangSC-Medium;
  font-size: 16px;
  color: #2F2F2F;
  letter-spacing: 0;
  border-bottom: 1px solid #E9E9E9;
  padding-bottom: 10px;
}

.image-display{
  .add-img-btn{
    
    

  }
}
.c-select{
  padding: 0 16px;
  background: #FFFFFF;
  border: 1px solid #C8C8C8;
  border-radius: 2px;
  margin-right: 10px;
  .c-select-list{
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
.table-event{
  border-collapse:collapse;
  background: #FFFFFF;
  border: 1px solid #C8C8C8;
  border-radius: 2px;
  width: 100%;
  text-align: left;
  .thead{
      background: #F7F8FA;
      border-bottom: 1px solid #C8C8C8;
      font-family: PingFangSC-Medium;
      font-size: 13px;
      color: #475669;
      letter-spacing: 0;
      font-weight: inherit;
      padding: 6px;
  }
  .tbody{
    padding: 6px;   
    height: 400px;
    overflow: auto;
  }
}
</style>

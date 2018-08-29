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
     <!-- 活动海报 -->
    <event-poster v-if= " labelButton =='eventPoster' "></event-poster>
    <!-- 报名/签到 -->
    <registration-check v-if= " labelButton =='registrationCheck' "></registration-check>
    <!-- 签到账号 -->
    <checkin-account v-if= " labelButton =='checkinAccount' "></checkin-account>
    <!--  签单记录-->
    <signing-record v-if= " labelButton =='signingRecord' "></signing-record>
    <!-- 操作日志 -->
    <operation-log v-if= " labelButton =='operationLog' "></operation-log>
    <!-- 活动详情 -->
    <el-form v-if="labelButton == 'eventDetails' " :model="form" :rules="rules" ref="ruleForm" label-width="110px" style="width: 90%" class="events-detail">
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
                   v-for="item in options"
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
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
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
                   v-for="item in options"
                   :key="item.value"
                   :label="item.label"
                   :value="item.value">
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
            <span class="c-select-list" v-for="item in form.activityRangeDeptList" >{{item}}</span>
          </el-col>
            <el-button class="search_btn" style="height:40px;" @click="selectDepartment"></svg-icon>选择部门</el-button>
          </el-row>
        </el-form-item>
        <el-form-item label="参与职位" v-if="form.activityRangeType == 1">
        <el-row  type="flex" justify="space-between">
          <el-col class="c-select">
            <span class="c-select-list" v-for="item in form.activityRangePositionList" >{{item}}</span>
          </el-col>
            <el-button class="search_btn" style="height:40px;" @click="selectDepartment"></svg-icon>选择职位</el-button>
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
              <span class="c-select-list" v-for="item in form.activityClientLabelList" >{{item}}</span>
            </el-col>
              <el-button class="search_btn" style="height:40px;" @click="selectDepartment"></svg-icon>选择部门</el-button>
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
            <el-row>
               <el-col :span="4" class="add-img-btn">
                 <svg-icon icon-class="add" class="common_btn"></svg-icon>
                 <p class="img-title">点击添加图片</p>
                 <p class="img-text">jpg/png文件，尺寸750x1334px</p>
                 <p class="img-text">小于1M，最多9张</p>
               </el-col>
            </el-row>
          </el-form-item>
      </article>
    
        <div  style="text-align: center;">
          <el-button class="search_btn">上一步</el-button>
          <el-button class="add_btn" >发布活动</el-button>
          <el-button class="add_btn" @click="save('ruleForm')">保 存</el-button>
          <el-button class="search_btn">取 消</el-button>
        </div>
      
    </el-form>
    <!-- 选择部门对话框 -->
    <el-dialog
      title="提示"
      :visible.sync="dialogFormVisible"
      width="30%">
        
        <table class="table-event">
          <thead class="thead">
            <tr>
              <th >所有部门</th>
              <!-- <th >已选部门</th> -->
              </tr>
            </thead>
            <tbody  class="tbody">
              <tr>
                <td ><el-tree
                   show-checkbox
                   node-key="label"
                   :data="data"
                   ref="tree"
                  :props="defaultProps"
                  @check-change="shuttleAdd"></el-tree></td>
                <!-- <td>
                    <p class="list" v-for="item in shuttleList"><el-row  type="flex" justify="space-between">{{item}}<span class="close" @click="shuttleDelete">x</span></el-row></p>
                  </td> -->
                </tr>
            </tbody>
          </table>
      <div slot="footer" class="dialog-footer">
        <el-button class="search_btn" @click="cancel">取 消</el-button>
        <el-button class="add_btn"  @click="update">确 定</el-button>
      </div>
    </el-dialog>
   


  </div>
</template>
<script>
  import { mapGetters } from 'vuex'
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
            activityName:[ { required: true, message: '请输入活动名称', trigger: 'blur' }],
            activityType:[ { required: true, message: '请输入活动类型', trigger: 'blur' }],
            activityPrincipalList:[ { required: true, message: '请选择活动负责人', trigger: 'blur' }],
            activityActivitiesNumber:[ { required: true, message: '请输入活动人数', trigger: 'blur' }],
            activityData:[ { required: true, message: '请选择活动时间', trigger: 'blur' }],
            registrationData:[ { required: true, message: '请选择报名时间', trigger: 'blur' }],
            activitySite:[ { required: true, message: '请输入活动地址', trigger: 'blur' }],
            activityDept:[ { required: true, message: '请选择主办部门', trigger: 'blur' }],
        },
        form:null,
        shuttleList:[],
        dialogFormVisible:false,
        labelButton:'eventDetails',
        checkList: [],
         value6: '',
        options: [{
         value: '选项1',
         label: '黄金糕'
       }, {
         value: '选项2',
         label: '双皮奶'
       }, {
         value: '选项3',
         label: '蚵仔煎'
       }, {
         value: '选项4',
         label: '龙须面'
       }, {
         value: '选项5',
         label: '北京烤鸭'
       }],
       value5: [],
       value11: [],
       data: [{
         label: '一级 1',
         children: [{
           label: '二级 1-1',
           children: [{
             label: '三级 1-1-1'
           }]
         }]
       }, {
         label: '一级 2',
         children: [{
           label: '二级 2-1',
           children: [{
             label: '三级 2-1-1'
           }]
         }, {
           label: '二级 2-2',
           children: [{
             label: '三级 2-2-1'
           }]
         }]
       }, {
         label: '一级 3',
         children: [{
           label: '二级 3-1',
           children: [{
             label: '三级 3-1-1'
           }]
         }, {
           label: '二级 3-2',
           children: [{
             label: '三级 3-2-1'
           }]
         }]
       }],
       defaultProps: {
         children: 'children',
         label: 'label',
         id:1
       }
      }
    },
    computed: {
      ...mapGetters([
        'permissions',
        'workStatus',
        'lockStatus'
      ])
    },
    created() {
      this.initialization();
      this.sys_user_add = this.permissions['sys_user_add']
      this.sys_user_upd = this.permissions['sys_user_upd']
      this.sys_user_del = this.permissions['sys_user_del']
    },
    mount(){
      console.log(this.radio2)
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
          } else {
            console.log('error submit!!');
            return false;
          }
        });  
      },
      changeButton(state){
        this.labelButton = state
      },
      // 选择部门
      selectDepartment(){
          this.dialogFormVisible = true;
      },
      cancel(formName) {
        this.dialogFormVisible = false;
      },
      update(){
        this.dialogFormVisible = false;
      },
       // 穿梭列表添加
      shuttleAdd(data) {
        this.form.activityRangePositionList = this.$refs.tree.getCheckedKeys()
     },
     // 穿梭列表删除
     shuttleDelete(){

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
    font-family: PingFangSC-Regular;
    letter-spacing: 0;
    background: #FAFAFA;
    cursor:pointer;
    color: #A1A1A1;
    border: 1px solid #C8C8C8;
    border-radius: 2px;
    text-align: center;
    .img-title{
      font-size: 13px;
      line-height: 20px;
    }
    .img-text{
      font-size: 7px;
      line-height: 10px;
    }
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
    th{
      background: #F7F8FA;
      border: 1px solid #C8C8C8;
      font-family: PingFangSC-Medium;
      font-size: 13px;
      color: #475669;
      letter-spacing: 0;
      font-weight: inherit;
      padding: 6px;
    }
  }
  td{
    border: 1px solid #C8C8C8;
    padding: 6px;
    width: 50%;
    .list{
      margin: 0;
      padding: 4px 8px;
      border-radius: 2px;
      &:hover{
          background: rgba(0,193,223,0.10);
          .close{
            display: block;
            cursor: pointer;
          }
      }
      .close{
        padding:0 6px;
        color: #0299CC;
        display: none;
      }
    }
  }
}
</style>

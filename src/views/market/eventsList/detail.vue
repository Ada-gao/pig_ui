<template>
  <div class="app-container calendar-list-container">
    <nav class="filter-container">
      <el-button-group>
        <el-button :class="{add_btn:labelButton=='eventDetails'}" @click="changeButton('eventDetails')">活动详情</el-button>
        <el-button :class="{add_btn:labelButton=='eventPoster'}" @click="changeButton('eventPoster')">活动海报</el-button>
        <el-button :class="{add_btn:labelButton=='checkinAccount'}" @click="changeButton('checkinAccount')">签到帐号</el-button>
      </el-button-group>
    </nav>
    <el-form  label-width="100px" style="width: 90%" class="events-detail">
      <!-- 活动基本信息 -->
      <article>
        <p class="title">活动基本信息</p>
        <el-row type="flex" class="row-bg" justify="space-between">
          <el-col :span="11">
            <el-form-item label="活动名称">
              <el-input ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="11">
             <el-form-item label="活动类型">
               <el-select v-model="value5" multiple placeholder="请选择" style="width: 100%;">
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
            <el-form-item label="活动负责人">
              <el-select v-model="value5" multiple placeholder="请选择" style="width: 100%;">
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
             <el-form-item label="活动人数(人)">
              <el-input ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row type="flex" class="row-bg" justify="space-between">
          <el-col :span="11">
            <el-form-item label="活动时间" >
              <el-date-picker
                style="width:100%"
                 v-model="value6"
                 type="daterange"
                 range-separator="-"
                 start-placeholder="开始日期"
                 end-placeholder="结束日期">
               </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="11">
             <el-form-item label="报名时间" >
               <el-date-picker
               style="width:100%"
                v-model="value6"
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
            <el-form-item label="活动地址" >
              <el-input ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="11">
             <el-form-item label="主办部门" >
               <el-select v-model="value5" multiple placeholder="请选择" style="width: 100%;">
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
                type="textarea"
                :rows="4"
                placeholder="请输入内容">
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row type="flex" justify="end">
          <el-button class="search_btn"><svg-icon icon-class="add"></svg-icon>新增属性</el-button>
        </el-row>
      </article>
      <!-- 活动可见范围（员工） -->
      <article  style="margin-top:40px">
        <p class="title">活动可见范围（员工）</p>
        <el-form-item>
          <el-radio v-model="radio2" label="1">全部可见</el-radio>
          <el-radio v-model="radio2" label="2">部分可见</el-radio>
        </el-form-item>
        <el-form-item label="参与部门">
        <el-row  type="flex" justify="space-between">
          <div class="c-select">
            <span class="c-select-list" v-for="item in 30">sss</span>
          </div>
            <el-button class="search_btn" style="height:40px;" @click="selectDepartment"></svg-icon>选择部门</el-button>
          </el-row>
        </el-form-item>
      </article>
      <!--  活动可见范围（客户）-->
      <article  style="margin-top:40px">
        <p class="title">活动可见范围（客户）</p>
          <el-form-item>
            <el-radio v-model="radio2" label="1">全部可见</el-radio>
            <el-radio v-model="radio2" label="2">部分可见</el-radio>
          </el-form-item>
      </article>
      <!--  活动分享渠道-->
      <article  style="margin-top:40px">
        <p class="title">活动分享渠道</p>
          <el-form-item>
            <el-checkbox-group v-model="checkList">
             <el-checkbox label="微信好友"></el-checkbox>
             <el-checkbox label="微信朋友圈"></el-checkbox>
             <el-checkbox label="QQ好友"></el-checkbox>
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
              <th >已选部门</th>
              </tr>
            </thead>
            <tbody  class="tbody">
              <tr>
                <td><el-tree
                   show-checkbox
                   node-key="label"
                   :data="data"
                   ref="tree"
                  :props="defaultProps"
                  @check-change="shuttleAdd"></el-tree></td>
                <td>
                    <p class="list" v-for="item in shuttleList"><el-row  type="flex" justify="space-between">{{item}}<span class="close" @click="shuttleDelete">x</span></el-row></p>
                  </td>
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
  export default {
    name: 'eventsDetail',
    data() {
      return {
        shuttleList:[],
        dialogFormVisible:true,
        labelButton:'eventDetails',
        radio2:1,
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
      this.sys_user_add = this.permissions['sys_user_add']
      this.sys_user_upd = this.permissions['sys_user_upd']
      this.sys_user_del = this.permissions['sys_user_del']
    },
    mount(){
      console.log(this.radio2)
    },
    watch:{
      radio2(val){
        console.log(val)
      }
    },
    methods: {
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

      },
       // 穿梭列表添加
      shuttleAdd(data) {
       console.log(data);
       this.shuttleList.push(data.label)
       // console.log(this.$refs.tree.getCheckedNodes());
       // console.log(this.$refs.tree.getCheckedKeys());
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

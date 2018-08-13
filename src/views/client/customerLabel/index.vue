<template>
  <div class="app-container calendar-list-container">
    <div class="main-tab">
      <el-radio-group v-model="step" @change="changeStep" style="margin-bottom: 0;">
        <el-radio-button label="1">客户标签</el-radio-button>
        <el-radio-button label="2">AUM标签</el-radio-button>
      </el-radio-group>
    </div>

    <div class="filter-container" style="text-align: right">
      <el-button
                 class="filter-item add_btn"
                 @click="openModel"
                 type="primary"
                 icon="edit">
        <svg-icon icon-class="add"></svg-icon> 新增</el-button>
    </div>
    <!-- 客户标签 -->
    <el-table v-if="step == 1" :data="clientlist" v-loading="listLoading" element-loading-text="给我一点时间" border fit highlight-current-row style="width: 100%">

      <el-table-column align="center" prop="labelName" label="标签" ></el-table-column>
      <el-table-column align="center" prop="labelDescription" label="标签解释" ></el-table-column>
        <el-table-column align="center" label="操作">
          <template slot-scope="scope">
              <a size="small" class="common_btn"
                 @click="editAum(scope.row.clientLabelId,'newAddClient')">编辑
              </a>
              <a size="small" class="danger_btn"
                @click="deletes(scope.row.clientLabelId)">删除
              </a>
          </template>
        </el-table-column>

    </el-table>
    <!-- AUM标签 -->
    <section v-if="step == 2"  v-loading="listLoading" element-loading-text="给我一点时间">
      <el-table  :data="aumlist" border fit highlight-current-row style="width: 100%">

        <el-table-column align="center" prop="signingAmount" label="签约金额" ></el-table-column>
        <el-table-column align="center" prop="labelName" label="会员等级"></el-table-column>

        <el-table-column align="center" label="操作">
          <template slot-scope="scope">
            <el-button type="text" @click="editAum(scope.row.clientAumLabelId)">编辑</el-button>
            <span class="space_line"> | </span>
            <el-button type="text" class="red" @click="deletes(scope.row.clientAumLabelId)">删除</el-button>
          </template>
        </el-table-column>

      </el-table>
      <div class="red remarks">备注：签约金额为客户资产管理规模</div>
    </section>
     <!-- 新增客户标签对话框 -->
    <el-dialog title="新增标签" :visible.sync="newAdd" :before-close="handleClose" width="30%">
        <el-form :model="newAddClient" ref="newAddClient" label-width="100px" class="demo-ruleForm">

          <el-form-item  label="标签名称"  prop="labelName" :rules="[
            { required: true, message: '标签名称不能为空'},
          ]"> 
            <el-input v-model="newAddClient.labelName" placeholder="请输入标签名称" style="width:90%;"></el-input>
          </el-form-item>

          <el-form-item label="标签解释">
            <el-input  v-model="newAddClient.labelDescription"  placeholder="请输入标签解释" style="width:90%;"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button  class="search_btn" @click="cancel('newAddClient')">取 消</el-button>
          <el-button  class="add_btn" @click="clientDetermine('newAddClient')">确 定</el-button>
        </div>
    </el-dialog>
    <!-- 新增aum对话框 -->
    <el-dialog title="新增客户标签" :visible.sync="newAddAum" :before-close="handleClose" width="30%">
    
        <el-form :model="newAddParamet" :rules="rules" ref="newAddParamet" label-width="100px" class="demo-ruleForm">
          <el-form-item  label="签约金额" prop="lowLimit"  class="demo-block demo-box demo-zh-CN demo-form"> 
            <el-col :span="8">
              <el-form-item  prop="lowLimit" > 
                <el-input v-model="newAddParamet.lowLimit" placeholder="请输入金额"></el-input>
              </el-form-item>
            </el-col>
            <el-col class="line" :span="1" style="text-align: center;">-</el-col>
            <el-col :span="8">
               <el-form-item  prop="highLimit" > 
                <el-input v-model.number="newAddParamet.highLimit" placeholder="请输入金额"  auto-complete="off" ></el-input>
              </el-form-item>
            </el-col>
            <span class="ml10">万</span>
          
          </el-form-item>
          <el-form-item label="会员等级" prop="labelName">
            <el-input  v-model="newAddParamet.labelName"  placeholder="请输入会员等级" style="width:71%;" auto-complete="off" ></el-input>
          </el-form-item>
        </el-form>
         <div slot="footer" class="dialog-footer">
        <el-button class="search_btn" @click="cancel('newAddParamet')">取 消</el-button>
        <el-button class="add_btn" @click="aumDetermine('newAddParamet')">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog
      title="提示"
      :visible.sync="dialogVisible"
      width="30%">
      <span>{{deletesTitle}}</span>
      <div slot="footer" class="dialog-footer">
        <el-button class="search_btn" @click="dialogVisible = false">取 消</el-button>
        <el-button class="add_btn" @click="todeletes">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import {getClientList,clientLabel,deleteClientLabel,seeClientLabel,editClientLabel,fetchList,clientAumLabel,editClientAumLabel,deleteClientAumLabel} from '@/api/client/customerLabel'
  import waves from '@/directive/waves/index.js' // 水波纹指令
  import ElRadioGroup from 'element-ui/packages/radio/src/radio-group'
  import ElOption from "element-ui/packages/select/src/option"
  import UploadExcelComponent from '@/components/UploadExcel/index.vue'
  export default {
    components: {
      ElOption,
      ElRadioGroup,
      UploadExcelComponent
    },
    name: 'table_user',
    directives: {
      waves
    },
    data() {
       var validatePass = (rule, value, callback) => {
        let reg = /^[0-9]+.?[0-9]*$/;
        if(!reg.test(value)){
           callback(new Error('金额必须为数字值'));
        }
        
      };
      return {
        aumlist: null,
        clientlist:null,
        step:1,
        newAddAum:false,
        newAdd:false,
        newAddParamet:{
          highLimit:'',
          lowLimit:'',
          labelName:''
        },
        newAddClient:{
          labelName:'',
          labelDescription:''
        },
        deletesTitle:'',
        rules:{
           lowLimit:[
              { required: true, message: '金额不能为空'},
              { validator: validatePass, trigger: 'change'}
            ],
            highLimit:[
              { required: true, message: '金额不能为空'},
               { validator: validatePass, trigger: 'change'}
            ],
            labelName:[
              { required: true, message: '会员等级不能为空'},
            ],
        },
        selfEdit:false,
        listData:null,
        listLoading:false,
        dialogVisible: false,
        id:'',
      }
    },

    created() {
      this.list();

    },
    methods: {
        //获取客户标签列表
      list() {
        this.listLoading = true;
        getClientList().then(response => {
          this.clientlist = response.data;
          this.listLoading = false;
         
        })
      },
      handleClose(done){
       this.step == 1 ? this.$refs["newAddClient"].resetFields():this.$refs["newAddParamet"].resetFields();
        done();
      },
      changeStep(){
        this.step == 1? this.list():this.getAumList();
      },
      openModel(){
        this.step == 1?this.newAdd = true:this.newAddAum = true;
        this.newAddParamet = {};
        this.newAddClient = {};
      },
     
      // 取消 关闭对话框
      cancel(formName){
        this.$refs[formName].resetFields();
        this.newAddAum = false;
        this.newAdd = false;
        this.newAddParamet = {};
        this.newAddClient = {};
      },
      // 新增 确定 客户标签
      clientDetermine(formName){
        let self = false;
        this.$refs[formName].validate((valid) => {
          if (valid) {
            console.log(valid)
          } else {
            self = true;
            console.log('error submit!!');
            return false;
          }
        });
        if(self) return false;
        let method;

        if(this.selfEdit){
          this.newAddClient.clientLabelId = this.id;
          editClientLabel(this.newAddClient,this.id).then(response =>{
             this.changeLabel(response);
          
        })
        }else{
          clientLabel(this.newAddClient).then(response =>{
              this.changeLabel(response);
          })
        }
      },
      changeLabel(response){

         if(response.status === 200) {
            this.list();
            this.$notify({
                title: '成功',
                message: '修改成功',
                type: 'success',
                duration: 2000
              })
            this.newAddParamet = {};
            this.newAdd = false;
             this.selfEdit = false;
          }
      },
      // 新增 确定 aum
      aumDetermine(formName){
        let self = false;
        this.$refs[formName].validate((valid) => {
          if (valid) {
           console.log(valid)
          } else {
            self = true;
            console.log('error submit!!');
            return false;
          }
        });
        if(self) return false;
        clientAumLabel(this.newAddParamet).then(response =>{
          if(response.status === 200) {
            this.getAumList()
            this.$notify({
                title: '成功',
                message: '新增成功',
                type: 'success',
                duration: 2000
              })
            this.newAddParamet = {};
            this.newAddAum = false;
          }
          
        })
      },
      // 据id查询客户aum标签信息
      editAum(id){
        if(this.step == 1){
          seeClientLabel(id).then(response=>{
            this.id = id;
            this.newAdd = true;
            this.selfEdit = true;
           this.newAddClient =response.data;
          })
        }else{
          editClientAumLabel(id).then(response=>{
            this.newAddAum = true;
           this.newAddParamet =response.data;
            this.selfEdit = false;
          })
        }
     
      },
      // 删除客户aum标签
      deleteAum(id){
        deleteClientAumLabel(id).then(response=>{
          console.log(response)
        })
      },
      //获得全部客户aum标签
      getAumList() {
        this.listLoading = true
      
        fetchList().then(response => {
        
         response.data.forEach((val,index,taht)=>{
            val.signingAmount = `${val.lowLimit} - ${val.highLimit}万`;
          })
         this.aumlist = response.data;
          this.listLoading = false;
         
        })
      },

    //删除弹出框
      deletes(id) {
        this.deletesTitle = '确定要删除吗'
        this.dialogVisible = true
        this.id = id
      },
      todeletes() {
         
        if( this.step == 1){
          deleteClientLabel(this.id).then(response => {
            if(response.status === 200) {
               this.list();
               this.successDeletes();
            }
          })
        }else{
           deleteClientAumLabel(this.id).then(response => {
            if(response.status === 200) {
              this.getAumList()
              this.successDeletes();
            }
          })
        }
      },
      successDeletes(){
        this.$notify({
            title: '成功',
            message: '删除成功',
            type: 'success',
            duration: 2000
          })
         this.dialogVisible = false;
      }
    }
  }
</script>

<style lang="scss" scoped>
.el-select,
.el-date-editor {
  width: 100%;
}
.red{
  color:red;
  &:hover{
    color:#b90707;
  }
}
.mr10{
  margin-right:10px;
}
.ml10{
  margin-left:10px;
}
.remarks{
  font-size:18px;
  color:#D0021B;
  margin:20px 0 0 20px;
}
</style>

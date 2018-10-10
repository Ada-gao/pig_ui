<template>
  <div class="app-container calendar-list-container">
    <div class="main-tab" style="margin-bottom: 20px;">
      <el-radio-group v-model="step" @change="changeStep" style="margin-bottom: 0;">
        <el-radio-button label="1">客户标签搜索</el-radio-button>
        <el-radio-button label="2">全局客户搜索</el-radio-button>
      </el-radio-group>
    </div>
    <search-bar
      :searchClientType="false"
      :searchCertificationStatus="false"
      :searchIdNo="false"
      :searchAmount="false"
      :searchNationality="false"
      :searchCity="false"
      :searchValidate="true"
      :searchDisplayType="DisplayTypeBl"
      @search-list="getListQuery">
    </search-bar>
    <div class="filter-container" style="text-align: right">
      <el-button
                 class="filter-item add_btn"
                 @click="openModel('cancel')"
                 type="primary"
                 icon="edit">
        <svg-icon icon-class="add"></svg-icon> 取消客户标签</el-button>
      <el-button
                 class="filter-item add_btn"
                 @click="openModel('set')"
                 type="primary"
                 icon="edit"
                 v-show="step==2">
        <svg-icon icon-class="add"></svg-icon> 设置客户标签</el-button>
    </div>
    <!-- 客户标签列表 -->
    <customer-label-list
      v-show="step==1"
      :clientLabelList="data"
      @searchList="getListPageQuery"
      @selectClient="getClientList">
    </customer-label-list>
    <!-- 全局客户搜索列表 -->
    <customer-label-list
      v-show="step==2"
      :clientLabelList="data"
      @searchList="getListPageQuery1"
      @selectClient="getClientList">
    </customer-label-list>
    
    <el-dialog
      title="提示"
      :visible.sync="dialogVisible"
      width="30%">
      <span>{{deletesTitle}}客户标签？</span>
      <div slot="footer" class="dialog-footer">
        <el-button class="search_btn" @click="dialogVisible = false">取 消</el-button>
        <el-button class="add_btn" @click="labelHandle">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import {
    fetchClientLabel, addClientLabel, delClientLabel
  } from '@/api/client/customerLabel'
  import waves from '@/directive/waves/index.js' // 水波纹指令
  import ElRadioGroup from 'element-ui/packages/radio/src/radio-group'
  import ElOption from "element-ui/packages/select/src/option"
  import customerLabelList from 'components/table/customerLabel.vue'
  import searchBar from 'components/searchBar.vue'
  import { mapGetters } from 'vuex'
  export default {
    components: {
      ElOption,
      ElRadioGroup,
      customerLabelList,
      searchBar
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
        selfEdit: false,
        listData: null,
        listLoading: false,
        dialogVisible: false,
        id:'',
        clientLabelId: '',
        listQuery: {
          page: 1,
          limit: 20,
          allDisplay: '3',
          orderByField: 'tab.create_time'
        },
        data: null,
        DisplayTypeBl: false,
        clientLabelType: '',
        clientIds: []
      }
    },
       computed: {
      ...mapGetters([
        'permissions'
      ])
    },
    created() {
      this.getList()
      // 客户标签权限判断
      this.client_label_operation_edit = this.permissions['client_label_operation_edit']
      this.client_label_operation_add = this.permissions['client_label_operation_add']
      this.client_label_operation_del = this.permissions['client_label_operation_del']
      this.listQuery.clientLabelId = this.$route.params.clientLabelId
    },
    methods: {
      getListQuery(data) {
        console.log(data)
        this.listQuery = data
        this.listQuery.clientLabelId = this.$route.params.clientLabelId
        this.listQuery.orderByField = 'tab.create_time'
        this.getList()
      },
      getListPageQuery(data) { // 页数改变
        this.listQuery.page = data.page
        this.listQuery.limit = data.limit
        this.getList()
      },
      getListPageQuery1(data) { // 页数改变
        this.listQuery.page = data.page
        this.listQuery.limit = data.limit
        this.getList()
      },
      getClientList(data) {
        this.clientIds = data
      },
      //根据客户标签搜索列表
      getList() {
        this.listLoading = true
        this.listQuery.allDisplay = this.step == 1 ? '2' : this.listQuery.allDisplay
        fetchClientLabel(this.listQuery).then(response => {
          this.data = response.data
          this.list = response.data.records
          this.total = response.data.total
          this.listLoading = false
        })
      },
      handleClose(done){
       this.step == 1 ? this.$refs["newAddClient"].resetFields() : this.$refs["newAddParamet"].resetFields()
        done()
      },
      changeStep(){
        // this.listQuery.page = 1
        // this.listQuery.limit = 20
        // this.listQuery.orderByField = 'tab.create_time'
        // this.listQuery.isAsc = false
        // this.listQuery.allDisplay = this.step == 1 ? '2' : '3'
        this.listQuery = {
          page: 1,
          limit: 20,
          orderByField: 'tab.create_time',
          isAsc: false,
          allDisplay: this.step == 1 ? '2' : '3',
          clientLabelId: this.$route.params.clientLabelId
        }
        // console.log(this.listQuery)
        this.DisplayTypeBl  = this.step == 2 ? true : false
        this.getList()
      },
      openModel(type){
        if (!this.clientIds.length) {
          this.$notify({
            title: '警告',
            message: '请至少选择一个客户',
            type: 'warning',
            duration: 2000
          })
          return
        }
        this.clientLabelType = type
        this.dialogVisible = true
        this.deletesTitle = type === 'cancel' ? '取消' : '确定设置'
      },

      // 取消 关闭对话框
      cancel(formName){
        this.$refs[formName].resetFields()
      },
      changeLabel(response){

         if(response.status === 200) {
            this.list()
            this.$notify({
                title: '成功',
                message: '修改成功',
                type: 'success',
                duration: 2000
              })
            this.newAddParamet = {}
            this.newAdd = false
             this.selfEdit = false
          }
      },
      labelHandle() {
        if (this.clientLabelType === 'cancel') {
          const param = {
            clientIds: this.clientIds
          }
          delClientLabel(this.clientIds).then(res => {
            if (res.status !== 200) return
            this.$notify({
              title: '成功',
              message: '取消成功',
              type: 'success',
              duration: 2000
            })
            // this.$emit('searchList', this.listQuery)
          })
        } else {
          const param = {
            clientId: this.clientIds,
            clientLabelIds: [this.listQuery.clientLabelId]
          }
          addClientLabel(param).then(res => {
            if (res.status !== 200) return
            this.$notify({
              title: '成功',
              message: '设置成功',
              type: 'success',
              duration: 2000
            })
          })
        }
        this.dialogVisible = false
        this.getList()
      }
    }
  }
</script>

<style lang="scss" scoped>
</style>

`<template>
  <div class="app-container calendar-list-container">
    <div class="flex">
      <el-button v-if="editSelf" @click="onCancel">取消</el-button>
      <el-button class="filter-item add_btn" v-if="editSelf" type="primary" @click="sava">保存</el-button>
      <el-button class="filter-item add_btn" type="primary" v-if="!editSelf" @click="edit"><i class="el-icon-setting">&nbsp&nbsp</i>子公司管理</el-button>
    </div>
  <el-table
    :data="rootList"
    style="width: 100%"
    border
    align="center">
    <el-table-column
      label="是否子公司"
      align="center"
      width="180">
       <template slot-scope="scope">
        <el-checkbox @change="handleCheckedCitiesChange(scope.row)" v-model="scope.row.isCompany == 1" :disabled="!editSelf"></el-checkbox>
      </template>
    </el-table-column>
    <el-table-column
      align="center"
      label="部门名称"
      prop="name"
      >
    </el-table-column>
  </el-table>
  </div>
</template>

<script>
  import { getDeptRoots,editDeptRoots} from '@/api/dept'
  import { mapGetters } from 'vuex'
  export default {
    name: 'menu',
    data() {
      return {
          rootList:null,
          editSelf:false
      }
    },
    created() {
      this.getList()
        this.subcompany_update = this.permissions['subcompany_update'];
    },
    computed: {
      ...mapGetters([
        'elements',
        'permissions'
      ])
    },
    methods: {
      //获取列表
      getList() {
        getDeptRoots().then(response => {
          if(response.status == 200){
            this.rootList = response.data;
          }
        })
      },
      //更改复选框状态
      handleCheckedCitiesChange(event){
        event.isCompany = event.isCompany==1?0:1;
      },
      //编辑
      edit(){
        this.editSelf = true;
      },
      onCancel(){
        this.editSelf = false;
      },
      sava(){
        editDeptRoots(this.rootList).then(response => {
          if(response.status == 200){
            this.$notify({
              title: '成功',
              message: '修改成功',
              type: 'success',
              duration:2000,
              offset:100
            });
            this.onCancel()
          }

        })
      }
    }
  }
</script>
<style lang="scss" scoped>
  .flex{
    display: flex;
     justify-content:flex-end;
  }
</style>

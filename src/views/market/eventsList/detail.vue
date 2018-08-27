<template>
  <div class="app-container calendar-list-container">
    <nav class="filter-container">
      <el-button-group>
        <el-button :class="{add_btn:labelButton=='eventDetails'}" @click="changeButton('eventDetails')">活动详情</el-button>
        <el-button :class="{add_btn:labelButton=='eventPoster'}" @click="changeButton('eventPoster')">活动海报</el-button>
        <el-button :class="{add_btn:labelButton=='checkinAccount'}" @click="changeButton('checkinAccount')">签到帐号</el-button>
      </el-button-group>
    </nav>
    <el-form  label-width="100px" class="demo-ruleForm">
      <p class="title">活动基本信息</p>
      <article class="">

        <el-row type="flex" class="row-bg" justify="space-between">
          <el-col :span="11">
            <el-form-item label="活动名称" >
              <el-input ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="11">
             <el-form-item label="活动名称" >
              <el-input ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row type="flex" class="row-bg" justify="space-between">
          <el-col :span="11">
            <el-form-item label="活动名称" >
              <el-input ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="11">
             <el-form-item label="活动名称" >
              <el-input ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row type="flex" class="row-bg" justify="space-between">
          <el-col :span="11">
            <el-form-item label="活动名称" >
              <el-input ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="11">
             <el-form-item label="活动名称" >
              <el-input ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row type="flex" class="row-bg" justify="space-between">
          <el-col :span="11">
            <el-form-item label="活动名称" >
              <el-input ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="11">
             <el-form-item label="活动名称" >
              <el-input ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </article>

    </el-form>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  export default {
    name: 'eventsDetail',
    data() {
      return {
        labelButton:'eventDetails'
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
    methods: {
      changeButton(state){
        this.labelButton = state
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
</style>

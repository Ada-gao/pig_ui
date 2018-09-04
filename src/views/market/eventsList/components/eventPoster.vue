<template>
  <article class="event-poster">
    <el-row>
        <el-form  label-width="100px">
            <!-- 活动封面（用于app端展示） -->
            <p class="title">活动封面<span class="title-app">（用于app端展示）</span></p>
            <el-row type="flex"  class="row-bg" justify="space-between" align="middle">
                <el-col>
                      <el-form-item label="封面">
                        <el-button class="add_btn" size="small">上传封面</el-button>
                        <span class="upload-description">只能上传 jpg/png 文件，尺寸750x335px,大小不超过 2M</span>
                    </el-form-item>
                </el-col>
                <!-- <el-col style="text-align: center;">
                    <el-button class="add_btn">生成预览</el-button>
                </el-col> -->
                <el-col :span="16">
                    <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSD4-LcA2kyEAFHE3_YI-U3Dw2xYc_JS6BVVkmJhANV9D53iBIt">
                </el-col>
            </el-row>
            <!-- 活动海报（用于app端分享查看） -->
            <p class="title">活动海报<span class="title-app">（用于app端分享查看）</span></p>
             <el-row type="flex" class="row-bg" justify="space-around" align="middle">
                <el-col>
                    <el-form-item label="部门">
                        <span>财富部</span>
                        <span>市场部</span>
                    </el-form-item>
                    <el-form-item label="活动名称">
                        <span>市场活动</span>
                    </el-form-item>
                     <el-form-item label="活动时间">
                        <span>2018-8-21 14:00</span>
                        <span>2018-8-21 16:00</span>
                    </el-form-item>
                    <el-form-item label="活动地址">
                        <span>陆家嘴软件园二号楼301室</span>
                    </el-form-item>
                     <el-form-item label="活动简介">
                        <span>欢迎大家来到我们美丽的xxx</span>
                    </el-form-item>
                     <el-form-item label="背景图">
                        <el-button class="add_btn" size="small">上传封面</el-button>
                        <span class="upload-description">只能上传 jpg/png文件,尺寸750x1334px，大小不超过 2M</span>
                    </el-form-item>
                </el-col>
                <!-- <el-col style="text-align: center;">
                    <el-button class="add_btn">生成预览</el-button>
                </el-col> -->
                <el-col :span="16">
                    <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSD4-LcA2kyEAFHE3_YI-U3Dw2xYc_JS6BVVkmJhANV9D53iBIt">
                </el-col>
            </el-row>
                <div  style="text-align: center;">
                    <el-button class="search_btn">上一步</el-button>
                    <el-button class="add_btn" >发布活动</el-button>
                    <el-button class="add_btn" >保 存</el-button>
                    <el-button class="search_btn">取 消</el-button>
                </div>
        </el-form>
    </el-row> 
      

  </article>
</template>

<script>
  import { mapGetters } from 'vuex'
  export default {
    name: 'eventPoster',
    data() {
      return {

       
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
   
    }
  }
</script>

<style lang="scss" scoped>
.event-poster{
    letter-spacing: 0;
    .title{
    font-family: PingFangSC-Medium;
    font-size: 16px;
    color: #2F2F2F;
    border-bottom: 1px solid #E9E9E9;
    padding-bottom: 10px;
        .title-app{
            font-family: PingFangSC-Regular;
            font-size: 14px;
            color: #000000;
            line-height: 22px;
        }
    }
    .upload-description{
        display: block;
        font-family: PingFangSC-Regular;
        font-size: 12px;
        color: #BABBBB;
        letter-spacing: 0;
        line-height: 14px;
    }
}

</style>

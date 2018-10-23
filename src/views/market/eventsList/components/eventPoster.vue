<template>
<article class="event-poster">
  <el-row>
    <el-form label-width="100px">
      <!-- 活动封面（用于app端展示） -->
      <p class="title">活动封面<span class="title-app">（用于app端展示）</span></p>
      <el-row type="flex" class="row-bg" >
        <el-col v-if="url == 'edit'" :span="16">
          <el-form-item label="封面">
            <el-upload class="upload-demo" 
              action="/activity/file/upload"
               :show-file-list="false"
             :before-upload="(res)=>{return beforeAvatarUpload(res,{width:750,height:310,name:'Cover'})}" 
             :on-success='coverSuccess' 
             :on-error='handlError'>
              <el-button size="small" class="add_btn" type="primary">上传封面</el-button>
              <div slot="tip" class="el-upload__tip">只能上传 jpg/png 文件,尺寸750x310px,大小不超过 2M</div>
            </el-upload>
          </el-form-item>
        </el-col>
        <!-- <el-col style="text-align: center;">
                    <el-button class="add_btn">生成预览</el-button>
                </el-col> -->
        <el-col style="width:375px" class="img" v-loading="loadingCover">
          <el-row type="flex" class="row-bg" justify="space-between" align="middle">
            <el-col :span="8" class="line"></el-col>
            <el-col :span="8" class="img-title">封面预览</el-col>
            <el-col :span="8" class="line"></el-col>
          </el-row>
          <img class="img-url-cover" :src="activityBannerUrl">
        </el-col>
      </el-row>
      <!-- 活动海报（用于app端分享查看） -->
      <p class="title">活动海报<span class="title-app">（用于app端分享查看）</span></p>
      <el-row type="flex" class="row-bg">
        <el-col v-if="url == 'edit'" :span="16">
          <el-form-item label="部门">
            <nav class="filter-container">
              <el-button-group>
                <el-button  v-for="item in form.activityDeptList" :key="item.val" :class="{add_btn:labelButton==item.vid}" @click="changeButton(item.vid)">{{item.val}}</el-button>
              </el-button-group>
            </nav>
          </el-form-item>
          <el-form-item label="活动名称">
            <span>{{form.activityName}}</span>
          </el-form-item>
          <el-form-item label="活动时间">
            <span>{{form.activityStart| parseTime('{y}-{m}-{d} {h}:{i}')}}</span>
            --
            <span>{{form.activityEnd| parseTime('{y}-{m}-{d} {h}:{i}')}}</span>
          </el-form-item>
          <el-form-item label="活动地址">
            <span>{{form.activitySite}}</span>
          </el-form-item>
          <el-form-item label="活动简介">
            <span>{{form.activityIntroduction}}</span>
          </el-form-item>
          <el-form-item label="背景图">
            <el-row  type="flex">
              <el-col >
                <el-upload class="upload-demo"
                 action="/activity/file/upload" 
                    :show-file-list="false"
                 :before-upload="(res)=>{return beforeAvatarUpload(res,{width:750,height:1334,name:'Poster'})}"
                  :on-success='posterSuccess'
                   :on-error='handlError'>
                  <el-button size="small" class="add_btn" type="primary">上传海报</el-button>
                  <div slot="tip" class="el-upload__tip">只能上传 jpg/png文件,尺寸750x1334px，大小不超过 2M</div>
                </el-upload>
            </el-col>
            <el-col >
              <a size="small" class="common_btn" :href="downloadUrl">下载模板</a>
            </el-col>
          </el-row>

          </el-form-item>
        </el-col>
        <!-- <el-col style="text-align: center;">
                    <el-button class="add_btn">生成预览</el-button>
                </el-col> -->
        <el-col style="width:375px" class="img" v-loading="loadingPoster">
          <el-row type="flex" class="row-bg" justify="space-between" align="middle">
            <el-col :span="8" class="line"></el-col>
            <el-col :span="8" class="img-title">海报预览</el-col>
            <el-col :span="8" class="line"></el-col>
          </el-row>
            <el-row>
            <el-col><img class="img-loge" :src="logImgUrl"></el-col> 
           <el-col> <img class="img-url-poster" :src="activityPosterUrl"></el-col> 
           <el-col>
             <div class="img-code" id="qrcode" ref="qrcode"></div>
           </el-col> 
          </el-row>
         </el-col>
      </el-row>
     
      <div style="height:20px;"></div>
        <div style="text-align: center;" v-if="url == 'edit'">
      <el-button  v-if="!(url == 'add')" class="add_btn" @click="releaseEvent">发布活动</el-button>
      <el-button class="add_btn" @click="save('ruleForm')">保 存</el-button>
      <el-button class="search_btn" @click="cancelSava">取 消</el-button>
    </div>
    </el-form>
  </el-row>
</article>
</template>

<script>
import {activityPoster,releaseEvent} from '@/api/market/eventsList'
import {getSubcompany} from '@/api/market/setting'
import QRCode from 'qrcodejs2'
import {mapGetters} from 'vuex'
export default {
  name: 'eventPoster',
  props:['form'],
   components: {QRCode},
  data() {
    return {
      activityBannerUrl:this.form.activityBannerUrl || 'static/img/activity/banner.png',
      activityPosterUrl:this.form.activityPosterUrl ||  'static/img/activity/poster.png',
      downloadUrl:'static/img/activity/poster.psd',
      logImgUrl:null,
      codeImgUrl:null,
      loadingCover:false,
      loadingPoster:false,
       url : this.$route.path.split('/')[3],
      activityId:this.$route.params.activityId,
      posterList:{},
      listQuery:{
        page: 1,
        limit: 200
      },
      list:{},
      labelButton:this.form.activityDeptList[0].vid,
      codeUrl:this.form.qrcodeTargetUrl
    }
  },
  created() {
    this.getList()
  },

mounted(){
  this.$nextTick(()=>{
   this.qrcode();
  })

},
  methods: {
    qrcode () {
        let qrcode = new QRCode('qrcode', {  
            width: 100,  // 设置宽度 
            height: 100, // 设置高度
            text: this.codeUrl
        })  
      },
    getList() {
      getSubcompany(this.listQuery).then(response => {
        this.list = response.data.records
        this.changeButton(this.labelButton)
      })
    },
    changeButton(vid){
      let self = false
      this.list.forEach(item=>{
        if(item.deptId == vid){
          this.logImgUrl = item.logo
          this.labelButton = item.deptId
          self = true
        }
      })
      if(!self) {
        this.logImgUrl = null
        this.labelButton = vid
      } 
    },

    activityPoster(){
       this.posterList = {
          activityBannerUrl: this.activityBannerUrl,
          activityPosterUrl: this.activityPosterUrl,
          activityId:  this.activityId
        }
        activityPoster(this.posterList).then(res=>{
          if(res.status == 200){
            this.$notify({
              title: '成功',
              message: '保存成功',
              type: 'success'
            });
          }
        })
    },
    handlError(file, fileList) {
       this.loadingClose()
      this.$notify({
        title: '警告',
        message: '上传失败，请稍后再试',
        type: 'warning'
      });
    },

    beforeAvatarUpload(file, obj) {
      let width = obj.width;
      let height = obj.height;
      const isJPG = file.type === 'image/jpeg' || file.type === 'image/png';
      const isLt2M = file.size / 1024 / 1024 < 2;
       if (obj.name == 'Cover'){
          this.loadingCover = true
       }else{
          this.loadingPoster = true
       }
     
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
          message: '上传头像图片大小不能超过 2MB!',
          type: 'warning'
        });
        return false;
      }
      const isSize = new Promise(function(resolve, reject) {
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
          message: `上传头像图片必须是${width}*${height}`,
          type: 'warning'
        });
         this.loadingClose()
        return Promise.reject();
      });
      if(!(isJPG && isLt2M))  this.loadingClose()
      return isJPG && isLt2M && isSize;
    },
    loadingClose(){
       this.loadingCover = false
        this.loadingPoster = false
    },
    // 封面上传成功
    coverSuccess(file) {
      
      this.activityBannerUrl = file.url
      this.$nextTick(()=>{
         this.loadingClose()
      })
    },
    // 海报上传成功
    posterSuccess(file) {
      this.activityPosterUrl = file.url
       this.$nextTick(()=>{
         this.loadingClose()
      })
    },
    // 保存
    save(){
      this.activityPoster()
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
      if(this.form.activityStatusId == 0){
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
              this.$router.push(`/market/eventsList/edit/${res.data.data}/1`)
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
  },
  computed: {
    ...mapGetters([
      'permissions',
      'workStatus',
      'lockStatus'
    ])
  },

}
</script>

<style lang="scss" scoped>
.event-poster {
    letter-spacing: 0;
    .title {
        font-family: PingFangSC-Medium;
        font-size: 16px;
        color: #2F2F2F;
        border-bottom: 1px solid #E9E9E9;
        padding-bottom: 10px;
        .title-app {
            font-family: PingFangSC-Regular;
            font-size: 14px;
            color: #000000;
            line-height: 22px;
        }
    }
    .upload-description {
        display: block;
        font-family: PingFangSC-Regular;
        font-size: 12px;
        color: #BABBBB;
        letter-spacing: 0;
        line-height: 14px;
    }
    .img {
      position: relative;
      .img-url-poster{
        width: 375px;
        height: 667px;
      }
      .img-url-cover{
        width: 375px;
        height: 155px;
      }
      .img-loge{
        position: absolute;
        max-height: 35px;
        top: 20px;
        left: 20px;
      }
      .img-code{
        position: absolute;
        bottom: 50px;
        left:137.5px;
      }
    .row-bg{
        width: 100%;
       margin: 20px 0;
        .line{
        height: 1px;
        background-color: #D1D1D1;
        }
        .img-title{
          font-family: PingFangSC-Regular;
          font-size: 16px;
          color: #767676;
          letter-spacing: 0;
          text-align: center;
        }
      }

    }
}
</style>

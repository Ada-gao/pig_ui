<template>
<div class="app-container calendar-list-container">
 
  <el-dialog :visible.sync="dialogVisible" width="20%" @open = "qrcode">
    <article>
      <div class="title-code">{{activityQrcodeUrl.activityQrcodeUrl.activityName}}</div>
      <time>时间： 
          <span>{{activityQrcodeUrl.activityQrcodeUrl.activityStart| parseTime}}</span>
            --
          <span>{{activityQrcodeUrl.activityQrcodeUrl.activityEnd| parseTime}}</span>
      </time>
      <p>地点：{{activityQrcodeUrl.activityQrcodeUrl.activitySite}}</p>
    </article>
    <section>
      <p>报名请扫描二维码</p>
      <div id="qrcode" ref="qrcode"></div>
      <div class="logo-img"><img :src="logoImg" alt=""></div>
      
    </section>
  </el-dialog>

</div>
</template>

<script>
import QRCode from 'qrcodejs2'
export default {
  name: 'qqrcode',
  props:['activityQrcodeUrl'],
   components: {QRCode},
  data() {
    return {
      dialogVisible: true,
      logoImg:'static/img/activity/logo.png',
    }
  },
 watch:{
   dialogVisible(val){
     this.$emit('dialogVisibleChild',val)
   }

 },
  mounted(){
  this.$nextTick(()=>{
   this.qrcode();
  })
},
  methods: {
       qrcode () {
        let qrcode = new QRCode('qrcode', {  
            width: 200,  // 设置宽度 
            height: 200, // 设置高度
            text: this.activityQrcodeUrl.activityQrcodeUrl.qrcodeTargetUrl
        })  
      },
  }
}
</script>

<style lang="scss" scoped>
.el-date-editor,
.el-select {
    width: 100%;
}
.title-code {
    font-family: PingFangSC-Medium;
    font-size: 20px;
    color: #000000;
    letter-spacing: 0;
}
article{
  border-bottom: 1px solid #E2E2E2;
  margin-bottom: 20px;
}
section{
  font-family: PingFangSC-Medium;
  font-size: 20px;
  color: #475669;
  letter-spacing: 0;
  text-align: center;
  position: relative;
    #qrcode{
    position: relative;
    left: 50%;
    margin-left: -100px;
  }
  .logo-img{
    width: 66px;
    background: #FFFFFF;
    border-radius: 3px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform:translate(-50%);
    padding:4px;
    img{
      width: 100%;
    }
  }
}

</style>

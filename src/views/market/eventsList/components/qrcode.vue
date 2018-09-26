<template>
<div class="app-container calendar-list-container">
 
  <el-dialog :visible.sync="dialogVisible" width="20%" @open = "qrcode">
    <article>
      <div class="title-code">解码未来“2018年独角兽企业投资经济论坛</div>
      <time>时间：2018-4-1 14:00-16:00</time>
      <p>地点：陆家嘴软件园</p>
    </article>
    <section>
      <p>报名请扫描二维码</p>
<div id="qrcode" ref="qrcode"></div>
    

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
            text: window.location.port+this.activityQrcodeUrl
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
}
#qrcode{
        text-align: center;
position: absolute;
  img{
    width: 200px;
  }
}
</style>

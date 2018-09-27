<template>
    <iframe ref="iframe" :src="baseUrl" frameborder="0" style="border:0;" width="100%"></iframe>
</template>

<script>
  export default {
    data () {
      return {
        baseUrl: 'http://10.9.60.141:9999/swagger-ui.html'
      }
    },
    mounted() {
      this.iframeInit()
      var url = require('../../../../config/dev.env')
      this.baseUrl = url.BASE_API + '/swagger-ui.html' || this.baseUrl
    },
    methods: {
      iframeInit() {
        const iframe = this.$refs.iframe
        const clientHeight = document.documentElement.clientHeight - 84
        iframe.style.height = `${clientHeight}px`
      }
    }
  }
</script>

<style scoped>
</style>

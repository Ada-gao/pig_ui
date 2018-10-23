<template>
    <iframe ref="iframe" :src="swaggerUrl" frameborder="0" style="border:0;" width="100%"></iframe>
</template>

<script>
  let baseApi = require('../../../../config/dev.env').BASE_API
  export default {
    data () {
      return {
        swaggerUrl: ''
      }
    },
    mounted() {
      this.iframeInit()
      this.swaggerUrl = baseApi + '/swagger-ui.html'
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

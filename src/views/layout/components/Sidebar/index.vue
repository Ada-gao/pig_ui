<template>
  <scroll-bar>
    <el-menu mode="vertical" unique-opened :default-active="defaultActive" :collapse="isCollapse" background-color="#304156" text-color="#fff" active-text-color="#409EFF">
      <sidebar-item :routes="permission_routers"></sidebar-item>
    </el-menu>
  </scroll-bar>
</template>

<script>
import { mapGetters } from 'vuex'
import SidebarItem from './SidebarItem'
import ScrollBar from '@/components/ScrollBar'
import Bus from '@/assets/js/bus'

export default {
  components: { SidebarItem, ScrollBar },
  computed: {
    ...mapGetters([
      'permission_routers',
      'sidebar'
    ]),
    routes() {
      return this.$router.options.routes
    },
    isCollapse() {
      return !this.sidebar.opened
    }
  },
  mounted() {
    Bus.$on('activeIndex', defaultActive => {
      this.defaultActive = defaultActive
    })
    console.log('this.defaultActive')
    console.log(this.$route)
  },
  data() {
    return {
      defaultActive: this.$route.matched[0].redirect
    }
  }
}
</script>

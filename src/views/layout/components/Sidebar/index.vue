<template>
  <scroll-bar>
    <el-menu mode="vertical" unique-opened :default-active="defaultActive" :collapse="isCollapse" background-color="#304156" text-color="#fff" active-text-color="#00C1DF" @select="handleSelect">
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
    // console.log('this.defaultActive')
    // console.log(this.defaultActive)
    // console.log(this.$route)
    // console.log(this.$route.params)
  },
  data() {
    return {
      defaultActive: Object.keys(this.$route.params).length != 0 ? this.$route.matched[0].redirect : this.$route.fullPath
    }
  },
  methods: {
    handleSelect(key, keyPath) {
      // console.log(key, keyPath)
    }
  }
}
</script>

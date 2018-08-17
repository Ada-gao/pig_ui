<template>
  <section class="dept" style="min-height: 100%">
    <el-cascader
      style="width: 100%"
      :options="treeDeptData"
      :props="defaultProps"
      :show-all-levels="false"
      change-on-select
      v-model="deptIds"
      @change="changeDept"
    ></el-cascader>
  </section>
</template>

<script>
import { fetchDeptTree } from '@/api/role'
export default {
  data() {
    return {
      treeDeptData: [],
      defaultProps: {
        children: 'children',
        label: 'name',
        value: 'id'
      },
      deptIds: this.deptId
    }
  },
  props: ['isCompany', 'deptId'],
  created() {
    this.handleDept()
  },
  mounted() {
    console.log(this.deptId)
  },
  methods: {
    handleDept() { // 部门数据
      const parmas = {
        isCompany: this.isCompany
      }
      fetchDeptTree(parmas).then(res => {
        this.treeDeptData = res.data
        this.delNullArr(this.treeDeptData)
      })
    },
    changeDept(val) {
      this.$emit('change', val)
    },
    delNullArr(list) {
      list.forEach(item => {
        if(item.children && !item.children.length) {
          delete item.children
        } else if(item.children && item.children.length) {
          this.delNullArr(item.children)
        }
      })
    }
  }
}
</script>

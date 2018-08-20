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
  // props: ['isCompany', 'deptId'],
  props: {
    isCompany: {
      type: String,
      default: ''
    },
    // deptId: {
    //   type: Array,
    //   default: []
    // },
    value: {
      type: Array,
      default() {
        return []
      }
    }
  },
  watch: {
    value(val) {
      console.log(val)
      this.deptIds = val
    }
  },
  created() {
    // console.log(this.value)
    this.handleDept()
  },
  mounted() {
    // console.log(this.value)
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
      console.log(this.value)
      this.$emit('input', val)
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

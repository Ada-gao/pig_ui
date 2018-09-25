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
/**
 * keyProps: isCompany
 * default: 'all':所有部门  'topDept':一级部门   'subCompany':子公司
 */
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
      deptIds: [],
      deptId: undefined,
      getDepts: false,
      curPrevId: '',
      eachIndex: 0,
      result: [],
      changeVal: undefined,
      childrenId: []
    }
  },
  props: {
    isCompany: {
      type: String,
      default: 'all'
    },
    value: {
      type: Array,
      default() {
        return []
      }
    }
  },
  watch: {
    value(val) {
      if(val && val === this.changeVal) return
      if(val) {
        this.deptIds = val
        this.deptId = val[0]
        this.handleDept()
      }
    }
  },
  created() {
    this.handleDept()
    if(this.value === this.changeVal) return
    if(this.value.length) {
      this.deptIds = this.value
      this.deptId = this.value[0]
    }
  },
  methods: {
    handleDept() {
      let parmas = {}
      if(this.isCompany !== 'all') {
          parmas = {
          isCompany: this.isCompany === 'topDept' ? '0' : '1'
        }
      }
      fetchDeptTree(parmas).then(res => { // 获取部门数据并过滤
        this.getDepts = true
        this.treeDeptData = res.data
        this.cycleListId(this.treeDeptData)
        this.delNullArr(this.treeDeptData)
      }).then(() => {
        this.upperIds(this.result, [], this.deptId)
      })
    },
    changeDept(val) {
      this.changeVal = val
      this.$emit('input', val) // 传值给条用组件的v-model
      this.$emit('change', val)
    },
    delNullArr(list) { // 清空数组的空children
      list.forEach(item => {
        if(item.children && !item.children.length) {
          delete item.children
        } else if(item.children && item.children.length) {
          this.delNullArr(item.children)
        }
      })
    },
    cycleListId(list, prevId = []) { // 获取所有完整路径的id
      list.forEach(item => {
        if (item.children && item.children.length > 0) {
          this.curPrevId = [...prevId, item.id]
          this.cycleListId(item.children, this.curPrevId)
        }
        if (item.children && !item.children.length) {
          this.result[this.eachIndex] = [...prevId, item.id]
          this.eachIndex++
        }
      })
    },
    upperIds(list1, list2, id) { // 获取v-model值的完整路径
      list1.map(item => {
        item.map((el, index) => {
          if (el === id) {
            list2 = JSON.parse(JSON.stringify(item))
            list2.splice(index + 1, list2.length - 1)
          }
        })
      })
      this.deptIds = list2
    }
  }
}
</script>

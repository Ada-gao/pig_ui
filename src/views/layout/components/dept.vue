<template>
  <section class="dept" style="min-height: 100%">
    <!-- <el-input v-if="!getDepts" v-model="deptName" placeholder="选择部门" @focus="handleDept()" readonly></el-input> -->
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
      deptIds: this.deptId,
      getDepts: false,
      curPrevId: '',
      result: []
    }
  },
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
      type: Number,
      default: undefined
    },
    // value: {
    //   type: Array,
    //   default() {
    //     return []
    //   }
    // },
    deptName: {
      type: String,
      default: ''
    }
  },
  watch: {
    value(val) {
      console.log(val)
      this.deptIds = val
    }
  },
  created() {
    console.log(this.value)
    this.deptIds = this.value
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
        this.getDepts = true
        this.treeDeptData = res.data
        this.delNullArr(this.treeDeptData)
        this.cycleListId(this.treeDeptData)
      }).then(() => {
        this.upperIds(this.result, [], this.deptIds)
      })
    },
    changeDept(val) {
      // console.log(val)
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
    },
    cycleListId(list, prevId = []) {
      list.forEach(item => {
        if (item.children && item.children.length > 0) {
          this.curPrevId = [...prevId, item.id]
          this.cycleListId(item.children, this.curPrevId)
        }
        if (item.children && !item.children.length) {
          console.log(this.result)
          this.result[this.eachIndex] = [...prevId, item.id]
          this.eachIndex++
        }
      })
    },
    upperIds(list1, list2, id) {
      // console.log(list1)
      list1.map(item => {
        item.map((el, index) => {
          if (el === id) {
            list2 = JSON.parse(JSON.stringify(item))
            list2.splice(index + 1, list2.length - 1)
          }
        })
      })
      console.log(list2)
      this.deptIds = list2
    }
  }
}
</script>

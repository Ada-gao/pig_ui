<template>
  <el-table :data="expandData" border style="width: 100%">
    <el-table-column align="center" label="问题">
      <template slot-scope="props">
        <span>
          {{props.row.topic}}
        </span>
      </template>
    </el-table-column>
    <el-table-column align="center" label="选项">
      <template slot-scope="props">
        <el-radio-group v-model="props.row.answer">
          <el-radio
            v-for="item in props.row.options"
            :label="item.seq"
            :key="item.seq"
            :value="item.seq">{{item.content}}</el-radio>
        </el-radio-group>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
import { getRiskEval } from '@/api/client/client'

export default {
  props: ['riskTestId'],
  data() {
    return {
      expandData: []
    }
  },
  mounted() {
    this.getList(this.riskTestId)
  },
  methods: {
    getList(riskTestId) {
      getRiskEval(riskTestId).then(res => {
        this.expandData = res.data
        this.expandData.forEach(item => {
          item.options = JSON.parse(item.options)
        })
      })
    }
  }
}
</script>


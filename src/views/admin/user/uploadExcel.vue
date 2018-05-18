<template>
  <div class="app-container">
    <upload-excel-component @on-selected-file='selected'></upload-excel-component>
    <el-table :data="tableData" border highlight-current-row style="width: 100%;margin-top:20px;">
      <el-table-column v-for='item of tableHeader' :prop="item" :label="item" :key='item'>
      </el-table-column>
    </el-table>
    <el-button v-if="tableHeader.length" size="small" type="success" style="float: right" @click="submit">确认导入</el-button>
  </div>
</template>

<script>
import UploadExcelComponent from '@/components/UploadExcel/index.vue'
import { uploadExcel } from '@/api/uploadExcel'

export default {
  name: 'uploadExcel',
  components: { UploadExcelComponent },
  data() {
    return {
      tableData: [],
      tableHeader: [],
      formData: null
    }
  },
  methods: {
    selected(data) {
      this.tableHeader = data.header
      this.tableData = data.results
      this.formData = data.formData
    },
    submit() {
      let config = {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }
      uploadExcel(this.formData, config).then(res => {
        if(!res) {
          console.log('上传失败')
        } else {
          console.log('上传成功')
        }
      })
    }
  }
}
</script>

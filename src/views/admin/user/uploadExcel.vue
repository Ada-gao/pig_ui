<template>
  <div class="app-container">
    <upload-excel-component @on-selected-file='selected'></upload-excel-component>
    <el-button class="add_btn" v-if="tableHeader.length" size="small" style="float: right" @click="submit">确认导入</el-button>
    <el-table :data="tableData" border highlight-current-row style="width: 100%;margin-top:20px;">
      <el-table-column v-for='item of tableHeader' :prop="item" :label="item" :key='item'>
      </el-table-column>
    </el-table>
    <!-- <div v-if="!tableHeader.length">
      表格模版
    </div>
    <el-table v-if="!tableHeader.length" :data="modelData" border highlight-current-row style="width: 100%;margin-top:20px;">
      <el-table-column v-for='item of modelHeader' :prop="item" :label="item" :key='item'>
      </el-table-column>
    </el-table> -->
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
      formData: null,
      modelData: [
        {
          name: '大王',
          username: 'dawang',
          password: '123456',
          delFlag: '0',
          deptId: '0',
          education: '0',
          email: 'dawang@shuyun365.com',
          empNo: '1',
          gender: '1',
          idNo: '1',
          idType: '1',
          mobile: '13600000000',
          role: '2',
        }
      ],
      modelHeader: ["name", "username", "password", "delFlag", "deptId", "education", "email", "empNo", "gender", "idNo", "idType", "mobile", "role"]
    }
  },
  methods: {
    selected(data) {
      this.tableHeader = data.header
      this.tableData = data.results
      console.log(this.tableHeader)
      console.log(this.tableData)
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

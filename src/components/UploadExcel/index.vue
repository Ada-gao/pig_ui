<template>
  <div>
    <input id="excel-upload-input" type="file" accept=".xlsx, .xls" class="c-hide" @change="handkeFileChange">
    <div id="drop" class="el-upload-dragger" @drop="handleDrop" @dragover="handleDragover" @dragenter="handleDragover">
      <i class="el-icon-upload"></i>
      <div class="el-upload__text">将文件拖到此处，或<em @click="handleUpload">点击导入</em></div>
      <!-- <el-button style="margin-left:16px;" size="mini" type="primary" @click="handleUpload">browse</el-button> -->
    </div>
    <!-- <el-upload
      class="upload-demo"
      drag
      action="https://jsonplaceholder.typicode.com/posts/"
      :on-success="handkeFileChange"
      multiple>
      <i class="el-icon-upload"></i>
      <div class="el-upload__text">将文件拖到此处，或<em>点击导入</em></div>
      <div class="el-upload__tip" slot="tip">只能导入 Excel 文件 <a href="javascript:;">下载 Excel 模版</a></div>
    </el-upload> -->
  </div>
</template>

<script>
import XLSX from 'xlsx'
import { uploadExcel } from '@/api/uploadExcel'

export default {
  data() {
    return {
      loading: false,
      excelData: {
        header: null,
        results: null
      }
    }
  },
  methods: {
    generateDate({ header, results, formData }) {
      this.excelData.header = header
      this.excelData.results = results
      this.excelData.formData = formData
      this.$emit('on-selected-file', this.excelData)
    },
    handleDrop(e) {
      e.stopPropagation()
      e.preventDefault()
      const files = e.dataTransfer.files
      if (files.length !== 1) {
        this.$message.error('Only support uploading one file!')
        return
      }
      const itemFile = files[0] // only use files[0]
      this.readerData(itemFile)
      e.stopPropagation()
      e.preventDefault()
    },
    handleDragover(e) {
      e.stopPropagation()
      e.preventDefault()
      e.dataTransfer.dropEffect = 'copy'
    },
    handleUpload() {
      document.getElementById('excel-upload-input').click()
    },
    handkeFileChange(e) {
      const files = e.target.files
      const itemFile = files[0] // only use files[0]
     
      let formData = new FormData()
      formData.append('file', itemFile)
      
      this.readerData(itemFile, formData)
      
    },
    readerData(itemFile, formData) {
      const reader = new FileReader()
      reader.onload = e => {
        const data = e.target.result
        const fixedData = this.fixdata(data)
        const workbook = XLSX.read(btoa(fixedData), { type: 'base64' })
        const firstSheetName = workbook.SheetNames[0]
        const worksheet = workbook.Sheets[firstSheetName]
        const header = this.get_header_row(worksheet)
        const results = XLSX.utils.sheet_to_json(worksheet)
        this.generateDate({ header, results, formData })
      }
      reader.readAsArrayBuffer(itemFile)
    },
    fixdata(data) {
      let o = ''
      let l = 0
      const w = 10240
      for (; l < data.byteLength / w; ++l) o += String.fromCharCode.apply(null, new Uint8Array(data.slice(l * w, l * w + w)))
      o += String.fromCharCode.apply(null, new Uint8Array(data.slice(l * w)))
      return o
    },
    get_header_row(sheet) {
      // const headers = ['姓名', '用户名', '密码', '工作状态', '部门', '学历', '邮箱', '工号', '性别', '证件号码', '证件类型', '手机号', '角色']
      const headers = []
      const range = XLSX.utils.decode_range(sheet['!ref'])
      let C
      const R = range.s.r /* start in the first row */
      for (C = range.s.c; C <= range.e.c; ++C) { /* walk every column in the range */
        var cell = sheet[XLSX.utils.encode_cell({ c: C, r: R })] /* find the cell in the first row */
        var hdr = 'UNKNOWN ' + C // <-- replace with your desired default
        if (cell && cell.t) hdr = XLSX.utils.format_cell(cell)
        headers.push(hdr)
      }
      // headers[0] = headers[0] === 'name' ? '姓名': headers[0]
      return headers
    }
  }
}
</script>

<style scoped>
#excel-upload-input{
  display: none;
  z-index: -9999;
}
#drop{
  border: 2px dashed #bbb;
  width: 600px;
  height: 160px;
  line-height: 160px;
  margin: 0 auto;
  font-size: 24px;
  border-radius: 5px;
  text-align: center;
  color: #bbb;
  position: relative;
}
.el-upload__text {
  position: absolute;
  line-height: 20px;
  height: 20px;
  top: 70%;
  left: 50%;
  transform: translate(-50%, -50%);
}
</style>

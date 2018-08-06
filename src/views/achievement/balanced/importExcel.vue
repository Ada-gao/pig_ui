<template>
  <div class="app-container">
    <el-dialog
      title="提示"
      :visible.sync="dialogVisible"
      width="30%">
      <span>确定要导入这些数据吗？</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submit">确 定</el-button>
      </span>
    </el-dialog>
    <upload-excel-component @on-selected-file='selected' :downloadUrl="downloadUrl"></upload-excel-component>
    <div class="detail-title" style="margin-top:30px">
      <el-button :class="tableData.length > 0 ? 'add_btn' : 'insert_btn'" @click="showDialog">
        <svg-icon icon-class="upload" style="margin-right:10px;"></svg-icon>确认导入
      </el-button>

      <span style="float:right;">共有
        <i style="color:#0299CC;font-style: normal;">
          {{tableData.length}}
        </i>条
      </span>
    </div>
    <el-table v-if="errorList.length === 0" :data="tableData" border highlight-current-row style="width: 100%;margin-top:20px;">
      <el-table-column v-for='item of tableHeader' :prop="item" :label="item" :key='item'>
      </el-table-column>
    </el-table>
    <el-table v-if="errorList.length !== 0" :data="errorList" :span-method="objectSpanMethod" border highlight-current-row style="width: 100%;margin-top:20px;">
      <el-table-column prop="errorNo" label="行数">
      </el-table-column>
      <el-table-column label="错误项">
        <template slot-scope="prop">
          {{prop.row.errorItem}}<span style="color: #D0021B">（{{prop.row.errorReason}}）</span>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
  import UploadExcelComponent from '@/components/UploadExcel/index.vue'
  import { balancedImport } from '@/api/achievement/index'
  import { replaceKey } from '@/utils'  

  export default {
    name: 'uploadExcel',
    components: { UploadExcelComponent },
    data() {
      return {
        tableData: [],
        tableHeader: [],
        formData: null,
        dialogVisible: false,
        downloadUrl: 'static/excel/平衡计分卡系数模版.xlsx',
        errorList: [],
      }
    },
    methods: {
       objectSpanMethod({ row, column, rowIndex, columnIndex }) {
        if (columnIndex === 0) {
          if (rowIndex % 2 === 0) {
            return {
              rowspan: 2,
              colspan: 1
            }
          } else {
            return {
              rowspan: 0,
              colspan: 0
            }
          }
        }
      },
      showDialog() {
        if (this.tableData.length > 0) {
          this.dialogVisible = true
        }
      },
      selected(data) {
        // this.tableHeader = data.header
        // this.tableData = data.results
        // console.log(this.tableHeader)
        // console.log(this.tableData)
        // this.formData = data.formData
        // console.log(this.formData)
        const temp = Object.assign({}, data)
        this.tableHeader = temp.header
        this.tableData = temp.results
        this.formData = JSON.parse(JSON.stringify(this.tableData))
        let kepMap = {
          '姓名': "userName",
          '工号': "userCode",
          '平衡计分卡系数': "coefficient",
          '职位': "positionName",
          '职级': "rankName",
          '部门': "deptName",
          '时间': "time",
          '行数': "lineNo"
        }
        this.formData.forEach( item => {
          replaceKey(item, kepMap)
          item.lineNo = parseInt(item.lineNo)
          let timeRange = item.time.split('—')
          item.start =  new Date(timeRange[0]).getTime()
          item.end = new Date(timeRange[1]).getTime()
          delete item.time
        })
      },
      submit() {
        // const config = {
        //   headers: {
        //     'Content-Type': 'multipart/form-data'
        //   }
        // }
        balancedImport(this.formData).then(res => {
          if (res.data.length === 0) {
            console.log('上传成功')
            this.errorList = res.data
            this.dialogVisible = false
          } else {
            console.log('上传失败')
            this.errorList = res.data
            this.errorList = this.transferError(this.errorList)
            this.dialogVisible = false            
          }
          // if (!res) {
          //   console.log('上传失败')
          // } else {
          //   console.log('上传成功')
          //   this.dialogVisible = false
          // }
        })
      }
    }
  }
</script>
<style lang="scss" scoped>
  .app-container {
    .detail-title {
      height: 40px;
      line-height: 40px;
      .el-button {
        float: right;
        margin-left: 10px;
      }
      .insert_btn {
        background: #EFF2F7;
        color: #C0CCDA;
        border: none;
        padding: 12px;
        cursor: not-allowed;
      }
      .add_btn {
        padding: 12px;
        border:none;
      }
    }
  }
</style>

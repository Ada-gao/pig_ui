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
    <el-table :data="tableData"
              border
              v-if="errorList.length === 0"
              highlight-current-row
              style="width: 100%;margin-top:20px;">
      <el-table-column v-for='item of tableHeader'
                       :prop="item"
                       :label="item"
                       :key='item'>
      </el-table-column>
    </el-table>
    <el-table v-else
              :data="errorList"
              highlight-current-row
              style="width: 100%;margin-top:20px;"
              border
              :span-method="objectSpanMethod">
      <el-table-column prop="errorNo" label="行数"></el-table-column>
      <el-table-column label="错误项">
        <template slot-scope="prop">
          {{prop.row.errorItem}}<span style="color: #d0021b;">（{{prop.row.errorReason}}）</span>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
  import UploadExcelComponent from '@/components/UploadExcel/index.vue'
  import { salesSupportListImport } from '@/api/achievement/index'
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
        downloadUrl: 'static/excel/销售支持模版.xlsx',
        errorList: [],
        spanArr: [],
        pos: null
      }
    },
    methods: {
      showDialog() {
        if (this.tableData.length > 0) {
          this.dialogVisible = true
        }
      },
      selected(data) {
        this.spanArr = []
        this.pos = null
        this.errorList = []
        const temp = Object.assign({}, data)
        this.tableHeader = temp.header
        this.tableData = temp.results
        this.formData = JSON.parse(JSON.stringify(this.tableData))
        let kepMap = {
          '预约编号': "appointmentCode",
          '理财师姓名': "userName",
          '理财师工号': "userCode",
          '销售支持姓名': "salesName",
          '销售支持工号': "salesCode",
          '佣金比例': "commissionRate",
          '行号': 'lineNo'
        }
        this.formData.forEach(item => {
          replaceKey(item, kepMap)
        })
        document.getElementById('excel-upload-input').value = null
      },
      getSpanArr(data) {
        for (let i = 0; i < data.length; i++) {
          if (i === 0) {
            this.spanArr.push(1)
            this.pos = 0
          } else {
            // 判断当前元素与上一个元素是否相同
            if (data[i].errorNo === data[i - 1].errorNo) {
              this.spanArr[this.pos] += 1
              this.spanArr.push(0)
            } else {
              this.spanArr.push(1)
              this.pos = i
            }
          }
        }
      },

      objectSpanMethod({ row, column, rowIndex, columnIndex }) {
        if (columnIndex === 0) {
          const _row = this.spanArr[rowIndex]
          const _col = _row > 0 ? 1 : 0
          return {
            rowspan: _row,
            colspan: _col
          }
        }
      },
      transferError(data) {
        const tempArr = []
        data.map((ele, index) => {
          ele.errorMegs.map((item, idx) => {
            tempArr.push(
              {
                errorNo: ele.errorNo,
                errorItem: item.errorItem,
                errorReason: item.errorReason
              }
            )
          })
        })
        return tempArr
      },
      submit() {
        salesSupportListImport(this.formData).then(res => {
          if (res.status === 200) {
            this.dialogVisible = false
            if (res.data.length === 0) {
              this.$notify({
                title: '成功',
                type: 'success',
                duration: 2000,
                message: '导入成功'
              })
              this.$router.push({ path: '/achievement/saleSupport' })
            } else {
              this.errorList = this.transferError(res.data)
              this.getSpanArr(this.errorList)
              this.dialogVisible = false
            }
          }
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

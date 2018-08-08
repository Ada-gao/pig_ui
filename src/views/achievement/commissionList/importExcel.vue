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
  import { commissionListImport } from '@/api/achievement/index'
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
        downloadUrl: 'static/excel/佣金列表模版.xlsx',
        errorList: [],
        spanArr: [],
        pos: null
      }
    },
    methods: {
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
      showDialog() {
        if (this.tableData.length > 0) {
          this.dialogVisible = true
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
      selected(data) {
        this.errorList = []
        const temp = Object.assign({}, data)
        this.tableHeader = temp.header
        this.tableData = temp.results
        this.formData = JSON.parse(JSON.stringify(this.tableData))
        let kepMap = {
          '公司': "company",
          '区域': "regional",
          '区域副总': "regionalViceManager",
          '区域总': "regionalManager",
          '团队经理': "teamManager",
          '城市副总': "cityViceManager",
          '城市总': "cityManager",
          '姓名': "userName",
          '工号': "userCode",
          '月份': "occurrenceDate",
          '本期实发佣金（元）': "finalCommission",
          '本期应发佣金（元）': "commission",
          '职位': "positionName",
          '职级': "rankName",
          '订单段': "timeSlot",
          '部门': "deptName",
          '行号': "lineNo"
        }
        this.formData.forEach( item => {
          replaceKey(item, kepMap)
          item.lineNo = parseInt(item.lineNo)
          item.commission = parseInt(item.commission)
          item.finalCommission = parseInt(item.finalCommission)
          item.occurrenceDate = new Date(item.occurrenceDate).getTime()
        })
        document.getElementById('excel-upload-input').value = null
      },
      submit() {
        commissionListImport(this.formData).then(res => {
          if (res.data.length === 0) {
            console.log('上传成功')
            this.errorList = res.data
            this.dialogVisible = false
            this.$router.push({ path: '/achievement/commissionList' })
          } else {
            console.log('上传失败')
            this.errorList = res.data
            this.errorList = this.transferError(res.data)
            this.getSpanArr(this.errorList)
            this.dialogVisible = false
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

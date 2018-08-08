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
  import { importPd } from '@/api/product/fileManage'
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
        errorList: [],
        spanArr: [],
        pos: null,
        downloadUrl: 'static/excel/产品导入模版.xlsx'
      }
    },
    methods: {
      showDialog() {
        if (this.tableData.length > 0) {
          this.dialogVisible = true
        }
      },
      selected(data) {
        this.errorList = []
        const temp = Object.assign({}, data)
        this.tableHeader = temp.header
        this.tableData = temp.results
        this.formData = JSON.parse(JSON.stringify(this.tableData))
        const kepMap = {
          '产品编号': 'productCode',
          '产品全称': 'productName',
          '产品简称': 'productShortName',
          '产品状态': 'productStatusName',
          '产品结构类型': 'productMixType',
          '产品收益类型': 'productType',
          '产品风险级别': 'productRiskLevel',
          '基金管理人': 'manager',
          '交易币种': 'currency',
          '购买人群': 'buyingCrowdsName',
          '产品期限': 'investmentHorizon',
          '期限单位': 'investmentHorizonUnitName',
          '收益率类型': 'isFloat',
          '收益对标基准（%）': 'annualizedReturn',
          '募集额度（万）': 'collectionAmount',
          '募集人数': 'productLp',
          '起投金额（万）': 'minimalAmount',
          '追加金额（万）': 'minimalAddAmount',
          '收益分配方式': 'incomeDistribution',
          '资产团队': 'assetTeam',
          '托管银行': 'custodianBank',
          '关联产品': 'relevanceName',
          '关联类型': 'relevanceType',
          '渠道人数': 'channelNumber',
          '渠道打款金额（万）': 'channelAmount',
          '付息方式': 'interestPaymentName',
          '认购费': 'subscribeName',
          '价外认购（%）': 'subscribeRate',
          '产品公告': 'announcement',
          '账户名称': 'accountName',
          '账号': 'cardNo',
          '开户银行名称': 'bankName',
          '大额支付行号': 'paymentNumber',
          '成立日期': 'establishmentDate',
          '起息日期': 'valueDate',
          '关账日期': 'closeDate',
          '重点产品起始时间': 'importantStart',
          '重点产品结束时间': 'importantEnd',
          '预约时效（小时）': 'timeliness',
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
        importPd(this.formData).then(res => {
          if (res.status === 200) {
            this.dialogVisible = false
            if (res.data.length === 0) {
              this.$notify({
                title: '成功',
                type: 'success',
                duration: 2000,
                message: '导入成功'
              })
              // this.$router.push({ path: '/achievement/perform' })
            } else {
              this.errorList = this.transferError(res.data)
              this.getSpanArr(this.errorList)
              this.dialogVisible = false
            }
          }
        }).catch(() => {
          this.dialogVisible = false
          this.$notify({
            title: '失败',
            message: '导入失败',
            type: 'error',
            duration: 2000
          })
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

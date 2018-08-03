<template>
  <div class="filter-container">
    <el-form label-position="right" label-width="100px">
      <el-row :gutter="20">
        <el-col :sm="10" :lg="7" v-show="!searchContract">
          <el-form-item label="产品名称">
            <el-input
            placeholder="请输入产品名称/简称"
            v-model="listQuery.productName">
          </el-input>
          </el-form-item>
        </el-col>
        <el-col :sm="10" :lg="7" v-show="searchContract">
          <el-form-item label="合同编号">
            <el-input
            placeholder="请输入合同编号"
            v-model="listQuery.contractNo">
          </el-input>
          </el-form-item>
        </el-col>
        <el-col :sm="10" :lg="7">
          <el-form-item label="客户">
            <el-input
            placeholder="请输入客户姓名"
            v-model="listQuery.clientName">
          </el-input>
          </el-form-item>
        </el-col>
        <el-col :sm="10" :lg="7" v-show="searchDate">
          <el-form-item label="日期">
              <el-date-picker
                style="width: 100%"
                v-model="listQuery.date"
                type="daterange"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                :default-time="['00:00:00', '23:59:59']">
              </el-date-picker>
            </el-form-item>
        </el-col>
        <el-col :sm="3" :lg="3"
          class="query-color"
          style="text-align: right; float: right; cursor: pointer">
          <div @click="isSpread = !isSpread">
            <span v-show="isSpread"><svg-icon icon-class="searchHide"></svg-icon> 收起搜索条件</span>
            <span v-show="!isSpread"><svg-icon icon-class="searchUp"></svg-icon> 展开搜索条件</span>
          </div>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <el-col :sm="10" :lg="7" v-show="isSpread">
          <el-form-item label="理财师">
            <el-input
            placeholder="请输入理财师邮箱前缀"
            v-model="listQuery.email">
          </el-input>
          </el-form-item>
        </el-col>
        <el-col :sm="10" :lg="7" v-show="isSpread && searchAppointmentCode">
          <el-form-item label="预约编号">
            <el-input
            placeholder="请输入预约编号"
            v-model="listQuery.appointmentCode">
          </el-input>
          </el-form-item>
        </el-col>
        <el-col :sm="10" :lg="7" style="white-space: nowrap" v-show="isSpread">
          <el-form-item label="所属部门">
            <el-cascader
              style="width: 100%"
              :options="treeDeptData"
              :props="defaultProps"
              :show-all-levels="false"
              change-on-select
              v-model="deptId"
            ></el-cascader>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :sm="12" :lg="8" style="white-space: nowrap" v-show="isSpread && searchTranscStatus">
          <el-form-item label="订单状态">
            <el-radio-group v-model="transcStep" @change="changeTransc">
              <el-radio-button v-for="item in transcStatus" :label="item.value" :key="item.value">{{item.label}}</el-radio-button>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :sm="12" :lg="8" style="white-space: nowrap" v-show="isSpread && searchAppoint && (transcStep == 10 || status == 10)">
          <el-form-item label="预约状态">
             <el-checkbox-group v-model="listQuery.status">
              <el-checkbox-button v-for="item in appointStatus" :label="item.value" :key="item.value">{{item.label}}</el-checkbox-button>
            </el-checkbox-group>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :sm="12" :lg="8" style="white-space: nowrap" v-show="isSpread && searchPayment && (transcStep == 20 || status == 20)">
          <el-form-item label="打款状态">
             <el-checkbox-group v-model="listQuery.status">
              <el-checkbox-button v-for="item in paymentStatus" :label="item.value" :key="item.value">{{item.label}}</el-checkbox-button>
            </el-checkbox-group>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :sm="12" :lg="8" style="white-space: nowrap" v-show="isSpread && searchContract && (transcStep == 30 || status == 30)">
          <el-form-item label="合同状态">
             <el-checkbox-group v-model="listQuery.status">
              <el-checkbox-button v-for="item in contractStatus" :label="item.value" :key="item.value">{{item.label}}</el-checkbox-button>
            </el-checkbox-group>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :sm="12" :lg="8" style="white-space: nowrap" v-show="isSpread && searchRefund">
          <el-form-item label="退款状态">
            <el-checkbox-group v-model="listQuery.refundStatus">
            <el-checkbox-button v-for="status in refundStatus" :label="status.value" :key="status.value">{{status.label}}</el-checkbox-button>
          </el-checkbox-group>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row style="text-align: center;">
        <el-button class="search_btn btn-padding" type="info" @click="handleFilter"><svg-icon icon-class="search"></svg-icon> 查询</el-button>
        <el-button class="search_btn btn-padding" type="info" @click="resetFilter"><svg-icon icon-class="reset"></svg-icon> 重置</el-button>
      </el-row>
    </el-form>
  </div>
</template>

<script>
import { fetchDeptTree } from '@/api/role'
import { mapGetters } from 'vuex'
import { fetchProductTypeList } from '@/api/product/productType'
import Bus from '@/assets/js/bus'
import { parseTime } from '@/utils'

export default {
  props: {
    searchAppointmentCode: {
      default: true
    },
    searchClientName: {
      default: true
    },
    searchDate: {
      default: true
    },
    searchTranscStatus: {
      default: true
    },
    searchDept: {
      default: true
    },
    searchRefund: {
      default: true
    },
    searchAppoint: {
      default: true
    },
    searchPayment: {
      default: true
    },
    searchContract: {
      default: true
    },
    status: {
      default: 0
    }
  },
  data() {
    return {
      listQuery: {},
      deptId: [],
      treeDeptData: [],
      listQuery: {
        page: 1,
        limit: 20,
        status: [],
        refundStatus: [],
        date: [],
        orderByField: 'create_time',
        isAsc: false
      },
      transcStep: '',
      defaultProps: {
        children: 'children',
        label: 'name',
        value: 'id'
      },
      // defaultProps2: {
      //   value: 'label'
      // },
      productTypes: [],
      // entryDate: [],
      isSpread: false,
      appointList: [],
      transferList: [],
      contractList: []
    }
  },
  computed: {
    ...mapGetters([
      'transcStatus',
      'appointmentStatus',
      'refundStatus',
      'appointStatus',
      'paymentStatus',
      'contractStatus'
    ])
  },
  created() {
    this.handleDept()
    this.fetchList()
  },
  methods: {
    handleFilter() { // 搜索
      this.listQuery.page = 1
      let dateRange = []

      if(this.listQuery.date) {
        this.listQuery.date.forEach(item => {
          let str = '' + item
          if(str.indexOf('-') === -1) {
            item = parseTime(item, '{y}-{m}-{d}')
          }
          dateRange.push(item)
        })
        this.listQuery.date = dateRange
      }
      if(this.deptId.length) {
        this.listQuery.deptId = this.deptId[this.deptId.length - 1]
      }
      if(!this.listQuery.status.length) { // 若是未选status，而是选了大类状态transcStep，传大类
        this.listQuery.status.push(this.transcStep)
      } else if(this.listQuery.status.length > 1) {
        this.listQuery.status.forEach((item, index) => {
          if(item === '10' || item === '20' || item === '30') {
            this.listQuery.status.splice(index, 1)
          }
        })
      }
      
      this.listQuery.orderByField = 'create_time'
      this.listQuery.isAsc = false

      Bus.$emit('searchTransc', this.listQuery)
    },
    resetFilter() { // 重置搜索条件
      this.listQuery = {
        page: 1,
        limit: 20,
        productName: '',
        clientName: '',
        email: '',
        appointmentCode: '',
        status: [],
        refundStatus: [],
        deptId: '',
        date: [],
        orderByField: 'create_time',
        isAsc: false
      },
      // this.entryDate = []
      this.deptId = []
      this.transcStep = ''
      // this.handleFilter()
      Bus.$emit('searchTransc', this.listQuery)
    },
    fetchList() {
      fetchProductTypeList().then(res => { // 获取产品类型
        this.productTypes = res.data
      })
    },
    changeTransc(val) {
      this.listQuery.status = []
      // this.status = val
      console.log(val)
    },
    handleDept() { // 获取部门
      fetchDeptTree()
        .then(response => {
          this.treeDeptData = response.data
        })
    }
  }
}
</script>

<style lang="scss" scoped>
@import "src/styles/mixin.scss";

.btn-padding {
  @include padding;
}
.el-form-item__content:focus,
.el-input:focus {
  border: 1px solid #00C1DF;
  border-radius: 4px;
}
.el-input.is-active .el-input__inner, .el-input__inner:focus {
    border-color: #00C1DF;
    outline: 0;
}
.query-color {
  white-space: nowrap;
  min-width: 85px;
  padding: 0;
  height: 40px;
  line-height: 40px;
  text-align: center;
  vertical-align: center;
}
.query-color {
  @include mainColor;
}
</style>


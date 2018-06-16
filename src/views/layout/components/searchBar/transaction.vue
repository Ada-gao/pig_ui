<template>
  <div class="filter-container">
    <el-form label-position="right" label-width="100px">
      <el-row :gutter="20">
        <el-col :sm="10" :lg="8" v-if="searchName">
          <el-form-item label="产品名称">
            <el-input
            placeholder="请输入产品名称/简称"
            v-model="listQuery.name">
          </el-input>
          </el-form-item>
        </el-col>
        <el-col :sm="10" :lg="8" v-if="searchName">
          <el-form-item label="客户">
            <el-input
            placeholder="请输入客户姓名"
            v-model="listQuery.clientName">
          </el-input>
          </el-form-item>
        </el-col>
        <el-col :sm="3" :lg="3"
          class="query-color"
          style="text-align: right; float: right; cursor: pointer">
          <div @click="isSpread = !isSpread">
            <span v-show="isSpread">收起搜索条件</span>
            <span v-show="!isSpread">展开搜索条件</span>
          </div>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <el-col :sm="10" :lg="8" v-if="searchName">
          <el-form-item label="理财师">
            <el-input
            placeholder="请输入理财师邮箱前缀"
            v-model="listQuery.name">
          </el-input>
          </el-form-item>
        </el-col>
        <el-col :sm="10" :lg="8" v-if="searchClientName">
          <el-form-item label="预约编号">
            <el-input
            placeholder="请输入预约编号"
            v-model="listQuery.clientName">
          </el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :sm="12" :lg="8" v-show="isSpread & searchDate">
          <el-form-item label="日期">
              <el-date-picker
                v-model="entryDate"
                type="daterange"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                :default-time="['00:00:00', '23:59:59']">
              </el-date-picker>
            </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :sm="12" :lg="8" style="white-space: nowrap" v-show="isSpread & searchTranscStatus">
          <el-form-item label="订单状态">
             <el-radio-group v-model="listQuery.transcStatus" @change="changeTransc">
              <el-radio-button v-for="item in transcStatus" :label="item.value" :key="item.value">{{item.label}}</el-radio-button>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :sm="12" :lg="8" style="white-space: nowrap" v-show="isSpread & searchAppoint & status == 10">
          <el-form-item label="预约状态">
             <el-checkbox-group v-model="listQuery.productTypeIds">
              <el-checkbox-button v-for="item in appointStatus" :label="item.value" :key="item.value">{{item.label}}</el-checkbox-button>
            </el-checkbox-group>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :sm="12" :lg="8" style="white-space: nowrap" v-show="isSpread & searchPayment & status == 20">
          <el-form-item label="打款状态">
             <el-checkbox-group v-model="listQuery.productTypeIds">
              <el-checkbox-button v-for="item in paymentStatus" :label="item.value" :key="item.value">{{item.label}}</el-checkbox-button>
            </el-checkbox-group>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :sm="12" :lg="8" style="white-space: nowrap" v-show="isSpread & searchContract & status == 30">
          <el-form-item label="合同状态">
             <el-checkbox-group v-model="listQuery.productTypeIds">
              <el-checkbox-button v-for="item in contractStatus" :label="item.value" :key="item.value">{{item.label}}</el-checkbox-button>
            </el-checkbox-group>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :sm="12" :lg="8" style="white-space: nowrap" v-show="isSpread & searchRefund">
          <el-form-item label="退款状态">
            <el-checkbox-group v-model="listQuery.productStatus">
            <el-checkbox-button v-for="status in refundStatus" :label="status.value" :key="status.value">{{status.label}}</el-checkbox-button>
          </el-checkbox-group>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :sm="12" :lg="8" style="white-space: nowrap" v-show="isSpread & searchDept">
          <el-form-item label="所属部门">
            <el-checkbox-group v-model="listQuery.productStatus">
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

export default {
  props: {
    searchName: {
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
        transcStatus: [],
        productTypeIds: []
      },
      defaultProps: {
        children: 'children',
        label: 'name',
        value: 'id'
      },
      defaultProps2: {
        value: 'label'
      },
      // city: [],
      productTypes: [],
      entryDate: [],
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
    this.fetchList()
  },
  methods: {
    handleFilter() { // 搜索
      this.listQuery.page = 1

      this.listQuery.orderByField = 'create_time'
      this.listQuery.isAsc = false

      Bus.$emit('searchTransc', this.listQuery)
    },
    resetFilter() { // 重置搜索条件
      this.listQuery = {
        page: 1,
        limit: 20,
        name: '',
        productTypeIds: '',
        productStatus: ''
      },
      this.entryDate = []
      this.handleFilter()
    },
    fetchList() {

      fetchProductTypeList().then(res => { // 获取产品类型
        this.productTypes = res.data
        // this.list.forEach(item => {
        //   item.productTypeId = transformText(this.productTypes, item.productTypeId)
        //   item.productStatus = transformText(this.productStatus, item.productStatus)
        // })
        // this.appointmentStatus.forEach(item => {
        //   // console.log(item.indexOf('100'))
        //   if(item.value.indexOf('100') != -1) {
        //     this.appointList.push(item)
        //   } else if(item.value.indexOf('200') != -1) {
        //     this.transferList.push(item)
        //   } else if(item.value.indexOf('300') != -1) {
        //     this.contractList.push(item)
        //   }
        // })
      })
    },
    changeTransc(val) {
      this.listQuery.productTypeIds = []
      this.status = val
      console.log(this.status)
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


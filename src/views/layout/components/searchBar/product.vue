<template>
  <div class="filter-container">
    <el-form label-position="right" label-width="100px">
      <el-row :gutter="20">
        <el-col :sm="12" :lg="8" v-if="searchName">
          <el-form-item label="产品名称">
            <el-input
            placeholder="请输入产品名称/简称"
            v-model="listQuery.name">
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
        <el-col :sm="12" :lg="8" style="white-space: nowrap" v-if="isSpread & searchProductType">
          <el-form-item label="产品分类">
             <el-checkbox-group v-model="listQuery.productTypeIds">
              <el-checkbox-button v-for="item in productTypes" :label="item.productTypeId" :key="item.productTypeId">{{item.name}}</el-checkbox-button>
            </el-checkbox-group>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :sm="12" :lg="8" style="white-space: nowrap" v-if="isSpread & searchProductStatus">
          <el-form-item label="产品状态">
            <el-checkbox-group v-model="listQuery.productStatus">
            <el-checkbox-button v-for="status in productStatus" :label="status.value" :key="status.value">{{status.label}}</el-checkbox-button>
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
    searchDate: {
      default: true
    },
    searchProductType: {
      default: true
    },
    searchProductStatus: {
      default: true
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
        // name: '',
        productTypeIds: [],
        productStatus: [],
        annualizedReturns: [],
        isFloat: null
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
      isSpread: false
    }
  },
  computed: {
    ...mapGetters([
      'productStatus'
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
      console.log('发送查询条件')
      Bus.$emit('searchProduct', this.listQuery)
    },
    resetFilter() { // 重置搜索条件
      this.listQuery = {
        page: 1,
        limit: 20,
        name: '',
        productTypeIds: [],
        // productStatus: []
      },
      this.entryDate = []
      // this.handleFilter()
      Bus.$emit('searchProduct', this.listQuery)
    },
    fetchList() {
      fetchProductTypeList().then(res => { // 获取产品类型
        this.productTypes = res.data
        // this.list.forEach(item => {
        //   item.productTypeId = transformText(this.productTypes, item.productTypeId)
        //   item.productStatus = transformText(this.productStatus, item.productStatus)
        // })
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

